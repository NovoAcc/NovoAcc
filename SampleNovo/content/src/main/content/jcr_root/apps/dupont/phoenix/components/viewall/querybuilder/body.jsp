<%--
  Copyright 1997-2009 Day Management AG
  Barfuesserplatz 6, 4001 Basel, Switzerland
  All Rights Reserved.

  This software is the confidential and proprietary information of
  Day Management AG, ("Confidential Information"). You shall not
  disclose such Confidential Information and shall use it only in
  accordance with the terms of the license agreement you entered into
  with Day.

  ==============================================================================

  Geometrixx DAM Asset Share Body Script of the Query Builder Component

  ==============================================================================

--%><%@ page import="org.apache.sling.api.SlingException,
					 com.day.cq.wcm.api.designer.Style,
					 com.dupont.phoenix.GlobalConstants,
                     com.day.cq.wcm.api.WCMMode,com.day.cq.wcm.api.Page"
%><%@include file="/libs/foundation/global.jsp"%><%

    String textResults = properties.get("textResults", "Results");
    String textPage = properties.get("textPage", "Page");
    String textOf = properties.get("textOf", "of");

    String feedUrl = properties.get("feedUrl", "/bin/querybuilder.feed");
    String limit = properties.get("limit", String.class);
    if(limit==null) {
		//try to use site config property
    	Style siteConfigViewAllProps = currentDesign.getStyle("siteconfig/viewallfacets");
		if(siteConfigViewAllProps!=null) {
			limit = siteConfigViewAllProps.get("limit","10");
		}
    }

    Page targetFolder = currentPage.getAbsoluteParent(2);
	String targetFolderPath = targetFolder.getPath();

	String[] pageTags = currentPage.getProperties().get("pageTag", String[].class);
	String pageTag = pageTags!=null? pageTags[0]: "";

	String selectors[] = slingRequest.getRequestPathInfo().getSelectors();
	String contentType =  selectors != null & selectors.length > 1 ? selectors[1] : "";
	
    String[] types = properties.get("type", String[].class);
    if (types == null) {
        types = new String[]{"cq:Page"};
    }
    String actionsTitle = properties.get("actionsTitle", "Actions");
    String editorPath = properties.get("editorPath", "./asseteditor");
    try {
        if (editorPath.indexOf(".") == 0) {
            // relative path
            editorPath = resource.getResourceResolver().getResource(currentPage.adaptTo(Resource.class), editorPath).getPath();
        }
        else {
            // absolute path
            editorPath = resource.getResourceResolver().getResource(editorPath).getPath();
        }
    }
    catch (Exception e) {
        // editor does not exist
        editorPath = null;
    }
    if (editorPath == null) editorPath = "";

    // disabled for 5.3 load 13
//    String topPredicatesHeight = properties.get("topPredicatesHeight", null);
    String topPredicatesHeight = null;
    if (topPredicatesHeight != null) {
        // default of 100px is set in static.css
%><style type="text/css">
    .assetshare .top-predicates .section {
        height:<%= topPredicatesHeight %>px;
    }

</style><%
    }
%><table class="wrapper"><tbody>

    <%-- grey bar containing text search field, paging and lens buttons --%>
    <tr><td colspan="2" class="line_gray" id="prebar"></td></tr>
    <tr><td colspan="2" class="bar-cell">
        <table class="bar"><tbody><tr>

            <td id="fulltext-cell"></td>

            <%--todo: text (results/page of) from content--%>
            <td id="results-cell" style="visibility:hidden;"><span id="results"></span>&nbsp;<%= textResults %></td>

            <td id="paging-cell">
                <%-- wrapper is required in IE (display does not work properly with the cell) --%>
                <span id="paging-wrapper" style="display:none;">
                    <span id="backward" onclick="CQ.search.Util.getQueryBuilder().lastPage();">&laquo;</span><!--
                    -->&nbsp;<%= textPage %>&nbsp;<span id="current-page"></span>&nbsp;<%= textOf %>&nbsp;<span id="total-pages"></span><!--
                    -->&nbsp;<span id="forward" onclick="CQ.search.Util.getQueryBuilder().nextPage();">&raquo;</span>
                </span>
            </td>

            <td class="buttons-cell">
                <%-- render lenses parsys here and use buttons as editables--%>
                <script type="text/javascript">
                    CQ.Ext.onLoad(function() {
                        var data = {
                            "xtype": "lensdeck",
                            "cls": "lensdeck",
                            "renderTo": "lensdeck-wrapper",
                            "id": "lensdeck"
                        };
                        //CQ.dam.Util.setAssetEditorPath("<%= editorPath %>");
                        CQ.search.Util.setLensContainer(CQ.Util.build(data));
                        //CQ.search.Util.setDblClickAction(CQ.dam.Util.resultDblClick);
                    });

                </script>
                <div class="lenses">
                	<div class="list section">                	
       					<cq:include path="../lenses/list" resourceType="dupont/phoenix/components/viewall/lenses/list" />
       				</div>	                
                	<div class="mosaic section">                	
	       				<cq:include path="../lenses/mosaic" resourceType="dupont/phoenix/components/viewall/lenses/mosaic" />
					</div>
				</div>       				                
            </td>
        </tr></tbody></table>
    </td></tr>
    <tr><td colspan="2" class="line postbar"></td></tr>

    <tr>
        <td class="left-cell">
            <%-- predicates are rendered one by one (ext) >> hide to render and display onload (see below) --%>
            <div id="left-cell-content" style="display:none;">
                <div class="left-predicates">
	                <div class="left">
	                	<div class="options">
                    		<cq:include path="left/options" resourceType="dupont/phoenix/components/viewall/predicates/options" />
                    	</div>
                    </div>	
                </div>
            </div>
        </td>
        <td class="lensdeck-cell">
            <%-- lenses will be rendered into lensdeck-wrapper--%>
            <div id="lensdeck-wrapper" class="lensdeck-wrapper"></div>
        </td>
    </tr>

