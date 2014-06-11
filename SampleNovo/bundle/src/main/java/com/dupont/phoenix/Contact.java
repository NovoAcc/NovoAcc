package com.dupont.phoenix;

public class Contact {
	private String contactName;
    private String contactJobTitle;
    private String contactEmail;
    private String contact1;
    private String contact2;
    private String contactCountry;
    private String classIdentifier;
    private String countryCode;
    
    public Contact(){
    	this.contactName = "";
    	this.contactJobTitle = "";
    	this.contactEmail = "";
        this.contact1 = "";
        this.contact2 = "";
        this.contactCountry = "";
        this.classIdentifier = "";
        this.countryCode = "";
    }
    
    public Contact(String contactName, String contactJobTitle,
			String contactEmail, String contact1, String contact2,
			String contactCountry, String classIdentifier, String countryCode) {
		this.contactName = contactName;
		this.contactJobTitle = contactJobTitle;
		this.contactEmail = contactEmail;
		this.contact1 = contact1;
		this.contact2 = contact2;
		this.contactCountry = contactCountry;
		this.classIdentifier = classIdentifier;
		this.countryCode = countryCode;
	}

	/* <Getters and Setters> */
    
	public String getContactName() {
		return contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	public String getContactJobTitle() {
		return contactJobTitle;
	}

	public void setContactJobTitle(String contactJobTitle) {
		this.contactJobTitle = contactJobTitle;
	}

	public String getContactEmail() {
		return contactEmail;
	}

	public void setContactEmail(String contactEmail) {
		this.contactEmail = contactEmail;
	}

	public String getContact1() {
		return contact1;
	}

	public void setContact1(String contact1) {
		this.contact1 = contact1;
	}

	public String getContact2() {
		return contact2;
	}

	public void setContact2(String contact2) {
		this.contact2 = contact2;
	}

	public String getContactCountry() {
		return contactCountry;
	}

	public void setContactCountry(String contactCountry) {
		this.contactCountry = contactCountry;
	}

	public String getClassIdentifier() {
		return classIdentifier;
	}

	public void setClassIdentifier(String classIdentifier) {
		this.classIdentifier = classIdentifier;
	}

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}
    
    /* </Getters and Setters> */
}
