<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page session="false"
    import="com.day.cq.wcm.api.WCMMode,
            org.apache.sling.api.resource.Resource,
            org.apache.sling.api.resource.ResourceResolver,
            org.apache.commons.lang.StringUtils,
            java.util.*,
            javax.jcr.PropertyIterator, 
            javax.jcr.Property,
            javax.jcr.Node, 
            javax.jcr.NodeIterator,
            javax.jcr.query.Query,
            com.day.cq.commons.Externalizer,
			java.util.regex.*,
			com.day.cq.tagging.Tag,
			org.apache.sling.api.SlingHttpServletRequest,
			com.day.cq.wcm.msm.api.LiveRelationshipManager,
			com.day.cq.wcm.msm.api.LiveRelationship,
			com.day.cq.wcm.msm.api.RolloutManager.Trigger,
			com.day.cq.wcm.api.LanguageManager,
			com.day.cq.commons.Language,
            org.apache.sling.api.SlingHttpServletRequest"
%>
<script>
	var tableToExcel = (function() {
		var uri = 'data:application/vnd.ms-excel;base64,'
                        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
                                        'xmlns="http://www.w3.org/TR/REC-html40"><head>' +
                                        '<!--[if gte mso 9]>' +

                                        '<xsl:template name="styles">' +
                                        '<style>' +
                                        '@page {' +
                                        'margin:.25in .25in .25in .25in;' +
                                        'mso-header-margin:.15in;' +
                                        'mso-footer-margin:.15in;' +
                                        'mso-page-orientation:landscape;' +
                                        '}' +

                                        'tr { mso-height-source:auto; }' +
                                        'col { mso-width-source:auto; }' +
                                        'br { mso-data-placement:same-cell; }' +

                                        'td {' +
                                        'mso-style-parent:style0;' +
                                        'padding-top:1px;' +
                                        'padding-right:1px;' +
                                        'padding-left:1px;' +
                                        'mso-ignore:padding;' +
                                        'color:windowtext;' +
                                        'font-size:11.0pt;' +
                                        'font-weight:300;' +
                                        'font-style:normal;' +
                                        'text-decoration:none;' +
                                        'font-family:Calibri;' +
                                        'mso-generic-font-family:auto;' +
                                        'mso-font-charset:0;' +
                                        'mso-number-format:General;' +
                                        'text-align:general;' +
                                        'vertical-align:bottom;' +
                                        'border:none;' +
                                        'mso-background-source:auto;' +
                                        'mso-pattern:auto;' +
                                        'mso-protection:locked visible;' +
                                        'white-space:wrap;' +
                                        'mso-rotate:0;' +
                                        'background-color:#EAF2D3;' +
                                        '}' +

                                        '.header {' +
                                        'mso-style-parent:style0;' +
                                        'font-weight:700;' +
                                        '}' +

                                        '.text {mso-number-format:"@";}' +
                                        '.number {mso-number-format:"0";}' +
                                        '.date {mso-number-format:"dd-mm-yyyy";text-align:left;}' +

                                        '</style>' +

                                        '<xml>' +
                                        '<x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>' +
                                        '<x:Name>{worksheet}</x:Name>' +
                                        '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>' +
                                        '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>' +
                                        '</xml>' +
                                        '<![endif]-->' +
                                        '</head>' +
                                        '<body>' +
                                        '<table>{table}</table>' +
                                        '</body>' +
                                        '</html>'
        , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }

      return function(table, name, filename) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
            document.getElementById("dlink").href = uri + base64(format(template, ctx));
            document.getElementById("dlink").download = filename;
            document.getElementById("dlink").click();
      }
    }) () 
	//var domain = window.location.host;
