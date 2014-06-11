package com.dupont.phoenix.navigation;

import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;
import com.day.cq.wcm.api.Page;

public class PersistentNavigation {	
	
	public static List<Page> findPages(final Page currentPage) {
		List<Page> navigationPages = new ArrayList<Page>();
		
		Page parentPage = currentPage.getParent();
		
		Iterator<Page> itr = parentPage.listChildren();
		
		while(itr.hasNext())
		{
			Page page = itr.next();
			if(page != null && page.isHideInNav() == false)
			navigationPages.add(page);
		}
		
		return navigationPages;
	}



}
