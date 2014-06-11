<%--

  Image Set

--%><%@ page import="com.day.cq.wcm.foundation.Image,org.apache.commons.lang.StringUtils, com.dupont.phoenix.ImageMediaGalleryHelper,java.util.*,java.util.HashMap,com.day.cq.wcm.api.WCMMode,com.day.cq.dam.api.Asset"%><%
%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%
Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);    
ImageMediaGalleryHelper imageMediaGalleryHelper = new ImageMediaGalleryHelper(resource);
List<Resource> images = (List<Resource>)imageMediaGalleryHelper.getImages(currentPage.getPath());
if(images!=null && images.size()>0 )
{
        for(int imageIndex=0;imageIndex< images.size();imageIndex++)
        {
          Resource imageResource = (Resource) images.get(imageIndex);
          Asset asset = imageResource.adaptTo(Asset.class);
          Image image = new Image(imageResource);
          image.set(Image.PN_HTML_WIDTH, "218");
          image.set(Image.PN_HTML_HEIGHT, "109");
          String imageTitle=image!=null?image.getTitle():StringUtils.EMPTY;
          String imageDescription= asset !=null ?asset.getMetadataValue("dc:description"):StringUtils.EMPTY;
          %><div>
          <% image.draw(out); %>
          </div><%
          }
}
else if(isEdit)
{
out.println("Click here to open Image Set dialog.");
}          
%>