package com.dupont.phoenix;

import java.io.Serializable;
import java.util.Comparator;

public class SortIgnoreCaseComparator implements Comparator<Object>, Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public int compare(Object item1, Object item2) {
        return item1.toString().toLowerCase().compareTo(item2.toString().toLowerCase());
     }
 }