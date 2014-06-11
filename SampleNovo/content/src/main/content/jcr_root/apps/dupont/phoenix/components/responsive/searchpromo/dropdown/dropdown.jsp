<%@include file="/libs/foundation/global.jsp"%>
<%%>


<div id="dropdownId" class="dropdown_cls">Search is currently not available.</br>Search & Promo Service is not configured.</div>


<script>
/**
 * This function is used to select values from drop down list and call the method which in turn calls the service.
 */
	function renderDropDown(data) {
		$('#dropdownId').append($(document.createElement('div')).attr( {
			id : 'divID' + data.facets.industry.label
		}));
		var selectElement = document.createElement("select");
		selectElement.name = data.facets.industry.label;
		selectElement.id = data.facets.industry.label;
		selectElement.setAttribute("onchange", "javascript:selectedInfo('"
				+ data.facets.industry.label + "')");

		$.each(data.facets.industry.values, function(count, dropDown) {
			var option = document.createElement("option");
			option.value = dropDown.link;
			option.innerHTML = dropDown.value;
			selectElement.appendChild(option);
		});
		$('#divID' + data.facets.industry.label).append(selectElement);
	}
    /**
     * This function calls the service from searchpromo.jsp class
     */
     function selectedInfo(selectID) {
           callService($("#" + selectID).val());

	}
</script>