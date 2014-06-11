<%--

  Image Media Gallery component.

  A component to display 4 sets of images from image gallery from DAM.

--%><%@ page import="com.day.cq.wcm.foundation.Image,com.dupont.phoenix.Global,
                    org.apache.commons.lang.StringUtils, com.dupont.phoenix.ImageMediaGalleryHelper,
                    java.util.*,java.util.HashMap,com.day.cq.wcm.api.WCMMode,com.day.cq.dam.api.Asset"%><%
%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%
try {
Boolean isEdit = Global.isEdit(slingRequest);    
ImageMediaGalleryHelper imageMediaGalleryHelper = new ImageMediaGalleryHelper(resource);
List<HashMap<String,Object>> galleryList= imageMediaGalleryHelper.getImageGalleries();
if(galleryList!=null  && galleryList.size()>0) {
%><div class="row group hlm-div-id">


    <div class="padding-left group" id="media"> 
        <h2><%=Global.getTranslatedText(currentPage, slingRequest,"Media") %></h2>
        <div id="media-menu-wrapper">
            <ul id="media-menu"><%
            for(int galleryIndex=0;galleryIndex<galleryList.size();galleryIndex++) {
                HashMap map =  galleryList.get(galleryIndex);
                List imageList = (List)map.get("images");
                String tabTitle = (String) map.get("title"); 
                %><li data-gallery="media-gallery-set-<%=(galleryIndex+1)%>" class="media-gallery-set-<%=(galleryIndex+1)%>"><a href=""><%= tabTitle %></a></li><%
            }
        %></ul>
        </div>
    </div>
    
    <div id="media-gallery-wrapper"><%   
        for(int galleryIndex=0;galleryIndex<galleryList.size();galleryIndex++) {
            HashMap map =  galleryList.get(galleryIndex);
            List imageList = (List)map.get("images");
            String tabTitle = (String) map.get("title"); 
            if(imageList!=null && imageList.size()>0) {
                %><div id="media-gallery-set-<%=(galleryIndex+1)%>" class="group gallery-row"><%
                for(int imageIndex=0;imageIndex< imageList.size();imageIndex++) {
                    Resource imageResource = (Resource) imageList.get(imageIndex);
                    if(imageResource==null) continue;
                    Image image = new Image(imageResource);
                    Resource res = resource.getResourceResolver().getResource(image.getFileReference());
                    if(res==null) continue;
                    Asset asset = res.adaptTo(Asset.class);
                    image.set(Image.PN_HTML_WIDTH, "690");
                    image.set(Image.PN_HTML_HEIGHT, "345");
                    //image.set(Image.PN_ALT, image.getTitle());
                    String imageTitle = "";
                    String imageDescription = "";
                    
                    try {
                        // it might happen that the adobe xmp lib creates an array
                        Object titleObj = asset.getMetadata("dc:title");
                        if (titleObj instanceof Object[]) {
                            Object[] titleArray = (Object[]) titleObj;
                            imageTitle = (titleArray.length > 0) ? titleArray[0].toString() : "";
                        } else {
                            imageTitle = titleObj.toString();
                        }
                    }
                    catch (NullPointerException e) {
                        imageTitle = asset!=null ? asset.getMetadataValue("dc:title"):StringUtils.EMPTY;
                    }

                    try {
                        // it might happen that the adobe xmp lib creates an array
                        Object titleObj = asset.getMetadata("dc:description");
                        if (titleObj instanceof Object[]) {
                            Object[] titleArray = (Object[]) titleObj;
                            imageDescription = (titleArray.length > 0) ? titleArray[0].toString() : "";
                        } else {
                            imageDescription = titleObj.toString();
                        }
                    }
                    catch (NullPointerException e) {
                        imageDescription = asset!=null ? asset.getMetadataValue("dc:description"):StringUtils.EMPTY;
                    }
                    
                    if(imageIndex==0) {
                        %><!-- Main Featured Image Area -->
                        <div class="media-shown gallery-main">
                            <% image.draw(out);%>
                            <h2><a href=""><%= imageTitle%></a></h2>
                            <p><%= imageDescription %></p>
                        </div>
                        <!-- End Main Featured Image Area -->
                        
                        <!-- Thumbnail Area -->
                        <div class="gallery-thumbs padding-right">
                    
                            <!-- Dynamic Image Set -->
                            <div class="parbase imageset"><%
                    }
                    image.set(Image.PN_HTML_WIDTH, "118");
                    image.set(Image.PN_HTML_HEIGHT, "59");
                                %><div>
                                    <%image.draw(out); %>
                                    <h3><a href=""><%= imageTitle%></a></h3>
                                    <p><%= imageDescription %></p>
                                </div><%
                    if(imageIndex==(imageList.size()-1)) {
                            %></div>
                            <!-- End Dynamic Image Set -->

                    <!-- Media Gallery Pagination -->
                        <div class="media-gallery-pagination group">
                            <div class="media-gallery-pagination-count">
                                <span class="media-gallery-pagination-first">1</span> -
                                <span class="media-gallery-pagination-last">10</span> <%=Global.getTranslatedText(currentPage, slingRequest, "of") %> 
                                <span class="media-gallery-pagination-total"><%=imageList.size()%></span>
                            </div>
                            <div class="media-gallery-prev-next">
                                <ul>
                                    <li class="media-previous"><span><%=Global.getTranslatedText(currentPage, slingRequest, "Prev") %></span></li>
                                    <li class="media-next"><span><%=Global.getTranslatedText(currentPage, slingRequest, "Next") %></span></li>
                                </ul>
                            </div>
                        </div>
                    <!-- End Media Gallery Pagination -->


                        </div><%
                    }
                }
                %>
                </div><%
            }
        }
    %></div>
</div><%
} else if(isEdit) {   
%><h2 class="row-group padding-left">
    Image Media Gallery
</h2><%
} } catch(Exception e) {log.error(e.getMessage());}%>


