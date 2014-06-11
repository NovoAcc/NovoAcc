<%-- 

Draws the sibling navigation

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.dupont.phoenix.navigation.PersistentNavigation" %>

<% 
   pageContext.setAttribute("siblingnavigationpages",PersistentNavigation.findPages(currentPage));
%>

   <!-- New Navigation Area -->
            <nav class="navigation-area">
                <ul>              
                	<c:forEach var="siblingPage" items="${siblingnavigationpages}" varStatus="i">
				
				<c:choose>
					<c:when test="${siblingPage.path == currentPage.path}" >
						<li class = "active">
					</c:when>
					<c:otherwise>
	                	 <li>
	                </c:otherwise>
                </c:choose>
                
				
							<a href="${siblingPage.path}.html">
                                    <c:choose>

                                        <c:when test="${not empty siblingPage.navigationTitle  }">
                                          ${siblingPage.navigationTitle }
                                        </c:when>                                 
                                        <c:otherwise>
                                            ${siblingPage.title }
                                        </c:otherwise>

                                    </c:choose>

                                </a></li>							
					
					</c:forEach>                 
                </ul>
                <div style="clear:both"></div>
            </nav>
            <!-- End New Navigation Area -->