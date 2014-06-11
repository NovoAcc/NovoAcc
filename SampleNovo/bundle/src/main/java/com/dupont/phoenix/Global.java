package com.dupont.phoenix;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.ValueFormatException;
import javax.jcr.lock.LockException;
import javax.jcr.nodetype.ConstraintViolationException;
import javax.jcr.query.Query;
import javax.jcr.version.VersionException;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.commons.LanguageUtil;
import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMMode;
import com.day.cq.wcm.api.designer.Designer;
import com.day.cq.wcm.api.designer.Style;

public final class Global {
	private Global() {
		throw new AssertionError("Global is uninstantiable");
	}

	final static Logger logger = LoggerFactory.getLogger(Global.class);
	public static final String SITE_CONFIG_FOLDER_NAME = "siteconfig";
	public static final String APP_RESOURCES_BASENAME="DuPontAppResources";
	private static final String TAG_NAMESPACE = "DuPont:";
	
	/**
	 * Given the page, return the navigation URL of the pages based on
	 * application rules.
	 * 
	 * @param page
	 * @param returnRelative
	 * @return
	 */
	public static String getNavigationURL(final SlingHttpServletRequest slingRequest, final Page page, boolean returnRelative) {
		// Check and return if there is a custom property "GhostPageRedirectURL"
		// Check and return first Vanity URL if there exists one
		// Return getPath() of page
		String result = StringUtils.EMPTY;
		if (page != null) {
			result = page.getPath();
		}
		// TODO TBD Include code to process relative

		return result;

	}

	public static String getNavigationURL(final SlingHttpServletRequest slingRequest, String pagePath, boolean returnRelative) {
		ResourceResolver resolver = slingRequest.getResourceResolver();
		PageManager pm = resolver.adaptTo(PageManager.class);
		Page page = pm.getPage(pagePath);
		return Global.getNavigationURL(slingRequest, page, returnRelative);
	}

	/**
	 * Given the page, return the navigation Title of the pages based on
	 * application rules.
	 * 
	 * @param page
	 * @return
	 */
	public static String getNavigationTitle(Page page) {
		// Retrieve the page navigation title, page title or name in order if
		// set.

		String result = StringUtils.EMPTY;
		if (page != null) {
			// Retrieve the page navigation title if set
			String pageNavTitle = page.getNavigationTitle();
			//logger.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Text Translation: getNavigationTitle(): Text: " + pageNavTitle);
			if (StringUtils.isEmpty(pageNavTitle)) 
			{
				// Get page title
				ValueMap pageProperties = page.getProperties();
				// get JCR Title
				pageNavTitle = pageProperties.get(NameConstants.PN_TITLE,String.class);
				//logger.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Text Translation 2: pageTitle(): Text: " + pageNavTitle);
				if (StringUtils.isNotEmpty(pageNavTitle)) 
				{
					result = pageNavTitle;
				} 
			} 
			else 
			{
				result = pageNavTitle;
			}

			if (StringUtils.isEmpty(result)) {
				result = page.getName();
			}
		}
		// result = page.getName();
		return result;

	}

	/**
	 * Given the parameters, return the Markup for internal/external link
	 * 
	 * @param linkTarget
	 * @param externalIcon
	 * @param externalIconCSSClass
	 * @param newBrowserWindow
	 * @return
	 **/

