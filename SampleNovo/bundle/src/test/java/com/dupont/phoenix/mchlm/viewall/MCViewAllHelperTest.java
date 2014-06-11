package com.dupont.phoenix.mchlm.viewall;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.Value;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Designer;
import com.day.cq.wcm.api.designer.Style;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.GlobalConstants;
import com.dupont.phoenix.hlm.HLMFactory;
import com.dupont.phoenix.hlm.HLMWrapper;
import com.dupont.phoenix.hlm.viewall.ViewAllHelper;
import com.dupont.phoenix.list.HListHelper;
import com.dupont.phoenix.list.ListItem;
import com.dupont.phoenix.mchlm.pressreleashlm.PressReleaseHLM;
import com.dupont.phoenix.taglibs.context.JSPContext;

@RunWith(PowerMockRunner.class)
@PrepareForTest({Global.class,HLMFactory.class, StringUtils.class})
public class MCViewAllHelperTest {
	
	@Mock
	JSPContext jspContextMock;
	@Mock
	ViewAllHelper viewAllHelperMock;
	@Mock
	SlingHttpServletRequest slingRequestMock;
	@Mock
	Page pageMock;
	@Mock
	Resource resourceMock;
	@Mock 
	Style mcSiteConfigMock;
	@Mock 
	ResourceResolver resolverMock;
	@Mock 
	ResourceResolver resolverMock1;
	@Mock
	Designer designerMock;
	@Mock
	Style footerStyleMock;
	@Mock
	Style mcStyleMock;
	@Mock
	Resource mcdailynewsResMock;
	@Mock
	private HLMWrapper hlmWrapper;
	@Mock
	HLMFactory hlmFactory;
	@Mock
	private HListHelper hListHelper;
	@Mock
	private Map<String, HListHelper> registeredHLMs;
	@Mock
	private  RequestPathInfo requestPathInfoMock;
	@Mock
	Style hlmStyleConfig;
	@Mock
	ValueMap pageValueMapMock;
	@Mock
	Node mclpNodeMock;
	String configPagePath = "/etc/dupont/phoenix/viewallconfig";
	
	@Mock
	NodeIterator nodeItrMock;
	String path = "/content/en-us/mclp";
	
