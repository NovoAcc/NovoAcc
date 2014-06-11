<%--

  Newsletter Archive component.

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
    com.dupont.phoenix.Global"%>
<%
ResourceResolver resolver = slingRequest.getResourceResolver();
NewsletterArchiveHelper newsletterArchiveHelper = new NewsletterArchiveHelper(currentPage, resource);
List<ListItem> items = newsletterArchiveHelper.getItems();
String pagePath = null;
String parentPath = null;
parentPath=currentPage.getParent().getPath();
//out.println(parentPath);
pagePath = currentPage.getPath();
String []pagePathArray=pagePath.split("/");
String pageMonth=pagePathArray[pagePathArray.length-1];
String []months={"january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"};
//out.println(pageMonth);
//out.println(pagePath);
int size = 0;
int index=0;
size=items.size();
//out.println(size);
//out.println(currentPage.getAbsoluteParent(2).getPath().toString());

for(String month : months)
{
//String month=months[i];
if(month.equalsIgnoreCase(pageMonth))

{%>
<div class="results_container group padding-left">
    <%
    String monthDisplay=pageMonth.substring(0, 1).toUpperCase()+ pageMonth.substring(1);
    String forDate=monthDisplay.substring(0, 3);
    //out.println(forDate);
%>
    <%-- <h1>Daily News - <%=month.toUpperCase()%></h1>  --%>
    <div class="view_sort_results">
    <div class="view_sort_wrap">
    <div class="pagination_months">
    <ul>
<%  for(String linkMonth : months)
    {
        //String linkMonth = months[j];
        String linkDisplay=linkMonth.substring(0, 1).toUpperCase()+ linkMonth.substring(1);
        if(!(linkDisplay.equalsIgnoreCase(pageMonth)))
        {
        
            
            String linkUrl=parentPath+"/"+linkMonth+".html";
            /*out.println(linkUrl);*/%>
            <li>
                <a href="<%=linkUrl%>">
                    <%=linkDisplay%> 
                </a>
            </li>
            <li>
                <%if(!linkDisplay.equalsIgnoreCase("december"))%>|
            </li>
        <%}
        else
        {%>
            <li>
                <%=linkDisplay %>
            </li>
            <li>
                <%if(!linkDisplay.equalsIgnoreCase("december"))%>|
            </li>
        <%}   
    }%>
    </ul>
    </div>
    </div>
    </div>
    <div class="row_results">
   <% for(ListItem item : items)
    {
       DateFormat dateFormat1 = new SimpleDateFormat("dd.MMM.yyyy");
       String pageDate=dateFormat1.format(item.getLastModified().getTime()).toString();
       //DateFormat dateFormat2 = new SimpleDateFormat("dd.MM.yyyy");
       String linkTarget = item.getLinkURL();
       String linkTitle = item.getTitle();
       String externalIconPath="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png";
       String externalIconCSSClass = "cta-arrow";
       //String currentTitleLastWord = Global.getTextLastWord(currentTitle);
       //String currentTitleWithoutLastWord  = Global.getTextWithoutLastWord(currentTitle); 
       
       //out.println(pageDate);
       if(pageDate.contains(forDate))
       {
           String pageDateDay=pageDate.substring(0, 2);
           String pageDateYear=pageDate.substring(7);
           String pageDateDisplay = monthDisplay+" "+pageDateDay+", "+pageDateYear;%>
           <div class="row">
               <span class="date">
                   <%=pageDateDisplay%>
               </span>
               <h2><%=Global.renderLink(linkTarget, null, linkTitle,null, externalIconPath, externalIconCSSClass, false,false)%></h2>
               <p>
                   <%=item.getShortDesc()%>
               </p>
           </div>
           
       <%}
    }%>
    </div>
</div>
<%}
}
%>

 