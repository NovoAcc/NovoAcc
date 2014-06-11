package com.dupont.phoenix.campaigns;

import static org.junit.Assert.assertNotNull;

import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.easymock.EasyMock;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.easymock.PowerMock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.day.cq.wcm.api.designer.Designer;
import com.day.cq.wcm.api.designer.Style;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.taglibs.context.JSPContext;


@RunWith(PowerMockRunner.class)
@PrepareForTest(Global.class)
public class FooterCampaignHelperTest {

	private Resource resource;
	private Style style, style1;
	private Designer designer;
	private ResourceResolver resourceResolver; 
	private String string;
	private JSPContext jspContext;
	
	@Before
	public void setUp() throws Exception {
		jspContext = PowerMock.createMock(JSPContext.class);
		resource = PowerMock.createMock(Resource.class);
		resourceResolver = PowerMock.createMock(ResourceResolver.class);
		designer = PowerMock.createMock(Designer.class);
		style = PowerMock.createMock(Style.class);
		style1 = PowerMock.createMock(Style.class);
		string = PowerMock.createMock(String.class);
		
		EasyMock.expect(jspContext.getResource()).andReturn(resource).anyTimes();
		EasyMock.expect(resource.getResourceResolver()).andReturn(resourceResolver).anyTimes();
		EasyMock.expect(resourceResolver.adaptTo(Designer.class)).andReturn(designer).anyTimes();
		EasyMock.expect(designer.getStyle(resource, "siteconfig")).andReturn(style).anyTimes();
		PowerMock.mockStatic(Global.class);
		EasyMock.expect(Global.getSiteConfigStyle(resource)).andReturn(style).anyTimes();
		EasyMock.expect(style.getSubStyle("footer")).andReturn(style1).anyTimes();
		EasyMock.expect(style1.get("copyrightText",String.class)).andReturn(string).anyTimes();
		PowerMock.replayAll(resource, resourceResolver, designer, style, style1, string,  Global.class);
	}

	@After
	public void tearDown() {
		resource = null;
		style = null;
		style1 = null;
		resourceResolver = null;
		designer = null;
		string = null;
	}

	@Test
	public void testGetSiteFooterConfigPropValueEmpty() throws RepositoryException {
		FooterCampaignHelper footerCampaignHelper = new FooterCampaignHelper(jspContext);
		assertNotNull(footerCampaignHelper.getCopyRightText());
	}
}
