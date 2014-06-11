package com.dupont.phoenix.content;

import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.Resource;
import java.util.Iterator;
import java.util.List;

public interface Helper {
	Iterator<Resource> findResourcesByQuery(final ResourceResolver resolver, final String path, final List<String> options, final String querySuffix);
	Resource findResourceByResType(final Resource resource, final String resType);
}
