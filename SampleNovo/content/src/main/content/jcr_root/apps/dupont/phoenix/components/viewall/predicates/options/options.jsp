<%--
  Copyright 1997-2009 Day Management AG
  Barfuesserplatz 6, 4001 Basel, Switzerland
  All Rights Reserved.

  This software is the confidential and proprietary information of
  Day Management AG, ("Confidential Information"). You shall not
  disclose such Confidential Information and shall use it only in
  accordance with the terms of the license agreement you entered into
  with Day.

  ==============================================================================

  Type Predicate component

--%><%@ page import="java.util.Calendar,com.day.cq.wcm.api.designer.Style"
             import="org.apache.commons.lang3.StringEscapeUtils" %><%
%><%@include file="/libs/wcm/global.jsp"%><%

	Style siteConfigViewAllProps = currentDesign.getStyle("siteconfig/viewallfacets");
    String elemId = "cq-predicate-" +  Long.toString(Calendar.getInstance().getTimeInMillis());;
    String propertyPath = properties.get("propertyPath", "jcr:content/cq:tags");
    String predicateName = properties.get("predicateName", ""); // default set in js
    String title = properties.get("title", "");
    
    String collapse = properties.get("collapse", String.class);
    if(collapse==null) {
    	//try to use site config property
		if(siteConfigViewAllProps!=null) {
			collapse = siteConfigViewAllProps.get("collapse","level1");
		} else {
			collapse = "level1";
		}
    }
    String triggerSearch = properties.get("triggerSearch", "true");
    // note: no UI for searchTimeoutTime / settable in CQ delight/CRX
    String searchTimeoutTime = properties.get("searchTimeoutTime", "800");

    String[] optionsPaths = properties.get("optionsPath", new String[0]);
    String[] tagOptionsPaths = properties.get("optionsPath", new String[0]);
    if(optionsPaths.length==0) {
    	//try to use site config property
		if(siteConfigViewAllProps!=null) {
			optionsPaths = siteConfigViewAllProps.get("optionsPath", new String[0]);
		    tagOptionsPaths = siteConfigViewAllProps.get("optionsPath", new String[0]);
		}
    }

    String selectors[] = slingRequest.getRequestPathInfo().getSelectors();
	String contentType =  selectors != null & selectors.length > 1 ? selectors[1] : "";
    
    // sanitize paths to use local values.jsp to fetch protected paths. restrict to /libs/dam/options
    String[] newOptionsPaths = new String[optionsPaths.length];
    for (int i=0; i<optionsPaths.length; i++) {
        String path = optionsPaths[i];
        //if (path.startsWith("/libs/dam/options/")) {
            newOptionsPaths[i] = String.format("%s.values.%s.%s.json", resource.getPath(), i , contentType);
        //}
    }

