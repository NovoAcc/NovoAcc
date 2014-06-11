<%--
  Copyright 1997-2008 Day Management AG
  Barfuesserplatz 6, 4001 Basel, Switzerland
  All Rights Reserved.

  This software is the confidential and proprietary information of
  Day Management AG, ("Confidential Information"). You shall not
  disclose such Confidential Information and shall use it only in
  accordance with the terms of the license agreement you entered into
  with Day.

  ==============================================================================

  Compiles a JSON-formatted list of the available display options to
  draw list items.

--%><%
%><%@ page import="com.day.cq.commons.jcr.JcrConstants,
                   com.day.cq.wcm.api.components.Component" %><%
%><%@include file="/libs/foundation/global.jsp"%><%

    final String regex = "^listitem\\_(.*)\\.jsp$";
    response.setContentType("text/plain");
    
    String socialMediaChannels="/etc/designs/dupont/phoenix/socialmediachannels";
    String text ="";
%>[<%

    try {

        NodeIterator scripts = slingRequest.getResourceResolver().getResource(
            socialMediaChannels).adaptTo(Node.class).getNodes();
        String delim = "";
           while (scripts.hasNext()) {
                Node script = scripts.nextNode();
                String value= script.getName();       

  
                if (script.hasProperty("text")) {
                        text = script.getProperty("text").getString();
                }
        
 
                %><%= delim %><%
                %>{<%
                    %>"text":"<%= text %>",<%
                    %>"value":"<%= value %>"<%
                %>}<%
                if ("".equals(delim)) delim = ",";
  

            }
    } catch (RepositoryException re) {}

%>]
