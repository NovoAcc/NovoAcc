<%--

  Link List Dynamic component.

  A component to display a dynamic link list of up to 5 internal links picked up using relevancy logic.  

--%>

<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.hlm.HLMHelper, com.day.cq.wcm.api.WCMMode,
    java.util.ResourceBundle, com.dupont.phoenix.list.ListItem, java.util.List" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page import="com.day.cq.i18n.I18n"%>
<%@ page import="com.dupont.phoenix.*" %>

<%
try {
    Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);    
    ResourceBundle resourceBundle = slingRequest.getResourceBundle(currentPage.getLanguage(true));  
 // final I18n i18n = new I18n(slingRequest);
    String dynamicLinkListViewTye = "";
    String scriptType = "";
    String contentType = properties.get("contentType",String.class);
    int listSize = 0;
    LinkListDynamicHelper linklistDynamicHelper = null;
    if(contentType!=null) {
        linklistDynamicHelper = new LinkListDynamicHelper (slingRequest,currentPage, resource);
        List<ListItem> items = linklistDynamicHelper.getItems();
        listSize = (items!=null)?items.size():0;
        request.setAttribute("listSize",listSize ); 
        request.setAttribute("items",items);
        dynamicLinkListViewTye = linklistDynamicHelper.getdynamicListType(contentType);
        scriptType=String.format("/apps/dupont/phoenix/components/common/listviews/%s.jsp",dynamicLinkListViewTye );
        }  
   
      String contentTypeName=currentDesign.getStyle("siteconfig/linklistdynamic").get(contentType , String.class);
    // String moduleTitle = I18n.get(resourceBundle, contentTypeName);
       String moduleTitle =Global.getTranslatedText(currentPage, slingRequest,contentTypeName);
       Boolean hideLinkListDynamic = properties.containsKey("showHide") ? properties.get("showHide", Boolean.class) : false;
       if(listSize > 0 && !hideLinkListDynamic ) { %>
       <!-- Modules_M.10.0b-Dynamic Link List --> 
       <div class="vertical_list_module">
          <div class="sidebar_title"><%=moduleTitle %></div>
             <cq:include script="<%=scriptType%>"/>
       </div>
       <div style="clear:both"></div>
       <!--End Modules_M.10.0b-Dynamic Link List -->
       <% } else if(isEdit) {%>
           Please click here to open Dynamic Link List [<%=contentType %>] dialog.
           <div style="clear:both"></div>
       <%} } catch(Exception e) {log.error(e.getMessage());}%>
       
       
  






                   