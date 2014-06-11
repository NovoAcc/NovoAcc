/**
 * 
 */
package com.dupont.phoenix.hlm.viewall;

import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Designer;
import com.day.cq.wcm.api.designer.Style;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.hlm.HLMFactory;
import com.dupont.phoenix.hlm.HLMWrapper;
import com.dupont.phoenix.list.HListHelper;
import com.dupont.phoenix.list.ListItem;
import com.dupont.phoenix.mchlm.beans.ViewAllBean;
import com.dupont.phoenix.mchlm.pressreleashlm.PressReleaseHLM;
import com.dupont.phoenix.taglibs.context.JSPContext;


/**
 * @author A.Shashi.Chaurasia
 *
 */
@RunWith(PowerMockRunner.class)
@PrepareForTest({Global.class, HLMFactory.class, StringUtils.class})
public class ViewAllTest {
	@Mock
	private Resource resource;
	@Mock
	ResourceResolver resolver;
	@Mock
	private JSPContext jspContext;
	@Mock
	private Page page;
	@Mock
	private SlingHttpServletRequest slingRequest;
	@Mock
	private HLMWrapper hlmWrapper;
	@Mock
	private  RequestPathInfo requestPathInfo;
	@Mock
	private Iterator<Resource> resources;
	@Mock
	private Map<String, HListHelper> hlmList;
	@Mock
	private Resource childRes;
	@Mock
	private HListHelper hListHelper;
	@Mock
	private Map<String, HListHelper> registeredHLMs;
	@Mock
	private ResourceBundle resourceBundle;
	@Mock
	private I18n i18n;
	@Mock
	private ViewAllBean viewAllBean;
	@Mock
	ValueMap props;
	@Mock
	ValueMap vm;
	@Mock
	Style style;
	@Mock
	Page currentPage;
	@Mock
	Resource res;
	@Mock
	Resource configPageRes;
	@Mock
	Resource configRes;
	@Mock
	Designer designer;
	@Mock
	ViewAllHelper viewAllHelper;
	
	
	String configPagePath = "/etc/dupont/phoenix/viewallconfig";

	
	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		MockitoAnnotations.initMocks(this);
		setupMockData();
	}
	
	private void setupMockData() throws JSONException {

		when(jspContext.getCurrentPage()).thenReturn(page);
		when(jspContext.getRequest()).thenReturn(slingRequest);
		when(slingRequest.getAttribute("hlmWrapper")).thenReturn(hlmWrapper);
		when(slingRequest.getRequestPathInfo()).thenReturn(requestPathInfo);
		//Create Mock Object for Global
		PowerMockito.mockStatic(Global.class);
		when(Global.getSelectorByIndex(slingRequest,1)).thenReturn("hlm-article");
		when(page.getContentResource()).thenReturn(resource);
		when(resource.listChildren()).thenReturn(resources);
		when(resources.hasNext()).thenReturn(true);
		when(resources.next()).thenReturn(childRes);
		when(Global.getSiteConfigStyle(resource)).thenReturn(style);
		when(style.getSubStyle("viewallconfiguration")).thenReturn(style);
		when(style.get("viewallconfiguration", String.class)).thenReturn("/etc/dupont/phoenix/viewallconfig");
		when(childRes.getResourceType()).thenReturn("dupont/phoenix/components/hlm");
		when(Global.getTranslatedText(page, slingRequest, "INFORMATION & IDEAS")).thenReturn("INFORMATION & IDEAS");
		PowerMockito.mockStatic(HLMFactory.class);
		//when(HLMFactory.getInstance()).thenReturn(hlmFactory);
		when(resources.hasNext()).thenReturn(true);
		when(resources.next()).thenReturn(childRes);
		when(childRes.getResourceType()).thenReturn("dupont/phoenix/components/hlm");
		//when(childRes.getResourceType()).thenReturn(childResourceType);
		
//		registeredHLMs = PowerMock.createMock(HashMap.class);
		when(registeredHLMs.put("dupont/phoenix/components/hlm", hListHelper)).thenReturn(hListHelper);
		when(registeredHLMs.get("dupont/phoenix/components/hlm")).thenReturn(hListHelper);
		when(hListHelper.getId()).thenReturn("dupont/phoenix/components/hlm");
		when(hlmList.put("hlm-article", hListHelper)).thenReturn(hListHelper);
		when(hlmList.get("hlm-article")).thenReturn(hListHelper);
		when(hlmWrapper.getHLMById("hlm-article")).thenReturn(hListHelper);
		when(hListHelper.getContentTypeName()).thenReturn("INFORMATION & IDEAS");
		when(Global.getTranslatedText(page, slingRequest, "INFORMATION & IDEAS")).thenReturn("INFORMATION & IDEAS");
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
		//
		when(page.getProperties()).thenReturn(vm);
		when(vm.get("contentType")).thenReturn("productcat");
		
		/*when(resource.getResourceResolver()).thenReturn(resolver);
		when(resolver.adaptTo(Designer.class)).thenReturn(designer);
		when(designer.getStyle(resource, Global.SITE_CONFIG_FOLDER_NAME)).thenReturn(style);
		when(style.getSubStyle("viewallconfiguration")).thenReturn(style);
		when(style.get("viewallconfiguration", String.class)).thenReturn(configPagePath);
		//when(viewAllHelper.getConfigurationPath("viewallconfiguration")).thenReturn(configPagePath);
		PowerMockito.mockStatic(StringUtils.class);
		when(StringUtils.isEmpty(configPagePath)).thenReturn(false);
		when(jspContext.getResourceResolver()).thenReturn(resolver);
		when(resolver.getResource(configPagePath)).thenReturn(configPageRes);
		when(configPageRes.getChild("jcr:content/openareapar/viewallconfig")).thenReturn(configRes);
		when(configRes.adaptTo(ValueMap.class)).thenReturn(props);
		when(props.get("productcat-article", String[].class)).thenReturn(tagArray);*/
		}

	/**
	 * @throws java.lang.Exception
	 */
	@After
	public void tearDown() throws Exception {
		resource = null;
		jspContext = null;
		slingRequest = null;
		page = null;
	}
	@Test
	public void testGetConfigurationPath(){
		ViewAll viewAll = new ViewAll(jspContext);
		assertNotNull(viewAll.getConfigurationPath("viewallconfiguration"));
	}
	@Test
	public void testGetContentTypeName(){
		ViewAll viewAll = new ViewAll(jspContext);
		assertNotNull(viewAll.getContentTypeName());
	}
	@Test
	public void testGetViewAllBean(){
		ViewAll viewAll = new ViewAll(jspContext);
		assertNotNull(viewAll.getViewAllBean());
	}
	@Test
	public void testGetTagsSet(){
		ViewAll viewAll = new ViewAll(jspContext);
		assertNotNull(viewAll.getTagsSet());
	}
}
