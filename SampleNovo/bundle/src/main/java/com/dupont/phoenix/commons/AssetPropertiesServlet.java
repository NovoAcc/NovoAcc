/**
 * 
 */
package com.dupont.phoenix.commons;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.Map;

import javax.servlet.ServletException;

import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.dam.scene7.api.S7ConfigResolver;

/**
 * Servlet to get Asset metadata
 * 
 */
@Service
@Component
@Property(name = "sling.servlet.paths", value = "/bin/dupont/assets/metadata")
public class AssetPropertiesServlet extends SlingSafeMethodsServlet {
	private static final String UTF_8 = "UTF-8";
	private static final String EQUAL = "=";
	private static final String AND = "&";
	private static final String VIDEO = "2";
	private static final String IMAGE = "1";
	private static final String PATH = "path";
	private static final String ASSET_TYPE = "assetType";
	private static final String GALLERY_NAME = "galleryName";
	private static final String ASSET_NAME = "assetName";
	/**
	 * 
	 */
	private static final long serialVersionUID = -3429650290902637378L;
	private static final Logger LOGGER = LoggerFactory.getLogger(AssetPropertiesServlet.class);
	@Reference
	private S7ConfigResolver s7ConfigResolver;
	
	/**
	 * This GET method get JSON as metadata result
	 * and send it with response.
	 */
	public void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException, ServletException {
		/*
		 * Set Content Type application/json
		 */
		LOGGER.info("AssetPropertiesServlet --- doGet");
		
		String assetName = null;
		String galleryName = null;
		String assetType = null;
		String path = null;
		// Getting request parameters
		if (request.getRequestParameter(ASSET_NAME) != null) {
			assetName = request.getRequestParameter(ASSET_NAME).getString();
		}
		if (request.getRequestParameter(GALLERY_NAME) != null) {
			String queryString = request.getQueryString();
			String parts[] = queryString.split(AND);
			String galleryNameEncoded = parts[2].substring(parts[2].indexOf(EQUAL)+1);
			galleryName = URLDecoder.decode(galleryNameEncoded,UTF_8);
	//		galleryName = request.getRequestParameter(GALLERY_NAME).getString();
	//		String encode = URLDecoder.decode(galleryName,"UTF-8");
			LOGGER.info(galleryName  );
		}
		if (request.getRequestParameter(ASSET_TYPE) != null) {
			assetType = request.getRequestParameter(ASSET_TYPE).getString();
		}
		if (request.getRequestParameter(PATH) != null) {
			path = request.getRequestParameter(PATH).getString();
		}
		JSONObject json = null;
		try {
			if (null != assetName && !("").equals(assetName)) {
				LOGGER.info("AssetPropertiesServlet + AssetName +AssetType + path" + assetName + " " +assetType + " " + path);
				AssetProperties assetProps = new AssetProperties(request.getResource(), s7ConfigResolver,path);
				Map<String, String> map = null;
				if(assetType!=null && assetType.equals(IMAGE))
				{
					//  method call to process and get Image metadata
					map= assetProps.processImageMetadata(assetName,galleryName);
				}else if(assetType!=null && assetType.equals(VIDEO)){
					//  method call to process and get Video metadata
					map= assetProps.processVideoMetadata(assetName);
				}
				// creating a json
				if (map != null) {
					json = new JSONObject();
					json.put(AssetProperties.TITLE, null != map.get(AssetProperties.TITLE) ? map.get(AssetProperties.TITLE) : "");
					json.put(AssetProperties.DESC, null != map.get(AssetProperties.DESC) ? map.get(AssetProperties.DESC) : "");
				}
			}
			if(json==null)
			{
				LOGGER.info("No Asset Metadata Found." );
					json = new JSONObject();
					json.put(AssetProperties.TITLE, "");
					json.put(AssetProperties.DESC, "");
			}
		} catch (JSONException e) {
			LOGGER.error(e.getMessage(), e);
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		LOGGER.info("Json created!!!");
		if(null!=response && null!=response.getWriter() && StringUtils.isNotBlank(json.toString())){
			response.setContentType("application/json");
			response.setCharacterEncoding(UTF_8);
			response.getWriter().write(json.toString());
		}
	}
}