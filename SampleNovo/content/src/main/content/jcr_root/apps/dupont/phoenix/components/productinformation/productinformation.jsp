<%--

  Product Information Component component.

  Product Information Component

--%> 
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="org.json.JSONObject,org.json.JSONException"%>
<%@ page import="com.dupont.phoenix.*" %>
<%@ page import="com.day.cq.i18n.I18n, java.util.List,com.dupont.phoenix.list.ListItem, com.day.cq.wcm.foundation.Image " %>
<%@ page import="com.day.cq.wcm.api.WCMMode,java.util.ResourceBundle"%>
<%@ page import="com.day.cq.wcm.api.WCMMode"%>
<%
 // Include the widgets only on Author Mode
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
 %> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
 <% } %>
 
 
<%--   Get a value of linktext and linkurl for both column from node as an Array and check null value.
      As per assign Array length ,set it into firstcolumn and secondcolumn variable . 
--%>
<% //final I18n i18n = new I18n(slingRequest); %>

<% 

  //intialise variable 
  int firstColumnCount = 0;
  int secondColumnCount = 0;
  int thirdColumnCount = 0;

  String firstColumnTitle = "";
  String secondColumnTitle = "";
  String thirdColumnTitle = "";
  
  String firstColumnDiv = "";
  String firstColumnDivEnd = "";  
  String secondColumnDiv = "";
  String secondColumnDivEnd = ""; 
  String thirdColumnDiv = "";
  String thirdColumnDivEnd = "";  

  int firstColumnFirstUlLimit = 0;
  int firstColumnSecondUlLimit = 0;
  int secondColumnFirstUlLimit = 0;
  int secondColumnSecondUlLimit = 0;
  int thirdColumnFirstUlLimit = 0;
  int thirdColumnSecondUlLimit = 0;

  int thresholdLimit = 4;

  //String firstColumnItems[]= properties.get("firstColumnItems",String[].class);
  //String secondColumnItems[]= properties.get("secondColumnItems",String[].class);
  String firstGroupItems[]= properties.get("firstColumnItems",String[].class);
  String secondGroupItems[]= properties.get("secondColumnItems",String[].class);

  String componentTitle=Global.getTranslatedText(currentPage, slingRequest,"Product Information");
  String firstGroupTitle=Global.getTranslatedText(currentPage, slingRequest,"Product Specification");
  String secondGroupTitle=Global.getTranslatedText(currentPage, slingRequest,"Additional Information");


  String showAll=Global.getTranslatedText(currentPage, slingRequest,"Show All");
  String showLess=Global.getTranslatedText(currentPage, slingRequest,"Show Less");

 // String componentTitle=i18n.get("Product Information");
 // String firstGroupTitle=i18n.get("Product Specification");
 // String secondGroupTitle=i18n.get("Additional Information");

  //request.setAttribute("secondColumnItemslength","0");
  request.setAttribute("secondGroupItemslength","0");
  //request.setAttribute("firstColumnItemslength","0");
  request.setAttribute("firstGroupItemslength","0");

  request.setAttribute("showAll",showAll);
  request.setAttribute("showLess",showLess);


  if(properties.get("firstColumnItems",null)!=null){
    request.setAttribute("firstGroupItemslength",firstGroupItems.length);
  }  

  if(properties.get("secondColumnItems",null)!=null){
      request.setAttribute("secondGroupItemslength",secondGroupItems.length);
  }

  String[] firstColumnFirstUlItems = new String[0];
  String[] firstColumnSecondUlItems = new String[0]; 
  String[] secondColumnFirstUlItems = new String[0];
  String[] secondColumnSecondUlItems = new String[0];
  String[] thirdColumnFirstUlItems = new String[0];
  String[] thirdColumnSecondUlItems = new String[0];

//final ResourceBundle resourceBundle = slingRequest.getResourceBundle(currentPage.getLanguage(true)); 
PIMHelper pimHelper= new PIMHelper (currentPage, resource);
Boolean rowCalloutActivated = pimHelper.isCalloutActive();
String selectedTool = properties.containsKey("selectedTool") ? properties.get("selectedTool",String.class) : null;
ListItem calloutListItem = pimHelper.getCalloutItem();
%>
 
