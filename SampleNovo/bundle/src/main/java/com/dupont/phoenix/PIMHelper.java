package com.dupont.phoenix;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.foundation.Image;
import com.dupont.phoenix.hlm.HLM;
import com.dupont.phoenix.list.ListItem;

public class PIMHelper {

	private static final Logger LOGGER = LoggerFactory.getLogger(PIMHelper.class);
	private Resource resource;
	private ValueMap properties;
	private Page page;
	private static final String LINK_TEXT = "linkText";
	private static final String LINK_URL = "linkURL";

	public PIMHelper(final Page page, final Resource resource) {
		this.resource = resource;
		this.properties = resource.adaptTo(ValueMap.class);
		this.page=page;
	}

	/**
	 * Returns Extesnion according to URL
	 */

	public static String ContentType(String linkurl) {
		LOGGER.debug("content Type...");

		String contentType = linkurl.substring(linkurl.lastIndexOf('.') + 1,
				linkurl.length());

		return contentType;
	}

	public static String getTitleSuffix(String mimeType) {
		if (mimeType.contains("pdf")) {
			return " (PDF)";
		} else{
			return "";
		}
			
	}

	public static String getLinkIconCSS(String mimeType) {
		if ("pdf".equals(mimeType)) {
			return "pdf-link";
		} else if ("doc".equals(mimeType) || "docx".equals(mimeType)) {
			return "word-link";

		} else if ("xlsx".equals(mimeType) || "xls".equals(mimeType)) {
			return "excel-link";

		} else {
			return "";
		}
	}

	public ListItem getCalloutItem() {
		ListItem item = null;
		if (properties != null) {
			String linkText = properties.containsKey(LINK_TEXT) ? properties
					.get(LINK_TEXT, String.class) : null;
			String linkURL = properties.containsKey(LINK_URL) ? properties
					.get(LINK_URL, String.class) : null;
			if (StringUtils.isNotBlank(linkText)) {
				item = new ListItem();
				item.setLinkText(linkText);
				item.setLinkURL(String.format("%s.html", linkURL));
				Image image = new Image(resource, "thumbnail");
				image.setSelector(".img");
				item.setThumbnail(image);
				item.setImageWidth("300");
				item.setImageHeight("150");
			}
		}
		return item;
	}

	public Boolean isCalloutActive() {
		Boolean showRowCallout = true;
		if (properties != null) {
			showRowCallout = properties
					.containsKey(HLM.ROW_CALLOUT_SHOW_HIDE_PROPERTY_NAME) ? properties
					.get(HLM.ROW_CALLOUT_SHOW_HIDE_PROPERTY_NAME, Boolean.class)
					: false;

		}
		return !showRowCallout;
	}

	public static Boolean isInternalLink(String linkURL) { 
		
		boolean internalLinkbool = false;
		if (linkURL.startsWith("/content/")
				&& !linkURL.startsWith("/content/dam/")) {
			internalLinkbool = true;
		} else {
			internalLinkbool =  false;
		}
		return internalLinkbool;
	}

	public Page getPage() {
		return page;
	}
}
