package com.dupont.phoenix.commons;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import com.day.cq.tagging.Tag;
import com.dupont.phoenix.Global;

public class TaxonomyFacet {
	
	public TaxonomyFacet(Tag tag, Locale locale, Set<String> alltags){
		this.tagId = tag.getTagID();
		this.tagTitlePath=tag.getTitlePath(locale);
		this.tagTitle=tag.getTitle(locale);
		this.tagName=tag.getName();
		this.taxonomyText = Global.removeNameSpace(tag.getTagID());
		setChildTags(tag.listChildren(), locale, alltags);
	}
	
	String tagId;
	
	String tagTitlePath;
	
	String tagTitle;
	
	String tagName;
	
	String taxonomyText;
	
	String contentType;
	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	/**
	 * @return the taxonomyText
	 */
	public String getTaxonomyText() {
		return taxonomyText;
	}

	/**
	 * @param taxonomyText the taxonomyText to set
	 */
	public void setTaxonomyText(String taxonomyText) {
		this.taxonomyText = taxonomyText;
	}

	List<TaxonomyFacet> childTags;

	public String getTagId() {
		return tagId;
	}

	public void setTagId(String tagId) {
		this.tagId = tagId;
	}

	public String getTagPath() {
		return tagTitlePath;
	}

	public void setTagPath(String tagTitlePath) {
		this.tagTitlePath = tagTitlePath;
	}

	public String getTagTitle() {
		return tagTitle;
	}

	public void setTagTitle(String tagTitle) {
		this.tagTitle = tagTitle;
	}

	public List<TaxonomyFacet> getChildTags() {
		return childTags;
	}

	public void setChildTags(Iterator<Tag> listChildern, Locale locale, Set<String> alltags) {
		List<TaxonomyFacet> childsTags = null;
		if(null!=listChildern){
			childsTags = new ArrayList<TaxonomyFacet>();
			while(listChildern.hasNext()){
				Tag childTag = listChildern.next();
				if(alltags.contains(childTag.getTagID())){
				TaxonomyFacet child = new TaxonomyFacet(childTag, locale, alltags);
				childsTags.add(child);
				}
			}
		}
		this.childTags = childsTags;
	}

	public String getTagTitlePath() {
		return tagTitlePath;
	}

	public void setTagTitlePath(String tagTitlePath) {
		this.tagTitlePath = tagTitlePath;
	}

	public String getTagName() {
		return tagName;
	}

	public void setTagName(String tagName) {
		this.tagName = tagName;
	}
	

}
