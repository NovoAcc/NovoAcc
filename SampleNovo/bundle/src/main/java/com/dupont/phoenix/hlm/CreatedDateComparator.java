package com.dupont.phoenix.hlm;

import com.dupont.phoenix.list.ListItem;
import java.util.Comparator;
import java.util.Date;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CreatedDateComparator implements Comparator<ListItem> {
	private static final Logger logger = LoggerFactory
			.getLogger(CreatedDateComparator.class);
	public static final Comparator<ListItem> ASCENDING = new CreatedDateComparator(
			"ascending");
	public static final Comparator<ListItem> DESCENDING = new CreatedDateComparator(
			"descending");
	private final String sort;

	private CreatedDateComparator(String sort) {
		this.sort = (StringUtils.isBlank(sort) ? "descending" : sort);
		logger.info("CreatedDateComparator : " + sort);
	}

	public static Comparator<ListItem> getInstance(String sort) {
		return "ascending".equalsIgnoreCase(sort) ? ASCENDING : DESCENDING;
	}

	public int compare(ListItem arg0, ListItem arg1) {
		logger.info("CreatedDateComparator:");
		Date date = arg0.getCreated();
		Date date1 = arg1.getCreated();
		if (date == null){
			return 1;
		}
		return date1 != null ? date1.compareTo(date) : -1;
	}

	public String getSort() {
		return sort;
	}
}