	public static String renderLink(String linkTarget,
			String linkTargetCSSClass, String linkTitle,
			String linkTitleCSSClass, String externalIconPath,
			String externalIconCSSClass, boolean newBrowserWindow,
			boolean iconBeforeLink) {
		// Render out the HTML Markup for the Link to open up in same or new
		// browser window.
		// Wrap the last word of link with ExternalIcon in a span
		// Link CQlink = new Link();

		// Sample
		// <a href="#" title=""> Fusce Placerat Nibh Odio at Pharetra Dolor
		// Morbi ut
		// <span class="no-wrap">Felis <img class="cta-arrow"
		// src="images/right-arrow-action.png"></span>
		// </a>

		String strResult = ""; // Final Result to be returned back.
		boolean addNoWrapSpanDiv = false; // Track if a No wrap span has been
											// added or not
		boolean addLinkTitleSpanDiv = false; // Track if a No wrap span has been
												// added or not

		// To be Done
		// 1. Error Handling and Logging
		// 2. Check Language Translation Needs
		// 3. Check xssAPI passing

		// Process Anchor Tag
		String txtAnchor = "";
		if (linkTarget != null && linkTarget.length() > 0) {
			txtAnchor = "<a href=\"" + linkTarget + "\" ";
		} /*else {
			txtAnchor = "<a href=\"#\"";
		}*/

		if (linkTargetCSSClass != null && linkTargetCSSClass.length() > 0) {
			txtAnchor = txtAnchor + " class=\"" + linkTargetCSSClass + "\"";
		}
		if (newBrowserWindow) {
			txtAnchor = txtAnchor + " target=new ";
		}
		if (linkTarget != null && linkTarget.length() > 0) {
			txtAnchor = txtAnchor + "> ";
		}

		// Process linkTitle and if it the link has image and iconBeforeLink
		// false wrap the last word
		// in a SPAN div to avoid showing the image in a different line.

		String linkTitleProcessed = "";
		if (linkTitle != null && linkTitle.length() > 0) {
			if (linkTitleCSSClass != null && linkTitleCSSClass.length() > 0) {
				linkTitleProcessed = "<span class=\"" + linkTitleCSSClass
						+ "\" >";
				addLinkTitleSpanDiv = true;
			}

			if (externalIconPath != null && externalIconPath.length() > 0
					&& !iconBeforeLink) {
				String lastWord = getTextLastWord(linkTitle);
				String linkTitleWithoutLastWord = getTextWithoutLastWord(linkTitle);
				linkTitleProcessed = linkTitleProcessed
						+ linkTitleWithoutLastWord
						+ " <span class=\"no-wrap\"> " + lastWord;
				addNoWrapSpanDiv = true;
			} else {
				linkTitleProcessed = linkTitleProcessed + linkTitle;
			}

		}

		// Process Icon IMG tag
		String txtAnchorImage = "";

		if (externalIconPath != null && externalIconPath.length() > 0) {

			txtAnchorImage = txtAnchorImage + " <img ";
			if (externalIconCSSClass != null
					&& externalIconCSSClass.length() > 0) {
				txtAnchorImage = txtAnchorImage + "class=\""
						+ externalIconCSSClass + "\"";
			}

			txtAnchorImage = txtAnchorImage + " src=\"" + externalIconPath
					+ "\">";
			// txtAnchorImage=txtAnchorImage+"</span>";
			if (addNoWrapSpanDiv) {
				//txtAnchorImage = txtAnchorImage + "</span>";
			}

		}
		if (addLinkTitleSpanDiv) {
			//txtAnchorImage = txtAnchorImage + "</span>";
		}
		if (!iconBeforeLink) {
			strResult = String.format("%s%s%s%s%s%s",txtAnchor,linkTitleProcessed,txtAnchorImage,addNoWrapSpanDiv?"</span>":"",addLinkTitleSpanDiv?"</span>":""," </a>");
		} else {
			strResult = String.format("%s%s%s%s%s%s%s",txtAnchorImage,txtAnchor,linkTitleProcessed,addNoWrapSpanDiv?"</span>":"",addLinkTitleSpanDiv?"</span>":""," </a>",StringUtils.isNotBlank(txtAnchorImage)?"</img>":"");
		}
		return strResult;

	}

