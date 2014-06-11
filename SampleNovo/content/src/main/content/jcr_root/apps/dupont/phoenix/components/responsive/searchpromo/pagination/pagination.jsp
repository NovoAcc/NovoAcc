<%@include file="/libs/foundation/global.jsp"%>
<div class="search-pagination">

</div>
<script type="text/javascript">
/*
 * This function is used to populate the pagination block.
 */

function populatePaginationPage(data, resultcount){
    $('.search-pagination').empty();

    //Add pagination_count div
    pageCountHTML = '<div class="pagination_count"></div>';
    $('.search-pagination').append(pageCountHTML);

    pageULHTML = '<ul id="sp-pagination-ul"></ul>';
    $('.search-pagination').append(pageULHTML);
    $.each(data, function(index, element) {
        previousHTML = '';
        lastHTML = '';
        nextHTML = '';
        viewAllHTML = '';
        pageHTML = '';

        $('#sp-pagination-ul').empty();
        /* Previous Links.
        */
           if(element.previous != ''){
               previousHTML = '<li class="previous"><a href="javascript:callService(\''+element.previous+'\');" class="page"></a></li>';
               $('#sp-pagination-ul').append(previousHTML);
               }

           /* Page number links.
            */
           var count = 0;
           var isFirstPage = 'false';
           $.each(element.pages, function(indx, pageElement){
               
        	   if(pageElement.selected == 'true'){
                   pageHTML = '<li><a href="#" class="current" title="">'+pageElement.page+'</a></li>';
                   $('#sp-pagination-ul').append(pageHTML);
                   }else{
                pageHTML = '<li><a href="javascript:callService(\''+pageElement.link+'\');" class="page">'+pageElement.page+'</a></li>';
                $('#sp-pagination-ul').append(pageHTML);
                   }
               count++;
               });

           /* Show next Link.
            */

           if(element.next != ''){
               nextHTML = '<li class="next"><a href="javascript:callService(\''+element.next+'\');" class="page"></a></li>';
               $('#sp-pagination-ul').append(nextHTML);
               }

    });
}
</script>
