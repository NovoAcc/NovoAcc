package com.dupont.phoenix.workflow.impl.process;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMException;
import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowService;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowData;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferencePolicy;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.jcr.resource.JcrResourceConstants;
import org.osgi.framework.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import com.dupont.phoenix.workflow.impl.process.MediaMigrationUtils;
import com.dupont.phoenix.workflow.impl.process.MigrationUtils;

@Component
@Service
@Properties({
		@Property(name = Constants.SERVICE_DESCRIPTION, value = "Upgrade Pages into Responsive Pages"),
		@Property(name = Constants.SERVICE_VENDOR, value = "DuPont"),
		@Property(name = "process.label", value = "Responsive Page Upgrade Process") })
public class ResponsivePageUpgrade implements WorkflowProcess {

	private static final Logger log = LoggerFactory.getLogger(ResponsivePageUpgrade.class);
	private static final String TYPE_JCR_PATH = "JCR_PATH";

	@Reference(policy = ReferencePolicy.STATIC)
	private ResourceResolverFactory factory;

	@Reference(policy = ReferencePolicy.STATIC)
	private WorkflowService workflowService;

	public void execute(WorkItem item, WorkflowSession session, MetaDataMap args)
			throws WorkflowException {
		WorkflowData workflowData = item.getWorkflowData();
		if (workflowData.getPayloadType().equals(TYPE_JCR_PATH)) {
			String path = workflowData.getPayload() != null ? workflowData.getPayload().toString() : null;
			final String excludeContentTypes = MigrationUtils.getStringArgByName("excludeContentTypes", args);
			final Boolean upgradePageAndSubPages = MigrationUtils.getBooleanArgByName("upgradePageAndSubPages", args);
			final String upgradeType = MigrationUtils.getStringArgByName("upgradeType", args);
			final Boolean upgradeMediaComponents = upgradeType!=null && "media".equals(upgradeType) ? true : false;
			String resTypeName = MigrationUtils.getStringArgByName("resTypeName", args);
			resTypeName = "responsive";
			log.info(String.format("Path:%s ,excludeContentTypes:%s, upgradePageAndSubPages:%s upgradeType:%s",
					path, excludeContentTypes, upgradePageAndSubPages, upgradeType));
			try {
				final Map<String, Object> authInfo = new HashMap<String, Object>();
				authInfo.put(JcrResourceConstants.AUTHENTICATION_INFO_SESSION,session.getSession());
				final ResourceResolver resolver = factory.getResourceResolver(authInfo);
				if (path != null && resTypeName != null && !"not set".equals(resTypeName)) {
					handlePayload(resolver, session, path, upgradePageAndSubPages, excludeContentTypes, 
							resTypeName, upgradeMediaComponents, args);
				}
			} catch (Exception e) {
				log.error(e.getMessage(), e);
			}
		}
	}

	private void handlePayload(final ResourceResolver resolve, WorkflowSession session, String payload, Boolean upgradeAllFlag,
			String excludeCntTypes, String resTypeName, boolean upgradeMediaComponents, MetaDataMap args) throws WorkflowException,
			PathNotFoundException, RepositoryException, WCMException, PersistenceException {
		Node node = session.getSession().getNode(payload);
		if (node != null) {
			handleNode(resolve, session, node, upgradeAllFlag, excludeCntTypes, resTypeName, upgradeMediaComponents, args);
		}
	}

	private void handleNode(final ResourceResolver resolve, WorkflowSession session, final Node node, Boolean upgradeAllFlag,
			String excludeCntTypes, String resTypeName, boolean upgradeMediaComponents, MetaDataMap args) throws WorkflowException,
			RepositoryException, WCMException, PersistenceException {
		if (node.hasNode("jcr:content")) {
			final PageManager pm = resolve.adaptTo(PageManager.class);
			final Page p = pm.getPage(node.getPath());
			if (p != null && p.hasContent()) {
				log.info("upgradeMediaComponents:"+upgradeMediaComponents);
				if(upgradeMediaComponents) {
					MediaMigrationUtils.upgradeMediaComponents(p, node, session, args);
				} else {
					String templatePath = p.getTemplate()!=null?p.getTemplate().getPath():null;
					if(templatePath!=null) {
						Node cntNode = node.getNode(JcrConstants.JCR_CONTENT);
						boolean saveNodeProps = false;
						if (ResponsiveUpgradeConstants.RESPONSIVE_TEMPLATES.contains(templatePath) &&
								MigrationUtils.isValidNode(p, cntNode)) {
							pm.createRevision(p);
							templatePath = templatePath.replace("/templates/", "/templates/responsive/");
							cntNode.setProperty("cq:template",templatePath);
							saveNodeProps = true;
						} else {
							log.info("Page is not valid for upgrade:"+p.getPath());
						}
						//Update Resource Types to Responsive Resource Types..
						if(templatePath.contains("/templates/responsive/")) {
							boolean save = updateResTypes(cntNode, session, resTypeName);
							if(save) {
								saveNodeProps = true;
							}
						}
						if(saveNodeProps) {
							session.getSession().save();
						}
					}
				}
			}
		}
		if (upgradeAllFlag && node.hasNodes()) {
			Iterator<Node> nodes = node.getNodes();
			while (nodes.hasNext()) {
				handleNode(resolve, session, nodes.next(), upgradeAllFlag, excludeCntTypes, resTypeName, upgradeMediaComponents, args);
			}
		}
	}

	private boolean updateResTypes(final Node node, WorkflowSession session, final String resTypeName)
			throws WorkflowException, RepositoryException {
		boolean saveUpdates = false;
		for(int i=0; i < ResponsiveUpgradeConstants.RES_TYPE_PROPS.length; i++) {
			String resTypeProp = ResponsiveUpgradeConstants.RES_TYPE_PROPS[i];
			if (node!=null && node.hasProperty(resTypeProp)) {
				String resType = node.getProperty(resTypeProp).getString();
				if(resType!=null && resType.startsWith("/apps/")) {
					resType = resType.replaceFirst("/apps/", "");
				}
				if (null!=resType && resType.startsWith("dupont/phoenix/components") && ResponsiveUpgradeConstants.RESPONSIVE_RES_TYPES.contains(resType)) {
					node.setProperty(resTypeProp, resType.replace("/components/", "/components/responsive/"));
					saveUpdates = true;
				}
			}
			if (null!=node && node.hasNodes()) {
				Iterator<Node> nodes = node.getNodes();
				while (nodes.hasNext()) {
					updateResTypes(nodes.next(), session, resTypeName);
				}
			}
		}
		return saveUpdates;
	}

	public WorkflowService getWorkflowService() {
		return workflowService;
	}
}
