package com.dupont.phoenix.tools.SubProductNavigation;

import java.util.*;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

public class SubProductList{
    /*
	private String defaultRoot;
	private Page rootPage;
	private ArrayList<SubProduct> subproducts;
	private Page current;
	private Resource resource;
	private ValueMap properties;
	private ResourceResolver resourceResolver;
	//private ArrayList<PrimaryFilter> primaryFilter;
	private ArrayList<Filter> secondaryFilter1;
	private ArrayList<Filter> secondaryFilter2;



	public SubProductList(Resource resource, Page currentPage, SlingHttpServletRequest slingRequest){
		this.defaultRoot = "/content/en_us/home1/products-and-services/construction-materials/surface-design-materials/brands/corian-solid-surfaces/products/corian-all-colors/sub-products";
		this.subproducts = new ArrayList<SubProduct>();
		//this.primaryFilter = new ArrayList<PrimaryFilter>();
		this.secondaryFilter1 = new ArrayList<Filter>();
		this.secondaryFilter2 = new ArrayList<Filter>();
		this.current = currentPage;
		this.resourceResolver = resource.getResourceResolver();
		this.rootPage = resourceResolver.getResource(this.defaultRoot).adaptTo(Page.class);
		this.properties = resource.adaptTo(ValueMap.class);
		this.initList();
		this.initPrimaryFilter();
		this.initSecondaryFilters();
	}

	public void initList(){
		try {
			Node node = this.rootPage.adaptTo(Node.class);
			for (NodeIterator ni = node.getNodes(); ni.hasNext(); ) {
				Node n = ni.nextNode();
				//if(n.getNode("jcr:content").getProperty("contentType").getString().equals("subproduct")){
					this.subproducts.add(new SubProduct(n, resourceResolver, ni.getPosition()));
				//}
			}
		}catch(RepositoryException ex){
			ex.printStackTrace();
		}

	}
	
	public ArrayList<PrimaryFilter> getPrimaryFilter() {
		return primaryFilter;
	}

	public void setPrimaryFilter(ArrayList<PrimaryFilter> primaryFilter) {
		this.primaryFilter = primaryFilter;
	}

	public ArrayList<Filter> getSecondaryFilter1() {
		return secondaryFilter1;
	}

	public void setSecondaryFilter1(ArrayList<Filter> secondaryFilter1) {
		this.secondaryFilter1 = secondaryFilter1;
	}

	public ArrayList<Filter> getSecondaryFilter2() {
		return secondaryFilter2;
	}

	public void setSecondaryFilter2(ArrayList<Filter> secondaryFilter2) {
		this.secondaryFilter2 = secondaryFilter2;
	}

	public void initPrimaryFilter(){
		try {
			Resource tags = resourceResolver.getResource("/etc/tags/building-innovations/collections");
			Node node = tags.adaptTo(Node.class);
			for (NodeIterator ni = node.getNodes(); ni.hasNext(); ) {
				Node n = ni.nextNode();
				this.primaryFilter.add(new PrimaryFilter(n.getName(),n.getProperty("jcr:title").getString(),n.getProperty("jcr:title").getString(),n.getProperty("jcr:description").getString()));
			}
		}catch(RepositoryException ex){
			ex.printStackTrace();
		}
	}
	
	public void initSecondaryFilters(){
		try {
			Resource tags = resourceResolver.getResource("/etc/tags/building-innovations/hues");
			Node node = tags.adaptTo(Node.class);
			for (NodeIterator ni = node.getNodes(); ni.hasNext(); ) {
				Node n = ni.nextNode();
				this.secondaryFilter1.add(new Filter(n.getName(),n.getName()));
			}
			tags = resourceResolver.getResource("/etc/tags/building-innovations/price-group");
		    node = tags.adaptTo(Node.class);
			for (NodeIterator ni = node.getNodes(); ni.hasNext(); ) {
				Node n = ni.nextNode();
				this.secondaryFilter2.add(new Filter(n.getName(),n.getName()));
			}
		}catch(RepositoryException ex){
			ex.printStackTrace();
		}
	}
	

	public List<SubProduct> getSubproducts() {
		return subproducts;
	}

	public void setSubproducts(ArrayList<SubProduct> subproducts) {
		this.subproducts = subproducts;
	}

	*/

}  
