<%--

  ADOBE CONFIDENTIAL
  __________________

   Copyright 2011 Adobe Systems Incorporated
   All Rights Reserved.

  NOTICE:  All information contained herein is, and remains
  the property of Adobe Systems Incorporated and its suppliers,
  if any.  The intellectual and technical concepts contained
  herein are proprietary to Adobe Systems Incorporated and its
  suppliers and are protected by trade secret or copyright law.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe Systems Incorporated.

--%><%@ page import="java.util.Collections,
			com.day.cq.search.*,
			com.day.cq.wcm.api.Page,
			com.day.cq.wcm.api.designer.Style,
            com.dupont.phoenix.commons.JsonViewAllFacetsWriter,
            org.apache.sling.commons.json.jcr.JsonItemWriter,
            org.apache.sling.commons.json.io.JSONWriter,
            org.apache.sling.jcr.api.SlingRepository" %><%
%><%@include file="/libs/wcm/global.jsp"%><%

    response.setContentType("application/json");
    response.setCharacterEncoding("utf-8");
	Style siteConfigViewAllProps = currentDesign.getStyle("siteconfig/viewallfacets");
    String[] optionsPaths = properties.get("optionsPath", new String[0]);
    if(optionsPaths.length==0) {
    	//try to use site config property
		if(siteConfigViewAllProps!=null) {
			optionsPaths = siteConfigViewAllProps.get("optionsPath", new String[0]);
		}
    }
    // use admin session, sigh!
    SlingRepository repo = sling.getService(SlingRepository.class);
    String[] sels = slingRequest.getRequestPathInfo().getSelectors();
    String pathSelector = sels.length > 1 ? sels[1] : null;
    Session admin = null;

    Page targetFolder = currentPage.getAbsoluteParent(2);
	String targetFolderPath = targetFolder.getPath();

	String[] pageTags = currentPage.getProperties().get("pageTag", String[].class);
	String pageTag = pageTags!=null? pageTags[0]: "";

	QueryBuilder builder = resource.getResourceResolver().adaptTo(QueryBuilder.class);
    Session session = resource.getResourceResolver().adaptTo(Session.class);
    
    try {
        admin = repo.loginAdministrative(null);

        if (pathSelector == null) {
            out.write("[");
            String delim = "";
        	String selectors[] = slingRequest.getRequestPathInfo().getSelectors();
        	String contentType =  selectors != null & selectors.length > 2 ? selectors[2] : "";
            for (String path: optionsPaths) {
                if (admin.nodeExists(path)) {
                    out.write(delim);
                    Node optionsNode = admin.getNode(path);
                    JsonViewAllFacetsWriter w = new JsonViewAllFacetsWriter(Collections.<String>emptySet());
                    w.dump(optionsNode, new JSONWriter(out), 0, 2, w.search(builder, session, targetFolderPath, pageTag, contentType),path);
                    delim = ",";
                }
            }
            out.write("]");
        } else {
            String path = null;
            try {
                path = optionsPaths[Integer.parseInt(pathSelector)];
            } catch (Exception e) {
                // ignore
            }
        	//log.info("path selector:"+path);
            if (path != null && admin.nodeExists(path)) {
                Node optionsNode = admin.getNode(path);

            	String selectors[] = slingRequest.getRequestPathInfo().getSelectors();
            	String contentType =  selectors != null & selectors.length > 2 ? selectors[2] : "";
                
                JsonViewAllFacetsWriter w = new JsonViewAllFacetsWriter(Collections.<String>emptySet());
				w.dump(optionsNode, new JSONWriter(out), 0, 2, w.search(builder, session, targetFolderPath, pageTag, contentType), path);
            } else {
                out.write("{}");
            }
        }
    } finally {
        if (admin != null) {
            admin.logout();
        }
    }
%>