<%--Set the boolean value of includetool into variable includetool--%>
<c:set var="checkIncludeTool" value="${properties.showHideRowCallout}" />


        <c:choose>
            <%--If first group item is not empty and second group item is empty and Tool is included --%>
            <c:when test="${firstGroupItemslength>0 && secondGroupItemslength<=0 && empty checkIncludeTool}">
                <%
                    firstColumnCount = firstGroupItems.length/2 + firstGroupItems.length%2;
                    secondColumnCount = firstGroupItems.length - firstColumnCount;
                    firstColumnTitle = "<h2>" + firstGroupTitle+ " (" + firstGroupItems.length + ")" +"</h2>";
                    firstColumnDiv = "<div class='prod-info group'>"; secondColumnDivEnd = "</div>";  
     
                    firstColumnFirstUlLimit = (firstColumnCount<=thresholdLimit) ? firstColumnCount : thresholdLimit ;
                    firstColumnSecondUlLimit = (firstColumnCount<=thresholdLimit) ? 0 : firstColumnCount-firstColumnFirstUlLimit;

                    secondColumnFirstUlLimit = (secondColumnCount<=thresholdLimit) ? secondColumnCount : thresholdLimit ;
                    secondColumnSecondUlLimit = (secondColumnCount<=thresholdLimit) ? 0 : secondColumnCount-secondColumnFirstUlLimit;

                    if (firstColumnFirstUlLimit > 0) firstColumnFirstUlItems = new String[firstColumnFirstUlLimit];
                    if (firstColumnSecondUlLimit > 0) firstColumnSecondUlItems = new String[firstColumnSecondUlLimit]; 
                    if (secondColumnFirstUlLimit > 0) secondColumnFirstUlItems = new String[secondColumnFirstUlLimit];
                    if (secondColumnSecondUlLimit > 0) secondColumnSecondUlItems = new String[secondColumnSecondUlLimit]; 
                                                                       
                    for (int counter=0; counter<firstColumnFirstUlLimit; counter++)  {
                        firstColumnFirstUlItems[counter] = firstGroupItems[counter];
                    }
                                                        
                    for (int counter=0; counter<firstColumnSecondUlLimit; counter++) {
                        firstColumnSecondUlItems[counter] = firstGroupItems[firstColumnFirstUlLimit+counter];                                        
                    }

                    for (int counter=0; counter<secondColumnFirstUlLimit; counter++)  {
                        secondColumnFirstUlItems[counter] = firstGroupItems[firstColumnCount+counter];
                    }
                                                        
                    for (int counter=0; counter<secondColumnSecondUlLimit; counter++) {
                        secondColumnSecondUlItems[counter] = firstGroupItems[firstColumnCount+secondColumnFirstUlLimit+counter];       
                    }
                %>
            </c:when>
            <%--If first group item is not empty and second group item is empty and Tool is not included --%>
            <c:when test="${firstGroupItemslength>0 && secondGroupItemslength<=0 && not empty checkIncludeTool}">
                <%  
                    firstColumnCount = firstGroupItems.length/3 + (firstGroupItems.length%3)/2 + (firstGroupItems.length%3)%2;
                    secondColumnCount = firstGroupItems.length/3 + (firstGroupItems.length%3)/2;
                    thirdColumnCount = firstGroupItems.length - firstColumnCount - secondColumnCount;
                    firstColumnTitle = "<h2>" + firstGroupTitle+ " (" + firstGroupItems.length + ")" +"</h2>";
                    firstColumnDiv = "<div class='prod-info group'>";thirdColumnDivEnd = "</div>"; 

                    firstColumnFirstUlLimit = (firstColumnCount<=thresholdLimit) ? firstColumnCount : thresholdLimit ;
                    firstColumnSecondUlLimit = (firstColumnCount<=thresholdLimit) ? 0 : firstColumnCount-firstColumnFirstUlLimit;

                    secondColumnFirstUlLimit = (secondColumnCount<=thresholdLimit) ? secondColumnCount : thresholdLimit ;
                    secondColumnSecondUlLimit = (secondColumnCount<=thresholdLimit) ? 0 : secondColumnCount-secondColumnFirstUlLimit;

                    thirdColumnFirstUlLimit = (thirdColumnCount<=thresholdLimit) ? thirdColumnCount : thresholdLimit ;
                    thirdColumnSecondUlLimit = (thirdColumnCount<=thresholdLimit) ? 0 : thirdColumnCount-thirdColumnFirstUlLimit;

                    if (firstColumnFirstUlLimit > 0) firstColumnFirstUlItems = new String[firstColumnFirstUlLimit];
                    if (firstColumnSecondUlLimit > 0) firstColumnSecondUlItems = new String[firstColumnSecondUlLimit]; 
                    if (secondColumnFirstUlLimit > 0) secondColumnFirstUlItems = new String[secondColumnFirstUlLimit];
                    if (secondColumnSecondUlLimit > 0) secondColumnSecondUlItems = new String[secondColumnSecondUlLimit]; 
                    if (thirdColumnFirstUlLimit > 0) thirdColumnFirstUlItems = new String[thirdColumnFirstUlLimit];
                    if (thirdColumnSecondUlLimit > 0) thirdColumnSecondUlItems = new String[thirdColumnSecondUlLimit];
                    
                    for (int counter=0; counter<firstColumnFirstUlLimit; counter++)  {
                        firstColumnFirstUlItems[counter] = firstGroupItems[counter];
                    }
                                                        
                    for (int counter=0; counter<firstColumnSecondUlLimit; counter++) {
                        firstColumnSecondUlItems[counter] = firstGroupItems[firstColumnFirstUlLimit+counter];                                        
                    }

                    for (int counter=0; counter<secondColumnFirstUlLimit; counter++)  {
                        secondColumnFirstUlItems[counter] = firstGroupItems[firstColumnCount+counter];
                    }
                                                        
                    for (int counter=0; counter<secondColumnSecondUlLimit; counter++) {
                        secondColumnSecondUlItems[counter] = firstGroupItems[firstColumnCount+secondColumnFirstUlLimit+counter];       
                    }

                    for (int counter=0; counter<thirdColumnFirstUlLimit; counter++)  {
                        thirdColumnFirstUlItems[counter] = firstGroupItems[firstColumnCount+secondColumnCount+counter];
                    }
                                                        
                    for (int counter=0; counter<thirdColumnSecondUlLimit; counter++) {
                        thirdColumnSecondUlItems[counter] = firstGroupItems[firstColumnCount+secondColumnCount+thirdColumnFirstUlLimit+counter];       
                    }
                %>
            </c:when>
            <%--If first group item is empty and second group item is not empty and Tool is included --%>
            <c:when test="${firstGroupItemslength<=0 && secondGroupItemslength>0 && empty checkIncludeTool}">
                <%
                    firstColumnCount = secondGroupItems.length/2 + secondGroupItems.length%2;
                    secondColumnCount = secondGroupItems.length - firstColumnCount;
                    firstColumnTitle = "<h2>"+secondGroupTitle + " (" + secondGroupItems.length + ")"+"</h2>";
                    firstColumnDiv = "<div class='prod-info group'>";secondColumnDivEnd = "</div>"; 

                    firstColumnFirstUlLimit = (firstColumnCount<=thresholdLimit) ? firstColumnCount : thresholdLimit ;
                    firstColumnSecondUlLimit = (firstColumnCount<=thresholdLimit) ? 0 : firstColumnCount-firstColumnFirstUlLimit;

                    secondColumnFirstUlLimit = (secondColumnCount<=thresholdLimit) ? secondColumnCount : thresholdLimit ;
                    secondColumnSecondUlLimit = (secondColumnCount<=thresholdLimit) ? 0 : secondColumnCount-secondColumnFirstUlLimit;

                    if (firstColumnFirstUlLimit > 0) firstColumnFirstUlItems = new String[firstColumnFirstUlLimit];
                    if (firstColumnSecondUlLimit > 0) firstColumnSecondUlItems = new String[firstColumnSecondUlLimit]; 
                    if (secondColumnFirstUlLimit > 0) secondColumnFirstUlItems = new String[secondColumnFirstUlLimit];
                    if (secondColumnSecondUlLimit > 0) secondColumnSecondUlItems = new String[secondColumnSecondUlLimit];
                    
                    for (int counter=0; counter<firstColumnFirstUlLimit; counter++)  {
                        firstColumnFirstUlItems[counter] = secondGroupItems[counter];
                    }
                                                        
                    for (int counter=0; counter<firstColumnSecondUlLimit; counter++) {
                        firstColumnSecondUlItems[counter] = secondGroupItems[firstColumnFirstUlLimit+counter];                                        
                    }

                    for (int counter=0; counter<secondColumnFirstUlLimit; counter++)  {
                        secondColumnFirstUlItems[counter] = secondGroupItems[firstColumnCount+counter];
                    }
                                                        
                    for (int counter=0; counter<secondColumnSecondUlLimit; counter++) {
                        secondColumnSecondUlItems[counter] = secondGroupItems[firstColumnCount+secondColumnFirstUlLimit+counter];       
                    }
                %>
            </c:when>
            <%--If first group item is empty and second group item is not empty and Tool is not included --%>
            <c:when test="${firstGroupItemslength<=0 && secondGroupItemslength>0 && not empty checkIncludeTool}">
                <%
                    firstColumnCount = secondGroupItems.length/3 + (secondGroupItems.length%3)/2 + (secondGroupItems.length%3)%2;
                    secondColumnCount = secondGroupItems.length/3 + (secondGroupItems.length%3)/2;
                    thirdColumnCount = secondGroupItems.length - firstColumnCount - secondColumnCount;
                    firstColumnTitle = "<h2>"+secondGroupTitle + " (" + secondGroupItems.length + ")"+"</h2>";
                    firstColumnDiv = "<div class='prod-info group'>";thirdColumnDivEnd = "</div>";

                    firstColumnFirstUlLimit = (firstColumnCount<=thresholdLimit) ? firstColumnCount : thresholdLimit ;
                    firstColumnSecondUlLimit = (firstColumnCount<=thresholdLimit) ? 0 : firstColumnCount-firstColumnFirstUlLimit;

                    secondColumnFirstUlLimit = (secondColumnCount<=thresholdLimit) ? secondColumnCount : thresholdLimit ;
                    secondColumnSecondUlLimit = (secondColumnCount<=thresholdLimit) ? 0 : secondColumnCount-secondColumnFirstUlLimit;

                    thirdColumnFirstUlLimit = (thirdColumnCount<=thresholdLimit) ? thirdColumnCount : thresholdLimit ;
                    thirdColumnSecondUlLimit = (thirdColumnCount<=thresholdLimit) ? 0 : thirdColumnCount-thirdColumnFirstUlLimit;

                    if (firstColumnFirstUlLimit > 0) firstColumnFirstUlItems = new String[firstColumnFirstUlLimit];
                    if (firstColumnSecondUlLimit > 0) firstColumnSecondUlItems = new String[firstColumnSecondUlLimit]; 
                    if (secondColumnFirstUlLimit > 0) secondColumnFirstUlItems = new String[secondColumnFirstUlLimit];
                    if (secondColumnSecondUlLimit > 0) secondColumnSecondUlItems = new String[secondColumnSecondUlLimit]; 
                    if (thirdColumnFirstUlLimit > 0) thirdColumnFirstUlItems = new String[thirdColumnFirstUlLimit];
                    if (thirdColumnSecondUlLimit > 0) thirdColumnSecondUlItems = new String[thirdColumnSecondUlLimit];
                    
                    for (int counter=0; counter<firstColumnFirstUlLimit; counter++)  {
                        firstColumnFirstUlItems[counter] = secondGroupItems[counter];
                    }
                                                        
                    for (int counter=0; counter<firstColumnSecondUlLimit; counter++) {
                        firstColumnSecondUlItems[counter] = secondGroupItems[firstColumnFirstUlLimit+counter];                                        
                    }

                    for (int counter=0; counter<secondColumnFirstUlLimit; counter++)  {
                        secondColumnFirstUlItems[counter] = secondGroupItems[firstColumnCount+counter];
                    }
                                                        
                    for (int counter=0; counter<secondColumnSecondUlLimit; counter++) {
                        secondColumnSecondUlItems[counter] = secondGroupItems[firstColumnCount+secondColumnFirstUlLimit+counter];       
                    }

                    for (int counter=0; counter<thirdColumnFirstUlLimit; counter++)  {
                        thirdColumnFirstUlItems[counter] = secondGroupItems[firstColumnCount+secondColumnCount+counter];
                    }
                                                        
                    for (int counter=0; counter<thirdColumnSecondUlLimit; counter++) {
                        thirdColumnSecondUlItems[counter] = secondGroupItems[firstColumnCount+secondColumnCount+thirdColumnFirstUlLimit+counter];       
                    }
                %>
            </c:when>
            <%--If first group item is not empty and second group item is also not empty and Tool is included --%>
            <c:when test="${firstGroupItemslength>0 && secondGroupItemslength>0 && empty checkIncludeTool}">
                <%
                    firstColumnCount = firstGroupItems.length;
                    secondColumnCount = secondGroupItems.length;
                    firstColumnTitle ="<h2>"+ firstGroupTitle + " (" + firstGroupItems.length + ")"+"</h2>";
                    secondColumnTitle = "<h2>" +secondGroupTitle + " (" + secondGroupItems.length + ")"+"</h2>";
                    firstColumnDiv = "<div class='prod-info group'>"; firstColumnDivEnd = "</div>";  
                    secondColumnDiv = "<div class='prod-info group'>"; secondColumnDivEnd = "</div>";  

                    firstColumnFirstUlLimit = (firstColumnCount<=thresholdLimit) ? firstColumnCount : thresholdLimit ;
                    firstColumnSecondUlLimit = (firstColumnCount<=thresholdLimit) ? 0 : firstColumnCount-firstColumnFirstUlLimit;

                    secondColumnFirstUlLimit = (secondColumnCount<=thresholdLimit) ? secondColumnCount : thresholdLimit ;
                    secondColumnSecondUlLimit = (secondColumnCount<=thresholdLimit) ? 0 : secondColumnCount-secondColumnFirstUlLimit;

                    if (firstColumnFirstUlLimit > 0) firstColumnFirstUlItems = new String[firstColumnFirstUlLimit];
                    if (firstColumnSecondUlLimit > 0) firstColumnSecondUlItems = new String[firstColumnSecondUlLimit]; 
                    if (secondColumnFirstUlLimit > 0) secondColumnFirstUlItems = new String[secondColumnFirstUlLimit];
                    if (secondColumnSecondUlLimit > 0) secondColumnSecondUlItems = new String[secondColumnSecondUlLimit]; 
                    
                    for (int counter=0; counter<firstColumnFirstUlLimit; counter++)  {
                        firstColumnFirstUlItems[counter] = firstGroupItems[counter];
                    }
                                                        
                    for (int counter=0; counter<firstColumnSecondUlLimit; counter++) {
                        firstColumnSecondUlItems[counter] = firstGroupItems[firstColumnFirstUlLimit+counter];                                        
                    }

                    for (int counter=0; counter<secondColumnFirstUlLimit; counter++)  {
                        secondColumnFirstUlItems[counter] = secondGroupItems[counter];
                    }
                                                        
                    for (int counter=0; counter<secondColumnSecondUlLimit; counter++) {
                        secondColumnSecondUlItems[counter] = secondGroupItems[secondColumnFirstUlLimit+counter];       
                    }

                %>
            </c:when>
            <%--If first group item is not empty and second group item is also not empty and Tool is not included --%>
            <c:when test="${firstGroupItemslength>0 && secondGroupItemslength>0 && not empty checkIncludeTool}">
                <c:choose>
                    <%--if length of first gruop item is greater than second group item--%>
                    <c:when test="${firstGroupItemslength>=secondGroupItemslength}">
                        <%
                            firstColumnCount = firstGroupItems.length/2 + firstGroupItems.length%2;
                            secondColumnCount = firstGroupItems.length - firstColumnCount;
                            thirdColumnCount = secondGroupItems.length;
                            firstColumnTitle ="<h2>"+  firstGroupTitle + " (" + firstGroupItems.length + ")"+"</h2>";
                            thirdColumnTitle = "<h2>"+secondGroupTitle + " (" + secondGroupItems.length + ")"+"</h2>";
                            firstColumnDiv = "<div class='prod-info group'>";secondColumnDivEnd = "</div>";
                            thirdColumnDiv = "<div class='prod-info group'>";thirdColumnDivEnd = "</div>";    

                            firstColumnFirstUlLimit = (firstColumnCount<=thresholdLimit) ? firstColumnCount : thresholdLimit ;
                            firstColumnSecondUlLimit = (firstColumnCount<=thresholdLimit) ? 0 : firstColumnCount-firstColumnFirstUlLimit;

                            secondColumnFirstUlLimit = (secondColumnCount<=thresholdLimit) ? secondColumnCount : thresholdLimit ;
                            secondColumnSecondUlLimit = (secondColumnCount<=thresholdLimit) ? 0 : secondColumnCount-secondColumnFirstUlLimit;

                            thirdColumnFirstUlLimit = (thirdColumnCount<=thresholdLimit) ? thirdColumnCount : thresholdLimit ;
                            thirdColumnSecondUlLimit = (thirdColumnCount<=thresholdLimit) ? 0 : thirdColumnCount-thirdColumnFirstUlLimit;

                            if (firstColumnFirstUlLimit > 0) firstColumnFirstUlItems = new String[firstColumnFirstUlLimit];
                            if (firstColumnSecondUlLimit > 0) firstColumnSecondUlItems = new String[firstColumnSecondUlLimit]; 
                            if (secondColumnFirstUlLimit > 0) secondColumnFirstUlItems = new String[secondColumnFirstUlLimit];
                            if (secondColumnSecondUlLimit > 0) secondColumnSecondUlItems = new String[secondColumnSecondUlLimit]; 
                            if (thirdColumnFirstUlLimit > 0) thirdColumnFirstUlItems = new String[thirdColumnFirstUlLimit];
                            if (thirdColumnSecondUlLimit > 0) thirdColumnSecondUlItems = new String[thirdColumnSecondUlLimit];
                            
                            for (int counter=0; counter<firstColumnFirstUlLimit; counter++)  {
                                firstColumnFirstUlItems[counter] = firstGroupItems[counter];
                            }
                                                                
                            for (int counter=0; counter<firstColumnSecondUlLimit; counter++) {
                                firstColumnSecondUlItems[counter] = firstGroupItems[firstColumnFirstUlLimit+counter];                                        
                            }

                            for (int counter=0; counter<secondColumnFirstUlLimit; counter++)  {
                                secondColumnFirstUlItems[counter] = firstGroupItems[firstColumnCount+counter];
                            }
                                                                
                            for (int counter=0; counter<secondColumnSecondUlLimit; counter++) {
                                secondColumnSecondUlItems[counter] = firstGroupItems[firstColumnCount+secondColumnFirstUlLimit+counter];       
                            }

                            for (int counter=0; counter<thirdColumnFirstUlLimit; counter++)  {
                                thirdColumnFirstUlItems[counter] = secondGroupItems[counter];
                            }
                                                                
                            for (int counter=0; counter<thirdColumnSecondUlLimit; counter++) {
                                thirdColumnSecondUlItems[counter] = secondGroupItems[thirdColumnFirstUlLimit+counter];       
                            }
                        %>
                    </c:when>
                    <%--if length of second gruop item is greater than first group item--%>
                    <c:otherwise> 
                        <%
                            firstColumnCount = firstGroupItems.length;
                            secondColumnCount = secondGroupItems.length/2 + secondGroupItems.length%2;
                            thirdColumnCount = secondGroupItems.length - secondColumnCount;
                            firstColumnTitle ="<h2>" + firstGroupTitle + " (" + firstGroupItems.length + ")"+"</h2>";
                            secondColumnTitle ="<h2>"+ secondGroupTitle + " (" + secondGroupItems.length + ")"+"</h2>";
                            firstColumnDiv = "<div class='prod-info group'>";firstColumnDivEnd = "</div>";
                            secondColumnDiv = "<div class='prod-info group'>";thirdColumnDivEnd = "</div>"; 

                            firstColumnFirstUlLimit = (firstColumnCount<=thresholdLimit) ? firstColumnCount : thresholdLimit ;
                            firstColumnSecondUlLimit = (firstColumnCount<=thresholdLimit) ? 0 : firstColumnCount-firstColumnFirstUlLimit;

                            secondColumnFirstUlLimit = (secondColumnCount<=thresholdLimit) ? secondColumnCount : thresholdLimit ;
                            secondColumnSecondUlLimit = (secondColumnCount<=thresholdLimit) ? 0 : secondColumnCount-secondColumnFirstUlLimit;

                            thirdColumnFirstUlLimit = (thirdColumnCount<=thresholdLimit) ? thirdColumnCount : thresholdLimit ;
                            thirdColumnSecondUlLimit = (thirdColumnCount<=thresholdLimit) ? 0 : thirdColumnCount-thirdColumnFirstUlLimit;

                            if (firstColumnFirstUlLimit > 0) firstColumnFirstUlItems = new String[firstColumnFirstUlLimit];
                            if (firstColumnSecondUlLimit > 0) firstColumnSecondUlItems = new String[firstColumnSecondUlLimit]; 
                            if (secondColumnFirstUlLimit > 0) secondColumnFirstUlItems = new String[secondColumnFirstUlLimit];
                            if (secondColumnSecondUlLimit > 0) secondColumnSecondUlItems = new String[secondColumnSecondUlLimit]; 
                            if (thirdColumnFirstUlLimit > 0) thirdColumnFirstUlItems = new String[thirdColumnFirstUlLimit];
                            if (thirdColumnSecondUlLimit > 0) thirdColumnSecondUlItems = new String[thirdColumnSecondUlLimit];
      
                            for (int counter=0; counter<firstColumnFirstUlLimit; counter++)  {
                                firstColumnFirstUlItems[counter] = firstGroupItems[counter];
                            }
                                                                
                            for (int counter=0; counter<firstColumnSecondUlLimit; counter++) {
                                firstColumnSecondUlItems[counter] = firstGroupItems[firstColumnFirstUlLimit+counter];                                        
                            }

                            for (int counter=0; counter<secondColumnFirstUlLimit; counter++)  {
                                secondColumnFirstUlItems[counter] = secondGroupItems[counter];
                            }
                                                                
                            for (int counter=0; counter<secondColumnSecondUlLimit; counter++) {
                                secondColumnSecondUlItems[counter] = secondGroupItems[secondColumnFirstUlLimit+counter];       
                            }

                            for (int counter=0; counter<thirdColumnFirstUlLimit; counter++)  {
                                thirdColumnFirstUlItems[counter] = secondGroupItems[secondColumnCount+counter];
                            }
                                                                
                            for (int counter=0; counter<thirdColumnSecondUlLimit; counter++) {
                                thirdColumnSecondUlItems[counter] = secondGroupItems[secondColumnCount+thirdColumnFirstUlLimit+counter];       
                            }
                        %>
                    </c:otherwise>
                </c:choose>
            </c:when>
        </c:choose>

