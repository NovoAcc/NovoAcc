<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="java.util.List" %>
<%@ page import="com.dupont.phoenix.Global,com.dupont.phoenix.GlobalConstants"%>
<%@ page import="com.dupont.phoenix.hlm.HLMWrapper,com.dupont.phoenix.list.HListHelper"%>

<%
try
{

    // TODO : USe renderLink. Is it needed?
    // Set up resource bundle
    //ResourceBundle resourceBundle = slingRequest.getResourceBundle(null);
    //final I18n i18n = new I18n(slingRequest);
    //Read the content tabs to be displayed.
    HLMWrapper hlmWrapper = (HLMWrapper) request.getAttribute("hlmWrapper");
    if(hlmWrapper==null) {
        hlmWrapper = new HLMWrapper(slingRequest,currentPage);
        request.setAttribute("hlmWrapper", hlmWrapper);
    }
    List<HListHelper> hlmList = hlmWrapper.getCTHLMList();
    int noOfContentTabs=hlmList.size();
    
    // Implement a max of 6 tabs
    int maxNoOfTabs = 5; //5 tabs more on top of overview
    if (noOfContentTabs>maxNoOfTabs){
        //Remove items from the end of list
        while(noOfContentTabs>maxNoOfTabs){
        	hlmList.remove(hlmList.size()-1);
            noOfContentTabs= hlmList.size();
        }
        
    }
    request.setAttribute("hlmList", hlmList);

    // Translate system strings
    //String overviewTabTitle = i18n.get(resourceBundle, "Overview");
    String overviewTabTitle = Global.getTranslatedText(currentPage, slingRequest,"Overview");
    String selectedContentTab = Global.isSelectorActive(slingRequest, GlobalConstants.VIEW_ALL_SELECTOR_NAME) ? Global.getSelectorByIndex(slingRequest,1): "overview";
%>

<c:set var="noOfContentTabs" value="<%=noOfContentTabs %>"></c:set>
<c:if test="${noOfContentTabs > 0 }">
    <c:set var="selectedContentTab" value="<%=selectedContentTab%>"></c:set>
    <c:set var="extension" value=".html"></c:set>
   <%-- <c:set var="overviewTabURL" value="<%=currentPage.getPath()%>"></c:set> --%>
    <c:set var="overviewTabURL" value="<%=Global.getNavigationURL(slingRequest, currentPage, false)%>"></c:set>
    <section class="contenttabs">
    <nav class="nav-tabs-wrapper">
        <ul class="nav-tabs-${noOfContentTabs+1}">
            <!--  Start Show overview and other tabs -->
            <li <c:if test="${selectedContentTab == 'overview'}">class="selected"</c:if>><a href="${overviewTabURL}${extension}"><%=overviewTabTitle %></a></li>
            <c:forEach items="${hlmList}" var="hlm" varStatus="status">
            <c:set var="contentType" value="${hlm.contentTabName}"/>
            <c:set var="viewAllSelector" value="${hlm.id}"/>
            <c:if test="${!fn:contains(viewAllSelector, 'multimedia')}">
                <li <c:if test="${viewAllSelector == selectedContentTab}">class="selected"</c:if>>
                    <c:choose>
                        <c:when test="${status.last}">
                            <a href="${overviewTabURL}.<%=GlobalConstants.VIEW_ALL_SELECTOR_NAME%>.${viewAllSelector}${extension}" class="no-border"><%=currentDesign.getStyle("siteconfig/contenttabs").get(pageContext.getAttribute("contentType"))%></a>
                        </c:when>
                        <c:otherwise>
                           <a href="${overviewTabURL}.<%=GlobalConstants.VIEW_ALL_SELECTOR_NAME%>.${viewAllSelector}${extension}"><%=currentDesign.getStyle("siteconfig/contenttabs").get(pageContext.getAttribute("contentType"))%></a>
                        </c:otherwise>
                    </c:choose>
                </li>
            </c:if>
            </c:forEach>
            <!--  End Show overview and other tabs -->
        </ul>
    </nav>
    </section>
</c:if>
<%
}
catch (Exception e) {
    //e.printStackTrace();
    log.error(e.getMessage());
}
%>
