<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.Global, com.dupont.phoenix.navigation.GlobalNav"%>

<% 
GlobalNav globalnav = new GlobalNav(currentPage, slingRequest, resource, currentDesign);
pageContext.setAttribute("globalnav",globalnav);
%>


<div class="header-top-bar">
  <a href="${globalnav.homePageURL }">
	   <div class="header-top-bar-logo">	
     </div>
  </a>
	<!--  Global Navigation Links Start  -->
	<div class="menu-dropdown">
	<c:choose>
		<c:when test="${globalnav.countryContainer == 'true' }">
            <c:if test="${not empty globalnav.mainnodes }">
	  			<div class="header-top-bar-nav dropdown">
	                <c:forEach var="mainnode" items="${globalnav.mainnodes }" varStatus="i">
	                        <div class="navigation-item brands${i.count }">
	                           <a class="global-mega-link"><c:out value="${mainnode.title }" escapeXml="true"/></a>
	                            <div style="display: none;" class="menu-dropdown-content country-container">
	                                <c:if test="${mainnode.globalNavNodeName == 'prodservices' }">
	                                     <%@include file="prodservices_cc.jsp"%>
	                                </c:if>

	                                <c:if test="${mainnode.globalNavNodeName == 'dupontlinks' }">
										 <%@include file="dupontlinks.jsp"%>
	                                </c:if>
	                            </div>
	                        </div>
	                </c:forEach>
		  		</div>
			</c:if>

		</c:when>
		<c:otherwise>
			<c:if test="${not empty globalnav.mainnodes }">
	  			<div class="header-top-bar-nav dropdown">
	                <c:forEach var="mainnode" items="${globalnav.mainnodes }" varStatus="i">
	                        <div class="navigation-item brands${i.count }">
	                           <a class="global-mega-link"><c:out value="${mainnode.title }" escapeXml="true"/></a>
	                            <div style="display: none;" class="menu-dropdown-content">
	                                <c:if test="${mainnode.globalNavNodeName == 'industries' }">
	                                	 <%@include file="industries.jsp"%>
	                                </c:if>
	
	                                <c:if test="${mainnode.globalNavNodeName == 'prodservices' }">
	                                    <%@include file="prodservices.jsp"%>
	                                </c:if>
	
	                                <c:if test="${mainnode.globalNavNodeName == 'scienceandsoc' }">
	                                    <%@include file="scienceandsoc.jsp"%>
	                                </c:if>
	                            </div>
	                        </div>
	                </c:forEach>
		  		</div>
			</c:if>
		</c:otherwise>
	</c:choose>	
		<cq:include script="countryselector.jsp" />
    </div>
   	<!--  Global Navigation Links End  -->

</div>
<div style="clear:both"></div>