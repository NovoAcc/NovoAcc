<%@ page import="javax.jcr.Node"%>
<%@ page import="com.dupont.phoenix.hlm.HLMWrapper,com.dupont.phoenix.list.HListHelper"%>
<%@ page import="java.util.List" %>
<%@ page import="com.day.cq.commons.Doctype,com.day.cq.wcm.api.components.DropTarget,
				com.day.cq.wcm.foundation.Image,com.dupont.phoenix.commons.Scene7Image" %>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.day.cq.wcm.api.WCMMode,com.dupont.phoenix.Global,org.apache.commons.lang.StringUtils"%>

<%


    //Initialize

    boolean hasImage = false;
	String imgAlt = "";
	String imgTitle = "";
	String imageSource = "";
	String figureCaption = "";
	String imgSrc = ""; 
	String imgTitleTop = ""; 

    
    //Check if Image is available or not
    Image fullBleedImage = new Scene7Image(resource, slingRequest);

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

    if(null != properties.get("imageCaption"))
    {
		figureCaption = properties.get("imageCaption").toString();
    }
    if(null != properties.get("imageTitleTop"))
    {
		imgTitleTop = properties.get("imageTitleTop").toString();
    }
    
    if (fullBleedImage.hasContent() ){
       hasImage = true;
    } else {
       hasImage= false;
    }

      
        if((hasImage) ){ 

           		if(null != properties.get("dam:scene7URL"))
           		{
           			imgSrc = properties.get("dam:scene7URL").toString();
           		}
           		else
           		{
           			imgSrc = imageSource;
           		}

           	 %>  

       <!-- M_53_0 Full Bleed Image -->
                    <div class="parsys openareapar">
                        <div class="statichtml parbase section">
                            <figure class="full-span-img">
                                <figcaption class="row-title"><%= imgTitleTop %></figcaption>
                                <img src="<%= imgSrc %>" alt= "<%=imgAlt %>" title="<%= imgTitle%>" />
                                <figcaption><%= figureCaption %></figcaption>
                            </figure>
                        </div>
                    </div>
                    
                    
                     <%   } 
                     
        else if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)
        { %>
        	Please select an image.
         <% 
        } %>

       <!-- END M_53_0 Full Bleed Image -->