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

//noinspection JSUnusedLocalSymbols
CQ.security.AuthorizableList = CQ.Ext.extend(CQ.Ext.grid.GridPanel, {

    authStore:null,

    constructor: function(config) {

        var storeConfig = CQ.Util.applyDefaults(config.store, {
            "storeId":"cq-useradmin-authstore",
            "autoLoad":true,
            "proxy": new CQ.Ext.data.HttpProxy({
                "url":"/bin/security/authorizables.json",
                "method":"GET"
            }),
            "baseParams": {
                "limit":25,
                "_charset_":"utf-8"
            },
            "reader": new CQ.security.data.AuthReader()
        });
        var authStore = new CQ.Ext.data.Store(storeConfig);
        this.authStore = authStore;
        // actions
        var actions = [];
        var disabledActions = [];
        var ctxActions = [];

        var hideUsers = new CQ.Ext.Action({
            "cls":"cq-useradmin-hideUsers",
            "text":CQ.I18n.getMessage("Hide Users"),
            "enableToggle":true,
            "toggleGroup":"hide",
            "tooltip":{
                "title":CQ.I18n.getMessage("Hide Users"),
                "text":CQ.I18n.getMessage("Press to prevent users from being listed"),
                "autoHide":true
            },
            "toggleHandler": function(button, pressed) {
                authStore.baseParams["hideUsers"] = pressed;
                authStore.load();
            }
        });
        var hideGroups = new CQ.Ext.Action({
            "cls":"cq-useradmin-hideGroups",
            "text":CQ.I18n.getMessage("Hide Groups"),
            "enableToggle":true,
            "toggleGroup":"hide", 
            "tooltip":{
                "title":CQ.I18n.getMessage("Hide Groups"),
                "text":CQ.I18n.getMessage("Press to prevent groups from being listed"),
                "autoHide":true
            },
            "toggleHandler": function(button, pressed) {
                authStore.baseParams["hideGroups"] = pressed;
                authStore.load();
            }
        });
        var filter = new CQ.security.FilterField({
            "store":authStore,
            "loadParams":{"start":0}
        });
        actions.push(filter);
        if (!config.hideFilter) {
            actions.push(" ");
            actions.push(hideUsers);
            actions.push(" ");
            actions.push(hideGroups);

            actions.push("->");
            actions = actions.concat(
                    this.formatActions(config.actions, disabledActions, ctxActions));
        }

        // authorizable list (grid) config
        var cm = config.columnModel ? config.columnModel : new CQ.Ext.grid.ColumnModel([{
            "header":CQ.I18n.getMessage("Type"),
            "dataIndex":"type",
            "width":30,
            "fixed":true,
            "resizable":false,
            "hideable":false,
            "renderer":CQ.security.AuthorizableList.renderIcon
        },{
            "header":CQ.I18n.getMessage("ID"),
            "width":150,
            "dataIndex":"id",
             sortable: true,
        },{
            "header":CQ.I18n.getMessage("Name"),
            "dataIndex": "name",
            sortable: true,
            "renderer": function(val, meta, rec) {
                if(rec["data"][CQ.shared.XSS.getXSSPropertyName("givenName")]) {
                        return CQ.I18n.getMessage(
                           "{0} {1}",
                           [rec["data"][CQ.shared.XSS.getXSSPropertyName("givenName")], rec["data"][CQ.shared.XSS.getXSSPropertyName("familyName")]],
                           "name display order: {0} is the given (first) name, {1} the family (last) name"
                        );
                }
                return CQ.shared.XSS.xssPropertyRenderer(val, meta, rec, this);
            }
        },{
            "header":CQ.I18n.getMessage("Pub.", null, "Abbreviation of the word published"),
            "width":48,
            "renderer": function(v, params, record) {
                var clazz = "";
                var title = " title=\"";
                var repl = record.get("replication");
                if (repl && repl.published) {
                    if (repl.numQueued > 0) {
                        clazz = "status-pending";
                        if (repl.action == "ACTIVATE") {
                            title += CQ.I18n.getMessage("Activation pending. #{0} in Queue.", repl.numQueued);
                        } else {
                            title += CQ.I18n.getMessage("Deactivation pending. #{0} in Queue.", repl.numQueued);
                        }
                    } else {
                        title += CQ.Ext.util.Format.date(new Date(repl.published));
                        title += " (" + CQ.shared.XSS.getXSSTablePropertyValue(repl, "publishedBy") + ")";
                        if (repl.action == "ACTIVATE") {
                            clazz = "status-activated";
                        } else {
                            clazz = "status-deactivated";
                        }
                    }
                }
                title += "\"";
                return "<div" + title + " class=\"status " + clazz + "\">&nbsp;</div>";
            }
        },{
            "header":CQ.I18n.getMessage("Mod.", null, "Abbreviation of the word modified"),
            "width":48,
            "renderer": function(v, params, record) {
                var repl = record.get("replication");
                var lastMod = record.get("modification");
                var title = " title=\"";
                var clazz = "";
                if (lastMod.lastModified) {
                    title += CQ.Ext.util.Format.date(new Date(lastMod.lastModified));
                    title += " (" + CQ.shared.XSS.getXSSTablePropertyValue(lastMod, "lastModifiedBy") + ")";
                    clazz = "status-localmodified";
                }
                if (repl && repl.published) {
                    if (repl.action == "ACTIVATE") {
                        if (lastMod.lastModified > repl.published) {
                            clazz = "status-modified";
                        }
                    }
                }
                title += "\"";
                return "<div "+ title +" class=\"status " + clazz + "\">&nbsp;</div>";
            }
        }])
        cm.defaultSortable = true;

        var sm = config.selectionModel ? config.selectionModel : new CQ.Ext.grid.RowSelectionModel({
            "singleSelect":false,
            "listeners": {
                "selectionchange": function(sm) {
                    for (var i = 0; i < disabledActions.length; i++) {
                        var disabled = !sm.hasSelection();
                        var act = disabledActions[i];
                        act.setDisabled(disabled);
                        if (!disabled && act instanceof CQ.PrivilegedAction) {
                            var sels = sm.getSelections();
                            for (var j = 0; j < sels.length; j++) {
                                act.setPath(sels[j].get("home"));
                                if (act.isDisabled()) {
                                    break; // starts disabled so at least one check
                                }
                            }
                        }
                    }
                }
            }
        });

        var listeners = CQ.Util.applyDefaults(config.listeners, {
            "rowcontextmenu": function(grid, index, e) {
                if (!this.contextMenu && (ctxActions.length > 0)) {
                    this.contextMenu = new CQ.Ext.menu.Menu({
                        items:ctxActions
                    });
                }
                var xy = e.getXY();
                this.contextMenu.showAt(xy);
                e.stopEvent();
            },
            "keypress": function(e) {
                if (e.getCharCode() == e.DELETE) {
                    if (this.getSelections() && this.getSelections().length > 0) {
                        this.removeHandler()
                        e.stopEvent();
                    }
                }
            }
        });

        config = CQ.Ext.applyIf(config, {
            "autoExpandColumn":"id",
            "region":"west",
            "margins":"5 0 5 5",
            "collapsible":true,
            "collapseMode":"mini",
            "hideCollapseTool":true,
            "width":400,
            "minWidth":380,
            "split":true,
            "loadMask":true,
            "enableDragDrop":true,
            "ddGroup":"AuthorizableDD",
            "ddText":"{0} selected Authorizable(s)",
            "tbar":actions,
            "store":this.authStore,
            "cm":cm,
            "sm":sm,
            "viewConfig": {
                "forceFit":true
            },
            "listeners":listeners,
            "bbar": new CQ.Ext.PagingToolbar({
                "store":authStore,
                "pageSize":25,
                "stateful":false,
                "displayMsg": CQ.I18n.getMessage("Page {0} of {1}")
            })});

        // init component by calling super constructor
        CQ.security.AuthorizableList.superclass.constructor.call(this, config);
    },

    initComponent : function() {
        CQ.security.AuthorizableList.superclass.initComponent.call(this);

        this.addEvents({
            /**
             * @event authremoved
             * Fires to notify listeners that an Authorizable was deleted.
             * @param {CQ.security.AuthorizableList} This List
             * @param {CQ.Ext.data.Record} The deleted Record representing the Authorizable
             * @param {Number} the formar index of the record
             */
            "authremoved":true
        })

        this.authStore.on("remove", this.fireAuthRemoved, this);
    },

    updateRelation: function(rec, field) {
        var newVal = rec.get(field);
        if (newVal && CQ.Ext.isArray(newVal)) {
            var str = this.getStore();
            var rel = (field == "members") ? "memberOf" : "members";
            str.each(function(curRec/*, scope*/) {
                var shouldCont = false;
                for (var i = 0; i < newVal.length; i++) {
                    if (newVal[i].id == curRec.id) {
                        shouldCont = true;
                        break;
                    }
                }
                var val = curRec.get(rel);
                if (val && CQ.Ext.isArray(val)) {
                    for (var j = 0; j < val.length; j++) {
                        if (val[j].id == rec.id) {
                            if (!shouldCont) {
                                val.splice(j, 1);
                            }
                            return;
                        }
                    }
                }
                if (shouldCont) {
                    if (!val) {
                        val = new Array();
                        curRec.set(rel, val);
                    }
                    val.push(rec);
                }
            });
        }
    },

    // private
    formatActions: function(actionCfgs, disabledActions, ctxActions) {
        var actions = [];
        for (var a in actionCfgs) {
            if (typeof(actionCfgs[a]) != "object") {
                continue;
            }
            // check for separators, splits, ...
            if (actionCfgs[a].xtype == "separator") {
                actions.push(actionCfgs[a].value);
                if (actionCfgs[a].ctx) {
                    ctxActions.push(actionCfgs[a].value);
                }
            } else {
                if (actionCfgs[a].menu) {
                    actionCfgs[a].menu = new CQ.Ext.menu.Menu({
                        items:this.formatActions(actionCfgs[a].menu,
                                disabledActions, ctxActions)
                    });
                }
                var actionCfg = this.formatActionConfig(actionCfgs[a]);
                var action;
                if (actionCfg.privileges || actionCfg.conditions) {
                    action = new CQ.PrivilegedAction(actionCfg);
                } else {
                    action = new CQ.Ext.Action(actionCfg);
                }
                actions.push(action);

                if (actionCfg.disabled) {
                    disabledActions.push(action);
                }
                if (actionCfg.ctx) {
                    ctxActions.push(action);
                }
            }
        }
        return actions;
    },

    activationHandler:function() {
        var sm = this.getSelectionModel()
        var recs = sm.getSelections();
        var store = this.getStore();
        var msg = "<ul>";
        for (var i = 0; i < recs.length; i++) {
            msg = msg + "<li>" + recs[i].get(CQ.shared.XSS.getXSSPropertyName("name"));
        }
        msg += "</ul>";
        var actFunc = function(but) {
            if (but == "yes") {
                var path = new Array();
                for (var i = 0; i < recs.length; i++) {
                    var rec = recs[i];
                    var home = rec.get("home");
                    path.push(home);
                }
                var cb = function() {
                    sm.clearSelections();
                    CQ.Notification.notify(CQ.I18n.getMessage("Activated"), msg);
                    store.reload.defer(1000, store);
                };
                this.requestReplication(path, "Activate", cb);
            }
        }
        CQ.Ext.MessageBox.confirm(CQ.I18n.getMessage("Activate"),
                CQ.I18n.getMessage("Do you really want to activate these users/groups? {0}", msg),
                actFunc,
                this)
    },

    deactivationHandler:function() {
        var sm = this.getSelectionModel()
        var recs = sm.getSelections();
        var store = this.getStore();
        var msg = "<ul>";
        for (var i = 0; i < recs.length; i++) {
            msg = msg + "<li>" + recs[i].get(CQ.shared.XSS.getXSSPropertyName("name"));
        }
        msg += "</ul>";
        var actFunc = function(but) {
            if (but == "yes") {
                var path = new Array();
                for (var i = 0; i < recs.length; i++) {
                    var rec = recs[i];
                    var home = rec.get("home");
                    path.push(home);
                }
                var cb = function() {
                    sm.clearSelections();
                    CQ.Notification.notify(CQ.I18n.getMessage("Deactivated"), msg);
                    store.reload.defer(1000, store);
                }
                this.requestReplication(path, "DeActivate", cb);
            }
        }
        CQ.Ext.MessageBox.confirm(CQ.I18n.getMessage("Deactivate"),
                CQ.I18n.getMessage("Do you really want to deactivate these users/groups? {0}", msg),
                actFunc,
                this)
    },

    removeHandler:function() {
        var st = this.getStore();
        var sm = this.getSelectionModel()
        var recs = sm.getSelections();
        var msg = "<p>";
        for (var i = 0; i < recs.length; i++) {
            msg = msg + recs[i].get(CQ.shared.XSS.getXSSPropertyName("name")) + "<br>"
        }
        var delFunc = function(but) {
            if (but == "yes") {
                for (var i = 0; i < recs.length; i++) {
                    var rec = recs[i];
                    var params = {
                        "_charset_":"utf-8",
                        "deleteAuthorizable": rec.id};
                    CQ.HTTP.post(CQ.HTTP.encodePath(rec.get("home")),
                            function(options, success, xhr) {
                                var response = CQ.HTTP.buildPostResponseFromHTML(xhr.responseText);
                                if (CQ.utils.HTTP.isOk(response)) {
                                    st.remove(rec);
                                    st.commitChanges();
                                    CQ.Notification.notify(CQ.I18n.getMessage("Deleted"), rec.get(CQ.shared.XSS.getXSSPropertyName("name")));
                                }
                            },
                            params,
                            rec);
                }
            }
        }
        CQ.Ext.MessageBox.confirm(CQ.I18n.getMessage("Delete"),
                CQ.I18n.getMessage("Do you really want to delete these users/groups? {0}", msg),
                delFunc,
                this)
    },

    requestReplication: function(path, cmd, callback) {
        var params = {
            "_charset_":"utf-8",
            "path": path,
            "cmd":cmd
        };
        CQ.HTTP.post("/bin/replicate.json",
                function(options, success, xhr) {
                    var response = CQ.HTTP.buildPostResponseFromHTML(xhr.responseText);
                    if (CQ.HTTP.isOk(response) && callback) {
                        callback.call(this);
                    }
                },
                params,
                this);
    },

    // private
    formatActionConfig: function(config) {
        if (!config.scope) {
            config.scope = this;
        }
        if (typeof(config.handler) == "string") {
            config.handler = eval(config.handler);
        }
        if (config.text) {
            config.text = CQ.I18n.getVarMessage(config.text);
        }
        if (config.tooltip && config.tooltip.text) {
            config.tooltip.text = CQ.I18n.getVarMessage(config.tooltip.text);
        }
        if (config.tooltip && config.tooltip.title) {
            config.tooltip.title = CQ.I18n.getVarMessage(config.tooltip.title);
        }
        return config;
    },

    fireAuthRemoved: function(store, record, index) {
        this.fireEvent("authremoved", this, record, index)
    }
});

CQ.security.AuthorizableList.renderIcon = function(value) {
    if (value == "user") {
        return '<div class="userIcon">&nbsp;</div>';
    } else if (value == "group") {
        return '<div class="groupIcon">&nbsp;</div>';
    }
}

CQ.Ext.reg("authorizablelist", CQ.security.AuthorizableList);
