<%--
 Static HTML component.
 Static HTML
--%>
<%@include file="/libs/foundation/global.jsp"%>
<%@page import="com.day.cq.wcm.api.WCMMode" %>
<%@page session="false" contentType="text/html; charset=utf-8" %>

     
<%
String htmlInput= properties.get("htmlinput","");
request.setAttribute("htmlInput",htmlInput);
%> 
<c:choose> 
       <c:when test="${empty htmlInput}">
          <% if (WCMMode.fromRequest(slingRequest) == WCMMode.EDIT){  %>
          Enter Static Html 
          <% } %>    
       </c:when>
       <c:otherwise>
          <cq:text value="<%= htmlInput%>" /> 
       </c:otherwise>
</c:choose> 





