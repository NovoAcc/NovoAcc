<%--
  ==============================================================================

  Includes header, content, and footer jsps.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
	<%@ page 
		import="com.dupont.phoenix.tools.BaseballCard,com.day.cq.wcm.api.WCMMode,
		com.dupont.phoenix.commons.Scene7Image"%>
	<%
	 // Include the widgets only on Author Mode
	if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
	 %> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
	 <% } %>
<div class="author">
<div class="bbcardwireframe">
	<div class="info">
	Title: ${properties.baseballCardTitle } <br />
	Description: ${properties.baseballCardShortDescription }
	</div>
	<% 
		Scene7Image image = new Scene7Image(resource,"image", slingRequest);
	   	image.setSelector(".img");
	   	image.draw(out);
	%> <br />
	<div style="clear:both;"/>
</div>
</div>
</div>