</script>
<br>
<h2 class="row-title">Export Tag</h2>
<form name="purgewf" method="GET" style="clear:both">
<!--<label><b>Node Path:</b>  </label>
<input type="text" name="node_path" value="" size="100"/>-->
<input type="submit" value="Generate Report"/>
<input id="exportButton" type="button" onclick="tableToExcel('report', 'All-Tag-Report', 'All-Tag-Report')" value="Export to Excel" style="display:none"><br>
<!--label style="color: yellowgreen;"><b>Note: </b>Node Path should start with <b>/content/</b> </label><br-->
<!--<label style="color: yellowgreen;"><em>Example: /content/en_us/home/industries</em></label><br>-->
<input type="hidden" name="generate" value="1" />
<a id="dlink"  style="display:none;"></a>
</form>
<%
if(request.getParameter("generate") != null) {
	%><script>document.getElementById("exportButton").style.display="inline";</script><%

	String parentPath = "/etc/tags/DuPont";
    if(request.getParameter("node_path") != null) {
		parentPath = request.getParameter("node_path");
    }
    ResourceResolver resolver = slingRequest.getResourceResolver();
    Iterator<Resource> resourceIterator = null;

    int size = 0;
    StringBuilder result = null;
    StringBuilder queryString = null;
	String tagID = "";

	//out.println("Report Generated for: <b>" + country + "</b>");
	try {
        	queryString = new StringBuilder().append("SELECT * FROM [cq:Tag] AS s WHERE (ISDESCENDANTNODE(["+parentPath+"]))");
			resourceIterator = resolver.findResources(StringUtils.trim(queryString.toString()), Query.JCR_SQL2);

			Map<String, Tag> tagMap = new TreeMap<String,Tag>();
            while (resourceIterator.hasNext()) {
                Resource res = (Resource) resourceIterator.next();
                Tag dupontTag = res.adaptTo(Tag.class);
                if (dupontTag != null) {
                    tagMap.put(dupontTag.getTagID(), dupontTag);
                }
            }
        	Node tagNode = resolver.getResource("/etc/tags").adaptTo(Node.class);
        	Value[] tagLanguages = new Value[0];
        	//Value[] tagLanguages = tagNode.getProperty("languages").getValues();
			String[] languageCodeArray = {"en_us","en_gb","de_de","en_in","en_ca","es_mx","fr_ca","fr_fr","pt_br","ru_ru","zh_cn","es_ar","es_cl","tr_tr","en_ae","en_au","zh_tw","es_co","ja_jp","es_es","it_it","en_sg","en_nz","zh_hk","pl_pl","en_za","vi_vn","ko_kr","id_id","fr_be","nl_be","nl_nl","da_dk","cs_cz","hu_hu","es_pe","ru_ua","es_ve","en","de","fr","es","it","ja"};
        	String[] vCQDefaultlanguageCodeArray = {"en","de","fr","es","it","ja"};
            if (tagNode.hasProperty("languages")) {
                tagLanguages = tagNode.getProperty("languages").getValues();
            }
        	ArrayList<String> languageCodeList = new ArrayList<String>();
			for(Value tagLanguage : tagLanguages) {
			//for(String tagLanguage : languageCodeArray) {
                if (!Arrays.asList(vCQDefaultlanguageCodeArray).contains(tagLanguage.getString())) {
                    languageCodeList.add(tagLanguage.getString());
                }
			}
            size = tagMap.size();
            if(size>0) {
                %><br><table border="1" id="report">
                <tr bgcolor="Silver">
                <td style="width:40px;"><b>S. No.</b></td>
                <td style="width:300px;"><b>ID</b></td>
                <td style="width:150px;"><b>Title</b></td>
				<%
				for(String tagLanguage : languageCodeList) {
				//for(Value tagLanguage : tagLanguages) {
				//for(String tagLanguage : languageCodeArray) {
                    %><td style="width:150px;"><b>Title.<%=Language.getLocale(tagLanguage).toString()%></b></td><% // Language.getLocale(tagLanguage).toString() OR tagLanguage.getString()
                }
				%>
                <%
                %></tr><%
                int counter = 1;
				for(Map.Entry<String,Tag> tagEntry : tagMap.entrySet()) {
				//for(Tag tagInstance : tagList) {
                    //if (tagInstance != null) {
                    	Tag tagInstance = tagEntry.getValue();
                        String tagTitle = tagInstance.getTitle();
                        tagID = tagEntry.getKey();
                        //To save all Locale Titles
                        Map<Locale, String> tagTitleMap = tagInstance.getLocalizedTitles();
                        //tagTitleMap = tagInstance.getLocalizedTitles();
                        if(counter%2==0) {
                            %><tr class="alt"><%
                        } else {
                            %><tr><%
                        }
                        %>
        				<td><%=counter++%></td>
                        <td style="text-wrap:normal;word-wrap:break-word"><%=tagID%></td>
                        <td><%=tagTitle%></td>
						<%
						for(String tagLanguage : languageCodeList) {
						//for(Value tagLanguage : tagLanguages) {
						//for(String tagLanguage : languageCodeArray) {
                            //Locale tlocale = Language.getLocale(tagLanguage.getString());
                            Locale tlocale = Language.getLocale(tagLanguage);
                            if (tagTitleMap.get(tlocale) != null) {
                                %><td><%=tagTitleMap.get(tlocale)%></td><%
                            } else {
                                %><td> </td><%
                            }
                        }
	                    %></tr><%
					//}
                }
                %></table><%
            }
        } catch(Exception e) {
            out.println("Error Message: "+e.toString() + ", Tag: " + tagID);
        }
}
%> 
<style>
#report
{
table-layout: fixed;
font-family: Arial;
width:100%;
border-collapse:collapse;
}
#report td, #report th 
{
font-size:0.8em;
/*border:1px solid #98bf21;*/
border:1px solid #ffffff;
width:250px;
padding:3px 7px 2px 7px;
text-wrap:normal;
word-wrap:break-word
}
#report th
{
font-size:13.9px;
text-align:left;
padding-top:5px;
padding-bottom:4px;
background-color:#A7C942;
color:#ffffff;
}
#report tr.alt td 
{
color:#000000;
/*background-color:#EAF2D3;*/
border:1px solid #DEEBF6;
background-color:#DEEBF6;
}
</style>
