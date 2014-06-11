package com.dupont.phoenix;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.jcr.query.Query;

import org.apache.commons.collections.comparators.ComparatorChain;
import org.apache.commons.lang.StringUtils;
import org.apache.jackrabbit.util.ISO9075;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.dupont.phoenix.hlm.LastModificationDateComparator;
import com.dupont.phoenix.list.ListItem;

public final class NewsletterArchiveHelper {

	private static final Logger logger = LoggerFactory
			.getLogger(NewsletterArchiveHelper.class);

	private Page page;
	private Resource resource;
	private List<ListItem> items;
	private ValueMap properties;
	private SlingHttpServletRequest slingRequest;

	public NewsletterArchiveHelper(final Page page, final Resource resource, final SlingHttpServletRequest slingRequest) {
		this.page = page;
		this.resource = resource;
		this.properties = resource.adaptTo(ValueMap.class);
		this.slingRequest = slingRequest;
	}

	/**
	 * Returns a list of matching content pages based on ContentType and
	 * siteRootNode List is sorted and content pages are filtered out as per
	 * relevance logic
	 */
	public List<ListItem> getItems() {
		logger.info("get content items for:" + resource.getPath());
		Iterator<Resource> resIt = findResources();
		this.items = processResources(resIt);
		sortListItems();
		return items;
	}

	/**
	 * Returns the repository folder path to look for content items.
	 */
	public String getQueryPath() {
		// TODO: site node and country language node
		// TODO: whats the node structure for sites?
		// String targetFolderPath = "/content/dupont";
		Page targetFolder = page.getAbsoluteParent(2);
		// do not use language info from the locale
		// Locale locael = page.getLanguage(true);
		String targetFolderPath = targetFolder.getPath();
		// logger.info("target folder path:"+targetFolderPath);
		return targetFolderPath;
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

	public Iterator<Resource> findResources() {
		logger.info("find resources....");
		ResourceResolver resolver = resource.getResourceResolver();
		Iterator<Resource> resourceIterator = null;
		final String cleanedPath = cleanPath(this.getQueryPath());
		// logger.info("Cleaned target path:"+cleanedPath);
		String hlmContentType = "newsletter";
		// logger.info("HLM Content Type:"+hlmContentType);
		if (StringUtils.isNotBlank(cleanedPath)) {
			final StringBuilder queryString = new StringBuilder()
					.append("/jcr:root").append(cleanedPath)
					.append("//element(*,cq:Page)")
					.append("[(@jcr:content/contentType='").append(hlmContentType)
					.append("')]");
			logger.info(queryString.toString());
			resourceIterator = resolver.findResources(
					StringUtils.trim(queryString.toString()), Query.XPATH);
		}
		return resourceIterator;
	}

	/**
	 * Page Content (Content rendered through components) is based on page data
	 * source tag.
	 */

	private List<ListItem> processResources(final Iterator<Resource> resIt) {
		logger.info("process resources..create list items");
		List<ListItem> resList = new ArrayList<ListItem>();
		while (resIt.hasNext()) {
    		Resource res = resource.getResourceResolver().getResource(resIt.next(), "jcr:content");
			ValueMap resProps = res.adaptTo(ValueMap.class);
			ListItem item = new ListItem();
			item.setContentType(resProps.get("contentType", String.class));
			item.setName(res.getName());
			item.setTitle(resProps.get("jcr:title", String.class));
			item.setPageTitle(resProps.get("pageTitle", String.class));
			item.setLinkText(item.getTitle());
			item.setLinkURL(String.format("%s.html", Global.getNavigationURL(slingRequest, res.getParent().getPath(), false)));
			item.setTags(resProps.get("cq:tags", String[].class));
			item.setShortDesc(resProps.get("jcr:description", String.class));
			item.setRank(resProps.get("rank", String.class));
			item.setLastModified(resProps.get("cq:lastModified", Date.class));
			resList.add(item);
		}
		return resList;
	}

	public int getListSize() {
		return (this.items != null) ? this.items.size() : 0;
	}

	@SuppressWarnings("unchecked")
	private void sortListItems() {
		logger.info("sorting...");
		ComparatorChain chain = new ComparatorChain();
		chain.addComparator(LastModificationDateComparator.DESCENDING);
		Collections.sort(items, chain);
		logger.info("sorting done...");
	}

	public ValueMap getProperties() {
		return properties;
	}

}