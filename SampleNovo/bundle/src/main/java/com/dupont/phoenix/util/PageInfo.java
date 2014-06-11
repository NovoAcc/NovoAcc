package com.dupont.phoenix.util;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;
import com.dupont.phoenix.workflow.impl.process.MigrationUtils;
import com.dupont.phoenix.workflow.impl.process.ResponsiveUpgradeConstants;

public class PageInfo {
	private PageInfo(){
		//do nothing
	}
	
	public static boolean isRWDCapable(final Page p) throws PathNotFoundException, RepositoryException {
		boolean ret = true;
		if (p != null && p.hasContent()) {
			Node node = p.adaptTo(Node.class);
			String templatePath = p.getTemplate()!=null?p.getTemplate().getPath():null;
			if(templatePath!=null) {
				Node cntNode = node.getNode(JcrConstants.JCR_CONTENT);
				if (ResponsiveUpgradeConstants.RESPONSIVE_TEMPLATES.contains(templatePath)) {
					ret = MigrationUtils.isValidNode(p, cntNode);
				}
			}
		}
		return ret;
	}
}
