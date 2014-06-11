package com.dupont.phoenix;

import java.io.Serializable;
import java.util.Comparator;

public  class GlobalNavListItemComparator implements Comparator<GlobalNavListItem> , Serializable{ 
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int compare (GlobalNavListItem o1, GlobalNavListItem o2)
	{
		return o1.getNodeName().compareTo(o2.getNodeName());

	}
}

