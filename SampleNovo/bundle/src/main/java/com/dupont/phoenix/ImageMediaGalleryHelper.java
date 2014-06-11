package com.dupont.phoenix;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;

public final class ImageMediaGalleryHelper {
	private static final Logger logger = LoggerFactory.getLogger(ImageMediaGalleryHelper.class);
	private Resource resource;
	private ValueMap properties;
	private ResourceResolver resolver;

	public ImageMediaGalleryHelper(Resource resource) {
		this.resource = resource;
		this.properties = resource.adaptTo(ValueMap.class);
		this.resolver = resource.getResourceResolver();
		logger.info("Image Media Gallery Helper Constructor");
	}

	public List<HashMap<String, Object>> getImageGalleries() {
		String[] selectedGallery = null;
		List<HashMap<String, Object>> galleryList = null;
		if (null!=properties && null!=properties.get("selectedGallery", null)) {
			selectedGallery = properties.get("selectedGallery", String[].class);
		}
		if (selectedGallery != null) {
			
			galleryList = new ArrayList<HashMap<String, Object>>();
			for (String imagegallery : selectedGallery) {
			
				Resource rootRes = this.resource.getResourceResolver().getResource(imagegallery);
			    Page rootPage = rootRes == null ? null : (Page) rootRes.adaptTo(Page.class);
				if(rootPage != null) 
				{
				String title = rootPage.getNavigationTitle();
				if (title == null) {
					title = rootPage.getTitle();
				}
				if (title == null) {
					title = rootPage.getName();
				}
				title = StringEscapeUtils.escapeHtml(title);
				
				HashMap<String, Object> map = new HashMap<String, Object>();
				map.put("title", title);
				map.put("images", getImages(imagegallery));
				galleryList.add(map);
				}
			}
		}
		return galleryList;
	}
	public List<Resource> getImages(String imagegallery)
	{
		List<Resource> imagesList = null;
		String path = imagegallery + "/" + "jcr:content";
		Resource rootRes = this.resource.getResourceResolver().getResource(path);
		if(rootRes != null) 
		{
		Node pageNode = rootRes.adaptTo(Node.class);
		try {
			if (pageNode != null && pageNode.hasNode("imageset")) {
				imagesList = new ArrayList<Resource>();
				Node node = pageNode.getNode("imageset");
				NodeIterator itr = node != null && node.hasNodes() ? node.getNodes() : null;
				if (itr != null) {
					while (itr.hasNext()) {
						Node imageNode = itr.nextNode();
						Resource imageResource = resolver.getResource(imageNode.getPath());
						if(imageResource!=null) {
							ValueMap imageProperties = imageResource.adaptTo(ValueMap.class);
							if(imageProperties!=null && imageProperties.containsKey("fileReference") && imageProperties.get("fileReference",String.class)!=null) {
								imagesList.add(imageResource);
							}
						}
					}
				}
			}
		} catch (RepositoryException repositoryException) {
			logger.error("Exception -", repositoryException);
		}
		}
		return imagesList;	
	}
}