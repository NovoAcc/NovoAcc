<%--
  ==============================================================================

  Includes the scripts and css to be included in the head tag

  ==============================================================================

--%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%
%><%@ page import="java.util.Date,
                   com.day.cq.wcm.api.WCMMode,
                   java.text.SimpleDateFormat,
                   com.day.cq.commons.Doctype,
                   org.apache.commons.lang3.StringEscapeUtils,
                   org.apache.commons.lang3.StringUtils,
                   com.day.cq.wcm.api.designer.Style,
                   com.dupont.phoenix.GlobalConstants" %><%
String xs = Doctype.isXHTML(request) ? "/" : "";

if(!properties.get("cq:lastModified", "").equals("")) {
    SimpleDateFormat sdf = new SimpleDateFormat("d MMM yyyy HH:mm:ss z");
    String date = sdf.format(properties.get("cq:lastModified", Date.class) );
    %><meta http-equiv="Last-Modified" content="<%= StringEscapeUtils.escapeHtml4(date) %>"<%=xs%>><%
}

if(!properties.get("cq:lastModifiedBy", "").equals("")) {
    %><meta name="author" content="<%= StringEscapeUtils.escapeHtml4(properties.get("cq:lastModifiedBy", "")) %>"<%=xs%>><%
}

if(!properties.get("jcr:title", "").equals("")) {
    %><meta name="title" content="<%= StringEscapeUtils.escapeHtml4(properties.get("jcr:title", "")) %>"<%=xs%>><%
}

if(!properties.get("subtitle", "").equals("")) {
    %><meta name="subtitle" content="<%= StringEscapeUtils.escapeHtml4(properties.get("subtitle", "")) %>"<%=xs%>><%
}

if(properties.get("cq:tags", new String[0]).length > 0) {
    %><meta name="tags" content="<%= StringEscapeUtils.escapeHtml4( StringUtils.join(properties.get("cq:tags", new String[0]), ",") ) %>"<%=xs%>><%
}

/**
    Include Typekit 
*/
final Style  general = currentDesign.getStyle("siteconfig/general");
final String typekitId = general!=null ? general.get("typekitId",GlobalConstants.DEFAULT_TYPEKIT_ID) : GlobalConstants.DEFAULT_TYPEKIT_ID;
%><script type="text/javascript">
  (function() {
    var config = {
      kitId: '<%=typekitId%>',
      scriptTimeout: 3000
    };
    var h=document.getElementsByTagName("html")[0];h.className+=" wf-loading";var t=setTimeout(function(){h.className=h.className.replace(/(\s|^)wf-loading(\s|$)/g," ");h.className+=" wf-inactive"},config.scriptTimeout);var tk=document.createElement("script"),d=false;tk.src='//use.typekit.net/'+config.kitId+'.js';tk.type="text/javascript";tk.async="true";tk.onload=tk.onreadystatechange=function(){var a=this.readyState;if(d||a&&a!="complete"&&a!="loaded")return;d=true;clearTimeout(t);try{Typekit.load(config)}catch(b){}};var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(tk,s);
  })();
</script><%

/**
    Include widgets and clone tags functionality only for authoring
*/
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
    %><cq:includeClientLib categories="apps.dupont.widgets"/>
      <!--<cq:include script="clonetags.jsp" /> Dont include server side tag cloning functuinality-->
    <%
}
  
/**
 * Include All DuPont CSS/JS files
*/
%>

<cq:include script="pageclientlib.jsp"/>
<link rel="stylesheet" href="/etc/designs/dupont/phoenix/print.css" type="text/css" media="print"/>

<cq:include script="analytics.eloqua.jsp"/> 



