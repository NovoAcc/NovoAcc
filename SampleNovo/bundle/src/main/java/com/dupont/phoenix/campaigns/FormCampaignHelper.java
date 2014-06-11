package com.dupont.phoenix.campaigns;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.ValueFormatException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.WCMMode;
import com.dupont.phoenix.GlobalConstants;
import com.dupont.phoenix.campaigns.bean.FormCampaignBean;
import com.dupont.phoenix.taglibs.context.JSPContext;
import com.dupont.phoenix.taglibs.controllers.AbstractController;


/**
 * @author nishant.d.singh
 *
 */

public class FormCampaignHelper extends AbstractController{

	
	private final Logger logger = LoggerFactory.getLogger(FormCampaignHelper.class);

	private FormCampaignBean formBean;
	
	public FormCampaignHelper(final JSPContext context) {
		super(context);
		
	}
	
	public void initilize() {
		logger.debug("FormCampaignHelper Init Start!!");
		 formBean = new FormCampaignBean();
		 formBean.setDisclaimertext(getDisclaimerText());
		 formBean.setSelectedJSFilePaths(getSelectedJSFilePaths());
		 formBean.setSelectedCSSFilePaths(getSelectedCSSFilePaths());
		 formBean.setEditModeFlag(getIsEditMode());
		 formBean.setPageTitle(getPageTitle());
		 formBean.setShowHideFlag(getIsShowComponent());
		 logger.debug("FormCampaignHelper Init END!!");
	}
	
	private String getDisclaimerText() {
		logger.debug("FormCampaignHelper getDisclaimerText Start!!");
		String fileContent = StringUtils.EMPTY;
		Node jcrContent = null;
		InputStream stream = null;
		Resource original = null;
		String filePath = (String)getProperties().get(GlobalConstants.DISCLAIMER_PATH);
		try {
			if (StringUtils.isNotEmpty(filePath)) {
				original = getResourceResolver().getResource(
						filePath + GlobalConstants.JCR_CONTENT_PATH_FOR_ORIGINAL_CONTENT);
				if (original != null) {
					jcrContent = original.adaptTo(Node.class);
					stream = jcrContent.getProperty(GlobalConstants.JCR_DATA).getBinary()
							.getStream();
					// convert the input stream to string
					StringWriter writer = new StringWriter();
					IOUtils.copy(stream, writer,GlobalConstants.UTF_16);
					fileContent = writer.toString();
				}

			}
		} catch (ValueFormatException e) {
			logger.error("getDisclaimerText Value Format Exception : ", e);
		} catch (PathNotFoundException e) {
			logger.error("getDisclaimerText Path Not Found Exception : ", e);
		} catch (RepositoryException e) {
			logger.error("getDisclaimerText Repository Exception : ", e);
		} catch (IOException e) {
			logger.error("getDisclaimerText Input Output Exception : ", e);
		} finally{
			if(null!=stream){
				try {
					stream.close();
				} catch (IOException e) {
					logger.error("getDisclaimerText Input Output Exception : ", e);
				}
			}
		}
		logger.debug("FormCampaignHelper getDisclaimerText End!!");
		return fileContent;
	}
	
	private Boolean getIsEditMode(){
		Boolean flag = null;
		if((WCMMode.fromRequest(getSlingRequest()) == WCMMode.EDIT)){
			flag = Boolean.TRUE;
		}else{
			flag = Boolean.FALSE;
		}
		return flag;
	}
	
	   private Boolean getIsShowComponent() {
	    	return !(getProperties().containsKey(GlobalConstants.FORM_FLAG) ? getProperties().get(GlobalConstants.FORM_FLAG, Boolean.class) : false);    	
	    }

	   private String getPageTitle(){
		   String pageTitle = StringUtils.EMPTY;
		   pageTitle = getCurrentPage().getTitle();
		   return pageTitle;
	   }
	
	private String[] getSelectedJSFilePaths(){
		String[] filePath = null;
		filePath = getProperties().get(GlobalConstants.SELECT_JS_FILE_PATHS, String[].class);
		return filePath;
	}
	
	private String[] getSelectedCSSFilePaths(){
		String[] filePath = null;
		filePath = getProperties().get(GlobalConstants.SELECT_CSS_FILE_PATHS, String[].class);
		return filePath;
	}

	public FormCampaignBean getFormBean() {
		initilize();
		return formBean;
	}
	
	
		
}