	/**
	 * Given the parameters, return the Markup for internal/external link
	 * 
	 * @param linkTarget
	 * @param externalIcon
	 * @param externalIconCSSClass
	 * @param newBrowserWindow
	 * @return
	 **/
	public static String renderLink(String linkTarget,
			String linkTargetCSSClass, String linkTitle,
			String linkTitleCSSClass, String externalIconPath,
			String externalIconCSSClass, boolean newBrowserWindow,
			boolean iconBeforeLink, String linkHoverText) {
		// Render out the HTML Markup for the Link to open up in same or new
		// browser window.
		// Wrap the last word of link with ExternalIcon in a span
		// Link CQlink = new Link();

		// Sample
		// <a href="#" title=""> Fusce Placerat Nibh Odio at Pharetra Dolor
		// Morbi ut
		// <span class="no-wrap">Felis <img class="cta-arrow"
		// src="images/right-arrow-action.png"></span>
		// </a>
		String strResult = ""; // Final Result to be returned back.
		boolean addNoWrapSpanDiv = false; // Track if a No wrap span has been
											// added or not
		boolean addLinkTitleSpanDiv = false; // Track if a No wrap span has been
												// added or not
		// To be Done
		// 1. Error Handling and Logging
		// 2. Check Language Translation Needs
		// 3. Check xssAPI passing
		// Process Anchor Tag
		String txtAnchor = "";
		if (linkTarget != null && linkTarget.length() > 0) {
			txtAnchor = "<a href=\"" + linkTarget + "\" ";
		} /*else {
			txtAnchor = "<a href=\"#\"";
		}*/
		if (linkTargetCSSClass != null && linkTargetCSSClass.length() > 0) {
			txtAnchor = txtAnchor + " class=\"" + linkTargetCSSClass + "\"";
		}
		// if it the link has a hover text
		if (linkHoverText != null && linkHoverText.length() > 0) {
			txtAnchor = txtAnchor + " title=\"" + linkHoverText + "\"";
		}
		if (newBrowserWindow) {
			txtAnchor = txtAnchor + " target=new ";
		}
		if (linkTarget != null && linkTarget.length() > 0) {
			txtAnchor = txtAnchor + "> ";
		}
		// Process linkTitle and if it the link has image and iconBeforeLink
		// false wrap the last word
		// in a SPAN div to avoid showing the image in a different line.
		String linkTitleProcessed = "";
		if (linkTitle != null && linkTitle.length() > 0) {
			if (linkTitleCSSClass != null && linkTitleCSSClass.length() > 0) {
				linkTitleProcessed = "<span class=\"" + linkTitleCSSClass
						+ "\" >";
				addLinkTitleSpanDiv = true;
			}
			if (externalIconPath != null && externalIconPath.length() > 0
					&& !iconBeforeLink) {
				String lastWord = getTextLastWord(linkTitle);
				String linkTitleWithoutLastWord = getTextWithoutLastWord(linkTitle);
				linkTitleProcessed = linkTitleProcessed
						+ linkTitleWithoutLastWord
						+ " <span class=\"no-wrap\"> " + lastWord;
				addNoWrapSpanDiv = true;
			} else {
				linkTitleProcessed = linkTitleProcessed + linkTitle;
			}
		}

		// Process Icon IMG tag
		String txtAnchorImage = "";
		if (externalIconPath != null && externalIconPath.length() > 0) {
			txtAnchorImage = txtAnchorImage + " <img ";
			if (externalIconCSSClass != null
					&& externalIconCSSClass.length() > 0) {
				txtAnchorImage = txtAnchorImage + "class=\""
						+ externalIconCSSClass + "\"";
			}
			txtAnchorImage = txtAnchorImage + " src=\"" + externalIconPath
					+ "\">";
			// txtAnchorImage=txtAnchorImage+"</span>";
			if (addNoWrapSpanDiv) {
				//txtAnchorImage = txtAnchorImage + "</span>";
			}
		}
		if (addLinkTitleSpanDiv) {
			//txtAnchorImage = txtAnchorImage + "</span>";
		}
		if (!iconBeforeLink) {
			strResult = String.format("%s%s%s%s%s%s",txtAnchor,linkTitleProcessed,txtAnchorImage,addNoWrapSpanDiv?"</span>":"",addLinkTitleSpanDiv?"</span>":""," </a>");
		} else {
			strResult = String.format("%s%s%s%s%s%s%s",txtAnchorImage,txtAnchor,linkTitleProcessed,addNoWrapSpanDiv?"</span>":"",addLinkTitleSpanDiv?"</span>":""," </a>",StringUtils.isNotBlank(txtAnchorImage)?"</img>":"");
		}
		return strResult;
	}

	/**
	 * return root node for country/language website
	 * 
	 * @return
	 **/
	public static String getCountryLangRootNode(Page page) {
		// Read and return the root node for web site from site config or
		// through application rules.

		String result = "";

		Page rootPage = page.getAbsoluteParent(2);
		result = rootPage.getPath();
		return result;

	}

	/**
	 * return the hero headline text for the page
	 * 
	 * @return
	 **/
	public static String getHeroHeadline(Page page) {
		ValueMap pageProperties = page.getProperties();
		String result = StringUtils.EMPTY;
		result = (String) pageProperties.get(NameConstants.PN_TITLE,
				String.class);
		return result;
	}

