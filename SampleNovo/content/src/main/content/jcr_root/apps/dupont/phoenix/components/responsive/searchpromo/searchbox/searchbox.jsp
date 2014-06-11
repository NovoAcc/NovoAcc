<%@include file="/libs/foundation/global.jsp"%>
<%@ page import="com.dupont.phoenix.Global,com.day.cq.wcm.api.designer.Style" %>
<%@ page import="com.dupont.phoenix.commons.Search,
org.apache.commons.lang.StringEscapeUtils"%>
<%
    String URL = "";
    String searchIndex = "";
    Style searchPromoProp = Global.getSiteConfigStyle(resource).getSubStyle("searchandpromote");
    String keyword = (request.getParameter("q")!=null && !request.getParameter("q").equals("")? new String(request.getParameter("q").getBytes("iso-8859-1"), "UTF-8"):"");

   
    keyword=keyword.replace("\"","\\\"");
    keyword=keyword.replace("<","&lt;");
    keyword=keyword.replace(">","&gt;");


    String countryLang = (request.getParameter("client")!=null && !request.getParameter("client").equals("")?request.getParameter("client"):"");
    String country = countryLang.substring(countryLang.indexOf("_")+1,countryLang.length());
    String pathParam = "";
    //Localization Implementation
    String searchMsg = Global.getTranslatedText(currentPage, slingRequest,"Search");
    String youSearchMsg = Global.getTranslatedText(currentPage, slingRequest,"Your search");
    String inclResultForMsg = Global.getTranslatedText(currentPage, slingRequest,"Including-results-for");
    String uSearchForMsg = Global.getTranslatedText(currentPage, slingRequest,"You-Searched-for");
    String didNotMatchMsg = Global.getTranslatedText(currentPage, slingRequest,"did-not-match-any-documents");
    String noPageFOundMsg = Global.getTranslatedText(currentPage, slingRequest,"No-pages-were-found-containing");
    String suggestionMsg = Global.getTranslatedText(currentPage, slingRequest,"Suggestions");
    String makeSureMsg = Global.getTranslatedText(currentPage, slingRequest,"Make-sure-that-all-words-are-spelled-correctly");
    String tryDiffMsg = Global.getTranslatedText(currentPage, slingRequest,"Try-different-keywords");
    String tryMoreMsg = Global.getTranslatedText(currentPage, slingRequest,"Try-more-general-keywords");
    String ofMsg = Global.getTranslatedText(currentPage, slingRequest,"of");
    String resultMsg = Global.getTranslatedText(currentPage, slingRequest,"results");
    String showingResultsFor = Global.getTranslatedText(currentPage, slingRequest,"Showing results for");

    Search searchUrlIndex = new Search(slingRequest,currentPage,currentDesign);
    
    
    if(keyword != null && !keyword.equals("")){
        pathParam = "q="+keyword;
    }else{
        pathParam = "";
    }
    if(searchPromoProp != null){

        URL =searchUrlIndex.getURL();
        if(searchPromoProp.get("searchIndex", "").contains("="+country)){

            searchIndex = searchUrlIndex.getSearchIndex();

        }else{
            if(!searchPromoProp.get("searchIndex", "").equals("")){
                searchIndex = searchUrlIndex.getSearchIndex()+"&country="+country;

            }else{
                searchIndex = "country="+country;
            }

        }
    }

%>
<cq:includeClientLib categories="apps.dupont.tools.historyjs"/>
<cq:includeClientLib categories="apps.dupont.tools.searchcontroller"/>

<%if(URL != null){ %>
        <div class="search-term"></div>
        <div class="site-search">
            <input class="site-search-box" type="text" value="<%=searchMsg%>" id="q" name="q" onblur="if (this.value=='')this.value=this.defaultValue;" onfocus="if (this.value==this.defaultValue) this.value='';">
                   <input id="SiteSearch_SiteSearch2Button" class="site-search-button" type="submit" value="" name="SiteSearch_SiteSearch2Button" onclick="javascript:searchController.callService('q='+ encodeURIComponent($('#q').val()) );">
        </div>

<%}%>


<script language="javascript">
    $(window).load(function(){

           

            searchController.init({
            "URL" : "<%=URL  %>",
            "searchIndex" : "<%=searchIndex  %>",
            "keyword" : "<%=keyword  %>",
            "countryLang" : "<%=countryLang  %>",
            "country" : "<%=country  %>",
            "pathParam" : "<%=pathParam  %>",
            "searchMsg" : "<%=searchMsg  %>",
            "youSearchMsg" : "<%=youSearchMsg  %>",
            "inclResultForMsg" : "<%=inclResultForMsg  %>",
            "uSearchForMsg" : "<%=uSearchForMsg  %>",
            "didNotMatchMsg" : "<%=didNotMatchMsg  %>",
            "noPageFOundMsg" : "<%=noPageFOundMsg  %>",
            "suggestionMsg" : "<%=suggestionMsg  %>",
            "makeSureMsg" : "<%=makeSureMsg  %>",
            "tryDiffMsg" : "<%=tryDiffMsg  %>",
            "tryMoreMsg" : "<%=tryMoreMsg  %>",
            "ofMsg" : "<%=ofMsg  %>",
            "resultMsg" : "<%=resultMsg  %>",
            "showingResultsFor" : "<%=showingResultsFor  %>",
            "resourceType" : "<%=resource.getResourceType()%>"
           
        });

    });


</script>
