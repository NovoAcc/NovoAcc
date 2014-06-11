"use strict"

;(function(window, document, undefined){
    var options = {},
        controller = (function(){

            function init(opts){
                if(typeof opts != 'object')
                    return;

                options = opts;
                if(sessionStorage.getItem("PATH") != null){
                    var decoded = decodeURIComponent(sessionStorage.getItem("PATH").split('=')[1]);
                    $('#q').val(decoded);
                    callService(sessionStorage.getItem("PATH"));
                    console.log('Path, called with ', sessionStorage.getItem("PATH"));
                 }else{
                     if(options.keyword != null && !options.keyword != ""){
                        
                        $('#q').val(decodeURIComponent(options.keyword));
                     }
                     callService('q=' + encodeURIComponent(unescapeHtmlURL(options.keyword)));
                     console.log('No path, called with', encodeURIComponent(options.keyword));
                 }
                 attachListeners();
            }

            function unescapeHtmlURL(unsafe){
                return unsafe
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">")
                    .replace(/&quot;/g, "\"");

            }

            function onSuccess(data){
                $('.search-right-col-header').show();
                $('.search-pagination').show();
                
                /*Search Term*/
        
                $('.search-term').empty();
                if(data.general.query != null && data.general.query != ''){
                    var searchHTML = options.showingResultsFor + ' ' + data.general.query;
                    $('.search-term').append(CQ.shared.XSS.getXSSValue(searchHTML));
                }
                
                $('.p').empty();
                
                if(data.general.original_query != null && data.general.original_query != '' ){
                    
                    var searchInsteadHTML = options.uSearchForMsg + ' ' + data.general.original_query+'. '+ options.inclResultForMsg +' <a href="javascript:callService(\'q='+data.general.query+'\');">'+data.general.query+'.</a>';
                    $('.search-term').empty();
                    $('.search-term').append(searchInsteadHTML);
                }
        
                /*End Search Term*/
                
                /*Start menus */
        
                if(data.menus != null && (data.resultcount.total != null && data.resultcount.total != '0')){
                    populateMenus(data);
                }
        
                /*End Menus*/
        
        
                /*Breadcrumbs*/
        
                if($('#breadcrumb_id').length){
                    $('#breadcrumb_id').empty();
                    if(data.breadcrumbs != null && (data.resultcount.total != null && data.resultcount.total != '0')){
                        populateBreadcrumbs(data.breadcrumbs);
                    }
                }
        
                /*Checkbox Facet*/
        
                if($('#checkboxId').length){
                    $('#checkboxId').empty();
                    if (data.facets.industry.hasOwnProperty("values")) {
                        
                        renderCheckBox(data);
                    }
                }
        
                /*Serch Result */
                
                if(data["result-sets"] != null && (data.resultcount.total != null && data.resultcount.total != '0')){
                    populateSearchResultPage(data["result-sets"], data.resultcount);
                    
                }
        
                //Populate Pagination block
        
                if(data.pagination != null && (data.resultcount.total != null && data.resultcount.total != '0')){
                    populatePaginationPage(data.pagination, data.resultcount);
                }
                if(data.resultcount.total != null && data.resultcount.total != '0'){
                    showTotalResults(data.resultcount);
                    if(options.keyword == sessionStorage.getItem("PATH").split('=')[1]){    
                        CQ_Analytics.record({event: 'spSearch', 
                                values: {
                                    'spResults': data.resultcount.total,
                                    'spKeyword': options.keyword
                            },
                            collect:  false,
                            componentPath: options.resourceType
                        }); 
                    }else{
                        CQ_Analytics.record({event: 'spSearch', 
                                values: {
                                    'spResults': data.resultcount.total,
                                    'spKeyword': $('.site-search-box').val()
                            },
                            collect:  false,
                            componentPath: options.resourceType
                        }); 
                    }
                }
                
                if(data.resultcount.total != null && data.resultcount.total == '0'){
                    $('.p').empty();
                    $('#searchResults').empty();
                    $('.search-pagination').empty();
                    $('.sort-by').empty();
                    $('.pagination_count').empty();
                    //$('#searchResults').empty();
                    var noResultHTML = '<br> '+ options.youSearchMsg+' -<b>'+CQ.shared.XSS.getXSSValue(data.general.query)+'</b>- ' + options.didNotMatchMsg + '. <br>'+ options.noPageFOundMsg+'<b> "'+CQ.shared.XSS.getXSSValue(data.general.query)+'."</b><br><br>'+ options.suggestionMsg +':<ul><li>'+ options.makeSureMsg +'.</li><li>'+ options.tryDiffMsg +'.</li><li>'+ options.tryMoreMsg +'.</li></ul>';
                    $('.p').html(noResultHTML);
                    if(options.keyword == sessionStorage.getItem("PATH").split('=')[1]){ 
                        CQ_Analytics.record({
                            event: 'spNoresults', 
                            values: {
                                'spResults': data.resultcount.total,
                                'spKeyword': options.keyword
                                
                            },
                            componentPath: options.resourceType
                        }); 
                    }else{
                        CQ_Analytics.record({event: 'spNoresults', 
                                values: {
                                    'spResults': data.resultcount.total,
                                    'spKeyword': $('.site-search-box').val()
                            },
                            collect:  false,
                            componentPath: options.resourceType
                        }); 

                    }         

                    }             

                
                //Empty Searchbox text field.
        
                if($('#q').val() == ''){
                    $('#q').val(options.searchMsg);
                }else{
                    $("#q").val($('#q').val());
                }
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        
            function clean(){
                $('#searchResults').empty();
                $('.search-pagination').empty();
                $('.sort-by').empty();
                $('.pagination_count').empty();
                $('.search-term').empty();
                $('.search-pagination').hide();
                $('.search-right-col-header').hide();
                $('.p').empty();
                $('#q').val(options.searchMsg);
                sessionStorage.setItem("PATH", null);
            }   
        
            /*
             * This function is used to call the searchpromo service using AJAX.
             */
            function callService(pathNew, reEncode){

                if(reEncode){
                    var params = pathNew.split(';'),
                        result = [],
                        preserve = [],
                        encoded = 'q=';
                    for(var i =0; i < params.length; i++){
                        var name = params[i].split('=')[0],
                            value = params[i].split('=')[1];
                        if(name =='q'){
                            value = encodeURIComponent(value);
                        }else{
                            preserve.push( name + '=' + value );
                        }
                        result.push( name + '=' + value );
                    }
                    pathNew = result.join(';');
                }
            
                var path = '';
                if(pathNew != null && pathNew != '' && pathNew != 'q=' + $.trim(options.searchMsg)){
                    if(pathNew.indexOf(' ') >= 0){
                        path = pathNew.split(' ').join('+');
                
                    }else{
                        path = pathNew;
                    }
               /*if(reEncode && preserve.length > 0){
                   var paginationParams = preserve.join('&').slice(1),
                       currentLocation = window.location;
                       history.pushState(currentLocation.href);
                       window.location.replace(currentLocation.href + '&' + paginationParams);
               }*/
            
                //For retaining current value of PATH.
               sessionStorage.setItem("PATH", path);
                $.ajax({
                    method: 'GET',
                    url : '/bin/dupont/searchpromo/results',
                    data: {"PARAM": path,
                           "SERVICE_URL": options.URL,
                           "SEARCH_INDEX": options.searchIndex },
                    cache : false,
                    dataType : 'json',
                    success : onSuccess,
                    error : function(result) {
                            //$('#errorMsg').append('<font color="red">Search & Promo Service is not available.</font>');
                            }
                    });
            
                }else{
                   clean();
                }
            }
                //Show Total Results
            function showTotalResults(resultcount){
            
                        $('.pagination_count').empty();
                        var resultCountHTML = resultcount.pagelower+'-'+ resultcount.pageupper + ' ' + options.ofMsg + ' ' + resultcount.total + ' ' + options.resultMsg;
                        $('.pagination_count').append(resultCountHTML);
            
            }
                //On key press event call service.

            function attachListeners(){
                $("#q").keypress(function(event) {
                    if ( event.which == 13 ) {
                        if($('#q').val() !=''){
                            callService('q=' + encodeURIComponent($('#q').val()) );
                            $('#q').val($('#q').val());
                        }else{
                           clean();
                        }
                
                    }
                });
            }


            /*
             * This function is used to populate the pagination block.
             */
            
            function populatePaginationPage(data, resultcount){
                $('.search-pagination').empty();
            
                //Add pagination_count div
                var pageCountHTML = '<div class="pagination_count"></div>',
                    pageULHTML = '<ul id="sp-pagination-ul"></ul>';
                $('.search-pagination').append(pageCountHTML);

                $('.search-pagination').append(pageULHTML);
                $.each(data, function(index, element) {
                    var previousHTML = '',
                        lastHTML = '',
                        nextHTML = '',
                        viewAllHTML = '',
                        pageHTML = '';
            
                    $('#sp-pagination-ul').empty();
                    /* Previous Links.
                    */
                       if(element.previous != ''){
                           previousHTML = '<li class="previous"><a href="javascript:searchController.callService(\''+element.previous+'\', true);" class="page"></a></li>';
                           $('#sp-pagination-ul').append(previousHTML);
                           }
            
                       /* Page number links.
                        */
                       var count = 0,
                           isFirstPage = 'false';
                       $.each(element.pages, function(indx, pageElement){
                           
                           if(pageElement.selected == 'true'){
                               pageHTML = '<li><a href="#" class="current" title="">'+pageElement.page+'</a></li>';
                               $('#sp-pagination-ul').append(pageHTML);
                            }else{
                                pageHTML = '<li><a href="javascript:searchController.callService(\''+pageElement.link+'\', true);" class="page">'+pageElement.page+'</a></li>';
                                $('#sp-pagination-ul').append(pageHTML);
                            }

                           count++;
                           });
            
                       /* Show next Link.
                        */
            
                       if(element.next != ''){
                           nextHTML = '<li class="next"><a href="javascript:searchController.callService(\''+element.next+'\', true);" class="page"></a></li>';
                                $('#sp-pagination-ul').append(nextHTML);
                           }
            
                });
            }
        
        
            return {
                init : init,
                callService : callService,
                populatePaginationPage : populatePaginationPage
        
            };
        })();

    window.searchController = controller;

 })(window, document)
