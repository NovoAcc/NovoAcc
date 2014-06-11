package com.adobe.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;

import javax.jcr.AccessDeniedException;
import javax.jcr.InvalidItemStateException;
import javax.jcr.ItemExistsException;
import javax.jcr.ReferentialIntegrityException;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.lock.LockException;
import javax.jcr.nodetype.ConstraintViolationException;
import javax.jcr.nodetype.NoSuchNodeTypeException;
import javax.jcr.version.VersionException;
import javax.servlet.ServletException;

import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.commons.jcr.JcrUtil;
import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.tagging.JcrTagManagerFactory;
import com.day.cq.tagging.TagManager;

@Component
@SlingServlet(generateComponent = false, paths = "/bin/excelTagIngestor")
public class ExcelTagIngestor<RunMode> extends SlingAllMethodsServlet {
	private static final int TAGSHEET_TITLE_ROW = 0;

	private static final long serialVersionUID = 225639814968007385L;

	private static final Logger LOGGER = LoggerFactory.getLogger(ExcelTagIngestor.class);

	@Reference
	private ResourceResolverFactory resourceResolverFactory;
	@Reference
	private JcrTagManagerFactory tagManagerfactory;

	@Override
	protected void doGet(SlingHttpServletRequest request,
			SlingHttpServletResponse response) throws ServletException,
			IOException {
		LOGGER.error("HTTP Get is invalid for this servlet, calling doPost.");
		doPost(request, response);
	}

	@Override
	protected void doPost(SlingHttpServletRequest request,
			SlingHttpServletResponse response) throws ServletException,
			IOException {

		LOGGER.info("Starting ExcelTagIngestor servlet");

		ResourceResolver resourceResolver = null;
		InputStream inputStream = null;
		Session session = null;
		try {
			RequestParameter fileParam = null;
			RequestParameter ignoreParam = null;
			RequestParameter baseParam = null;
			try {
				fileParam = request.getRequestParameter("file");
				ignoreParam = request.getRequestParameter("ignore");
				baseParam = request.getRequestParameter("base");
			} catch (Exception exception) {
				LOGGER.error("Input parameter missing!  'file', 'ignore', and 'base' parameters are required", exception);
				return;
			}
			inputStream = fileParam.getInputStream();
			String fileName = fileParam.getFileName();
			String base = baseParam.getString();
			String[] ignore = ignoreParam.getString().split(",");
			LOGGER.error("ignore element 0 is " + ignore[0]);

			LOGGER.error("ExcelTagIngestor data filename = " + fileName);

			resourceResolver = getResourceResolver();
			if(null!=resourceResolver){
			session = resourceResolver.adaptTo(Session.class);
			}
			XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
			LOGGER.info("Got the workbook in ExcelTagIngestor");
			processWorkbook(session, workbook, base, ignore);
			LOGGER.info("done processing the workbook in ExcelTagIngestor");

			LOGGER.info("Processing ExcelTagIngestor complete");
		} catch (Exception e) {
			LOGGER.error("ExcelTagIngestor import failed.");
			LOGGER.error(e.getMessage(), e);
		} finally {
			if (null!=resourceResolver) {
				resourceResolver.close();
				resourceResolver = null;
			}

			try {
				if(null!=session){
				session.save();
				}
			} catch (AccessDeniedException e) {
				LOGGER.error("Access Denied Exception :",e);
			} catch (ItemExistsException e) {
				LOGGER.error("ItemExistsException Exception :",e);
			} catch (ReferentialIntegrityException e) {
				LOGGER.error("ReferentialIntegrityException Exception :",e);
			} catch (ConstraintViolationException e) {
				LOGGER.error("ConstraintViolationException Exception :",e);
			} catch (InvalidItemStateException e) {
				LOGGER.error("InvalidItemStateException Exception :",e);
			} catch (VersionException e) {
				LOGGER.error("VersionException Exception :",e);
			} catch (LockException e) {
				LOGGER.error("LockException Exception :",e);
			} catch (NoSuchNodeTypeException e) {
				LOGGER.error("NoSuchNodeTypeException Exception :",e);
			} catch (RepositoryException e) {
				LOGGER.error("RepositoryException Exception :",e);
			}

		}
		LOGGER.info("ExcelTagIngestor import servlet complete");
	}

