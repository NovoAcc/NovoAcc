<%--
Featured Y Component component.
--%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.dupont.phoenix.featured.FeaturedModuleHelper,com.day.cq.wcm.api.WCMMode,com.dupont.phoenix.list.ListItem,com.dupont.phoenix.Global,java.util.List"%>
<% pageContext.setAttribute("isEdit",Global.isEdit(slingRequest)); %> 



<%
  Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);
  String contentType = properties.get("contenttype", "");
  String contentPath = properties.get("selectedContent", "");
  String moduleTitle = properties.get("moduletitle", "");
  ListItem item = null;
  FeaturedModuleHelper featuredModuleHelper = new FeaturedModuleHelper(slingRequest, currentPage, resource);
  String urlSuffix =featuredModuleHelper.getUrlSuffix(contentPath);   

  if(contentType.equals("pdf")&& urlSuffix.equals("pdf") )   
   {      
     item = featuredModuleHelper.getPdfItem(); 
   }
   else{

     item = featuredModuleHelper.getItem(); } 

  request.setAttribute("item",item); 

  if(item!=null)
     {   
     %>  <div class="featured_x ${(!isEdit)?' floatleft':''}">
    <%= moduleTitle %> <br> <br>
    <cq:include
        script="/apps/dupont/phoenix/components/responsive/featuredy/listitem-onethird-page-width-featuredy.jsp" />
          </div>
    <% }  
else if(isEdit) {%>
<div class="featured_x ${(!isEdit)?' floatleft':''}">
    <div class="author">Please click here to open dialog for Featured
        Module Y.</div>
          </div>
    <%} %>  
