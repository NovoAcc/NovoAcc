<%--

  Call To Action Component component.

  Call To Action Component
 
--%>
<%@ page import="com.day.cq.commons.inherit.*" %>
<%@page import="com.day.cq.wcm.api.WCMMode" %>
<%@ page import="org.apache.commons.lang.StringUtils" %> 
<%@ page import="com.dupont.phoenix.*" %>
<%@ page import="java.util.HashMap,java.util.Map" %>
<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>

<%
   String shortHeadline= properties.get("shortHeadline","");
   String linkURL= properties.get("linkURL", "");
   String shortDescription=properties.get("shortDescription","");
   String linkTitle=properties.get("linkTitle","");

   request.setAttribute("shortHeadline",shortHeadline);
   request.setAttribute("linkURL",linkURL);
   request.setAttribute("linkTitle",linkTitle); 
 
 %>
  <c:choose> 
       <c:when test="${empty shortHeadline || empty linkURL || empty linkTitle }">
          <% if (WCMMode.fromRequest(slingRequest) == WCMMode.EDIT){  %>
          Call to Action
          <% } %>    
       </c:when>
       <c:otherwise> 
       <div class="call-to-action-module vertical_list_module">
           <a class="call-to-action-title" href="<%= properties.get("linkURL", "")%>"><%=shortHeadline %></a>
                  <p> <%= shortDescription %> </p>
                        <div class="red-white-button">
                            <%   
                               linkURL=xssAPI.getValidHref(linkURL);
                               boolean checkExternalLink=Global.isExternalLink(linkURL);
                               if(checkExternalLink==false){
                               linkURL=(String.format("%s.html",Global.getNavigationURL(slingRequest, linkURL, false))); }
                             //  Map<String,String> map=new HashMap<String, String>();
                             //  map.put("href",linkURL);
                             //  map.put("class","button red-button");   
                            %>
                           <%= Global.renderLink( linkURL,"button red-button",linkTitle,"button-text",null,null,false,true) %>
                         </div> 
      </div>
      </c:otherwise>
 </c:choose>
 <div style="clear:both"></div>     