package com.dupont.phoenix;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import com.dupont.phoenix.GlobalConstants;
import com.dupont.phoenix.list.ListItem;
import com.dupont.phoenix.hlm.LastModificationDateComparator;
import com.dupont.phoenix.hlm.RankComparator;
import com.dupont.phoenix.hlm.RelevancyScoreComparator;

import javax.jcr.query.Query;
import org.apache.commons.collections.comparators.ComparatorChain;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.jackrabbit.util.ISO9075;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import com.day.cq.wcm.api.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class LinkListDynamicHelper {

	private static final Logger logger = LoggerFactory
			.getLogger(LinkListDynamicHelper.class);

	private Page page;
	private Resource resource;
	private List<ListItem> items;
	private ValueMap properties;
	private SlingHttpServletRequest slingRequest;

	public LinkListDynamicHelper(final SlingHttpServletRequest slingRequest,
			final Page page, final Resource resource) {

		this.slingRequest = slingRequest;
		this.page = page;
		this.resource = resource;
		this.properties = resource.adaptTo(ValueMap.class);
	}

	/**
	 * Returns a list of matching content pages based on ContentType and
	 * siteRootNode List is sorted and content pages are filtered out as per
	 * relevance logic
	 */
	public List<ListItem> getItems() {
		// logger.info("get content items for:" + resource.getPath());
		Iterator<Resource> resIt = findResources();

		this.items = processResources(resIt);
		calculateRelevancyScore();
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
		Page targetFolder = page.getAbsoluteParent(1);
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
		// logger.info("find resources....");
		ResourceResolver resolver = resource.getResourceResolver();
		Iterator<Resource> resourceIterator = null;
		// String effectiveTag = getEffectivePageTag();
		final String cleanedPath = cleanPath(this.getQueryPath());
		// logger.info("Cleaned target path:" + cleanedPath);
		String hlmContentType = properties.get("contentType", String.class);
		// logger.info("Content Type:" + hlmContentType);
		if (StringUtils.isNotBlank(cleanedPath)) {
			final StringBuilder queryString = new StringBuilder()
					.append("/jcr:root").append(cleanedPath)
					.append("//element(*,cq:Page)")
					.append("[(@jcr:content/contentType='").append(hlmContentType)
					.append("') and ").append("(@jcr:content/cq:tags != '')]");
			// .append("') and ").append("(@cq:tags='")
			// .append((effectiveTag != null) ? effectiveTag : "")
			// .append("')]");
			logger.info(queryString.toString());
			resourceIterator = resolver.findResources(
					StringUtils.trim(queryString.toString()), Query.XPATH);
		}
		return resourceIterator;
	}

	private void calculateRelevancyScore() {
		// logger.info("calculate relevancy..");
		String[] pageTags = page.getProperties().get("cq:tags", String[].class);
		for (ListItem item : items) {
			item.setRelevancyScore(getMatchingTagsCount(item.getTags(),
					pageTags));
		}
		Iterator<ListItem> listIterator = items.iterator();
		String currentURL = page.getPath() + ".html";
		while (listIterator.hasNext()) {
			ListItem currentItem = listIterator.next();
			if (currentItem.getRelevancyScore() < 3
					|| currentItem.getLinkURL().equals(currentURL)) {
				// if (currentItem.getLinkURL().equals(currentURL)) {
				listIterator.remove();
				// logger.info("**********************Item Remove");
			}
		}
	}

	public int getMatchingTagsCount(String[] aTags, String[] pageTags) {
		// logger.info("match tags...***************:" + aTags.toString());
		int ret = 0;
		for (String tag : aTags) {
			Boolean isMatch = ArrayUtils.contains(pageTags, tag);
			// logger.info("contains:"+isMatch);
			if (isMatch)
				ret = ret + 1;
		}

		return ret;

	}

	/**
	 * Page Content (Content rendered through components) is based on page data
	 * source tag.
	 */
	public String getEffectivePageTagByContentType() {
		// logger.info("get effective pgae tag......");
		String pageContentType = page.getProperties().get("contentType",
				String.class);
		String[] pageTags = page.getProperties().get("cq:tags", String[].class);
		int pageTagsCount = (pageTags != null) ? pageTags.length : 0;
		String tagExpr = String.format("%s:%s",
				GlobalConstants.ROOT_TAG_NAMESPACE, pageContentType);
		for (int i = 0; i < pageTagsCount; i++) {
			String aTag = pageTags[i];
			if (StringUtils.startsWith(aTag, tagExpr)) {
				return aTag;
			}
		}
		return null;
	}

	/**
	 * Page Content (Content rendered through components) is based on page data
	 * source tag.
	 */
	public String getEffectivePageTag() {
		// logger.info("get effective pgae tag......");
		String[] pageTags = page.getProperties().get("pageTag", String[].class);
		return pageTags != null ? pageTags[0] : null;
	}

	private List<ListItem> processResources(final Iterator<Resource> resIt) {
		// logger.info("process resources..create list items");
		List<ListItem> resList = new ArrayList<ListItem>();
		// logger.info(" Outside Loop***********************");
		final String langCountryPathRegEx = String.format("/%s/",
				Global.getLangCountryCode(page));
		final String langPathRegEx = String.format("/%s/",
				Global.getLangCode(page));
		while (resIt.hasNext()) {
			// logger.info(" Inside Loop***********************");
    		Resource res = resource.getResourceResolver().getResource(resIt.next(), "jcr:content");
			if (StringUtils.containsIgnoreCase(res.getPath(),
					langCountryPathRegEx)
					|| StringUtils.containsIgnoreCase(res.getPath(),
							langPathRegEx)) {
				ValueMap resProps = res.adaptTo(ValueMap.class);
				// logger.info(" Create list Item************");
				ListItem item = new ListItem();
				item.setContentType(resProps.get("contentType", String.class));
				item.setName(res.getName());
				item.setTitle(resProps.get("jcr:title", String.class));
				item.setPageTitle(resProps.get("pageTitle", String.class));
				item.setLinkText(item.getTitle());
				// item.setLinkURL(String.format("%s.html",
				// res.getParent().getPath()));
				Page resPage = res.getParent().adaptTo(Page.class);
				item.setLinkURL(String.format("%s.html",
						Global.getNavigationURL(slingRequest, resPage, false)));
				item.setTags(resProps.get("cq:tags", String[].class));
				item.setShortDesc(resProps.get("jcr:description", String.class));
				item.setRank(resProps.get("rank", String.class));
				item.setLastModified(resProps
						.get("cq:lastModified", Date.class));
				resList.add(item);
			}
		}

		return resList;
	}

	public int getListSize() {
		return (this.items != null) ? this.items.size() : 0;
	}

	private void sortListItems() {
		// logger.info("sorting...");
		ComparatorChain chain = new ComparatorChain();
		chain.addComparator(RelevancyScoreComparator.DESCENDING);
		chain.addComparator(RankComparator.ASCENDING);
		chain.addComparator(LastModificationDateComparator.DESCENDING);
		Collections.sort(items, chain);
		// logger.info("sorting done...");

	}

	/**
	 * To show each link with title/long headline and URL. If the content type
	 * is "Product & Service Detail" ,show short description also.
	 */

	public String getdynamicListType(String contentType) {
		String ret = "";
		// logger.info("contentType : " + contentType);
		if ((contentType.equals("product") || contentType.equals("productdetail")) && (getListSize() <= 3)) {
			ret = "linklistitem-dynamic-title-and-description";
		} else {
			ret = "linklistitem-dynamic-title";
		}
		return ret;
	}
}
