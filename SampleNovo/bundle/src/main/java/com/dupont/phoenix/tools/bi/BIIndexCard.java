package com.dupont.phoenix.tools.bi;

import java.util.ArrayList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.foundation.Image;
import com.dupont.phoenix.commons.Scene7Image;
import com.dupont.phoenix.tools.BaseballCard;
import com.dupont.phoenix.tools.IndexCard;

public class BIIndexCard extends IndexCard {
	
	private static final Logger logger = LoggerFactory.getLogger(BIIndexCard.class);

	/* Required Variables */
	
	protected String indexTitle;
	
	/* Uitility links Titles*/
	protected String bbcardItemTitle5;
	protected String bbcard5bgcolor;
	protected String bbcardItemTitle6;
	protected String bbcard6bgcolor;
	
	/* Landing surface 1  */
	protected String landingSurfaceTitle1;
	protected String bbcardItemTitle1;
	protected String bbcardItemTitle2;
	protected Image landingSufaceImage1;
	
	/* Landing surface 2  */
	protected String landingSurfaceTitle2;
	protected String bbcardItemTitle3;
	protected String bbcardItemTitle4;
	protected Image landingSufaceImage2;
	
	/*Constructor */
	public BIIndexCard(Resource resource) {
		super(resource);
		this.resource = resource;
		init();
	}
	private void init() {
		setIndexTitle((properties.get("indexCardTitle",String.class)));
		setLandingSurfaceTitle1(properties.get("landingSurface1Title",String.class));
		setBbcardItemTitle1(properties.get("bbcarditem1Title",String.class));
		setBbcardItemTitle2(properties.get("bbcarditem2Title",String.class));
		setLandingSurfaceTitle2(properties.get("landingSurface2Title",String.class));
		setBbcardItemTitle3(properties.get("bbcarditem3Title",String.class));
		setBbcardItemTitle4(properties.get("bbcarditem4Title",String.class));
		setBbcardItemTitle5(properties.get("bbcarditem5Title",String.class));
		setBbcard5bgcolor(properties.get("bbcard5bgcolor", String.class));
		setBbcardItemTitle6(properties.get("bbcarditem6Title",String.class));
		setBbcard6bgcolor(properties.get("bbcard6bgcolor", String.class));
		
		landingSufaceImage1 = new Scene7Image(resource,"landingimage1");
		if(landingSufaceImage1 != null && landingSufaceImage1.hasContent()){
			landingSufaceImage1.setSelector(".img");
		}
		landingSufaceImage2 = new Scene7Image(resource,"landingimage2");
		if(landingSufaceImage2 != null && landingSufaceImage2.hasContent()){
			landingSufaceImage2.setSelector(".img");
		}
	}
	@Override
	protected List<BaseballCard> fetchBaseballCards() {
		List<BaseballCard> tempList = new ArrayList<BaseballCard>();
		Node pageNode = resource.adaptTo(Node.class);
		try {
			if (pageNode != null && pageNode.hasNodes()) {
				NodeIterator itr = pageNode.getNodes();
				if (itr != null) {
					while (itr.hasNext()) {
						Node bbcardNode = itr.nextNode();
						Resource bbcardResource = resource.getResourceResolver().getResource(bbcardNode.getPath());
						if (bbcardResource.getResourceType().indexOf("baseballcard") != -1) 
						{
							BIBaseBallCard bibbcard = new BIBaseBallCard(bbcardResource);
							tempList.add(bibbcard);
						}
					}
				}
			}
			
		} 
		catch (RepositoryException repositoryException) {
			logger.error("Repository Exception :",repositoryException);
		}		
		return tempList;
	}
	/* getters & setters*/
	public String getIndexTitle() {
		return indexTitle;
	}
	public void setIndexTitle(String indexTitle) {
		this.indexTitle = indexTitle;
	}
	public String getLandingSurfaceTitle1() {
		return landingSurfaceTitle1;
	}
	public void setLandingSurfaceTitle1(String landingSurfaceTitle1) {
		this.landingSurfaceTitle1 = landingSurfaceTitle1;
	}
	public String getBbcardItemTitle1() {
		return bbcardItemTitle1;
	}
	public void setBbcardItemTitle1(String bbcardItemTitle1) {
		this.bbcardItemTitle1 = bbcardItemTitle1;
	}
	public String getBbcardItemTitle2() {
		return bbcardItemTitle2;
	}
	public void setBbcardItemTitle2(String bbcardItemTitle2) {
		this.bbcardItemTitle2 = bbcardItemTitle2;
	}
	public String getLandingSurfaceTitle2() {
		return landingSurfaceTitle2;
	}
	public void setLandingSurfaceTitle2(String landingSurfaceTitle2) {
		this.landingSurfaceTitle2 = landingSurfaceTitle2;
	}
	public String getBbcardItemTitle3() {
		return bbcardItemTitle3;
	}
	public void setBbcardItemTitle3(String bbcardItemTitle3) {
		this.bbcardItemTitle3 = bbcardItemTitle3;
	}
	public String getBbcardItemTitle4() {
		return bbcardItemTitle4;
	}
	public void setBbcardItemTitle4(String bbcardItemTitle4) {
		this.bbcardItemTitle4 = bbcardItemTitle4;
	}
	public String getBbcardItemTitle5() {
		return bbcardItemTitle5;
	}
	public void setBbcardItemTitle5(String bbcardItemTitle5) {
		this.bbcardItemTitle5 = bbcardItemTitle5;
	}
	public String getBbcardItemTitle6() {
		return bbcardItemTitle6;
	}
	public void setBbcardItemTitle6(String bbcardItemTitle6) {
		this.bbcardItemTitle6 = bbcardItemTitle6;
	}
	public Image getLandingSufaceImage1() {
		return landingSufaceImage1;
	}
	public void setLandingSufaceImage1(Image landingSufaceImage1) {
		this.landingSufaceImage1 = landingSufaceImage1;
	}
	public Image getLandingSufaceImage2() {
		return landingSufaceImage2;
	}
	public void setLandingSufaceImage2(Image landingSufaceImage2) {
		this.landingSufaceImage2 = landingSufaceImage2;
	}
	public String getBbcard5bgcolor() {
		return bbcard5bgcolor;
	}
	public void setBbcard5bgcolor(String bbcard5bgcolor) {
		this.bbcard5bgcolor = bbcard5bgcolor;
	}
	public String getBbcard6bgcolor() {
		return bbcard6bgcolor;
	}
	public void setBbcard6bgcolor(String bbcard6bgcolor) {
		this.bbcard6bgcolor = bbcard6bgcolor;
	}
}
