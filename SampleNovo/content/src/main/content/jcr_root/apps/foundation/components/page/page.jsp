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

  Default page component.

  Is used as base for all "page" components. It basically includes the "head"
  and the "body" scripts.

  ==============================================================================

--%><%@page session="false"
            contentType="text/html; charset=utf-8"
            import="com.day.cq.commons.Doctype,
                    com.day.cq.wcm.api.WCMMode,
                    com.day.cq.wcm.foundation.ELEvaluator,com.dupont.phoenix.*" %><%
%><%@taglib prefix="cq" uri="http://www.day.com/taglibs/cq/1.0" %><%
%><cq:defineObjects/><%
  String languageCode=Global.getLangCode(currentPage);
//commenting out this piece to avoid the extra redirect for the ghost page
/*
    // read the redirect target from the 'page properties' and perform the
    // redirect if WCM is disabled.
    String location = properties.get("redirectTarget", "");
    // resolve variables in path
    location = ELEvaluator.evaluate(location, slingRequest, pageContext);
    if (WCMMode.fromRequest(request) != WCMMode.EDIT && location.length() > 0) {
        // check for recursion
        if (!location.equals(currentPage.getPath())) {
            final String redirectTo = slingRequest.getResourceResolver().map(request, location) + ".html";
            response.sendRedirect(redirectTo);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
        return;
    }
    */
    // set doctype
    if (currentDesign != null) {
        currentDesign.getDoctype(currentStyle).toRequest(request);
    }
    boolean isResponsive = Global.isResponsive(currentPage,resource);
    String docType = "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">";
    if(isResponsive)
    {
        docType = "<!DOCTYPE HTML>";
    }

%>
<%= docType %>
<html lang="<%=languageCode%>">
<cq:include script="head.jsp"/>
<cq:include script="body.jsp"/>
</html>