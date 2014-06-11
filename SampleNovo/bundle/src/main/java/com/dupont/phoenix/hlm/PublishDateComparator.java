package com.dupont.phoenix.hlm;

import java.util.Comparator;
import java.util.Date;

import org.apache.commons.lang.StringUtils;

import com.dupont.phoenix.list.ListItem;

public class PublishDateComparator implements Comparator<ListItem> {

   // private static final Logger logger = LoggerFactory.getLogger(LastModificationDateComparator.class);
    public static final Comparator<ListItem> ASCENDING = new PublishDateComparator("ascending");
    public static final Comparator<ListItem> DESCENDING = new PublishDateComparator("descending");

    private final String sort;

    private PublishDateComparator(String sort) {
        this.sort = StringUtils.isBlank(sort) ? "descending" : sort;
    }
    
    public static Comparator<ListItem> getInstance(String sort) {
    	return ( "ascending".equalsIgnoreCase(sort) ? ASCENDING : DESCENDING);
    }
	
	public int compare(ListItem arg0, ListItem arg1) {
		//logger.info("LastModificationDateComparator:");
        Date date = arg0.getPublished();
        Date date1 = arg1.getPublished();
        //logger.info("Date1:"+ (date!=null ? date.toString():"") + " Date2:"+ (date1!=null? date1.toString():""));
        if (date == null) {
        	return 1;
        }
        return (date1 != null) ? date1.compareTo(date) : -1;
	}

	public String getSort() {
		return sort;
	}		
}
