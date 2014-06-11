<%@include file="/libs/foundation/global.jsp"%>
<%@ page import="com.dupont.phoenix.Global"%>
<% 
String viewPerPageMsg = Global.getTranslatedText(currentPage, slingRequest,"View-per-page");
%>
<div class="search-right-col-header">
                    <div class="pagination_count"></div>
<div class="sort-by"></div></div>
<script>
function populateMenus(data){

	 /*Menus*/
    if (data.menus != null) {
        //populateFilterCountPage(data.menus);
    }

}
//This function is used create drop down of sort by menus.
function populateFilterPage(data){
    //alert('populateFilterPage');
    $('.sort-by').empty();
    var labelElement = document.createElement("label");

    labelElement.id = "sortBy";
    labelElement.innerHTML = data[0].label+" : ";
    $('.sort-by').append(labelElement);
    var selectElement = document.createElement("select");
    selectElement.name = 'sort';
    selectElement.id = 'sort';
    var items = data[0].items;
    var selectedValue = "";
    /*Iterate the menu jsonarray.
     */
  $.each(items, function(index, element) {
    var option = document.createElement("option");
    option.value = element.path;
    option.label = element.label;
    option.innerHTML = element.label;
    var check = element.selected;
      if(check == true){
          selectedValue = element.label;
          option.selected = 'selected';
     }
      selectElement.appendChild(option);
  });
  $('.sort-by').append(selectElement);
  //On Drop Down Change value.
  $("#sort").change(function(){
      callService($("#sort").val());
    });
}

function populateFilterCountPage(data){
    //alert('populateFilterCountPage');
    $('.sort-by').empty();
    var labelElement = document.createElement("label");

    labelElement.id = "sortBy";
    labelElement.innerHTML = '<%=viewPerPageMsg%> :';
    labelElement.setAttribute('style', 'font-size:14px; float:left; padding-right:5px');

    $('.sort-by').append(labelElement);
    var labelElement = document.createElement("label");
    labelElement.id = "count";
    labelElement.innerHTML = data[1].label+" : ";
    $('.countpage').append(labelElement);
    var selectElement = $("<select></select>").attr("id", "page-size").attr("name", "page-size"); //document.createElement("select");

    selectElement.attr("aria-disabled","false");
    selectElement.attr("size","1");
    selectElement.attr("style","display: none;");

    var items = data[1].items;
    var selectedValue = "";
    $('.sort-by').append('<span id="pageSize" class="ui-widget ui-selectmenu-area" style="color: #474747; font-size: 14px;"><button type="button" aria-owns="page-size-menu" aria-haspopup="true" tabindex="0" href="#" role="button" id="page-size-button" class="ui-selectmenu ui-widget ui-state-default ui-selectmenu-dropdown ui-state-active ui-corner-top" style="width: 140px;" aria-disabled="false"><span class="ui-button-text">Select Page Size</span><span class="ui-button-icon-secondary ui-icon ui-icon-triangle-1-s"></span></button><ul id="pagesize-select-list" class="ui-selectmenu-list shadow border ui-corner-all ui-widget-content" style="width: 140px; max-height: 300px; visibility: visible; position: relative; top: 0px; left: 0px; display: none;"></ul></span>');
    /*Iterate the menu jsonarray.
     */
  $.each(items, function(index, element) {

      if(element.selected == true){

			selectElement.append($('<option></option>').val(element.path).html(element.label).attr('selected','selected'));
      }else{

          selectElement.append($('<option></option>').val(element.path).html(element.label));
      }



      if(element.selected == true){

		$('#pagesize-select-list').append('<li class="undefined selected ui-state-active" data-value="'+element.path+'" onClick="javascript:callService(\''+element.path+'\')">'+element.label+'</li>');
          $("#pageSize #page-size-button .ui-button-text").html(''+element.label+'');
      }else{
        $('#pagesize-select-list').append('<li class="undefined selected" data-value="'+element.path+'" onClick="javascript:callService(\''+element.path+'\')">'+element.label+'</li>');
        }

  });
    //Using .sort-by class for page size.It may have to change later.
  $('.sort-by').append(selectElement);

    $('#page-size-button').click(function(){
        $("#pagesize-select-list").show();
      });
    $("li").click(function(){
        $("#pagesize-select-list").hide();
        $("#page-size-button .ui-button-text").html($(this).html());
        });
  $("#show").change(function(){
      callService($("#show").val());
    });
}
</script>
