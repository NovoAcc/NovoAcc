package com.dupont.phoenix.navigation;

import static org.easymock.EasyMock.createMock;
import static org.easymock.EasyMock.expect;
import static org.easymock.EasyMock.replay;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.easymock.EasyMock.anyInt;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.easymock.EasyMock;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.easymock.PowerMock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.day.cq.wcm.api.Page;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.taglibs.context.JSPContext;

@RunWith(PowerMockRunner.class)
@PrepareForTest(Global.class)
public class BreadcrumbTest {

	private SlingHttpServletRequest slingRequest;
	private Page currentPage;
	private Resource resource;
	private JSPContext jspContext;
	private ValueMap vm;
	private static final int MAX_LEVELS = 3;
	private static final int DEPTH = 4;
	private ResourceResolver resourceResolver;

	//	Example page
	//	/content/us-site/test-page/current-page
	
	@Before
	public void setUp() throws Exception {
		slingRequest = PowerMock.createMock(SlingHttpServletRequest.class);
		currentPage = PowerMock.createMock(Page.class);
		vm = PowerMock.createMock(ValueMap.class);
		jspContext = PowerMock.createMock(JSPContext.class);
		resourceResolver = PowerMock.createMock(ResourceResolver.class);

		PowerMock.mockStatic(Global.class);
		EasyMock.expect(Global.getNavigationTitle(currentPage)).andReturn("").anyTimes();
		EasyMock.expect(jspContext.getRequest()).andReturn(slingRequest).anyTimes();
		EasyMock.expect(jspContext.getResource()).andReturn(resource).anyTimes();
		EasyMock.expect(jspContext.getCurrentPage()).andReturn(currentPage).anyTimes();
		EasyMock.expect(currentPage.getDepth()).andReturn(DEPTH).anyTimes();
		EasyMock.expect(currentPage.getProperties()).andReturn(vm).anyTimes();
		EasyMock.expect(currentPage.isHideInNav()).andReturn(false).anyTimes();
		EasyMock.expect(currentPage.getAbsoluteParent(anyInt())).andReturn(currentPage).anyTimes();
		EasyMock.expect(currentPage.getPath()).andReturn("/content/us-site/test-page/current-page").anyTimes();
		EasyMock.expect(vm.get("cq:template", "")).andReturn("/apps/dupont/phoenix/templates/base").anyTimes();
		EasyMock.expect(vm.get("windowflag", "false")).andReturn("true").anyTimes();
		EasyMock.expect(slingRequest.getResourceResolver()).andReturn(resourceResolver).anyTimes();
		EasyMock.expect(resourceResolver.map(slingRequest,"/content/us-site/test-page/current-page")).andReturn("/content/us-site/test-page/current-page").anyTimes();

		for(int i = 1; i < MAX_LEVELS; i++) {
			Page parentPage = createMock(Page.class);
			EasyMock.expect(parentPage.isHideInNav()).andReturn(false).anyTimes();
			EasyMock.expect(parentPage.getPath()).andReturn("/content/us-site/test-page/current-page").anyTimes();
			EasyMock.expect(parentPage.getProperties()).andReturn(vm).anyTimes();
			EasyMock.expect(Global.getNavigationTitle(parentPage)).andReturn("Page " + i + " Nav Title").anyTimes();
			EasyMock.expect(parentPage.getNavigationTitle()).andReturn("Page " + i + " Nav Title").anyTimes();
			EasyMock.expect(currentPage.getAbsoluteParent(i)).andReturn(parentPage).anyTimes();
			
		}
		resource = createMock(Resource.class);

		EasyMock.expect(currentPage.getContentResource()).andReturn(resource ).anyTimes();

		PowerMock.replayAll();
		
		
	}
		
	@Test
	public void testGetLevel() {
		Breadcrumb testBreadcrumb = new Breadcrumb(jspContext);
		assertTrue(testBreadcrumb.getLevel() == 1);
		//assertTrue(0 == 0);
	}
	
	@Test
	public void testBreadcrumb() {
		Breadcrumb testBreadcrumb = new Breadcrumb(jspContext);
		assertEquals(testBreadcrumb.getPagesInBreadcrumb().size(), 3);
	}
	
}
