/**
 * 
 */
package com.adobe.util;

import java.io.Writer;

import com.day.cq.commons.TidyJSONWriter;

/**
 * @author work
 *
 */
public class CustomJSONWriter extends TidyJSONWriter{

	
	public CustomJSONWriter(Writer w) {
		super(w);
		// TODO Auto-generated constructor stub
	}

	public String getWriter()
	{
		return super.writer.toString();
	}
}
