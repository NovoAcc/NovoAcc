package com.dupont.phoenix.footer;

import java.util.List;

import com.dupont.phoenix.Global;
import com.dupont.phoenix.campaigns.FooterCampaignHelper;
import com.dupont.phoenix.taglibs.context.JSPContext;

public class FooterHelper extends FooterCampaignHelper {
	
	public FooterHelper(final JSPContext context) {
		super(context);
		initialize();
	}
	
	/* Basic Footer Variables */
	//private static final Logger logger = LoggerFactory.getLogger(FooterHelper.class);
	/* Put variables accesible to extendible classes. */
	protected List<String> corporateLinks;
	protected List<String> utilityLinks;
	protected String ipcText;


	
	private void initialize() {
		setCorporateLinks(findCorporateLinks());
		setUtilityLinks(findUtilityLinks());
		setIPCText(findIPCText());
	}

	private List<String> findCorporateLinks() {
		String corpLinksNode = getSiteFooterConfigPropValue("corporateFolderPath");
		return Global.getNavigationChildList(corpLinksNode, getResource(), getSlingRequest(),Boolean.FALSE);
	}

	private List<String> findUtilityLinks() {
		String utilityLinksNode = getSiteFooterConfigPropValue("utilityLinksFolderPath");
		return Global.getNavigationChildList(utilityLinksNode, getResource(), getSlingRequest(),Boolean.TRUE);
	}

	private String findIPCText() {
		String ipcTextValue = "";
		ipcTextValue = getSiteFooterConfigPropValue("ipcText");
		return ipcTextValue == null? "" : ipcTextValue;
	}

	public List<String> getCorporateLinks() {
		return corporateLinks;
	}

	public void setCorporateLinks(List<String> corporateLinks) {
		this.corporateLinks = corporateLinks;
	}

	public List<String> getUtilityLinks() {
		return utilityLinks;
	}

	public void setUtilityLinks(List<String> utilityLinks) {
		this.utilityLinks = utilityLinks;
	}

	public String getIPCText() {
		return ipcText;
	}

	public void setIPCText(String ipcText) {
		this.ipcText = ipcText;
	}
}
