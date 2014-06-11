var counter = 0;
$(document).ready(function () {
	renderFilters();
	$('.help').click(function () {
		$('.help-dialog').fadeIn();
	});
	$('.help-dialog a').click(function () {
		$('.help-dialog').fadeOut('fast');
	});

	$('.expand').each(function () {
		$(this).click(function () {
			$(this).parent().toggleClass('active');
		});
	});
    
	$('.facets li input').each(function () {
		$(this).click(function () {
			counter++;
			var contentTypeSelected = false;
			if ($(this).attr('checked')) {
				$(this).addClass('selected').addClass('click-' + counter);
				parentNode = null;
				if ($(this).attr("parent")) parentNode = $(this).attr("parent");
				if ($(this).parents(".facets").hasClass("taxonomy")) {
					addToFilters($(this).attr('id'), parentNode, taxonomyTags);
					$("#mobile-"+$(this).attr('id')).attr('disabled',true);
                    // Site Catalyst Code
                    if (CQ_Analytics.Sitecatalyst) {

                        CQ_Analytics.record({event: 'taxonomyFacetSelected', 
                            values: {
                            'selectedFacetName': $(this).val(),
                            'templateContentType': sitecatVal
                            },
                            componentPath: resourceType
                            });
                    }
				} else if ($(this).parents(".facets").hasClass("content-types")) {
                    contentTypeSelected = true;
					addToFilters($(this).attr('id'), parentNode, contentTypeTags);
					$("#mobile-"+$(this).attr('id')).attr('disabled',true);
					for (i = 0; i < taxonomyTags.length; i++) {
						$("#breadcrumb-"+taxonomyTags[i][0]).remove();
						$("#breadcrumb-mobile-"+taxonomyTags[i][0]).remove();
						$("#"+taxonomyTags[i][0]).attr('checked', false).removeClass("selected");
					}
					taxonomyTags = [];
                    // Site Catalyst Code
                    if (CQ_Analytics.Sitecatalyst) {
                            CQ_Analytics.record({event: 'contentTypeFacetSelected', 
                            values: {
                            'selectedFacetName': $(this).val(),
                            'templateContentType': sitecatVal
                            },
                            componentPath: resourceType
                            });
                    }
				}

				$('.your-filters').append('<a class="filter-' + counter + '" id="breadcrumb-' + $(this).attr('id') + '">' + $(this).val() + '<span>&nbsp;</span></a>');
				$('.mobile-your-filters').append('<a id="breadcrumb-mobile-' + $(this).attr('id') + '">' + $(this).val() + '<span>&nbsp;</span></a>');
			}
			if (!$(this).attr('checked')) {
				$(this).removeClass('selected').removeClass('click-' + counter);
                // Site Catalyst Code
                if (CQ_Analytics.Sitecatalyst) {
                    CQ_Analytics.record({event: 'facetRemoved', 
                        values: {
                        'removedFacetName': $(this).val(),
                        'templateContentType': sitecatVal
                        },
                        componentPath: resourceType
                        });
                }

				if ($(this).parents(".facets").hasClass("taxonomy")) {
					removeRecord($(this).attr('id'), taxonomyTags);
				} else if ($(this).parents(".facets").hasClass("content-types")) {
					contentTypeSelected = true;
					removeRecord($(this).attr('id'), contentTypeTags);
					$("#mobile-"+$(this).attr('id')).attr('disabled',false);
					for (i = 0; i < taxonomyTags.length; i++) {					
						$("#breadcrumb-"+taxonomyTags[i][0]).remove();
						$("#breadcrumb-mobile-"+taxonomyTags[i][0]).remove();
						$("#"+taxonomyTags[i][0]).attr('checked', false).removeClass("selected");
					}
					taxonomyTags = [];
				}

				$('.your-filters #breadcrumb-' + $(this).attr('id')).remove();
				$('.mobile-your-filters #breadcrumb-mobile-' + $(this).attr('id')).remove();
			}
			renderFilters(contentTypeSelected);
		});
	});


	$('#launch-filter').click(function () {
		$('#image-lightbox').fadeIn('fast');
	});

	$('#close').click(function () {
		$('#image-lightbox').fadeOut('fast');
	});

	$('#content-type, #image-lightbox select').change(function () {
		counter++;
        if($(this).children(":selected").attr("id") != "mobile-all-content-type" && $(this)[0].selectedIndex==0){
            return;
        }
		var selectVal = $(this).val();
		var strippedSelect = selectVal.replace('-', '');
		$('.mobile-your-filters').append('<a class="mobile-filter-' + counter + '" id="breadcrumb-' + $(this).children(":selected").attr("id") + '">' + strippedSelect + '<span>&nbsp;</span></a>');
		$('.your-filters').append('<a class="filter-' + counter + '" id="breadcrumb-' + $(this).children(":selected").attr("id").replace('mobile-','') + '">' + strippedSelect + '<span>&nbsp;</span></a>');
        $(this).children(":selected").attr('disabled',true);
        $("#"+$(this).children(":selected").attr("id").replace('mobile-','')).prop('checked', true).addClass("selected");
        var contentTypeSelected = false;
		if ($(this).attr("id") == 'content-type') {
            contentTypeSelected = true;
            if($(this).children(":selected").attr("id") != "mobile-all-content-type"){
            	addToFilters($(this).children(":selected").attr("id").replace('mobile-',''), null, contentTypeTags);
            } else if($(this).children(":selected").attr("id") == "mobile-all-content-type"){
				$('.your-filters').html('');
				$('.mobile-your-filters').html('');
				$("#mobile-all-content-type").attr('disabled',false);
				for (i = 0; i < contentTypeTags.length; i++) {
					
					$("#"+contentTypeTags[i][0]).prop('checked', false).removeClass("selected");
					$("#mobile-"+contentTypeTags[i][0]).attr('disabled',false);
				}
                contentTypeTags = [];
            }
            
            for (i = 0; i < taxonomyTags.length; i++) {
                $("#breadcrumb-"+taxonomyTags[i][0]).remove();
				$("#breadcrumb-mobile-"+taxonomyTags[i][0]).remove();
                $("#"+taxonomyTags[i][0]).attr('checked', false).removeClass("selected");
            }
            taxonomyTags = [];
            // Site Catalyst Code
            if (CQ_Analytics.Sitecatalyst) {
                    CQ_Analytics.record({event: 'contentTypeFacetSelected', 
                    values: {
                    'selectedFacetName': $(this).val(),
                    'templateContentType': sitecatVal
                    },
                    componentPath: resourceType
                    });
            }
		} else 
		{
			parentNode = null;
			if ($(this).children(":selected").attr("parent")) parentNode = $(this).children(":selected").attr("parent");
			addToFilters($(this).children(":selected").attr("id").replace('mobile-',''), parentNode, taxonomyTags);
			$(this).children().eq(0).attr("selected",true);
            // Site Catalyst Code
            if (CQ_Analytics.Sitecatalyst) {
                    CQ_Analytics.record({event: 'taxonomyFacetSelected', 
                        values: {
                        'selectedFacetName': $(this).val(),
                        'templateContentType': sitecatVal
                        },
                        componentPath: resourceType
                        });
            }
		}
		renderFilters(contentTypeSelected);
	});

	$('#image-lightbox select').change(function () {
		$('#image-lightbox').fadeOut('fast');
	});

	$('.your-filters a, .mobile-your-filters a').live("click", function () {
		counter--;
		var cbk = $("#" + $(this).attr('id').replace("breadcrumb-", ""));
        // Site Catalyst Code
        if (CQ_Analytics.Sitecatalyst) {
                CQ_Analytics.record({event: 'facetRemoved', 
                    values: {
                    'removedFacetName': cbk.val(),
                    'templateContentType': sitecatVal
                    },
                    componentPath: resourceType
                    });
        }
        var contentTypeSelected = false;
		if (cbk.prop("tagName") == 'OPTION') {
			if (cbk.parent().attr('id') == "content-type") {
				contentTypeSelected = true;
				removeRecord(cbk.attr('id').replace('mobile-',''), contentTypeTags);
			} else {
				removeRecord(cbk.attr('id').replace('mobile-',''), taxonomyTags);
			}
            cbk.attr('disabled',false);
            $("#"+cbk.attr("id").replace('mobile-','')).prop('checked', false).removeClass("selected");            
            
			$('#breadcrumb-mobile-'+ $(this).attr('id').replace("breadcrumb-mobile-", "")).remove();
			$('#breadcrumb-' + $(this).attr('id').replace("breadcrumb-mobile-", "")).remove(); 
		} else {
			cbk.attr('checked', false);
			$("#mobile-"+cbk.attr("id")).attr('disabled',false);
			if (cbk.parents(".facets").hasClass("taxonomy")) {
				removeRecord(cbk.attr('id'), taxonomyTags);
			} else if (cbk.parents(".facets").hasClass("content-types")) {
				contentTypeSelected = true;
				removeRecord(cbk.attr('id'), contentTypeTags);
			}
			$('#breadcrumb-mobile-'+ $(this).attr('id').replace("breadcrumb-", "")).remove();
			$('#breadcrumb-' + $(this).attr('id').replace("breadcrumb-", "")).remove(); 
			cbk.removeClass('selected');
		}

		renderFilters(contentTypeSelected);
	});

$(".search-result a").on("click", function(){
	var selectedFacets = "";
	for(i=0;i<taxonomyTags.length;i++){
		selectedFacets += $("#"+taxonomyTags[i][0]).val() + ",";
	}
	for(i=0;i<contentTypeTags.length;i++){
		selectedFacets += $("#"+contentTypeTags[i][0]).val() + ",";
	}
	selectedFacets = selectedFacets.replace(/,+$/, "");
    if (CQ_Analytics.Sitecatalyst) {
            CQ_Analytics.record({event: 'contenItemClicked', 
            values: {
            'templateContentType':sitecatVal,
            'selectedFacets': selectedFacets,
            'contentItemURL': $(this).attr("href")
            },
            componentPath: resourceType
            });
    }

})

$('.show-more-link').on("click", function () {
	$('.parent-facet',$(this).parents('.facet-container')).addClass('show-all').removeClass('show-less');
	$('.show-more-link',$(this).parents('.facet-container')).hide();
	$('.show-less-link',$(this).parents('.facet-container')).show();
	return false;
});
$('.show-less-link').on("click", function () {
	$('.parent-facet.content-type-visible:gt(9)',$(this).parents('.facet-container')).addClass('show-less').removeClass('show-all');
	$('.show-more-link',$(this).parents('.facet-container')).show();
	$('.show-less-link',$(this).parents('.facet-container')).hide();
	$('html, body').animate({
		scrollTop: $(this).parents('.facet-container').offset().top
	}, 500);
	return false;
});

$('.data-grid-view').click(function(event) {
     $(this).addClass('currentview');
     $(this).removeClass('otherview');
    $('.grid-list-wrapper').find('.data-list-view').removeClass('currentview');
    $('.grid-list-wrapper').find('.data-list-view').addClass('otherview');
    $(".mobile-results-list").removeClass("mobile-results-list").addClass("mobile-results-grid");
    
    if($('.data-grid-view').hasClass('currentview')) {
           event.preventDefault();
    }
});
$('.data-list-view').click(function(event) {
     $(this).addClass('currentview');
     $(this).removeClass('otherview');
    $('.grid-list-wrapper').find('.data-grid-view').removeClass('currentview');
    $('.grid-list-wrapper').find('.data-grid-view').addClass('otherview');
    $(".mobile-results-grid").removeClass("mobile-results-grid").addClass("mobile-results-list");
    if($('.data-list-view').hasClass('currentview')) {
           event.preventDefault();
    }
});

setTimeout(function(){factsSelection()},1);
});
var resultSet;

