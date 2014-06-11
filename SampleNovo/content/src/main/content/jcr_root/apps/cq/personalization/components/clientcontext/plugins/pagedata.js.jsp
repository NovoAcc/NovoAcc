<%@page session="false"%>
<%--**********************************************************************
  *
  * ADOBE CONFIDENTIAL
  * __________________
  *
  *  Copyright 2011 Adobe Systems Incorporated
  *  All Rights Reserved.
  *
  * NOTICE:  All information contained herein is, and remains
  * the property of Adobe Systems Incorporated and its suppliers,
  * if any.  The intellectual and technical concepts contained
  * herein are proprietary to Adobe Systems Incorporated and its
  * suppliers and are protected by trade secret or copyright law.
  * Dissemination of this information or reproduction of this material
  * is strictly forbidden unless prior written permission is obtained
  * from Adobe Systems Incorporated.
  **********************************************************************--%>
<%@ include file="/libs/foundation/global.jsp" %>
<%@ page import="com.day.cq.commons.TidyJSONWriter,
                 org.apache.sling.api.scripting.SlingScriptHelper,
                 org.apache.sling.commons.json.io.JSONWriter,
                 com.day.cq.wcm.api.WCMException,
                 com.day.cq.tagging.Tag,
                 com.day.cq.tagging.TagManager,
                 org.apache.sling.api.resource.ValueMap,
                 java.util.Map.Entry,
                 org.apache.commons.lang.StringUtils,
                 org.apache.sling.api.resource.ResourceResolver,
                 com.day.cq.wcm.core.stats.PageViewStatistics,
                 java.io.StringWriter,
                 java.util.Date,
                 java.util.Locale,
                 java.text.DecimalFormat,
                 java.util.Date,
                 java.util.Iterator,
                 java.util.Collection,
                 javax.jcr.Property,
                 javax.jcr.PropertyIterator,
                 com.adobe.util.CustomJSONWriter,
                 java.util.Random"
        contentType="text/javascript"%>
