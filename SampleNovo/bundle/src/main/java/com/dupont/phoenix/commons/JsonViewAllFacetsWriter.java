package com.dupont.phoenix.commons;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.jcr.ValueFormatException;

import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.io.JSONWriter;
import org.apache.sling.commons.json.jcr.JsonItemWriter;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.facets.Bucket;
import com.day.cq.search.facets.Facet;
import com.day.cq.search.result.SearchResult;
import com.dupont.phoenix.GlobalConstants;

public class JsonViewAllFacetsWriter extends JsonItemWriter {

	private static final Integer RECURSION_LEVEL = 2;
	
	public JsonViewAllFacetsWriter(Set<String> propertyNamesToIgnore) {
		super(propertyNamesToIgnore);
	}
	
	public Map<String, String> search(QueryBuilder builder, Session session, String targetFolder,
			String pageTag, String contentType) throws RepositoryException {
	    Map<String, String> retBuckets = new HashMap<String, String>();
	    // create query description as hash map (simplest way, same as form post)
	    Map<String, String> map = new HashMap<String, String>();
	    map.put("1_group.property","jcr:content/cq:tags");
	    map.put("1_group.p.or","true");
	    map.put("2_group.0_path",targetFolder);
	    map.put("3_group.0_type","cq:Page");
	    map.put("tagid", pageTag);
	    map.put("tagid.property","jcr:content/@cq:tags");
	    map.put("property","jcr:content/contentType");	  
	    map.put("property.1_value", contentType);
	    if(contentType!=null && contentType.equals(GlobalConstants.ARTICLE_CONTENT_TYPE_NAME)){
		    map.put("property.2_value", GlobalConstants.CORPORATE_CONTENT_DETAIL_CONTENT_TYPE_NAME);
	    }
	    map.put("p.hitwriter","full");
	    map.put("p.nodedepth","4");
	    map.put("orderby","path");
	    
	    // can be done in map or with Query methods
	    map.put("p.offset", "0"); // same as query.setStart(0) below
	    map.put("p.limit", "20"); // same as query.setHitsPerPage(20) below
	     
	    Query query = builder.createQuery(PredicateGroup.create(map), session);    
	    SearchResult result = query.getResult();

	    // extracting facets
	    Map<String, Facet> facets = result.getFacets();
	    for (Map.Entry<String, Facet> key : facets.entrySet()) {
	        Facet facet = key.getValue();
	        if (facet.getContainsHit()) {
	            for (Bucket bucket : facet.getBuckets()) {
	                String value = bucket.getValue();
	                long count = bucket.getCount();
	                retBuckets.put(value, count+"");
	            }
	        }
	    }
	    return retBuckets;
	}
	
	public String getBucketCount(Map<String, String> buckets, String tagPath) {
		String targetPath = tagPath.replaceFirst("/etc/tags/", "").replaceFirst("/", ":");
		return buckets.get(targetPath);
	}
	
	public Boolean isValidEntry(Map<String, String> buckets, String tagPath) {
		String targetPath = tagPath.replaceFirst("/etc/tags/", "").replaceFirst("/", ":");
		for(String key : buckets.keySet()) {
			if(key.startsWith(targetPath)) {
				return true;
			}
		}
		return false;
	}

	public void dump(Node node, JSONWriter w, int currentRecursionLevel, int maxRecursionLevels, Map<String, String> buckets, String path)
			throws RepositoryException, JSONException {
	    w.object();
	    PropertyIterator props = node.getProperties();
	    String count = getBucketCount(buckets, path);

	    while (props.hasNext()) {
	      Property prop = props.nextProperty();
	      writeProperty(w, prop, (count!=null) ? count : null);
	    }
	    if (recursionLevelActive(currentRecursionLevel, RECURSION_LEVEL)) {
	      NodeIterator children = node.getNodes();
	      while (children.hasNext()) {
	        Node n = children.nextNode();
	        //logger.info("Node name:"+n.getName());
	        String newPath = String.format("%s/%s",path,n.getName());
		    if(isValidEntry(buckets, newPath)) {
		    	dumpSingleNode(n, w, currentRecursionLevel, RECURSION_LEVEL, buckets, newPath);
		    }
	      }
	    }
	    w.endObject();
	}
	
	protected void dumpSingleNode(Node n, JSONWriter w, int currentRecursionLevel,
			int maxRecursionLevels, Map<String, String> buckets, String path) throws RepositoryException, JSONException {
		if (recursionLevelActive(currentRecursionLevel, maxRecursionLevels)) {
			w.key(n.getName());
			dump(n, w, currentRecursionLevel + 1, maxRecursionLevels, buckets, path);
		}
	}
	
	protected void writeProperty(JSONWriter w, Property p, String count) 
			throws ValueFormatException, RepositoryException, JSONException {
		if (p.getType() == 2) {
		      w.key(":" + p.getName());
		      if (!p.getDefinition().isMultiple()) {
		    	  w.value(p.getLength());
		      } else {
		    	  long[] sizes = p.getLengths();
		    	  w.array();
		    	  for (int i = 0; i < sizes.length; i++) {
		    		  w.value(sizes[i]);
		    	  }
		    	  w.endArray();
		      }
		      return;
		}
    	w.key(p.getName());

    	if (!p.getDefinition().isMultiple()) {
    		dumpValue(w, p.getValue(), count);
    	} else {
    		w.array();
    		for (Value v : p.getValues()) {
    			dumpValue(w, v, count);
    		}
    		w.endArray();
    	}
	}

	protected void dumpValue(JSONWriter w, Value v, String count) 
			throws ValueFormatException, IllegalStateException, RepositoryException, JSONException {
		switch (v.getType()) {
		    case 2:
		      w.value(0L);
		      break;
		    case 5:
		      w.value(format(v.getDate()));
		      break;
		    case 6:
		      w.value(v.getBoolean());
		      break;
		    case 3:
		      w.value(v.getLong());
		      break;
		    case 4:
		      w.value(v.getDouble());
		      break;
		    default:
		      w.value(String.format("%s%s",v.getString(), count!=null? " ("+count+")" :""));
		      break;
		}
	}	
}
