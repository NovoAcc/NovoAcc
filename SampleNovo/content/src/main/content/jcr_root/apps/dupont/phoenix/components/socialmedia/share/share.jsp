<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap" %>
<%@ page import="com.day.cq.wcm.api.WCMMode" %>
<%@ page import="org.apache.sling.commons.json.JSONObject,java.util.*" %>
<%@ page import="com.dupont.phoenix.Global" %>
<%@ page import="com.dupont.phoenix.SocialMediaHelper" %>
<%@ page import="com.dupont.phoenix.SocialMediaChannel" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

 
<%
try {
    //Base Variable setup
    final Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);

    // Translate system strings
    String shareTitle =Global.getTranslatedText(currentPage, slingRequest, "Share");
    String closeBtnTitle=Global.getTranslatedText(currentPage, slingRequest, "Close");
    
	// URL of this page
	// Original statement before making changes for Vanity URLs
    //final String thisPageURL = Global.getExternalSitePrefix(resource)+"/"+currentPage.getPath()+".html";

	// Errorenuos statement. Hence commenting out
    //final String thisPageURL = Global.getExternalSitePrefix(resource)+"/"+Global.getNavigationURL(slingRequest,currentPage.getPath,false)+".html";
	
	//Working code for Vanitu URL
   // final String thisPageURL = Global.getExternalSitePrefix(resource)+"/"+String.format("%s.html",Global.getNavigationURL(slingRequest, currentPage, false));
    final String thisPageURL = request.getRequestURL().toString();
	//Get share social media channel list 
    SocialMediaHelper shareSocialMediaHelper = new SocialMediaHelper();   
    List <SocialMediaChannel> activeChannelsForShare = shareSocialMediaHelper.getActiveChannelsForShare(resource);
            
    if (activeChannelsForShare.size()>0 )
    {
  %>
<div class="share-button">
    <a class="share-btn" id="ShareLink" href="javascript:void(0)"><%=shareTitle%></a>
    <div class="share-window" style="display: none;">
    <c:set var="thisPageURL" value="<%= thisPageURL %>"></c:set>
    <ul>
        <c:forEach items="<%= activeChannelsForShare %>" var="socialMediaChanel" >
        <li><a target="_blank" rel="nofollow" href="${socialMediaChanel.shareURL}${thisPageURL}"><img alt="Social Media Icon" data-hover="${socialMediaChanel.grayHoverImg}" src="${socialMediaChanel.grayImg}"/><span>${socialMediaChanel.name}</span></a></li>
        </c:forEach>
    </ul>
    <div class="window-close-button"><%=closeBtnTitle%></div>
</div>
</div>
  
 <%
    } else {
    if (isEdit){      
%>
    <div class="share-button">
       <a href="javascript:void(0)" class="share-btn" id="ShareLink"> Please set up share social media channels in site config.</a>
    </div>
<%    }
    }   
%>
<%
} catch (Exception e){
    log.error(e.getMessage());
}
%>
<!--  End of Share Component. -->

