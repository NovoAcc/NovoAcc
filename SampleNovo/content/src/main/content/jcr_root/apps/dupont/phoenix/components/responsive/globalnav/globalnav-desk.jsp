<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.Global, com.dupont.phoenix.navigation.GlobalNav"%>

<% 
GlobalNav globalnav = new GlobalNav(currentPage, slingRequest, resource, currentDesign);
pageContext.setAttribute("globalnav",globalnav);
%>

<script>
    $(document).ready(function(){
        $("#brands1").css("display","none");
        $("#brands2").css("display","block");
        $("#brands3").css("display","none");

        $("#mainnode_title1").click(function(){
            $("#brands1").slideToggle("slow");
            $("#brands2").css("display","none");
        	$("#brands3").css("display","none");

        });

       	$("#mainnode_title2").click(function(){
			$("#brands1").css("display","none");
            $("#brands2").slideToggle("slow");
        	$("#brands3").css("display","none");

        });

        $("#mainnode_title3").click(function(){
			$("#brands1").css("display","none");
            $("#brands2").css("display","none");
        	$("#brands3").slideToggle("slow");

        });
	});
</script>

<header class="header-top-bar" id="header-desk">
	<div class="header-top-bar-logo">
    	<a href="${globalnav.homePageURL }"></a>
   </div>

   <!--  Global Navigation Links Start  -->
	<nav class="menu-dropdown">
  		<c:if test="${not empty globalnav.mainnodes }">
  			<ul class="header-top-bar-nav dropdown">
  			    <li class="search-container">
                   <div class="mobile-search-wrapper">
                        <input class="mobile-search" value="Search Products, etc..." onblur="if (this.value=='')this.value=this.defaultValue;" onfocus="if (this.value==this.defaultValue) this.value='';">
                        <button type="button">Submit</button>
                   </div>
                   <br clear="all"/>
                </li>
                 <c:choose>
					   <c:when test="${globalnav.countryContainer == 'true' }">    
		                    <c:forEach var="mainnode" items="${globalnav.mainnodes }" varStatus="i">
                                <li class="navigation-item brand${i.count }">
                                   <a class="global-mega-link">${mainnode.title }</a>
                                    <div style="display: none;" class="menu-dropdown-content">
                                        <c:if test="${mainnode.globalNavNodeName == 'prodservices' }">
		                                        <%@include file="../../globalnav/prodservices_cc.jsp"%>
		                                </c:if>
		                 
		                                <c:if test="${mainnode.globalNavNodeName == 'dupontlinks' }">
		                                        <%@include file="../../globalnav/dupontlinks.jsp"%>
		                                </c:if>
                                    </div>
                                </li>
                			</c:forEach>
		                </c:when>
						<c:otherwise>  
								<c:forEach var="mainnode" items="${globalnav.mainnodes }" varStatus="i">
                                    <li class="navigation-item brand${i.count }">
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
                                    </li>
               					 </c:forEach>
						</c:otherwise>
					</c:choose>	   

	  		 </ul>
	  		<div class="n2 mobile-menu-item search-option" style="display:none;">Search</div>
		</c:if>
	    <cq:include script="countryselector.jsp" />
    </nav>
   	<!--  Global Navigation Links End  -->


</header>
<div style="clear:both"></div>