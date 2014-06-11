<%--

	Row Call Out Component

--%>
<%@page import="com.day.cq.wcm.api.WCMMode" %>
<%@page import="java.util.StringTokenizer"  %>

<%
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@page session="false" %>
<%@ page import="com.day.cq.i18n.I18n" %>
<% final I18n i18n = new I18n(slingRequest); %>


<%
%><%
String title= properties.get("title", "");
String link = properties.get("linkURL", "");
  %>
    
<% 
String titlePrefix  = i18n.get("View Products in");
String titlePrefixLastWord = titlePrefix.substring(titlePrefix.lastIndexOf(' ')+1);
StringTokenizer st = new StringTokenizer (titlePrefix);
int i=0;
 while (st.hasMoreTokens ()) {
                i++;
         //System.out.println (st.nextToken ());
            }
           
%>
<% 
String titlePrefixWithoutLastWord = new String();
if(i>1) {
titlePrefixWithoutLastWord = titlePrefix.substring(0, titlePrefix.lastIndexOf(' ')); }%>

<% if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT){%>
    <% if (null== link || link.length() ==0 || null== title || title.length() ==0) {%> 
         Enter Product Finder Here
    <% } else {%> 
    <div id="tool-callout">    
        <a href="<%=link%>.html" class="tool maroon">
        <% if(i>1) { %>
     <h2><%=titlePrefixWithoutLastWord%></h2>
     <% } %>
        <div class="author"><%=titlePrefixLastWord%>  <%=title%> <img class="tool-arrow" src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png"></div>
        </a>
    </div>
    <% } %>
<% } else {%>
    <% if( (null!=link &&link.length()!=0) && (null!=title && title.length() !=0)) {%>
    <div id="tool-callout">    
        <a href="<%=link%>.html" class="tool maroon">
        <% if(i>1) { %>
     <h2><%=titlePrefixWithoutLastWord%></h2>
     <% } %>
        <div class="author"><%=titlePrefixLastWord%>  <%=title%> <img class="tool-arrow" src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png"></div>
        </a>
    </div>
    <% } %>
<% } %>