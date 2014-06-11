package com.dupont.phoenix.hlm;

import java.util.HashMap;
import java.util.Map;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;

import com.day.cq.wcm.api.Page;
import com.dupont.phoenix.Multimedia;
import com.dupont.phoenix.list.HListHelper;
import com.dupont.phoenix.mchlm.MCHLM;
import com.dupont.phoenix.mchlm.newshlm.NewsHLM;
import com.dupont.phoenix.mchlm.pressreleashlm.PressReleaseHLM;

final public class HLMFactory {
	
    //private static final Logger logger = LoggerFactory.getLogger(HLMFactory.class);
	private Map<String, HListHelper> registeredHLMs = new HashMap<String, HListHelper>();
	private static HLMFactory mySelf = new HLMFactory();
	
	private HLMFactory() {
		//do nothing
	}

	//register HLM
	public void registerHLM(String hlmResType, HListHelper hlm)    {
		registeredHLMs.put(hlmResType, hlm);
	}

	//check HLM resource type is registered or not
	public boolean isRegisteredHLM(String hlmResType) {
		return registeredHLMs.containsKey(hlmResType);
	}
	
	//create HLMs
	public HListHelper createHLM(String hlmResType, final SlingHttpServletRequest slingRequest,
			final Page page, final Resource resource){
		HListHelper helper = registeredHLMs.get(hlmResType);
		return helper!=null ? helper.createHLM(slingRequest, page, resource) : null;
	}

	//get an instance of this class object - singleton
	public static HLMFactory getInstance() {
		return mySelf;
	}
	
	//register all HLMs
	static {
		HLMFactory.getInstance().registerHLM(HLM.HLM_RESOURCE_PATH, new HLM());
		HLMFactory.getInstance().registerHLM(HLM.RESPONSIVE_HLM_RESOURCE_PATH, new HLM());
		HLMFactory.getInstance().registerHLM(PressReleaseHLM.RESPONSIVE_HLM_RESOURCE_PATH, new PressReleaseHLM());
		HLMFactory.getInstance().registerHLM(NewsHLM.RESPONSIVE_HLM_RESOURCE_PATH, new NewsHLM());
		HLMFactory.getInstance().registerHLM(MCHLM.RESPONSIVE_HLM_RESOURCE_PATH, new MCHLM());
		HLMFactory.getInstance().registerHLM(Multimedia.RESPONSIVE_MULTIMEDIA_RESOURCE_PATH, new Multimedia());
	}
}
