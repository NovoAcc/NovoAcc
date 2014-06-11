/*
 * Copyright 1997-2008 Day Management AG
 * Barfuesserplatz 6, 4001 Basel, Switzerland
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * Day Management AG, ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Day.
 */
/**
 * @class CQ.wcm.NotificationInbox
 * @extends CQ.Ext.Viewport
 * The NotificationInbox allows the user to subscribe to WCM actions
 * and manage notifications.
 * @constructor
 * Creates a new NotificationInbox.
 * @param {Object} config The config object
 */
CQ.wcm.NotificationInbox = CQ.Ext.extend(CQ.Ext.Viewport, {

    constructor: function(config) {
		this.debug = config.debug;

		// grid config
		var cm = new CQ.Ext.grid.ColumnModel([
  		    new CQ.Ext.grid.RowNumberer(),
  		    {
  		        "header":CQ.I18n.getMessage("Modification"),
  		        "dataIndex":"modification",
                 sortable: true
  		    },{
  		        "header":CQ.I18n.getMessage("Path"),
  		        "dataIndex":"path",
                 sortable: true 
  		    },{
  		        "header":CQ.I18n.getMessage("Date"),
  		        "dataIndex":"date", 
                 sortable: true
  		    },{
  		        "header":CQ.I18n.getMessage("User"),
  		        "dataIndex":"user",
                 sortable: true
  		    },{
  		        "header":CQ.I18n.getMessage("Read"),
  		        "dataIndex":"isRead",
                 sortable: true
  		    }
  		]);
  		cm.defaultSortable = true;

  		var sm = new CQ.Ext.grid.RowSelectionModel({
  			"singleSelect":true
  		});

  		var storeConfig = CQ.Util.applyDefaults(config.store, {
  			"autoLoad":true,
	        "proxy": new CQ.Ext.data.HttpProxy({
	        	"url":"/bin/wcm/notification/inbox/messages.json",
	        	"method":"GET"
	        }),
	        "baseParams":{
  			    "start":0,
  			    "limit":25
  		    },
	        "reader": new CQ.Ext.data.JsonReader({
	            "totalProperty": "results", "root": "messages","id":"id",
	            "fields": [ "id", "modification", "path", "date", "user",
	                        { "name":"isRead", "type":"bool" },
	                        { "name":"isUserMessage", "type":"bool" }
	            ]
	        })
	    });
  		var store = new CQ.Ext.data.GroupingStore(storeConfig);

		// init component by calling super constructor
		CQ.wcm.NotificationInbox.superclass.constructor.call(this, {
			"id":"cq-notification-inbox",
            "layout":"border",
            "renderTo":"CQ",
            "items": [
                {
                	"id":"cq-notification-inbox-wrapper",
                	"xtype":"panel",
                	"layout":"border",
                	"region":"center",
                	"border":false,
                	"items": [
						{
						    "id":"cq-header",
						    "xtype":"container",
						    "region":"north",
						    "autoEl":"div",
                            "cls": "cq-header-toolbar",
						    "items": [
						        new CQ.HomeLink({})
						    ]
						},
						{
				            "xtype": "grid",
				            "id":"cq-notification-inbox-grid",
				            "region":"center",
				            "margins":"5 5 5 5",
				            "pageSize":25,
				            "loadMask":true,
				            "stripeRows":true,
				            "cm":cm,
				            "sm":sm,
				            "viewConfig": new CQ.Ext.grid.GroupingView({
				                "forceFit":true,
				                "groupTextTpl": '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Messages" : "Message"]})'
				            }),
				            "bbar": new CQ.Ext.PagingToolbar({
				            	"pageSize": 25,
				            	"store": store,
				                "displayInfo": true,
				                "displayMsg": CQ.I18n.getMessage("Displaying messages {0} - {1} of {2}"),
				                "emptyMsg" : CQ.I18n.getMessage("No message to display")
				            }),
				            "tbar": [
								{
								    "id":"cq-notification-inbox-read",
								    "text":CQ.I18n.getMessage('Approve'),
								    "handler":this.approveMessage,
								    "tooltip": {
								        "title":CQ.I18n.getMessage('Approve the message'),
								        "text":CQ.I18n.getMessage('Approves a message and marks it as read.'),
								        "autoHide":true
								    }
								},
								{
								    "id":"cq-notification-inbox-remove",
								    "text":CQ.I18n.getMessage('Delete'),
								    "handler":this.deleteMessage,
								    "tooltip": {
								        "title":CQ.I18n.getMessage('Delete the message'),
								        "text":CQ.I18n.getMessage('Deletes a message.'),
								        "autoHide":true
								    }
								},
								{
								    "id":"cq-notification-inbox-config",
								    "text":CQ.I18n.getMessage('Configure...'),
								    "handler":this.showConfigDialog,
								    "tooltip": {
								        "title":CQ.I18n.getMessage('Configure subscriptions'),
								        "text":CQ.I18n.getMessage('Opens the subscription configuration dialog.'),
								        "autoHide":true
								    }
								}
				            ],
				            "store":store
				        }
                	]
                }
            ]
        });
    },

    initComponent : function() {
        CQ.wcm.NotificationInbox.superclass.initComponent.call(this);
    },

    reloadAll: function() {
    	CQ.Ext.getCmp("cq-notification-inbox-grid").getStore().reload();
    },

    approveMessage : function() {
    	var grid = CQ.Ext.getCmp("cq-notification-inbox-grid");
    	var selections = grid.getSelectionModel().getSelections();
    	for (var i=0; i<selections.length; i++) {
    		var selection = selections[i];
    		CQ.Ext.Ajax.request({
    			"url":CQ.HTTP.externalize("/bin/wcm/notification/inbox/action.json"),
    			"success":CQ.Ext.getCmp("cq-notification-inbox-grid").getStore().reload(),
    			"failure":function() {
    				CQ.Ext.Msg.alert("Error", "Could not approve message: "
    					+ selection.id)
    			},
    			"params":{
    				"path":selection.id,
    				"cmd":"approve"
    			}
     		});
    	}
    	grid.getStore().reload();
    },

    deleteMessage : function() {
    	var grid = CQ.Ext.getCmp("cq-notification-inbox-grid");
    	var selections = grid.getSelectionModel().getSelections();
    	for (var i=0; i<selections.length; i++) {
    		var selection = selections[i];
    		CQ.Ext.Ajax.request({
    			"url":CQ.HTTP.externalize("/bin/wcm/notification/inbox/action.json"),
    			"success":CQ.Ext.getCmp("cq-notification-inbox-grid").getStore().reload(),
    			"failure":function() {
    				CQ.Ext.Msg.alert("Error", "Could not remove message: "
    					+ selection.id)
    			},
    			"params":{
    				"path":selection.id,
    				"cmd":"delete"
    			}
     		});
    	}
    	grid.getStore().reload();
    },

    showConfigDialog : function() {
		// grid config
        function formatExact(value) {
        	if ( value == "true" ) {
        		return CQ.I18n.getMessage("Yes");
        	}
        	return CQ.I18n.getMessage("No");
        };
        function formatRule(value) {
        	if ( value == "true" ) {
        		return CQ.I18n.getMessage("Allow");
        	}
        	return CQ.I18n.getMessage("Deny");
        };

		var cm = new CQ.Ext.grid.ColumnModel([
  		    {
  		        "header":CQ.I18n.getMessage("Path"),
  		        "dataIndex":"path",
   		        "editor": new CQ.Ext.form.TextField({
  	               "allowBlank": false
    	        })

  		    },
  		    {
  		    	"header": CQ.I18n.getMessage("Exact?"),
     	        "dataIndex": "exact",
  		        "renderer":formatExact,
     	        "editor": new CQ.Ext.form.ComboBox({
     	        	"store":[["true",CQ.I18n.getMessage("Yes")],["false",CQ.I18n.getMessage("No")]],
     	            "triggerAction" : "all"
     	        })
  		    },
  		    {
  		        "header":CQ.I18n.getMessage("Rule"),
  		        "dataIndex":"allow",
  		        "renderer":formatRule,
     	        "editor": new CQ.Ext.form.ComboBox({
     	        	"store":[["true",CQ.I18n.getMessage("Allow")],["false",CQ.I18n.getMessage("Deny")]],
     	     	    "triggerAction" : "all"
     	        })

  		    }
  		]);

		var addAction = new CQ.Ext.Action({
		    "cls":"cq-notification-subscriptions-add",
		    "text":CQ.I18n.getMessage('Add'),
		    "handler":function() {store.add(new CQ.Ext.data.Record({"path":"", "exact":"true", "allow":"true"}));},
		    scope:this,
		    "tooltip": {
		        "title":CQ.I18n.getMessage('Add a subscription'),
		        "text":CQ.I18n.getMessage('Adds a new subscription.'),
		        "autoHide":true
		    }
		});

		var removeAction = new CQ.Ext.Action({
		    "cls":"cq-notification-subscriptions-remove",
		    "text":CQ.I18n.getMessage('Delete'),
		    "disabled":true,
		    "handler":function() {
		    	var grid = CQ.Ext.getCmp("cq-notification-subscriptions-grid");
		    	var selections = grid.getSelectionModel().getSelections();
		    	for (var i=0; i<selections.length; i++) {
		    		var selection = selections[i];
		    		grid.getStore().remove(selection);
		    	}
		    },
		    "tooltip": {
		        "title":CQ.I18n.getMessage('Delete the subscription'),
		        "text":CQ.I18n.getMessage('Deletes a subscription.'),
		        "autoHide":true
		    }
		});
		var actions = [ addAction, removeAction ];

		var sm = new CQ.Ext.grid.RowSelectionModel({
  			"singleSelect":false,
  			listeners: {
		        selectionchange: function(selectionModel) {
		            if (selectionModel.hasSelection()) {
		                removeAction.setDisabled(false);
		            } else {
		                removeAction.setDisabled(true);
		            }
		        }
		    }
  		});

  		var options = [{
            value: "Activate",
            text: CQ.I18n.getMessage("Activated")
        },
        {
            value: "Deactivate",
            text: CQ.I18n.getMessage("Deactivated")
        },
        {
            value: "Delete",
            text: CQ.I18n.getMessage("Deleted (syndication)")
        },
        {
            value: "PageModified",
            text: CQ.I18n.getMessage("Modified")
        },
        {
            value: "PageCreated",
            text: CQ.I18n.getMessage("Created")
        },
        {
            value: "PageDeleted",
            text: CQ.I18n.getMessage("Deleted")
        },
        {
            value: "PageRolledOut",
            text: CQ.I18n.getMessage("Rolled out")
        }
        ];

  		var storeConfig =  {
  			"autoLoad":true,
	        "proxy": new CQ.Ext.data.HttpProxy({
	        	"url":"/bin/wcm/notification/config.json",
	        	"method":"GET"
	        }),
	        "baseParams":{
  			    "start":0,
  			    "limit":25
  		    },
  		    "listeners": {
  		    	load: function(theStore, records, options) {
     		    	var channelTypeWidget = CQ.Ext.getCmp("inbox-channel-combo");
     		    	channelTypeWidget.setValue(storeConfig.reader.jsonData.type);

   		            var actionsWidget = CQ.Ext.getCmp("inbox-actions-selection");
                    actionsWidget.setValue(storeConfig.reader.jsonData.actions);
                }
  		    },
	        "reader": new CQ.Ext.data.JsonReader({
	            "totalProperty": "results", "root": "configs",
	            "fields": [ "path", "exact", "allow"]
	        })
	    };
  		var store = new CQ.Ext.data.GroupingStore(storeConfig);

        var createDialog = {
            "jcr:primaryType": "cq:Dialog",
            "title":CQ.I18n.getMessage("Subscribe..."),
    	    "buttons": [
    	                  {
    	    	              "text": CQ.I18n.getMessage("OK"),
    	    	              "handler": function() {

    	                	      var channelTypeWidget = CQ.Ext.getCmp("inbox-channel-combo");

    	                	      var actionsWidget = CQ.Ext.getCmp("inbox-actions-selection");

    	                	      var records = new Array(store.getCount());
             		    	      for(var i=0; i<store.getCount(); i++) {
             		    	    	  var r = store.getAt(i);
             		    	    	  records[i] = new Array(3);
             		    	    	  records[i][0] = r.get("path");
             		    	    	  records[i][1] = r.get("exact");
             		    	    	  records[i][2] = r.get("allow");
             		    	      }
    	    	                  CQ.HTTP.post(
    	    			              "/bin/wcm/notification/config.json",
    	    			              function(options, success, response) {
    	    			                  if (success) {
    	    			                      dialog.hide();
    	    			                  }
    	    			              },
    	    			              {
    	    			                  "type": channelTypeWidget.getValue(),
                                          "actions":actionsWidget.getValue(),
                                          "configs":CQ.Ext.util.JSON.encode(records)
    	    			              }
    	    			          );
    	    	              }
   	                  },
   	                  CQ.Dialog.CANCEL
  	            ],
    	    "items": {
                "jcr:primaryType": "cq:Panel",
                "items": {
                    "jcr:primaryType": "cq:WidgetCollection",
   		            "channel": {
   		                "xtype": "combo",
    		            "fieldLabel": CQ.I18n.getMessage("Select Notification Channels"),
    		            "editable":false,
    		            "id":"inbox-channel-combo",
                        "triggerAction": "all",
    		            "store":[
                            [ "inbox", CQ.I18n.getMessage("Inbox")],
                            [ "email", CQ.I18n.getMessage("Email")]
                        ]
    		        },
    		        "actions": {
    		            "xtype": "selection",
    		            "type": "checkbox",
    		            "fieldLabel": CQ.I18n.getMessage("Select actions to be notified"),
    		            "editable":false,
    		            "id":"inbox-actions-selection",
    		            "options":options
    		        },
    		        "sub1": {
    		            "xtype": "label",
    		            "text": CQ.I18n.getMessage("Define Packages")
    		        },
    		        "subscriptions" : {
			            "xtype": "editorgrid",
			            "id":"cq-notification-subscriptions-grid",
			            "region":"center",
			            "anchor":"-30 -100",
			            "margins":"5 5 5 5",
			            "loadMask":true,
			            "stripeRows":true,
			            "clicksToEdit":1,
			            "cm":cm,
			            "sm":sm,
			            "viewConfig": new CQ.Ext.grid.GroupingView({
			                "forceFit":true
			            }),
			            "tbar": actions,
			            "store":store,
			            "listeners": {
			                rowcontextmenu: function(grid, index, e) {
			                    if (!this.contextMenu) {
			                        this.contextMenu = new CQ.Ext.menu.Menu({
			                            items: actions
			                        });
			                    }
			                    var xy = e.getXY();
			                    this.contextMenu.showAt(xy);
			                    e.stopEvent();
			                }
			            }
    		        }
                }
            }
        };
        var dialog = CQ.WCM.getDialog(createDialog, "cq.notification.inbox.dialog");
    	dialog.failure = function(){CQ.Ext.Msg.alert("Error", "Could not save subscriptions.")};
    	dialog.show();
    }
});

CQ.Ext.reg("notificationinbox", CQ.wcm.NotificationInbox);