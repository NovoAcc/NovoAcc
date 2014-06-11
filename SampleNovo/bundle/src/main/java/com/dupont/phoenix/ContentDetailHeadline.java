package com.dupont.phoenix;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import com.day.cq.wcm.api.Page;


public class ContentDetailHeadline {
	
	//private boolean edit;
	
	/* Component properties */
	private String pageTitle;
	private String date;
	private boolean hideDate;
	
	private ValueMap properties;
	private Page currentPage;
	private SlingHttpServletRequest slingHttpServletRequest;
	private Locale locale;
	
	public ContentDetailHeadline(Page currentPage, Resource resource, SlingHttpServletRequest slingHttpServletRequest) {
		this.currentPage = currentPage;
		setSlingHttpServletRequest(slingHttpServletRequest);
		this.properties = resource.adaptTo(ValueMap.class);
		init();
	}
	
	private void init() {
		// Check if its first time.
		if( properties == null){
			//Changes for Defect PHOEN-854
			//setPageTitle("Please enter page title.");
			//setDate(Global.getLocalizedDate(currentPage));
		} else {
			//setEdit(WCMMode.fromRequest(slingHttpServletRequest) == WCMMode.EDIT);
			setHideDate(properties.get("hide", false));
			setPageTitle(createPageTitle());
			locale = currentPage.getLanguage(false);
			setDate(fetchDate());
		}
	}
	
	/**
	 * Gets the date entered by user.
	 * @return the String with the Date. Current date if none is specified.
	 */
	private String fetchDate() {
		String fdate;
		// Make sure locale works.
		if (locale == null) {
			locale = new Locale("en_us");
		}
		
		// Create new date format using the locale
		DateFormat dateFormat = DateFormat.getDateInstance(DateFormat.SHORT, locale);
		
		// Get the date property converted into string.
		fdate = properties.get("createdate",String.class);
		
		// check for NPE and valid data.
		if (fdate == null) {
			// Create new date using last modified.
			fdate = Global.getLocalizedDate(currentPage);
		}
		else {
			Date d;
			try {
				d = new SimpleDateFormat("d.M.y",locale).parse(fdate);
				fdate = dateFormat.format(d);
			} catch (ParseException e) {
				fdate = e.getMessage();
			}
		}
		
		return fdate.replace("/", ".");
	}
	
	/**
	 * Create the page title based on the user input.
	 * @return The String with the page title.
	 */
	private String createPageTitle() {
		String temp;
		temp = properties.get("pageTitle",String.class);
		
		//if (temp == null) {
			//temp = currentPage.getTitle();
		//}
		//Changes for Defect PHOEN-854
		//if (temp == null && edit == true) {
			//temp = "Please enter page title";
		//}
		
		return temp; 
	}

	/** Getters And Setters **/
	
	/** Changes for Defect PHOEN-854
	//public boolean getEdit() {
		//return edit;
	//}
 
	//public void setEdit(boolean edit) {
		//this.edit = edit;
	//} **/
   
	public String getPageTitle() {
		return pageTitle;
	}

	public void setPageTitle(String pageTitle) {
		this.pageTitle = pageTitle;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public boolean getHideDate() {
		return hideDate;
	}

	public void setHideDate(boolean hideDate) {
		this.hideDate = hideDate;
	}

	public SlingHttpServletRequest getSlingHttpServletRequest() {
		return slingHttpServletRequest;
	}

	public void setSlingHttpServletRequest(
			SlingHttpServletRequest slingHttpServletRequest) {
		this.slingHttpServletRequest = slingHttpServletRequest;
	}
}
