<%--

  SDKS7 Video Detail component.


--%><%
%><%@include file="/libs/foundation/global.jsp"%>
<%@page session="false" contentType="text/html; charset=utf-8"%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.day.cq.wcm.api.WCMMode,
    			com.day.cq.dam.api.Asset,
            	com.day.cq.dam.scene7.api.Scene7DAMService,
            	org.apache.sling.api.resource.PersistableValueMap" %>
<%
final Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);
String damRef = properties.containsKey("damRef")?properties.get("damRef",""):"";
String title = properties.containsKey("title")?properties.get("title",""):"";
String desc = properties.containsKey("description")?properties.get("description",""):"";

if (damRef != null) {
        Resource assetResource = resourceResolver.getResource(damRef);
        if (assetResource != null) {
            Asset asset = assetResource.adaptTo(Asset.class);
             if (asset != null) {
                Scene7DAMService s7ds = sling.getService(Scene7DAMService.class);
                if (s7ds != null) {
                    String fileReference = s7ds.getS7FileReference(asset);
                        try {
                            if(fileReference!=null)
                            {
                                PersistableValueMap props = resource.adaptTo(PersistableValueMap.class);
                                props.put("fileReference", fileReference);
                                props.save();                                
                            }
                        } catch (Exception e) {
                            log.error("Unable to save fileReference " + fileReference, e);
                        }
                    }
                }
              }
        }
%>

<%      
if (("").equals(damRef) && isEdit)
{ 
%>
<h3>Please curate video URL</h3>
<% } else {
%>
Title: <%=title%> <br/>
Description: <%=desc%> <br/>
File Reference: <%=damRef%> <br/>
<hr>
<%
}
%>