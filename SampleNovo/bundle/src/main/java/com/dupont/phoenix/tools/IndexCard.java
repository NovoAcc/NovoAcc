package com.dupont.phoenix.tools;

import java.util.List;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

public abstract class IndexCard {
	
	protected Resource resource;
	protected ValueMap properties;
	protected List<BaseballCard> baseballCardList;
	
	public IndexCard(Resource resource) {
		this.resource = resource;
		this.properties = resource.adaptTo(ValueMap.class);
		init();
	}
	
	private void init() {
		setBaseballCardList(fetchBaseballCards());
	}
	
	abstract protected List<BaseballCard> fetchBaseballCards();

	public List<BaseballCard> getBaseballCardList() {
		return baseballCardList;
	}

	public void setBaseballCardList(List<BaseballCard> baseballCardList) {
		this.baseballCardList = baseballCardList;
	}
	

}