	private void processWorkbook(Session session, XSSFWorkbook wb,
			String tagBase, String[] ignore) {
		Sheet tagSheet = wb.getSheetAt(0);

		Row titleRow = tagSheet.getRow(TAGSHEET_TITLE_ROW);
		Iterator<Cell> cellIt = titleRow.cellIterator();
		while (cellIt.hasNext()) {
			Cell tagCategoryCell = cellIt.next();

			// get column header name
			String tagCategory = tagCategoryCell.getStringCellValue().trim();

			LOGGER.error("tagCategory name is: " + tagCategory);
			if (shouldProcessThisTagHeading(tagCategoryCell, ignore)) {
				LOGGER.error("Will process tags for tag header: " + tagCategory);

				// create tags in this category for every cell beneath this
				// heading **ONLY** if the tag category isn't a hierarchical
				// tag name like industry/sub-industry
				if (!tagCategory.contains("/")) {
					createTagCategory(session, tagCategory, tagBase);
				}

				Iterator<Row> rows = tagSheet.rowIterator();
				// iterate over all the rows, gettin getting this column's value
				// for each row
				while (rows.hasNext()) {
					Row row = rows.next();
					if (row.getRowNum() >= 1) {
						LOGGER.error("processing ({},{})", row.getRowNum(),
								tagCategoryCell.getColumnIndex());
						Cell tagCell = row.getCell(tagCategoryCell
								.getColumnIndex());

						if (tagCell != null) {
							String tagName = tagCell.getStringCellValue().trim();
							LOGGER.error(
									"Retrieved tag for tagCategory '{}' is '{}'",
									tagCategory, tagName);

							if (tagName.length() > 0) {

								addTagToCategory(session, tagName, tagCategory,
										tagBase);
							}
						} else {
							// found the empty cell at the bottom of the tag
							// list
							// break and start the next tag...
							break;
						}
					}
				}
			}
		}
	}

	private void addTagToCategory(Session session, String tagName,
			String tagCategory, String tagBase) {
		final TagManager tm = tagManagerfactory.getTagManager(session);
		try {
			LOGGER.error("before splitting, tagName is '{}'",tagName);
			String[] tagParts = tagName.split("/");
			
			//clean up the individual pieces of the path and put the string back together
			for (int i = 0; i < tagParts.length; i++) {
				tagParts[i] = JcrUtil.createValidName(tagParts[i]);
			}
			tagName = StringUtils.join(tagParts, '/');
			LOGGER.error("after joining, the tagName is '{}'", tagName);

			String newTagId = null;
			if (tagCategory.contains("/")) {
				newTagId = tagBase + ":" + tagName;
			} else {
				newTagId = tagBase + ":" + JcrUtil.createValidName(tagCategory) + "/" + tagName;
			}
			
			
			if (tm.canCreateTag(newTagId)) {
				tm.createTag(newTagId, tagParts[tagParts.length-1],
						"automatically created by tagIngestion");
			}
		} catch (InvalidTagFormatException e) {
			LOGGER.error("InvalidTagFormatException Exception :", e);
		}
	}
	
	private void createTagCategory(Session session, String tagCategory,
			String tagBase) {
		final TagManager tm = tagManagerfactory.getTagManager(session);
		try {
			String newTag = tagBase + ":" + JcrUtil.createValidName(tagCategory);
			if (tm.canCreateTag(newTag)) {
				tm.createTag(newTag, JcrUtil.createValidName(tagCategory),
						"automatically created by tagIngestion");
			}
		} catch (InvalidTagFormatException e) {
			LOGGER.error("InvalidTagFormatException Exception :", e);
		}
	}


	private boolean shouldProcessThisTagHeading(Cell cell, String[] ignore) {
		boolean rcBool = true;
		String prospectiveTagHeader = cell.getStringCellValue().trim()
				.toLowerCase();
		for (int i = 0; i < ignore.length; i++) {
			if (ignore[i].equalsIgnoreCase(prospectiveTagHeader)) {
				rcBool = false;
				break;
			}
		}
		return rcBool;
	}

	private ResourceResolver getResourceResolver(){
		ResourceResolver resourceResolver = null;
		try {
			resourceResolver = resourceResolverFactory
					.getAdministrativeResourceResolver(null);
		} catch (LoginException e) {
			LOGGER.error("Login Exception :: ", e);

		}
		return resourceResolver;
	}

/*	private String formatToNodeName(String tagTitle, boolean processingTagName) {
		logger.error("formatToNodeName() - incoming tag is: '" + tagTitle + "'");
		tagTitle = tagTitle.replaceAll("[^A-Za-z0-9|]+", "-")
				.replaceAll("(^-+)|(-+$)", "").toLowerCase();
		if (processingTagName) {
			while (tagTitle.contains("|")) {
				tagTitle = tagTitle.replace('|', '/');
			}
		}
		logger.error("formatToNodeName() - returning tag is: '" + tagTitle
				+ "'");
		return (tagTitle);
	} */

}