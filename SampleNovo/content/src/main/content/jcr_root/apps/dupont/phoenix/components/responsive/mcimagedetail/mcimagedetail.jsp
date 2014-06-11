<%--

 Media Center Image Detail component.


--%>
<%@page session="false" contentType="text/html; charset=utf-8"%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.day.cq.wcm.api.WCMMode"%>
<%@ page import="com.day.cq.wcm.foundation.Image"%>
<%@ page import="javax.jcr.Node"%>
<%@ page import="com.day.cq.dam.api.Asset"%>
<%@ page import="com.day.cq.dam.commons.util.UIHelper"%>
<%@ page import="com.adobe.granite.xss.XSSAPI"%>
<%@ page import="java.text.Format"%>
<%@ page import="java.text.SimpleDateFormat,java.util.Date,com.day.cq.dam.commons.util.DateParser"%>
<%@ page import="com.dupont.phoenix.Global,com.dupont.phoenix.commons.Scene7Image,com.day.cq.wcm.api.components.DropTarget"%>


<%
    //Code Starts from Here
    String imageSource = "";
	String imageHeadline = "";
	String imageShortDesc = "";
    Object imageLengthObj=null;
	Object imageWidthObj=null;
	String length="";
    String width="";
	Object fileFormatObj = null;
    Object lastModifiedObj=null;
    String lastModified="";
	long size = 0;

	Image mcImage = new Scene7Image(resource,slingRequest);
	//mcImage.set(Image.PN_HTML_WIDTH, "330");
	//mcImage.set(Image.PN_HTML_HEIGHT, "372");
	mcImage.addCssClass(DropTarget.CSS_CLASS_PREFIX + "image"); 
	mcImage.draw(out);

	String fileReference = properties.get("fileReference", String.class);

if(fileReference!=null){
		Resource assetResource = resourceResolver.getResource(fileReference);
        if (assetResource != null) {            
            Asset asset = assetResource.adaptTo(Asset.class);
            if (asset != null) {
                imageLengthObj = asset.getMetadata("tiff:ImageLength");
                length=imageLengthObj.toString();
                imageWidthObj = asset.getMetadata("tiff:ImageWidth");
                width=imageWidthObj.toString();
                fileFormatObj = asset.getMetadata("dam:Fileformat");
            }

             Node presentNode = assetResource.adaptTo(Node.class);

            if(!presentNode.hasNode("jcr:content")){
                return;
            }
            Node contentNode = presentNode.getNode("jcr:content");
			  if(contentNode!=null){
                  if(contentNode.hasProperty("jcr:lastModified")){
                	lastModified = contentNode.getProperty("jcr:lastModified").getValue().getString();
                  }
              }  

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

if (null != properties.get("jcr:description")) {
 imageShortDesc = properties.get("jcr:description").toString();
}

%>

<%
     if(!fileReference.isEmpty()){
%>

<div class="imagedetail">
	<div id="image_detail_desc"><%=imageShortDesc%></div>
	<div id="image_subdesc_wrap">
		<div id="image_subdesc">
			<span class="image_subdesc_italic">Specifications: </span>
		</div>
		<br /> <br />

		<div id="image_subdesc">
			<span class="image_subdesc_italic">Image Type</span><br /> <span
				class="image_subdesc_bold"><%=fileFormatObj%></span>
		</div>
		<div id="image_subdesc">
			<span class="image_subdesc_italic">Date</span><br /> <span
				class="image_subdesc_bold"><%=lastModified%></span>
		</div>
		<div id="image_subdesc">
			<span class="image_subdesc_italic">File Size</span><br /> <span
				class="image_subdesc_bold"><%=UIHelper.getSizeLabel(size)%></span>
		</div>
		<div id="image_subdesc">
			<span class="image_subdesc_italic">Dimension</span><br /> <span
				class="image_subdesc_bold"><%= xssAPI.encodeForHTML(width)%>
				&times; <%= xssAPI.encodeForHTML(length)%></span>
		</div>
	</div>
</div>

<%
   	}    
}

if((WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)&& ((fileReference == null)|| (fileReference=="")) && ((imageShortDesc == null)|| (imageShortDesc==""))){
%>
<h1>Edit MC Image Detail Component</h1>
<%
}
%>


