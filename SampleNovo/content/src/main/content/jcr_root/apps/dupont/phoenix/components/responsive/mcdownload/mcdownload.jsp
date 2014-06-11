<%--

 Media Center Image Detail component.


--%>
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
<%@ page import="java.text.Format"%>
<%@ page
	import="java.text.SimpleDateFormat,java.util.Date,com.day.cq.dam.commons.util.DateParser"%>
<%@ page
	import="com.dupont.phoenix.Global,com.dupont.phoenix.commons.Scene7Image, com.day.cq.commons.Doctype,com.day.cq.wcm.api.components.DropTarget"%>
<%@ page
	import="com.day.cq.dam.scene7.api.Scene7DAMService,org.apache.sling.api.resource.PersistableValueMap"%>
<%@ page import="java.io.*,com.day.cq.wcm.api.Template"%>

<%
 String text = properties.get("text", "Download");
%><script type="text/javascript">
	function CQ_dam_editorAction_download(paths) {
		try {

			var paths = CQ.shared.HTTP.externalize(CQ.shared.HTTP
					.encodePath(paths)
					+ ".assetdownload.zip", true);

			CQ.shared.Util.open(paths, null, "AssetDownloadWindow");

		} catch (e) {
		}

	}
</script>

<%   //Code Starts from Here
    String imageSource = "";
	String imageHeadline = "";
	String imageShortDesc = "";
    Object imageLengthObj=null;
	Object imageWidthObj=null;
	String length="";
    String width="";
	Object fileFormatObj = null;
	String fileFormat = "";
    Object lastModifiedObj=null;
    String lastModified="";
	long size = 0;

    Resource assetDetailRes=null ;
 	String fileReference="";



// String template=currentPage.getTemplate().getName();
   String template = currentPage.getContentResource().getResourceType();

if(template.contains("mcimagedetail")){
    assetDetailRes= resource.getParent().getChild("mcImageDetail");
      if(assetDetailRes!=null){
    Node assetDetailNode = assetDetailRes.adaptTo(Node.class);
    if(assetDetailNode!=null)
    {
     fileReference = assetDetailNode.hasProperty("fileReference")? assetDetailNode.getProperty("fileReference").getValue().getString():"";
    }
      }

}
else if(template.contains("mcvideodetail")){
    assetDetailRes= resource.getParent().getChild("videoplayer");
       if(assetDetailRes!=null){
       Node assetDetailNode = assetDetailRes.adaptTo(Node.class);
       if(assetDetailNode!=null)
       {
       fileReference = assetDetailNode.hasProperty("fileReference")? assetDetailNode.getProperty("fileReference").getValue().getString():"";

   }
       }
  } 


    if(fileReference!=null && (!fileReference.equals(""))){
		Resource assetResource = resourceResolver.getResource(fileReference);
        if (assetResource != null) {            
            Asset asset = assetResource.adaptTo(Asset.class);
            if (asset != null) {

                fileFormatObj = asset.getMetadata("dc:format");
                fileFormat = fileFormatObj!=null?fileFormatObj.toString():"";

            }

             Node presentNode = assetResource.adaptTo(Node.class);

            if(!presentNode.hasNode("jcr:content")){
                return;
            }
            Node contentNode = presentNode.getNode("jcr:content");
			  if(contentNode!=null){
                   lastModified = contentNode.hasProperty("jcr:lastModified")? contentNode.getProperty("jcr:lastModified").getValue().getString():"";
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



        }


}
%>


<!-- Start the Article Sidebar - Right Column -->


<div class="avail_download">
	<div class="avail_download_title">Available Downloads</div>
	<ul>
		<% if (fileReference!=null && (!fileReference.equals("")) && size>0) { %>
		<li><a href="#" class="action"
			onclick="CQ_dam_editorAction_download('<%=fileReference%>');">Original,
				<%=fileFormat%> <br /> (<%=UIHelper.getSizeLabel(size)%>) <img
				class="msds-search-link-arrow"
				src="/etc/designs/dupont/phoenix/responsiveclientlib/source/images/right-arrow-action.png"
				alt="Arrow image, click to navigate">
		</a></li>
		<%} %>
	</ul>
</div>

<!-- End Sidebar - Right Column -->