	/**
	 * returns the hero color for the page.
	 * 
	 * @return
	 **/
	public static String getHeroColor(Page page) {
		// returns the hero color for the current page.

		String result = "";

		// result = page.getProperties("heroColor");
		// if ((result is null) || (result == "")){
		// result ="";
		// }

		return result;

	}

	/**
	 * returns the copyright text for the site.
	 * 
	 * @return
	 **/
	public static String getCopyrightText() {
		// returns the copyright text for the site from site config.

		String result = "";

		return result;

	}

	public static Style getSiteConfigStyle(final Resource resource) {
		if (resource == null)
		{
			return null;
		}
		final ResourceResolver resolver = resource.getResourceResolver();
		final Designer designer = resolver.adaptTo(Designer.class);
		final Style style = designer.getStyle(resource,
				Global.SITE_CONFIG_FOLDER_NAME);
		return style;
	}

	/**
	 * Given the parameters, return the Markup for internal/external link
	 * 
	 * @param attributes
	 *            map of all attributes of anchor tag. e.g.
	 *            map.put("href","www.google.com");
	 * @param linkTitle
	 *            Title of Link
	 * @param externalIcon
	 *            True if there is any externalLink else false
	 * @param externalIconCSSClass
	 *            CSS Class of external Link
	 * @param internalTitleCSSClass
	 *            CSS class of internal link title
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static String renderLink(Map<String, String> attributes,
			String linkTitle, boolean externalIcon,
			String externalIconCSSClass, String internalTitleCSSClass) {

		// creating anchor tag using attributes
		StringBuffer result = new StringBuffer("<a");
		Iterator<Map.Entry<String, String>> itr = attributes.entrySet()
				.iterator();
		while (itr.hasNext()) {
			Map.Entry pairs = (Map.Entry) itr.next();
			result.append(" ").append(pairs.getKey()).append("=\"")
					.append(pairs.getValue()).append("\"");
		}
		result.append(">");

		// Wrap the last word of link with ExternalIcon in a span
		if (externalIcon) {

			result.append("<img class=").append(externalIconCSSClass)
					.append(" src=  ></img> ");
		}

		// internal title css class
		if (internalTitleCSSClass != null) {
			result.append("<span class=").append(internalTitleCSSClass)
					.append(">").append(linkTitle).append("</span>");
		} else {
			result.append(linkTitle);
		}
		result.append("</a>");
		return result.toString();
	}

	/**
	 * Given the parameters, returns the MIME Type for given link
	 * 
	 * @param linkURL
	 *            URL of link whose mimeType is required;
	 * @return
	
	public static String ContentType(String linkurl) throws IOException {

		String contentType = URLConnection.guessContentTypeFromName(linkurl);

		return contentType;
	} */

	/**
	 * Given the parameters, returns whether the link is external or internal to
	 * CQ5
	 * 
	 * @param linkURL
	 *            URL of link whose mimeType is required;
	 * @return
	 */
	public static Boolean isExternalLink(String linkURL) {

		if (linkURL.contains("http://") || linkURL.contains("https://")) {
			return true;
		}
		return false;
	}

	/**
	 * Get the language translated text
	 * 
	 * @param text
	 *            text to be translated
	 * @return
	 **/
	public static String getTranslatedText(Page page,
			SlingHttpServletRequest request, String text) {
		Locale pageLocale = page.getLanguage(false);
		// If above bool is set to true. CQ looks in to page path rather than
		// jcr:language property.
		// logger.info("Text Translation: getTranslatedText(): Text: " + text
		// +": Page locale is:"+pageLocale);
		ResourceBundle resourceBundle = request.getResourceBundle(Global.APP_RESOURCES_BASENAME, pageLocale);
		// logger.info("Text Translation: getTranslatedText(): Request Locale:"+request.getLocale());
		I18n i18n = new I18n(resourceBundle);
		return i18n.get(text);

	}

	public static Boolean isSelectorActive(
			SlingHttpServletRequest slingRequest, String selectorName) {
		String selectors = null;
		if (slingRequest != null) {
			selectors = slingRequest.getRequestPathInfo().getSelectorString();
		}
		if (selectors != null) {
			return StringUtils.contains(selectors, selectorName);
		}
		return false;
	}

