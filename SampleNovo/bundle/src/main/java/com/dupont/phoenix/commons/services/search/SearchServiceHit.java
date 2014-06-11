package com.dupont.phoenix.commons.services.search;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.search.result.Hit;


public class SearchServiceHit {
	
	private static final Logger logger = LoggerFactory
			.getLogger(SearchServiceHit.class);

	/** The hit. */
	private final Hit hit;
	
	/** The search query which lead to this hit. */
	private final String keyword;
	
	/** Max length for search. */
	private static int maxLength = 70;
	
	/** Max length for description. */
	private static int maxLengthDescription = 250;
	
	/** The url. */
	private String url;
	
	/**
	 * Gets the url.
	 * @return the url
	 */
	public String getUrl() {
		return url;
	}
	
	/**
	 * Sets the url.
	 * @param url the new url
	 */
	public void setUrl(final String url) {
		this.url = url;
	}
	
	/**
	 * Instantiates a new search hit.
	 * @param hit the hit
	 * @param keyword the keyword which was used to find the hit
	 */
	public SearchServiceHit(final Hit hit, final String keyword) {
		this.hit = hit;
		this.keyword = keyword;
	}
	
	/**
	 * Gets the title for the search result pages.
	 * @return the title
	 * @throws RepositoryException the repository exception
	 */
	public String getTitle() throws RepositoryException {
		String excerpt = this.hit.getTitle();
		excerpt = removeTags(excerpt);
		if (StringUtils.isNotEmpty(excerpt)) { 
			return excerpt; 
			}
		return truncate(getPage().getName(), maxLength);
	}
	
	/**
	 * Gets the excerpt i.e. the result page descriptions.
	 * @return the excerpt
	 * @throws RepositoryException the repository exception
	 */
	public String getExcerpt() throws RepositoryException {
		String excerpt = "";
		
		if (StringUtils.isNotEmpty(this.hit.getExcerpt())) {
			excerpt = this.hit.getExcerpt();
		} else if (StringUtils.isNotEmpty(this.hit.getExcerpts().get("."))) {
			if (this.hit.getNode().hasProperty("jcr:primaryType")
					&& "dam:Asset".equals(this.hit.getNode().getProperty("jcr:primaryType").getString())) {
				excerpt = this.hit.getExcerpts().get("cq:name");
			}
		} else {
			//excerpt = "";
			return "";
		}
		
		String excerptRefined = "";
		final boolean indexheight = StringUtils.startsWithIgnoreCase(excerpt, "height=");
		final boolean indexSrc = StringUtils.startsWithIgnoreCase(excerpt, "src=");
		
		final int indexhref = StringUtils.lastIndexOf(excerpt, "href");
		final int lastIndexAclose = StringUtils.lastIndexOf(excerpt, "</a");
		
		if (indexhref > lastIndexAclose || indexheight || indexSrc) {
			Node item = this.hit.getNode().getNode("jcr:content");
			if (item != null && item.hasProperty("jcr:description")) {
				excerptRefined = item.getProperty("jcr:description").getString();
			}
			
		} else {
			excerptRefined = processHTMLTags(excerpt);
		}
		
		final int lastIndexclose = StringUtils.lastIndexOf(excerptRefined, Constants.TAG_STRONG_CLOSE);
		String result = "";
		if (lastIndexclose < maxLengthDescription) {
			result = truncate(excerptRefined, maxLengthDescription);
		} else {
			result = truncate(excerptRefined, lastIndexclose + 9);
			//result = result.concat(TAG_STRONG_CLOSE);
		}
		
		return result;
	}
	
