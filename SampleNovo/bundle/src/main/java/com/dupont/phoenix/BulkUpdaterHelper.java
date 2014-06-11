package com.dupont.phoenix;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.query.Query;

import org.apache.commons.lang.StringUtils;
import org.apache.jackrabbit.util.ISO9075;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;

public final class BulkUpdaterHelper {

	private static final Logger logger = LoggerFactory
			.getLogger(BulkUpdaterHelper.class);

	private Page page;
	private Resource resource;
	private List<Node> items;

	public BulkUpdaterHelper(final Page page, final Resource resource) {
		this.page = page;
		this.resource = resource;
	}


	public List<Node> getItems(String templatePath, String pagePath) {
		logger.info("get content items for:" + resource.getPath());
		Iterator<Resource> resIterator = findResources(templatePath, pagePath);
		this.items = processResources(resIterator);
		return items;
	}
	
	public List<Node> processResources (final Iterator<Resource> resIterator)
	{
		List<Node> nodeList = new ArrayList<Node>();
		
		while (resIterator.hasNext()) {
			Resource presource = (Resource) resIterator.next();
			Node node = presource.adaptTo(Node.class);
			nodeList.add(node);
		}
		return nodeList;
		
	}


	public String cleanPath(final String path) {
		final StringBuilder result = new StringBuilder().append(path);
		if (!path.startsWith("/")) {
			result.insert(0, '/');
		}
		if (path.endsWith("/")) {
			result.deleteCharAt(result.length() - 1);
		}
		return ISO9075.encodePath(result.toString());
	}

	public Iterator<Resource> findResources(String templatePath, String pagePath) {
		logger.info("find resources....");
		ResourceResolver resolver = resource.getResourceResolver();
		Iterator<Resource> resourceIterator = null;
		final String cleanedPath = cleanPath(pagePath);
		if (StringUtils.isNotBlank(cleanedPath)) {
			final StringBuilder queryString = new StringBuilder()
					.append("/jcr:root").append(cleanedPath)
					.append("//element(*,cq:PageContent)")
					.append("[@cq:template='").append(templatePath)
					.append("']");
			logger.info(queryString.toString());
			resourceIterator = resolver.findResources(
					StringUtils.trim(queryString.toString()), Query.XPATH);
		}
		return resourceIterator;
	}


	public Page getPage() {
		return page;
	}



}