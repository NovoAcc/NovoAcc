package com.dupont.phoenix.mchlm.beans;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.dupont.phoenix.commons.TaxonomyFacet;
import com.dupont.phoenix.commons.services.search.ContentType;
import com.dupont.phoenix.list.ListItem;

@SuppressWarnings("serial")
public class ViewAllBean implements Serializable{

	private List<ContentType> contentTypesFacets;
	private boolean corporateMCLP;
	private String preFilterContentTypes;
	private List<TaxonomyFacet> taxonomyFilters;
	private Map<String, Set<String>> facetsMappings;
	private List<ListItem> results;
	private String facetMappingsJson;
	private String sitecatalystValue;
	
	
	public String getFacetMappingsJson() {
		return facetMappingsJson;
	}

	public void setFacetMappingsJson(String facetMappingsJson) {
		this.facetMappingsJson = facetMappingsJson;
	}

	public Map<String, Set<String>> getFacetsMappings() {
		return facetsMappings;
	}

	public void setFacetsMappings(Map<String, Set<String>> facetsMappings2) {
		this.facetsMappings = facetsMappings2;
	}

	public List<TaxonomyFacet> getTaxonomyFilters() {
		return taxonomyFilters;
	}

	public void setTaxonomyFilters(List<TaxonomyFacet> taxonomyFilters) {
		this.taxonomyFilters = taxonomyFilters;
	}

	public String getPreFilterContentTypes() {
		return preFilterContentTypes;
	}

	public void setPreFilterContentTypes(String preFilterContentTypes) {
		if(null!=preFilterContentTypes){
		this.preFilterContentTypes = preFilterContentTypes;
		}
	}

	public boolean isCorporateMCLP() {
		return corporateMCLP;
	}

	public void setCorporateMCLP(boolean corporateMCLP) {
		this.corporateMCLP = corporateMCLP;
	}

	public List<ContentType> getContentTypesFacets() {
		return contentTypesFacets;
	}

	public void setContentTypesFacets(List<ContentType> contentTypesFacets) {
		this.contentTypesFacets = contentTypesFacets;
	}

	public List<ListItem> getResults() {
		return results;
	}

	public void setResults(List<ListItem> results) {
		this.results = results;
	}

	/**
	 * @return the sitecatalystValue
	 */
	public String getSitecatalystValue() {
		return sitecatalystValue;
	}

	/**
	 * @param sitecatalystValue the sitecatalystValue to set
	 */
	public void setSitecatalystValue(String sitecatalystValue) {
		this.sitecatalystValue = sitecatalystValue;
	}

}

