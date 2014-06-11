<%--
  My CheckBox component.
--%>
<%@include file="/libs/foundation/global.jsp"%>
<%@page session="false"%>


<%
	String facetName = properties.get("facetName", String.class);

	if (facetName == null) {
		facetName = "false";
	}
%>
<script>
/**
* This function is used to select links and keep their record.
*/

function renderCheckBox(data) {
	var facetName = "<%=facetName%>";
		//checking different facet values 
		if (facetName == "industry") {
			var tempJSON = data.facets.industry;
		} else if (facetName == "url_domain") {
			var tempJSON = data.facets.url_domain;
		} else if (facetName == "sub_industry") {
			var tempJSON = data.facets.sub_industry;
		} else if (facetName == "content_type") {
			var tempJSON = data.facets.content_type;
		}

		if (tempJSON != null) {
			$.each(tempJSON.values, function(count, checkBox) {
				var isSelected = checkBox.selected;
				var checkBoxDiv = '<div id="divID' + count + '" ></div>';
				$('#checkboxId').append(checkBoxDiv);
				$('#divID' + count).addClass("divID_cls");
				if (isSelected == 'true') {

					$('#divID' + count).append(
							$(document.createElement('input')).attr( {
								id : 'myCheckbox' + count,
								name : 'myCheckbox',
								value : checkBox.undolink,
								type : 'checkbox',
								checked : true
							}));
				} else {

					$('#divID' + count).append(
							$(document.createElement('input')).attr( {
								id : 'myCheckbox' + count,
								name : 'myCheckbox',
								value : checkBox.link,
								type : 'checkbox'

							}));
				}
				var labelForCheckBox = $(document.createElement('label'));
				labelForCheckBox.html(checkBox.value + '(' + checkBox.count
						+ ')');
				$('#divID' + count).append(labelForCheckBox);
				$('#myCheckbox' + count).click(function() {
					if ($('#myCheckbox' + count).prop('checked')) {
						callService(checkBox.link);
					} else {
						callService(checkBox.undolink);
					}
				});
			});

			// change background color on mouse hover
			$('.divID_cls').hover(function() {
				$(this).css( {
					"background-color" : "#E3E3E3"
				});
			}, function() {
				$(this).css( {
					"background-color" : "#F2F2F2"
				});
			});

		}
	}
</script>
<div id="checkboxId" class="checkbox_cls">Search is currently not available.</br>Search & Promo Service is not configured.</div>
