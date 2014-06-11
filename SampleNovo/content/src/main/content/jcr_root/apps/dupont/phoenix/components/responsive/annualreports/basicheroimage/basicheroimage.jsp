<%@ page import="javax.jcr.Node"%>
<%@ page import="com.dupont.phoenix.hlm.HLMWrapper,com.dupont.phoenix.list.HListHelper"%>
<%@ page import="java.util.List" %>
<%@ page import="com.day.cq.commons.Doctype,com.day.cq.wcm.api.components.DropTarget,
				com.day.cq.wcm.foundation.Image,com.dupont.phoenix.commons.Scene7Image" %>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.day.cq.wcm.api.WCMMode,
                 com.dupont.phoenix.Global,
org.apache.commons.lang.StringUtils"%>


<%

    //Initialize

    boolean hasImage = false;
	String imgAlt = "";
	String imgTitle = "";
	String imageSource = "";

    //Hero Image   -- Component Property
    //Check if Image is available or not
    Image heroImage = new Scene7Image(resource, slingRequest);

	if (null != properties.get("alt")) {
        imgAlt = properties.get("alt").toString();
    }

	if (null != properties.get("jcr:title")) {
        imgTitle = properties.get("jcr:title").toString();
    }

    if(null != properties.get("fileReference"))
    {
		imageSource = properties.get("fileReference").toString();
    }

    if (heroImage.hasContent()){
       hasImage = true;
    } else {
       hasImage= false;
    }


%>


    <% String imgSrc = "";
    
        if(hasImage){ 

           		if(null != properties.get("dam:scene7URL"))
           		{
           			imgSrc = properties.get("dam:scene7URL").toString();
           		}
           		else
           		{
           			imgSrc = imageSource;
           		}

     %>

       <!-- Basic Hero Image -->
                <div class="basic-hero-img">
                    <img src= "<%= imgSrc %>" alt= "<%=imgAlt %>" title="<%= imgTitle %>" />
                </div>
       <!-- END Basic Hero Image -->
	<% } 
        else if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)
        { %>
        	Please select an image for the hero.
         <% 
        }
	
	%>

