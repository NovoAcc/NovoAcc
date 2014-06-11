package com.dupont.phoenix.msm.actions;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.jcr.Node;
import javax.jcr.PropertyIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Value;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.msm.api.LiveRelationship;
import com.day.cq.wcm.msm.api.LiveRelationshipManager;
import com.day.cq.wcm.msm.api.RolloutManager;
import com.dupont.phoenix.Global;

public class InternalReferencesUtils {

    private InternalReferencesUtils() {
        // do nothing
    }

    private static final Logger log = LoggerFactory.getLogger(InternalReferencesUtils.class);
    private final static Set<String> excludedProperties = new HashSet<String>();
    private final static Set<String> excludedNodes = new HashSet<String>();

    static {
        excludedProperties.add("cq:master");
        excludedProperties.add("contentType");
        excludedProperties.add("cq:lastModifiedBy");
        excludedProperties.add("jcr:lastModifiedBy");
        excludedProperties.add("cq:template");
        excludedProperties.add("jcr:createdBy");
        excludedProperties.add("jcr:mixinTypes");
        excludedProperties.add("jcr:title");
        excludedProperties.add("jcr:primaryType");
        excludedProperties.add("jcr:uuid");
        excludedProperties.add("sling:resourceType");
        excludedProperties.add("cq:lastRolledoutBy");
        excludedProperties.add("cq:imageRotate");
        excludedProperties.add("cq:imageCrop");

        excludedNodes.add("viewallcontent");
        excludedNodes.add("cq:LiveSyncConfig");
    }


    private static Collection<String> adjustInternalReferences(ResourceResolver resolver, Node node, Page master,
                                                               Page slave, Set<String> excludedProperties) throws RepositoryException, ClassNotFoundException {
        Set<String> adjusted = new HashSet<String>();
        if (null==node){
            return adjusted;
        }
        log.info("About to update node properties for:" + node.getPath());
        PropertyIterator iter = node.hasProperties() ? node.getProperties() : null;
        if (null==iter){
            return adjusted;
        }
        while (iter.hasNext()) {
            javax.jcr.Property p = iter.nextProperty();
            if (((p.getType() == 7) && (!excludedProperties.contains(p.getName())))
                    || ((!InternalReferencesUtils.excludedProperties.contains(p.getName())) && (p.getType() == 1))) {
                if (p.getDefinition().isMultiple()) {
                    Value[] values = p.getValues();
                    boolean modified = false;
                    for (int i = 0; i < values.length; i++) {
                        String value = InternalReferencesUtils.rewrite(resolver, values[i].getString(),
                                master, slave);
                        if (value != null) {
                            values[i] = node.getSession().getValueFactory()
                                    .createValue(value, p.getType());
                            modified = true;
                        }
                    }
                    if (modified) {
                        p.setValue(values);
                        adjusted.add(p.getPath());
                        log.info("Adjusted property {}.", p.getPath());
                    }
                } else {
                    String value = InternalReferencesUtils.rewrite(resolver, p.getString(), master,
                            slave);
                    if (value != null) {
                        p.setValue(value);
                        adjusted.add(p.getPath());
                        log.info("Adjusted property {}.", p.getPath());
                    }
                }
            }
        }
        return adjusted;
    }

    private static String rewriteItoE(ResourceResolver resolver, String value,
                                      Page master, Page slave) {
        String internalSiteRootPath = master.getAbsoluteParent(1).getPath();
        String slaveSiteRootPath = slave.getAbsoluteParent(1).getPath();
        String from = master.getPath();
        String to = slave.getPath();
        if (value.equals(from)){
            return to;
        }
        if ((value.startsWith(from + "#"))
                || (value.startsWith(from + ".html"))) {
            return to + value.substring(from.length());
        }
        if (value.startsWith(from + "/")) {
            return to + value.substring(from.length());
        }
        if (StringUtils.startsWith(value, internalSiteRootPath)) {
            return InternalReferencesUtils.getDestRelativeLink(resolver, value, slaveSiteRootPath);
        }
        Pattern pattern = InternalReferencesUtils.getReplacementPattern(internalSiteRootPath);
        Matcher m = pattern.matcher(value);
        StringBuffer ret = null;
        while (m.find()) {
            String relativeResPath = m.group(2);
            String toPath = InternalReferencesUtils.getDestRelativeLink(resolver, relativeResPath,
                    slaveSiteRootPath);
            String repl = "$1" + toPath + "$3";
            if (ret == null) {
                ret = new StringBuffer();
            }
            m.appendReplacement(ret, repl);
        }
        if (ret == null) {
            return null;
        }
        m.appendTail(ret);
        return ret.toString();
    }

    private static String getDestRelativeLink(ResourceResolver resolver, String masterRelativeLinkPath, String slaveSiteRootPath) {
        String ret = String.format("@invalid-link%s", masterRelativeLinkPath);
        try {
            Resource relativeRes = resolver.getResource(masterRelativeLinkPath);
            if (relativeRes != null) {
                LiveRelationshipManager relationshipManager = resolver.adaptTo(LiveRelationshipManager.class);
                if (relationshipManager != null) {
                    PageManager pm = resolver.adaptTo(PageManager.class);
                    if(pm == null){
                        return ret;
                    }
                    Page relativePage = pm.getContainingPage(relativeRes);
                    if(relativePage == null) {
                        return ret;
                    }
                    Collection<LiveRelationship> liveRelationships = relationshipManager.getLiveRelationships(relativePage,
                            RolloutManager.Trigger.ROLLOUT, null, true);
                    if(liveRelationships == null){
                        return ret;
                    }
                    for (LiveRelationship relation : liveRelationships) {
                        final String relationTargetPath = relation.getTargetPath();
                        if (relationTargetPath.startsWith(slaveSiteRootPath)) {
                            Page relationTargetPage = pm.getContainingPage(relationTargetPath);
                            if (relationTargetPage != null) {
                                ret = relationTargetPage.getPath();
                            }
                            return ret;
                        }
                    }
                }
            }
            return ret;
        } catch (Exception e) {
            log.error("Exception :", e);
            return ret;
        }
    }

