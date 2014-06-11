<%--
 Contact Us component.
 A component to display an external or internal page link to easily users to navigate to associated Contact Us page.
--%>
<%@ page import="com.day.cq.commons.inherit.*"%>
<%@page import="com.day.cq.wcm.api.WCMMode"%>
<%@ page import="com.day.cq.i18n.I18n"%>
<%@ page import="org.apache.commons.lang.StringUtils"%>
<%@ page import="com.dupont.phoenix.*"%>
<%@ page import="java.util.HashMap,java.util.Map"%>
<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>

<% final I18n i18n = new I18n(slingRequest); %>
<% String link = properties.get("contactPageURL", ""); %>

<%-- If the contactPageURL is not curated, then contactPageURL value use
       inheritance method from pages in parent hierarchy of the current page. --%>

<%  if (link.length() <= 0) {  
                  
      InheritanceValueMap iProperties = new HierarchyNodeInheritanceValueMap(resource);
      link = iProperties.getInherited("contactPageURL",String.class);
                              }
   %>

<%-- 1.Page should be editable in author moode though value of link is null
       2.if the value of link is null,Contact Us link is not available on Publish Page  --%>


<% if((WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)|| (StringUtils.isNotEmpty(link ))) {  %>
 <div class="red-white-button">
    <%-- Use render link method from Global.jsp and “Contact Us” link title using 
           the correct presentation rules and i18N language translation   --%>
                  <%  
                  link=xssAPI.getValidHref(link);
                  boolean checkExternalLink=Global.isExternalLink(link);
                  if(checkExternalLink==false){
                  link =(String.format("%s.html",Global.getNavigationURL(slingRequest, link, false)));}
                 // Map<String,String> map=new HashMap<String, String>();
                 // map.put("href",link );
                 // map.put("class","button red-button");
                  String title=Global.getTranslatedText(currentPage, slingRequest,"Contact Us");
                  String renderedLink = Global.renderLink( link ,"button red-button",title,"button-text",null,null,false,true,title);
                  %>
                  <%= renderedLink %> 
  
 </div>               
     <% } %> 

 





