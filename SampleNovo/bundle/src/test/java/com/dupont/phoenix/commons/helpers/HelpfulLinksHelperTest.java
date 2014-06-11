package com.dupont.phoenix.commons.helpers;

import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.when;

import javax.jcr.Node;
import javax.jcr.Property;

import org.apache.sling.api.SlingHttpServletRequest;
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
import org.mockito.Spy;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.adobe.granite.xss.XSSAPI;
import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMMode;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.taglibs.context.JSPContext;

@RunWith(PowerMockRunner.class)
@PrepareForTest(Global.class)
public class HelpfulLinksHelperTest {
	
	@Mock
	Resource resource;
	@Mock
	ResourceResolver resolver; 
	@Mock
	JSPContext jspContext;
	@Mock
	ValueMap properties;
	@Mock
	Node node;
	@Mock
	SlingHttpServletRequest slingRequest;
	@Mock
	Page page;
	@Mock
	Property prop;
	@Mock
	XSSAPI xssAPI;
	@Spy
	InheritanceValueMap iProperties =  new HierarchyNodeInheritanceValueMap(resource);
	@Mock
	ValueMap props;
	@Mock
	ValueMap vm;
	@Mock
	ValueMap pageProps;
	@Mock
	PageManager pm;
	
	private String heroColor = "9d3e04";


	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		 MockitoAnnotations.initMocks(this);
		 setupMockData();
	}

	private void setupMockData() throws JSONException
		{
		
		when(jspContext.getResource()).thenReturn(resource);
		when(jspContext.getRequest()).thenReturn(slingRequest);
		when(jspContext.getCurrentPage()).thenReturn(page);
		when(page.getParent()).thenReturn(page);
		when(page.getPath()).thenReturn("");
		when(jspContext.getProperties()).thenReturn(props);
		when(jspContext.getPageProperties()).thenReturn(pageProps);
		when(pageProps.get("heroColor",String.class)).thenReturn(heroColor);
		when(jspContext.getResourceResolver()).thenReturn(resolver);
		when(resolver.adaptTo(XSSAPI.class)).thenReturn(xssAPI);
		when(resource.adaptTo(ValueMap.class)).thenReturn(vm);
		when(slingRequest.getResourceResolver()).thenReturn(resolver);
		when(resolver.adaptTo(PageManager.class)).thenReturn(pm);
		when(pm.getPage("#")).thenReturn(page);
		PowerMockito.mockStatic(Global.class);
		
		when(Global.isEdit(slingRequest)).thenReturn(true);
		when(Global.getTranslatedText(page, slingRequest,"Helpful Links:")).thenReturn("Helpful Links:");
		when(props.get("helpfullinks",null)).thenReturn(null);
		when(WCMMode.fromRequest(slingRequest)).thenReturn(WCMMode.EDIT);
		
		when(Global.isExternalLink("#")).thenReturn(false);
		when(Global.getNavigationURL(slingRequest, "", false)).thenReturn("");
		when(Global.getNavigationURL(slingRequest, page,false)).thenReturn("");
	}
	
	/**
	 * @throws java.lang.Exception
	 */
	@After
	public void tearDown() throws Exception {
		resource = null;
		resolver = null;
		jspContext = null;
		properties = null;
		node = null;
		slingRequest = null;
		page = null;
		prop = null;
	}

	@Test
	public void testGetHelpfulLinkBean() {
		String[] linkItems = {"{\"linkURL\":\"#\",\"linkText\":\"rr\"}"};
		when(iProperties.getInherited("helpfullinks", String[].class)).thenReturn(linkItems);
		when(props.get("helpfullinks",String[].class)).thenReturn(linkItems);
		when(vm.get("helpfullinks",String[].class)).thenReturn(linkItems);
		
		HelpfulLinksHelper helpfulLinksHelper = new HelpfulLinksHelper(jspContext);
		assertNotNull(helpfulLinksHelper.getHelpfulLinkBean());
	}
	
	@Test
	public void testGetHelpfulLinkBeanElse() {
		String[] linkItems = {"{\"linkURL\":\"#\",\"linkText\":\"rr\"}"};
		when(props.get("helpfullinks",null)).thenReturn(linkItems);
		when(iProperties.getInherited("helpfullinks", String[].class)).thenReturn(linkItems);
		when(props.get("helpfullinks",String[].class)).thenReturn(linkItems);
		when(vm.get("helpfullinks",String[].class)).thenReturn(linkItems);
		
		HelpfulLinksHelper helpfulLinksHelper = new HelpfulLinksHelper(jspContext);
		assertNotNull(helpfulLinksHelper.getHelpfulLinkBean());
	}	
	@Test 
	public void testGetHelpfulLinkBeanWithJsonException() throws JSONException {
		String[] linkItems = {"linkURL#"};
		when(iProperties.getInherited("helpfullinks", String[].class)).thenReturn(linkItems);
		when(props.get("helpfullinks",String[].class)).thenReturn(linkItems);
		when(vm.get("helpfullinks",String[].class)).thenReturn(linkItems);
		HelpfulLinksHelper helpfulLinksHelper = new HelpfulLinksHelper(jspContext);
		assertNotNull(helpfulLinksHelper.getHelpfulLinkBean());
	}
}
