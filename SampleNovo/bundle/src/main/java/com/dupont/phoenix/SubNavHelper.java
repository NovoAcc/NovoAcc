package com.dupont.phoenix;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;

public final class SubNavHelper
{
  private static final Logger logger = LoggerFactory.getLogger(SubNavHelper.class);
  private Page currentPage;
  private SlingHttpServletRequest slingRequest;
  private boolean exitsHiddenPages;
  private String hiddenPages;
  private Resource resource;
  
  public SubNavHelper(final SlingHttpServletRequest slingRequest, final Page currentPage, final Resource resource)
  {
	this.exitsHiddenPages=false;
    this.currentPage = currentPage;
    this.slingRequest = slingRequest;
    this.resource = resource;
	this.hiddenPages="";
    logger.info("SubNavHelper Object Created!");
  }

  public List<String> getSubNavigationItems()
  {
    List<String> list = new ArrayList<String>();
    Iterator<Page> itr = this.currentPage.listChildren();
    if ((itr != null) && (itr.hasNext()))
    {
      
      while (itr.hasNext()) {
        Page child = (Page)itr.next();
		if (child.getNavigationTitle() == null) {
            this.hiddenPages=this.hiddenPages+", " + child.getTitle();
        }else{
        	this.hiddenPages=this.hiddenPages+", " + child.getNavigationTitle();
        }
		this.exitsHiddenPages=true;
        	
        
        if ((!child.isHideInNav()))
        {
         	
          String title = child.getNavigationTitle();
          if (title == null) {
            title = child.getTitle();
          }
          if (title == null) {
            title = child.getName();
          }

          title = StringEscapeUtils.escapeHtml(title);
          HashMap<String,String> attributesMap = new HashMap<String,String>();
          attributesMap.put("href", Global.getNavigationURL(slingRequest, child, false) + ".html");
          attributesMap.put("title", title);
          list.add(Global.renderLink(attributesMap, title, false, null, null));
        }
      }

   //   Collections.sort(list, new SortIgnoreCaseComparator());
    }
    return list;
  }
  
  public boolean Ispageshidden(){
	  return this.exitsHiddenPages;
  }
  
  public String PagesHidden(){
	  return this.hiddenPages;
  }

public Resource getResource() {
	return resource;
}
}