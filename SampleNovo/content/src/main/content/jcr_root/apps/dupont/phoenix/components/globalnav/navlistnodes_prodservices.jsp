<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.day.cq.wcm.api.Page, com.day.cq.wcm.api.PageFilter" %>
<%@ page import="java.util.*" %>
<%@ page import="com.dupont.phoenix.Global"%><%
    String nodeName  =  request.getAttribute("nodeName").toString();
    String nodePath  =  request.getAttribute("nodePath").toString();
    // Read the page reference to the node
    Page nodePage = (Page) request.getAttribute("nodePage");
    // Assuming 2 Nodes and hardcoding the titles
    String nodeChildPageTitle;    
    if (nodePage != null){
        // Iterate  through Child pages and write out the Title and Navigation Path
        Iterator<Page> nodePages = nodePage.listChildren(new PageFilter(request));
		List<Page> pageList = new ArrayList<Page>();        		
        while (nodePages.hasNext()) {
        	pageList.add(nodePages.next());
		}
        int size = pageList.size(); 
       	for(int i=0; i < size; i++) {
       		Page nodeChildPage = pageList.get(i);
            if (i == 0){
            	request.setAttribute("colsToDivideBy", size == 1 ? 4 : 1);
            	nodeChildPageTitle=Global.getTranslatedText(currentPage, slingRequest, size == 1 ? "Featured Brands" : "Views");
            } else {
                request.setAttribute("colsToDivideBy", 3);
            	nodeChildPageTitle=Global.getTranslatedText(currentPage, slingRequest, "Featured Brands");
            }
			request.setAttribute("nodePage",nodeChildPage);
			String nodeChildPageURL= Global.getNavigationURL(slingRequest, nodeChildPage , false);
			%><div class="products_services-col">
                   <h3><%= nodeChildPageTitle %>:</h3>
                   <cq:include script="navlistnodes.jsp"/>
			</div><%
		}


        String landingprodserv = (String) request.getAttribute("prodserviceslandingPath");
        if(landingprodserv!=null && !landingprodserv.equals("")){
            Page landingPage = pageManager.getPage(landingprodserv);
            String landingPageTitle = Global.getNavigationTitle(landingPage);
            String landingPageURL= Global.getNavigationURL(slingRequest, landingPage , false);
            %><div class="landingPageLink"><a href="<%=landingPageURL%>.html"><%=landingPageTitle%></a><%
        } 

        
    }
 %>
 
