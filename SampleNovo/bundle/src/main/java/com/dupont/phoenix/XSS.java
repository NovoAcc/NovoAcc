package com.dupont.phoenix;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import com.adobe.granite.xss.XSSAPI;

public class XSS {

	private XSSAPI xssAPI;
	private static Pattern[] patterns = new Pattern[]{
        // Script fragments
        Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE),
        // src='...'
        Pattern.compile("src[\r\n]*=[\r\n]*\\\'(.*?)\\\'", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
        Pattern.compile("src[\r\n]*=[\r\n]*\\\"(.*?)\\\"", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
        // lonely script tags
        Pattern.compile("</script>", Pattern.CASE_INSENSITIVE),
        Pattern.compile("<script(.*?)>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
        // eval(...)
        Pattern.compile("eval\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
        // expression(...)
        Pattern.compile("expression\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
        // javascript:...
        Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE),
        // vbscript:...
        Pattern.compile("vbscript:", Pattern.CASE_INSENSITIVE),
        // onload(...)=...
        Pattern.compile("onload(.*?)=", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL)
    };
	
	/**
	 * 
	 * @param resource
	 */
	public XSS(Resource resource) {
		try {
			ResourceResolver resourceResolver = resource.getResourceResolver();
			this.xssAPI = resourceResolver.adaptTo(XSSAPI.class);
		} catch (Exception e) {

		}
	}

	/**
	 * 
	 * @param value
	 * @return
	 */
	public String getCleanHTML(String value) {
		String text = "";
		try {
			text = this.xssAPI.encodeForHTML(value);
		} catch (Exception e) {
			text = "";
		}
		return text;
	}
	
	/**
	 * 
	 * @param value
	 * @return
	 */
	public List<String> getCleanHTML(List<String> value) {
		List<String> text =new ArrayList<String>();
		try {
			for(int i=0; i<=value.size();i++){
				text.add(this.xssAPI.encodeForHTML(value.get(i)));
			}
		} catch (Exception e) {
			text = value;
		}
		return text;
	}
	
	/**
	 * 
	 * @param value
	 * @return
	 */
	public String getValidHref(String value) {
		String text = "";
		try {
			text = this.xssAPI.getValidHref(value);
		} catch (Exception e) {
			text = value;
		}
		return text;
	}

	/**
	 * 
	 * @param value
	 * @return
	 */
	public List<String> getValidHref(List<String> value) {
		List<String> text =new ArrayList<String>();
		try {
			for(int i=0; i<=value.size();i++){
				text.add(this.xssAPI.getValidHref(value.get(i)));
			}			
		} catch (Exception e) {
			text = value;
		}

		return text;
	}
	
	/**
	 * 
	 * @param text
	 * @return
	 */
	public String getAllowHTML(String text) {
		if (text != null) {
			for (Pattern scriptPattern : patterns){
				text = scriptPattern.matcher(text).replaceAll("");
            }
		}
         

		return text;
	}

}
