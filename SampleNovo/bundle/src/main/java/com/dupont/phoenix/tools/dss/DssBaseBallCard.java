package com.dupont.phoenix.tools.dss;

import org.apache.commons.lang.Validate;
import org.apache.sling.api.resource.Resource;

import com.dupont.phoenix.tools.BaseballCard;
import com.day.cq.wcm.foundation.Image;
import com.dupont.phoenix.commons.Scene7Image;

public class DssBaseBallCard extends BaseballCard {

	/* DSS Expert */
	private String expertName;
	private String expertOrganization;
	private String expertPosition;
	private String expertBioTitle;
	private String expertBio;
	private String expertLink;
	private String expertPresentationTitle;
	private String expertPresentationLink;
	private String expertPresentationDescription;
	private boolean hasSubArea;
	private String subAreaShortText;
	private String subAreaTitle;
	private String subAreaDescription;
	private String subAreaLinkText;
	private String subAreaLink;
	private boolean hasLinkedinArea;
	private String linkedinLinkText;
	private String linkedinLink;
	private Image thumbnail;
	private String primaryColor;
	private String secondaryColor;
	
	public DssBaseBallCard(Resource resource) {
		super(resource);
		init();
		
	}
	
	private void init(){
		setExpertName(properties.get("baseballCardBioName","Value not set."));
		setExpertOrganization(properties.get("baseballCardBioOrganization",""));
		setExpertPosition(properties.get("baseballCardBioPosition",""));
		setExpertBioTitle(properties.get("baseballCardBioTitle","Value not set."));
		setExpertBio(properties.get("baseballCardShortBioDescription",""));
		setExpertLink(checkLink(properties.get("baseballCardShortBiolink","")));
		setExpertPresentationTitle(properties.get("baseballCardPresentationLinkText",""));
		setExpertPresentationLink(checkLink(properties.get("baseballCardPresentationLink","")));
		setExpertPresentationDescription(properties.get("baseballCardBioPresentationDescription",""));
		setHasSubArea(properties.get("baseballCardHasSubArea",false));
		setPrimaryColor(properties.get("baseballCardPrimaryColor",""));
		setSecondaryColor(properties.get("baseballCardSecondaryColor",""));
		if(hasSubArea){
			setSubAreaTitle(properties.get("baseballCardRelatedTitle",""));
			setSubAreaShortText(properties.get("baseballCardRelatedShortText",""));
			setSubAreaDescription(properties.get("baseballCardRelatedDescription",""));
			setSubAreaLinkText(properties.get("baseballCardRelatedLinkText",""));
			setSubAreaLink(checkLink(properties.get("baseballCardRelatedLink","")));
		}
		setHasLinkedinArea(properties.get("baseballCardHasLinkedin",false));
		if(hasLinkedinArea){
			setLinkedinLinkText(properties.get("baseballCardLinkedinLinkText",""));
			setLinkedinLink(properties.get("baseballCardLinkedinLink",""));
		}
		thumbnail = new Scene7Image(resource,"thumbnail");
		if(thumbnail != null && thumbnail.hasContent()){
			thumbnail.setSelector(".img");
		}
	}
	
	public String getExpertName() {
		return expertName;
	}

	public void setExpertName(String expertName) {
		this.expertName = expertName;
	}

	public String getExpertPosition() {
		return expertPosition;
	}

	public void setExpertPosition(String expertPosition) {
		this.expertPosition = expertPosition;
	}

	public String getExpertBioTitle() {
		return expertBioTitle;
	}

	public void setExpertBioTitle(String expertBioTitle) {
		this.expertBioTitle = expertBioTitle;
	}

	public String getExpertBio() {
		return expertBio;
	}

	public void setExpertBio(String expertBio) {
		this.expertBio = expertBio;
	}

	public String getExpertLink() {
		return expertLink;
	}

	public void setExpertLink(String expertLink) {
		this.expertLink = expertLink;
	}

	public String getExpertPresentationTitle() {
		return expertPresentationTitle;
	}

	public void setExpertPresentationTitle(String expertPresentationTitle) {
		this.expertPresentationTitle = expertPresentationTitle;
	}

	public String getExpertPresentationLink() {
		return expertPresentationLink;
	}

	public void setExpertPresentationLink(String expertPresentationLink) {
		this.expertPresentationLink = expertPresentationLink;
	}

	public String getExpertPresentationDescription() {
		return expertPresentationDescription;
	}

	public void setExpertPresentationDescription(
			String expertPresentationDescription) {
		this.expertPresentationDescription = expertPresentationDescription;
	}

	public boolean isHasSubArea() {
		return hasSubArea;
	}

	public void setHasSubArea(boolean hasSubArea) {
		this.hasSubArea = hasSubArea;
	}

	public String getSubAreaShortText() {
		return subAreaShortText;
	}

	public void setSubAreaShortText(String subAreaShortText) {
		this.subAreaShortText = subAreaShortText;
	}

	public String getSubAreaTitle() {
		return subAreaTitle;
	}

	public void setSubAreaTitle(String subAreaTitle) {
		this.subAreaTitle = subAreaTitle;
	}

	public String getSubAreaDescription() {
		return subAreaDescription;
	}

	public void setSubAreaDescription(String subAreaDescription) {
		this.subAreaDescription = subAreaDescription;
	}

	public String getSubAreaLinkText() {
		return subAreaLinkText;
	}

	public void setSubAreaLinkText(String subAreaLinkText) {
		this.subAreaLinkText = subAreaLinkText;
	}

	public String getSubAreaLink() {
		return subAreaLink;
	}

	public void setSubAreaLink(String subAreaLink) {
		this.subAreaLink = subAreaLink;
	}

	public boolean isHasLinkedinArea() {
		return hasLinkedinArea;
	}

	public void setHasLinkedinArea(boolean hasLinkedinArea) {
		this.hasLinkedinArea = hasLinkedinArea;
	}

	public String getLinkedinLinkText() {
		return linkedinLinkText;
	}

	public void setLinkedinLinkText(String linkedinLinkText) {
		this.linkedinLinkText = linkedinLinkText;
	}

	public String getLinkedinLink() {
		return linkedinLink;
	}

	public void setLinkedinLink(String linkedinLink) {
		this.linkedinLink = linkedinLink;
	}

	public Image getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(Image thumbnail) {
		this.thumbnail = thumbnail;
	}

	public void setPrimaryColor(String primaryColor) {
		this.primaryColor = primaryColor;
	}

	public String getPrimaryColor() {
		return primaryColor;
	}

	public void setSecondaryColor(String secondaryColor) {
		this.secondaryColor = secondaryColor;
	}

	public String getSecondaryColor() {
		return secondaryColor;
	}

	public String getExpertOrganization() {
		return expertOrganization;
	}

	public void setExpertOrganization(String expertOrganization) {
		this.expertOrganization = expertOrganization;
	}
}
