<%--
  ==============================================================================

  Server side Clone tags

  This will clone the tags on page load and not on AJAX as client side (Currently Implemented)

  ==============================================================================

<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%

	Resource rescurrenpage =  resourceResolver.getResource(currentPage.getPath() + "/jcr:content");
    Node node =  rescurrenpage.adaptTo(Node.class);
    String sourcePage = rescurrenpage.adaptTo(ValueMap.class).get("cq:clonepage","");
if(!sourcePage.equals(""))
    {
        String[] strValue;
        Session mySession = slingRequest.getResourceResolver().adaptTo(Session.class);
        Resource res =  resourceResolver.getResource(properties.get("cq:clonepage", "") + "/jcr:content");
    	if(res != null)
        {
            strValue = res.adaptTo(ValueMap.class).get("cq:tags", String[].class);
            node.setProperty("cq:tags", strValue);
            mySession.save();
        }
    }
%>
--%>
