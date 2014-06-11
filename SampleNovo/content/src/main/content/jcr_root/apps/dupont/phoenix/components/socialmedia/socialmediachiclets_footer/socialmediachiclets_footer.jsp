<%
%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>

<%@ page import="com.day.cq.wcm.api.WCMMode" %>
<%@ page import="java.util.*" %>
<%@ page import="com.dupont.phoenix.Global" %>
<%@ page import="com.dupont.phoenix.SocialMediaHelper" %>
<%@ page import="com.dupont.phoenix.SocialMediaChannel" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


 <%--  socialmediachiclets footer BEGIN --%>
<%
try {
    //Base Variable setup

    final Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);
    // Translate system strings
    String connectWithDupontTitle = Global.getTranslatedText(currentPage, slingRequest, "Connect with Dupont:");
    
    String[] socialChannels=null;

    //Check if chanels are available for footer
    if (currentDesign.getStyle("siteconfig/socialmedia").get("socialchannels", String[].class) != null){
    	socialChannels= currentDesign.getStyle("siteconfig/socialmedia").get("socialchannels", String[].class);
    }
    
    if (socialChannels!= null )
    {   
    	// read the list of chanels 
	  	SocialMediaHelper shareSocialMediaHelper = new SocialMediaHelper();   
	    List <SocialMediaChannel> activeChannelsForHeader = shareSocialMediaHelper.getActiveChannelsForHeaderAndFooter(resource,socialChannels);
	 
  %>
  		<div class="agnostic-footer-connect">
        	<span><%=connectWithDupontTitle %></span>
            <ul class="social_links">
	    		<c:forEach items="<%= activeChannelsForHeader %>" var="socialMediaChanel" >
		 		<li><a target="_blank" rel="nofollow" href="${socialMediaChanel.pageURL}" title="${socialMediaChanel.name}"><img data-hover="${socialMediaChanel.grayHoverImg}" src="${socialMediaChanel.grayImg}" alt="${socialMediaChanel.name}"/></a></li>
		 		</c:forEach>         
            </ul>
    	</div>              
 
 <%
    } else {
	   if (isEdit){      
 %>
		<div class="agnostic-footer-connect">
			<span>Connect with Dupont:</span>
	     	<ul id="social-links">
	        	<h3> Please configure social media channels.</h3>
	    	<ul id="social-links">
	 	</div>
 <%     }
    }   
%>
<%
} catch (Exception e){
	log.error(e.getMessage());
}
%>

<%--  socialmediachiclets footer  END   --%>