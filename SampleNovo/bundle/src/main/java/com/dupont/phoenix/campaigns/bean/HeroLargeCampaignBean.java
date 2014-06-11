package com.dupont.phoenix.campaigns.bean;

import java.io.Serializable;

import org.apache.commons.lang.StringUtils;

import com.day.cq.wcm.foundation.Image;

@SuppressWarnings("serial")
public class HeroLargeCampaignBean implements Serializable{

	// Initialize
	private String pageTitle;
	boolean hasImage;
	private String heroColor = "9d3e04";
	private String heroColorClass ;
	private Image heroImage;
	private String strDivMain;
	private String strDivMainTitle;
	private String strDivMainTitleBG;
	private String markUp;
	private boolean author;
	private String conutryCode;
	
	public String getPageTitle() {
		return pageTitle;
	}

	public void setPageTitle(String pageTitle) {
		this.pageTitle = pageTitle;
	}

	public boolean isHasImage() {
		return hasImage;
	}

	public void setHasImage(boolean hasImage) {
		this.hasImage = hasImage;
	}

	public String getHeroColorClass() {
		return heroColorClass;
	}

	public void setHeroColorClass(String heroColorClass) {
		this.heroColorClass = heroColorClass;
	}

	public Image getHeroImage() {
		return heroImage;
	}

	public void setHeroImage(Image heroImage) {
		this.heroImage = heroImage;
	}

	public String getStrDivMain() {
		return strDivMain;
	}

	public void setStrDivMain(String strDivMain) {
		this.strDivMain = strDivMain;
	}

	public String getStrDivMainTitle() {
		return strDivMainTitle;
	}

	public void setStrDivMainTitle(String strDivMainTitle) {
		this.strDivMainTitle = strDivMainTitle;
	}

	public String getStrDivMainTitleBG() {
		return strDivMainTitleBG;
	}

	public void setStrDivMainTitleBG(String strDivMainTitleBG) {
		this.strDivMainTitleBG = strDivMainTitleBG;
	}

	public String getMarkUp() {
		return markUp;
	}

	public void setMarkUp(String markUp) {
		this.markUp = markUp;
	}

	public String getHeroColor() {
		return heroColor;
	}

	public void setHeroColor(String heroColor) {
		this.heroColor = heroColor;
	}

	public boolean getAuthor() {
		return author;
	}

	public void setAuthor(boolean author) {
		this.author = author;
	}

	public String getConutryCode() {
		return conutryCode;
	}

	public void setConutryCode(String conutryCode) {
		this.conutryCode = conutryCode;
	}
}
