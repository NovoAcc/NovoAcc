<%--

  Link List Dynamic Coprorate component.

  A component to display a dynamic link list of up to 5 internal links picked up using relevancy logic and content type specified by author. 

--%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.hlm.HLMHelper, com.day.cq.wcm.api.WCMMode,
    java.util.ResourceBundle,com.dupont.phoenix.list.ListItem, java.util.List" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%@ page import="com.dupont.phoenix.*" %> 
<%
try {
    Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);    
    ResourceBundle resourceBundle = slingRequest.getResourceBundle(currentPage.getLanguage(true));  
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
    String moduleTitle = properties.get("listTitle","");
   // String moduleTitle =Global.getTranslatedText(currentPage, slingRequest,contentTypeName);
    Boolean hideLinklistDynamicCorporate = properties.containsKey("hide") ? properties.get("hide", Boolean.class) : false;
    
    if(listSize > 0 && !hideLinklistDynamicCorporate ) { %>
    <!-- Modules_M.10.0c-Dynamic Corporate Link List --> 
      <div class="vertical_list_module">
         <div class="sidebar_title"><%=moduleTitle %></div> 
         <ul>
          <cq:include script="<%=scriptType%>"/>
         </ul>
      </div>  
    <% } else if(isEdit) {%>
    Please click here to open Dynamic Corporate Link List dialog
    <%} } catch(Exception e) {log.error(e.getMessage());}%>
    <!--End  Modules_M.10.0c-Dynamic Corporate Link List -->
   <div style="clear:both"></div>
