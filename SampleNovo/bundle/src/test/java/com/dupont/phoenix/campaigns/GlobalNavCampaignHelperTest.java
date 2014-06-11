package com.dupont.phoenix.campaigns;

import static org.junit.Assert.assertNotNull;
import static org.easymock.EasyMock.anyString;
import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.easymock.EasyMock;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.powermock.api.easymock.PowerMock;

import com.adobe.granite.xss.XSSAPI;
import com.day.cq.wcm.api.Page;
import com.dupont.phoenix.taglibs.context.JSPContext;

public class GlobalNavCampaignHelperTest {
	Resource resource;
	ResourceResolver resourceResolver; 
	String string;
	JSPContext jspContext;
	Page currentPage;
	ValueMap properties;
	XSSAPI xssApi;
	
	@Before
	public void setUp() throws Exception {
		jspContext = PowerMock.createMock(JSPContext.class);
		resource = PowerMock.createMock(Resource.class);
		resourceResolver = PowerMock.createMock(ResourceResolver.class);
		string = PowerMock.createMock(String.class);
		currentPage = PowerMock.createMock(Page.class);
		properties = PowerMock.createMock(ValueMap.class);
		xssApi = PowerMock.createMock(XSSAPI.class);
		EasyMock.expect(jspContext.getResource()).andReturn(resource).anyTimes();
		EasyMock.expect(jspContext.getResourceResolver()).andReturn(resourceResolver).anyTimes();
		EasyMock.expect(resourceResolver.adaptTo(XSSAPI.class)).andReturn(xssApi).anyTimes();
		EasyMock.expect(xssApi.getValidHref(anyString())).andReturn("http://www.google.com").anyTimes();
		EasyMock.expect(jspContext.getCurrentPage()).andReturn(currentPage).anyTimes();
		EasyMock.expect(currentPage.getAbsoluteParent(2)).andReturn(currentPage).anyTimes();
		EasyMock.expect(currentPage.getPath()).andReturn("#/home.html").anyTimes();
		EasyMock.expect(jspContext.getProperties()).andReturn(properties).anyTimes();
		EasyMock.expect(properties.get(anyString(), anyString())).andReturn("http://www.google.com").anyTimes();
		PowerMock.replayAll();
	}

	@After
	public void tearDown() {
		resource = null;
		resourceResolver = null;
		string = null;
	}
	
	@Test
	public void testGlobalNavLogoLink() throws RepositoryException {
		GlobalNavCampaignHelper globalNavCampaignHelper = new GlobalNavCampaignHelper(jspContext);
		assertNotNull(globalNavCampaignHelper.getHomePageURL());
	}
	
	

}
