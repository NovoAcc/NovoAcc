<%--
  ==============================================================================

  Includes the scripts and css to be included in the head tag

  ==============================================================================

--%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%
%><%@ page import="com.dupont.phoenix.Global"%><%
	final String mapParamName = Global.getStringPropValue(properties,"mapParamName");
	String filterValue = Global.getStringPropValue(properties,"filter");
	String nodeIdValue = Global.getStringPropValue(properties,"nodeId");
    String globalChallengesValue = Global.getStringPropValue(properties, "globalChallengesPath");
	final String[] functions = properties.get("functions",String[].class);
	if(filterValue==null) filterValue = "";
	if(nodeIdValue==null) nodeIdValue = "";
    if(globalChallengesValue==null) globalChallengesValue = "";
%>
<%-- Include Mapquest API --%>
<script src="//www.mapquestapi.com/sdk/js/v7.0.s/mqa.toolkit.js?key=Fmjtd%7Cluua296zlu%2Cbs%3Do5-hwznd"></script><%
%><div class="padding-left">
<%if(functions!=null && functions.length > 0) {
	%><ul class="corporate-functions-bullets"><%
	for(int index=0; index < functions.length; index++) {
		%><cq:text value="<%=functions[index] %>" tagName="li"/><%
	}
	%></ul><%
}%><div class="red-white-button">
    	<a href="#MegatrendsMap"class="button red-button megatrend-fancybox"> <span class="button-text"><cq:text property="linkTitle" default="[Link Title]"/></span></a>
    </div>
</div>

<div style="visibility:hidden; margin-left: -9999; position: absolute;">        
    <div id="MegatrendsMap" class="popup-page">            
        <div class="popupContent">
            <div id='map' style='height: 600px; width: 960px'></div>
            <div class='filters'>
                <div class="filterstitle">FILTER THE CHALLENGES BY CATEGORY</div>
                <ul>
                    <li><input id="filter_food" type="checkbox" checked="checked" onclick="return redraw();">&nbsp;Food<img alt="Food Icon" src="/etc/designs/dupont/tools/megatrends/source/images/imglegendgreen.png"></li>
                    <li><input id="filter_energy" type="checkbox" checked="checked" onclick="return redraw();">&nbsp;Energy<img alt="Fuel Icon" src="/etc/designs/dupont/tools/megatrends/source/images/imglegendyellow.png"></li>
                    <li><input id="filter_protection" type="checkbox" checked="checked" onclick="return redraw();">&nbsp;Protection<img alt="Protection Icon" src="/etc/designs/dupont/tools/megatrends/source/images/imglegendpurple.png"></li>
                </ul>
            </div>
        </div>
    </div>
</div>

<script>
<%if("nodeid".equalsIgnoreCase(mapParamName)){%>
	var _nodeIdValue="<%=nodeIdValue%>";
	var _filterValue="";
<%} else {%>
	var _nodeIdValue="";
	var _filterValue="<%=filterValue%>";
<%}%>
    var _globalChallengesValue="<%=globalChallengesValue%>";
</script>
<cq:includeClientLib categories="apps.dupont.tools.megatrendsmap"/>
<c:choose>
	<c:when test="${properties.mapbuilder == 'china' }">
		<cq:includeClientLib categories="apps.dupont.tools.megatrendsmap.china"/>
	</c:when>
	<c:otherwise>
		<cq:includeClientLib categories="apps.dupont.tools.megatrendsmap.default"/>
	</c:otherwise>
</c:choose>