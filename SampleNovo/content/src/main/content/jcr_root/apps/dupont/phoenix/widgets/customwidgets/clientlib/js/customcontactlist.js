     /**
    * @class CQ.Ext.ux.CustomPathFieldWidget
    * @extends CQ.form.CompositeField
    * This is a custom path field with link text
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
    contactName: null,
    
        /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    contactJobTitle: null,
    
    
    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    contactEmail: null,
        
    
    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    contact1: null,
    
    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    contact2: null,
            
    
    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    contactCountry: null,

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
    "labelWidth": 100,
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

    // Contact Name
    this.add(new CQ.Ext.form.Label({
    cls: "customwidget-label"
    }));
    this.contactName= new CQ.Ext.form.TextField({
    cls: "customwidget-1",
    fieldLabel: "Name ",
    allowBlank: false,
    width: 500,
    listeners: {
    change: {
    scope: this,
    fn: this.updateHidden
    }
    }
    });
    this.add(this.contactName);
    
      // Contact Job Title
    this.add(new CQ.Ext.form.Label({
    cls: "customwidget-label"
    }));
    this.contactJobTitle= new CQ.Ext.form.TextField({
    cls: "customwidget-2",
    fieldLabel: "Job Title ",
    allowBlank: true,
    width: 500,
    listeners: {
    change: {
    scope: this,
    fn: this.updateHidden
    }
    }
    });
    this.add(this.contactJobTitle);
    
          // Contact Email
    this.add(new CQ.Ext.form.Label({
    cls: "customwidget-label"
    }));
    this.contactEmail= new CQ.Ext.form.TextField({
    cls: "customwidget-3",
    fieldLabel: "Email ",
    allowBlank: true,
    width: 500,
    listeners: {
    change: {
    scope: this,
    fn: this.updateHidden
    }
    }
    });
    this.add(this.contactEmail);
    
              // Contact1
    this.add(new CQ.Ext.form.Label({
    cls: "customwidget-label"
    }));
    this.contact1= new CQ.Ext.form.TextField({
    cls: "customwidget-4",
    fieldLabel: "Phone Number 1 ",
    allowBlank: true,
    width: 500,
    listeners: {
    change: {
    scope: this,
    fn: this.updateHidden
    }
    }
    });
    this.add(this.contact1);
    
                  // Contact2
    this.add(new CQ.Ext.form.Label({
    cls: "customwidget-label"
    }));
    this.contact2= new CQ.Ext.form.TextField({
    cls: "customwidget-5",
    fieldLabel: "Phone Number 2 ",
    allowBlank: true,
    width: 500,
    listeners: {
    change: {
    scope: this,
    fn: this.updateHidden
    }
    }
    });
    this.add(this.contact2);
    
       // Contact Country
    this.add(new CQ.Ext.form.Label({
    cls: "customwidget-label"
    }));
    this.contactCountry= new CQ.Ext.form.TextField({
    cls: "customwidget-6",
    fieldLabel: "Country ",
    allowBlank: true,
    width: 500,
    listeners: {
    change: {
    scope: this,
    fn: this.updateHidden
    }
    }
    });
    this.add(this.contactCountry);




    },

    processInit: function (path, record) {
    this.contactName.processInit(path, record);
    this.contactJobTitle.processInit(path, record);
    this.contactEmail.processInit(path, record);
    this.contact1.processInit(path, record);
    this.contact2.processInit(path, record);
    this.contactCountry.processInit(path, record);


    },

    setValue: function (value) {
    var link = JSON.parse(value);
    this.contactName.setValue(link.contactName);
    this.contactJobTitle.setValue(link.contactJobTitle);
    this.contactEmail.setValue(link.contactEmail);
    this.contact1.setValue(link.contact1);
    this.contact2.setValue(link.contact2);
    this.contactCountry.setValue(link.contactCountry);

    this.hiddenField.setValue(value);
    },

    getValue: function () {
    return this.getRawValue();
    },
    
    
    getRawValue: function () {
    var link = {
    "contactName": this.contactName.getValue(),
    "contactJobTitle": this.contactJobTitle.getValue(),
    "contactEmail": this.contactEmail.getValue(),
    "contact1": this.contact1.getValue(),
    "contact2": this.contact2.getValue(),
    "contactCountry": this.contactCountry.getValue()
    };    
    return JSON.stringify(link);
    },
    
    

    updateHidden: function () {
    this.hiddenField.setValue(this.getValue());
    }
    });

    CQ.Ext.reg('customcontactlist',CQ.Ext.ux.CustomPathFieldWidget); 
 
