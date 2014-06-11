     /**
    * @class CQ.Ext.ux.CustomSocialChanneldWidget
    * @extends CQ.form.CompositeField
    * This is a custom social channelname and  URL
    * @param {Object} config the config object
    */
     CQ.Ext.ux.CustomSocialChanneldWidget= CQ.Ext.extend(CQ.form.CompositeField, {

    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    hiddenField: null,

    /**
    * @private
    * @type CQ.Ext.form.Selection
    */
    socialChannel: null,
    
    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    socialChannelURL: null,


    /**
    * @private
    * @type CQ.Ext.form.FormPanel
    */
    formPanel: null,

    constructor: function (config) {
        config = config || {};
        var defaults = {
            "border": true,
            "labelWidth": 130,
            "layout": "form" 
        };
        config = CQ.Util.applyDefaults(config, defaults);
        CQ.Ext.ux.CustomSocialChanneldWidget.superclass.constructor.call(this, config);
    },

    //overriding CQ.form.CompositeField#initComponent
    initComponent: function () {
        CQ.Ext.ux.CustomSocialChanneldWidget.superclass.initComponent.call(this);

        // Hidden field
        this.hiddenField = new CQ.Ext.form.Hidden({
        name: this.name
        });
        this.add(this.hiddenField);
        var _this = this;
    
        this.socialChannel= new CQ.form.Selection({
            cls: "customwidget-1",
            allowBlank: false,
            fieldLabel:'Select the Social Channel:',
            //width: 250,
            type:'select',
            listeners: {
                selectionchanged: {
                    scope: _this,
                    fn: _this.updateHidden
                    }
            },
            options: this.options
            //optionsProvider: this.optionsProvider
        });
        this.add(this.socialChannel);
    
        this.socialChannelURL= new CQ.Ext.form.TextField({
            cls: "customwidget-1",
            allowBlank: false,
            fieldLabel:'Enter Social Channel URL:',
            width: 500,
            listeners: {
                change: {
                    scope: _this,
                    fn: _this.updateHidden
                    }
            }
        });
        this.add(this.socialChannelURL);
        },

    processInit: function (path, record) {
        this.socialChannel.processInit(path, record);
        this.socialChannelURL.processInit(path, record);

    },

    setValue: function (value) {
        var channel= JSON.parse(value);
        this.socialChannel.setValue(channel.socialChannel);
        this.socialChannelURL.setValue(channel.socialChannelURL);
        this.hiddenField.setValue(value);
    },

    getValue: function () {
        return this.getRawValue();
    }, 
    
    
    getRawValue: function () {
        var channel= {
            "socialChannel": this.socialChannel.getValue(),
            "socialChannelURL": this.socialChannelURL.getValue()
        };    
        return JSON.stringify(channel);
    },
    
    

    updateHidden: function () {
        this.hiddenField.setValue(this.getValue());
    }
    });

 
 CQ.Ext.reg('customsocialchannel',CQ.Ext.ux.CustomSocialChanneldWidget); 