	@Mock
	Value valueMock;
	@Mock
	Resource mclpResMock;
	@Mock
	Node mcdailynewsNodeMock;
	@Mock
	Property propMock;
	@Mock
	private Map<String, HListHelper> hlmList;
	@Mock
	ValueMap valueMapMock;
	@Mock
	Style viewAllStyle;
	@Mock
	Resource configResMock;
	String [] taxonomyFacetsconf = {"DuPont:Brands"};
	@Mock
	TagManager tagManagerMock;
	@Mock
	Tag tagMock;
	@Mock
	ValueMap pressreleasePropMock;
	String contentType = "mcdailynews";
	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		MockitoAnnotations.initMocks(this);
		setupMockData();
	}

	private void setupMockData() throws JSONException, RepositoryException {
		
		when(jspContextMock.getCurrentPage()).thenReturn(pageMock);
		when(jspContextMock.getRequest()).thenReturn(slingRequestMock);
		when(slingRequestMock.getAttribute("hlmWrapper")).thenReturn(hlmWrapper);
		when(jspContextMock.getCurrentPagePath()).thenReturn("/content/en-us/mclp");
		when(jspContextMock.getResource()).thenReturn(resourceMock);
		when(resourceMock.getResourceResolver()).thenReturn(resolverMock);
		when(resolverMock.adaptTo(Designer.class)).thenReturn(designerMock);
		when(designerMock.getStyle(resourceMock, Global.SITE_CONFIG_FOLDER_NAME)).thenReturn(footerStyleMock);
		PowerMockito.mockStatic(Global.class);
	
		when(Global.getSiteConfigStyle(resourceMock)).thenReturn(mcSiteConfigMock);
		when(mcSiteConfigMock.getSubStyle("tabmc")).thenReturn(mcStyleMock);
		when(mcStyleMock.get(PressReleaseHLM.CORPORATE_FOLDER_PATH)).thenReturn("/content/en-us/corporate");
		when(mcSiteConfigMock.getSubStyle("viewallconfiguration")).thenReturn(viewAllStyle);
		when(viewAllStyle.get("mcviewallconfiguration", String.class)).thenReturn(configPagePath);
		when(resolverMock1.getResource(configPagePath)).thenReturn(configResMock);
		when(configResMock.getChild("jcr:content/openareapar/mcviewallconfig")).thenReturn(configResMock);
		when(configResMock.adaptTo(ValueMap.class)).thenReturn(valueMapMock);
		when(valueMapMock.containsKey("business")).thenReturn(true);
		when(valueMapMock.get("business", String[].class)).thenReturn(taxonomyFacetsconf);
		when(resolverMock1.adaptTo(TagManager.class)).thenReturn(tagManagerMock);
		when(tagManagerMock.resolve("DuPont:Brands")).thenReturn(tagMock);
		when(tagMock.getTagID()).thenReturn("dupont/brands");
		//when(tagMock.getTitlePath(Locale.class)).then
		
		// Get All HLM Method
		
		
		
	/*	when(jspContextMock.getRequest()).thenReturn(slingRequestMock);
		when(slingRequestMock.getAttribute("hlmWrapper")).thenReturn(hlmWrapper);
		when(slingRequestMock.getRequestPathInfo()).thenReturn(requestPathInfoMock);
	*/	when(Global.getSelectorByIndex(slingRequestMock,1)).thenReturn("hlm-mcdailynews");
		when(jspContextMock.getResourceResolver()).thenReturn(resolverMock1);
		when(pageMock.getPath()).thenReturn(path);
		when(resolverMock1.getResource(path + "/jcr:content")).thenReturn(mclpResMock);
		when(mclpResMock.adaptTo(Node.class)).thenReturn(mclpNodeMock);
		when(mclpNodeMock.getNodes()).thenReturn(nodeItrMock);
		when(nodeItrMock.hasNext()).thenReturn(true).thenReturn(false);
		when(nodeItrMock.next()).thenReturn(mcdailynewsNodeMock);
		when(mcdailynewsNodeMock.hasProperty("contentType")).thenReturn(true);
		when(mcdailynewsNodeMock.getProperty("contentType")).thenReturn(propMock);
		when(propMock.getValue()).thenReturn(valueMock);
	
		//when(StringUtils.isNotEmpty(contentType)).thenReturn(true);
		when(mcdailynewsNodeMock.getPath()).thenReturn(path + "/jcr:content" + "/mcdailynews");
		when(resolverMock1.getResource(path +"/jcr:content" + "/mcdailynews" )).thenReturn(mcdailynewsResMock);
		when(mcdailynewsResMock.adaptTo(Node.class)).thenReturn(mcdailynewsNodeMock);
		when(mcdailynewsResMock.getPath()).thenReturn(path + "/jcr:content" + "/mcdailynews");
		PowerMockito.mockStatic(HLMFactory.class);
		
		when(mcdailynewsResMock.getResourceType()).thenReturn("dupont/phoenix/components/responsive/mchlm");
		when(registeredHLMs.put("dupont/phoenix/components/responsive/mchlm", hListHelper)).thenReturn(hListHelper);
		when(registeredHLMs.get("dupont/phoenix/components/responsive/mchlm")).thenReturn(hListHelper);
		when(hListHelper.getId(mcdailynewsResMock)).thenReturn("dupont/phoenix/components/responsive/mchlm");
		when(HLMFactory.getInstance()).thenReturn(hlmFactory);
		when(hlmFactory.createHLM("dupont/phoenix/components/responsive/mchlm", slingRequestMock, pageMock, mcdailynewsResMock)).thenReturn(hListHelper);
		when(hlmList.put("hlm-mcdailynews", hListHelper)).thenReturn(hListHelper);
		when(hlmList.get("hlm-mcdailynews")).thenReturn(hListHelper);
		when(hlmWrapper.getHLMById("hlm-mcdailynews")).thenReturn(hListHelper);
		when(hListHelper.getContentTypeName()).thenReturn("Daily News");
	//	when(Global.getTranslatedText(page, slingRequest, "INFORMATION & IDEAS")).thenReturn("INFORMATION & IDEAS");
		when(hListHelper.getListSize()).thenReturn(3);
		when(hListHelper.getContentType()).thenReturn("article");
		List<ListItem> listItems = new ArrayList<ListItem>();
		ListItem listItem = new ListItem();
		String[] tagArray = {"DuPont:Brands", "DuPont:Industry"};
		listItem.setAllTags(tagArray);
		listItems.add(listItem);
		ListItem listItem2 = new ListItem();
		listItem2.setAllTags(tagArray);
		listItems.add(listItem2);
		when(hListHelper.getListItems()).thenReturn(listItems);
		when(hListHelper.showHLM()).thenReturn(true);
		//
		when(pageMock.getProperties()).thenReturn(valueMapMock);
		when(valueMapMock.get("contentType")).thenReturn("productcat");
		
		when(jspContextMock.getPageProperties()).thenReturn(pageValueMapMock);
		when(pageValueMapMock.get("cq:template", "")).thenReturn("dupont/phoenix/templates/responsive/mcLandingPage");
}

	
	@Test
	public void testGetViewAllBean(){
	MCViewAllHelper mcViewAllHelper = new MCViewAllHelper(jspContextMock);
	mcViewAllHelper.getMcViewAllBean();
	}
	
	@Test
	public void testGetViewAllBeanForPressReleaseContentType() throws RepositoryException{
	when(valueMock.getString()).thenReturn("pressrelease");
	when(mcdailynewsResMock.adaptTo(ValueMap.class)).thenReturn(pressreleasePropMock);
	when(pressreleasePropMock.get("isCorporate",String.class)).thenReturn("true");
	when(mcdailynewsNodeMock.getPath()).thenReturn(path + "/jcr:content" + "/mcpressrelease");
	when(resolverMock1.getResource(path +"/jcr:content" + "/mcpressrelease" )).thenReturn(mcdailynewsResMock);
	when(mcdailynewsResMock.adaptTo(Node.class)).thenReturn(mcdailynewsNodeMock);
	when(mcdailynewsResMock.getPath()).thenReturn(path + "/jcr:content" + "/mcpressrelease");
	when(mcdailynewsResMock.getResourceType()).thenReturn("dupont/phoenix/components/responsive/mcpressreleasehlm");
	when(registeredHLMs.put("dupont/phoenix/components/responsive/mcpressreleasehlm", hListHelper)).thenReturn(hListHelper);
	when(registeredHLMs.get("dupont/phoenix/components/responsive/mcpressreleasehlm")).thenReturn(hListHelper);
	when(hListHelper.getId(mcdailynewsResMock)).thenReturn("dupont/phoenix/components/responsive/mcpressreleasehlm");
	when(HLMFactory.getInstance()).thenReturn(hlmFactory);
	when(hlmFactory.createHLM("dupont/phoenix/components/responsive/mcpressreleasehlm", slingRequestMock, pageMock, mcdailynewsResMock)).thenReturn(hListHelper);
	when(hlmList.put("hlm-pressrelease", hListHelper)).thenReturn(hListHelper);
	when(hlmList.get("hlm-pressrelease")).thenReturn(hListHelper);
	when(hlmWrapper.getHLMById("hlm-pressrelease")).thenReturn(hListHelper);
	when(hListHelper.getContentTypeName()).thenReturn("News");
//
	MCViewAllHelper mcViewAllHelper = new MCViewAllHelper(jspContextMock);
	mcViewAllHelper.getMcViewAllBean();
	}
	
	@Test
	public void testGetViewAllBeanForMultiMediaContentType() throws RepositoryException{
	//	 contentType = "multimedia";
		 when(valueMock.getString()).thenReturn("multimedia");
	when(mcdailynewsNodeMock.getPath()).thenReturn(path + "/jcr:content" + "/multimedia");
	when(resolverMock1.getResource(path +"/jcr:content" + "/multimedia" )).thenReturn(mcdailynewsResMock);
	when(mcdailynewsResMock.adaptTo(Node.class)).thenReturn(mcdailynewsNodeMock);
	when(mcdailynewsResMock.getPath()).thenReturn(path + "/jcr:content" + "/multimedia");
	when(mcdailynewsResMock.getResourceType()).thenReturn("dupont/phoenix/components/responsive/multimedia");
	when(registeredHLMs.put("dupont/phoenix/components/responsive/multimedia", hListHelper)).thenReturn(hListHelper);
	when(registeredHLMs.get("dupont/phoenix/components/responsive/multimedia")).thenReturn(hListHelper);
	when(hListHelper.getId(mcdailynewsResMock)).thenReturn("dupont/phoenix/components/responsive/multimedia");
	when(HLMFactory.getInstance()).thenReturn(hlmFactory);
	when(hlmFactory.createHLM("dupont/phoenix/components/responsive/multimedia", slingRequestMock, pageMock, mcdailynewsResMock)).thenReturn(hListHelper);
	when(hlmList.put("hlm-multimedia", hListHelper)).thenReturn(hListHelper);
	when(hlmList.get("hlm-multimedia")).thenReturn(hListHelper);
	when(hlmWrapper.getHLMById("hlm-multimedia")).thenReturn(hListHelper);
	when(hListHelper.getContentTypeName()).thenReturn("MultiMedia");
	List<ListItem> listItems = new ArrayList<ListItem>();
	ListItem listItem = new ListItem();
	String[] tagArray = {"DuPont:Brands", "DuPont:Industry"};
	listItem.setAllTags(tagArray);
	listItem.setContentType(GlobalConstants.MC_VIDEO_DETAIL_CONTENT_TYPE_NAME);
	listItems.add(listItem);
	ListItem listItem2 = new ListItem();
	listItem2.setAllTags(tagArray);
	listItem2.setContentType(GlobalConstants.MC_IMAGE_DETAIL_CONTENT_TYPE_NAME);
	listItems.add(listItem2);
	when(hListHelper.getListItems()).thenReturn(listItems);
//
	MCViewAllHelper mcViewAllHelper = new MCViewAllHelper(jspContextMock);
	mcViewAllHelper.getMcViewAllBean();
	}
}

