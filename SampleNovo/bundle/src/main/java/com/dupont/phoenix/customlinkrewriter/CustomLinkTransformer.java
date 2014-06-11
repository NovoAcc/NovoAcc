package com.dupont.phoenix.customlinkrewriter;
import org.apache.sling.rewriter.Transformer;
import org.apache.sling.rewriter.TransformerFactory;
import org.xml.sax.ContentHandler;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;
import org.xml.sax.Attributes;
import java.io.IOException;
import java.util.Map;
import org.xml.sax.Locator;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.felix.scr.annotations.Property;

 
@Component(metatype = true, label = "DuPont Phoenix Clientlib Link Transformer", description = "Appends version number to the js and css files under specified paths")
@Service(value = TransformerFactory.class)
public class CustomLinkTransformer implements Transformer, TransformerFactory {
     
 @Property(label = "JS and CSS file path", cardinality = Integer.MAX_VALUE, description = "Path to the JS and CSS files", value = "")
     private static final String PATH = "path";
 
/* @Property(label = "Version", description = "Version Number to be appended.", value="1.0.0")
private static final String VERSION = "version";
*/
 @Property(value = "append-version", propertyPrivate = true)
 private static final String PIPELINE_TYPE = "pipeline.type";
 
 @Property(value = "global", propertyPrivate = true)
 private static final String PIPELINE_MODE = "pipeline.mode";

    private final String SELECTOR_SEPARATOR = ".";
    private final String HTML_TAG_SCRIPT = "script";
    private final String HTML_TAG_LINK = "link";
    private final String HTML_ATTRIBUTE_SRC = "src";
    private final String HTML_ATTRIBUTE_HREF = "href";
    private final String JS_EXTENTION = ".js";
    private final String CSS_EXTENTION = ".css";
  
    private ContentHandler contentHandler;
    private String version;
    private String[] pathArray;
     
    private final Logger log = LoggerFactory.getLogger(this.getClass());
    
    /*To read the Property value from the service */
    @Activate
    protected void activate(final Map<String, Object> props) {
      //version =(String) props.get(VERSION);
       pathArray=(String[]) props.get(PATH);
       
    }

  
    public CustomLinkTransformer()
    {
                log.debug("[CUSTOM TRANSFORMER] ************ CUSTOM TRANSFORMER CREATED");
                
              
    }
     
    public CustomLinkTransformer(String version, String[] pathArray)
    {
                 log.debug("[CUSTOM TRANSFORMER] ************ CUSTOM TRANSFORMER CREATED");
                  this.version = getBundleVersion();
                  this.pathArray = pathArray;
                  
    }
    
    public void init(org.apache.sling.rewriter.ProcessingContext context, org.apache.sling.rewriter.ProcessingComponentConfiguration config) throws IOException {
  
    }
     
        
    public void characters(char[] ch, int start, int length) throws SAXException {
        contentHandler.characters(ch, start, length);
    }
     
    public void dispose() {
  
    }
     
    public void endDocument() throws SAXException {
        contentHandler.endDocument();
    }
  
    public void endElement(String uri, String localName, String qName) throws SAXException {
        contentHandler.endElement(uri, localName, qName);
    }
  
    public void endPrefixMapping(String prefix) throws SAXException {
        contentHandler.endPrefixMapping(prefix);
    }
  
    public void ignorableWhitespace(char[] ch, int start, int length) throws SAXException {
        contentHandler.ignorableWhitespace(ch, start, length);
    }
     
     
     
    public void processingInstruction(String target, String data) throws SAXException {
        contentHandler.processingInstruction(target, data);
    }
     
    public void setContentHandler(ContentHandler handler) {
        this.contentHandler = handler;
    }
     
    public void setDocumentLocator(Locator locator) {
        contentHandler.setDocumentLocator(locator);
    }
     
    public void skippedEntity(String name) throws SAXException {
        contentHandler.skippedEntity(name);
    }
     
    public void startDocument() throws SAXException {
        contentHandler.startDocument();
    }
     
    public void startElement(String uri, String localName, String qName, Attributes atts) throws SAXException {
        if (shouldAppendVersion() && HTML_TAG_SCRIPT.equalsIgnoreCase(localName)) {
            contentHandler.startElement(uri, localName, qName, rewriteLink(atts, HTML_ATTRIBUTE_SRC, JS_EXTENTION));
        } else if (shouldAppendVersion() && HTML_TAG_LINK.equalsIgnoreCase(localName)) {
            contentHandler.startElement(uri, localName, qName,
                    rewriteLink(atts, HTML_ATTRIBUTE_HREF, CSS_EXTENTION));
        } else {
            contentHandler.startElement(uri, localName, qName, atts);
        }
    }
     
    public void startPrefixMapping(String prefix, String uri) throws SAXException {
        contentHandler.startPrefixMapping(prefix, uri);
    }
  
    /**
* Main rewriting step
* Rewrites links and appends a version number if there is a version to be appended
* and if there are any paths to look for
*/
    private Attributes rewriteLink(Attributes atts, String attrNameToLookFor, String fileExtension) {
        log.debug("[CUSTOM TRANSFORMER] ************ REWRITING LINK");
        boolean rewriteComplete = false;
        AttributesImpl newAttrs = new AttributesImpl(atts);
        int length = newAttrs.getLength();
        for (int i = 0; i < length; i++) {
            String attributeName = newAttrs.getLocalName(i);
            if (attrNameToLookFor.equalsIgnoreCase(attributeName)) {
                String originalValue = newAttrs.getValue(i);
                if (isNotEmpty(originalValue)) {
                    for (String pathPrefix : pathArray) {
                            log.debug("[pathPrefix] ************>"+pathPrefix);
                        if (isNotEmpty(pathPrefix) && originalValue.contains(pathPrefix)) {
                            int index = originalValue.lastIndexOf(fileExtension);
                            if (index != -1) {
                                newAttrs.setValue(i, originalValue.substring(0, index) + SELECTOR_SEPARATOR
                                        + this.version + fileExtension);
                                rewriteComplete = true;
                                break;
                            }
                        }
                    }
                    if (rewriteComplete) {
                        break;
                    }
                }
  
            }
        }
        return newAttrs;
    }
  
     /**
* Helper method for determining if there should be an appended version or not
*/
    private boolean shouldAppendVersion() {
        return this.pathArray != null && this.pathArray.length > 0 && isNotEmpty(this.version);
    }
  
    /**
* Helper method for checking for empty and null
*/
    private boolean isNotEmpty(String s) {
        return s != null && !s.equals("");
    }
     
     
    public final Transformer createTransformer() {
      log.debug("[CUSTOM TRANSFORMER FACTORY] ************ CREATING THE TRANSFORMER");
       return new CustomLinkTransformer(version, pathArray);
       }
    
    public String getBundleVersion(){
            
        BundleContext bundleContext = FrameworkUtil.getBundle(CustomLinkTransformer.class).getBundleContext();
        Bundle bundle = bundleContext.getBundle();
        String bundleVersion = bundle.getVersion().toString();
     // int versionNumber= bunldeVersion.lastIndexOf(".");
     // bunldeVersion=bunldeVersion.substring(0, versionNumber);
        log.debug("Version >>>>>>>>>>>>"+bundleVersion);
        return bundleVersion;
    }
   
}