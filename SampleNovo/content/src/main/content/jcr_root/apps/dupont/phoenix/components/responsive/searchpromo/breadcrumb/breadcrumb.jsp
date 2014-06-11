<%@include file="/libs/foundation/global.jsp"%>
<%String delim = properties.get("delim", String.class); %>
<div id="breadcrumb_id">
<%if(delim == null){ 
delim = "|";
%>

;Search is currently not available.</br>Search & Promo Service is not configured.
<%}%>
</div>
<script type="text/javascript">
/*
 * This function is used to display the breadcrumbs for S&P.
 */
function populateBreadcrumbs(data){
	$("#breadcrumb_id").empty();
	$.each(data, function(indx, element){
		$.each(element.values, function(index, valuesElement){
		    liHTML = '<a href="javascript:callService(\''+valuesElement.path+'\');">'+valuesElement.value+'</a><img src=".../../../apps/mdi-searchpromo/widgets/css/images/closeButton1.png" onclick="javascript:callService(\''+valuesElement.removepath+'\');"/>';
		    if(index < element.values.length-1){
		    	liHTML = liHTML + "&nbsp;<%=delim%>&nbsp;";
		    }
		    $("#breadcrumb_id").append(liHTML);
			});
		
	});
}
</script>