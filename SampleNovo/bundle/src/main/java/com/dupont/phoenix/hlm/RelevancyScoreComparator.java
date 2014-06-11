package com.dupont.phoenix.hlm;

import java.util.Comparator;

import org.apache.commons.lang.StringUtils;

import com.dupont.phoenix.list.ListItem;

public class RelevancyScoreComparator implements Comparator<ListItem> {

	//private static final Logger logger = LoggerFactory.getLogger(RelevancyScoreComparator.class);
	public static final Comparator<ListItem> ASCENDING = new RelevancyScoreComparator("ascending");
    public static final Comparator<ListItem> DESCENDING = new RelevancyScoreComparator("descending");

    private final String sort;

    private RelevancyScoreComparator(String sort) {
        this.sort = StringUtils.isBlank(sort) ? "descending" : sort;
    }
    
    public static Comparator<ListItem> getInstance(String sort) {
    	return ( "ascending".equalsIgnoreCase(sort) ? ASCENDING : DESCENDING);
    }
    

    public int compare(ListItem o1, ListItem o2) {
        Integer score1 = (o1.getRelevancyScore()!=null)?o1.getRelevancyScore():0;
        Integer score2 = (o2.getRelevancyScore()!=null)?o2.getRelevancyScore():0;
        //logger.info("score1:"+score1 + " score2:"+score2);
        return ("ascending".equalsIgnoreCase(sort) ?  score1.compareTo(score2) : score2.compareTo(score1));
    }	
}
