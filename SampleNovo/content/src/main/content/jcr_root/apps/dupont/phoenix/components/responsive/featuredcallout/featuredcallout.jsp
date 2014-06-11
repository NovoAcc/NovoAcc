<%--
	@Author: Avi Khatri
	@Description: Utility Component to get the featured Content for other components to use.
	@Date Updated: Dec 21 2012
--%>
<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="java.util.Iterator,
    javax.jcr.Node,
    javax.jcr.NodeIterator,
    javax.jcr.PropertyIterator,
    javax.jcr.Property,
    com.dupont.phoenix.Global,
    org.apache.jackrabbit.commons.JcrUtils,
    com.day.cq.wcm.api.WCMMode"%>
<%
	    String playerKey = "";
	    String playerID = "";
	    String videoID = "";
	    String shortDesc = "";
	    String calloutTitle = "";
	    String videoPagePath = "";
	    String thumbnailPath = "";
	    String getTextLastWord = "";
	    String getTextWithoutLastWord = "";

   /* The Video page to be rendered.*/
   try{
	    if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)
		{
	        %>
	        <div class="row group">
	            <div class="author">Featured Call Out</div>
	        <%
		}
	    String selectedTool = properties.containsKey("selectedTool") ? properties.get("selectedTool",String.class) : null;
		//String defaultTitle = Global.getTranslatedText(currentPage, slingRequest,"Tool");
         if(selectedTool!=null)
         {
        	%>
      		<sling:include path="selectedtool" resourceType="<%=selectedTool%>"/>
          <%
         }
 	    if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)
 		{
 	        %>
 	        	</div>
 	        <%
 		}
    }
    catch(Exception ex)
    {
    	ex.printStackTrace();
        %>
        <div class="row group">
            <div class="author">Please click here to feature content or a module</div>
        </div>
        <%
    }
%>