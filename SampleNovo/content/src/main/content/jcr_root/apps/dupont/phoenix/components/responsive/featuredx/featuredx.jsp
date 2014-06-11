<%--

  Featured X Component component.

  Featured X Component

--%>
<%
%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%
%><%@ page
    import="com.dupont.phoenix.featured.FeaturedModuleHelper,com.day.cq.wcm.api.WCMMode,com.dupont.phoenix.list.ListItem,com.dupont.phoenix.Global,java.util.List,com.dupont.phoenix.commons.Scene7Image"%>
<%
    pageContext.setAttribute("isEdit",Global.isEdit(slingRequest));
%>
    <%
Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);
FeaturedModuleHelper featuredModuleHelper = new FeaturedModuleHelper(slingRequest, currentPage, resource);
ListItem item = featuredModuleHelper.getItem();
request.setAttribute("item",item);
Boolean isQuickLink =  properties.containsKey("linklistcurated/isQuickLink") ? properties.get("linklistcurated/isQuickLink",Boolean.class) : false;
if(isQuickLink)
{
   if(isEdit)
   {
   %>
     <div class="featured_x ${(!isEdit)?'':''}">
      <div class="author">Please click here to open dialog for Featured
        Module X.</div>
     </div> 
    <%
   }
%>
    <sling:include path="linklistcurated"
        resourceType="/apps/dupont/phoenix/components/linklistcurated" />
    <%
}
else if(item!=null)
     {
     %>
     <div class="featured_x ${(!isEdit)?'':''}">
    <cq:include
        script="/apps/dupont/phoenix/components/responsive/featuredx/listitem-onethird-page-width-featuredx.jsp" />
        </div>
    <% }
else if(isEdit) {%>
     <div class="featured_x ${(!isEdit)?'':''}">
      <div class="author">Please click here to open dialog for Featured
          Module X.</div>
     </div>
    <%} %>
