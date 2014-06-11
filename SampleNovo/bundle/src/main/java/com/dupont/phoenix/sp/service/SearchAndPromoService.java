/**
 * 
 */
package com.dupont.phoenix.sp.service;

import java.io.IOException;
import java.util.StringTokenizer;

import javax.servlet.ServletException;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferenceCardinality;
import org.apache.felix.scr.annotations.ReferencePolicy;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.cm.Configuration;
import org.osgi.service.cm.ConfigurationAdmin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author A.Shashi.Chaurasia
 * 
 */
@Service
@Component
@Property(name = "sling.servlet.paths", value = "/bin/dupont/searchpromo/results")
public class SearchAndPromoService extends SlingSafeMethodsServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = -3429650290902637378L;
	private static final Logger LOGGER = LoggerFactory
			.getLogger(SearchAndPromoService.class);
	private static final String PID_NAME = "com.day.commons.httpclient";
	private static final String PROXY_HOST_PROP = "proxy.host";

	@SuppressWarnings("UnusedDeclaration")
	@Reference(cardinality = ReferenceCardinality.MANDATORY_UNARY, policy = ReferencePolicy.STATIC)
	private ConfigurationAdmin configAdmin;

	/*
	 * Constants. private static final String SEARCH_PROMO_SERVER_URL =
	 * "http://dupont-en.guided.ss-omtrdc.net/";
	 */
	/**
	 * ?q=*&country=CA
	 */
	public SearchAndPromoService() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * This GET method integrate the S&P service and get JSON as search result
	 * and send it with response.
	 */
	public void doGet(SlingHttpServletRequest request,
			SlingHttpServletResponse response) throws IOException,
			ServletException {
		/*
		 * Set Content Type application/json
		 */
		response.setContentType("application/json");
		LOGGER.info("SearchAndPromoService --- doGet");

		String param = null;
		String serviceURL = null;
		String searchIndex = null;
		String connectionURL = "";
		// BufferedReader bufferedReader = null;
		GetMethod method = null;
		byte[] responseBody = null;

		/*
		 * Check if request have PARAM and SERVICE_URL.
		 */
		if (request.getRequestParameter("SERVICE_URL") != null) {
			serviceURL = request.getRequestParameter("SERVICE_URL").getString();
			connectionURL += serviceURL;
			// LOGGER.info("serviceURL :: "+serviceURL);
		} else {
			new Throwable("Service URL is not provided.");
		}
		if (request.getRequestParameter("PARAM") != null) {
			param = request.getRequestParameter("PARAM").getString();
			if (!param.contains("?")) {
				connectionURL += "?" + param;
			} else {
				connectionURL += param;
			}
			// LOGGER.info("param :: "+param+"	Connection URL:: "+connectionURL);
		} else {
			param = "q=*";
			if (param.contains("?")) {
				connectionURL += "?" + param;
			} else {
				connectionURL += param;
			}
			// LOGGER.info("Param is null	Connection URL:: "+connectionURL);
		}

		if (request.getRequestParameter("SEARCH_INDEX") != null) {
			searchIndex = request.getRequestParameter("SEARCH_INDEX")
					.getString();
			String newIndex = "";
			if (connectionURL.contains("country=")
					&& searchIndex.contains("country=")) {
				// LOGGER.info("searchIndex :: "+searchIndex);
				int index = searchIndex.indexOf("country");
				String subStr = searchIndex.substring(index, index + 10);
				newIndex = searchIndex.replace(subStr, "");
			} else {
				newIndex = searchIndex;
			}
			// LOGGER.info("newIndex :: "+newIndex);
			int indx = newIndex.indexOf('&');
			if (indx != 0) {
				connectionURL += "&" + newIndex.trim();
			} else {
				connectionURL += newIndex.trim();
			}

			// LOGGER.info("newIndex :: "+newIndex+"	Connection URL:: "+connectionURL);
		} else {
			new Throwable("Search Index is not provided.");
		}

		/*
		 * Create Connection Object.
		 */
		LOGGER.info("URL :: " + connectionURL);
		try {
			/*
			 * Get HTTPClient Configuration properties
			 */
			int count = 0;
			String host = "";
			String port = "";
			String proxyHost = "";			
			if(configAdmin != null){
				LOGGER.info("configAdmin != null");
			Configuration conf = configAdmin.getConfiguration(PID_NAME);
			LOGGER.info("conf == "+conf);
			if(conf != null){
				LOGGER.info("conf != null");
				if(conf.getProperties() != null){
					LOGGER.info("conf.getProperties() != null");
					proxyHost = (String) conf.getProperties().get(PROXY_HOST_PROP);
				}
			}
			LOGGER.info(" Proxy Host:: " + proxyHost);
			if(proxyHost != null && !"".equals(proxyHost)){
				LOGGER.info("proxyHost != null");
			StringTokenizer stringTokenizer = new StringTokenizer(proxyHost,":");
			
			while (stringTokenizer.hasMoreElements()) {
				if (count == 0) {
					host = (String) stringTokenizer.nextElement();
					count++;
				} else {
					port = (String) stringTokenizer.nextElement();
					count++;
				}
				LOGGER.info("host :: " + host+ " | port:: " + port);
			}}}else{
			LOGGER.info("configAdmin == null");
			}
			/*
			 * Open Connection.
			 */
			HttpClient client = null;
			client = new HttpClient(new MultiThreadedHttpConnectionManager());
			if ((host != null && !"".equals(host)) && (port != null && !"".equals(port))) {
				client.getHostConfiguration().setProxy(host, Integer.parseInt(port.trim()));
			}
			LOGGER.info("Connect URL...");
			// Create a method instance.
			method = new GetMethod(connectionURL);

			// Provide custom retry handler is necessary
			method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,
					new DefaultHttpMethodRetryHandler(3, false));

			// Execute the method.
			int statusCode = client.executeMethod(method);

			if (statusCode != HttpStatus.SC_OK) {
				throw new HttpException("Failed : HTTP error code : "
						+ method.getStatusLine());
			}

			// Read the response body.
			responseBody = method.getResponseBody();

		} catch (IOException exception) {
			LOGGER.error(" IOException :: ",  exception);
		} catch (ClassCastException classCastException) {
			LOGGER.error(" ClassCastException :: " , classCastException);
		}catch (Exception excep) {
			LOGGER.error("Exception caught :: ", excep);
		} finally {
			LOGGER.info("InputStream closed *******");
			/*
			 * Close Connection.
			 */
			if(method != null){
				method.releaseConnection();
			}
		}
		if(null!=response && null!=response.getOutputStream()){
		response.setCharacterEncoding("utf-8");
		response.getOutputStream().write(responseBody);
		}
	}
}