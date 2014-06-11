package com.dupont.phoenix.commons.services.search;

import java.util.ArrayList;
import java.util.List;

import com.day.cq.commons.jcr.JcrConstants;

public final class Constants implements JcrConstants {

	
	/** The Constant SEARCH_TAG. */
	public static final String SEARCH_TAG = "tag";
	
	/** The Constant SEARCH_MIMETYPE. */
	public static final String SEARCH_MIMETYPE = "mimeType";
	
	/** The Constant SEARCH_PROPERTY. */
	public static final String SEARCH_PROPERTY = "property";
	
	/** The Constant SEARCH_TAGPATH. */
	public static final String SEARCH_TAGPATH = "jcr:content/cq:tags";
	
	/** The Constant SEARCH_VALUE. */
	public static final String SEARCH_VALUE = "value";
	
	/** The Constant SEARCH_OPERATION. */
	public static final String SEARCH_OPERATION = "operation";
	
	/** The Constant SEARCH_OPERATION_LIKE. */
	public static final String SEARCH_OPERATION_LIKE = "like";
	
	/** The Constant SEARCH_TAGS. */
	public static final String SEARCH_TAGS = "tags";
	
	/** The Constant TAG_ID. */
	public static final String TAG_ID = "tagid";
	
	/** The Constant SEARCH_PATH. */
	public static final String SEARCH_PATH = "path";
	
	/** The Constant SEARCH_LANGUAGES. */
	public static final String SEARCH_LANGUAGES = "languages";
	
	/** The Constant SEARCH_LANGUAGE. */
	public static final String SEARCH_LANGUAGE = "language";
	
	/** The Constant SEARCH_PARENT_TAG. */
	public static final String SEARCH_PARENT_TAG = "parentTag";
	
	/** The Constant SEARCH_ORDERBY. */
	public static final String SEARCH_ORDERBY = "orderby";
	
	/** The Constant SEARCH_SORT. */
	public static final String SEARCH_SORT = "sort";
	
	/** The Constant SEARCH_GROUP_P_OR. */
	public static final String SEARCH_GROUP_P_OR = "group.p.or";
	
	/** The Constant SEARCH_GROUP_P_AND. */
	public static final String SEARCH_GROUP_P_AND = "group.p.and";
	
	/** The Constant SEARCH_GROUP. */
	public static final String SEARCH_GROUP = "group.";
	
	/** The Constant SEARCH_FULLTEXT. */
	public static final String SEARCH_FULLTEXT = "_fulltext";
	
	/** The Constant SEARCH_REGEX_ASTERIX. */
	public static final String SEARCH_REGEX_ASTERIX = "*";
	
	/** The Constant SEARCH_STR1. */
	public static final String SEARCH_STRING_DOT = ".";
	
	/** The Constant SEARCH_PROP_47. */
	public static final int SEARCH_PROPERTY_47 = 47;
	
	/** The Constant SEARCH_STR3. */
	public static final String SEARCH_STRING_AT_THE_RATE = "@";
	
	/** The Constant SEARCH_STR2. */
	public static final String SEARCH_STRING_FORWARD_SLASH = "/";
	
	/** The Constant SEARCH_OPERATION_CONTAINS. */
	public static final String SEARCH_OPERATION_CONTAINS = "contains";
	
	/** The Constant SEARCH_FULLTEXT_RELPATH. */
	public static final String SEARCH_FULLTEXT_RELPATH = "_fulltext.relPath";
	
	/** The Constant SEARCH_UNDERSCORE. */
	public static final String SEARCH_UNDERSCORE = "_";
	
	/** The Constant SEARCH_TYPE. */
	public static final String SEARCH_TYPE = "type";
	
	/** The Constant SEARCH_NODE_TYPE. */
	public static final String SEARCH_NODE_TYPE = "nt:hierarchyNode";
	
	/** The Constant SEARCH_PAGE. */
	public static final String SEARCH_PAGE = "cq:Page";
	
	/** The Constant SEARCH_PSUEDOPAGE. */
	public static final String SEARCH_PSUEDOPAGE = "cq:PseudoPage";
	
	/** The Constant SEARCH_CONTENT. */
	public static final String SEARCH_CONTENT = "jcr:content";
	
