CQ.wcm.SiteAdmin.scheduleForActivation = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    // show dialog
    var scheduleForActivationDialog = {
        "jcr:primaryType": "cq:Dialog",
        "height": 240,
        "title":CQ.I18n.getMessage("Activate Later"),
        "id": CQ.Util.createId("cq-activate-later-dialog"),
        "params": {
            "_charset_":"utf-8"
        },
        "items": {
            "jcr:primaryType": "cq:Panel",
            "items": {
                "jcr:primaryType": "cq:WidgetCollection",
                "absTime": {
                    "xtype": "datetime",
                    "fieldLabel":CQ.I18n.getMessage("Activation Date"),
                    "fieldDescription":"Date/time refer to Eastern Standard Time (EST - Wilmington, DE)",
					"name":"absTime",
                    "defaultValue":"now"
                }
            }
        },
        "buttons": {
            "jcr:primaryType":"cq:WidgetCollection",
            "custom": {
                "text":CQ.I18n.getMessage("OK"),
                "cls": "cq-btn-create",
                "handler":function() {
                    admin.mask();
                    var dlg = this;
                    //#35320 - force blur to get newest value in IE
                    if(CQ.Ext.isIE) this.getField("absTime").onBlur();
                    var dateTime = this.getField("absTime").getValue();

                    var selections = admin.getSelectedPages();
                    var paths = [];
                    for (var i = 0; i < selections.length; i++) {
                        paths.push(selections[i].id);
                    }
                    if (CQ.wcm.SiteAdmin.noAsset()) {
                        var data = {
                            id: CQ.Util.createId("cq-asset-reference-search-dialog"),
                            path: paths,
                            callback: function(p) {
                                CQ.wcm.SiteAdmin.internalScheduleForActivation.call(admin, dateTime, p);
                                dlg.hide();
                            }
                        };
                        new CQ.wcm.AssetReferenceSearchDialog(data);
                    } else {
                        CQ.wcm.SiteAdmin.internalScheduleForActivation.call(admin, dateTime, paths);
                        this.hide();
                    }
                }
            },
            "cancel":CQ.Dialog.CANCEL
        }
    };
    var dialog = CQ.WCM.getDialog(scheduleForActivationDialog);
    dialog.show();
};

CQ.wcm.SiteAdmin.scheduleForDeactivation = function() {
    var admin = CQ.Ext.getCmp(window.CQ_SiteAdmin_id);
    // show dialog
    var scheduleForActivationDialog = {
        "jcr:primaryType": "cq:Dialog",
        "height":240,
        "title":CQ.I18n.getMessage("Deactivate Later"),
        "id": CQ.Util.createId("cq-deactivate-later-dialog"),
        "params": {
            "_charset_":"utf-8"
        },
        "items": {
            "jcr:primaryType": "cq:Panel",
            "items": {
                "jcr:primaryType": "cq:WidgetCollection",
                "absTime": {
                    "xtype": "datetime",
                    "fieldLabel":CQ.I18n.getMessage("Deactivation Date"),
                    "fieldDescription":"Date/time refer to Eastern Standard Time (EST - Wilmington, DE)",
                    "name":"absTime",
                    "defaultValue":"now"
                }
            }
        },
        "buttons": {
            "jcr:primaryType":"cq:WidgetCollection",
            "custom": {
                "text":CQ.I18n.getMessage("OK"),
                "cls": "cq-btn-create",
                "handler":function() {
                    admin.mask();
                    //#35320 - force blur to get newest value in IE
                    if(CQ.Ext.isIE) this.getField("absTime").onBlur();
                    var dateTime = this.getField("absTime").getValue();

                    var selections = admin.getSelectedPages();
                    var paths = [];
                    for (var i = 0; i < selections.length; i++) {
                        paths.push(selections[i].id);
                    }
                    // create params
                    var params = {
                        "_charset_":"UTF-8",
                        "model":"/etc/workflow/models/scheduled_deactivation/jcr:content/model",
                        "absoluteTime": dateTime.getTime(),
                        "payload":paths,
                        "payloadType":"JCR_PATH"
                    };

                    CQ.HTTP.post("/etc/workflow/instances",
                        function(options, success, response) {
                            if (!success) {
                                CQ.Ext.Msg.alert(
                                    CQ.I18n.getMessage("Error"),
                                    CQ.I18n.getMessage("Could not schedule page for deactivation."));
                            } else {
                                admin.reloadPages();
                            }
                        },
                        params
                    );
                    this.hide();
                }
            },
            "cancel":CQ.Dialog.CANCEL
        }
    };
    var dialog = CQ.WCM.getDialog(scheduleForActivationDialog);
    dialog.show();
};