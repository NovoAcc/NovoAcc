<%--

  Link List Curated component.

  A component to display a custom curated link list of up to 5 links internal or external.

--%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page
    import="com.dupont.phoenix.LinkListCuratedHelper,
    		com.day.cq.wcm.api.WCMMode,
            org.apache.sling.commons.json.JSONObject,java.util.*,
            com.day.cq.i18n.I18n,
            java.util.ResourceBundle,
            com.dupont.phoenix.Global,
            org.apache.commons.lang.StringUtils,
            org.apache.commons.lang3.StringEscapeUtils,
            com.day.text.Text"%>

<%
 // Include the widgets only on Author Mode
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
 %> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
 <% } %>


<%
try {
/*

Node linkTypeNode = resource.adaptTo(Node.class);
String []linkItems = {};
String event = null;

String contentType = null;*//*
boolean editMode = WCMMode.fromRequest(slingRequest) == WCMMode.EDIT;
 int size = 0;
if((WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)){%>
<h1>Link List Curated Content</h1>
<%} 
ResourceBundle resourceBundle = slingRequest.getResourceBundle(currentPage.getLanguage(true));
final I18n i18n = new I18n(slingRequest);
    //boolean editMode = WCMMode.fromRequest(slingRequest) == WCMMode.EDIT;
final LinkListCuratedHelper linkListCuratedHelper = new LinkListCuratedHelper(slingRequest,currentPage, resource);  
String listTitle = linkListCuratedHelper.getComponentProperty("listTitle");
String shortDesc = linkListCuratedHelper.getComponentProperty("shortDesc");
String hide = linkListCuratedHelper.getComponentProperty("hide");
String isQuickLink = linkListCuratedHelper.isQuickLink();
String isCurated = linkListCuratedHelper.isCurated();
List<Map> list = linkListCuratedHelper.getList();
if(list.size() > 0)
{
	size=list.size();
}
String listTile_Lang=null;
String shortDesc_Lang=null;*/
    boolean editMode = WCMMode.fromRequest(slingRequest) == WCMMode.EDIT;
    int size = 0; 

    if((WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)){%>
        <h1>Link List Curated Content</h1>
    <%}

    ResourceBundle resourceBundle = slingRequest.getResourceBundle(currentPage.getLanguage(true));
    final I18n i18n = new I18n(slingRequest);

    final LinkListCuratedHelper linkListCuratedHelper = new LinkListCuratedHelper(slingRequest,currentPage, resource);  


    String listTitle = linkListCuratedHelper.getComponentProperty("listTitle");
    String shortDesc = linkListCuratedHelper.getComponentProperty("shortDesc");

    List<Map> list = linkListCuratedHelper.getList();

    if(list.size() > 0)
        pageContext.setAttribute("size",list.size());


    String listTile_Lang=null;
    String shortDesc_Lang=null;

    if(listTitle != null)
    {
        listTile_Lang = i18n.get(resourceBundle, listTitle);
    }
    if(shortDesc != null)
    {
        shortDesc_Lang = i18n.get(resourceBundle, shortDesc);
    }

    pageContext.setAttribute("listTitle",linkListCuratedHelper.getComponentProperty("listTitle"));
    pageContext.setAttribute("shortDesc",linkListCuratedHelper.getComponentProperty("shortDesc"));
    pageContext.setAttribute("hide",linkListCuratedHelper.getComponentProperty("hide"));
    pageContext.setAttribute("isQuickLink",linkListCuratedHelper.isQuickLink());
    pageContext.setAttribute("isCurated",linkListCuratedHelper.isCurated() ); 


%> 

<c:set var="editMode" value="<%=editMode%>"></c:set>



<c:choose>
    <c:when test="${(hide != null) && (hide)}">
        <c:if test="${editMode}">
            <h2>Curated Link List Component Hidden</h2>
        </c:if>
    </c:when>

    <c:otherwise>
         <c:if test="${size != null && size!=0}">
                <c:if test="${(isQuickLink != null) && (isQuickLink)}">
                    <%@include file="quicklink.jsp"%>   
                </c:if>
                <c:if test="${((isQuickLink == null) && (!(isQuickLink)))&&((isCurated == null) && (!(isCurated)))}">
                    <%@include file="additionallist.jsp"%>
                </c:if>
                <c:if test="${(isCurated != null) && (isCurated)}">
                    <%@include file="curatedlist.jsp"%>
           		</c:if>
        </c:if>
    </c:otherwise>
</c:choose><%
} catch(Exception e) {
    log.error(e.getMessage());
}
%><div style="clear:both"></div>
