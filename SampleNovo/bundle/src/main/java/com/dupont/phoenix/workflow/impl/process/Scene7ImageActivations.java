package com.dupont.phoenix.workflow.impl.process;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;

import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferencePolicy;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.jcr.resource.JcrResourceConstants;
import org.osgi.framework.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.granite.crypto.CryptoSupport;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.scene7.Scene7Service;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.foundation.Image;
import com.day.cq.wcm.webservicesupport.Configuration;
import com.day.cq.wcm.webservicesupport.ConfigurationManager;
import com.day.cq.workflow.WorkflowException;
import com.day.cq.workflow.WorkflowService;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowData;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;
import com.dupont.phoenix.Global;

@Component
@Service
@Properties({
		@Property(name = Constants.SERVICE_DESCRIPTION, value = "Publish Images to Scene7"),
		@Property(name = Constants.SERVICE_VENDOR, value = "DuPont"),
		@Property(name = "process.label", value = "Publish Images to Scene7") })
public class Scene7ImageActivations implements WorkflowProcess {

	private static final Logger log = LoggerFactory.getLogger(Scene7ImageActivations.class);
	private static final String TYPE_JCR_PATH = "JCR_PATH";
	public static final Set<String> VALID_CONTENT_TYPES = new HashSet<String>();

	static {
		VALID_CONTENT_TYPES.add("productcatgroup");//1
		VALID_CONTENT_TYPES.add("productcat");//2
		VALID_CONTENT_TYPES.add("brand");//3
		VALID_CONTENT_TYPES.add("subbrand");//4
		VALID_CONTENT_TYPES.add("industry");//5
		VALID_CONTENT_TYPES.add("subindustry");//6
		VALID_CONTENT_TYPES.add("product");//7
		VALID_CONTENT_TYPES.add("subproduct");//8
		VALID_CONTENT_TYPES.add("usesapplication");//9
		VALID_CONTENT_TYPES.add("article");//10
		VALID_CONTENT_TYPES.add("event");//11
		VALID_CONTENT_TYPES.add("casestudy");//12
		VALID_CONTENT_TYPES.add("pressrelease");//13
		VALID_CONTENT_TYPES.add("video");//14
		VALID_CONTENT_TYPES.add("newsletter");//15
		VALID_CONTENT_TYPES.add("corporatecontent");//16
		VALID_CONTENT_TYPES.add("corporatesubcontent");//17
		VALID_CONTENT_TYPES.add("corporatesubsubcontent");//18
		VALID_CONTENT_TYPES.add("corporatecontentdetail");//19
		VALID_CONTENT_TYPES.add("corporatecontentvideodetail");//20
	}

	@Reference(policy = ReferencePolicy.STATIC)
	private ResourceResolverFactory factory;

//	@Reference(policy = ReferencePolicy.STATIC)
//	private WorkflowService workflowService;

	@Reference(policy = ReferencePolicy.STATIC)
	private ConfigurationManager cfgMgr;

	@Reference(policy = ReferencePolicy.STATIC)
	private Scene7Service scene7;

	@Reference(policy = ReferencePolicy.STATIC)
	private CryptoSupport cryptoSupport;

	public void execute(WorkItem item, WorkflowSession session, MetaDataMap args)
			throws WorkflowException {
		WorkflowData workflowData = item.getWorkflowData();
		if (workflowData.getPayloadType().equals(TYPE_JCR_PATH)) {
			String path = workflowData.getPayload() != null ? workflowData.getPayload().toString() : null;
			final Boolean redoActivations = getBooleanArgByName("redoActivations", args);
			final Boolean activatePageAndSubPages = getBooleanArgByName("activatePageAndSubPages", args);
			final String configPath = this.getStringArgByName("configPath", args);
			log.info(String.format("Scene7: Path:%s ,redoActivations:%s, activatePageAndSubPages:%s",
					path, redoActivations, activatePageAndSubPages));
			try {
				final Map<String, Object> authInfo = new HashMap<String, Object>();
				authInfo.put(JcrResourceConstants.AUTHENTICATION_INFO_SESSION, session.getSession());
				final ResourceResolver resolver = factory.getResourceResolver(authInfo);
				if (path != null && configPath!=null && !"not set".equals(configPath)) {					
		            Configuration config = null;
		            if (cfgMgr != null) {
		            	//"/etc/cloudservices/scene7/my-scene7-config"
		                config = cfgMgr.getConfiguration(configPath);
						handlePayload(resolver, session, path, activatePageAndSubPages, redoActivations, config);
		            }		            
				}
			} catch (Exception e) {
				log.error("Exception :",e);
			}
		}
	}

	private Boolean getBooleanArgByName(String argName, MetaDataMap args) {
		return Boolean.valueOf(args.get(argName,"false"));
	}

	private String getStringArgByName(String argName, MetaDataMap args) {
		return args.get(argName,"not set");
	}

	private void handlePayload(final ResourceResolver resolve,
			WorkflowSession session, String payload, Boolean activateAllFlag,
			Boolean redoActivations, Configuration config) throws WorkflowException,
			PathNotFoundException, RepositoryException {
		Node node = session.getSession().getNode(payload);
		if (node != null) {
			handleNode(resolve, session, node, activateAllFlag, redoActivations, config);
		}
	}

