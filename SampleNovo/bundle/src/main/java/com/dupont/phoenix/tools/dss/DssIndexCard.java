package com.dupont.phoenix.tools.dss;

import java.util.ArrayList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dupont.phoenix.tools.BaseballCard;
import com.dupont.phoenix.tools.IndexCard;

public class DssIndexCard extends IndexCard {
	
	private boolean has3Slides;
	private static final Logger log = LoggerFactory.getLogger(DssIndexCard.class);
	
	public DssIndexCard(Resource resource) {
		super(resource);
		this.resource = resource;
		init();
	}
	
	private void init() {
		setHas3Slides(determineSlides());
	}
	
	private boolean determineSlides() {
		String experts = properties.get("experts","1");
		return (experts != null && "3".equalsIgnoreCase(experts));
	}
	
	@Override
	protected List<BaseballCard> fetchBaseballCards() {
		List<BaseballCard> tempList = new ArrayList<BaseballCard>();
		Node pageNode = resource.adaptTo(Node.class);
		try {
			if (pageNode != null && pageNode.hasNodes()) {
				NodeIterator itr =  pageNode.getNodes();
				if (itr != null) {
					while (itr.hasNext()) {
						Node bbcardNode = itr.nextNode();
						Resource bbcardResource = resource.getResourceResolver().getResource(bbcardNode.getPath());
						DssBaseBallCard dssbbcard = new DssBaseBallCard(bbcardResource);
						tempList.add(dssbbcard);
					}
				}
			}
			
		} 
		catch (RepositoryException repositoryException) {
			log.error("Repository Exception -", repositoryException);
		}		
		return tempList;
	}

	public boolean getHas3Slides() {
		return has3Slides;
	}

	public void setHas3Slides(boolean has3Slides) {
		this.has3Slides = has3Slides;
	}


	
}
