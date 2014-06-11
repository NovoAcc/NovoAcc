<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="java.util.List, com.dupont.phoenix.list.ListItem, com.day.cq.wcm.foundation.Image" %>
<%@ page import="com.dupont.phoenix.*"%>
<%
   //To display Dynamic Link List with Title and Discription.
    List<ListItem> items = (List<ListItem>) request.getAttribute("items");
    int listSize = (items!=null) ? items.size() : 0;
     String externalIconPath="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png" ;
    String externalIconCSSClass="cta-arrow";
   %>
    <ul>
      <%
       for(int count=0; count < listSize ; count++) {
       ListItem item = items.get(count);
       String linkText=item.getLinkText();
       String linkURL =item.getLinkURL();
      %>
        <li>
         <%--<h2><a href="<%=item.getLinkURL()%>"><%=item.getTextWithoutLastWord(item.getLinkText())%> <span class="no-wrap"><%=item.getTextLastWord(item.getLinkText())%><img src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png" class="cta-arrow"></span></a></h2> --%>
          <h2> <%= Global.renderLink( linkURL ,null,linkText,null,externalIconPath,externalIconCSSClass,false,false) %></h2>
          <p><%=item.getShortDesc()%></p>
       </li>
     <% }%>
    </ul>
   
 


