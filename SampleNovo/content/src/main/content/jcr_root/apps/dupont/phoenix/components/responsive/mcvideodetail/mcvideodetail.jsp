<%--

  MC Video Detail component.

  A component to display an Video from DAM or scene7 with a title, short description and some metadata specifications.

--%><%
%><%@include file="/libs/foundation/global.jsp"%>
<%@page session="false" contentType="text/html; charset=utf-8"%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.day.cq.wcm.api.WCMMode"%>
<%@ page import="com.day.text.Text"%>
<%@ page import="com.day.cq.wcm.foundation.Image"%>
<%@ page import="com.day.cq.commons.Doctype"%>
<%@ page import="javax.jcr.Node"%>
<%@ page import="com.dupont.phoenix.*"%>
<%@ page import="com.day.cq.dam.api.Asset"%>
<%@ page import="com.day.cq.dam.commons.util.UIHelper"%>
<%@ page import="com.adobe.granite.xss.XSSAPI"%>
<%@ page import="java.text.Format,java.text.SimpleDateFormat,java.util.Date,com.day.cq.dam.commons.util.DateParser"%>
<%@ page import="com.dupont.phoenix.Global,com.dupont.phoenix.commons.Scene7Image, com.day.cq.commons.Doctype,com.day.cq.wcm.api.components.DropTarget"%>
<%@ page import="com.day.cq.dam.scene7.api.Scene7DAMService,org.apache.sling.api.resource.PersistableValueMap"%>
<%@ page import="org.apache.commons.io.FilenameUtils" %>

 <%  //Code Starts from Here

	String videoShortDesc = "";
    String height= "315";
    String width= "630";
    Object fileFormatObj = null;
    String fileFormat ="";
    Object lastModifiedObj=null;
    String lastModified="";
	long size = 0;

%>

 <div class="parbase imagedetail">
    <%--img src="images\video_placeholder.png"> --%>
          <cq:include path="scence7Video" resourceType="dupont/phoenix/components/responsive/scence7Video"/>

<%
            String assetDamRef = properties.get("scence7Video/damPath", String.class);


          if(assetDamRef!=null)
         {
               Resource assetResource = resourceResolver.getResource(assetDamRef);
               if (assetResource != null) {
               Asset asset = assetResource.adaptTo(Asset.class);
               if (asset != null) {

                  fileFormatObj = asset.getMetadata("dc:format");
                  fileFormat = fileFormatObj!=null?fileFormatObj.toString():"";
                  lastModifiedObj = asset.getMetadata("dc:modified");
                   if(lastModifiedObj != null){
                  lastModified = lastModifiedObj.toString();
                  }
            }

                  Node presentNode = assetResource.adaptTo(Node.class);

                  if(!presentNode.hasNode("jcr:content")){
                  return;
                }
                  Node contentNode = presentNode.getNode("jcr:content");

			      if(!contentNode.hasNode("renditions")){
                  return;
        	    }
        	      Node renditions = contentNode.getNode("renditions");

                   Node original = null;
                   if (renditions.hasNode("original")) {
                   original = renditions.getNode("original");
               }

			     if (original != null){
                 size = original.getProperty("jcr:content/jcr:data").getLength();
        	     }

                  if(lastModified!=null && !lastModified.equals("")){
                  Format formatter = new SimpleDateFormat("MM/dd/yy");
                  lastModified = formatter.format(DateParser.parseDate(lastModified));
            }

        }
%>


                   <%  if (null != properties.get("scence7Video/mcvideoeshortdesc")) {
                       videoShortDesc = properties.get("scence7Video/mcvideoeshortdesc").toString(); } %>

                       <div id="video_detail_desc"><%=videoShortDesc%></div>

                       <%--   <%  if (null != properties.get("scence7Video/width")) {
                                  width = properties.get("scence7Video/width").toString(); }
                                  else {width="630";} %>
                                  <%  if (null != properties.get("scence7Video/height")) {
                                  height = properties.get("scence7Video/height").toString(); }
                                  else {height="315";} %>  --%>


							<div id="video_subdesc_wrap">
								<div id="video_subdesc"><span class="video_subdesc_italic">Specifications: </span></div><br><br>

								<div id="video_subdesc"><span class="video_subdesc_italic">Video Type</span><br><span class="video_subdesc_bold"><%=fileFormat%></span></div>
								<div id="video_subdesc"><span class="video_subdesc_italic">Date</span><br>      <span class="video_subdesc_bold"><%=lastModified%> </span></div>
								<div id="video_subdesc"><span class="video_subdesc_italic">File Size</span><br> <span class="video_subdesc_bold"><%=UIHelper.getSizeLabel(size)%></span></div>
                                <%-- <div id="video_subdesc"><span class="video_subdesc_italic">Duration</span><br>  <span class="video_subdesc_bold">56.3 KB</span></div> --%> 
								<div id="video_subdesc"><span class="video_subdesc_italic">Dimension</span><br> <span class="video_subdesc_bold"><%= xssAPI.encodeForHTML(width)%>
                                                         &times; <%= xssAPI.encodeForHTML(height)%></span> </div>
							</div>
			</div>

<%
          	}
%>