	/**
	 * Since the search result excerpts may contain unclosed HTML tags we need to make sure to remove them.
	 * @param excerpt the input string
	 * @return the cleaned up string
	 */
	public String removeTagsExcerpt(final String excerpt) {
		if (StringUtils.isNotEmpty(excerpt)) {
			
			final boolean hasEllipsis = StringUtils.endsWith(excerpt, Constants.ELLIPSIS);
			
			// remove all markup
			String sb = excerpt;
			
			if (sb.contains("&lt;")) {
				sb = sb.replaceAll("&lt;", "<");
			}
			if (sb.contains("&gt;")) {
				sb = sb.replaceAll("&gt;", ">");
			}
			if (sb.contains("&quot;")) {
				sb = sb.replaceAll("&quot;", "'");
			}
			if (sb.contains("&amp;")) {
				sb = sb.replaceAll("&amp;", "&");
			}
			if (sb.contains("&nbsp;")) {
				sb = sb.replaceAll("&nbsp;", " ");
			}
			
			if (sb.contains("<strong>")) {
				sb = sb.replaceAll("<strong>", "1amS1rong");
			}
			if (sb.contains("</strong>")) {
				sb = sb.replaceAll("</strong>", "LostS1rength");
			}
			
			String result = sb;
			StringBuffer sbText = new StringBuffer();
			final int lastIndexClose = StringUtils.lastIndexOf(result, Constants.TAG_CLOSE);
			final int lastIndexOpen = StringUtils.lastIndexOf(result, Constants.TAG_OPEN);
			
			if (lastIndexClose > -1 && lastIndexClose < lastIndexOpen) {
				result = StringUtils.substring(result, 0, lastIndexClose + 1);
				sbText.append(result);
				//sbText.append(">");
				if (hasEllipsis) {
					// result +=* ELLIPSIS; Sonar Fix:StringBuffer used 
					sbText.append(Constants.ELLIPSIS);
				}
			} else if (lastIndexClose == -1 && lastIndexClose < lastIndexOpen) {
				result = StringUtils.substring(result, 0, lastIndexOpen);
				sbText.append(result);
				//sbText.append(">");
				if (hasEllipsis) {
					// result +=* ELLIPSIS; Sonar Fix:StringBuffer used 
					sbText.append(Constants.ELLIPSIS);
				}
			} else {
				sbText.append(result);
			}
			
			String excerpts = sbText.toString();
			boolean abbTag = StringUtils.endsWith(excerpts, "abbr>");
			
			if (abbTag) {
				int abbrclose = StringUtils.lastIndexOf(excerpts, "</abbr>");
				if (abbrclose < 0) {
					excerpts = excerpts.substring(0, excerpts.lastIndexOf("abbr>"));
				}
			}
			
			final int lastIndexclose = StringUtils.lastIndexOf(excerpts, Constants.TAG_STRONG_CLOSE);
			final int lastIndexopen = StringUtils.lastIndexOf(excerpts, Constants.TAG_STRONG_OPEN);
			
			if (lastIndexclose < lastIndexopen) {
				excerpts = excerpts.concat(Constants.TAG_STRONG_CLOSE);
			}
			
			logger.debug("Excerpts value -"+excerpts);
		}
		
		return excerpt;
	}
	
	private String processHTMLTags(String hitExcerptInput) {
		String leftE = "";
		//String midE = "";
		String rightE = "";
		String hitExcerpt = hitExcerptInput;
		
		if (hitExcerpt.contains("&lt;")) {
			hitExcerpt = hitExcerpt.replaceAll("&lt;", "<");
		}
		if (hitExcerpt.contains("&gt;")) {
			hitExcerpt = hitExcerpt.replaceAll("&gt;", ">");
		}
		if (hitExcerpt.contains("&quot;")) {
			hitExcerpt = hitExcerpt.replaceAll("&quot;", "'");
		}
		if (hitExcerpt.contains("&amp;")) {
			hitExcerpt = hitExcerpt.replaceAll("&amp;", "&");
		}
		
		//This is to encrypt <strong> before html tag removal
		//Will be replaced back once HTML is parsed
		if (hitExcerpt.contains("<strong>")) {
			hitExcerpt = hitExcerpt.replaceAll("<strong>", "S1r0n8PlaceHolder");
		}
		if (hitExcerpt.contains("</strong>")) {
			hitExcerpt = hitExcerpt.replaceAll("</strong>", "S1r0n8ClosePlaceHolder");
		}
		
		rightE = hitExcerpt;
		StringBuffer result = new StringBuffer();
		
		//hitExcerpt = "";
		while (rightE.indexOf('<') >= 0) {
			leftE = rightE.substring(0, rightE.indexOf('<'));
			rightE = rightE.substring(rightE.indexOf('<'), rightE.length());
			if (rightE.indexOf('>') >= 0) {
				//midE = rightE.substring(1, rightE.indexOf('>'));
				rightE = rightE.substring(rightE.indexOf('>') + 1, rightE.length());
			} else {
				//midE = rightE.substring(1, rightE.length());
				rightE = "";
			}
			//hitExcerpt += leftE;
			result.append(leftE);
		}
		
		//hitExcerpt += rightE;
		result.append(rightE);
		
		String excerpt = StringEscapeUtils.escapeHtml(StringEscapeUtils.unescapeHtml(result.toString()));
		
		//Decrypting the <strong> tag from the excerpt string
		excerpt = excerpt.replaceAll("S1r0n8PlaceHolder", "<strong>").replaceAll("S1r0n8ClosePlaceHolder", "</strong>");
		
		//out.println("final hitExcerpt = "+hitExcerpt); 
		
		excerpt = excerpt.replaceAll("&amp;apos", "&apos").replaceAll("&apos", "'").replaceAll("';", "'");
		excerpt = excerpt.replaceAll("&amp;amp", "&amp").replaceAll("&amp;", "&");
		
		return excerpt;
	}
	
