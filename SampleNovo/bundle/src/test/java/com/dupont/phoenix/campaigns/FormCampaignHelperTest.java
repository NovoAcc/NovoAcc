package com.dupont.phoenix.campaigns;

import static org.easymock.EasyMock.anyString;
import static org.junit.Assert.assertNotNull;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import javax.jcr.Binary;
import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.RepositoryException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.easymock.EasyMock;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.powermock.api.easymock.PowerMock;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;
import com.dupont.phoenix.GlobalConstants;
import com.dupont.phoenix.taglibs.context.JSPContext;


public class FormCampaignHelperTest {
	
	private Resource resource;
	private ResourceResolver resourceResolver; 
	private JSPContext jspContext;
	private ValueMap properties;
	private Node node;
	private SlingHttpServletRequest slingRequest;
	private Page currentPage;
	private Property prop;
	private Binary binary;

	
	@Before
	public void setUp() throws Exception {
		jspContext = PowerMock.createMock(JSPContext.class);
		slingRequest = PowerMock.createMock(SlingHttpServletRequest.class);
		resource = PowerMock.createMock(Resource.class);
		resourceResolver = PowerMock.createMock(ResourceResolver.class);
		properties = PowerMock.createMock(ValueMap.class);
		node =  PowerMock.createMock(Node.class);
		currentPage = PowerMock.createMock(Page.class);
		prop = PowerMock.createMock(Property.class);
		binary = PowerMock.createMock(Binary.class);
		
		EasyMock.expect(jspContext.getResource()).andReturn(resource).anyTimes();
		EasyMock.expect(jspContext.getRequest()).andReturn(slingRequest).anyTimes();
		EasyMock.expect(jspContext.getCurrentPage()).andReturn(currentPage).anyTimes();
		EasyMock.expect(currentPage.getTitle()).andReturn("").anyTimes();
		EasyMock.expect(slingRequest.getAttribute(anyString())).andReturn(WCMMode.EDIT).anyTimes();
		EasyMock.expect(resource.getResourceResolver()).andReturn(resourceResolver).anyTimes();
		EasyMock.expect(jspContext.getResourceResolver()).andReturn(resourceResolver).anyTimes();
		EasyMock.expect(resourceResolver.getResource(anyString())).andReturn(resource).anyTimes();
		EasyMock.expect(resource.adaptTo(Node.class)).andReturn(node).anyTimes();
		EasyMock.expect(node.getProperty(anyString())).andReturn(prop).anyTimes();
		EasyMock.expect(prop.getBinary()).andReturn(binary).anyTimes();
		String value = "Disclaimer Text";
		InputStream inputStream = new ByteArrayInputStream(value.getBytes());
		EasyMock.expect(binary.getStream()).andReturn(inputStream);
		EasyMock.expect(jspContext.getProperties()).andReturn(properties).anyTimes();
		EasyMock.expect(properties.get(GlobalConstants.DISCLAIMER_PATH)).andReturn("/content/dam/path").anyTimes();
		String[] path = new String[2];
		path[0] = path[1]= "/content/dam/media/path.js";
		EasyMock.expect(properties.get(GlobalConstants.SELECT_CSS_FILE_PATHS, String[].class)).andReturn(path).anyTimes();
		EasyMock.expect(properties.get(GlobalConstants.SELECT_JS_FILE_PATHS,String[].class)).andReturn(path).anyTimes();
		EasyMock.expect(properties.containsKey(GlobalConstants.FORM_FLAG)).andReturn(true).anyTimes();
		EasyMock.expect(properties.get(GlobalConstants.FORM_FLAG, Boolean.class)).andReturn(false).anyTimes();
		
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
		prop = null;
		binary = null;
	}

	@Test
	public void testFormCampaign() throws RepositoryException {
		FormCampaignHelper formCampaignHelper = new FormCampaignHelper(jspContext);
		assertNotNull(formCampaignHelper.getFormBean());
	}

}
