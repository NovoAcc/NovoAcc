<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.Global, com.dupont.phoenix.navigation.GlobalNav"%>

<% 
GlobalNav globalnav = new GlobalNav(currentPage, slingRequest, resource, currentDesign);
pageContext.setAttribute("globalnav",globalnav);
%>


<header class="header-top-bar" id="header-mbl">
	<div class="header-top-bar-logo">
    	<a href="${globalnav.homePageURL }"></a>
   </div>
    
 <!-- Responsive Global Navigation -->
	   <div class="mobile-menu">
	   		<a class="n1 mobile-menu-item menu-option">Menu</a>
	   		<a class="n2 mobile-menu-item search-option">Search</a>
	   		<a class="n3 mobile-menu-item language-option" href="#">Language</a>
	   </div>
	   <div class="menu-container">
	   		<div class="search-container">
				<div class="mobile-search-wrapper">
					<input class="mobile-search" value="Search Products, etc..." onblur="if (this.value=='')this.value=this.defaultValue;" onfocus="if (this.value==this.defaultValue) this.value='';">
					<button type="button">Submit</button>
				</div>
		   		<br clear="all"/>
		   	</div>

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

           <c:choose>
               <c:when test="${globalnav.countryContainer == 'true' }">   
                   <% int j=1; %>
                   <c:if test="${not empty globalnav.mainnodes }">
                       <c:forEach var="mainnode" items="${globalnav.mainnodes }" varStatus="i">
                           <h2 id="mainnode_title<%=j%>" class="top-inset">${mainnode.title}</h2> 
                           <div class="brands" id="brands<%=j%>">
                               <c:if test="${mainnode.globalNavNodeName == 'prodservices' }">
		                                        <%@include file="../../globalnav/prodservices_cc.jsp"%>
		                       </c:if>
		                 
                               <c:if test="${mainnode.globalNavNodeName == 'dupontlinks' }">
                                   <%@include file="../../globalnav/dupontlinks.jsp"%>
                               </c:if>
                           </div>      
                           <% j++; %>
                           
                       </c:forEach>
                   </c:if>	 
               </c:when>
               <c:otherwise>  
                   <% int j=1; %>
                   <c:if test="${not empty globalnav.mainnodes }">
                       <c:forEach var="mainnode" items="${globalnav.mainnodes }" varStatus="i">
                           <h2 id="mainnode_title<%=j%>" class="top-inset">${mainnode.title}</h2> 
                           <div class="brands" id="brands<%=j%>">
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
                           <% j++; %>
                           
                       </c:forEach>
                       
                   </c:if>	 
               </c:otherwise>
           </c:choose>	   


 <cq:include script="countryselector.jsp" /> 

</header>
<div style="clear:both"></div>
