package com.dupont.phoenix.commons.services.search;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.jcr.Session;

import org.apache.commons.lang.StringUtils;

import com.day.cq.search.Predicate;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.SearchResult;
import com.day.text.Text;


public class SearchServiceHelper {



	/**
	 * This method add all the request parameters to Predicate list i.e. tags, language, sort criteria and sort order.
	 * @param searchParameters the search parameters
	 * @return the list
	 */
	public List<Predicate> createPredicate(final SearchParameters searchParameters) {
		final List<Predicate> customPredicates = new ArrayList<Predicate>();
		int countTag = 0;
		
		// If tags are present in search parameters then add all the tags to tag predicate list
		if (searchParameters.getTags() != null && !searchParameters.getTags().isEmpty()
				&& searchParameters.getParentTags() == null) {
			Predicate tagPredicate;
			for (String tagid : searchParameters.getTags()) {
				countTag++;
				tagPredicate = this.getNewPredicate(Constants.SEARCH_TAG + countTag, Constants.SEARCH_PROPERTY);
				tagPredicate.set(Constants.SEARCH_PROPERTY, Constants.SEARCH_TAGPATH);
				tagPredicate.set(Constants.SEARCH_VALUE, tagid + Constants.PERCENTAGE);
				tagPredicate.set(Constants.SEARCH_OPERATION, Constants.SEARCH_OPERATION_LIKE);
				tagPredicate.set(Constants.SEARCH_TAG, Constants.SEARCH_TAGS);
				customPredicates.add(tagPredicate);
			}
		} else {
			Predicate tagPredicate = new Predicate(Constants.SEARCH_TAGS, Constants.TAG_ID);
			tagPredicate.set(Constants.SEARCH_PROPERTY, Constants.SEARCH_TAGPATH);
			tagPredicate.set(Constants.TAG_ID, null);
			customPredicates.add(tagPredicate);
		}
		
		// Add search paths to the predicate list.
		countTag = 0;
		if (searchParameters.getPagePaths() != null && !searchParameters.getPagePaths().isEmpty()) {
			Predicate pathPredicate;
			for (String path : searchParameters.getPagePaths()) {
				countTag++;
				pathPredicate = this.getNewPredicate(Constants.SEARCH_PATH + countTag, Constants.SEARCH_PATH);
				pathPredicate.set(Constants.SEARCH_PATH, path);
				customPredicates.add(pathPredicate);
			}
		}
		
		// Set language to tag predicate list
		if (null != searchParameters.getLanguage()) {
			final Predicate languagePredicate = new Predicate(Constants.SEARCH_LANGUAGES, Constants.SEARCH_LANGUAGE);
			languagePredicate.set(Constants.SEARCH_LANGUAGE, searchParameters.getLanguage());
			customPredicates.add(languagePredicate);
		}
		
		// Add parent tags to the predicate list.
		countTag = 0;
		if (searchParameters.getParentTags() != null && !searchParameters.getParentTags().isEmpty()) {
			Predicate parentTagPredicate;
			for (SearchParentTag parentTagEntry : searchParameters.getParentTags()) {
				countTag++;
				parentTagPredicate = this.getNewPredicate(Constants.SEARCH_PARENT_TAG + countTag,
						Constants.SEARCH_PROPERTY);
				parentTagPredicate.set(Constants.SEARCH_PROPERTY, parentTagEntry.getTagPath());
				parentTagPredicate.set(Constants.SEARCH_VALUE, parentTagEntry.getTagId() + Constants.PERCENTAGE);
				parentTagPredicate.set(Constants.SEARCH_OPERATION, Constants.SEARCH_OPERATION_LIKE);
				parentTagPredicate.set(Constants.SEARCH_PARENT_TAG, Constants.PARENT_TAGS);
				customPredicates.add(parentTagPredicate);
			}
		}
		
		// Add sort orders to the predicate list.
		countTag = 0;
		if (searchParameters.getSortOrder() != null && !searchParameters.getSortOrder().isEmpty()) {
			Predicate orderByPredicate;
			for (SortOrder sortOrder : searchParameters.getSortOrder()) {
				orderByPredicate = this.getNewPredicate(Constants.SEARCH_ORDERBY + countTag, Constants.SEARCH_ORDERBY);
				orderByPredicate.set(Constants.SEARCH_ORDERBY, sortOrder.getSortCriteria());
				orderByPredicate.set(Constants.SEARCH_SORT, sortOrder.getOrder());
				customPredicates.add(orderByPredicate);
				countTag++;
			}
		}
		
		return customPredicates;
	}
	
