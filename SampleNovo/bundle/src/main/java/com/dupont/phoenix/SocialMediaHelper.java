package com.dupont.phoenix;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
//import java.util.Map;
import java.util.List;
import java.util.ArrayList;
//import java.util.Collections;
//import java.util.Comparator;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.commons.json.*;

import com.day.cq.wcm.api.designer.Style;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.resource.ValueMap;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;

public class SocialMediaHelper {

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	/**
	 * Returns list of channels
	 * 
	 * @param resource
	 * @return
	 */
	public Map<String, SocialMediaChannel> getChannelList(Resource resource)

	{
		SocialMediaChannel socialMediaChannel = null;
		String socialMediaFolderPath = "";
		// Read the location of social media channel list
		final Style socialMediaConfigProps = Global
				.getSiteConfigStyle(resource).getSubStyle("socialmedia");

		if (socialMediaConfigProps != null) {
			socialMediaFolderPath = socialMediaConfigProps.get(
					"socialmediachannellist", String.class);
		}

		Map<String, SocialMediaChannel> socialMediaChanelList = new HashMap<String, SocialMediaChannel>();
		try {
			if (StringUtils.isNotEmpty(socialMediaFolderPath)){
				NodeIterator socialMediaChannelNodes = resource
						.getResourceResolver().getResource(socialMediaFolderPath)
						.adaptTo(Node.class).getNodes();
				while (socialMediaChannelNodes.hasNext()) {
					socialMediaChannel = new SocialMediaChannel();
					String value = "";
					Node socialMediaChannelNode = socialMediaChannelNodes
							.nextNode();
					value = socialMediaChannelNode.getName();
					if (socialMediaChannelNode.hasProperty("name")) {
						// logger.info("SocialMediaHelper:NodeAsString:Found shareURL property.");
						socialMediaChannel.setName(socialMediaChannelNode
								.getProperty("name").getString());
					}
					if (socialMediaChannelNode.hasProperty("shareURL")) {
						// logger.info("SocialMediaHelper:NodeAsString:Found shareURL property.");
						socialMediaChannel.setShareURL(socialMediaChannelNode
								.getProperty("shareURL").getString());
					}
					if (socialMediaChannelNode.hasProperty("normalChicletImg")) {
						socialMediaChannel.setNormalImg(socialMediaChannelNode
								.getProperty("normalChicletImg").getString());
					}
					if (socialMediaChannelNode.hasProperty("normalChicletHoverImg")) {
						socialMediaChannel.setNormalHoverImg(socialMediaChannelNode
								.getProperty("normalChicletHoverImg").getString());
					}
					if (socialMediaChannelNode.hasProperty("grayChicletImg")) {
						socialMediaChannel.setGrayImg(socialMediaChannelNode
								.getProperty("grayChicletImg").getString());
					}
					if (socialMediaChannelNode.hasProperty("grayChicletHoverImg")) {
						socialMediaChannel.setGrayHoverImg(socialMediaChannelNode
								.getProperty("grayChicletHoverImg").getString());
					}
					if (socialMediaChannelNode.hasProperty("order")) {
						socialMediaChannel.setOrder((int)socialMediaChannelNode
								.getProperty("order").getLong());
					}
					socialMediaChanelList.put(value, socialMediaChannel);
				}
			}
		} catch (RepositoryException re) {
			// log exception
			logger.error("getChannelList",re);
		} catch (Exception e) {
			// log exception
			logger.error("getChannelList",e);
		}
		return socialMediaChanelList;
	}
	/**
	 * Returns list of active channels
	 * 
	 * @param resource
	 * @return
	 */
	public List<SocialMediaChannel> getActiveChannelsForShare(
			Resource resource) {
		String[] socailMediaShareChannelsEnabled = null;

		Map<String, SocialMediaChannel> socialMediaChanelList = getChannelList(resource);
		List<SocialMediaChannel> socialMediaChanelListReturn = new ArrayList<SocialMediaChannel>();
		try {
			// Read the site config list of enabled channels
			final Style socialMediaConfigProps = Global.getSiteConfigStyle(
					resource).getSubStyle("socialmedia");

			if (socialMediaConfigProps != null) {
				socailMediaShareChannelsEnabled = socialMediaConfigProps.get(
						"sharemedia", String[].class);
			}
			// Iterate through the list
			if (socailMediaShareChannelsEnabled != null ){
				for (String socailMediaShareChannel : socailMediaShareChannelsEnabled) {
					if (StringUtils.isNotBlank(socailMediaShareChannel) && 
							socialMediaChanelList.containsKey(socailMediaShareChannel)) {
							// socialMediaChanelList.remove(socailMediaShareChannel);
							SocialMediaChannel channel = socialMediaChanelList.get(socailMediaShareChannel);	
							socialMediaChanelListReturn.add(channel);
						}
					
				}
			}
		} catch (Exception e) {
			// log exception
			logger.error("getActiveChannelsForShare:", e);
		}
		return socialMediaChanelListReturn;
	}
	/**
	 * Returns list of active channels for header and footer
	 * 
	 * @param resource
	 * @param socialChannels
	 * @return
	 */
	public List<SocialMediaChannel> getActiveChannelsForHeaderAndFooter(
			Resource resource, String[] socialChannels) {
		Map<String, SocialMediaChannel> socialMediaChanelList = getChannelList(resource);
		List<SocialMediaChannel> socialMediaChanelListReturn = new ArrayList<SocialMediaChannel>();
		 //logger.info("getActiveChannelsForHeaderAndFooter Active Channels Passed:"
		 //+ socialChannels.toString());
		try {
			if (socialChannels != null) {
				//logger.info("getActiveChannelsForHeaderAndFooter: socialChannels value being processed is:"+socialChannels);
				for (String socialChannel : socialChannels){
					if (StringUtils.isNotEmpty(socialChannel)){
						JSONObject socialChannelsJSON = new JSONObject(socialChannel);
						Iterator<String> socialChannelsIter = socialChannelsJSON.keys();
						while (socialChannelsIter.hasNext()) {
							String key = socialChannelsIter.next();
							String value = socialChannelsJSON.getString(key);
							// logger.info("getActiveChannelsForHeaderAndFooter Active Channels Key:"
							// + key + " : Value:" + value);
							// remove channels from socialMediaChannelNodes
							if("socialChannel".equalsIgnoreCase(key) && StringUtils.isNotBlank(value) &&
									socialMediaChanelList.containsKey(value)) {
									// socialMediaChanelList.remove(socailMediaShareChannel);
									SocialMediaChannel channel = socialMediaChanelList.get(value);
									String urlForChannel = key+"URL";
									if(socialChannelsJSON.has(urlForChannel)) {
										String url = socialChannelsJSON.getString(urlForChannel);
										channel.setPageURL(url);
									}
								
									socialMediaChanelListReturn.add(channel);
								}
							
						}
					}
					//Collections.sort(socialMediaChanelListReturn, new Comparator<SocialMediaChannel>() {
					//	public int compare(SocialMediaChannel c1, SocialMediaChannel c2) {
					//		return c1.getOrder().compareTo(c2.getOrder());
					//	}
					//});
				}
			}
		} catch (Exception e) {
			// log exception
			logger.error("getActiveChannelsForHeaderAndFooter:", e);
		}
		return socialMediaChanelListReturn;
	}