	/**
	 * Returns selector by using index. First selector is at index 0.
	 * @param slingRequest
	 * @param selectorName
	 * @return
	 */
	public static String getSelectorByIndex(SlingHttpServletRequest slingRequest, int index) {
		if (slingRequest != null) {
			final String[] selectors = slingRequest.getRequestPathInfo().getSelectors();
			if (selectors != null && selectors.length > index) {
				return selectors[index];
			}
		}
		return null;
	}

	/**
	 * Returns string value for the provided property name. Checks if named
	 * property exists before calling get method.
	 * 
	 * @param props
	 * @param propName
	 * @return null if property does not exist
	 */
	public static String getStringPropValue(final ValueMap props,
			final String propName) {
		return props != null ? props.containsKey(propName) ? props.get(
				propName, String.class) : null : null;
	}

	/**
	 * Returns Boolean value for the given property name. Checks if named
	 * property exists before calling get method.
	 * 
	 * @param props
	 * @param propName
	 * @return
	 */
	public static Boolean getBooleanPropValue(final ValueMap props,
			final String propName) {
		return props != null ? props.containsKey(propName) ? props.get(
				propName, Boolean.class) : false : false;
	}

	/**
	 * Returns Integer value for the given property name. Checks if named
	 * property exists before calling get method.
	 * 
	 * @param props
	 * @param propName
	 * @return 0 if property does not exist
	 */
	public static Integer getIntegerPropValue(final ValueMap props,
			final String propName) {
		return props != null ? props.containsKey(propName) ? props.get(
				propName, Integer.class) : 0 : 0;
	}

	/**
	 * Returns true if request WCM mode is EDIT Checks if named property exists
	 * before calling get method.
	 * 
	 * @param props
	 * @param propName
	 * @return false if property does not exist
	 */
	public static Boolean isEdit(final SlingHttpServletRequest slingRequest) {
		return WCMMode.fromRequest(slingRequest) == WCMMode.EDIT;
	}

	public static Boolean isProd(final SlingHttpServletRequest slingRequest) {
		//for now, just return false
		//TODO: use run modes for identifying systems.
		return false;
	}

	/**
	 * Returns the external site prefix for a website as defined in site config
	 * 
	 * @return false if property does not exist
	 */
	public static String getExternalSitePrefix(Resource resource) {
		final Style externalSitePrefix = getSiteConfigStyle(resource)
				.getSubStyle("general");
		String strExternalSitePrefix = "";
		if (externalSitePrefix != null) {
			strExternalSitePrefix = externalSitePrefix.get(
					"externalsiteprefix", String.class);
		}
		// logger.info("Global: getExternalSitePrefix(): Value:"+strExternalSitePrefix);
		return strExternalSitePrefix;
	}

	/**
	 * Returns the a string array that contains the tile Without last word and
	 * the last word as separate strinds If the title contains only one word
	 * then returns the same
	 * 
	 * public static String[] getNoWrapTitle(String currentTitle) { String
	 * []currentTitleFormatted = new String[5]; currentTitleFormatted[0] =
	 * (currentTitle !=null && currentTitle.lastIndexOf(" ")!=-1)?
	 * currentTitle.substring(0,currentTitle.lastIndexOf(" ")):currentTitle;
	 * currentTitleFormatted[1] = (currentTitle!=null)?
	 * currentTitle.substring(currentTitle.lastIndexOf(" ")+1):"";
	 * 
	 * return currentTitleFormatted; }
	 */
	public static String getTextWithoutLastWord(String text) {
            return (text != null) ? ((text.lastIndexOf(' ') != -1) ? text.substring(0, text.lastIndexOf(' ')) : text) : "";
        }

	public static String getTextLastWord(String text) {
		return (text != null && text.lastIndexOf(' ') != -1) ? text.substring(text.lastIndexOf(' ') + 1) : "";
	}
 
	public static String getEloquaSiteId(Resource resource) {
		InheritanceValueMap iProperties = new HierarchyNodeInheritanceValueMap(
				resource);
		String value = iProperties.getInherited("eloquaSiteId", String.class);
		logger.info(" eloquaSiteId Value************************:" + value);
		return value;
	}
	
	/**
	 * Return two letter language code.
	 * @param page
	 * @return
	 */
	public static String getLangCode(Page page) {
		Locale pageLocale = page.getLanguage(false);
		return pageLocale.getLanguage();
	}