	/** The Constant REQUEST_PARAM_START_INDEX. */
	public static final String REQUEST_PARAM_START_INDEX = "startindex";
	
	
	/** The Constant TAGS. */
	public static final String TAGS = "tags";
	
	/** The Constant TAG. */
	public static final String TAG = "tag";
	
	/** The Constant PARENT_TAG. */
	public static final String PARENT_TAG = "parentTag";
	
	/** The Constant PARENT_TAGS. */
	public static final String PARENT_TAGS = "parentTags";
	
	/** The Constant PERCENTAGE. */
	public static final String PERCENTAGE = "%";
	
	/** The Constant SEARCH_LIMIT. */
	public static final String SEARCH_LIMIT = "p.limit";
	
	

	
	public static final String TAG_STRONG_CLOSE = "</strong>";
	public static final String TAG_STRONG_OPEN = "<strong>";
	
	public static final String TAG_CLOSE = ">";
	public static final String TAG_OPEN = "<";
	
	public static final String ELLIPSIS = "...";
	/** HTML tags pattern. */
	public static final String PATTERN_HTML = "\\<.*?>";
	
	/**
	 * The Enum SortType.
	 */
	public enum SortType {
		
		/** The alphabatical a. */
		ALPHABATICAL_A("alphabeticalA"),
		
		/** The alphabatical z. */
		ALPHABATICAL_Z("alphabeticalZ"),
		
		/** The new to old. */
		NEW_TO_OLD("newtoOld"),
		
		/** The old to new. */
		OLD_TO_NEW("oldtoNew"),
		
		/** The old to new. */
		NEW_TO_DATE("@start"),
		
		/** The most recent. */
		MOST_RECENT("mostRecent"),
		
		/** The most relevant. */
		MOST_RELEVANT("mostRelevant");
		
		/** The value. */
		private String value;
		
		/**
		 * Instantiates a new item type.
		 * @param value the value
		 */
		SortType(final String value) {
			this.value = value;
		}
		
		/**
		 * Gets the value.
		 * @return the value
		 */
		public String getValue() {
			return this.value;
		}
	}
	/** The Constant JCR_CONTENT_JCR_TITLE. */
	public static final String JCR_CONTENT_JCR_TITLE = "@jcr:content/jcr:title";
	
	/** The Constant CQ_LAST_REPLICATED. */
	public static final String CQ_LAST_REPLICATED = "@jcr:content/cq:lastReplicated";
	
	/** The Constant DEFAULT_START_INDEX. */
	public static final long DEFAULT_START_INDEX = 0;
	
	/** The Constant DESC. */
	private static final String DESC = "desc";
	
	/** The Constant ASC. */
	private static final String ASC = "asc";
	
	public static List<SortOrder> setSortCriteria(String sortCriteria) {
		List<SortOrder> sortOrder = new ArrayList<SortOrder>();
		if (SortType.ALPHABATICAL_A.getValue().equalsIgnoreCase(sortCriteria)) {
			SortOrder sortOrder1 = new SortOrder(JCR_CONTENT_JCR_TITLE, ASC);
			sortOrder.add(sortOrder1);
		} else if (SortType.ALPHABATICAL_Z.getValue().equalsIgnoreCase(sortCriteria)) {
			SortOrder sortOrder1 = new SortOrder(JCR_CONTENT_JCR_TITLE, DESC);
			sortOrder.add(sortOrder1);
		} else if (SortType.NEW_TO_OLD.getValue().equalsIgnoreCase(sortCriteria)
				|| (SortType.MOST_RECENT.getValue()).equalsIgnoreCase(sortCriteria)) {
			SortOrder sortOrderDefault = new SortOrder(CQ_LAST_REPLICATED, DESC);
			sortOrder.add(sortOrderDefault);
		} else if (SortType.OLD_TO_NEW.getValue().equalsIgnoreCase(sortCriteria)) {
			SortOrder sortOrderDefault = new SortOrder(CQ_LAST_REPLICATED, ASC);
			sortOrder.add(sortOrderDefault);
		} else if (SortType.MOST_RELEVANT.getValue().equalsIgnoreCase(sortCriteria)) {
			SortOrder sortOrderDefault = new SortOrder(JCR_SCORE, DESC);
			sortOrder.add(sortOrderDefault);
		}
		return sortOrder;
	} 
	
}