function renderBreadcrumbs(cbk) {

}

function renderFilters(contentTypeSelected) {
	if (taxonomyTags.length == 0 && (taxonomyTags.length == 0 && contentTypeTags.length == 0)) {
		$(".search-result").removeClass("filterVisible");
		$(".search-result").removeClass("filterHidden");
		$(".search-result").removeClass("paginateHidden");
		$(".search-result").addClass("defaultVisible");
		resultSet = $('.search-result:visible');
        if(resultSet.length==0){
            $("#no-results-text").show();
            $(".showing-results .result-number").css('display','none');
            $(".pagination").css('display','none');
        }else{
            $("#no-results-text").hide();
            $(".showing-results .result-number").css('display','');
            $(".pagination").css('display','');
        }
		$(".total-results").html($('.search-result:visible').length);
		$('.your-filters').html("");
		$('.mobile-your-filters').html("");
		paginate(1);
		renderFacets(contentTypeSelected);
        $("#media-center-index").hide().show(0);
		return;
	}
	$(".search-result").addClass("filterHidden");
	$(".search-result").removeClass("paginateHidden");
	if (taxonomyTags.length == 0) {
		for (j = 0; j < contentTypeTags.length; j++) {
			$("." + contentTypeTags[j][0]).removeClass("filterHidden");
			$("." + contentTypeTags[j][0]).addClass("filterVisible");
		}
		renderFacets(contentTypeSelected);
        $("#media-center-index").hide().show(0);
	}
	for (i = 0; i < taxonomyTags.length; i++) {
    	if (contentTypeTags.length != 0) {
			for (j = 0; j < contentTypeTags.length; j++) {
				if($(".facet-container :checkbox[parent='" + taxonomyTags[i][0] + "']:checked").length == 0){
                    $("." + taxonomyTags[i][0] + "." + contentTypeTags[j][0]).removeClass("filterHidden");
					$("." + taxonomyTags[i][0] + "." + contentTypeTags[j][0]).addClass("filterVisible");
                } else {
                }
			}
		} else {
			if (taxonomyTags[i][1] != null) {
				$("." + taxonomyTags[i][0]).removeClass("filterHidden");
				$("." + taxonomyTags[i][0]).addClass("filterVisible");
			} else if (taxonomyTags[i][1] == null && $(".facet-container :checkbox[parent='" + taxonomyTags[i][0] + "']:checked").length == 0) {
				$("." + taxonomyTags[i][0]).removeClass("filterHidden");
				$("." + taxonomyTags[i][0]).addClass("filterVisible");
			}
		}
	}
    resultSet = $('.search-result:visible');
    if(resultSet.length==0){
		$("#no-results-text").show();
        $(".showing-results .result-number").css('display','none');
        $(".pagination").css('display','none');
    }else{
		$("#no-results-text").hide();
        $(".showing-results .result-number").css('display','');
        $(".pagination").css('display','');
    }

	$(".total-results").html($('.search-result:visible').length);
	paginate(1);
	renderFacets(contentTypeSelected);
    $("#media-center-index").hide().show(0);
	console.log("Total Count is " + $('.search-result:visible').length);
}

