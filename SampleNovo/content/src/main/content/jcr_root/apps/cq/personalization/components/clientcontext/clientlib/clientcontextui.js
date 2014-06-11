/*
 * ***********************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2011 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 * ***********************************************************************
 */

if (!CQ_Analytics.ClientContextUI) {
    /**
     * Client Context UI object: manages rendering, show / hide...
     * <br>
     * @static
     * @singleton
     * @class CQ_Analytics.ClientContextUI
     * @since 5.5
     */
    CQ_Analytics.ClientContextUI = function() {
        //true if CC is loaded
        this.loaded = false;

        //URL to the Client Context
        this.ccUrl = null;

        //true if UI is visible
        this.visible = false;

        //true if UI is rendered
        this.rendered = false;

        //id of the container div
        this.containerId = null;

        //id of the UI box
        this.boxId = null;

        //id of the placeholder for the CC content
        this.contentPlaceholderId = null;

        //true if edit mode
        this.editMode = false;
    };

    CQ_Analytics.ClientContextUI.prototype = new CQ_Analytics.Observable();

    /**

     * Name of the cookie that stores if CC should be displayed or not on page load
     * @static
     * @type String
     */
    CQ_Analytics.ClientContextUI.prototype.SHOW_BOX_COOKIE = "cq-show-clientcontext";

    /**
     * Inits the UI.
     * @param {String} url URL to the Client Context
     * @param {String} containerId Id of the container div
     * @param {String} boxId Id of the UI box
     * @param {String} contentPlaceholderId Id of the placeholder for the CC content
     * @param {Boolean} editMode True if edit mode, false otherwise
     */
    CQ_Analytics.ClientContextUI.prototype.init = function(url, containerId, boxId, contentPlaceholderId, editMode) {
        this.ccUrl = url;
        this.containerId = containerId;
        this.boxId = boxId;
        this.contentPlaceholderId = contentPlaceholderId;
        this.editMode = editMode;

        $CQ(document).bind("keydown", CQ_Analytics.Utils.eventWrapper(function(event, keyCode) {
            if (event.ctrlKey && event.altKey && keyCode == "C".charCodeAt(0)) { // 84
                CQ_Analytics.ClientContextUI.toggle();
            }
        }));

        if (CQ_Analytics.Cookie.read(this.SHOW_BOX_COOKIE) == "true") {
            this.show();
        }
    };

    /**
     * Renders the UI.
     * Fires "beforerender" and "render" events.
     */
    CQ_Analytics.ClientContextUI.prototype.render = function() {
        if(!this.rendered && this.fireEvent("beforerender") !== false) {
            this.rendered = true;
            this.fireEvent("render");
        }
    };

    /**
     *  Loads the Client Context content. If already loaded, will not be loaded again until <code>force</code> is set
     *  to true.
     * Fires "beforeload" and "load" events.
     * @param {Boolean} force True to force the loading
     */
    CQ_Analytics.ClientContextUI.prototype.load = function(force) {
        if( this.ccUrl && (! this.loaded || force) && this.fireEvent("beforeload") !== false) {
            var url = CQ.shared.HTTP.addParameter(this.ccUrl, "wcmmode",this.editMode ? "preview" : "disabled");
            var response = CQ.shared.HTTP.get(url);
            $CQ("#" + this.contentPlaceholderId).html(response.responseText);
            this.loaded = true;
            this.fireEvent("load");
        }
    };

    /**
     * Shows the UI. Loads the Client Context and renders the UI if not already done.
     * Fires "beforeshow" and "show" events.
     */
    CQ_Analytics.ClientContextUI.prototype.show = function() {
        this.load();
        this.render();
        if( this.fireEvent("beforeshow") !== false) {
            if( $CQ.support.opacity) {
                $CQ("#" + this.containerId).show("normal");
            } else {
                $CQ("#" + this.containerId).show();
            }
            this.visible = true;
            CQ_Analytics.Cookie.set(this.SHOW_BOX_COOKIE, "true", 365 /* days */);
            this.fireEvent("show");
        }
    };

    /**
     * Hides the UI.
     * Fires "beforehide" and "hide" events.
     */
    CQ_Analytics.ClientContextUI.prototype.hide = function() {
        if( this.fireEvent("beforehide") !== false) {
            if( $CQ.support.opacity) {
                $CQ("#" + this.containerId).hide("fast");
            } else {
                $CQ("#" + this.containerId).hide();
            }
            this.visible = false;
            CQ_Analytics.Cookie.set(this.SHOW_BOX_COOKIE, "false", 365 /* days */);
            this.fireEvent("hide");
        }
    };

    /**
     * Toggles the UI.
     */
    CQ_Analytics.ClientContextUI.prototype.toggle = function() {
        if( this.visible ) {
            this.hide();
        } else {
            this.show();
        }
    };

    /**
     * Helper method to register an on load event. Checks if the Client Context has already been loaded.
     * @param {Function} callback Function to execute on load
     * @param {Object} scope Execution scope
     */
    CQ_Analytics.ClientContextUI.prototype.onLoad = function(callback, scope) {
        if( callback ) {
            if( this.loaded) {
                callback.call(scope || this);
            } else {
                this.addListener("load", callback, scope);
            }
        }
    };

    /**
     * Returns if UI is available: true if some content is load into the UI box.
     * @return {Boolean} True if available, false otherwise
     */
    CQ_Analytics.ClientContextUI.prototype.isAvailable = function() {
        return this.boxId && $CQ("#" + this.boxId).length > 0;
    };

    /**
     * Returns the box id.
     * @return {String} The id of the box
     */
    CQ_Analytics.ClientContextUI.prototype.getBoxId = function() {
        return this.boxId;
    };

    CQ_Analytics.ClientContextUI = new CQ_Analytics.ClientContextUI();

    /**
     * UI default container id
     * @static
     */
    CQ_Analytics.ClientContextUI.CONTAINER_ID = "cq-clientcontext-container";

    /**
     * UI default box id
     * @static
     */
    CQ_Analytics.ClientContextUI.BOX_ID = "cq-clientcontext-box";

    /**
     * UI default class
     * @static
     */
    CQ_Analytics.ClientContextUI.BOX_CLASS = "cq-clientcontext";

    /**
     * UI default actions header id
     * @static
     */
    CQ_Analytics.ClientContextUI.ACTIONS_ID = "cq-clientcontext-box-actions";

    /**
     * UI default actions container id
     * @static
     */
    CQ_Analytics.ClientContextUI.ACTIONS_CONTAINER_ID = "cq-clientcontext-box-actions-container";

    /**
     * UI default Client Context content id
     * @static
     */
    CQ_Analytics.ClientContextUI.CONTENT_ID = "cq-clientcontext-box-content";

    /**
     * Creates the required placeholders to display the Client Context.
     * @static
     * @private
     */
    CQ_Analytics.ClientContextUI.createPlaceholders = function() {
        var cc = $CQ("<div>")
            .attr("id", CQ_Analytics.ClientContextUI.BOX_ID)
            .addClass(CQ_Analytics.ClientContextUI.BOX_CLASS);

        cc.append(
            $CQ("<div>").attr("id",CQ_Analytics.ClientContextUI.ACTIONS_ID).append(
                $CQ("<div>").attr("id",CQ_Analytics.ClientContextUI.ACTIONS_CONTAINER_ID)));
        cc.append(
            $CQ("<div>").attr("id",CQ_Analytics.ClientContextUI.CONTENT_ID));

        var container = $CQ("<div>")
            .attr("id", CQ_Analytics.ClientContextUI.CONTAINER_ID);

        container.append(cc);

        $CQ("body").append(container);
    };

    /**
     * Creates and inits the Client Context UI.
     * @param {String} ccPath Path to the Client Context
     * @param {String} pagePath Path the the current page
     * @static
     */
    CQ_Analytics.ClientContextUI.create = function(ccPath, pagePath, editMode) {
        CQ_Analytics.ClientContextUI.createPlaceholders();

        CQ_Analytics.ClientContextUI.addListener("beforerender", function() {
            //<% if(WCMMode.fromRequest(request) != WCMMode.DISABLED) { %>

                $CQ("<div>")
                        .addClass("cq-clientcontext-box-action")
                        .addClass("cq-clientcontext-design")
                        .attr("title", CQ.I18n.getMessage("Open the ClientContext design page"))
                        .appendTo("#" + CQ_Analytics.ClientContextUI.ACTIONS_CONTAINER_ID)
                        .bind("click",function() {
                            CQ.shared.Util.open(CQ.shared.HTTP.externalize(ccPath + "/content.html"));
                        });

                $CQ("<div>")
                        .addClass("cq-clientcontext-box-action")
                        .addClass("cq-clientcontext-load")
                        .attr("title", CQ.I18n.getMessage("Load a profile in the ClientContext"))
                        .appendTo("#" + CQ_Analytics.ClientContextUI.ACTIONS_CONTAINER_ID)
                        .bind("click",function() {
                            var dlg = new CQ.personalization.ProfileLoader({});
                            dlg.show();
                        });
            //<% } %>
            $CQ("<div>")
                    .addClass("cq-clientcontext-box-action")
                    .addClass("cq-clientcontext-reset")
                    .attr("title", CQ.I18n.getMessage("Reset the ClientContext"))
                    .appendTo("#" + CQ_Analytics.ClientContextUI.ACTIONS_CONTAINER_ID)
                    .bind("click",function() {
                        CQ_Analytics.ClientContext.reset();
                    });
            $CQ("<div>")
                    .addClass("cq-clientcontext-box-action")
                    .addClass("cq-clientcontext-close")
                    .attr("title", CQ.I18n.getMessage("Close the ClientContext"))
                    .appendTo("#" + CQ_Analytics.ClientContextUI.ACTIONS_CONTAINER_ID)
                    .bind("click",function() {
                        CQ_Analytics.ClientContextUI.hide();
                    });

            var offset = $CQ("#" + CQ_Analytics.ClientContextUI.BOX_ID).offset();
            $CQ("#" + CQ_Analytics.ClientContextUI.BOX_ID).draggable({
                "handle": "#" + CQ_Analytics.ClientContextUI.ACTIONS_ID,
                "revert": false,
                "stop": function() {
                    offset = $CQ("#" + CQ_Analytics.ClientContextUI.BOX_ID).offset();
                }
            });
            $CQ("#" + CQ_Analytics.ClientContextUI.BOX_ID).addClass("CQjquery").resizable();

            if( window.CQ &&
                CQ.wcm &&
                CQ.wcm.emulator &&
                CQ.wcm.emulator.EmulatorManager &&
                CQ.wcm.emulator.EmulatorManager.WRAPPING_EXCLUDED_IDS) {
                CQ.wcm.emulator.EmulatorManager.WRAPPING_EXCLUDED_IDS.push(CQ_Analytics.ClientContextUI.CONTAINER_ID);

            }

        });

        var clientContextURL = CQ.shared.HTTP.addParameter(ccPath + "/content/jcr:content/stores.html", "path", pagePath);
        CQ_Analytics.ClientContextUI.init(
            clientContextURL,
            CQ_Analytics.ClientContextUI.CONTAINER_ID,
            CQ_Analytics.ClientContextUI.BOX_ID,
            CQ_Analytics.ClientContextUI.CONTENT_ID,
            true
            editMode !== false
        );
    }
}