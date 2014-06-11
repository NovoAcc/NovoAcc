package com.dupont.phoenix.hlm;

import java.util.Comparator;

import org.apache.commons.lang.StringUtils;

import com.dupont.phoenix.list.ListItem;

public class RankComparator implements Comparator<ListItem> {

	//private static final Logger logger = LoggerFactory.getLogger(RankComparator.class);
    public static final Comparator<ListItem> ASCENDING = new RankComparator("ascending");
    public static final Comparator<ListItem> DESCENDING = new RankComparator("descending");

    private final String sort;

    private RankComparator(String sort) {
        this.sort = StringUtils.isBlank(sort) ? "descending" : sort;
    }
    
    public static Comparator<ListItem> getInstance(String sort) {
    	return ( "ascending".equalsIgnoreCase(sort) ? ASCENDING : DESCENDING);
    }

    public int compare(ListItem o1, ListItem o2) {
    	//logger.info("Rank Comparator:");
		String rank1 = o1.getRank()!=null?o1.getRank().toUpperCase():"";
		String rank2 = o2.getRank()!=null?o2.getRank().toUpperCase():"";
		//logger.info("rank1:"+rank1 + " rank2:"+rank2);
		//ascending order
		return rank1.compareTo(rank2);

	}

	public String getSort() {
		return sort;
	}

}
