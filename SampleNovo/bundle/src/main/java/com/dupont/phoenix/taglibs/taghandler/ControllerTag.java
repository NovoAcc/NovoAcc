package com.dupont.phoenix.taglibs.taghandler;

import java.lang.reflect.Constructor;
//import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspTagException;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.Tag;
import javax.servlet.jsp.tagext.TagSupport;

//import org.apache.sling.api.scripting.SlingScriptHelper;
import org.apache.sling.commons.classloader.DynamicClassLoaderManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dupont.phoenix.taglibs.context.JSPContext;
import com.dupont.phoenix.taglibs.controllers.Controller;

/**
 * The Class ControllerTag.
 */
public class ControllerTag extends TagSupport {
	
	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = -1286294351451379953L;
	
	private final Logger COMMON_LOGGER = LoggerFactory.getLogger(ControllerTag.class);
	
	/** The CLASS_NAME. */
	private static final String CLASS_NAME = ControllerTag.class.getSimpleName();
	
	/** The pc. */
	private transient PageContext pc;
	
	/** The parent. */
	private transient Tag parent;
	
	/** The cls. */
	private String cls;
	
	/** The var. */
	private String var;
	
	/** The colon. */
	private static final String colon = "': ";
	
	/** The Constant MORETOEXPLORELINKS. */
	private static final String NULL_VALUE = null;
	
	/**
	 * Start tag: Instantiate controller class.
	 * @return SKIP_BODY
	 * @throws JspException JSP exception
	 */
	@Override
	public int doStartTag() throws JspException {
		COMMON_LOGGER.debug("doStartTag()");
		try {
			if (cls != null && var != null) {
				final JSPContext jspContext = new JSPContext(pc);
				final DynamicClassLoaderManager dclm = jspContext.getSling()
						.getService(DynamicClassLoaderManager.class);
				final ClassLoader dynamicClassLoader = dclm.getDynamicClassLoader();
				final Class<?> cl = dynamicClassLoader.loadClass(cls);
				final Constructor<?> co = cl.getConstructor(JSPContext.class);
				final Controller ctrl = (Controller) co.newInstance(jspContext);
				// Don't Remove - We can use this functionality in future
			//	injectOSGiServices(ctrl, dynamicClassLoader, jspContext.getSling());
				ctrl.init();
				pc.setAttribute(var, ctrl);
			}
		} catch (ClassNotFoundException e) {
			COMMON_LOGGER.error(CLASS_NAME, "class not found Exception Occured", e);
			throw new JspTagException("ClassNotFoundException while loading controller '" + cls + colon, e);
		} catch (NoSuchMethodException e) {
			COMMON_LOGGER.error(CLASS_NAME, "NoSuchMethodException Occured", e);
			throw new JspTagException("NoSuchMethodException while loading controller '" + cls + colon, e);
		} catch (InstantiationException e) {
			COMMON_LOGGER.error(CLASS_NAME, "InstantiationException Occured", e);
			throw new JspTagException("InstantiationException while loading controller '" + cls + colon, e);
		} catch (IllegalAccessException e) {
			COMMON_LOGGER.error(CLASS_NAME, "IllegalAccessException Occured", e);
			throw new JspTagException("IllegalAccessException while loading controller '" + cls + colon, e);
		} catch (InvocationTargetException e) {
			COMMON_LOGGER.error(CLASS_NAME, "InvocationTargetException Occured", e);
			throw new JspTagException("InvocationTargetException while loading controller '" + cls + colon, e);
		}
		COMMON_LOGGER.debug(CLASS_NAME, "doStartTag()");
		return SKIP_BODY;
	}
	
	/**
	 * Inject OSGi services into @Reference annotated fields<br/>
	 * Emulates the Felix @Reference annotation.
	 * @param obj Object to inject into
	 * @param dynamicClassLoader Dynamic class loader
	 * @param sling Sling script helper
	 * @throws JspTagException the jsp tag exception
	 */
	// Don't Remove - We can use this functionality in future
	/*
	private void injectOSGiServices(Object obj, ClassLoader dynamicClassLoader, SlingScriptHelper sling)
			throws JspTagException {
		COMMON_LOGGER.debug(CLASS_NAME, "injectOSGiServices()");
		Field[] fields = obj.getClass().getDeclaredFields();
		for (Field field : fields) {
			if (field.isAnnotationPresent(Reference.class)) {
				try {
					Class<?> aClass = dynamicClassLoader.loadClass(field.getType().getName());
					field.set(obj, sling.getService(aClass));
				} catch (IllegalAccessException e) {
					COMMON_LOGGER.error(CLASS_NAME, "IllegalAccessException Occured", e);
					throw new JspTagException("Could not inject OSGi reference for {}: " + field.getType(), e);
				} catch (ClassNotFoundException e) {
					COMMON_LOGGER.error(CLASS_NAME, "ClassNotFoundException Occured", e);
					throw new JspTagException("Could not inject OSGi reference for {}: " + field.getType(), e);
				}
			}
		}
	}
*/	
	/*
	 * (non-Javadoc)
	 * @see javax.servlet.jsp.tagext.TagSupport#doEndTag()
	 */
	/**
	 * Do end tag.
	 * @return the int
	 * @throws JspException the jsp exception
	 */
	@Override
	public int doEndTag() throws JspException {
		
		return EVAL_PAGE;
	}
	
	/*
	 * (non-Javadoc)
	 * @see javax.servlet.jsp.tagext.TagSupport#setPageContext(javax.servlet.jsp.PageContext)
	 */
	/**
	 * Sets the page context.
	 * @param p the new page context
	 */
	@Override
	public void setPageContext(PageContext p) {
		
		pc = p;
	}
	
	/*
	 * (non-Javadoc)
	 * @see javax.servlet.jsp.tagext.TagSupport#setParent(javax.servlet.jsp.tagext.Tag)
	 */
	/**
	 * Sets the parent.
	 * @param t the new parent
	 */
	@Override
	public void setParent(Tag t) {
		
		parent = t;
	}
	
	/*
	 * (non-Javadoc)
	 * @see javax.servlet.jsp.tagext.TagSupport#getParent()
	 */
	/**
	 * Gets the parent.
	 * @return the parent
	 */
	@Override
	public Tag getParent() {
		
		return parent;
	}
	
	/**
	 * Sets the cls.
	 * @param s the new cls
	 */
	public void setCls(String s) {
		
		cls = s;
	}
	
	/**
	 * Gets the cls.
	 * @return the cls
	 */
	public String getCls() {
		
		return cls;
	}
	
	/**
	 * Gets the var.
	 * @return the var
	 */
	public String getVar() {
		
		return var;
	}
	
	/**
	 * Sets the var.
	 * @param var the new var
	 */
	public void setVar(String var) {
		
		this.var = var;
	}
	
	/*
	 * (non-Javadoc)
	 * @see javax.servlet.jsp.tagext.TagSupport#release()
	 */
	/**
	 * Release.
	 */
	@Override
	public void release() {
		
		pc = null;
		parent = null;
		cls = NULL_VALUE;
		var = NULL_VALUE;
	}
	
}