    private static String rewrite(ResourceResolver resolver, String value, Page master,
                                  Page slave) {
        String masterSitePath = master.getAbsoluteParent(1).getPath();
        String slaveSitePath = slave.getAbsoluteParent(1).getPath();
        boolean isItoIRollout = StringUtils.equalsIgnoreCase(masterSitePath,
                slaveSitePath);
        if (isItoIRollout) {
            return InternalReferencesUtils.rewriteItoI(value, master, slave);
        } else {
            return InternalReferencesUtils.rewriteItoE(resolver, value, master, slave);
        }
    }

    private static String rewriteItoI(String value, Page master, Page slave) {
        String ret = null;
        final String masterLangCode = StringUtils.lowerCase(String.format("/%s", Global.getLangCountryCode(master)));
        final String slaveLangCode = StringUtils.lowerCase(String.format("/%s", Global.getLangCountryCode(slave)));
        if (StringUtils.containsIgnoreCase(value, masterLangCode)) {
            ret = StringUtils.replace(value, masterLangCode, slaveLangCode);
        }
        if (ret == null) {
            return null;
        }
        return ret;
    }

    private static Pattern getReplacementPattern(String path) {
        return Pattern.compile("([\"'])(" + String.format("%s/.*?", path)+ ")([;.?#\"'])");
    }

    public static void updateRefrences(ResourceResolver resolver, Resource source, Resource target, LiveRelationship relation, boolean autoSave, boolean isResetRollout) {
        try {
            PageManager pm = resolver.adaptTo(PageManager.class);
            if(pm == null){
                return;
            }
            Page master = pm.getContainingPage(source);
            Page slave = pm.getContainingPage(target);
            if (slave == null || target == null){
                return;
            }
            Node node = target.adaptTo(Node.class);
            if(node == null){
                return;
            }
            final String nodeName = node.getName();
            if (!InternalReferencesUtils.excludedNodes.contains(nodeName)) {
                adjustInternalReferences(resolver, node, master, slave, excludedProperties);
            }
        } catch (RepositoryException re) {
            log.error("Error :", re);
        } catch (ClassNotFoundException cnfe) {
            log.error("Error :", cnfe);
        } catch(Exception e) {
            log.error("Error :",e);
        }
    }

    public static boolean updateRefrences(ResourceResolver resolver, Node source, Node target, LiveRelationship relation) {
        try {
            Page master=null;
            Page slave =null;
            if(null!=resolver){
                PageManager pm = resolver.adaptTo(PageManager.class);
                if(null!=pm && null!=source && null!=target){
                    master = pm.getContainingPage(resolver.getResource(source.getPath()));
                    slave = pm.getContainingPage(resolver.getResource(target.getPath()));
                }else{
                    return false;
                }
            }
            if (slave == null || target == null) {
                return false;
            }else{
                final String nodeName = target.getName();
                if (!InternalReferencesUtils.excludedNodes.contains(nodeName)) {
                    return updateRelativeLinks(resolver, target, master, slave, excludedProperties);

                }
            }
        } catch (RepositoryException re) {
            log.error("Exception :",re);
        } catch (ClassNotFoundException cnfe) {
            log.error("Exception :",cnfe);
        } catch(Exception e) {
            log.error("Exception :",e);
        }
        return false;
    }

   
	private static boolean updateRelativeLinks(ResourceResolver resolver, Node node, Page master,
			Page slave, Set<String> excludedProperties) throws RepositoryException, ClassNotFoundException {

        boolean valueModified = false;
        if (node == null){
			return false;
		}
		log.info("About to update node properties for:" + node.getPath());
		PropertyIterator iter = node.hasProperties() ? node.getProperties() : null;
		if (iter == null){
			return false;
		}
		while (iter.hasNext()) {
			javax.jcr.Property p = iter.nextProperty();
			if (((p.getType() == 7) && (!excludedProperties.contains(p.getName())))
					|| ((!InternalReferencesUtils.excludedProperties.contains(p.getName())) && (p.getType() == 1))) {
				if (p.getDefinition().isMultiple()) {
					Value[] values = p.getValues();
					boolean modified = false;
					for (int i = 0; i < values.length; i++) {
						String value = InternalReferencesUtils.rewrite(resolver, values[i].getString(),
								master, slave);
						if (value != null) {
							values[i] = node.getSession().getValueFactory()
									.createValue(value, p.getType());
							modified = true;
						}
					}
					if (modified) {
						p.setValue(values);
						valueModified = true;
					}
				} else {
					String value = InternalReferencesUtils.rewrite(resolver, p.getString(), master,
							slave);
					if (value != null) {
						p.setValue(value);
						valueModified = true;
					}
				}
			}
		}
		return valueModified;
	}
	
}
