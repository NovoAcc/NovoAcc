package com.dupont.phoenix;

import java.util.ArrayList;
import java.util.List;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;

public class ContactController {
	
	/* <Attributes> */
	private static final Logger logger = LoggerFactory.getLogger(ContactController.class);
	private ValueMap properties;
	private Resource resource;
	private Page currentPage;
    private int thresholdLimit;
    private List<Contact> contacts;
    private String entercontactsdetailLabel;
    private String contactsLabel;
    private String emailLabel;
    private boolean editMode;
    private boolean disabled;
    private boolean contactsAvailable;
    
    /* </Attributes> */
    
    /* <Constructors> */
    
    public ContactController(){
    	this.fillDefaults();  	
    }
    
    public ContactController(Resource resource, Page currentPage, SlingHttpServletRequest slingRequest){
    	this.resource = resource;
    	this.properties = this.resource.adaptTo(ValueMap.class);
    	this.currentPage = currentPage;
    	this.thresholdLimit = 3;
    	this.entercontactsdetailLabel = Global.getTranslatedText(this.currentPage, slingRequest,"Enter Contacts Detail");
    	this.contactsLabel = Global.getTranslatedText(this.currentPage, slingRequest,"Contacts");
    	this.emailLabel = Global.getTranslatedText(this.currentPage, slingRequest,"Email") + ": ";
    	this.contacts = new ArrayList<Contact>();
    	this.editMode = (WCMMode.fromRequest(slingRequest) == WCMMode.EDIT);
    	this.disabled = (WCMMode.fromRequest(slingRequest) == WCMMode.DISABLED);
    	if(this.properties!=null){
    		this.initValues();
    	}	
    }
    
    /* </Constructors> */
    
    /* <Methods> */
    
    public void initValues(){
 
    	String [] contactGroupItems = this.properties.get("contactColumnItems",String[].class);
    	if(contactGroupItems!=null){
    		this.getContactData(contactGroupItems);
    	}
    }
    
    public void getContactData(String [] contactGroupItems){
    	int contactGroupItemsLimit =(contactGroupItems.length<=this.thresholdLimit) ? contactGroupItems.length: this.thresholdLimit;
    	
        for (int contactGroupCounter=0; contactGroupCounter<contactGroupItemsLimit ; contactGroupCounter++) {
	    	JSONObject jObject;
			try {				
				jObject = new JSONObject(contactGroupItems[contactGroupCounter]);
		        this.contacts.add(parseContact(jObject, contactGroupCounter, contactGroupItemsLimit));
			} catch (JSONException e) {
				this.fillDefaults();
				logger.error("JSON Exception :",e);				
			}finally{
		    	this.contactsAvailable = this.hasContacts();
			}	        
    	}
    }
    
    private Contact parseContact(JSONObject jObj, int counter, int itemsLimit) throws JSONException{
    	Contact contact = new Contact();
    	String jobCountry = "";
    	
    	contact.setContactName(jObj.get("contactName").toString());
        contact.setContactJobTitle(jObj.get("contactJobTitle").toString());
        contact.setContactEmail(jObj.get("contactEmail").toString());
        contact.setContact1(jObj.get("contact1").toString());
        contact.setContact2(jObj.get("contact2").toString());

           
        if (jObj.get("contactJobTitle")!=null && !"".equals(jObj.get("contactJobTitle").toString()) && (jObj.get("contactCountry")!=null && !"".equals(jObj.get("contactCountry").toString()))) {
            jobCountry = jObj.get("contactJobTitle").toString() + ", " + jObj.get("contactCountry").toString();
        } else if (jObj.get("contactJobTitle")!=null && !"".equals(jObj.get("contactJobTitle").toString())) {
            jobCountry = jObj.get("contactJobTitle").toString();
        } else if (jObj.get("contactCountry")!=null && !"".equals(jObj.get("contactCountry").toString())) {
            jobCountry = jObj.get("contactCountry").toString();
        }
        
        contact.setContactCountry(jobCountry);
        
    	if (counter == itemsLimit-1) {
    		contact.setClassIdentifier("no-border");
    	}else if(counter == 0){
    		contact.setClassIdentifier("nopaddingleft");
    	}
    	
    	return contact;
    }
    
    private void fillDefaults(){
    	this.thresholdLimit = 3;
    	this.entercontactsdetailLabel = "Enter Contacts Detail";
    	this.contactsLabel = "Contacts";
    	this.emailLabel = "Email";
    	this.contacts = new ArrayList<Contact>();
    }
    
    private boolean hasContacts(){
    	return !this.contacts.isEmpty();
    }
    
    /* </Methods> */
    
    /* <Getters and Setters> */

	public int getThresholdLimit() {
		return thresholdLimit;
	}

	public void setThresholdLimit(int thresholdLimit) {
		this.thresholdLimit = thresholdLimit;
	}

	public List<Contact> getContacts() {
		return contacts;
	}

	public void setContacts(List<Contact> contacts) {
		this.contacts = contacts;
	}

	public String getEntercontactsdetailLabel() {
		return entercontactsdetailLabel;
	}

	public void setEntercontactsdetailLabel(String entercontactsdetailLabel) {
		this.entercontactsdetailLabel = entercontactsdetailLabel;
	}

	public String getContactsLabel() {
		return contactsLabel;
	}

	public void setContactsLabel(String contactsLabel) {
		this.contactsLabel = contactsLabel;
	}

	public String getEmailLabel() {
		return emailLabel;
	}

	public void setEmailLabel(String emailLabel) {
		this.emailLabel = emailLabel;
	}

	public boolean isEditMode() {
		return editMode;
	}

	public void setEditMode(boolean editMode) {
		this.editMode = editMode;
	}

	public boolean isDisabled() {
		return disabled;
	}

	public void setDisabled(boolean disabled) {
		this.disabled = disabled;
	}

	public boolean isContactsAvailable() {
		return contactsAvailable;
	}

	public void setContactsAvailable(boolean contactsAvailable) {
		this.contactsAvailable = contactsAvailable;
	}
	
	/* </Getters and Setters> */

}
