<%--
  ADOBE CONFIDENTIAL

  Copyright 2012 Adobe Systems Incorporated
  All Rights Reserved.

  NOTICE:  All information contained herein is, and remains
  the property of Adobe Systems Incorporated and its suppliers,
  if any.  The intellectual and technical concepts contained
  herein are proprietary to Adobe Systems Incorporated and its
  suppliers and may be covered by U.S. and Foreign Patents,
  patents in process, and are protected by trade secret or copyright law.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe Systems Incorporated.
--%><%
%><%@page session="false" %><%
%><%@page import="javax.jcr.Session,
                  com.adobe.granite.workflow.collection.util.ResultSet,
                  com.adobe.granite.workflow.exec.InboxItem,
                  com.adobe.granite.workflow.WorkflowException,
                  org.apache.sling.api.resource.ResourceResolver,
                  com.adobe.granite.ui.components.Config,
                  com.adobe.granite.ui.components.AttrBuilder,
                  com.day.cq.i18n.I18n"%><%
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@include file="/libs/cq/workflow/global.jsp"%><%
%><cq:includeClientLib categories="cq.gui.common.popoverlink,cq.gui.common.admin.badge" /><%

    final I18n i18n = new I18n(slingRequest);
    final Config cfg = new Config(resource);
    AttrBuilder attrs = new AttrBuilder(request, xssAPI);

    int itemsToShow = cfg.get("itemCount", 3);
    long size = 0;

    ResourceResolver resolver = slingRequest.getResourceResolver();
    Session session = resolver.adaptTo(Session.class);
    InboxItem[] inboxItems = null;
    try {
        InboxFilter filter = new InboxFilter(session);
        com.adobe.granite.workflow.WorkflowSession graniteWorkflowSession = resolver.adaptTo(com.adobe.granite.workflow.WorkflowSession.class);
        ResultSet<InboxItem> inboxResult = graniteWorkflowSession.getActiveInboxItems(0, itemsToShow, filter);
        inboxItems = inboxResult.getItems();
        size = inboxResult.getTotalSize();
    }
    catch (Exception e) {
        // CQ5-25526
    }
    request.setAttribute("com.adobe.cq.datasource.inboxitems", inboxItems);

    itemsToShow = Math.min(itemsToShow, (int) size);

    String css = "badge";
    if (size < 1) {
        size = 0;
        css += " empty";
    }

    Boolean usePulldown = cfg.get("showPulldown", true);
    if (size == 0) {
        usePulldown = false;
    }

    String notificationsUrl = "/notifications.html";
    String href = notificationsUrl;

    if (usePulldown) {
        href = "#notifications_popover";
        attrs.addOther("toggle", "popover");
        attrs.addOther("point-from", "bottom");
        attrs.addOther("align-from", "right");
    }
    attrs.addClass("notifications");

%>

<a href="<%=href%>" <%= attrs.build() %>><div class="<%= css %>"><%= size %></div></a>
<div id="notifications_popover"  class="popover popoverlink arrow-top">
    <div class="bar">
        <h4><%= i18n.get("Notifications") %></h4>
    </div>
    <ul>
        <cq:include path="<%=resource.getPath()%>" resourceType="cq/gui/components/common/admin/badge/items" />
    </ul>
    <div class="bar">
        <a href="<%=notificationsUrl%>"><%= i18n.get("View all ({0} new)", "link to notification centre", String.valueOf(size)) %></a>
    </div>
</div>

