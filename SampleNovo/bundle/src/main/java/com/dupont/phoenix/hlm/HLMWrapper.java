package com.dupont.phoenix.hlm;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;

import com.day.cq.wcm.api.Page;
import com.dupont.phoenix.list.HListHelper;

public class HLMWrapper { 
		  
    //private static final Logger logger = LoggerFactory.getLogger(HLMWrapper.class);
    private Page page;
    private Map<String, HListHelper> hlmList;
    private Boolean inited = false;
	private SlingHttpServletRequest slingRequest;
	
    /**
     * HLM Wrapper for a page
     * @param page
     */
    public HLMWrapper(final SlingHttpServletRequest slingRequest, final Page page) {
    	this.slingRequest = slingRequest;
    	this.page = page;
    }
	
    /**
     * Should only be initialized once for a page request 
     */
    private void init() {
    	if(!inited) {
    		Resource resource = page.getContentResource();
            Iterator<Resource> resources = resource.listChildren();
            hlmList = new LinkedHashMap<String, HListHelper>();
        	HLMFactory factory = HLMFactory.getInstance();
            while(resources.hasNext()) {
            	Resource childRes = resources.next();
            	String resType = childRes.getResourceType();
            	boolean registered = factory.isRegisteredHLM(resType);
            	if(registered) {
	            	HListHelper hlmHelper = factory.createHLM(childRes.getResourceType(), slingRequest, page, childRes);
	            	if(hlmHelper!=null) {
	            		hlmList.put(hlmHelper.getId(), hlmHelper);
	            	}
            	}
            }
    		inited = true;
    	}
    }
    
    public List<HListHelper> getCTHLMList() {
    	init();
        List<HListHelper> ctHlmList = new ArrayList<HListHelper>();
    	if(hlmList!=null) {
	    	for (Map.Entry<String, HListHelper> entry : hlmList.entrySet()) {
	    		HListHelper hlmHelper = entry.getValue();
	    		if(hlmHelper.showViewAll()) {
	    			ctHlmList.add(hlmHelper);
	    		}
	        }
    	}
    	return ctHlmList;
    }
    
    /**
     * Returns HLM for a given HLM ID
     * @param hlmId
     * @return HLM
     */
    public HListHelper getHLMById(final String hlmId) {
    	init();
    	return hlmList!=null? hlmList.get(hlmId) : null;
    }
    
    /**
     * 
     * @return HLM object of a particular content type
     */
    public HListHelper getHLMOfAContentType(String contentTypeName) {
    	HListHelper returnHLM = null;
    	init();		
    	if(hlmList!=null) {
	    	for (Map.Entry<String, HListHelper> entry : hlmList.entrySet()) {
	    		HListHelper hlmHelper = entry.getValue();
	    		if(hlmHelper.getContentType().equalsIgnoreCase(contentTypeName)) {
	    			return hlmHelper;
	    			
	    		}
	        }
    	}
    	return returnHLM;
    }    
}