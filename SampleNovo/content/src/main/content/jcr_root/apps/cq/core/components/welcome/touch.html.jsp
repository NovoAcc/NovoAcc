<%@page session="false"%>
<%--
  ~ Copyright 1997-2011 Day Management AG
  ~ Barfuesserplatz 6, 4001 Basel, Switzerland
  ~ All Rights Reserved.
  ~
  ~ This software is the confidential and proprietary information of
  ~ Day Management AG, ("Confidential Information"). You shall not
  ~ disclose such Confidential Information and shall use it only in
  ~ accordance with the terms of the license agreement you entered into
  ~ with Day.
  --%><%@ page import="com.day.cq.i18n.I18n,
                com.day.cq.rewriter.linkchecker.LinkCheckerSettings,
                com.day.cq.security.Authorizable,
                com.day.cq.xss.ProtectionContext,
                com.day.cq.xss.XSSProtectionException,
                com.day.cq.xss.XSSProtectionService,
                com.day.text.Text,
                org.apache.sling.api.resource.Resource,
                org.apache.sling.api.resource.ResourceResolver,
                org.apache.sling.api.resource.ResourceUtil,
                javax.jcr.*,
                java.util.ArrayList,
                java.util.List" %><%
%><%@taglib prefix="cq" uri="http://www.day.com/taglibs/cq/1.0" %><%
%><cq:defineObjects /><%!

    public boolean showFeatureBox(Resource features, Resource resources, Resource search) {
        return show(features) || show(resources) || show(search);
    }

    private boolean show(Resource resource) {
        return resource != null && !ResourceUtil.getValueMap(resource).get("hidden", false);
    }

    public List<String[]> getLinks(Resource resource, I18n i18n) throws RepositoryException {
        Node node = resource.adaptTo(Node.class);
        List<String[]> links = new ArrayList<String[]>();
        NodeIterator features = node.getNodes();
        while (features.hasNext()) {
            Node linkNode = features.nextNode();
            if (!linkNode.hasProperty("sling:target")) {
                continue;
            }
            String href = linkNode.getProperty("sling:target").getString();
            boolean external = href.matches("^(http|https)\\:\\/\\/.*");
            if (!external) {
                if (!href.startsWith("/")) {
                    href = "/" + href;
                }
                Session session = linkNode.getSession();
                if (session.getRootNode().hasNode(href.substring(1))) {
                    // internal path, check permissions
                    try {
                        session.checkPermission(href, "read");
                        href += ".html";
                    } catch (Exception e) {
                        continue;
                    }
                } else {
                    // probably path to different app on server
                    external = true;
                }
            }
            String title = href;
            if (linkNode.hasProperty("jcr:title")) {
                title = i18n.getVar(linkNode.getProperty("jcr:title").getString());
            }
            String defHref;
            if (external) {
                // use external href as is
                defHref = href;
            } else {
                // use relative path for internal and semi-external href
                defHref = node.getParent().getName() + "/" + node.getName() + "/";
                defHref += linkNode.getName();
                defHref += ".html";
            }
            String description = "";
            if (linkNode.hasProperty("jcr:description")) {
                description = i18n.getVar(linkNode.getProperty("jcr:description").getString());
            }
            String target = external ? "_blank" : null;
            String[] link = new String[] { defHref, title, description, target };
            links.add(link);
        }
        return links;
    }
%><%
    final I18n i18n = new I18n(slingRequest);

    String title = i18n.getVar(properties.get("jcr:title", ResourceUtil.getName(resource)));
    ResourceResolver resolver = slingRequest.getResourceResolver();
    Authorizable auth = resolver.adaptTo(Authorizable.class);
    String name = auth == null ? null : auth.getName();
    if (name == null) {
        // workaround if user manager service is not ready yet.
        javax.jcr.Session jcrSession = resolver.adaptTo(javax.jcr.Session.class);
        name = jcrSession.getUserID();
    }

    XSSProtectionService xss = sling.getService(XSSProtectionService.class);
    if (xss != null) {
        try {
            name = xss.protectForContext(ProtectionContext.PLAIN_HTML_CONTENT, name);
        } catch (XSSProtectionException e) {
            // Ignored
        }
    }

    String about = i18n.get("About CQ5");

%><!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title><%= title %></title>
    <link rel="shortcut icon" href="login/favicon.ico" type="image/vnd.microsoft.icon">
    <link rel="icon" href="login/favicon.ico" type="image/vnd.microsoft.icon">
    <link type="text/css" href="welcome/welcome_touch.css" rel="stylesheet">
    <script type="text/javascript" src="login/login.js"></script>
    <cq:includeClientLib categories="cq.widgets"/>
</head>
<body>
<div class="section" id="tag">&nbsp;</div>
<div class="section" id="logo">&nbsp;</div>
<div class="section" id="header">
   <%--<a href="#" onclick="show_about();" title="<%= about %>">--%>
       <img class="header-about" alt="<%= about %>" src="<%= request.getContextPath() %>/etc/designs/default/0.gif">
   <%--</a>--%>
