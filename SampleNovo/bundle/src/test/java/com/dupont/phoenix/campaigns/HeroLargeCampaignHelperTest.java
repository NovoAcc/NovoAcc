package com.dupont.phoenix.campaigns;

import static org.easymock.EasyMock.anyString;
import static org.junit.Assert.assertNotNull;

import java.util.Locale;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.RepositoryException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.PersistableValueMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.easymock.EasyMock;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.powermock.api.easymock.PowerMock;

import com.day.cq.commons.DiffInfo;
import com.day.cq.commons.DiffInfo.TYPE;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;
import com.dupont.phoenix.commons.Scene7Image;
import com.dupont.phoenix.taglibs.context.JSPContext;

public class HeroLargeCampaignHelperTest {
	private Resource resource;
	private ResourceResolver resourceResolver; 
	private JSPContext jspContext;
	private ValueMap properties;
	private Node node;
	private SlingHttpServletRequest slingRequest;
	private Page currentPage;
	private DiffInfo diffinfo;
	private Property prop;
	private PersistableValueMap persistableValueMap;
	private Scene7Image image;
	
	@Before
	public void setUp() throws Exception {
		jspContext = PowerMock.createMock(JSPContext.class);
		slingRequest = PowerMock.createMock(SlingHttpServletRequest.class);
		resource = PowerMock.createMock(Resource.class);
		resourceResolver = PowerMock.createMock(ResourceResolver.class);
		properties = PowerMock.createMock(ValueMap.class);
		node =  PowerMock.createMock(Node.class);
		currentPage = PowerMock.createMock(Page.class);
		diffinfo = PowerMock.createMock(DiffInfo.class);
		prop = PowerMock.createMock(Property.class);
		persistableValueMap = PowerMock.createMock(PersistableValueMap.class);
		image =  PowerMock.createMock(Scene7Image.class);
		EasyMock.expect(jspContext.getResource()).andReturn(resource).anyTimes();
		EasyMock.expect(jspContext.getRequest()).andReturn(slingRequest).anyTimes();
		EasyMock.expect(jspContext.getCurrentPage()).andReturn(currentPage).anyTimes();
		EasyMock.expect(WCMMode.fromRequest(slingRequest)).andReturn(WCMMode.EDIT);
		EasyMock.expect(resource.adaptTo(Node.class)).andReturn(node).anyTimes();
		EasyMock.expect(resource.adaptTo(ValueMap.class)).andReturn(properties).anyTimes();
		EasyMock.expect(resource.adaptTo(DiffInfo.class)).andReturn(diffinfo).anyTimes();
		EasyMock.expect(diffinfo.getContent()).andReturn(resource).anyTimes();
		EasyMock.expect(resource.getPath()).andReturn("").anyTimes();
		EasyMock.expect(diffinfo.getType()).andReturn(TYPE.ADDED).anyTimes();
		EasyMock.expect(node.hasProperty(anyString())).andReturn(true).anyTimes();
		EasyMock.expect(node.getProperty(anyString())).andReturn(prop).anyTimes();
		EasyMock.expect(prop.getLong()).andReturn(new Long(0)).anyTimes();
		EasyMock.expect(properties.get(anyString(), anyString())).andReturn("").anyTimes();
		EasyMock.expect(properties.containsKey(anyString())).andReturn(true).anyTimes();
		EasyMock.expect(slingRequest.getAttribute(anyString())).andReturn(WCMMode.EDIT).anyTimes();
		EasyMock.expect(resource.adaptTo(PersistableValueMap.class)).andReturn(null).anyTimes();
		EasyMock.expect(jspContext.getProperties()).andReturn(properties).anyTimes();
		EasyMock.expect(properties.get(anyString())).andReturn("").anyTimes();
		EasyMock.expect(currentPage.getLanguage(false)).andReturn(new Locale("en")).anyTimes();
		EasyMock.expect(properties.get("dam:scene7URL", String.class)).andReturn("").anyTimes();
		EasyMock.expect(jspContext.getPageProperties()).andReturn(properties).anyTimes();
		//EasyMock.expectLastCall().anyTimes();
		PowerMock.replayAll();
	}
	
	@After
	public void tearDown() {
		resource = null;
		resourceResolver = null;
		jspContext = null;
		properties = null;
		node = null;
		slingRequest = null;
		currentPage = null;
		diffinfo = null;
		prop = null;
		persistableValueMap = null;
		image = null;
	}
	
	@Test
	public void testHeroLarge() throws RepositoryException {
		HeroLargeCampaignHelper formCampaignHelper = new HeroLargeCampaignHelper(jspContext);
		assertNotNull(formCampaignHelper.getHeroLargeBean());
	}
}