	/**
	 * Creates group so that all the criteria's for keyword search can be or'ed. in the query For eg: It creates adds
	 * key-value to map - mapKeyword, Eg: {group.2_fulltext=top, group.0_fulltext=top,
	 * group.0_fulltext.relPath=jcr:content, path=/content, group.2_fulltext.relPath=jcr:content/@jcr:description,
	 * group.1_fulltext.relPath=jcr:content/@jcr:title,type=nt:hierarchyNode, group.1_fulltext=top, group.p.or=true}
	 * @param keyword the query string
	 * @param mapKeyword the map keyword
	 * @param searchParameters the search parameters
	 * @param disallowPartialKeywordSearch the disallow partial keyword search
	 * @return the map
	 */
	private Map<String, String> createKeywordMap(final String keyword, final Map<String, String> mapKeyword,
			final SearchParameters searchParameters, boolean disallowPartialKeywordSearch) {
		
		int counter = 0;
		
		// create a map with group.p.or as key and true as value so that all
		// the criteria's inside group can be
		// or'ed in the query
		mapKeyword.put(Constants.SEARCH_GROUP_P_OR, Boolean.TRUE.toString());
		mapKeyword.put(Constants.SEARCH_GROUP_P_AND, Boolean.FALSE.toString());
		
		if (searchParameters.isSpecialsSearch()) {
			mapKeyword.put(Constants.SEARCH_GROUP_P_AND, Boolean.TRUE.toString());
			mapKeyword.put(Constants.SEARCH_GROUP_P_OR, Boolean.FALSE.toString());
		}
		// Add predicate for keyword search
		if (StringUtils.isNotBlank(keyword)) {
			if (disallowPartialKeywordSearch || keyword.contains("'")) {
				mapKeyword.put(Constants.SEARCH_GROUP + counter + Constants.SEARCH_FULLTEXT,
						StringUtils.replaceChars(keyword, '-', ' '));
			} else {
				mapKeyword.put(Constants.SEARCH_GROUP + counter + Constants.SEARCH_FULLTEXT,
						Constants.SEARCH_REGEX_ASTERIX + StringUtils.replaceChars(keyword, '-', ' ')
								+ Constants.SEARCH_REGEX_ASTERIX);
			}
			counter++;
		}
		
		if (searchParameters.getSearchPropertyDtos() != null && !searchParameters.getSearchPropertyDtos().isEmpty()) {
			
			for (SearchProperty searchProperty : searchParameters.getSearchPropertyDtos()) {
				
				// Format the property in correct format
				final StringBuilder propertyPath = this.getStringBuilderInstance();
				if (!Constants.SEARCH_STRING_DOT.equals(searchProperty.getProperty())) {
					// Returns an array of strings decomposed of the
					// original
					// string, split at every occurrence of '/'
					final String[] segments = Text.explode(searchProperty.getProperty(), Constants.SEARCH_PROPERTY_47);
					for (int i = 0; i < segments.length; i++) {
						if (i == segments.length - 1) {
							propertyPath.append(Constants.SEARCH_STRING_AT_THE_RATE);
							propertyPath.append(segments[i]);
							break;
						}
						propertyPath.append(segments[i]);
						propertyPath.append(Constants.SEARCH_STRING_FORWARD_SLASH);
					}
				}
				
				if (StringUtils.isBlank(searchProperty.getOperation())
						|| Constants.SEARCH_OPERATION_CONTAINS.equals(searchProperty.getOperation())) {
					mapKeyword.put(Constants.SEARCH_GROUP + counter + Constants.SEARCH_FULLTEXT,
							searchProperty.getValue());
					mapKeyword.put(Constants.SEARCH_GROUP + counter + Constants.SEARCH_FULLTEXT_RELPATH,
							propertyPath.toString());
				} else if (StringUtils.isEmpty(searchProperty.getValue())) {
					mapKeyword.put(Constants.SEARCH_GROUP + counter + Constants.SEARCH_UNDERSCORE
							+ Constants.SEARCH_PROPERTY, propertyPath.toString());
					mapKeyword.put(Constants.SEARCH_GROUP + counter + Constants.SEARCH_UNDERSCORE
							+ Constants.SEARCH_PROPERTY+"."+Constants.SEARCH_OPERATION, searchProperty.getOperation());
				}
				else if (StringUtils.isNotEmpty(searchProperty.getValue())) {
					mapKeyword.put(Constants.SEARCH_GROUP + counter + Constants.SEARCH_UNDERSCORE
							+ Constants.SEARCH_PROPERTY, "fn:lower-case(" + propertyPath.toString() + ")");
					mapKeyword
							.put(Constants.SEARCH_GROUP + counter + Constants.SEARCH_UNDERSCORE+ Constants.SEARCH_PROPERTY+"."
									+ Constants.SEARCH_VALUE, Constants.PERCENTAGE + searchProperty.getValue().toLowerCase()
									+ Constants.PERCENTAGE);
					mapKeyword.put(Constants.SEARCH_GROUP + counter + Constants.SEARCH_UNDERSCORE+ Constants.SEARCH_PROPERTY+"."
							+ Constants.SEARCH_OPERATION, searchProperty.getOperation());
				}
				counter++;
			}
		}
		
		return mapKeyword;
	}
	