	/**
	 * Split the search terms into separate strings.
	 * @return the String array
	 */
	
	/*
	 * private String[] splitKeywords() { return StringUtils.split(this.keyword, " \"',.-/+", 0); }
	 */
	
	/**
	 * Since the search result excerpts may contain unclosed HTML tags we need to make sure to remove them.
	 * @param excerpt the input string
	 * @return the cleaned up string
	 */
	private String removeTags(final String excerpt) {
		if (StringUtils.isNotEmpty(excerpt)) {
			
			final boolean hasEllipsis = StringUtils.endsWith(excerpt, Constants.ELLIPSIS);
			
			// remove all markup
			String sb = excerpt;
			
			if (sb.contains("&lt;")) {
				sb = sb.replaceAll("&lt;", "<");
			}
			if (sb.contains("&gt;")) {
				sb = sb.replaceAll("&gt;", ">");
			}
			if (sb.contains("&quot;")) {
				sb = sb.replaceAll("&quot;", "'");
			}
			if (sb.contains("&amp;")) {
				sb = sb.replaceAll("&amp;", "&");
			}
			if (sb.contains("&nbsp;")) {
				sb = sb.replaceAll("&nbsp;", " ");
			}
			
			String result = stripHTML(sb);
			
			StringBuffer sbText = new StringBuffer();
			
			final int lastIndexClose = StringUtils.lastIndexOf(result, Constants.TAG_CLOSE);
			final int lastIndexOpen = StringUtils.lastIndexOf(result, Constants.TAG_OPEN);
			
			if (lastIndexClose > -1 && lastIndexClose < lastIndexOpen) {
				result = StringUtils.substring(result, 0, lastIndexClose + 1);
				sbText.append(result);
				if (hasEllipsis) {
					// result +=* ELLIPSIS; Sonar Fix:StringBuffer used 
					sbText.append(Constants.ELLIPSIS);
				}
			} else {
				sbText.append(result);
			}
			
			return sbText.toString();
		}
		
		return excerpt;
	}
	
	/**
	 * Gets the node path.
	 * @return the node path
	 * @throws RepositoryException the repository exception
	 */
	public Node getNode() throws RepositoryException {
		return getPage();
	}
	
	
	/**
	 * Checks if is page.
	 * @param node the node
	 * @return true, if is page
	 * @throws RepositoryException the repository exception
	 */
	public boolean isPage(final Node node) throws RepositoryException {
		return (node.isNodeType(Constants.SEARCH_PAGE)) || (node.isNodeType(Constants.SEARCH_PSUEDOPAGE));
	}
	
	/**
	 * Gets the page or asset which is used to create url and get title..
	 * @return the page or asset
	 * @throws RepositoryException the repository exception
	 */
	private Node getPage() throws RepositoryException {
		Node node = this.hit.getNode();
		while ((!isPage(node)) && (node.getName().length() > 0)) {
			node = node.getParent();
		}
		return node;
	}
	
	/**
	 * Added this function for Defect no 9879. Gets the page title.
	 * @return the page title
	 * @throws RepositoryException the repository exception
	 */
	public String getPageTitleForSearchSuggestion() throws RepositoryException {
		final Node node = getNode();
		String title = null;
		if (isPage(node)) {
			final Node childNode = node.getNode(Constants.SEARCH_CONTENT);
			title = childNode.getProperty(Constants.JCR_TITLE).getValue().toString();
		}
		return title;
	}
	
	/**
	 * Gets the page title.
	 * @return the page title
	 * @throws RepositoryException the repository exception
	 */
	public String getPageTitle() throws RepositoryException {
		final Node node = getNode();
		String title = null;
		if (isPage(node)) {
			final Node childNode = node.getNode(Constants.SEARCH_CONTENT);
			title = childNode.getProperty(Constants.JCR_TITLE).getValue().toString();
		}
		return truncate(title, maxLength);
	}
	
	/**
	 * @param value the String
	 * @param length the integer
	 * @return the String value
	 */
	public String truncate(String value, final int length) {
		if (value != null && value.length() > length) {
			value = value.substring(0, length).concat(Constants.ELLIPSIS);
		}
		return value;
	}
	
	/**
	 * @return
	 */
	public Hit getHit() {
		return this.hit;
		
	}
	
	public String getKeyword() {
		return this.keyword;
	}
	

	
	private  String stripHTML(String text) {
		return text.replaceAll(Constants.PATTERN_HTML, StringUtils.EMPTY);
	}
	
	
}