function paginate(currentPage, showAll, scrollTop) {
	renderPagination(currentPage, showAll);
	resultSet.addClass("paginateHidden");
	if(resultSet.length <= defaultPageResults){
	        $(".pagination-show-less").hide();
	        $(".pagination-show-all").hide();
	} else{
	        $(".pagination-show-less").hide();
	        $(".pagination-show-all").show();
	}

	resultSet.each(function (i, val) {
		if (i >= ((currentPage - 1) * defaultPageResults) && i < (currentPage) * defaultPageResults) {
			$(this).removeClass("paginateHidden");


		}
        if (i >= ((currentPage - 1) * defaultPageResults) && i < ((currentPage - 1) * defaultPageResults)+(defaultPageResults*preloadImagePages)) {
			var imageSrc = $(".result-content img", this).attr('data-src');
            $(".result-content img", this).attr('src',imageSrc);
        }
	});
	if (scrollTop == true) {
		$('html, body').animate({
			scrollTop: $("#search-results-wrapper").offset().top
		}, 500);
	}
}
function mobilePaginate(obj){
    var currentPage = (obj.selectedIndex+1);
    paginate(currentPage,false,true);
}

function renderPagination(currentPage, showAll) {
	if (showAll == true) {
		$(".pagination").html("");
		$(".current-results").html(resultSet.length + " " + ofText + " ");
		return;
	}
    if(resultSet.length<=defaultPageResults){
    	$(".showing-results.bottom .pagination").addClass("paginationhide");
    	$(".showing-results.bottom .pagination").removeClass("paginationvisible");
        $(".current-results").hide();
    } else {
    	$(".showing-results.bottom .pagination").removeClass("paginationhide");
    	$(".showing-results.bottom .pagination").addClass("paginationvisible");
        $(".current-results").show();
    }

	if (currentPage == 1) {
		var strHTML = '<div class="prev disabled"></div>';
        var strMobileHTML = '<div class="mb-prev-image disabled"></div><div class="select-style"><select id="mobile-pagination-dropdown" onchange="mobilePaginate(this)">';
	} else {
		var strHTML = '<div class="prev" onclick="paginate(' + ((currentPage / 1) - 1) + ',false,true)"></div>';
        var strMobileHTML = '<div class="mb-prev-image" onclick="paginate(' + ((currentPage / 1) - 1) + ',false,true)"></div><div class="select-style"><select id="mobile-pagination-dropdown" onchange="mobilePaginate(this)">';
	}
	var selectedClass = "";
	var totalPages = Math.ceil((resultSet.length / defaultPageResults));
	var maxPaginationLinks = 5;
	var startPage = 1;
	var endPage = totalPages;
	var midPage = Math.ceil((maxPaginationLinks/2));
	
	if(totalPages<=maxPaginationLinks){
		maxPaginationLinks=totalPages;
	}
	if(currentPage>midPage){
		startPage = currentPage-(midPage-1);
	}
	endPage = startPage+midPage+1;
	if(endPage>totalPages){
		endPage = totalPages;
	}
	if(endPage==totalPages){
		startPage = endPage - maxPaginationLinks +1;
	}
	for (i = startPage; i <= endPage; i++) {
		if(currentPage == i){
			selectedClass = " class='selected'";
            selectedOption = " selected";
		} else{
			selectedClass = "";
            selectedOption = "";
		}
		strHTML += "<a href='JavaScript:void(0)' onclick='paginate(" + i + ",false,true)'"+selectedClass+">" + i + "</a>";
        strMobileHTML += '<option value="'+i+'"'+ selectedOption +'>'+ i + " " + ofText + " " + totalPages;
	}
	if (currentPage == totalPages) {
		strHTML += '<div class="next disabled"></div>';
        strMobileHTML += '</select></div><div class="mb-next-image disabled"></div></div>';
	} else {
		strHTML += '<div class="next" onclick="paginate(' + ((currentPage / 1) + 1) + ',false,true)"></div>';
        strMobileHTML += '</select></div><div class="mb-next-image" onclick="paginate(' + ((currentPage / 1) + 1) + ',false,true)"></div></div>';
	}
	$(".pagination").html(strHTML);
    $(".mobile-bg-pagination").html(strMobileHTML);
	if (currentPage * defaultPageResults < resultSet.length) {
		$(".current-results").html(((currentPage - 1) * defaultPageResults) + 1 + "-" + currentPage * defaultPageResults + " " + ofText + " ");
	} else {
		$(".current-results").html(((currentPage - 1) * defaultPageResults) + 1 + "-" + resultSet.length + " " + ofText + " ");
	}
}
var taxonomyTags = [];
var contentTypeTags = [];