</div>
<div class="section" id="welcome_message"><%= i18n.get("Welcome, {0}.", "welcome screen", name) %> <%
   %><a id="signout" href="#" class="signout"><%= i18n.get("sign out", "welcome screen") %></a><%
%></div>

<div id="CQ">
    <div id="home" data-role="page" data-theme="b" class="page-home">
        <div data-role="content">
            <ul data-role="listview" data-inset="true" data-theme="c" data-dividertheme="b">
                <li data-role="list-divider">Applications</li>
                <li><a rel="external" href="/libs/cq/workflow/content/mobileinbox.html" target="workflowinbox">View Inbox</a></li>
                <li><a rel="external" href="/libs/cq/touch/content/sitebrowser.html" target="sitebrowser">Browse Content</a></li>
            </ul>



<%
           String basePath = resource.getPath();
           basePath = basePath.substring(basePath.indexOf("/")+1);
           basePath = basePath.substring(basePath.indexOf("/")+1);

           Resource features = resource.getResourceResolver().getResource(basePath + "/features");
           Resource resources = resource.getResourceResolver().getResource(basePath + "/resources");
           Resource search = resource.getResourceResolver().getResource(basePath + "/search");


           if (showFeatureBox(features, resources, search)) {
               %><ul data-role="listview" data-inset="true" data-theme="c" data-dividertheme="b" id="features-list">
                    <li data-role="list-divider">Resources</li><%
               /*---< search >-----------------------------------------------------*/
               if (search != null) {
                   String action = "", param = "", hiddenParams = "", querySuffix = "", target = "_self";
                   Node searchNode = search.adaptTo(Node.class);
                   if (searchNode != null) {
                       action = searchNode.hasProperty("action") ? searchNode.getProperty("action").getString() : resource.getPath();
                       param = searchNode.hasProperty("param") ? searchNode.getProperty("param").getString() : "q";
                       hiddenParams = searchNode.hasProperty("hiddenParams") ? searchNode.getProperty("hiddenParams").getString() : "";
                       querySuffix = searchNode.hasProperty("querySuffix") ? searchNode.getProperty("querySuffix").getString() : "";
                       target = searchNode.hasProperty("target") ? searchNode.getProperty("target").getString() : "_self";
                   }
           %>
               <form target="<%= target %>" action="<%= action %>" id="search_form" class="ui-listview-filter ui-bar-c" role="search">
                   <div class="ui-grid-a">
                       <div class="ui-block-a">
                            <input type="text" name="<%= param %>" id="search_input" data-type="search">
                           <%
                               if (hiddenParams.length() > 0) {
                                   try {
                                       for (String hiddenParam : Text.split(hiddenParams, ',')) {
                                           String[] pair = Text.split(hiddenParam, '=');
                                           %><input type="hidden" name="<%= pair[0] %>" value="<%= pair[1] %>"><%
                                       }
                                   } catch (Exception e) {
                                       // todo: error handling
                                   }
                               }
                           %>
                       </div>
                       <div class="ui-block-b">
                            <a data-role="button" type="submit" href="#" id="search_button" data-icon="arrow-r" data-iconpos="right">Search</a>
                       </div>
                   </div>
               </form>

                       <%
                           }
                           /*---< resources >-----------------------------------------------------*/
                           if (resources != null) {
                               out.flush();
                               LinkCheckerSettings.fromRequest(slingRequest).setIgnoreExternals(true);
                               LinkCheckerSettings.fromRequest(slingRequest).setIgnoreInternals(true);
                               List<String[]> links = getLinks(resources, i18n);
                               String separator = "";
                               for (String[] link : links) {
                                   String target = link[2] != null ? " target=\"" + link[2] +"\"" : "";
                       %><%= separator %><%
                   %><li><a href="<%= link[0]%>" title="<%= link[2] %>"<%= target %>><%= link[1] %></a><%
                       if (!"".equals(link[2])) {
                   %><p><%= link[2] %></p><%
                       }
                   %></li><%
                           }
                           out.flush();
                           LinkCheckerSettings.fromRequest(slingRequest).setIgnoreExternals(false);
                           LinkCheckerSettings.fromRequest(slingRequest).setIgnoreInternals(false);
                       }
                       %></ul><%
           }
       %>
        </div>
    </div>

    <script type="text/javascript">
        $CQ(function() {
            $CQ("#signout").bind("click", function() {
                signout('<%= request.getContextPath() %>');
            });

            $CQ("#features-list").unbind("keydown");

            $CQ("#search_input").bind(CQ.Util.getEventName("keypress"),function(event){
                //block the submit event (accessible with the Go key on the iPad keyboard)
                if(window.event) {
                    key = window.event.keyCode;
                } else {
                    key = event.which;
                }

                if(key == 13 || key == 10) {
                    $CQ("search_form").submit();
                }
                return true;
            });

            $CQ("#search_button").bind(CQ.Util.getEventName("click"),function(event){
                $CQ("#search_form").submit();
            });
        })
    </script>
</div>
</body>
</html>