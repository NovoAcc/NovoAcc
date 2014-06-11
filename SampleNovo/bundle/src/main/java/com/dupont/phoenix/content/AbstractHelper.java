package com.dupont.phoenix.content;

import java.util.Iterator;
import java.util.List;
import javax.jcr.query.Query;
import org.apache.commons.lang.StringUtils;
import org.apache.jackrabbit.util.ISO9075;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AbstractHelper implements Helper {

	private static final Logger logger = LoggerFactory.getLogger(AbstractHelper.class);

	public Iterator<Resource> findResourcesByQuery(final ResourceResolver resolver, final String path, final List<String> options, final String querySuffix) {
		Iterator<Resource> resourceIterator = null;
		final String cleanedPath = cleanPath(path);
		if (StringUtils.isNotBlank(cleanedPath)) {
			final StringBuilder queryString = new StringBuilder( )
			.append("/jcr:root")
			.append(cleanedPath)
			.append("//element(*,cq:Page)");
			if ( options != null && !options.isEmpty()) {
				queryString.append("[");
				for( int i = 0; i < options.size(); i++ ) {
					final String option = options.get(i);
					queryString.append( i > 0 ? " and " : "" ).append( option );
				}
				queryString.append("] ");
			}
			if (StringUtils.isNotBlank(querySuffix)){
				queryString.append(querySuffix);
				}
			AbstractHelper.logger.info("findResourcesByPath: {}", queryString.toString());
			resourceIterator = resolver.findResources(StringUtils.trim(queryString.toString()),Query.XPATH);
		}
		return resourceIterator;
	}

	public Resource findResourceByResType(final Resource resource, final String resType) {
		if(resource !=null) {
			final Iterator<Resource> children = resource.listChildren();
			while (children.hasNext()) {
				final Resource child = children.next();
				if(ResourceUtil.isA(child, resType)) {
					return child;
				} else {
					findResourceByResType(child, resType);
				}
			}
		}	
		return null;
	}

	protected String cleanPath(final String path) {
		final StringBuilder result = new StringBuilder().append(path);
		if (!path.startsWith("/")) {
			result.insert(0,'/');
		}
		if (path.endsWith("/")) {
			result.deleteCharAt(result.length() - 1 );
		}
		return ISO9075.encodePath( result.toString() );
	}
}
