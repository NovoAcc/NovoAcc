/**
 * 
 */
package com.dupont.phoenix.commons.helpers;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.easymock.EasyMock;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.easymock.PowerMock;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.taglibs.context.JSPContext;


/**
 * @author A.Shashi.Chaurasia
 *
 */
@RunWith(PowerMockRunner.class)
@PrepareForTest(Global.class)
public class DisclaimerHelperTest {
	
	private SlingHttpServletRequest slingRequest;
	private Resource resource;
	private String disclaimer;
	private InheritanceValueMap iProperties;
	private JSPContext jspContext;
	private DisclaimerHelper disclaimerHelper;

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
		jspContext = PowerMock.createMock(JSPContext.class);
		slingRequest = PowerMock.createMock(SlingHttpServletRequest.class);
		resource = PowerMock.createMock(Resource.class);
		disclaimer = PowerMock.createMock(String.class);
		iProperties = PowerMock.createMock(InheritanceValueMap.class);
		disclaimerHelper = PowerMock.createMock(DisclaimerHelper.class);
		/*
		 * Create Mock object using Class constructor with parameters.
		 */
		iProperties = PowerMock.createMockAndExpectNew(HierarchyNodeInheritanceValueMap.class, resource);
		EasyMock.expect(jspContext.getResource()).andReturn(resource).anyTimes();
		EasyMock.expect(jspContext.getRequest()).andReturn(slingRequest).anyTimes();
		EasyMock.expect(iProperties.getInherited("text", String.class)).andReturn(disclaimer).anyTimes();
		
		/*
		 * Create a mock of final class for using static method.
		 */
		PowerMock.mockStatic(Global.class);
		EasyMock.expect(Global.isEdit(slingRequest)).andReturn(true).anyTimes();
		
		disclaimerHelper = PowerMock.createMockAndExpectNew(DisclaimerHelper.class, jspContext);
		EasyMock.expect(disclaimerHelper.getDisclaimer()).andReturn(disclaimer);
		EasyMock.expect(disclaimerHelper.isEdit()).andReturn(true);
		
		PowerMock.replayAll();
		
	}

	/**
	 * @throws java.lang.Exception
	 */
	@After
	public void tearDown() throws Exception {
		slingRequest = null;
		resource = null;
		disclaimer = null;
		iProperties = null;
	}

	/**
	 * Test method for {@link com.dupont.phoenix.commons.helpers.DisclaimerHelper#getDisclaimer()}.
	 */
	@Test
	public void testGetDisclaimerTest() {
		assertNotNull(disclaimerHelper.getDisclaimer());
	}
	@Test
	public void testIsEdit() throws Exception{
		assertTrue(disclaimerHelper.isEdit());
	}

}
