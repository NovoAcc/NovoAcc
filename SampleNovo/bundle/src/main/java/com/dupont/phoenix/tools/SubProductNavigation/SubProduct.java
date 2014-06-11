package com.dupont.phoenix.tools.SubProductNavigation;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.PathNotFoundException;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.Value;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.tagging.TagManager;
import com.dupont.phoenix.commons.Scene7Image;

public class SubProduct {
	private String name;
	private String url;
	private long sortOrder;
	private Scene7Image thumbnail;
	private String description;
	private String tags;
	private Node jcrContent;
	private ResourceResolver resourceResolver;
	private static final Logger logger = LoggerFactory
			.getLogger(SubProduct.class);

	public SubProduct(Node subproduct, ResourceResolver resourceResolver, long position){
		try {
			this.name = subproduct.getName();
			this.resourceResolver = resourceResolver;
			this.jcrContent = subproduct.getNode("jcr:content");
			this.thumbnail = initThumbnail();
			this.sortOrder = position;
			this.tags = this.getTagGroup();
			this.description = this.jcrContent.getProperty("jcr:description").getString();
			this.url = subproduct.getPath() + ".html";			

		}catch(RepositoryException ex){
			logger.error("RepositoryException in SubProduct: ", ex);
		}

	}
	
	private String getTagGroup() throws PathNotFoundException, RepositoryException{
		
		StringBuilder tagsValue = new StringBuilder(StringUtils.EMPTY);
		
		Property references = this.jcrContent.getProperty("cq:tags");  
		Value[] values = references.getValues();
		for(Value val : values){
			TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
			String className = (tagManager.resolve(val.getString())).getName();
			tagsValue.append(className).append(" ");
		}		
		return tagsValue.toString();		
	}
	
	private Scene7Image initThumbnail() throws RepositoryException{
		String imagePath = "";
		Resource imageRes = null;

		for (NodeIterator ni = this.jcrContent.getNodes(); ni.hasNext(); ) {
			Node n = ni.nextNode();
			String resourceType = n.getProperty("sling:resourceType").getString();
			if("foundation/components/image".equals(resourceType)){
				imagePath = n.getProperty("fileReference").getString();
				imageRes = this.resourceResolver.getResource(imagePath);
				break;
			}
		}
		Scene7Image img = null;
		if(imageRes != null){
			img = new Scene7Image(imageRes);
		}
		return img;
	}
	
	public String toString() {
		StringBuilder result = new StringBuilder();
		result.append("Name: ");
		result.append(name);
		result.append("\nUrl: ");
		result.append(url);
		result.append("\nSort Order: ");
		result.append(sortOrder);
		result.append("\nHas image: ");
		result.append(this.thumbnail != null);


		return result.toString();
	}

	public String getName() {
		return name;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public long getSortOrder() {
		return sortOrder;
	}
	public Scene7Image getThumbnail(){
		return thumbnail;
	}
	public void setSortOrder(long sortOrder) {
		this.sortOrder = sortOrder;
	}
	public String getColorDescription() {
		return description;
	}
	public void setColorDescription(String colorDescription) {
		this.description = colorDescription;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setThumbnail(Scene7Image thumbnail) {
		this.thumbnail = thumbnail;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getTags() {
		return tags;
	}
	public void setTags(String tags) {
		this.tags = tags;
	}


}