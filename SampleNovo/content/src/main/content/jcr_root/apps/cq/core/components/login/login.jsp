<%@page session="false"
        contentType="text/html; charset=utf-8"
        import="org.apache.sling.api.resource.Resource,
                org.apache.commons.lang.StringUtils,
                com.day.cq.i18n.I18n"%><%
%><%@taglib prefix="cq" uri="http://www.day.com/taglibs/cq/1.0" %><%
%><cq:defineObjects /><%!

    private String getOverlayCssPath(Resource resource, String fileName) {
        String path = resource.getPath() + fileName;
        // snip off 1. segment
        path = path.substring(path.indexOf("/", 1)+1);
        Resource res = resource.getResourceResolver().getResource(path);
        if (res != null) {
            return res.getPath();
        } else {
            return path;
        }
    }

%><%
    final String authType = request.getAuthType();
    final String user = request.getRemoteUser();
    final String contextPath = slingRequest.getContextPath();
    String redirect = StringUtils.startsWith(request.getParameter("resource"), "/welcome") ?  "/welcome" : request.getParameter("resource");

    // only allow redirects to internal locations
    if (!StringUtils.startsWith(redirect, "/") || StringUtils.startsWith(redirect, "//")){
        redirect = "/welcome";
    }
    
    // make sure the redirect path is prefixed with the context path
    if (!redirect.startsWith(contextPath)) {
        redirect = contextPath + redirect;
    }

    // ensure content type and character encoding
    response.setContentType("text/html");
    response.setCharacterEncoding("UTF-8");

    String title = properties.get("jcr:title", resource.getName());

    String cssPath = getOverlayCssPath(resource, "/login.css");
    String ieCssPath = getOverlayCssPath(resource, "/login_ie.css");
    String mobileCssPath = getOverlayCssPath(resource, "/login_mobile.css");

    // I18n
    I18n i18n = new I18n(slingRequest);

%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title><%= xssAPI.filterHTML(title) %></title>

    <link rel="shortcut icon" href="login/favicon_0.ico" type="image/vnd.microsoft.icon">
    <link rel="icon" href="login/favicon_0.ico" type="image/vnd.microsoft.icon">
    <link rel="stylesheet" type="text/css" href="<%= xssAPI.getValidHref(contextPath + cssPath) %>">
 
    <!--[if IE]>
        <link rel="stylesheet" type="text/css" href="<%= xssAPI.getValidHref(contextPath + ieCssPath) %>">
    <![endif]-->
    <!--[if lt IE 9]>
        <style type="text/css">#user input, #password input {padding: 10px 5px;}</style>
    <![endif]-->

    <script type="text/javascript" src="login/login.js"></script>
    <script type="text/javascript">
        if(navigator.userAgent.match(/Mobile/i) || navigator.userAgent.match(/BlackBerry/i)) {
            document.write('<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">');
            document.write('<link rel="stylesheet" type="text/css" href="<%= xssAPI.getValidHref(contextPath + mobileCssPath) %>">');
        }
    </script>
</head>
<body <%
Resource bgImg = resourceResolver.getResource("/libs/cq/core/content/login/bg/background.png");
if(bgImg != null) {
    %>style="background-color:#000; background-image:url('<%= resourceResolver.map(request, bgImg.getPath()) %>'); background-position: 0 0; background-repeat: no-repeat;"<%
}
%>>
<div id="wrapper">
<%
    if (authType == null || user == null || user.equals("anonymous")) {
%>
    <div id="tag"></div>
    <div id="product"></div>
    <div id="productclaim" onclick="window.open('http://my.omniture.com');"></div>
    <div class="right">
        <div class="right-bg">
            <div id="login-box" class="loginbox">
                <%
                String jReason = request.getParameter("j_reason");
                if (jReason == null) {
                     jReason = "";
                }
                %>
                <form name="login" method="POST" action="<%= xssAPI.encodeForHTMLAttr(contextPath + resource.getPath() + ".html/j_security_check") %>"
                        onsubmit="return loginuser('<%= i18n.get("User name and password do not match") %>');">
                    <div id="login-error" class="<%= jReason.length() > 0 ? "err-visible" : "err-hidden" %>"><%= xssAPI.encodeForHTML(i18n.getVar(jReason)) %>&nbsp;</div>
                    <div id="user">
                        <input id="input-username" onkeyup="txtCtrl(this,'lblUsername')" type="text" name="j_username" spellcheck="false" autocomplete="off">
                        <div id="lblUsername" class="label"><label for="input-username"><%=i18n.get("Username")%></label></div>
                    </div>
                    <div id="password">
                        <input id="input-password" onkeyup="txtCtrl(this,'lblPassword')" type="password" name="j_password" spellcheck="false" autocomplete="off">
                        <div id="lblPassword" class="label"><label for="input-password"><%=i18n.get("Password")%></label></div>
                    </div>
                    <div id="submit">
                        <input id="input-submit" type="submit" value="<%= i18n.get("Sign In") %>" title="<%= i18n.get("Sign In") %>">
                        <input type="hidden" id="resource" name="resource" value="<%= xssAPI.encodeForHTMLAttr(redirect) %>">
                        <input type="hidden" name="_charset_" value="UTF-8">
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        // try to set focus to usr field and, if possible, select existing text
        try {
            var usr = document.getElementById("input-username");
            usr.focus();
            if (usr.value) {
                usr.select();
                txtCtrl(usr, 'lblUsername')
            }
        } catch (e) {
            // ignore
        }

        // try to append the current hash/fragment to the redirect resource
        if (window.location.hash) {
            var resource = document.getElementById("resource");
            if (resource) {
               resource.value += window.location.hash;
            }
        }
    </script>
    <%
    } else {
    %>
    <script type="text/javascript">
         var redirect = '<%= xssAPI.encodeForJSString(xssAPI.getValidHref(redirect)) %>';
         if (window.location.hash) {
             redirect += window.location.hash;
         }
         document.location = redirect;
     </script>
    <%
    }
    %>
    <!-- QUICKSTART_HOMEPAGE - (string used for readyness detection, do not remove) -->
</div>
</body>
</html>
