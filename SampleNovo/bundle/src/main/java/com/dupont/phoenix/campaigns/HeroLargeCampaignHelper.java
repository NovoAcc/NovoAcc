package com.dupont.phoenix.campaigns;

import org.apache.commons.lang.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.WCMMode;
import com.day.cq.wcm.api.components.DropTarget;
import com.day.cq.wcm.foundation.Image;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.GlobalConstants;
import com.dupont.phoenix.campaigns.bean.HeroLargeCampaignBean;
import com.dupont.phoenix.commons.Scene7Image;
import com.dupont.phoenix.taglibs.context.JSPContext;
import com.dupont.phoenix.taglibs.controllers.AbstractController;
import com.dupont.phoenix.GlobalConstants;

public class HeroLargeCampaignHelper extends AbstractController {

	private HeroLargeCampaignBean heroLargeBean;
	

	private static final Logger logger = LoggerFactory
			.getLogger(HeroLargeCampaignHelper.class);

	public HeroLargeCampaignHelper(final JSPContext context) {
		super(context);
		
	}
	

	private void initialize() {
		logger.debug("HeroLargeCampaign Init Start!!");
		try {
			heroLargeBean = new HeroLargeCampaignBean();
			heroLargeBean
					.setAuthor(WCMMode.fromRequest(getSlingRequest()) == WCMMode.EDIT);
			Image heroImage = new Scene7Image(getResource(), getSlingRequest());
			heroLargeBean.setHeroImage(heroImage);
			heroLargeBean.setMarkUp(createHeroImageMarkup());
			// country code of a page
			heroLargeBean.setConutryCode(StringUtils.lowerCase(Global
					.getCountryCode(getCurrentPage())));
			setHeroProperties();
		} catch (Exception e) {
			logger.error("Exception in Hero Large Campaign: ", e);
		}
		logger.debug("HeroLargeCampaign Init END!!");
	}

	private void setHeroProperties() {
		Boolean hasImage = heroLargeBean.getHeroImage().hasContent() ? true
				: false;
		// Read the heroColor
		String heroColor = getPageProperties()
				.containsKey(GlobalConstants.HERO_COLOR)
				&& null != getPageProperties().get(GlobalConstants.HERO_COLOR) ? getPageProperties()
				.get(GlobalConstants.HERO_COLOR).toString() : "";
		heroColor = GlobalConstants.BACKGROUND_COLOR_STYLE + heroColor;
		heroLargeBean.setPageTitle(processHeroTitle());
		String strDivMainTitle = GlobalConstants.HERO_LARGE_TITLE;
		String strDivMainTitleBG = GlobalConstants.HERO_LARGE_TITLE_BG;
		String strDivMain = StringUtils.EMPTY;
		String heroColorClass = StringUtils.EMPTY;
		// Declare the Divs
		if (hasImage) {
			strDivMain = GlobalConstants.HERO_LARGE;
		} else {
			strDivMain = GlobalConstants.HERO_LARGE_NO_IMG;
			heroColorClass = heroColor;
			heroColor = "";
		}
		heroLargeBean.setHasImage(hasImage);
		heroLargeBean.setHeroColor(heroColor);
		heroLargeBean.setHeroColorClass(heroColorClass);
		heroLargeBean.setStrDivMain(strDivMain);
		heroLargeBean.setStrDivMainTitle(strDivMainTitle);
		heroLargeBean.setStrDivMainTitleBG(strDivMainTitleBG);
	}
	private String processHeroTitle() {
		String pageTitle = StringUtils.EMPTY;
		if (null != getProperties().get(GlobalConstants.HERO_TITLE)) {
			pageTitle = getProperties().get(GlobalConstants.HERO_TITLE).toString();
		} else if (null !=getCurrentPage().getTitle()) {
			pageTitle = getCurrentPage().getTitle();
		}
		return pageTitle;
	}
	private String createHeroImageMarkup() {
		String imgClass = "";
		String imgTitle = getProperties().containsKey(GlobalConstants.JCR_TITLE)
				&& null != getProperties().get(GlobalConstants.JCR_TITLE) ? getProperties()
				.get(GlobalConstants.JCR_TITLE).toString() : "";
		String imageSource = getProperties()
				.containsKey(GlobalConstants.FILE_REFERENCE)
				&& null != getProperties().get(GlobalConstants.FILE_REFERENCE) ? getProperties()
				.get(GlobalConstants.FILE_REFERENCE).toString() : "";
		String imgAlt = getProperties().containsKey(GlobalConstants.ALT)
				&& null != getProperties().get(GlobalConstants.ALT) ? getProperties()
				.get(GlobalConstants.ALT).toString() : "";
		// hero image mark up generation
		heroLargeBean.getHeroImage().set(Image.PN_HTML_WIDTH,
				GlobalConstants.HEROLARGE_WIDTH);
		heroLargeBean.getHeroImage().set(Image.PN_HTML_HEIGHT,
				GlobalConstants.HEROLARGE_HEIGHT);
		imgClass = DropTarget.CSS_CLASS_PREFIX + GlobalConstants.IMAGE;
		heroLargeBean.getHeroImage().addCssClass(imgClass);
		String imgSrc = "";
		if (null != getProperties().get(GlobalConstants.DAM_SCENE7URL)) {
			imgSrc = getProperties().get(GlobalConstants.DAM_SCENE7URL).toString();
		} else {
			imgSrc = imageSource;
		}
		return Global.picturefillMarkup(imgAlt, imgSrc, imgClass, imgTitle);
	}
	public HeroLargeCampaignBean getHeroLargeBean() {
		initialize();
		return heroLargeBean;
	}
}
