<%
%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap" %>
<%@ page import="com.day.cq.wcm.api.WCMMode" %>
<%@ page import="org.apache.sling.commons.json.JSONObject,java.util.*" %>
<%@ page import="com.dupont.phoenix.Global,org.apache.sling.api.resource.ValueMap" %>
<%@ page import="com.dupont.phoenix.SocialMediaHelper" %>
<%@ page import="com.dupont.phoenix.SocialMediaChannel" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
try {
    final Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);
   // Use gray icons if the component is included in the basic hero title
    Boolean useGrayIcons = false; 
    String parentName = (resource.getParent()).getName().toString();
    if(parentName.equals("basicherotitle"))
    {
    	useGrayIcons = true;
    }
    String[] socialChannels= null;
    SocialMediaHelper shareSocialMediaHelper = new SocialMediaHelper();  
    socialChannels= shareSocialMediaHelper.getInheritedValue(resource, currentPage, "socialchannels");
    
    if(useGrayIcons)
    {
   		 %>   
   			 <ul class="social-links">
        <%
    }
    else
    {
    	 %>  	    
    	    <ul id="social-links">
        <%   	
    }
        if(isEdit && (socialChannels==null || socialChannels.length <= 0 ))
        {
            %>
            <li>Add/Update Social Media Channels</li>
            <%
        }
        if (socialChannels!= null )
        {   
            List <SocialMediaChannel> activeChannelsForHeader = shareSocialMediaHelper.getActiveChannelsForHeaderAndFooter(resource,socialChannels); 
            if(useGrayIcons)
            {
            	%>
                <c:forEach items="<%= activeChannelsForHeader %>" var="socialMediaChanel" >
                <li><a target="_blank" class="${socialMediaChanel}" class="social-${socialMediaChanel.name}" rel="nofollow" href="${socialMediaChanel.pageURL}"><img data-hover="${socialMediaChanel.grayHoverImg}" src="${socialMediaChanel.grayImg}"/></a></li>
                </c:forEach>
    		 <%
            	
            }
            else
            {
              %>
                        <c:forEach items="<%= activeChannelsForHeader %>" var="socialMediaChanel" >
                        <li><a target="_blank" class="${socialMediaChanel}" class="social-${socialMediaChanel.name}" rel="nofollow" href="${socialMediaChanel.pageURL}"><img data-hover="${socialMediaChanel.normalHoverImg}" src="${socialMediaChanel.normalImg}"/></a></li>
                        </c:forEach>
             <% }
        } 
        %>
    </ul>
    <%
} catch (Exception e){
    log.error(e.getMessage());
}
%>
<div style="clear:both"></div>