<%-- Output starts here --%>
<%
    if((WCMMode.fromRequest(slingRequest) == WCMMode.EDIT) && (null==firstGroupItems || firstGroupItems.length<=0) && (null==secondGroupItems || secondGroupItems.length<=0)) {
%>
<div class="row-group padding-left">
    PRODUCT INFORMATION COMPONENT
</div>
<% } else if ((null!=firstGroupItems && firstGroupItems.length>=0) || (null!=secondGroupItems && secondGroupItems.length>=0)) { %>
<div class="row group hlm-div-id">
<div class="row group product_information_group">

        <h2 class="row-title"><%= componentTitle%></h2>
      

<% try { %>
        <%--First column started --%>
            <%=firstColumnDiv%>
                <%= firstColumnTitle %>
                <ul> 
                <%
                    for (int firstUlCounter=0; firstUlCounter<firstColumnFirstUlLimit; firstUlCounter++) {
                        //Get a value from ndoe with the help of JASON object in Array and iterate it
                        JSONObject jObject= new JSONObject(firstColumnFirstUlItems[firstUlCounter]);
                        String  linkUrl =jObject.get("linkURL").toString();//jObject.get("linkURL").toString();//xssAPI.getValidHref(jObject.get("linkURL").toString());
                        boolean checkInternalLink=pimHelper.isInternalLink(linkUrl); 
                        if(checkInternalLink==true){linkUrl =(String.format("%s.html",Global.getNavigationURL(slingRequest, linkUrl , false))); }                                         
                        String linkTitle = jObject.get("linkText").toString();
                        String newWindow = jObject.get("openInNewWindow").toString();
                        String mimeType = pimHelper.ContentType(linkUrl);
                        String titleSuffix = ""; 
                        if(null != mimeType) titleSuffix = pimHelper.getTitleSuffix(mimeType);
                        linkTitle = linkTitle + titleSuffix;
                        String target=(newWindow.equals("true")) ? "_blank" : "_self";
                        String linkIconCSS=pimHelper.getLinkIconCSS(mimeType);
                       
                %>
                        <li><a href="<%=linkUrl%>" class="<%=linkIconCSS%>" target="<%=target%>"><%=linkTitle%></a></li>
                <%
                    } 
                %> 
               
                <%
                    for (int secondUlCounter=0; secondUlCounter<firstColumnSecondUlLimit; secondUlCounter++) {
                        //Get a value from ndoe with the help of JASON object in Array and iterate it
                        JSONObject jObject= new JSONObject(firstColumnSecondUlItems[secondUlCounter]);
                        String  linkUrl =jObject.get("linkURL").toString();//xssAPI.getValidHref(jObject.get("linkURL").toString());
                        boolean checkInternalLink=pimHelper.isInternalLink(linkUrl); 
                        if(checkInternalLink==true){linkUrl =(String.format("%s.html",Global.getNavigationURL(slingRequest, linkUrl , false))); }                                           
                        String linkTitle = jObject.get("linkText").toString();
                        String newWindow = jObject.get("openInNewWindow").toString();
                        String mimeType = pimHelper.ContentType(linkUrl); 
                        String titleSuffix = "";
                        if(null != mimeType) titleSuffix = pimHelper.getTitleSuffix(mimeType);
                        linkTitle = linkTitle + titleSuffix;
                        String target=(newWindow.equals("true")) ? "_blank" : "_self";
                        String linkIconCSS=pimHelper.getLinkIconCSS(mimeType);
                %>
                       <li><a href="<%=linkUrl%>" class="<%=linkIconCSS%>" target="<%=target%>"><%=linkTitle%></a></li>
                <%
                    }
                %>  
                </ul>
            <%=firstColumnDivEnd %>
        <%--First column ended --%>
        <%--Second column started --%>
              <%=secondColumnDiv%>
                <%= secondColumnTitle%>
                <ul>
                <%
                    for (int firstUlCounter=0; firstUlCounter<secondColumnFirstUlLimit; firstUlCounter++) {
                        //Get a value from ndoe with the help of JASON object in Array and iterate it
                        JSONObject jObject= new JSONObject(secondColumnFirstUlItems[firstUlCounter]);
                        String  linkUrl =jObject.get("linkURL").toString();//xssAPI.getValidHref(jObject.get("linkURL").toString());  
                        boolean checkInternalLink=pimHelper.isInternalLink(linkUrl); 
                        if(checkInternalLink==true){linkUrl =(String.format("%s.html",Global.getNavigationURL(slingRequest, linkUrl , false))); }                                        
                        String linkTitle = jObject.get("linkText").toString();
                        String newWindow = jObject.get("openInNewWindow").toString();
                        String mimeType = pimHelper.ContentType(linkUrl); 
                        String titleSuffix = "";
                        if(null != mimeType) titleSuffix = pimHelper.getTitleSuffix(mimeType);
                        linkTitle = linkTitle + titleSuffix;
                        String target=(newWindow.equals("true")) ? "_blank" : "_self";
                        String linkIconCSS=pimHelper.getLinkIconCSS(mimeType);
                %>
                       <li><a href="<%=linkUrl%>" class="<%=linkIconCSS%>" target="<%=target%>"><%=linkTitle%></a></li>
                <%
                    }
                %>
              
                <%
                    for (int secondUlCounter=0; secondUlCounter<secondColumnSecondUlLimit; secondUlCounter++) {
                        //Get a value from ndoe with the help of JASON object in Array and iterate it
                        JSONObject jObject= new JSONObject(secondColumnSecondUlItems[secondUlCounter]);
                        String  linkUrl =jObject.get("linkURL").toString();//xssAPI.getValidHref(jObject.get("linkURL").toString()); 
                        boolean checkInternalLink=pimHelper.isInternalLink(linkUrl); 
                        if(checkInternalLink==true){linkUrl =(String.format("%s.html",Global.getNavigationURL(slingRequest, linkUrl , false))); }                                        
                        String linkTitle = jObject.get("linkText").toString();
                        String newWindow = jObject.get("openInNewWindow").toString();
                        String mimeType = pimHelper.ContentType(linkUrl); 
                        String titleSuffix = "";
                        if(null != mimeType) titleSuffix = pimHelper.getTitleSuffix(mimeType);
                        linkTitle = linkTitle + titleSuffix;
                        String target=(newWindow.equals("true")) ? "_blank" : "_self";
                        String linkIconCSS=pimHelper.getLinkIconCSS(mimeType);
                %>
                        <li><a href="<%=linkUrl%>" class="<%=linkIconCSS%>" target="<%=target%>"><%=linkTitle%></a></li>
                <%
                    }
                %> 
                </ul>
           <%=secondColumnDivEnd%>
        <%--Second column ended --%>
        <!-- To display second column items-->
        <c:choose>
            <c:when test="${empty checkIncludeTool}">
               <%--    <div class="prod-info group">
                  <h1> &nbsp <h1>
                 </div>  --%>
                <%-- <li class="prod-info">  --%>
                <%--  <cq:include path="rowcallout" resourceType="dupont/phoenix/components/rowcallout" /> 
                <div class="row-callout"> --%>
                <cq:include script="/apps/dupont/phoenix/components/common/listviews/listrow-with-callout-pim.jsp"/>
           <%--</div> --%>
        <%-- </li> --%> 
            </c:when>
            <c:otherwise> 
                <%--Third column started --%>
                <%=thirdColumnDiv%>
                          <%= thirdColumnTitle%>
                        <ul> 
                        <%   
                            for (int firstUlCounter=0; firstUlCounter<thirdColumnFirstUlLimit; firstUlCounter++) {
                                //Get a value from ndoe with the help of JASON object in Array and iterate it
                                JSONObject jObject= new JSONObject(thirdColumnFirstUlItems[firstUlCounter]);
                                String  linkUrl =jObject.get("linkURL").toString();//xssAPI.getValidHref(jObject.get("linkURL").toString());
                                boolean checkInternalLink=pimHelper.isInternalLink(linkUrl); 
                                if(checkInternalLink==true){linkUrl =(String.format("%s.html",Global.getNavigationURL(slingRequest, linkUrl , false))); }                                           
                                String linkTitle = jObject.get("linkText").toString();
                                String newWindow = jObject.get("openInNewWindow").toString();
                                String mimeType = pimHelper.ContentType(linkUrl); 
                                String titleSuffix = "";
                                if(null != mimeType) titleSuffix = pimHelper.getTitleSuffix(mimeType);
                                linkTitle = linkTitle + titleSuffix;
                                String target=(newWindow.equals("true")) ? "_blank" : "_self";
                                String linkIconCSS=pimHelper.getLinkIconCSS(mimeType);
                            
                         %>
                                <li><a href="<%=linkUrl%>" class="<%=linkIconCSS%>" target="<%=target%>"><%=linkTitle%></a></li>
                        <%
                            }
                        %> 
                     
                        <%
                            for (int secondUlCounter=0; secondUlCounter<thirdColumnSecondUlLimit; secondUlCounter++) {
                                //Get a value from ndoe with the help of JASON object in Array and iterate it
                                JSONObject jObject= new JSONObject(thirdColumnSecondUlItems[secondUlCounter]);
                                String  linkUrl =jObject.get("linkURL").toString();//xssAPI.getValidHref(jObject.get("linkURL").toString());
                                boolean checkInternalLink=pimHelper.isInternalLink(linkUrl); 
                                if(checkInternalLink==true){linkUrl =(String.format("%s.html",Global.getNavigationURL(slingRequest, linkUrl , false))); }                                          
                                String linkTitle = jObject.get("linkText").toString();
                                String newWindow = jObject.get("openInNewWindow").toString();
                                String mimeType = pimHelper.ContentType(linkUrl); 
                                String titleSuffix = "";
                                if(null != mimeType) titleSuffix = pimHelper.getTitleSuffix(mimeType);
                                linkTitle = linkTitle + titleSuffix;
                                String target=(newWindow.equals("true")) ? "_blank" : "_self";
                                String linkIconCSS=pimHelper.getLinkIconCSS(mimeType);
                        %>
                               <li><a href="<%=linkUrl%>" class="<%=linkIconCSS%>" target="<%=target%>"><%=linkTitle%></a></li>
                        <%
                            }
                        %>  
                        </ul>   
                     <%=thirdColumnDivEnd%>
                <%--Third column ended --%>
                </c:otherwise>
        </c:choose>
  <% } catch (Exception e) {log.error(e.getMessage());}
%> 

    <%-- To display Show all to show hide items in both the columns--%>
    <%
        if (firstColumnSecondUlLimit>0 || secondColumnSecondUlLimit>0 || thirdColumnSecondUlLimit>0) {
    %>
            <div class="clr"></div>
            <div class="prod-info group">
                <c:set var="itemTotalCount"  value="${firstGroupItemslength+secondGroupItemslength}"/>
                <a class="showall"><span>${showAll} (${itemTotalCount})</span></a>
                <input type="hidden" value="${showLess}" id="showlessPI" />
             </div>
    <% } %>
    </ul> 
</div>
</div>
<% } %>
