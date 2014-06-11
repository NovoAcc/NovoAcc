<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>

<%@ page import="com.day.cq.wcm.api.Page" %>
<%@ page import="com.day.cq.wcm.api.Page,com.day.cq.wcm.api.PageFilter" %>
<%@ page import="java.lang.Math,java.util.*" %>
<%@ page import="com.dupont.phoenix.Global"%>
<%@ page import="com.dupont.phoenix.GlobalNavListItem"%>
<%@ page import="com.dupont.phoenix.GlobalNavListItemComparator"%>

<%
    String nodeName  =  request.getAttribute("nodeName").toString();
    String nodePath  =  request.getAttribute("nodePath").toString();
     
    // Read the page reference to the node
    Page nodePage = (Page) request.getAttribute("nodePage");

    
    List<GlobalNavListItem> globalNavListItems = new ArrayList<GlobalNavListItem>();
    
    if (nodePage != null){
        // get the child pages ( accounting for hide in nav etc..)
        
        // Iterate  through Child pages and write out the Title and Navigation Path
        Iterator<Page> nodePages = nodePage.listChildren(new PageFilter(request)); 
        
        while (nodePages.hasNext()) {
            Page nodeChildPage = nodePages.next();  
            String nodeChildPageTitle = Global.getNavigationTitle(nodeChildPage );
            String nodeChildPageURL= Global.getNavigationURL(slingRequest, nodeChildPage , false);
            //nodeMap.put(nodeChildPageTitle,nodeChildPageURL);
            GlobalNavListItem newGlobalNavListItem = new GlobalNavListItem ();
            newGlobalNavListItem.setNodeName(nodeChildPageTitle);
            newGlobalNavListItem.setNodePath(nodeChildPageURL);
            globalNavListItems.add(newGlobalNavListItem);
            
         }
        // Only do it for firstnode items
        /*if (nodeName.equals("industrynode")){
        	Collections.sort(globalNavListItems, new GlobalNavListItemComparator());
    	}*/

        
        //Display as per the need
        Integer colsToDivideBy=4;
        colsToDivideBy = (Integer) request.getAttribute("colsToDivideBy");
        
        int totalNodes = globalNavListItems.size();
        //if the total nodes to display is less then cols to display then only display that many cols
        if (totalNodes < colsToDivideBy)
        { 
            colsToDivideBy=totalNodes;
        }
        int nodesToProcess = totalNodes;
        int colsLeftToProcess = colsToDivideBy;
        int listIndex = -1;
     
        for (int i=0; i<colsToDivideBy; i++)
        {
            //Find out how many to dispaly in this column
            int nodesToDisplayInThisCol=  (int)Math.ceil((double)nodesToProcess /colsLeftToProcess );
            %>
            <ul class="sub_menu">
                <!--How many Total Nodes: <%=totalNodes %>
                How many Total Cols: <%=colsToDivideBy %>              
                Current I: <%=i%>
                How many Nodes in Col: <%=nodesToDisplayInThisCol%>-->
                <%  
                for (int j=0; j<nodesToDisplayInThisCol; j++) {
                    listIndex =  listIndex +1;
                    if (listIndex  < totalNodes ) {
                        GlobalNavListItem newGlobalNavListItemAgain = globalNavListItems.get(listIndex);
                        %><li><a href="<%=newGlobalNavListItemAgain.getNodePath()%>.html"><%=newGlobalNavListItemAgain.getNodeName()%></a></li><%     
                    }
             
                }
                nodesToProcess = nodesToProcess - nodesToDisplayInThisCol ;
                colsLeftToProcess = colsLeftToProcess -1;
          
            %>
            </ul>
        <%
        }
        if (nodeName.equals("industrynode")) {
            String landingindustry = (String) request.getAttribute("allindustrieslandingPath");
            if (landingindustry != null && !landingindustry.equals("")) {
                Page landingPage = pageManager.getPage(landingindustry);
                String landingPageTitle = Global.getNavigationTitle(landingPage );
                String landingPageURL= Global.getNavigationURL(slingRequest, landingPage , false);
                %><div class="landingPageLink"><a href="<%=landingPageURL%>.html"><%=landingPageTitle%></a><%
            }
            
        } 

        
        %>
    <%

    }
    %>
    