	/**
	 * Returns two letter country code
	 * @param page
	 * @return
	 */
	public static String getCountryCode(Page page) {
		Locale pageLocale = page.getLanguage(false);
		return pageLocale.getCountry();
	}

	/**
	 * Returns five letter language and country combination code.
	 * For example, "en_us" or "en_gb" or "de_de"..
	 * @param page
	 * @return
	 */
	public static String getLangCountryCode(Page page) {
		Locale pageLocale = page.getLanguage(false);
		return String.format("%s_%s",pageLocale.getLanguage(),pageLocale.getCountry());
	}
	
	/**
	 * Returns true if language (or language country combination) is below site node.
	 * @param page
	 * @return
	 */
	public static Boolean isLangUnderSiteNode(Page page) {
		return StringUtils.equals(page.getAbsoluteParent(2).getPath(),LanguageUtil.getLanguageRoot(page.getPath()));
	}
	
	/**
	 * Used to build vanity path URL.
	 * @param page
	 * @return
	 */
	public static String getNavigationalURL(Page page) {
	    long level = 1;
	    long endLevel = 0;    
		long currentLevel = page.getDepth();
		StringBuilder url = new StringBuilder();
		while (level < currentLevel - endLevel) {
			Page trail = page.getAbsoluteParent((int)level);
			if (trail == null) 
			{ 
				break;
			}
			//skip if hide in nagigation is true
			if (!trail.isHideInNav()){ 
				url.append("/");
				url.append(trail.getName());
			}
	        level++;
        }
		return url.toString();
	}
	
	/**
	 * Set vanity Path
	 * @param page
	 */
	public static void setVanityPath(Page page) {
		Page sitePage = page.getAbsoluteParent(1);
		final String navigationalURL = String.format("%s%s",sitePage.getPath(),Global.getNavigationalURL(page));		
		//set vanityPath if not set or different
		//do this on author only
		//set vanityPath property
		Resource contentRes = page.getContentResource();
		String[] vanityPaths = page.getProperties().get("sling:vanityPath", String[].class);
		String vanityPath = vanityPaths!=null && vanityPaths.length > 0 ? vanityPaths[0] : null;
		if(StringUtils.isBlank(vanityPath) || !StringUtils.equalsIgnoreCase(navigationalURL, vanityPath)) {
	        final Node contentNode = contentRes.adaptTo(Node.class);
			final Session session = contentRes.getResourceResolver().adaptTo(Session.class);
			if(contentNode!=null) {
				if(vanityPaths!=null && vanityPaths.length > 0) {
					vanityPaths[0] = navigationalURL;
				} else {
					vanityPaths = new String[2];
					vanityPaths[0] = navigationalURL;
					vanityPaths[1] = "";
				}
				try {
					contentNode.setProperty("sling:vanityPath", vanityPaths);
			        session.save();
				} catch (ValueFormatException e) {
					logger.error("ValueFormatException :", e);
				} catch (VersionException e) {
					logger.error("VersionException :", e);
				} catch (LockException e) {
					logger.error("LockException :", e);
				} catch (ConstraintViolationException e) {
					logger.error("ConstraintViolationException :", e);
				} catch (RepositoryException e) {
					logger.error("RepositoryException :", e);
				}
			}
		}
    }

	public static String getComponentName(final Resource res) {
        final String path = res.getResourceType();
        return StringUtils.substringAfterLast(path, "/");
    }	

	public static String getEventTrackingClassName(final Resource res) {
        return String.format("a-%s",getComponentName(res));
    }
	/**
	 *  return true if page is responsive
	 */
	public static boolean isResponsive(Page currentPage,Resource resource)
	{
		boolean isResponsive = false;
		String resType = resource.getResourceType();
		if(resType.contains("responsive"))
		{
			isResponsive = true;
		}
		return isResponsive;
	}
	
	/**
	 * Get the localized last modification date of the page.
	 * @param currentPage, the page to get the localized date from
	 * @return A formated string of the localized last modified date using dots instead of slashes.
	 */
	public static String getLocalizedDate(Page currentPage) {
		// Get the locale.
		Locale locale = currentPage.getLanguage(false);
		
		String locDate;
		
		// Make sure locale works.
		if (locale == null) {
			locale = new Locale("en_us");
		}
		
		// Create new date format using the locale
		DateFormat dateFormat = DateFormat.getDateInstance(DateFormat.SHORT, locale);
		locDate = dateFormat.format(currentPage.getLastModified().getTime());
		return locDate.replace("/", ".");
	}
	