function addToFilters(i, j, k) {
	k.push([i, j]);
}


function removeRecord(i, l) {
	var j = i;
	var tempList = [];
	for (var k = 0; k < l.length; k++) {
		if (l[k][0] != j) {
			tempList.push(l[k]);
		}
	};
	l.length = 0;
	Array.prototype.push.apply(l, tempList);
}

function toggleView(obj) {
	if ($(obj).hasClass('grid')) {
		$(obj).removeClass('grid');
		$(".mobile-results-grid").removeClass("mobile-results-grid").addClass("mobile-results-list");
	} else {
		$(obj).addClass('grid');
		$(".mobile-results-list").removeClass("mobile-results-list").addClass("mobile-results-grid");
	}
}
function showAllResults(flag, obj) {
	if (flag) {
		$(".search-result").removeClass("paginateHidden");
		$(".pagination-show-less").show();
		$(".pagination-show-all").hide();
        $("#search-results-wrapper .search-result:visible .result-content img").each(function(){
        		var imageSrc = $(this).attr('data-src');
                $(this).attr('src',imageSrc);
        });
		renderPagination(1, true)
	} else {
		paginate(1, false);
		$(".pagination-show-all").show();
		$(".pagination-show-less").hide();
		$('html, body').animate({
			scrollTop: $("#search-results-wrapper").offset().top
		}, 500);
	}
}

