package com.dupont.phoenix.footer;

import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;

import javax.jcr.RepositoryException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.easymock.EasyMock;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.easymock.PowerMock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.footer.ContextualFooter;
import com.dupont.phoenix.taglibs.context.JSPContext;

@RunWith(PowerMockRunner.class)
@PrepareForTest(Global.class)
public class ContextualFooterTest {

	private Resource resource;
	private JSPContext jspContext;
	private Page page;
	private SlingHttpServletRequest slingRequest;
	private ValueMap vm;
	private Style style;
	
	@Before
	public void setUp() throws Exception {
		page = PowerMock.createMock(Page.class);
		jspContext = PowerMock.createMock(JSPContext.class);
		resource = PowerMock.createMock(Resource.class);
		slingRequest = PowerMock.createMock(SlingHttpServletRequest.class);
		vm = PowerMock.createMock(ValueMap.class);
		style = PowerMock.createMock(Style.class);
		
		EasyMock.expect(jspContext.getResource()).andReturn(resource).anyTimes();
		EasyMock.expect(jspContext.getRequest()).andReturn(slingRequest).anyTimes();
		EasyMock.expect(jspContext.getCurrentPage()).andReturn(page).anyTimes();
		EasyMock.expect(page.getParent()).andReturn(page).anyTimes();
		EasyMock.expect(page.getPath()).andReturn("").anyTimes();
		PowerMock.mockStatic(Global.class);
		EasyMock.expect(Global.getNavigationChildList("",resource,slingRequest, Boolean.FALSE)).andReturn(new ArrayList()).anyTimes();
		EasyMock.expect(Global.getNavigationChildList("",resource,slingRequest, Boolean.TRUE)).andReturn(new ArrayList()).anyTimes();
		EasyMock.expect(page.getProperties()).andReturn(vm).anyTimes();
		EasyMock.expect(vm.get("moreLinksEnabled",String.class)).andReturn("").anyTimes();
		EasyMock.expect(vm.get("cq:template","")).andReturn("/apps/dupont/phoenix/templates/responsive/corporatecontent").anyTimes();
		EasyMock.expect(resource.adaptTo(ValueMap.class)).andReturn(vm).anyTimes();
		EasyMock.expect(page.isHideInNav()).andReturn(true).anyTimes();
		EasyMock.expect(Global.getHeroHeadline(page)).andReturn("").anyTimes();
		EasyMock.expect(Global.getSiteConfigStyle(resource)).andReturn(style).anyTimes();
		EasyMock.expect(style.getSubStyle("footer")).andReturn(style).anyTimes();
		EasyMock.expect(style.get("copyrightText",String.class)).andReturn("").anyTimes();
		EasyMock.expect(style.get("corporateFolderPath",String.class)).andReturn("").anyTimes();
		EasyMock.expect(style.get("utilityLinksFolderPath",String.class)).andReturn("").anyTimes();
		EasyMock.expect(style.get("ipcText",String.class)).andReturn("").anyTimes();
		EasyMock.expect(Global.isEdit(slingRequest)).andReturn(true).anyTimes();
		PowerMock.replayAll();
	}
	
	@Test
	public void testInitialize() throws RepositoryException {
		ContextualFooter footerCampaignHelper = new ContextualFooter(jspContext);
		assertNotNull(footerCampaignHelper.getCopyRightText());
	}
	
	@After
	public void tearDown() {
		resource = null;
		resource = null;
		jspContext = null;
		page = null;
		slingRequest = null;
		vm = null;
		style = null;
		
	}


}