	/**
	 * Protected method to check whether links are external or internal. OTher resources like PDF's and PPT's won't have the .html extension.
	 * @param url: The URL
	 * @return The modified URL.
	 */
	protected static String checkLink(String url) {
		if (url.startsWith("/content/") && !url.startsWith("/content/dam/")){
			return url + ".html";
		}
		return url;
	}
	/**
	 * Public method to built markup for Picturefill.js
	 * @param Alt Text, Src, Img Class, Title
	 * @return The total markup
	 */
	public static String picturefillMarkup(String imgAlt, String imgSrc, String imgClass, String imgTitle)
	  {
	    String markup = "";
	    StringBuilder markupBuilder = new StringBuilder()
	    		.append("<span data-picture data-alt=\"")
	    		.append(imgAlt != null ? imgAlt : "")
	    		.append("\" data-title =\"")
	    		.append(imgTitle != null ? imgTitle : "")
	    		.append("\" data-class =\"")
	    		.append(imgClass != null ? imgClass : "")
	    		.append("\">\n <span data-src=\"")
	    		.append(imgSrc != null ? imgSrc : "")
	    		.append("\"></span> \n <span data-src=\"")
	    		.append(imgSrc != null ? imgSrc : "")
	    		.append("\" data-media=\"(min-width: 320px)\"></span> \n <span data-src=\"")
	    		.append(imgSrc != null ? imgSrc : "")
	    		.append("\" data-media=\"(min-width: 480px)\"></span> \n <span data-src=\"")
	    		.append(imgSrc != null ? imgSrc : "")
	    		.append("\" data-media=\"(min-width: 600px)\"></span> \n <span data-src=\"")
	    		.append(imgSrc != null ? imgSrc : "")
	    		.append("\" data-media=\"(min-width: 768px)\"></span> \n <span data-src=\"")
	    		.append(imgSrc != null ? imgSrc : "")
	    		.append("\" data-media=\"(min-width: 1250px)\"></span> \n </span>");

	    markup = markupBuilder.toString();
	    logger.info(markup);

	    return markup;
	  }
	/**
	 *  Default Scene7 Config
	 */
	public static String getDefaultScene7ConfigPath(Resource resource)
	{
		String s7configPath= "";
		Iterator<Resource> resourceIterator;
		ResourceResolver resolver = resource.getResourceResolver();
		final StringBuilder queryString = new StringBuilder( )
		.append("/jcr:root")
		.append("/etc/cloudservices/scene7")
		.append("//element(*,cq:PageContent)");
		String options = "[@defaultConfiguration='true']";
		queryString.append(options);
		logger.info("Scene7Config default query : " + queryString.toString());
		resourceIterator =  resolver.findResources(StringUtils.trim(queryString.toString()),Query.XPATH);
		if(resourceIterator.hasNext())
		{
			Resource res = resourceIterator.next();
			s7configPath = res.getPath();
			s7configPath = s7configPath.substring(0,s7configPath.lastIndexOf('/'));
			logger.info("Scene7 config path" +s7configPath);
		}
		return s7configPath;
	}
	
	//ordering is maintained within list children call
	public static String getFirstGallery(Page p) {
		Resource cntRes = p.getContentResource();
		if(cntRes!= null) {
			Iterator<Resource> resIt = p.getContentResource().listChildren();
			while(resIt.hasNext()) {
				Resource res = resIt.next();
				if("videomediagallery".equals(res.getName()) || "imagemediagallery".equals(res.getName())) {
					return res.getName();
				}
			}
		}
		return null;
	}
	
