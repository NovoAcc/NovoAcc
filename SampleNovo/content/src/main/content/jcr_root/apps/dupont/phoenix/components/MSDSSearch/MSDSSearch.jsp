<%@ include file="/libs/foundation/global.jsp" %>
<%@ page contentType="text/html; charset=utf-8" import="com.day.cq.i18n.I18n" %>
<%@ page import="com.dupont.phoenix.Global"%>
<%@ page import="com.dupont.phoenix.Global"%>
<% //final I18n i18n = new I18n(slingRequest); %>

<%
    String keywordMessage =Global.getTranslatedText(currentPage, slingRequest,"Please type a Product Name/Synonym or MSDS Number");    
    String countryMessage =Global.getTranslatedText(currentPage, slingRequest,"Please select a valid country/language");
    String keywordDefaultValue =Global.getTranslatedText(currentPage, slingRequest,"Product Name / Keyword or MSDS");
    //out.print(currentStyle.getPath());
%>

<!-- MSDS Finder -->
<div class="msds-finder-widget">
    <div class="msds-finder-title"><%=Global.getTranslatedText(currentPage, slingRequest,"MSDS Finder")%></div>
    <div id="msds-finder">
        <form method="post" action="http://msds.dupont.com/msds/Mediator"  NAME="FormSearchInitial" target="_blank"  onsubmit="return validateParameters(document.FormSearchInitial.UTFNAME,document.FormSearchInitial.NUMBER,document.FormSearchInitial.CNTRYLANG,'<%= keywordMessage%>','<%= countryMessage%>','<%= keywordDefaultValue%>');" >
            <input type="hidden" name="sec" value="searchSection"/>
            <input type="hidden" name="sub" value="searchShowResult"/>
            <div class="msds-finder-language">     
                <select id="msdn-select" size="1" name="CNTRYLANG" class=" ui-selectmenu-status ui-selectmenu ui-widget ui-state-default ui-corner-all ui-selectmenu-dropdown" aria-owns="msdn-select-menu" aria-haspopup="true" tabindex="0" role="button" role="combobox" aria-autocomplete="list" style="width: 212px;" aria-disabled="false">
                    <option selected="" value="none_none"><%=Global.getTranslatedText(currentPage, slingRequest,"Select Country/Language")%></option>
                    <option value="AR-ES">Argentina/Spanish</option>
                    <option value="AUS-EN">Australia/English</option>
                    <option value="AT-DE">Austria/German</option>
                    <option value="BE-NL">Belgium/Dutch</option>
                
                    <option value="BE-FR">Belgium/French</option>
                    <option value="BR-EN">Brazil/English</option>
                    <option value="BR-Z9">Brazil/Portuguese</option>
                    <option value="BG-BG">Bulgaria/Bulgarian</option>
                    <option value="CA-EN">Canada/English</option>
                    <option value="CA-FR">Canada/French</option>
                
                    <option value="CL-ES">Chile/Spanish</option>
                    <option value="CN-ZH">China/Chinese (Simplified)</option>
                    <option value="CN-EN">China/English</option>
                    <option value="CO-ES">Colombia/Spanish</option>
                    <option value="HR-HR">Croatia/Croatian</option>
                    <option value="CY-EL">Cyprus/Greek</option>
                
                    <option value="CY-TR">Cyprus/Turkish</option>
                    <option value="CZ-CS">Czech/Czech</option>
                    <option value="DK-DA">Denmark/Danish</option>
                    <option value="EE-EN">Estonia/English</option>
                    <option value="EE-ET">Estonia/Estonian</option>
                    <option value="FI-FI">Finland/Finnish</option>
                
                    <option value="FR-FR">France/French</option>
                    <option value="DE-DE">Germany/German</option>
                    <option value="GR-EL">Greece/Greek</option>
                    <option value="HK-ZF">Hong Kong/Chinese (Traditional)</option>
                    <option value="HK-EN">Hong Kong/English</option>
                    <option value="HU-HU">Hungary/Hungarian</option>
                
                    <option value="IS-IS">Iceland/Icelandic</option>
                    <option value="IN-EN">India/English</option>
                    <option value="ID-EN">Indonesia/English</option>
                    <option value="ID-ID">Indonesia/Indonesian</option>
                    <option value="IE-EN">Ireland/English</option>
                    <option value="IT-IT">Italy/Italian</option>
                
                    <option value="JP-EN">Japan/English</option>
                    <option value="JP-JA">Japan/Japanese</option>
                    <option value="KR-EN">Korea/English</option>
                    <option value="KR-KO">Korea/Korea</option>
                    <option value="LV-EN">Latvia/English</option>
                    <option value="LT-EN">Lithuania/English</option>
                
                    <option value="LU-FR">Luxembourg/French</option>
                    <option value="LU-DE">Luxembourg/German</option>
                    <option value="MY-EN">Malaysia/English</option>
                    <option value="MY-MS">Malaysia/Malaysian</option>
                    <option value="MT-EN">Malta/English</option>
                    <option value="MX-EN">Mexico/English</option>
                
                    <option value="MX-ES">Mexico/Spanish</option>
                    <option value="NZ-EN">New Zealand/English</option>
                    <option value="NO-NO">Norway/Norwegian</option>
                    <option value="PH-EN">Philippines/English</option>
                    <option value="PL-PL">Poland/Polish</option>
                    <option value="PT-PT">Portugal/Portuguese</option>
                
                    <option value="RO-RO">Romania/Romanian</option>
                    <option value="RU-RU">Russia/Russian</option>
                    <option value="RS-SH">Serbia/Serbian</option>
                    <option value="SG-EN">Singapore/English</option>
                    <option value="SK-SK">Slovakia/Slovak</option>
                    <option value="SI-SL">Slovenia/Slovenian</option>
                
                    <option value="ZA-EN">South Africa/English</option>
                    <option value="ES-ES">Spain/Spanish</option>
                    <option value="SE-SV">Sweden/Swedish</option>
                    <option value="CH-FR">Switzerland/French</option>
                    <option value="CH-DE">Switzerland/German</option>
                    <option value="CH-IT">Switzerland/Italian</option>
                
                    <option value="TW-ZF">Taiwan/Chinese (Traditional)</option>
                    <option value="TW-EN">Taiwan/English</option>
                    <option value="TH-EN">Thailand/English</option>
                    <option value="TH-TH">Thailand/Thai</option>
                    <option value="NL-NL">The Netherlands/Dutch</option>
                    <option value="TR-TR">Turkey/Turkish</option>
                
                    <option value="GB-EN">United Kingdom/English</option>
                    <option value="US-EN">United States/English</option>
                    <option value="US-ES">United States/Spanish</option>
                    <option value="UY-EN">Uruguay/English</option>
                    <option value="UY-ES">Uruguay/Spanish</option>
                    <option value="VE-ES">Venezuela/Spanish</option>
                
                    <option value="VN-EN">Vietnam/English</option>
                    <option value="VN-VI">Vietnam/Vietnamese</option>
                </select>
            </div>
            <div class="msds-finder">
                <input class="msds-finder-box" tabindex="3" name="UTFNAME" value="<%=Global.getTranslatedText(currentPage, slingRequest,"Product Name / Keyword or MSDS")%>" onblur="if (this.value=='')this.value=this.defaultValue;" onfocus="if (this.value==this.defaultValue) this.value='';">
                <INPUT TYPE="HIDDEN" VALUE="" NAME="NAME"/>
                <INPUT TYPE="HIDDEN" VALUE="" NAME="NUMBER" TABINDEX="3"/>
            </div>
            <a class="msds-search-link" href="javascript: void(0);" onclick="return validateParameters(document.FormSearchInitial.UTFNAME,document.FormSearchInitial.NUMBER,document.FormSearchInitial.CNTRYLANG,'<%= keywordMessage%>','<%= countryMessage%>','<%= keywordDefaultValue%>');"><%=Global.getTranslatedText(currentPage, slingRequest,"SEARCH")%>
                <img alt="Arrow image, click to navigate" src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png" class="msds-search-link-arrow">
            </a>
        </form>
    </div>
</div>
<div class="clear"></div>
<!-- Product Finder -->
<!-- JA: Commenting out forLaunch, replacing with search button -->
<!--
<div class="product-finder-widget">
    <a class="#">Or Use the Product Finder</a> <a href="#"><img src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png" class="cta-arrow" alt="Arrow image, click to navigate to the Product Finder"></a> 
</div>
-->