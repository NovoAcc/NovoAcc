     /**
    * @class CQ.Ext.ux.CustomPathFieldWidget
    * @extends CQ.form.CompositeField
    * This is a custom path field with link text and target
    * @param {Object} config the config object
    */
    /**
    * @class Ejst.CustomWidget
    * @extends CQ.form.CompositeField
    * This is a custom widget based on {@link CQ.form.CompositeField}.
    * @constructor
    * Creates a new CustomWidget.
    * @param {Object} config The config object
    */
     CQ.Ext.ux.CustomPathFieldWidget = CQ.Ext.extend(CQ.form.CompositeField, {

    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    hiddenField: null,

    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    linkText: null,

    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    linkURL: null,

    /**
    * @private
    * @type CQ.Ext.form.CheckBox
    */
    openInNewWindow: null,

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
    CQ.Ext.ux.CustomPathFieldWidget.superclass.constructor.call(this, config);
    },

    //overriding CQ.Ext.Component#initComponent
    initComponent: function () {
    CQ.Ext.ux.CustomPathFieldWidget.superclass.initComponent.call(this);

    // Hidden field
    this.hiddenField = new CQ.Ext.form.Hidden({
    name: this.name
    });
    this.add(this.hiddenField);

    // Link text
    this.add(new CQ.Ext.form.Label({
    cls: "customwidget-label"
    }));
    this.linkText = new CQ.Ext.form.TextField({
    cls: "customwidget-1",
    fieldLabel: "Link Title",
    allowBlank: false,
    layout:'anchor',
	anchor: '99%',
    listeners: {
    change: {
    scope: this,
    fn: this.updateHidden
    }
    }
    });
    this.add(this.linkText);

    // Link URL
    this.add(new CQ.Ext.form.Label({
    cls: "customwidget-label"
    }));
    this.linkURL = new CQ.form.PathField({
    cls: "customwidget-2",
    fieldLabel: "Link URL",
    allowBlank: false,
	layout:'anchor',
	anchor: '99%',
    listeners: {
    change: {
    scope: this,
    fn: this.updateHidden
    },
    dialogclose: {
    scope: this,
    fn: this.updateHidden
    }
    }
    });
    this.add(this.linkURL);

    // 0pen In new Window
    this.add(new CQ.Ext.form.Label({
    cls: "customwidget-label"
    }));
    this.openInNewWindow = new CQ.Ext.form.Checkbox({
    cls: "customwidget-3",
    fieldLabel: "Open In a New Window?",
    listeners: {
    change: {
    scope: this,
    fn: this.updateHidden
    },
    check: {
    scope: this,
    fn: this.updateHidden
    },
    dialogclose: {
    scope: this,
    fn: this.updateHidden
    }
    }
    });
    this.add(this.openInNewWindow);
    },

    processInit: function (path, record) {
    this.linkText.processInit(path, record);
    this.linkURL.processInit(path, record);
    this.openInNewWindow.processInit(path, record);

    },

    setValue: function (value) {
    var link = JSON.parse(value);
    this.linkText.setValue(link.linkText);
    this.linkURL.setValue(link.linkURL);
    this.openInNewWindow.setValue(link.openInNewWindow);
    this.hiddenField.setValue(value);
    },

    getValue: function () {
    return this.getRawValue();
    }, 
    
    
    getRawValue: function () {
    var link = {
    "linkURL": this.linkURL.getValue(),
    "linkText": this.linkText.getValue(),
    "openInNewWindow": this.openInNewWindow.getValue()
    };    
    return JSON.stringify(link);
    },
    
    

    updateHidden: function () {
    this.hiddenField.setValue(this.getValue());
    }
    });

 
 CQ.Ext.reg('multilinklistcurated',CQ.Ext.ux.CustomPathFieldWidget); 