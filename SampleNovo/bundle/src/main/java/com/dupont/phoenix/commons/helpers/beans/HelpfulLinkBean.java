package com.dupont.phoenix.commons.helpers.beans;

import java.io.Serializable;
import java.util.List;
import java.util.Map;


@SuppressWarnings("serial")
public class HelpfulLinkBean implements Serializable {
	
	private String heroColor;
	private Boolean isEdit;
	private String helpfulLinkTitle;
	private List<Map<String,String>> list;
	private int listSize;
	String []linkItems;
	
	public String[] getLinkItems() {
		return linkItems;
	}
	public void setLinkItems(String[] linkItems) {
		if(null!=linkItems){
		this.linkItems = linkItems.clone();
		}
	}
	public int getListSize() {
		return listSize;
	}
	public void setListSize(int listSize) {
		this.listSize = listSize;
	}
	public List<Map<String,String>> getList() {
		return list;
	}
	public void setList(List<Map<String,String>> list) {
		this.list = list;
	}
	public String getHeroColor() {
		return heroColor;
	}
	public void setHeroColor(String heroColor) {
		this.heroColor = heroColor;
	}
	public Boolean getIsEdit() {
		return isEdit;
	}
	public void setIsEdit(Boolean isEdit) {
		this.isEdit = isEdit;
	}
	public String getHelpfulLinkTitle() {
		return helpfulLinkTitle;
	}
	public void setHelpfulLinkTitle(String helpfulLinkTitle) {
		this.helpfulLinkTitle = helpfulLinkTitle;
	}
}