function renderFacets(contentTypeSelected) {
	if (contentTypeTags.length == 0) {
		$(".parent-facet").addClass('content-type-visible').removeClass('content-type-hidden');
		$(".sub-facets li").addClass('content-type-visible').removeClass('content-type-hidden');
		if(contentTypeSelected==true){
		$("#image-lightbox .lightbox option").attr('disabled',false);
		}
		$(".facet-container").each(function (i, val) {
			$(this).removeClass('no-facets-hidden');
            $(this).addClass('no-facets-visible');
		})
		facetsHidden(contentTypeSelected);    
        if($('.facet-container.no-facets-visible','.taxonomy').length==0){
            $(".help-container",'.taxonomy').addClass('no-facets-hidden');
            $(".help-container",'.taxonomy').removeClass('no-facets-visible');
        } else {
            $(".help-container",'.taxonomy').removeClass('no-facets-hidden');
            $(".help-container",'.taxonomy').addClass('no-facets-visible');
        }
		return;
	}
	$(".parent-facet").addClass('content-type-hidden').removeClass('content-type-visible');
	$(".sub-facets li").addClass('content-type-hidden').removeClass('content-type-visible');
	$("#image-lightbox .lightbox option").attr('disabled',true);
	for (j = 0; j < contentTypeTags.length; j++) {
		$("li.parent-facet."+contentTypeTags[j][0]).removeClass('content-type-hidden');
		$("ul.sub-facets li."+contentTypeTags[j][0]).removeClass('content-type-hidden');
		$("#image-lightbox .lightbox option."+contentTypeTags[j][0]).attr('disabled',false);
		$("li.parent-facet."+contentTypeTags[j][0]).addClass('content-type-visible');
		$("ul.sub-facets li."+contentTypeTags[j][0]).addClass('content-type-visible');
	}
	facetsHidden(contentTypeSelected);
	$(".facet-container").each(function (i, val) {
		if($(this).parents(".facets").hasClass("content-types")){

		} else {
			$(this).removeClass('no-facets-hidden');
            $(this).addClass('no-facets-visible');
			var resultSetFacets = $('li.parent-facet.content-type-visible',this);
			if(resultSetFacets.length==0){
				$(this).addClass('no-facets-hidden');
                $(this).removeClass('no-facets-visible');
			} else{
				$(this).removeClass('no-facets-hidden');
                $(this).addClass('no-facets-visible');
			}
		}
	});
    if($('.facet-container.no-facets-visible','.taxonomy').length==0){
        $(".help-container",'.taxonomy').addClass('no-facets-hidden');
        $(".help-container",'.taxonomy').removeClass('no-facets-visible');
    } else {
        $(".help-container",'.taxonomy').removeClass('no-facets-hidden');
        $(".help-container",'.taxonomy').addClass('no-facets-visible');
    }

}
function facetsHidden(contentTypeFlag){
    if(contentTypeFlag==false){
        return;
    }
	$('li.parent-facet').removeClass('show-less');

	$(".facet-container").each(function (i, val) {
		var resultSetFacets = $('li.parent-facet:visible',this);
		if(resultSetFacets.length>10){
			resultSetFacets.each(function (i, val) {
				if(i<10){
					$(this).addClass('show-all');
					$(this).removeClass('show-less');
					$('.show-more-link',$(this).parents('.facet-container')).hide();
					$('.show-less-link',$(this).parents('.facet-container')).hide();
				}else{
					$(this).removeClass('show-all');
					$(this).addClass('show-less');
					$('.show-more-link',$(this).parents('.facet-container')).show();
					$('.show-less-link',$(this).parents('.facet-container')).hide();
				}
			});
		}
		else{
			resultSetFacets.addClass('show-all');
			resultSetFacets.removeClass('show-less');
			$('.show-more-link',$(this)).hide();
			$('.show-less-link',$(this)).hide();
		}
	});
}

function factsSelection(){
	$('.your-filters').html("");
	$('.mobile-your-filters').html("");
	for (i = 0; i < contentTypeTags.length; i++) {

			$("#"+contentTypeTags[i][0]).prop('checked', true).addClass("selected");
			$("#mobile-"+contentTypeTags[i][0]).attr('disabled',true);
			$('.your-filters').append('<a class="filter-' + counter + '" id="breadcrumb-' + $("#"+contentTypeTags[i][0]).attr('id') + '">' + $("#"+contentTypeTags[i][0]).val() + '<span>&nbsp;</span></a>');
			$('.mobile-your-filters').append('<a class="filter-' + counter + '" id="breadcrumb-mobile-' + $("#"+contentTypeTags[i][0]).attr('id') + '">' + $("#"+contentTypeTags[i][0]).val() + '<span>&nbsp;</span></a>');
	}
}