	/**
	 * Returns a inherited Value
	 * 
	 * @param resource 
	 * @param valueName
	 * @return
	 */
	public String[]  getInheritedValue(
			Resource resource, Page currentPage, String valueName) {
		
		long level =1; //content/site/homepacurrentPagege
		ValueMap properties = resource.adaptTo(ValueMap.class);

		String[] propertyValue =  null;
		try {
		    level = currentPage.getDepth()-1;
		    if (properties != null ){
	        	propertyValue=properties.get(valueName, String[].class);
	        	//logger.info("SocialMediaHelper:getInheritedValue:Value at CurrentPage :"+ propertyValue);
	        	if (!checkIfValueSet(propertyValue)){
	        	    while (level > 1) {
	        	        Page parentPage = currentPage.getAbsoluteParent((int) level);
	        	        if (parentPage == null) {
	        	            break;
	        	        }
	    	        	//logger.info("SocialMediaHelper:getInheritedValue: Properties at this level :"+ properties.toString());
		        	    //TBD: Need to change and use wild card path
	    	        	Resource parentPageContent = parentPage.getContentResource("heronormal/socialchannels"); // relative
	    	        	if (parentPageContent == null){
	    	        		parentPageContent = parentPage.getContentResource("herolarge/socialchannels"); // relative
	    	        	}
	    	        	if (parentPageContent !=null){
	    	        		properties=	parentPageContent.adaptTo(ValueMap.class);
	    	        		//for (Map.Entry<String, Object> entry : properties.entrySet()) 
		    	        	//{    
		    	        	//	logger.info("Key = " + entry.getKey() + ", Value = " + entry.getValue());
		    	        	//}
		    	        	if(properties != null && properties.containsKey(valueName)) 
		        	        {
			    	        	//logger.info("SocialMediaHelper:getInheritedValue: Found property  :"+ valueName);
		        	        	propertyValue=properties.get(valueName, String[].class);
		        	        	if (checkIfValueSet(propertyValue)){
		        	        		break;
		        	        	}
		        	        }
		        	    }
	        	        level = level-1;
	        			//logger.info("SocialMediaHelper:getInheritedValue:Page Checked:"+ parentPage.getName());
	        	    }
	        	}
		    }
		} catch (Exception e) {
			// log exception
			logger.error("getInheritedValue:",e);
		}
		return  propertyValue;
	}
	
	/**
	 * Checks if a valid value exists on a node and returns TRUE/FALSE
	 * 
	 * @param value
	 * @return
	 */
	private boolean checkIfValueSet(String[] values){
		boolean returnValue=false;
		if (values != null) {
			try{
				for (String value : values) {
					if (StringUtils.isNotEmpty(value)) {
						//logger.info("checkIfValueSet: Value being processed is:"+value);
						JSONObject socialChannelsJSON = new JSONObject(value);
						Iterator<String> socialChannelsIter = socialChannelsJSON.keys();
						while (socialChannelsIter.hasNext()) {
							String key = socialChannelsIter.next();
							if("socialChannel".equalsIgnoreCase(key)) {
								String keyValue = socialChannelsJSON.getString(key);			
								// remove channels from socialMediaChannelNodes
								if (StringUtils.isNotEmpty(keyValue)){
									returnValue=true;
									break;
								}
							}
						}
					}
				}
			} catch (Exception e) {
				// log exception
				logger.error("checkIfValueSet:", e);
				
			}
		} else {
			returnValue=false;
		}
		return returnValue;
	}
}