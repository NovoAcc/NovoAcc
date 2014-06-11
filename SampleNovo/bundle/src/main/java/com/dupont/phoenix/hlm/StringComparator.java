package com.dupont.phoenix.hlm;

import java.text.Normalizer;
import java.util.Comparator;

import org.apache.commons.lang.StringUtils;

import com.dupont.phoenix.list.ListItem;

public class StringComparator implements Comparator<ListItem> {

	//private static final Logger logger = LoggerFactory.getLogger(StringComparator.class);
    public static final Comparator<ListItem> ASCENDING_IGNORECASE = new StringComparator("ascending",true);
    public static final Comparator<ListItem> DESCENDING_IGNORECASE = new StringComparator("descending",true);
    public static final Comparator<ListItem> ASCENDING = new StringComparator("ascending",false);
    public static final Comparator<ListItem> DESCENDING = new StringComparator("descending",false);

    private final String sort;
    private final Boolean ignoreCase;

    private StringComparator(String sort, Boolean ignoreCase) { 
        this.sort = StringUtils.isBlank(sort) ? "descending" : sort;
        this.ignoreCase = ignoreCase;
    }
    
    public static Comparator<ListItem> getInstance(String sort, Boolean ignoreCase) {
    	if(ignoreCase) {
    		return ( "ascending".equalsIgnoreCase(sort) ? ASCENDING_IGNORECASE : DESCENDING_IGNORECASE);
    	} else {
    		return ( "ascending".equalsIgnoreCase(sort) ? ASCENDING : DESCENDING);    		
    	}
    }

    public int compare(ListItem o1, ListItem o2) {
		String title1 = o1.getTitle();
		String title2 = o2.getTitle();
		String name1 = Normalizer.normalize(title1, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "");
		String name2 = Normalizer.normalize(title2, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "");
		if("ascending".equalsIgnoreCase(sort)) {
			return name1==null? 1 : ignoreCase ? name1.compareToIgnoreCase(name2) : name1.compareTo(name2);
		} else { 
			return name2==null? 1 : ignoreCase ? name2.compareToIgnoreCase(name1) : name2.compareTo(name1);
		}
	}
}
