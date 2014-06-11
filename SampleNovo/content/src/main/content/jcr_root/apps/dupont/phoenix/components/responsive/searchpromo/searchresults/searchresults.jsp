<%@include file="/libs/foundation/global.jsp"%>
<script language="javascript">
/*
* This function used to populate search result page.
*/
function populateSearchResultPage(data, resultCount){
    //empty searchResults previous content. 
    $('#searchResults').empty();
    if(resultCount.total > 0){
    $.each(data, function(index, element) {
        var titleHTML = '<div id="title'+index+'" class="search-result-item" ><h2><a href="'+element.url+'" onclick="javascript:item_click(\''+element.index+'\',\''+element.title+'\');">'+element.title+'<span class="no-wrap"><img src="/etc/designs/dupont/tools/searchcontroller/source/images/right-arrow-action.png"  class="cta-arrow"></span></a></h2></div>';
        $('#searchResults').append(titleHTML);
        if(element.thumbnail_url != null && element.thumbnail_url != ''){
            var imgHTML = '<a href="'+element.url+'" onclick="javascript:item_click(\''+element.index+'\',\''+element.title+'\');"><img class="result_image" src="'+element.thumbnail_url+'"></a>';
            $('#title'+index).append(imgHTML);
        }
        if(element.description.length >= 40){
            var descHTML = '<p>'+element.description+'</p>';
        $('#title'+index).append(descHTML);

        }else{
            var contextHTML = '<p>'+element.context+'</p>';
            $('#title'+index).append(contextHTML);
        }

		
    });
    }else{
    	var titleHTML = '<div id="noResult" class="individualResult_cls" >Data is not Available</div>';
        $('#searchResults').append(titleHTML);
    }


}
    function item_click(linkIndex,linkTitle) {
        //var $link = linkElement;
        CQ_Analytics.record({event: 'spResultclicked', 
                             values: {
                                 'spPosition': linkIndex,
                                 'spProductName': $('.site-search-box').val() + ' ' +linkTitle
						},
					componentPath: '<%=resource.getResourceType()%>'
		});

	}
</script>
<div id="searchResults"></div>
