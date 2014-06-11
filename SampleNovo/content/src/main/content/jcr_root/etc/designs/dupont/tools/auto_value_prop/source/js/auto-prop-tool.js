(function($) { 
    $("#value-proposition-module-html .valuePropositionModule .valuePropNav ul li").hover(
        function(){$(this).animate({opacity: 0.60}, 500, function(){});},
        function(){$(this).animate({opacity: 1.0}, 500, function() {});}
    );
    $("#value-proposition-module-html .valuePropositionModuleWrapper").mouseleave(function(){showDefaultStateForModule();});
    $("#value-proposition-module-html .valuePropositionModule .valuePropNav ul li a").click(
        function(e){e.preventDefault(); var thisElement = $(this); selectModuleSection(thisElement);}
    );
    $("#value-proposition-module-html .valuePropositionModule .valuePropNav ul li a").hover(
        function(){var thisElement = $(this); selectModuleSection(thisElement);}, function(){}
    );
    $("#value-proposition-module-html .valuePropositionModule .valuePropNav ul li a").each(function(){$(this).removeAttr("href");});
    var animationInAction = 0;
    var nextAnimationInQueue = "";
    function selectModuleSection (current_element) {
        if(animationInAction == 0){
            var thisParentLi = current_element.parent().attr("id");
            var thisContentDiv = thisParentLi.replace("_nav_element","");
            updateStateBackgroundForModule(thisContentDiv);
            if($("#" + thisParentLi).hasClass("active") == false){
                animationInAction = 1;
                $("#value-proposition-module-html .valuePropositionModule .active").removeClass("active");
                $("#value-proposition-module-html .valuePropositionModule .visible").fadeOut("fast", function(){
                    $("#value-proposition-module-html .valuePropositionModule .visible").removeClass("visible");
                    $("#" + thisContentDiv).fadeIn("fast", function(){
                        animationInAction = 0; 
                        triggerNextAnimationInQueueForClickableModule();
                    });
                    if($("#value-proposition-module-html .valuePropositionModule .active").length == 0 && $("#value-proposition-module-html .valuePropositionModule .visible").length == 0){
                        $("#" + thisParentLi).addClass("active");
                        $("#" + thisContentDiv).addClass("visible");
                    }
                    else{
                        $("#" + thisParentLi + " a").trigger('click');
                    }
                }); 
            };
        }
        else{
            var thisParentLi = current_element.parent().attr("id");
            addModuleAnimationToQueueForClickableModule(thisParentLi);
        }
    }
    function showDefaultStateForModule(){
        if(animationInAction == 0){
            animationInAction = 1;
            $("#value-proposition-module-html .valuePropositionModule .active").removeClass("active");
            $("#value-proposition-module-html .valuePropositionModule .visible").fadeOut("fast", function(){
                $("#value-proposition-module-html .valuePropositionModule .visible").removeClass("visible");
                updateStateBackgroundForModule("value_prop_content_0");
                $("#value_prop_content_0").fadeIn("fast", function(){
                    if($("#value-proposition-module-html .valuePropositionModule .visible").length == 0){
                        $("#value_prop_content_0").addClass("visible"); 
                        animationInAction = 0; 
                    }
                    else{
                        animationInAction = 0;
                        addModuleAnimationToQueueForClickableModule("default");
                        triggerNextAnimationInQueueForClickableModule();
                    }
                });
            }); 
        }
        else{addModuleAnimationToQueueForClickableModule("default");}
    }
    function addModuleAnimationToQueueForClickableModule(next_element_in_queue){nextAnimationInQueue = next_element_in_queue;}
    function triggerNextAnimationInQueueForClickableModule(){
        if(nextAnimationInQueue != ""){
            if(nextAnimationInQueue == "default"){showDefaultStateForModule();}
            else{$("#" + nextAnimationInQueue + " a").trigger('click');}
            nextAnimationInQueue = "";
        }
    }
    function updateStateBackgroundForModule(content_div_id){
        var currentStateClassName = $("#" + content_div_id + " > .valuePropContentWrap").attr("class").replace("valuePropContentWrap ","");
        $("#value-proposition-module-html .valuePropositionModule").removeClass($("#value-proposition-module-html .valuePropositionModule").attr("data-current-state"));
        $("#value-proposition-module-html .valuePropositionModule").addClass(currentStateClassName);
        $("#value-proposition-module-html .valuePropositionModule").attr("data-current-state", currentStateClassName);
    }
})(jQuery);