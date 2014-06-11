<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.Global, com.dupont.phoenix.navigation.GlobalNav"%>

<% 
GlobalNav globalnav = new GlobalNav(currentPage, slingRequest, resource, currentDesign);
pageContext.setAttribute("globalnav",globalnav);
%>
<header class="header-top-bar">
    <a href="${globalnav.homePageURL }">
	   <div class="header-top-bar-logo">	
        </div>
    </a>
	<!--  Global Navigation Links Start  -->
	<nav class="menu-dropdown">
		<c:if test="${not empty globalnav.mainnodes }">
  			 <c:choose>
			    <c:when test="${globalnav.countryContainer == 'true' }">    
  			       <div class="header-top-bar-nav dropdown country-container-nav">
                </c:when> 
                <c:otherwise> 
                    <div class="header-top-bar-nav dropdown">
                </c:otherwise> 
               </c:choose>   
  			    <div class="menu-container">
                    <div class="search-container">
                        <div class="mobile-search-wrapper">
                            <input class="mobile-search" value="Search Products, etc..." onblur="if (this.value=='')this.value=this.defaultValue;" onfocus="if (this.value==this.defaultValue) this.value='';">
                            <button type="button">Submit</button>
                        </div>
                        <br clear="all"/>
                    </div>
		            <c:choose>
					   <c:when test="${globalnav.countryContainer == 'true' }">    
		                    <c:forEach var="mainnode" items="${globalnav.mainnodes }" varStatus="i">
		                            <div class="navigation-item brands${i.count + 1}">
		                               <a class="global-mega-link">${mainnode.title }</a>
		                                <div style="display: none;" class="menu-dropdown-content country-container">
		                                    <c:if test="${mainnode.globalNavNodeName == 'prodservices' }">
		                                        <%@include file="../../globalnav/prodservices_cc.jsp"%>
		                                    </c:if>
		                 
		                                    <c:if test="${mainnode.globalNavNodeName == 'dupontlinks' }">
		                                        <%@include file="../../globalnav/dupontlinks.jsp"%>
		                                    </c:if>
		                                </div>
		                            </div>
		                    </c:forEach>
		                </c:when>
						<c:otherwise>  
								<c:forEach var="mainnode" items="${globalnav.mainnodes }" varStatus="i">
		                            <div class="navigation-item brands${i.count }">
		                               <a class="global-mega-link">${mainnode.title }</a>
		                                <div style="display: none;" class="menu-dropdown-content">
		                                    <c:if test="${mainnode.globalNavNodeName == 'industries' }">
		                                        <%@include file="../../globalnav/industries.jsp"%>
		                                    </c:if>
		
		                                    <c:if test="${mainnode.globalNavNodeName == 'prodservices' }">
		                                        <%@include file="../../globalnav/prodservices.jsp"%>
		                                    </c:if>
		
		                                    <c:if test="${mainnode.globalNavNodeName == 'scienceandsoc' }">
		                                        <%@include file="../../globalnav/scienceandsoc.jsp"%>
		                                    </c:if>
		                                   
		                                </div>
		                            </div>
		                    </c:forEach>
						</c:otherwise>
					</c:choose>	   
                </div>
	  		</div>
		</c:if>
		<div class="mobile-menu-item search-option">Search</div>
		<cq:include script="countryselector.jsp" />
    </nav>
   	<!--  Global Navigation Links End  -->

</header>
<div style="clear:both"></div>