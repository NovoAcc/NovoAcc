     /**
    * @class CQ.Ext.ux.ManageSocialChannelsWidget
    * @extends CQ.form.CompositeField
    * This is a custom social channelname and  URL
    * @param {Object} config the config object
    */
 CQ.Ext.ux.ManageSocialChannelsWidget = CQ.Ext.extend(CQ.form.CompositeField, {

    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    hiddenField: null,

    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    channelName: null,
    
    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    channelURL: null,

    /**
    * @private
    * @type CQ.Ext.form.PathField
    */
    grayChicletHoverImg: null,

    /**
    * @private
    * @type CQ.Ext.form.PathField
    */
    grayChicletImg: null,

    /**
    * @private
    * @type CQ.Ext.form.PathField
    */
    normalChicletHoverImg: null,

    /**
    * @private
    * @type CQ.Ext.form.PathField
    */
    normalChicletImg: null,

    /**
    * @private
    * @type CQ.Ext.form.FormPanel
    */
    formPanel: null,

    constructor: function (config) {
        console.log("managesocialchannel :: inside constructor: ", config);
        config = config || {};
        var defaults = {
            "border": true,
            "labelWidth": 130,
            "layout": "form" 
        };
        config = CQ.Util.applyDefaults(config, defaults);
        CQ.Ext.ux.ManageSocialChannelsWidget.superclass.constructor.call(this, config);
    },

    //overriding CQ.form.CompositeField#initComponent
    initComponent: function () {
        CQ.Ext.ux.ManageSocialChannelsWidget.superclass.initComponent.call(this);

        console.log("init component");

        // Hidden field
        this.hiddenField = new CQ.Ext.form.Hidden({
        name: this.name
        });
        this.add(this.hiddenField);
    
        var _this = this;
        this.channelName = new CQ.Ext.form.TextField({
            cls: "customwidget-1",
            allowBlank: false,
            fieldLabel:'Channel Name:',
            listeners: {
                change: {
                    scope: _this,
                    fn: _this.updateHidden
                    }
            }
        });
        this.add(this.channelName);
    
        this.channelURL= new CQ.Ext.form.TextField({
            cls: "customwidget-1",
            allowBlank: false,
            fieldLabel:'Channel URL:',
            listeners: {
                change: {
                    scope: _this,
                    fn: _this.updateHidden
                    }
            }
        });
        this.add(this.channelURL);

        this.grayChicletHoverImg= new CQ.form.PathField({
            cls: "customwidget-1",
            fieldLabel:'Gray Hover Image Path:',
            listeners: {
                change: {
                    scope: _this,
                    fn: _this.updateHidden
                    }
            }
        });
        this.add(this.grayChicletHoverImg);

        this.grayChicletImg= new CQ.form.PathField({
            cls: "customwidget-1",
            fieldLabel:'Gray Image Path:',
            listeners: {
                change: {
                    scope: _this,
                    fn: _this.updateHidden
                    }
            }
        });
        this.add(this.grayChicletImg);

        this.normalChicletHoverImg= new CQ.form.PathField({
            cls: "customwidget-1",
            fieldLabel:'Normal Hover Image Path:',
            listeners: {
                change: {
                    scope: _this,
                    fn: _this.updateHidden
                    }
            }
        });
        this.add(this.normalChicletHoverImg);

        this.normalChicletImg= new CQ.form.PathField({
            cls: "customwidget-1",
            fieldLabel:'Normal Hover Image Path:',
            listeners: {
                change: {
                    scope: _this,
                    fn: _this.updateHidden
                    }
            }
        });
        this.add(this.normalChicletImg);
    },

    processInit: function (path, record) {
        console.log('inside processInit');
        this.channelName.processInit(path, record);
        this.channelURL.processInit(path, record);
        this.grayChicletHoverImg.processInit(path, record);
        this.grayChicletImg.processInit(path, record);
        this.normalChicletHoverImg.processInit(path, record);
        this.normalChicletImg.processInit(path, record);        
    },

    processPath: function(path) { 
      console.log("processpath: ", path);
    },

    processRecord: function(record, path) { 
      console.log("processRecord: ", record, path);
    },

    setValue: function (value) {
        console.log('set value: ' + value);
        var channel= JSON.parse(value);
        this.channelName.setValue(channel.channelName);
        this.channelURL.setValue(channel.channelURL);
        this.grayChicletHoverImg.setValue(channel.grayChicletHoverImg);
        this.grayChicletImg.setValue(channel.grayChicletImg);
        this.normalChicletHoverImg.setValue(channel.normalChicletHoverImg);
        this.normalChicletImg.setValue(channel.normalChicletImg);        
        this.hiddenField.setValue(value);
    },

    getValue: function () {
        return this.getRawValue();
    }, 
        
    getRawValue: function () {
        console.log('managesocialchannel:: getRawValue');
        var channel= {
            "channelName": this.channelName.getValue(),
            "channelURL": this.channelURL.getValue(),
            "grayChicletHoverImg" : this.grayChicletHoverImg.getValue(),
            "grayChicletImg" : this.grayChicletImg.getValue(),
            "normalChicletHoverImg" : this.normalChicletHoverImg.getValue(),
            "normalChicletImg" : this.normalChicletImg.getValue()
        };    
        return JSON.stringify(channel);
    },
    
    updateHidden: function () {
        console.log("managesocialchannel :: updateHidden");
        this.hiddenField.setValue(this.getValue());
    }
  });

 
 CQ.Ext.reg('managesocialchannel',CQ.Ext.ux.ManageSocialChannelsWidget); 