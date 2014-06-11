/**
 * 
 */
package com.dupont.phoenix.commons.impl;
import java.util.Dictionary;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.commons.osgi.OsgiUtil;
import org.apache.sling.jcr.api.SlingRepository;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dupont.phoenix.commons.LogoutConfigReader;

/**
 * @author  Senthil Margandayan
 *
 */
@Component(immediate = true, metatype = true,label = "SSO Logout Configuration")
@Service(value = LogoutConfigReader.class)
@Properties({
    @Property(name = "service.description", value = "SSO Logout Service"),
    @Property(name = "service.vendor", value = "Dupont"),
    @Property(name = "process.label", value = " SSO Logout URL")
})
public class LogoutConfigReaderImpl implements LogoutConfigReader {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(LogoutConfigReaderImpl.class);
	
	@Property(name ="ssoLogoutUrl" , label = " Logout URL", description = "SSO Logout URL ", value = "")
	public static final String SSO_LOGOUT_URL = "ssoLogoutUrl";
	
	private String ssoLogoutUrl;
	
	protected void activate(ComponentContext componentContext){
		configure(componentContext.getProperties());
	}
	
	protected void configure(Dictionary<?, ?> properties) {
		this.ssoLogoutUrl = OsgiUtil.toString(properties.get(SSO_LOGOUT_URL), null);
		LOGGER.info("configure: SSO Logout URL ='{}''", this.ssoLogoutUrl);
	}
	public String getLogoutURL() {
		return this.ssoLogoutUrl;
	}


	
}
