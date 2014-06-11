package com.dupont.phoenix;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jcr.Node;

import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Reference;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.granite.xss.XSSAPI;
import com.day.cq.wcm.api.Page;
//import javax.jcr.PathNotFoundException;
//import javax.jcr.RepositoryException;
//import javax.jcr.ValueFormatException;
//import org.apache.commons.lang.StringUtils;

public final class LinkListCuratedHelper
{
	
private static final Logger logger = LoggerFactory.getLogger(LinkListDynamicHelper.class);
//private Page page;
//private Resource resource;
private List<ListItem> items;
private ValueMap properties;
private SlingHttpServletRequest slingRequest;
private Node currentPageNode;
private Node jcrNode;
private ResourceResolver resourceResolver;
@Reference
private XSSAPI xssAPI;

public List<Map> list = new ArrayList<Map>();

public LinkListCuratedHelper(final SlingHttpServletRequest slingRequest,final Page page, final Resource resource)
{
this.slingRequest = slingRequest;
this.resourceResolver = resource.getResourceResolver();
this.xssAPI = resourceResolver.adaptTo(XSSAPI.class);
//this.page = page;
//this.resource = resource;
this.properties = resource.adaptTo(ValueMap.class);        
this.currentPageNode = page.adaptTo(Node.class);
try {
this.jcrNode = currentPageNode.getNode("jcr:content");
} catch (Exception e) {
logger.error("Exception : ",e);
}
}
public String getComponentProperty(final String propertyString)
{
return properties.get(propertyString, null);	
}
public List<Map> getList()
{
String[] linkItems=null;

if(StringUtils.isNotEmpty(properties.get("links",StringUtils.EMPTY)) && StringUtils.isNotEmpty(properties.get("links",StringUtils.EMPTY)))
{
linkItems = properties.get("links",String[].class);
for( String linkItem : linkItems )
{
try{
Map<String,String> linkItemMap = new HashMap<String,String>();
JSONObject jObject = new JSONObject(linkItem);
String linkURL = Global.checkLink(jObject.get("linkURL").toString());
//LinkListCuratedHelper.logger.info("XSSAPI Info : " + xssAPI.getValidHref(linkURL));
linkURL = xssAPI.getValidHref(xssAPI.encodeForHTML(linkURL));
String linkText = jObject.get("linkText").toString();
//linkText = xssAPI.encodeForHTML(linkText);
String linkTextWithoutLastWord = Global.getTextWithoutLastWord(linkText);
//linkTextWithoutLastWord=xssAPI.encodeForHTML(linkTextWithoutLastWord);
String linkTextLastWord = Global.getTextLastWord(linkText);
//linkTextLastWord=xssAPI.encodeForHTML(linkTextLastWord);
String newWindow = jObject.get("openInNewWindow").toString();
String isExternalLink= Global.isExternalLink(linkURL).toString();
//if(isExternalLink == "false")
//{
//String linkURLNew = Global.getNavigationURL(slingRequest,linkURL, false);
//linkURL = linkURLNew;
//}
//out.println(isExternalLink);
linkItemMap.put("linkURL",linkURL);
linkItemMap.put("linkText",linkText);
linkItemMap.put("linkTextWithoutLastWord",linkTextWithoutLastWord);
linkItemMap.put("linkTextLastWord",linkTextLastWord);
linkItemMap.put("newWindow", newWindow);
linkItemMap.put("isExternalLink", isExternalLink);
list.add(linkItemMap);
}
catch(Exception e)
{
	logger.error("Exception : ",e);
}
}
}
return list;

}
public String isCurated()
{
String isCurated = null;

try {
isCurated = jcrNode.hasProperty("isCurated")?jcrNode.getProperty("isCurated").getString():null;
} catch (Exception e) {

logger.error("Exception : ", e);
}
return isCurated;
}
public String isQuickLink()
{
String isQuickLink = null;
try{
isQuickLink = jcrNode.hasProperty("isQuickLink")?jcrNode.getProperty("isQuickLink").getString():null;
} catch(Exception e)
{
logger.error("Exception : ",e);
}
return isQuickLink;
}
public List<ListItem> getItems() {
	return items;
}
public SlingHttpServletRequest getSlingRequest() {
	return slingRequest;
}
public void setItems(List<ListItem> items) {
	this.items = items;
}
public void setSlingRequest(SlingHttpServletRequest slingRequest) {
	this.slingRequest = slingRequest;
}
}