	/**
	 * Creates group so that all the criteria's for tag search can be or'ed in the query. For eg: It creates a map of
	 * this type: {group.2_tagid=marketing:interest/business, group.1_tagid=marketing:interest/investor,
	 * group.2_tagid.property=jcr:content/cq:tags, group.p.or=true, group.1_tagid.property=jcr:content/cq:tags}
	 * @param customPredicates the custom predicates
	 * @return the map
	 */
	public Map<String, String> createTagMap(final List<Predicate> customPredicates) {
		
		final Map<String, String> tagMap = new HashMap<String, String>();
		int counterTags;
		// create a map with group.p.or as key and true as value so that all the criteria's inside group can be
		// or'ed in the query
		tagMap.put(Constants.SEARCH_GROUP_P_OR, Boolean.TRUE.toString());
		counterTags = 0;
		// Create a map of tag id's and path
		for (Predicate predicate : customPredicates) {
			if (Constants.TAG_ID.equalsIgnoreCase(predicate.getType())) {
				counterTags++;
				tagMap.put(Constants.SEARCH_GROUP + counterTags + "_" + predicate.getType(),
						predicate.get(Constants.TAG_ID));
				tagMap.put(Constants.SEARCH_GROUP + counterTags + "_" + predicate.getType() + Constants.SEARCH_STRING_DOT
						+ Constants.SEARCH_PROPERTY, predicate.get(Constants.SEARCH_PROPERTY));
			}
			
		}
		
		return tagMap;
		
	}
	
	/**
	 * Gets the search result on basis of search parameters. Creates an xpath query and then return appropriate result
	 * on basis on query formed using search parameters.
	 * @param searchParameters the search parameters
	 * @param customPredicates the custom predicates
	 * @param session the session
	 * @param queryBuilder the query builder
	 * @return the search result
	 */
	public SearchResult getSearchResult(final SearchParameters searchParameters,
			final List<Predicate> customPredicates, final Session session, final QueryBuilder queryBuilder) {

			final String queryString = searchParameters.getKeyword();
			if (((customPredicates.isEmpty()) && (searchParameters.getTags() == null || searchParameters.getTags()
					.isEmpty())) || session == null || queryBuilder == null) {
				
				return null;
			}
			
			Map<String, String> searchMap = new LinkedHashMap<String, String>();
			
			// To check if node type is present in custom predicate
			boolean typeOverwrite = false;
			for (Predicate predicate : customPredicates) {
				if (Constants.SEARCH_TYPE.equals(predicate.getName())) {
					typeOverwrite = true;
					break;
					
				}
			}
			// If node type is not present in custom predicate add it to map.
			if (!typeOverwrite) {
				if (StringUtils.isNotBlank(searchParameters.getSearchType())) {
					searchMap.put(Constants.SEARCH_TYPE, searchParameters.getSearchType());
				} else {
					searchMap.put(Constants.SEARCH_TYPE, Constants.SEARCH_NODE_TYPE);
				}
			}
			
			// Creates a map with keyword and search properties as criteria
			if ((null != searchParameters.getSearchPropertyDtos() && !searchParameters.getSearchPropertyDtos().isEmpty())
					|| (StringUtils.isNotEmpty(queryString))) {
				searchMap = this.createKeywordMap(queryString, searchMap, searchParameters, true);
			}
			
			if (searchParameters.getResultsPerPage() < 0) {
				searchMap.put(Constants.SEARCH_LIMIT, Long.toString(searchParameters.getResultsPerPage()));
			}
			
			// Build a query with keyword and search properties
			final Query query = queryBuilder.createQuery(PredicateGroup.create(searchMap), session);
			
			
			// Fetch and add Parent Tag predicates to query
			final Map<String, String> parentTagMap = this.createParentTagMap(customPredicates);
			if (null != parentTagMap) {
				query.getPredicates().add(PredicateGroup.create(parentTagMap));
			}
			
			// Fetch and add Search Path predicates to query
			final Map<String, String> pathMap = this.createPathsMap(customPredicates);
			query.getPredicates().add(PredicateGroup.create(pathMap));
			
			// Fetch and add any individual predicates to query
			for (Predicate predicate : customPredicates) {
				if (!Constants.TAGS.equalsIgnoreCase(predicate.get(Constants.TAG))
						&& !predicate.getType().equalsIgnoreCase(Constants.SEARCH_PATH)
						&& !Constants.PARENT_TAGS.equalsIgnoreCase(predicate.get(Constants.PARENT_TAG))) {
					query.getPredicates().add(predicate);
				}
			}
			
			// setting start for pagination. Defines the start for next and previous page
			query.setStart(searchParameters.getStart());
			query.setExcerpt(true);
			// Required for pagination. Defines number of results to be displayed per page
			if (searchParameters.getResultsPerPage() > 0) {
				query.setHitsPerPage(searchParameters.getResultsPerPage());
			}
			
			return query.getResult();
	}
	
	
	
