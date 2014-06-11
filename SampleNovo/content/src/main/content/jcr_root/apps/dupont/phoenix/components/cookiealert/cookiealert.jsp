<%--

  Cookie Alert

  Cookie Alert

--%>

<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.dupont.phoenix.Global"%>
<%
    Cookie cookie = null;
    Cookie[] cookies = null;
    cookies = request.getCookies();
    
    String learnMore= Global.getTranslatedText(currentPage, slingRequest,"LearnMore");
    String close=Global.getTranslatedText(currentPage, slingRequest,"Close");

    String msj = "We use cookies on this website. By using this site, you agree that we may store access cookies on your device. ";
    String link = "#";


    if (currentDesign.getStyle("siteconfig/cookiemessage").get("message", String.class) != null){
        msj = currentDesign.getStyle("siteconfig/cookiemessage").get("message").toString();
    }
    if (currentDesign.getStyle("siteconfig/cookiemessage").get("learnmorepath", String.class) != null){
        link = currentDesign.getStyle("siteconfig/cookiemessage").get("learnmorepath").toString();
    }
%>
<div class="cookiealertCont">
    <div class="content_column">
        <div class="cookieleft"><%=msj%></div>
        <div class="cookiright"><a class="cookieagree" href="#"><%=close%></a></div>
    </div>        
</div>
