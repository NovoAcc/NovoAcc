<%--
  ==============================================================================

  Include hero area components (Hero Normal, Content Tabs, Sub Navigation, etc.
  TODO -> Separate Hero Normal From Content Tabs

  ==============================================================================

--%>
<%
%>
<%@ page import="com.dupont.phoenix.Global , org.apache.commons.lang.WordUtils" %>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%
    //Properties  for the page....
    //Hero Title Text jcr:content/pageTitle -- Page Property
    //Hero Background Color jcr:content/heroColor -- Page Property ???? How this will be used ....
    
    //Initialize
    String pageTitle= "";
    String heroColor = "";
    String heroColorClass="";
    String dailyNews = "DuPontNews";
    String selector = slingRequest.getRequestPathInfo().getSelectorString();
    // Read the heroColor
    if (null != pageProperties.get("heroColor")){
       heroColor = pageProperties.get("heroColor").toString();
       heroColor="style=\"background-color:#"+heroColor+"\"";
    }
    
    //Read The page title
    if (null != currentPage.getTitle()){
       pageTitle= currentPage.getTitle();
    }
    pageTitle = Global.getTranslatedText(currentPage, slingRequest, dailyNews) + " - " + Global.getTranslatedText(currentPage, slingRequest,WordUtils.capitalize(selector)) ;
    //Declare the Divs
    String strDivMain = "hero-normal-no-tabs-no-image";
    String strDivMainTitle ="hero-normal-title";
    String strDivMainTitleBG ="hero-normal-title-bg";
    heroColorClass = heroColor;
    heroColor="";
%>
   <div id="<%= strDivMain %>" class="group" <%=heroColorClass%>>
    <!--- cqinclude the site saerch component -->
    <cq:include path="SiteSearch" resourceType="/apps/dupont/phoenix/components/search" />
     <div id="<%= strDivMainTitle %>" class="group">            
        <div class="solid padding-left">
               <h2><%= pageTitle %> </h2>
                 <!--- cqinclude the Social Chicklets component -->
                 <cq:include path="socialchannels" resourceType="/apps/dupont/phoenix/components/socialmedia/socialmediachiclets_header" />
        </div>           
        <div id="<%= strDivMainTitleBG %>" <%=heroColor%>>   </div>       
    </div>
</div>