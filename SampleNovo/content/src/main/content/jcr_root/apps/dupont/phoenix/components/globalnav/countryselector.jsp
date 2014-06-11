<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.Global" %>
<!--    -->
<%

    // Set up resource bundle
    //ResourceBundle resourceBundle = slingRequest.getResourceBundle(null);	
	//final I18n i18n = new I18n(slingRequest);
	String countrySelectorURL="Please configure URL for country selector in site config.";
	
	if (currentDesign.getStyle("siteconfig/general").get("countryselectorURL", String.class) != null){
		countrySelectorURL= currentDesign.getStyle("siteconfig/general").get("countryselectorURL").toString();
	}
	
	//String countrySelectorURL="http://www2.dupont.com/DuPont_Home/en_US/country_selector.html";
    
	// Translate system strings
    //String countrySelectorTitle = i18n.get(resourceBundle, "Country Selector");
    String countrySelectorTitle = Global.getTranslatedText(currentPage, slingRequest,"Country Selector");
%>
    <div class="country-selector">
        <a href="<%=countrySelectorURL%>"><%=countrySelectorTitle %> <img class="country-selector-icon" src="/etc/designs/dupont/phoenix/responsiveclientlib/source/images/country-selector.png" /></a>
    </div>