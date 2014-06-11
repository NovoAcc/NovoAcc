<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="org.json.JSONObject,org.json.JSONException"%>
<%@ page import="com.dupont.phoenix.*"%>
<%@ page import="com.day.cq.wcm.api.WCMMode"%>
<%@ page import="com.dupont.phoenix.Global"%>

<%
 // Include the widgets only on Author Mode
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) { %>
	<cq:includeClientLib categories="apps.dupont.widgets.custom" /><%
}
%>

<%
  String entercontactsdetailLabel =Global.getTranslatedText(currentPage, slingRequest,"Enter Contacts Detail");
  String contactsLabel =Global.getTranslatedText(currentPage, slingRequest,"Contacts");
  String emailLabel =Global.getTranslatedText(currentPage, slingRequest,"Email") + ": ";
  //intialize variable 

  int thresholdLimit= 3;

  String contactGroupItems[]= properties.get("contactColumnItems",String[].class);%>

<%  if((WCMMode.fromRequest(slingRequest) == WCMMode.EDIT) && (contactGroupItems == null) )  {%>
<div class="contacts_module">
	<%=entercontactsdetailLabel %>
</div>
<%} else if (contactGroupItems != null && contactGroupItems.length >0) {%>
<!-- Start Contacts Module -->
<div class="vertical_list_module vertical-list-module-odd">
	<div class="sidebar_title"><%=contactsLabel %></div>
<%
	int contactGroupItemsLimit =(contactGroupItems.length<=thresholdLimit) ? contactGroupItems.length: thresholdLimit ;
	for (int contactGroupCounter=0; contactGroupCounter<contactGroupItemsLimit ; contactGroupCounter++) {
	    //Get a value from ndoe with the help of JSON object in Array and iterate it
	    JSONObject jObject= new JSONObject(contactGroupItems[contactGroupCounter]);
	    String contactName= jObject.get("contactName").toString();
	    String contact1= jObject.get("contact1").toString();
	    String contatcEmail = jObject.get("contactEmail").toString();
	    String contactCountry= jObject.get("contactCountry").toString();              
%>
	<div class="contact_list"><br />
<% 
        if (contactCountry != null && !contactCountry.equals("")) {%>
			<span class="contact_list_italic"><%=contactCountry%></span>
		<% }

		if (contactName !=null && !contactName.equals("")) {%>
			<span class="contact_list_bold"><%=contactName%></span>
		<% }

		if (contact1!=null && !contact1.equals("")) {%>
			<span class="contact_list_bold"><%=contact1%></span>
		<% }
		
		if (contatcEmail!=null && !contatcEmail.equals("")) {%>
			<span class="contact_list_bold"><a href="mailto:<%=contatcEmail%>"><%=contatcEmail%></a></span><br />
		<% }
	}
%>
	</div>
</div>
<!-- End Contacts Module -->
<%
}
%>

<div style="clear: both"></div>