	private void handleNode(final ResourceResolver resolve,
			WorkflowSession session, final Node node, Boolean activateAllFlag,
			Boolean redoActivations, Configuration config) throws WorkflowException,
			RepositoryException {
		if (node.hasNode("jcr:content")) {
			final PageManager pm = resolve.adaptTo(PageManager.class);
			final Page p = pm.getPage(node.getPath());
			if (p != null && p.hasContent()) {
				String contentType = p.getProperties().get("contentType",String.class);
				if (Scene7ImageActivations.VALID_CONTENT_TYPES.contains(contentType)) {
					Resource res = p.getContentResource();
					Image image = new Image(res, "thumbnail");
					publishImage(image, resolve, redoActivations, config);
					Resource bodyCopy = resolve.getResource(res, "bodycopy");
					publishInlineCalloutImages(bodyCopy, resolve, session, redoActivations, config);
					Resource introBodyText = resolve.getResource(res, "introbodytext");
					publishInlineCalloutImages(introBodyText, resolve, session, redoActivations, config);
				}
			}
		}
		if (activateAllFlag && node.hasNodes()) {
			Iterator<Node> nodes = node.getNodes();
			while (nodes.hasNext()) {
				handleNode(resolve, session, nodes.next(), activateAllFlag,redoActivations, config);
			}
		}
	}
	
	private void publishInlineCalloutImages(Resource copyRes, ResourceResolver resolve,
			WorkflowSession wfSession, Boolean redoActivations, Configuration config) throws WorkflowException {
		if(copyRes!=null) {
			Iterator<Resource> childrens = copyRes.listChildren();
			while(childrens.hasNext()) {
				Resource child = childrens.next();
				if(child!=null && child.isResourceType("dupont/phoenix/components/inlinecallout")){
					ValueMap props = child.adaptTo(ValueMap.class);
					final String type = Global.getStringPropValue(props, "type");
					if(type!=null && "children".equals(type)) {
						Image image = new Image(child, "image");
						if(image!=null && image.getFileReference()!=null && image.getFileReference().length()>0) {
							publishImage(image, resolve, redoActivations,config);
						}
					}
				}
			}
		}		
	}

	private void publishImage(Image image, ResourceResolver resolve, Boolean redoActivations, Configuration config)
			throws WorkflowException {
		final String fileReference = image != null ? image.getFileReference() : null;
		if (fileReference != null && fileReference.length() > 0) {
			Resource imageResource = resolve.getResource(fileReference);
			Asset asset = imageResource != null ? imageResource.adaptTo(Asset.class) : null;
			if (asset != null && (redoActivations || publishToScene7(asset))) {
				executeScene7Workflow(image, config, resolve);
			}
		}
	}

	private boolean publishToScene7(Asset asset) {
		if (asset != null) {
			String id = asset.getMetadataValue("dam:scene7ID");
			String publishStatus = (!("".equals(asset.getMetadataValue("dam:scene7FileStatus"))) ? asset
					.getMetadataValue("dam:scene7FileStatus")
					: "PublishComplete");
			if ("".equals(id) || !"PublishComplete".equals(publishStatus)) {
				log.info("Asset is not published to scene7:{}",asset.getPath());
				return true;
			}
		}
		return false;
	}

	private void executeScene7Workflow(Image image, Configuration config, ResourceResolver resolve)
			throws WorkflowException {
		uploadFile(config, image.getFileReference(), resolve);
		/*
		try {
			Thread.sleep(5000);//wait for 5 seconds
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		*/
	}
	
	private void uploadFile(Configuration config, String path, ResourceResolver resolve) {
        try {        	
            if (config != null) {
                /* Get configuration */
                final String email = config.getInherited("email", "");
                String password = config.getInherited("password", "");
                final String region = config.getInherited("region", "");
                final String userHandle = config.getInherited("userHandle", "");
                final String companyHandle = config.getInherited("companyHandle", "");
                final String rootPath = config.getInherited("rootPath", "");
                                        
                /* validate data */
                if (StringUtils.isNotEmpty(email) && StringUtils.isNotEmpty(password) && StringUtils.isNotEmpty(region) && StringUtils.isNotEmpty(userHandle) && StringUtils.isNotEmpty(companyHandle) && StringUtils.isNotEmpty(rootPath)) {                    
                    if (scene7 != null) {
                    	//unprotect password
                    	if (cryptoSupport!=null && cryptoSupport.isProtected(password)) {
                    		password = cryptoSupport.unprotect(password);
                    	}
                        String result = scene7.uploadFile(path, email, password, region, userHandle, companyHandle, rootPath, resolve);              
                        if (StringUtils.isNotEmpty(result) && "success".equalsIgnoreCase(result)) {
                            log.info("file " + path + " uploaded successfully to scene7");
                        } else {
                            log.error(result);
                        }                        
                    }
                } else {
                    log.warn("Upload to Scene7 not executed due to missing parameters");
                }
        
            } else {
                log.warn("Configuration could not be found");
            }
        } catch(Exception err) {
            log.error("Publishing to Scene7 failed:{}" , err);
        }		
	}
}
