package com.dupont.phoenix.campaigns.bean;

import java.io.Serializable;

@SuppressWarnings("serial")
public class FormCampaignBean implements Serializable{

	
	private String[] selectedJSFilePaths;
	
	private String[] selectedCSSFilePaths;
	
	private String disclaimertext;
	
	private Boolean showHideFlag;
	
	private Boolean editModeFlag;
	
	private String pageTitle;

	public String[] getSelectedJSFilePaths() {
		return selectedJSFilePaths;
	}

	public void setSelectedJSFilePaths(String[] selectedJSFilePaths) {
		if(null!=selectedJSFilePaths){
		this.selectedJSFilePaths = selectedJSFilePaths.clone();
		}
	}

	public String[] getSelectedCSSFilePaths() {
		return selectedCSSFilePaths;
	}

	public void setSelectedCSSFilePaths(String[] selectedCSSFilePaths) {
		if(null!=selectedCSSFilePaths){
		this.selectedCSSFilePaths = selectedCSSFilePaths.clone();
		}
	}

	public String getDisclaimertext() {
		return disclaimertext;
	}

	public void setDisclaimertext(String disclaimertext) {
		this.disclaimertext = disclaimertext;
	}

	public Boolean getShowHideFlag() {
		return showHideFlag;
	}

	public void setShowHideFlag(Boolean showHideFlag) {
		this.showHideFlag = showHideFlag;
	}

	public Boolean getEditModeFlag() {
		return editModeFlag;
	}

	public void setEditModeFlag(Boolean editModeFlag) {
		this.editModeFlag = editModeFlag;
	}

	public String getPageTitle() {
		return pageTitle;
	}

	public void setPageTitle(String pageTitle) {
		this.pageTitle = pageTitle;
	}
	

}
