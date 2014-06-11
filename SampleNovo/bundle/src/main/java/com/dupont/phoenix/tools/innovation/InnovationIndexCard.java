package com.dupont.phoenix.tools.innovation;

import java.util.ArrayList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.Resource;

import com.dupont.phoenix.tools.BaseballCard;
import com.dupont.phoenix.tools.IndexCard;

public class InnovationIndexCard extends IndexCard {

	/*Constructor */
	public InnovationIndexCard(Resource resource) {
		super(resource);
		this.resource = resource;
		init();
	}
	
	private void init() {
		// Initialization goes here!
	}
	
	@Override
	protected List<BaseballCard> fetchBaseballCards() {
		/* Index IS BBCARD! */
		List<BaseballCard> tempList = new ArrayList<BaseballCard>();
		InnovationBaseBallCard innbbcard = new InnovationBaseBallCard(resource);
		tempList.add(innbbcard);
		/*
		Node pageNode = resource.adaptTo(Node.class);
		try {
			if (pageNode != null && pageNode.hasNodes()) {
				NodeIterator itr = pageNode != null && pageNode.hasNodes() ? pageNode.getNodes() : null;
				if (itr != null) {
					while (itr.hasNext()) {

						Node bbcardNode = itr.nextNode();
						Resource bbcardResource = resource.getResourceResolver().getResource(bbcardNode.getPath());
						InnovationBaseBallCard innbbcard = new InnovationBaseBallCard(bbcardResource);
						tempList.add(innbbcard);

						
						Node bbcardNode = itr.nextNode();
						Resource bbcardResource = resource.getResourceResolver().getResource(bbcardNode.getPath());
						if (bbcardResource.getResourceType().indexOf("baseballcard") != -1) 
						{
							InnovationBaseBallCard innbbcard = new InnovationBaseBallCard(bbcardResource);
							tempList.add(innbbcard);
						}
						
					}
				}
			}
			
		} 
		catch (RepositoryException repositoryException) {
			repositoryException.printStackTrace();
		}	*/	
		return tempList;
	}
}
