<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.day.cq.wcm.api.WCMMode,
				com.dupont.phoenix.Global,
				java.util.Iterator,
				com.day.cq.wcm.api.PageFilter,
				com.day.cq.wcm.api.Page,
				com.dupont.phoenix.util.PageInfo,
				com.dupont.phoenix.GlobalConstants" %><%
%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><%
%><h2 style="font-size:20px">RWD migration workflow will not upgrade these pages (or skipped these pages during execution of the workflow):</h2><%
Page p = pageManager.getPage(properties.get("pagePath",String.class));
if(Global.isEdit(slingRequest) && p!=null) {
	//show invalid pages for rwd migration
	final Iterator <Page> childIterator = p.listChildren(new PageFilter(false, true), true);
	while(childIterator.hasNext()){
		final Page childPage = (Page)childIterator.next();
        //log.info("child page:"+childPage.getPath()+":"+PageInfo.isRWDCapable(childPage));
		if(!PageInfo.isRWDCapable(childPage)){
            %><p><a target="new" href="<%=childPage.getPath()%>.html"><%=childPage.getTitle()%></a></p><%
		}
    }
}
%>