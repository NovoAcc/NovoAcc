<%--Import Tag Utility--%>
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
			com.day.cq.dam.api.Asset,
			com.day.cq.dam.api.Rendition,
			java.io.InputStream,
			org.apache.poi.ss.usermodel.Sheet,
			org.apache.poi.ss.usermodel.Workbook,
			org.apache.poi.ss.usermodel.WorkbookFactory,
			org.apache.poi.xssf.usermodel.XSSFCell,
			org.apache.poi.xssf.usermodel.XSSFRow,
			org.apache.poi.xssf.usermodel.XSSFSheet,
			org.apache.poi.xssf.usermodel.XSSFWorkbook,
			com.day.cq.tagging.TagManager"

%>
<%
	//String filePath = "/content/dam/assets/Test/DuPont Tags - Exported - RM_Dev - 18Feb14-TestIMport.xlsx";
	String filePath = "";
	Boolean hideComponent = false;
	Boolean isFileEntered = false;
	String fileMessage = "Click to Enter File Name & Import Tags.";
	final Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);
    if((properties.get("filePath", String.class)!= null)&&(properties.get("filePath", String.class)!= "")) {
        filePath = properties.get("filePath", String.class);
        fileMessage = "File Path: " + filePath;
        isFileEntered = true;

    }
    if(properties.get("hideComponent", Boolean.class) != null) {
        hideComponent = properties.get("hideComponent", Boolean.class);
    }
    if (isFileEntered) {
%>
<br>
<h2 class="row-title">Import Tag</h2>
<form name="purgewf" method="GET" style="clear:both">
<%=fileMessage%><br>
<input type="submit" value="Import"/><br>
<input type="hidden" name="import_tags" value="1" />
</form>
<%
    } else if (isEdit && !isFileEntered) {
%>
<br>
<h2 class="row-title">Import Tag</h2>
<%=fileMessage%><br>
<%
    }
%>

<%
if(request.getParameter("import_tags") != null && isFileEntered) {
	/*
    if(request.getParameter("node_path") != null) {
		filePath = request.getParameter("node_path");
    }
    */
    try {
        out.print("<b>File Path:</b>" + filePath + "<br>");
        ResourceResolver resolver = slingRequest.getResourceResolver();
        Resource res = resolver.getResource(filePath);
        if (res != null) {
            ResourceResolver resolver2 = slingRequest.getResourceResolver();
            TagManager tagManager = resolver2.adaptTo(TagManager.class);
            Asset tagExcelAsset = res.adaptTo(Asset.class);
            Rendition tagExcelFile = tagExcelAsset.getOriginal();
            //URL url = new URL("http://10.168.214.11:4502/content/dam/assets/Test/DuPont%20Tags%20-%20Exported%20-%20RM_Dev%20-%2018Feb14-TestIMport.xlsx");
            InputStream tagExcelIS = tagExcelFile.getStream();
            if (tagExcelIS != null) {
                //Workbook workBook = WorkbookFactory.create(new FileInputStream("http://10.168.214.11:4502/content/dam/assets/Test/DuPont%20Tags%20-%20Exported%20-%20RM_Dev%20-%2018Feb14-TestIMport.xlsx"));
                //Workbook workBook = WorkbookFactory.create(new FileInputStream("http://10.168.214.11:4502/content/dam/assets/Test/DuPont Tags - Exported - RM_Dev - 18Feb14-TestIMport.xlsx"));
                Workbook workBook = WorkbookFactory.create(tagExcelIS);
                Sheet sheet = workBook.getSheetAt(0);
                ArrayList<String> headerArray = new ArrayList<String>();
                ArrayList<String> titlePropArray = new ArrayList<String>();
                XSSFRow row = (XSSFRow) sheet.getRow(0);
                Iterator cellIter = row.cellIterator();
                while(cellIter.hasNext()) {
                    XSSFCell cell = (XSSFCell) cellIter.next();
                    String cellValue = "";
                    if (XSSFCell.CELL_TYPE_STRING==cell.getCellType()) {
                        cellValue = cell.getStringCellValue();
                        //headerArray.add(cellValue);
                        headerArray.add("jcr:"+cellValue.toLowerCase());
                    }
                }
                for (String headerValue : headerArray) {
                    //out.print(headerValue+"<br>");
                }

                Iterator rowIter = sheet.rowIterator();
                row = (XSSFRow) rowIter.next(); //Skip the header row from the iterator
                String tagID = "";
                int i =0;
                while(rowIter.hasNext())
                {
                    row = (XSSFRow) rowIter.next(); //Skip the header row from the iterator
                    cellIter = row.cellIterator();
                    String tagPath = "";
                    Node tagNode = null;
                    Boolean isUpdated = false;
                    while(cellIter.hasNext())
                    {
                        XSSFCell cell = (XSSFCell) cellIter.next();
                        String cellValue = "";
                        if (XSSFCell.CELL_TYPE_STRING==cell.getCellType()) {
                            cellValue = cell.getStringCellValue();
                        }
        
                        if (null!=cellValue && !"".equals(cellValue) && cell.getColumnIndex() == 1) {
                            tagID = cellValue;
                            /*
                                Can't find the API function to set the tag title for a locale. 
                                Hence, need to get the full path of tag and then set the title using node API.
                            */
                            tagPath = tagManager.resolve(tagID).getPath();
                            //out.print("Path: " + tagPath + ", ");
                            tagNode = slingRequest.getResourceResolver().getResource(tagPath).adaptTo(Node.class);
                            //out.print(tagNode.getName() + "<br>");
                        }
                        if (cell.getColumnIndex() > 2 && null!=cellValue && !"".equals(cellValue)) {
                            //out.print("Header: " + headerArray.get(cell.getColumnIndex()) + ",value: " + cellValue + "<br>");
                            if (tagNode != null) {
                                tagNode.setProperty(headerArray.get(cell.getColumnIndex()),cellValue);
                                isUpdated = true;
                            } else {
                                out.print("Unable to set titles for: <b>" + tagID + "</b>. Tag Not Found.<br>");
                            }

                        }
                    }
                    if (tagNode != null && isUpdated) {
                        tagNode.getSession().save();
                        out.print("Updated <b>" + tagID + "</b> for some or all titles.<br>");
                    }
                }
            } else {
		        out.print("Unable to read file. Please check.<br>");
            }
        } else {
			out.print("File Not Found at given path. Please check.<br>");
        }
    } catch (Exception e) {
        out.print(e.getMessage());
    }
}
%>