package com.dupont.phoenix.tools.innovation;

import org.apache.sling.api.resource.Resource;
import com.dupont.phoenix.commons.Scene7Image;
import com.dupont.phoenix.tools.BaseballCard;

public class InnovationBaseBallCard extends BaseballCard {

	private String color;
	private Scene7Image icon;
	private Scene7Image whiteicon;
	private Scene7Image thumbnail;
	private String indexTitle;

	/*Science Variables*/
	private boolean scienceEnabled;
	private Scene7Image scienceImage;
	private String scienceTitle;
	private String scienceDescription;
	//private String[] linksList;
	//private List<Map> links;
	

	public InnovationBaseBallCard(Resource resource) {
		super(resource);
		init();
	}
	private void init(){
		// Get the main color to be used for the BB Card.
		setColor(properties.get("iicolor","FFFFFF")); // do not use #
		
		icon = new Scene7Image(resource,"icon");
		if(icon != null && icon.hasContent()){
			icon.setSelector(".img");
		}
		
		whiteicon = new Scene7Image(resource,"whiteicon");
		if(whiteicon != null && whiteicon.hasContent()){
			whiteicon.setSelector(".img");
		}
		
		thumbnail = new Scene7Image(resource,"thumbnail");
		if(thumbnail != null && thumbnail.hasContent()){
			thumbnail.setSelector(".img");
		}

		/* Get the Science BBcard information */
		scienceImage = new Scene7Image(resource,"scienceImage");
		if(scienceImage != null && scienceImage.hasContent()){
			scienceImage.setSelector(".img");
		}
		
		setScienceTitle(properties.get("scienceTitle",String.class));
		setScienceDescription(properties.get("scienceDescription",String.class));
		scienceEnabled = scienceTitle != null ? true : false;

		setIndexTitle(properties.get("indexTitle",String.class));
		
	}

	/* Setters and Getters */
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public Scene7Image getIcon() {
		return icon;
	}
	public void setIcon(Scene7Image icon) {
		this.icon = icon;
	}
	public Scene7Image getThumbnail() {
		return thumbnail;
	}
	public void setThumbnail(Scene7Image thumbnail) {
		this.thumbnail = thumbnail;
	}
	public Scene7Image getScienceImage() {
		return scienceImage;
	}
	public void setScienceImage(Scene7Image scienceImage) {
		this.scienceImage = scienceImage;
	}
	public String getScienceDescription() {
		return scienceDescription;
	}
	public void setScienceDescription(String scienceDescription) {
		this.scienceDescription = scienceDescription;
	}
	public String getScienceTitle() {
		return scienceTitle;
	}
	public void setScienceTitle(String scienceTitle) {
		this.scienceTitle = scienceTitle;
	}
	public String getIndexTitle() {
		return indexTitle;
	}
	public void setIndexTitle(String indexTitle) {
		this.indexTitle = indexTitle;
	}
	//public String[] getLinksList() {
	//	return linksList;
	//}
	//public void setLinksList(String[] linksList) {
	//	this.linksList = linksList;
	//}
	//public List<Map> getLinks() {
	//	return links;
	//}
	//public void setLinks(List<Map> links) {
	//	this.links = links;
	//}
	public boolean isScienceEnabled() {
		return scienceEnabled;
	}
	public void setScienceEnabled(boolean scienceEnabled) {
		this.scienceEnabled = scienceEnabled;
	}
	public Scene7Image getWhiteicon() {
		return whiteicon;
	}
	public void setWhiteicon(Scene7Image whiteicon) {
		this.whiteicon = whiteicon;
	}

}
