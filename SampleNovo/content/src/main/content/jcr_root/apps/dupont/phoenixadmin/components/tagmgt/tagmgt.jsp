<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.day.cq.wcm.api.WCMMode,
				com.dupont.phoenix.Global,
				java.util.Iterator,
				java.util.List,
				org.apache.sling.api.resource.PersistableValueMap,
				java.util.ArrayList,
				com.dupont.phoenix.content.AbstractHelper,
				com.day.cq.tagging.Tag,
				com.day.cq.tagging.TagManager,
				com.day.cq.wcm.api.PageFilter,
				com.day.cq.wcm.api.Page,
				com.dupont.phoenix.GlobalConstants" %><%
%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><%
%><h2 style="font-size:20px">Provide moved tags within the dialog:</h2><%
final String[] tags = properties.get("movedTag",String[].class);
final TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
final AbstractHelper helper = new AbstractHelper();
if(tags!=null && tags.length>0) {
	for(String aTag: tags) {
		log.info("provided tag (moved tag):"+aTag);
		Tag tag = tagManager.resolve(aTag);
		Resource tagResource = tag.adaptTo(Resource.class);
		ValueMap tagProps = tagResource.adaptTo(ValueMap.class);
		String[] oldTagIds = tagProps.get("cq:backlinks",String[].class);
		if(oldTagIds==null || oldTagIds.length==0) continue;
		for(String oldTagId : oldTagIds) {
	        %><p><b><%=aTag%></b> ===> <%=oldTagId.replaceFirst("/etc/tags/DuPont/", "DuPont:")%></p><%
	        Tag oldTag = tagManager.resolve(oldTagId);
	        if(oldTag!=null) {
				List<String> options = new ArrayList<String>();
                //options.add(String.format("(@cq:tags='%s')",oldTagId.replaceFirst("/etc/tags/DuPont/", "DuPont:")));
                options.add(String.format("(@jcr:content/cq:tags='%s')",oldTagId.replaceFirst("/etc/tags/DuPont/", "DuPont:")));
	     	 	Iterator<Resource> resourcesWithOldTag = helper.findResourcesByQuery(resourceResolver, "/content", options, null);
	        	while(resourcesWithOldTag.hasNext()) {
	        	 	Resource resourceWithOldTag = resourcesWithOldTag.next();
                    Resource jcrResourceWithOldTag = resourceWithOldTag.getChild("jcr:content");
                    if (jcrResourceWithOldTag!=null) {
						%><p><a target="new" href="<%=resourceWithOldTag.getPath()%>.html"><%=resourceWithOldTag.getPath()%>.html</a></p><%
                        Tag[] tagsWithOldTag = tagManager.getTags(jcrResourceWithOldTag);
                        final List<Tag> list =  new ArrayList<Tag>();
                        for(Tag tagWithOldTag : tagsWithOldTag) {
                            if(!oldTagId.equals(tagWithOldTag.getPath())) {
                                list.add(tagWithOldTag);
                            }
                        }
                        Tag[] newTags = list.toArray(new Tag[list.size()]);
                        tagManager.setTags(jcrResourceWithOldTag,newTags,true);
                    }
	        	}
	     	 	//find resources with page self tag and update it
	     	 	options = new ArrayList<String>();
	     	 	options.add(String.format("(@jcr:content/@pageTag='%s')",oldTagId.replaceFirst("/etc/tags/DuPont/", "DuPont:")));
	     	 	Iterator<Resource> resourcesWithSelfPageTag = helper.findResourcesByQuery(resourceResolver, "/content", options, null);
		       	 while(resourcesWithSelfPageTag.hasNext()) {
		     	 	Resource resourceWithOldSelfTag = resourcesWithSelfPageTag.next();
                    Resource jcrResourceWithOldSelfTag = resourceWithOldSelfTag.getChild("jcr:content");
                    if (jcrResourceWithOldSelfTag!=null) {
						%><p><a target="new" href="<%=resourceWithOldSelfTag.getPath()%>.html"><%=resourceWithOldSelfTag.getPath()%>.html</a></p><%
                        PersistableValueMap props = jcrResourceWithOldSelfTag.adaptTo(PersistableValueMap.class);
                        String[] newSelfTags = new String[1];
                        newSelfTags[0] = aTag;
                        props.put("pageTag", newSelfTags);
                        props.save();
                    }
		     	 }     	 	
	        }
		}
	}
}
%>