	public static List<String> getNavigationChildList(String parentNodePath,  Resource resource, final SlingHttpServletRequest slingRequest, Boolean isPaddingEnable){
		List<String> links = new ArrayList<String>();
		Iterator<Page> iter = getChildern(parentNodePath,resource);
		String first = "noleftpadding";
		boolean isFirst = true;
		if (iter != null) {
			while (iter.hasNext()) {
				Page child = (Page) iter.next();
				if(!(child.isHideInNav())){
					String title = child.getNavigationTitle();
					if (title == null) {
						title = child.getTitle();
					}
					if (title == null) {
						title = child.getName();
					}
					title = StringEscapeUtils.escapeHtml(title);
					HashMap<String, String> attributesMap = new HashMap<String, String>();
					attributesMap.put("href", getNavigationURL(slingRequest, child, false) + ".html");
					attributesMap.put("title", title);
					if(null!=child.getProperties()){
							Boolean flag = Boolean.valueOf(child.getProperties().get("windowflag","false"));
							if(flag){
								attributesMap.put("target", "_blank");
							}
					}

					if (isPaddingEnable && isFirst) {
						attributesMap.put("class", first);
						isFirst = false;
					}

					links.add(Global.renderLink(attributesMap, title, false, null, null));
				}
			}
		}
		return links;
	}
		
		private static Iterator<Page> getChildern(String nodePath, Resource resource) {
			Resource rootRes = null;
			Page rootPage = null;
			Iterator<Page> iter = null;
			if (StringUtils.isNotEmpty(nodePath)) {
				rootRes = resource.getResourceResolver().getResource(nodePath);
				rootPage = rootRes == null ? null : (Page) rootRes
						.adaptTo(Page.class);
				if (rootPage != null) {
					iter = rootPage.listChildren();
				}
			}
			return iter;
		}
		
		 /**
	     * 
	     * @param pageTagArray
	     * @return
	     */
	    public static String tagArrayToString(String[] tagsArray, String[] pageTagArray){
	    	logger.debug("Removed Name Space Method");
	    	String[] allTags = (String[])ArrayUtils.addAll(tagsArray, pageTagArray);
	    	StringBuilder stringsArray = new StringBuilder(StringUtils.EMPTY);
	    	if(allTags!=null)
	    	{
	    		int count = 0;
		    	for (String string : allTags) {
		    		if(string.contains(TAG_NAMESPACE)){
		    			if(count ==0){
		    				stringsArray.append(StringUtils.removeStart(StringUtils.replace(string, "/", "_"), TAG_NAMESPACE));	
		    			}else{
		    				stringsArray.append(" ").append(StringUtils.removeStart(StringUtils.replace(string, "/", "_"), TAG_NAMESPACE));
		    			}
		    			count++;
		    		}
		    	}
			}
	    	return stringsArray.toString();
	    }
	    /**
		 * 
		 * @param contentTypeKey
		 * @return
		 */
		public static String getContentTypeValue(String contentType,Resource resource) {
			Style siteConfig = Global.getSiteConfigStyle(resource);
	    	Style hlmStyle = (siteConfig!=null) ? siteConfig.getSubStyle("hlm") : null;
	    	return (hlmStyle!=null? hlmStyle.get(contentType, String.class) :"");
		}
		/**
		 * 
		 * @param tagId
		 * @return
		 */
		public static String removeNameSpace(String tagId){
			String tag = null;
			if(tagId.contains("DuPont:")){
				tag = StringUtils.removeStart(StringUtils.replace(tagId, "/", "_"), "DuPont:");
			}
			return tag;
		}

		/**
		 * return if author has entered publish date in content detail headline component
		 * @param res
		 * @return
		 */
		public static Date getCreateDate(Resource res) {
			Date publishedDate=null;
			Node node = res.adaptTo(Node.class);
			try {
				Node contentDetailNode = node.hasNode("contentdetailheadline")?node.getNode("contentdetailheadline"):null;
				if(contentDetailNode!=null)
				{
					Property prop = contentDetailNode.hasProperty("createdate")?contentDetailNode.getProperty("createdate"):null;
					if(prop!=null)
					{
						String publishDate = prop.getValue().getString();
						logger.info("In Create Date:" + publishDate);
						if(null!=publishDate && StringUtils.isNotEmpty(publishDate))
						{
							SimpleDateFormat inputFormat = new SimpleDateFormat("dd.MM.yy");
					        Date inputDate = null;
					        try {
					        inputDate = inputFormat.parse(publishDate);
					        SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZZZ");
					        String outputStringDate = outputFormat.format(inputDate);
					        publishedDate = outputFormat.parse(outputStringDate);
					         } catch (ParseException ex) {
					            logger.error(ex.getMessage());
					        }
						}
					}
				}
			} catch (PathNotFoundException e) {
				logger.error(e.getMessage(), e);
			} catch (RepositoryException e) {
				logger.error(e.getMessage(), e);
			}
			return publishedDate;
		}
} 
