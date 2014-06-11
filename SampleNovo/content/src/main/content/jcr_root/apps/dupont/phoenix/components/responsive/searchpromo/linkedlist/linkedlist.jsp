<%@include file="/libs/foundation/global.jsp"%>


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

function renderLinkedList(data) {
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
//if data is there in facet,iterate the facet values
	        if (tempJSON != null) {
	            $.each(tempJSON.values, function(count, linkedList) {
	                var isSelected = data.selected;
	                var linkedListDiv = '<div id="divID' + count + '" ></div>';
	                $('#linkedlistId').append(linkedListDiv);
	                $('#divID' + count).addClass("divID_cls");
	                
	                $('#divID' + count).append($('<a>', {
	                    text : linkedList.value,
	                    title : linkedList.value,
	                    href : '#',
	                    click : function() {
	                        callService(linkedList.link);
	                        return false;
	                    }
	                }));

	                // change background color on mouse hover
	                    $('#divID' + count).hover(function() {
	                        $(this).css( {
	                            "background-color" : "#E3E3E3"
	                        });
	                    }, function() {
	                        $(this).css( {
	                            "background-color" : "#F2F2F2"
	                        });
	                    });
	                });
	        }
	    }
	</script>
	<div id="linkedlistId" class="linkedlist_cls">Search is currently not available.</br>Search & Promo Service is not configured.</div>