%><div id="<%= elemId %>" class="optionspredicatebox"></div>
<script type="text/javascript">

    CQ.Ext.onLoad(function() {

        var CQ_search_optionsPredicate = {
            "counter": 0,
            "controls": {},
            "title": "<%= StringEscapeUtils.escapeHtml4(title) %>",
            "predicateName": "<%= StringEscapeUtils.escapeHtml4(predicateName) %>",
            "propertyPath": "<%= StringEscapeUtils.escapeEcmaScript(propertyPath) %>",
            "groupId": CQ.search.Util.getQueryBuilder().createGroupId(),
            "collapse": "<%= StringEscapeUtils.escapeEcmaScript(collapse) %>",
            "searchTimeoutId": 0,
            "searchTimeoutTime": <%= StringEscapeUtils.escapeEcmaScript(searchTimeoutTime) %>,
            "triggerSearch": <%= StringEscapeUtils.escapeEcmaScript(triggerSearch) %>,
            "paths": [<%
                for (int i = 0; i < newOptionsPaths.length; i++) {
                    %><%= i != 0 ? "," : "" %>"<%= StringEscapeUtils.escapeEcmaScript(newOptionsPaths[i]) %>"<%
                }
            %>],
            "tagPaths": [<%
                      for (int i = 0; i < tagOptionsPaths.length; i++) {
                          %><%= i != 0 ? "," : "" %>"<%= StringEscapeUtils.escapeEcmaScript(tagOptionsPaths[i]) %>"<%
                      }
            %>],

            init: function() {
                this.panel = new CQ.Ext.Panel({
                    "renderTo": "<%= elemId %>",
                    "border": false
                });

                this.options = this.getOptions();

                if (this.title) {
                    // add additional top level
                    this.options = {
                        "jcr:title": this.title,
                        subs: this.options
                    };
                }

                this.traverseOption(this.options, this.panel, 0, "");

                // add hidden after traverse options to keep panel items[0] (for collapse)
                this.panel.add(new CQ.Ext.form.Hidden({
                    "name": this.groupId + "." + this.predicateName,
                    "value": this.propertyPath
                }));
                this.panel.add(new CQ.Ext.form.Hidden({
                    "name": this.groupId + ".p.or",
                    "value": "true"
                }));

                switch (this.collapse) {
                    case "none":
                        break;
                    case "level0":
                        this.toggle(this.panel.items.get(0));
                        break;
                    default:
                        // hide sub panels
                        var p0 = this.panel.items.get(0);
                        if (p0.subPanel) {
                            var c = p0.subPanel.items.getCount();
                            for (var i = 0; i < c; i++) {
                                this.toggle(p0.subPanel.items.get(i));
                            }
                        }
                }

                this.panel.doLayout();
            },

            /**
             * Requests the options
             * @private
             */
            getOptions: function() {
                var options = {};

                for (var i = 0; i < this.paths.length; i++) {
                    var tagId = "";
                    var path = this.paths[i];
					//alert("getOptions:"+path);
                    if (path.lastIndexOf(".json") != path.length - ".json".length) {
                        // do not touch paths that ends with ".json" already
                        // otherwise add ".infinity.json"
                        path += ".infinity.json";
                    }

                    // workaround to allow handling of tags with .infinity.json (which does not provide the tagId):
                    // the tagId is build from the path
                    var tagIdPath = this.tagPaths[i]; 
                    if (tagIdPath.indexOf("/etc/tags") == 0) {
                        //todo: switch to tagid predicate (if not overwritten in component config)
                        //if (!this.predicateName) predicateName = "tagid";

                        tagId = tagIdPath.replace("/etc/tags", "");
                        if (tagId === "") {
                            // optionsPath is the tag root path, e.g. "/etc/tags" => ":"
                            // colon is used later on to identify root path
                            tagId = ":";
                        }
                        else {
                            tagId = tagId.replace("/", "");
                            if (tagId.indexOf("/") != -1) {
                                // optionsPath is a tag's path, e.g. "/etc/tags/stockphotography/animals" => "stockphotography:animals"
                                tagId = tagId.replace("/", ":");
                            }
                            // else optionsPath is a namespace's path, e.g. "/etc/tags/stockphotography" => "stockphotography"
                        }
                    }
                    
                    //alert("getOptions tagId:"+tagId);
					//alert("Tags path option fetcher:"+path);
                    var resp = CQ.HTTP.eval(path);
                    if (!resp) continue;
                    if (resp instanceof Array) {
                        for (var j=0;j<resp.length; j++) {
                            options["o" + i + "_" + j] = resp[j];
                            options["o" + i + "_" + j].tagId = tagId;
                        }
                    } else {
                        options["o" + i] = resp;
                        options["o" + i].tagId = tagId;
                    }

                }
                if (!this.predicateName) this.predicateName = "property";

                return options;
            },

            /**
             * Checks if an option has sub options.
             * @private
             */
            isLeaf: function(option) {
                for (property in option) {
                    if (CQ.Ext.type(option[property]) == "object") {
                        return false;
                    }
                }
                return true;
            },

            /**
             * Unchecks the checkboxes of the parents (titles) of a widget.
             * @param widget The widget
             * @private
             */
            uncheckParents: function(widget) {
                while (widget) {
                    widget = widget.findParentBy(function(panel) {
                        if (panel.titleCheckbox) return true;
                    });
                    if (widget) widget.titleCheckbox.setValue(false, true);
                }
                return true;
            },

            /**
             * Expands resp. collapses the specified panel.
             * @param panel
             */
            toggle: function(panel) {
                if (!panel.subPanel) return;
                if (panel.subPanel.hidden) {
                    panel.toggle.removeClass("expand");
                    panel.toggle.addClass("collapse");
                    panel.subPanel.show();
                    // because of hideMode="offsets" IE requires that every
                    // item is shown to properly display the sub panels
                    for (var i = 0; i < panel.subPanel.items.getCount(); i++) {
                        panel.subPanel.items.get(i).show();
                    }
                }
                else {
                    panel.toggle.removeClass("collapse");
                    panel.toggle.addClass("expand");
                    panel.subPanel.hide();
                }
            },

            /**
             * Submits the Query Builder after a short timeout. Thanks to the timeout
             * it is possible to check/uncheck multiple checkboxes without
             * triggering a search every time.
             * @private
             */
            search: function() {
                if (this.triggerSearch) {
                    window.clearTimeout(this.searchTimeoutId);
                    this.searchTimeoutId = window.setTimeout(function() {
                        var qb = CQ.search.Util.getQueryBuilder();
                        if (qb) CQ.search.Util.getQueryBuilder().submit();
                    }, this.searchTimeoutTime);
                }
            },

            /**
             * Renders the specified option and traverses its sub options.
             * @param option The option
             * @param parentPanel The panel where this option is added to
             * @param level The level - required for CSS classes
             * @param tagId The prefix for tag ids (optional)
             * @private
             */
            traverseOption: function(option, parentPanel, level, tagId) {
				//alert("level:"+level+ "option:"+tagId);
				if(level==0 && this.isLeaf(option)) return;
                // the option is tag => pass tag id to the sub options
                if (option.tagId) tagId = option.tagId;

                if (!this.isLeaf(option)) {
                    // title option with sub options
                    var panel;

                    if (option["jcr:title"]) {
                        // option has a title: draw title with a checkbox to check/uncheck the entire group

                        var name = "";
                        var value = "";
                        if (tagId && (tagId != ":" || tagId.indexOf(":") == -1)) {
                            // "tag titles" are tags itself and need to be submitted
                            this.counter++;
                            name = this.groupId + "." +  this.predicateName + "." + this.counter + "_value";
                            value = tagId;
                        }

    					//alert("leaf"+name);
                        var checkbox = new CQ.Ext.form.Checkbox({
                            "boxLabel": option["jcr:title"],
                            "inputValue": value,
                            "name": name
                        });

                        // toggle button to toggle the subPanel
                        var toggle = new CQ.Ext.Button({
                            "cls": "collapse"
                        });

                        panel = new CQ.Ext.Panel({
                            "cls": "leftpadding level" + level,
                            "border": false,
                            "toolTarget": "toolbar",
                            "tbar": [
                                checkbox,
                                "->",
                                toggle
                             ]
                        });

                        checkbox.on("check", function(cbox, checked) {
                            if (!checked) CQ_search_optionsPredicate.uncheckParents(cbox);
                            CQ_search_optionsPredicate.search();
                            panel.cascade(function(o) {
                                if (o instanceof CQ.Ext.form.Checkbox) {
                                    o.setValue(checked, true);
                                }
                                else if (o.titleCheckbox) {
                                    o.titleCheckbox.setValue(checked, true);
                                }
                                return true;
                            });
                        });

                        var op = this;
                        toggle.on("click", function() {
                            op.toggle(panel);
                        });


                        panel.toggle = toggle;
                        panel.titleCheckbox = checkbox;

                        // add panel for sub items
                        panel.subPanel = new CQ.Ext.Panel({
                            "border":false,
                            "cls": "subpanel",
                            "hideMode": "offsets"
                        });
                        panel.add(panel.subPanel);

                        parentPanel.add(panel);

                        level++;
                    }

                    for (var sub in option) {
                        if (CQ.Ext.type(option[sub]) == "object") {
                            var nextTagId = "";
                            if (tagId) {
                                if (tagId == ":") {
                                    // tag root: sub are namespaces
                                    nextTagId = sub + ":";
                                }
                                else if (tagId.indexOf(":") == -1) {
                                    // tagId is namespace
                                    nextTagId = tagId + ":" + sub;
                                }
                                else {
                                    // tagId is tag
                                    nextTagId = tagId + "/" + sub;
                                }
                            }
                            this.traverseOption(option[sub], panel ? panel.subPanel : parentPanel, level, nextTagId);
                        }
                    }
                }
                else {
                    // leaf option
                    this.counter++;
                    var value = option["value"] ? option["value"] : "";
                    if (!value && tagId) value = tagId;
                    var title = option["jcr:title"] ? option["jcr:title"] : value;
					//alert("leaf:"+title);

                    var checkbox = new CQ.Ext.form.Checkbox({
                        "boxLabel": title,
                        "name": this.groupId + "." +  this.predicateName + "." + this.counter + "_value",
                        "inputValue": value
                    });

                    // register the checkbox
                    //todo: not save: same value in different fieldsets possible
                    this.controls[option["value"]] = checkbox;

                    checkbox.on("check", function(cbox, checked) {
                        if (!checked) {
                            // uncheck leaf checkbox: uncheck according fieldset checkboxes
                            CQ_search_optionsPredicate.uncheckParents(cbox);
                        }

                        CQ_search_optionsPredicate.search();
                    });

//                    checkbox.on("hide", function(e) {
//                        e.findParentByType("fieldset").bubble(function(o){
//                            var checkboxes = o.findByType("checkbox");
//                            var onevisible = false;
//                            for (var i=0;i<checkboxes.length;i++) {
//                                if (checkboxes[i].isVisible()||checkboxes[i].getValue()) {
//                                    onevisible = true;
//                                }
//                                if (onevisible) {
//                                    o.show();
//                                } else {
//                                  o.hide();
//                                }
//                            }
//                            return true;
//                            });
//                        });

                    parentPanel.add(checkbox);
                }
            },

            update: function(result) {
//                for (var item in this.controls) {
//                    var control = this.controls[item];
//                    control.hits = 0;
//                }
//
//                for (var fac in result.facets) {
//                    var facet = result.facets[fac];
//                    for (var i=0;i<facet.length;i++) {
//                        if (this.controls[facet[i].value]!=undefined) {
//                            var control =  this.controls[facet[i].value];
//                            control.hits = facet[i].count;
//
//                            control.labelEl.dom.innerHTML = control.boxLabel + " (" + facet[i].count + ")";
//
//                            //this.controls[facet[i].value].labelEl.dom.innerHTML = "foo";
//                            // = this.controls[facet[i].value].boxLabel + "
////                                console.log("found: " + this.controls[facet[i].value] + " " + facet[i].count);
//                        } else {
////                                console.log("uncategorized: " + facet[i].value);
//                        }
//                    }
//                    break;//all groups are the same
//                }

                //todo: problem on 09-09-16: hides entire control on initial search
//                for (var item in this.controls) {
//                    var control = this.controls[item];
//                        if (control.hits==0&&control.getValue!=true) {
//                            control.hide();
//                        } else {
//                            control.show();
//                        }
//                    }
              }
        };

        CQ_search_optionsPredicate.init();
        CQ.search.Util.getQueryBuilder().on("loadResult", CQ_search_optionsPredicate.update, CQ_search_optionsPredicate);

});
</script>
