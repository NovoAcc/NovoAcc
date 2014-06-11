<%--

  Newsletter Archive Component component.

  Newsletter Archive Component

--%>

<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page
    import="com.day.cq.wcm.api.WCMMode,
    org.apache.sling.api.resource.Resource,
    org.apache.sling.api.resource.ResourceResolver,
    java.util.*,
    com.dupont.phoenix.NewsletterArchiveHelper,
    com.dupont.phoenix.hlm.HLMHelper,
    com.dupont.phoenix.list.ListItem, 
    java.util.List,
    com.day.cq.wcm.api.Page,
    java.util.Date,
    java.text.DateFormat,
    java.text.SimpleDateFormat,
    com.dupont.phoenix.Global,
    org.apache.commons.lang.WordUtils
    "%>
<%
ResourceResolver resolver = slingRequest.getResourceResolver();
NewsletterArchiveHelper newsletterArchiveHelper = new NewsletterArchiveHelper(currentPage, resource, slingRequest);
List<ListItem> items = newsletterArchiveHelper.getItems();
String pagePath = null;
pagePath = currentPage.getPath();
String selector = slingRequest.getRequestPathInfo().getSelectorString();
String []months={"january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"};
Date currentDate = new Date();
DateFormat dateFormat = new SimpleDateFormat("MMMM");
String currentMonth=dateFormat.format(currentDate).toString();
int size = items.size();
for(String month : months)
{
String pageMonth = null;

if((selector != null)&&(selector.equals(month)))
{
    pageMonth=selector;   
}
else if(selector == null)
{
    pageMonth=currentMonth;
    String currentMonthLower=currentMonth.toLowerCase();
    String linkPhrase = Global.getNavigationURL(slingRequest, pagePath, false);
    String link = linkPhrase+"."+ currentMonthLower+".html";
    %>
<script>window.location="<%=link%>";</script>
<%}
if((pageMonth != null)&&(month.equalsIgnoreCase(pageMonth)))
{
%>
<div class="results_container group padding-left">
    <%
    String test = WordUtils.capitalize(pageMonth);
    String monthDisplay=WordUtils.capitalize(pageMonth);
    String forDate=monthDisplay.substring(0, 3);
    //out.println(forDate);
%>
    <%-- <h1>Daily News - <%=month.toUpperCase()%></h1>  --%>
    <div class="view_sort_results">
        <div class="view_sort_wrap">
            <div class="pagination_months">
                <ul>
<%      for(String linkMonth : months)
        {
        String linkDisplay=WordUtils.capitalize(linkMonth);
        if(!(linkDisplay.equalsIgnoreCase(pageMonth)))
        {
            String linkUrlPhrase=Global.getNavigationURL(slingRequest, pagePath, false);
            String linkUrl =linkUrlPhrase+"."+linkMonth+".html";
            %>
                    <li><a href="<%=linkUrl%>"> <%= Global.getTranslatedText(currentPage, slingRequest, linkDisplay)%>
                    </a></li>
                    <li>
                        <%if(!linkDisplay.equalsIgnoreCase(Global.getTranslatedText(currentPage, slingRequest,WordUtils.capitalize("december"))))%>|
                    </li>
        <%
                    } else
                    {
        %>
                    <li><%=Global.getTranslatedText(currentPage, slingRequest, linkDisplay)%></li>
                    <li>
                        <%if(!linkDisplay.equalsIgnoreCase(Global.getTranslatedText(currentPage, slingRequest,WordUtils.capitalize("december"))))%>|
                    </li>
    <%
                    }   
        }
    %>
                </ul>
            </div>
        </div>
    </div>
    <div class="row_results">
    <% 
    for(ListItem item : items)
    {
       DateFormat dateFormat1 = new SimpleDateFormat("dd.MMM.yyyy");
       String pageDate=dateFormat1.format(item.getLastModified().getTime()).toString();
       String linkTarget = item.getLinkURL();
       String linkTitle = item.getTitle();
       String externalIconPath="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png";
       String externalIconCSSClass = "cta-arrow";
       if(pageDate.contains(forDate))
       {
           String pageDateDay=pageDate.substring(0, 2);
           String pageDateYear=pageDate.substring(7);
           String pageDateDisplay = monthDisplay+" "+pageDateDay+", "+pageDateYear;%>
        <div class="row">
            <span class="date"> <%=pageDateDisplay%>
            </span>
            <h2><%=Global.renderLink(linkTarget, null, linkTitle,null, externalIconPath, externalIconCSSClass, false,false)%></h2>
            <p>
                <%=item.getShortDesc()%>
            </p>
        </div>
    <%
        }
    }
    %>
    </div>
</div>
<%
}
}
%>