</tbody></table>
<script type="text/javascript">

    CQ.Ext.onLoad(function() {

        document.getElementById("left-cell-content").style.display = "";

        // initialize DAM specific base params
        var qb = CQ.search.Util.getQueryBuilder();

        <%
                if (limit != null && limit.length() > 0) {
                    %>qb.setLimit("<%= limit %>");<%
                }

                %>qb.setPaths([<%
                  String path = targetFolderPath;
                  if (path.startsWith(".")) {
                      path = resource.getResourceResolver().getResource(currentPage.adaptTo(Resource.class),targetFolderPath).getPath();
                  }
                  %>"<%= path.replaceAll("\"", "\\\\\"") %>"<%
                %>]);

                qb.setTypes([<%
                for (int i = 0; i < types.length; i++) {
                    %><%= i != 0 ? "," : "" %>"<%= types[i] %>"<%
                }
                %>]);

        qb.on("loadResult", function(result) {
            document.getElementById("results").innerHTML = result.total;
            document.getElementById("results-cell").style.visibility = "visible";

            if (qb.totalPages > 1) {
                document.getElementById("current-page").innerHTML = qb.currentPage;
                document.getElementById("total-pages").innerHTML = qb.totalPages;

                document.getElementById("backward").style.visibility = qb.currentPage == 1 ? "hidden" : "visible";
                document.getElementById("forward").style.visibility = qb.currentPage == qb.totalPages ? "hidden" : "visible";

                document.getElementById("paging-wrapper").style.display = "inline";
            }
            else {
                document.getElementById("paging-wrapper").style.display = "none";
            }
        });

        // add fulltext search field
        /*
        qb.addField({
            "xtype": "trigger",
            "name": "fulltext",
            "cls": "fulltextField",
            "renderTo": "fulltext-cell",
            "width": 281,
            "triggerClass": "x-form-search-trigger",
            "onTriggerClick": function() {
                CQ.search.Util.getQueryBuilder().submit();
            },
            "listeners": {
                "specialkey": function(field, e) {
                    if (e.getKey() == CQ.Ext.EventObject.ENTER) {
                        CQ.search.Util.getQueryBuilder().submit();
                    }
                }
            }
        });
		*/
		
        // param to not find sub assets
        //qb.addHidden("mainasset", "true");

		qb.addHidden("tagid", "<%=pageTag%>");
		qb.addHidden("tagid.property", "jcr:content/@cq:tags");
    
		qb.addHidden("property", "jcr:content/contentType");
		qb.addHidden("property.1_value", "<%=contentType%>");
		<%if(contentType!=null && contentType.equals(GlobalConstants.ARTICLE_CONTENT_TYPE_NAME)) {%>
			qb.addHidden("property.2_value", "<%=GlobalConstants.CORPORATE_CONTENT_DETAIL_CONTENT_TYPE_NAME%>");
		<%}%>
		// hit writer configuration
        qb.addHidden("p.hitwriter", "full");
        qb.addHidden("p.nodedepth", "4");

        qb.addHidden("orderby", "path");

        // enable RSS link in the header for cooliris support
        //qb.setRssLinkUrl("/bin/querybuilder.feed");

        // initial submit
        CQ.search.Util.getQueryBuilder().submit();
    });
</script>
<!--
<link title="Media RSS (CQ5)" rel="alternate" type="application/atom+xml" href="<%= feedUrl %>?cookie=cq-mrss&p.limit=-1&path=%2Fcontent%2Fdam&type=dam:Asset&mainasset=true"/>
 -->