	/**
	 * Creates a new predicate instance for the input predicate identifier and the predicate property.
	 * @param predicateName The identifier of the predicate.
	 * @param predicateProperty The property for which predicate is being created.
	 * @return A new instance of predicate.
	 */
	private Predicate getNewPredicate(String predicateName, String predicateProperty) {
		return new Predicate(predicateName, predicateProperty);
	}
	
	/**
	 * Creates and returns a StringBuilder instance.
	 * @return A new StringBuilder instance.
	 */
	private StringBuilder getStringBuilderInstance() {
		return new StringBuilder();
	}
	
	/**
	 * Creates a predicate group for the parent tags.
	 * @param customPredicates The list of predicates.
	 * @return The map for predicate group for the parent tags.
	 */
	private Map<String, String> createParentTagMap(final List<Predicate> customPredicates) {
		Map<String, String> parentTagMap = null;
		int counterTags = 0;
		
		// Create a map of Parent Tag Id predicates
		for (Predicate predicate : customPredicates) {
			if (Constants.PARENT_TAGS.equalsIgnoreCase(predicate.get(Constants.PARENT_TAG))) {
				counterTags++;
				if (null == parentTagMap) {
					parentTagMap = this.getNewHashMap();
				}
				parentTagMap.put(Constants.SEARCH_GROUP_P_OR, Boolean.TRUE.toString());
				parentTagMap.put(
						Constants.SEARCH_GROUP + counterTags + Constants.SEARCH_UNDERSCORE + predicate.getType(),
						predicate.get(Constants.SEARCH_PROPERTY));
				parentTagMap.put(
						Constants.SEARCH_GROUP + counterTags + Constants.SEARCH_UNDERSCORE + predicate.getType()
								+ Constants.SEARCH_STRING_DOT + Constants.SEARCH_OPERATION,
						Constants.SEARCH_OPERATION_LIKE);
				parentTagMap.put(
						Constants.SEARCH_GROUP + counterTags + Constants.SEARCH_UNDERSCORE + predicate.getType()
								+ Constants.SEARCH_STRING_DOT + Constants.SEARCH_VALUE,
						predicate.get(Constants.SEARCH_VALUE));
			}
		}
		
		return parentTagMap;
	}
	
	/**
	 * Creates a predicate group for the search paths.
	 * @param customPredicates The list of predicates.
	 * @return The map for predicate group for the search paths.
	 */
	private Map<String, String> createPathsMap(final List<Predicate> customPredicates) {
		final Map<String, String> tagMap = getNewHashMap();
		int counterTags = 0;
		tagMap.put(Constants.SEARCH_GROUP_P_OR, Boolean.TRUE.toString());
		// Create a map of Search Path predicates
		for (Predicate predicate : customPredicates) {
			if (Constants.SEARCH_PATH.equalsIgnoreCase(predicate.getType())) {
				counterTags++;
				tagMap.put(Constants.SEARCH_GROUP + counterTags + Constants.SEARCH_UNDERSCORE + predicate.getType(),
						predicate.get(Constants.SEARCH_PATH));
				
			}
			
		}
		return tagMap;
	}
	
	/**
	 * Gets the new hash map.
	 * @return the new hash map
	 */
	private Map<String, String> getNewHashMap() {
		return new HashMap<String, String>();
	}
}
