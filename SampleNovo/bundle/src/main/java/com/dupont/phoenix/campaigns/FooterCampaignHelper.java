package com.dupont.phoenix.campaigns;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.designer.Style;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.taglibs.context.JSPContext;
import com.dupont.phoenix.taglibs.controllers.AbstractController;

public class FooterCampaignHelper extends AbstractController {
	
	public FooterCampaignHelper(final JSPContext context) {
		super(context);
		initialize();
		
	}

	private static final String FOOTER = "footer";
	private static final String COPYRIGHT_TEXT = "copyrightText";
	/* Basic Footer Variables */
	private static final Logger logger = LoggerFactory.getLogger(FooterCampaignHelper.class);
	
	private Style footerSiteConfigProps;

	/* Put variables accesible to extendible classes. */
	protected String copyRightText;

	private void initialize() {
		this.footerSiteConfigProps = Global.getSiteConfigStyle(getResource()) != null ? Global
				.getSiteConfigStyle(getResource()).getSubStyle(FOOTER) != null ? Global
				.getSiteConfigStyle(getResource()).getSubStyle(FOOTER) : null
				: null;
		setCopyRightText(findCopyRightText());
		logger.debug("FooterCampaignHelper Constructor");
	}


	protected String getSiteFooterConfigPropValue(String propName) {
		String val = StringUtils.EMPTY;
		if (this.footerSiteConfigProps != null) {
			val = (String) this.footerSiteConfigProps.get(propName,
					String.class);
		}
		return val;
	}

	private String findCopyRightText() {
		String copyrightText = getSiteFooterConfigPropValue(COPYRIGHT_TEXT);
		return copyrightText == null ? "" : copyrightText;
	}

	public String getCopyRightText() {
		return copyRightText;
	}

	public void setCopyRightText(String copyRightText) {
		this.copyRightText = copyRightText;
	}
}