<%
    StringWriter buf = new StringWriter();

    CustomJSONWriter writer = new CustomJSONWriter(buf);
    writer.setTidy(true);
    try 
    {
        Page cPage = null;
        if (request.getParameter("path") != null) 
        {
            Resource r = resourceResolver.getResource(request.getParameter("path"));
            cPage = (r != null ? r.adaptTo(Page.class) : null);
        } 
        else 
        {
            cPage = currentPage;
        }
        
        writer.object();
        /* The Page Tags
        */
        String contentType = null;
        String resourceType = "";
	    
          Node cNode = cPage.adaptTo(Node.class);
          Node jcrNode = cNode.getNode("jcr:content");
          
          if(jcrNode.hasProperty("sling:resourceType"))
          {
        	  resourceType = jcrNode.getProperty("sling:resourceType").getValue().getString();
        	  if(resourceType != null && !"".equals(resourceType))
        	  {
        		  if("dupont/phoenix/components/pages/industry".equals(resourceType))
        		  {
        			  resourceType = "industry";
        		  }
        		  else if("dupont/phoenix/components/pages/subindustry".equals(resourceType))
        		  {
        			  resourceType = "subindustry";
        		  }
        		  else if("dupont/phoenix/components/pages/brand".equals(resourceType))
        		  {
        			  resourceType = "brand";
        		  }
        		  else if("dupont/phoenix/components/pages/subbrand".equals(resourceType))
        		  {
        			  resourceType = "subbrand";
        		  }
        		  else if("dupont/phoenix/components/pages/productcat".equals(resourceType))
        		  {
        			  resourceType = "productcat";
        		  }
        		  else if("dupont/phoenix/components/pages/productcatgroup".equals(resourceType))
        		  {
        			  resourceType = "productcatgroup";
        		  }
        		  else if("dupont/phoenix/components/pages/productservicedetail".equals(resourceType))
        		  {
        			  resourceType = "productservicedetail";
        		  }
        	  }
        	  
          }
          
          	if(jcrNode.hasProperty("contentType"))
          	{
          		writer.key("contentType").value(jcrNode.getProperty("contentType").getValue().getString());
          		//log.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> contentType: " + jcrNode.getProperty("contentType").getValue().getString());
          		if(jcrNode.hasProperty("jcr:title"))
          		{
          			writer.key("contentTypeAndTitle").value(jcrNode.getProperty("contentType").getValue().getString() + " : " + jcrNode.getProperty("jcr:title").getValue().getString());
          			//log.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> contentTypeAndTitle: " + jcrNode.getProperty("contentType").getValue().getString() + " : " + jcrNode.getProperty("jcr:title").getValue().getString());
          		}
          	}
          	Locale pageLocale = cPage.getLanguage(false);
          	if(pageLocale.getDisplayLanguage() != null)
          	{
          		writer.key("language").value(pageLocale.getDisplayLanguage());
          		//log.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> language: " + pageLocale.getDisplayLanguage());
          	}
          	if(pageLocale.getDisplayCountry() != null)
          	{
          		writer.key("country").value(pageLocale.getDisplayCountry());
          		//log.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> country: " + pageLocale.getDisplayCountry());
          	}


          if (cPage != null) 
          {
              long monthlyHits = 0;
              try 
              {
                  final PageViewStatistics pwSvc = sling.getService(PageViewStatistics.class);
                  Object[] hits = pwSvc.report(cPage);
                  if (hits != null && hits.length > 2) 
                  {
                      monthlyHits = (Long) hits[2];
                  }
              } 
              catch (WCMException ex) 
              {
                  monthlyHits = -1;
              }
              writer.key("hits").value(monthlyHits);
              writer.key("title").value(cPage.getTitle());
              writer.key("path").value(cPage.getPath());

              String navTitle = cPage.getNavigationTitle();
              if(navTitle == null) 
              {
                  navTitle = cPage.getTitle();
              }
              if(navTitle == null) 
              {
                  navTitle = cPage.getName();
              }
              writer.key("navTitle").value(navTitle);

              if(cPage.getTemplate() != null) 
              {
                  writer.key("template").value(cPage.getTemplate().getPath());
                  writer.key("thumbnail").value(cPage.getTemplate().getThumbnailPath());
              }

              //There has to be a better way to do this???
              //TODO:Move these two a java class and use StringBuilder instead of String
              Tag[] tags = cPage.getTags(); //Related Tags
              String tagsStr = "";
              String subBusinessUnit ="";
              String subIndustry = "";
              String subBrand = "";
              String product = "";
              String productCategory = "";
              String productCategoryGroup = "";
              String industry = "";
              String brand = "";
              String megatrends = "";
              String businessUnit = "";
              int tagLength = tags!=null ? tags.length : 0;
              for(int tagCount=0; tagCount < tagLength; tagCount++) {
            	  	Tag tag = tags[tagCount];
	            	if((StringUtils.countMatches(tag.getPath(), "/") == 6) && tag.getPath().startsWith("/etc/tags/DuPont/business_unit")) {
	            		subBusinessUnit = String.format("%s%s%s",subBusinessUnit,StringUtils.isNotBlank(subBusinessUnit)?",":"",tag.getTitle());
	            	} else if((StringUtils.countMatches(tag.getPath(), "/") == 5) && tag.getPath().startsWith("/etc/tags/DuPont/business_unit")) {
	            		businessUnit = String.format("%s%s%s",businessUnit,StringUtils.isNotBlank(businessUnit)?",":"",tag.getTitle());
	            	} else if((StringUtils.countMatches(tag.getPath(), "/") == 6) && tag.getPath().startsWith("/etc/tags/DuPont/industry")) {
	            		subIndustry = String.format("%s%s%s",subIndustry,StringUtils.isNotBlank(subIndustry)?",":"",tag.getTitle());
	            	} else if((StringUtils.countMatches(tag.getPath(), "/") == 5) && tag.getPath().startsWith("/etc/tags/DuPont/industry")) {
	            		industry = String.format("%s%s%s",industry,StringUtils.isNotBlank(industry)?",":"",tag.getTitle());
	            	} else if((StringUtils.countMatches(tag.getPath(), "/") == 6) && tag.getPath().startsWith("/etc/tags/DuPont/brands")) {
	            		subBrand = String.format("%s%s%s",subBrand,StringUtils.isNotBlank(subBrand)?",":"",tag.getTitle());
	            	} else if((StringUtils.countMatches(tag.getPath(), "/") == 5) && tag.getPath().startsWith("/etc/tags/DuPont/brands")) {
	            		brand = String.format("%s%s%s",brand,StringUtils.isNotBlank(brand)?",":"",tag.getTitle());
	            	} else if((StringUtils.countMatches(tag.getPath(), "/") == 5) && tag.getPath().startsWith("/etc/tags/DuPont/products")) {
	            		product = String.format("%s%s%s",product,StringUtils.isNotBlank(product)?",":"",tag.getTitle());
	            	} else if((StringUtils.countMatches(tag.getPath(), "/") == 6) && tag.getPath().startsWith("/etc/tags/DuPont/pcg")) {
	            		productCategory = String.format("%s%s%s",productCategory,StringUtils.isNotBlank(productCategory)?",":"",tag.getTitle());
	            	} else if((StringUtils.countMatches(tag.getPath(), "/") == 5) && tag.getPath().startsWith("/etc/tags/DuPont/pcg")) {
	            		productCategoryGroup = String.format("%s%s%s",productCategoryGroup,StringUtils.isNotBlank(productCategoryGroup)?",":"",tag.getTitle());
	            	} else if((StringUtils.countMatches(tag.getPath(), "/") == 5) && tag.getPath().startsWith("/etc/tags/DuPont/megatrend")) {
	            		megatrends = String.format("%s%s%s",megatrends,StringUtils.isNotBlank(megatrends)?",":"",tag.getTitle());
	            	}
	            	tagsStr = String.format("%s%s%s",tagsStr,StringUtils.isNotBlank(tagsStr)?",":"",tag.getTitle());
              }
              writer.key("tags").value(tagsStr);
              
            if(subBusinessUnit != null && !"".equals(subBusinessUnit))  
      			writer.key("subBusinessUnit").value(subBusinessUnit);
            if(businessUnit != null && !"".equals(businessUnit))  
    			writer.key("businessUnit").value(businessUnit);
            if(megatrends != null && !"".equals(megatrends))  
    			writer.key("megatrends").value(megatrends);
            if(subIndustry != null && !"".equals(subIndustry))  
    			writer.key("subIndustry").value(subIndustry);
            if(subBrand != null && !"".equals(subBrand))  
    			writer.key("subBrand").value(subBrand);
            if(product != null && !"".equals(product))  
    			writer.key("product").value(product);
            if(productCategory != null && !"".equals(productCategory))  
    			writer.key("productCategory").value(productCategory);
            if(productCategoryGroup != null && !"".equals(productCategoryGroup))  
    			writer.key("productCategoryGroup").value(productCategoryGroup);
            if(industry != null && !"".equals(industry))  
    			writer.key("industry").value(industry);
            if(brand != null && !"".equals(brand))  
    			writer.key("brand").value(brand);
                		
			if(jcrNode.hasProperty("pageTag")) {
				Value[] pageTagValues = jcrNode.getProperty("pageTag").getValues();            	  
				if(pageTagValues != null && pageTagValues.length > 0) {
					Value tag = pageTagValues[pageTagValues.length-1];//take the last page tag
					TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
  	            	Tag resolvedTag = tagManager.resolve(tag.getString());
  	            	if((StringUtils.countMatches(tag.getString(), "/") == 2) && tag.getString().startsWith("DuPont:industry") && "subindustry".equals(resourceType)) {
  	            		writer.key("subIndustry").value(resolvedTag.getTitle());
  	            	} else if((StringUtils.countMatches(tag.getString(), "/") == 2) && tag.getString().startsWith("DuPont:brands") && "subbrand".equals(resourceType)) {
  	            		writer.key("subBrand").value(resolvedTag.getTitle());
  	            	} else if((StringUtils.countMatches(tag.getString(), "/") == 1) && tag.getString().startsWith("DuPont:products") && "productservicedetail".equals(resourceType)) {
  	            		writer.key("product").value(resolvedTag.getTitle());
  	            	} else if((StringUtils.countMatches(tag.getString(), "/") == 2) && tag.getString().startsWith("DuPont:pcg") && "productcat".equals(resourceType)) {
  	            		writer.key("productCategory").value(resolvedTag.getTitle());
  	            	} else if((StringUtils.countMatches(tag.getString(), "/") == 1) && tag.getString().startsWith("DuPont:pcg") && "productcatgroup".equals(resourceType)) {
  	            		writer.key("productCategoryGroup").value(resolvedTag.getTitle());
  	            	} else if((StringUtils.countMatches(tag.getString(), "/") == 1) && tag.getString().startsWith("DuPont:industry") && "industry".equals(resourceType)) {
  	            		writer.key("industry").value(resolvedTag.getTitle());
  	            	} else if((StringUtils.countMatches(tag.getString(), "/") == 1) && tag.getString().startsWith("DuPont:brands") && "brand".equals(resourceType) && !(brand != null && !"".equals(brand))) {
  	            		writer.key("brand").value(resolvedTag.getTitle());
  	            	}
				}
			}
              
              
              String descr = cPage.getDescription();
              writer.key("description").value(descr != null ? descr : "");

              Page siteLevelPage = cPage.getAbsoluteParent(2);
              if ( siteLevelPage != null )
              {
                  writer.key("sitesection").value(siteLevelPage.getName());
              }
              
              Page topLevelPage = cPage.getAbsoluteParent(3);
              if ( topLevelPage!= null )
              {
                  writer.key("subsection").value(topLevelPage.getName());
              }

          }

          Random rand = new Random(new Date().getTime());
          DecimalFormat df = new DecimalFormat("0.00");
          double r = rand.nextDouble();
          writer.key("random").value(df.format(r));
          //log.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WRITER IS TIDY?: " + writer.isTidy());
          writer.endObject();
          //log.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WRITER: " + writer.getWriter());
          
          
    } 
    catch (Exception e) 
    {
    	e.printStackTrace();
        //log.error("Error while generating JSON pagedata initial data", e);
    }
%>
if( CQ_Analytics && CQ_Analytics.PageDataMgr) {
    CQ_Analytics.PageDataMgr.loadInitProperties(<%=buf%>, true);
}