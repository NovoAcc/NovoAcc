package com.dupont.phoenix.workflow.impl.process;

import java.util.Iterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.PropertyIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Value;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceUtil;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.workflow.metadata.MetaDataMap;

public class MigrationUtils {
	private static final Pattern IT_PATTERN = Pattern.compile("<(iframe|table)(\\s+.*?)?>", Pattern.CASE_INSENSITIVE);
	private static final Logger LOGGER = LoggerFactory.getLogger(MigrationUtils.class);
	private static final String OPENPAR_NODE = "openareapar";
	private static final String RESOURCE_TYPE = "/apps/%s";
	
	/*
	 * Private Constructor
	 */
	private MigrationUtils(){
		
	}

	//validate properties for iframe and table elements..
	public static boolean validElements(Node node, Pattern itPattern) throws RepositoryException {
		//log.info("checking elements for iframe/table...");
		PropertyIterator iter = node.hasProperties() ? node.getProperties() : null;
		if (iter == null)
		{
			return true;
		}
		while (iter.hasNext()) {
			javax.jcr.Property p = iter.nextProperty();
			//String or Name properties only....
			if ((p.getType() == 7) || (p.getType() == 1)) {
				Matcher matcher;
				if (p.getDefinition().isMultiple()) {
					Value[] values = p.getValues();
					for (int i = 0; i < values.length; i++) {
						String value = values[i].getString();
						if(value!=null) {
						    matcher = itPattern.matcher(value);
							if (matcher.find()) {								
								return false;
							}
						}
					}
				} else {
					String value = p.getString();
					if (value != null) {
						    matcher = itPattern.matcher(value);
							if (matcher.find()) {								
								return false;
							}
					}
				}
			}
		}
		return true;
	}
	
	public static boolean isValidNode(Page page, Node node) throws RepositoryException {
		boolean validNode = true;
		//check for open area parsys and see if it contains any components
		if (node == null)
			{
			return false;
			}
		Resource resource = page.getContentResource();
		if(node.hasNode(OPENPAR_NODE)) {
			Node openAreaPar = node.getNode(OPENPAR_NODE);
			//check for utility text component and section landing component
			if (openAreaPar!=null && openAreaPar.hasNodes()) {
				NodeIterator nodes = openAreaPar.getNodes();
				while(nodes.hasNext()) {
					Node child = nodes.nextNode();
					Resource childRes = resource.getResourceResolver().getResource(child.getPath());
					validNode = MigrationUtils.isResTypeOf(childRes, "dupont/phoenix/components/utilitytext") 
							|| MigrationUtils.isResTypeOf(childRes, "dupont/phoenix/components/sectionlanding");
					if(!validNode) {
						break;
					}
				}
			}
		}
		if(!validNode) {
			LOGGER.info("Open Area Parsys found with children not supported yet:"+node.getPath());
			return false;
		}
		//b. check for video gallery component
		//2. check properties for certain elements.
		//a. check for iframe element
		//b. check for table element
		validNode = validElements(node, MigrationUtils.IT_PATTERN);
		if(!validNode) {
			LOGGER.info("Contains either iframe or tabel elements:"+node.getPath());
			return false;
		}
		return validNode;
	}
	
	public static boolean isResTypeOf(final Resource resource, final String resType) {
		if(ResourceUtil.isA(resource, resType) || ResourceUtil.isA(resource, String.format(RESOURCE_TYPE,resType))) {
			return true;
		}
		return false;
	}

	public static boolean isNodeContainsResType(final Resource resource, final String resType) {
		final Iterator<Resource> children = resource.getResourceResolver().listChildren(resource);
		while (children.hasNext()) {
			final Resource child = children.next();
			if(ResourceUtil.isA(child, resType) || ResourceUtil.isA(child, String.format(RESOURCE_TYPE,resType))) {
				return true;
			} else {
				isNodeContainsResType(child, resType);
			}
		}
		return false;
	}

	public static Boolean getBooleanArgByName(String argName, MetaDataMap args) {
		//Boolean value = new Boolean(args.get(argName, "false"));
		return Boolean.valueOf(args.get(argName, "false"));
	}

	public static String getStringArgByName(String argName, MetaDataMap args) {
		return args.get(argName, "not set");
	}
}
