package com.dupont.phoenix.list;

import java.util.List;
import com.dupont.phoenix.content.AbstractHelper;
import com.dupont.phoenix.list.ListItem;

public abstract class ListHelper extends AbstractHelper {
	
    protected List<ListItem> items;
    
    public List<ListItem> getListItems() {
    	return items;
    }
    
    public void setListItems(List<ListItem> list) {
    	this.items = list;
    }
    
    public int getListSize () {
    	return (items!=null) ? items.size() :  0;
    }
    
    public abstract String getListViewType();
}
