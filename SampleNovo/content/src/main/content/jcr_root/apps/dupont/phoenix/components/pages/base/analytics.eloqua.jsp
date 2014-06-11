
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.*"%>

<%String elqSetSiteIdValue =Global.getEloquaSiteId(resource);
if(elqSetSiteIdValue != null )
{ 
%> 
   <script type="text/javascript">
    var _elqQ = _elqQ || [];
    _elqQ.push(['elqSetSiteId', '<%=Global.getEloquaSiteId(resource)%>']);
    _elqQ.push(['elqTrackPageView']);
  
      (function () {
       function async_load() {
       var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;
       s.src = '//img.en25.com/i/elqCfg.min.js';
       var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
       }
      if (window.addEventListener) window.addEventListener('DOMContentLoaded', async_load, false);
      else if (window.attachEvent) window.attachEvent('onload', async_load);
      })();
   </script> 
            
<% } %> 