package com.dupont.phoenix.msm.actions;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.nodetype.NodeType;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.io.JSONWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.WCMException;
import com.day.cq.wcm.msm.api.ActionConfig;
import com.day.cq.wcm.msm.api.LiveAction;
import com.day.cq.wcm.msm.api.LiveRelationship;
import com.day.cq.wcm.msm.api.RolloutManager;

public abstract class BaseAction implements LiveAction {
	
  protected static final String PROP_TITLE = "cq.wcm.msm.action.title";
  protected static final String PROP_RANK = "cq.wcm.msm.action.rank";
  protected static final String PROP_PROPS = "cq.wcm.msm.action.properties";
  protected static final String PROP_PARAMETER = "cq.wcm.msm.action.parameter";
  protected static final String ACTION_TYPE = "actiontype";
  
  private final ValueMap config;
  private final RolloutManager rolloutManager;
  protected static final Logger log = LoggerFactory.getLogger(BaseAction.class);

  protected BaseAction(ValueMap config, RolloutManager rolloutManager) {
    this.config = config;
    this.rolloutManager = rolloutManager;
  }

  protected ValueMap getConfig() {
    return this.config;
  }

  protected RolloutManager getRolloutManager() {
    return this.rolloutManager;
  }

  protected boolean isPageLevel(Node node) throws RepositoryException {
    return (node.isNodeType("cq:Page")) || (node.getParent().isNodeType("cq:Page"));
  }

  protected boolean isExcludedNodeType(NodeType nodeType)
  {
    return (this.rolloutManager != null) && (this.rolloutManager.isExcludedNodeType(nodeType.getName()));
  }

  protected boolean isExcludedProperty(Property property) throws RepositoryException
  {
    return (this.rolloutManager != null) && (this.rolloutManager.isExcludedProperty(isPageLevel(property.getParent()), property.getName()));
  }

  protected abstract LiveAction newInstance(ValueMap paramValueMap);

  public String getName()
  {
    return getClass().getSimpleName();
  }
  protected abstract boolean handles(Resource paramResource1, Resource paramResource2, LiveRelationship paramLiveRelationship, boolean paramBoolean) throws RepositoryException, WCMException;

  protected abstract void doExecute(Resource paramResource1, Resource paramResource2, LiveRelationship paramLiveRelationship, boolean paramBoolean1, boolean paramBoolean2) throws RepositoryException, WCMException;

  public void execute(Resource source, Resource target, LiveRelationship relation, boolean autoSave, boolean isResetRollout) throws WCMException {
    try {
      if (handles(source, target, relation, isResetRollout)){
        doExecute(source, target, relation, autoSave, isResetRollout);
      }else {
        log.debug("{} did not act on request to roll-out {} to {}: but precondition was not met", new String[] { getName(), relation.getSourcePath(), relation.getTargetPath() });
      }

    }
    catch (RepositoryException e)
    {
      throw new WCMException(e);
    }
  }

  public void execute(ResourceResolver resolver, LiveRelationship relation, ActionConfig config, boolean autoSave) throws WCMException
  {
    execute(resolver, relation, config, autoSave, false);
  }

  public void execute(ResourceResolver resolver, LiveRelationship relation, ActionConfig config, boolean autoSave, boolean isResetRollout) throws WCMException {
    newInstance(new ValueMapDecorator(new HashMap(config.getProperties()))).execute(resolver.getResource(relation.getSourcePath()), resolver.getResource(relation.getTargetPath()), relation, autoSave, isResetRollout);
  }

  public int getRank()
  {
    return ((Integer)getConfig().get("cq.wcm.msm.action.rank", Integer.valueOf(2147483647))).intValue();
  }

  public String[] getPropertiesNames()
  {
    Set ret = new HashSet();
    for (String key : getConfig().keySet()) {
      if ((this.rolloutManager != null) && (this.rolloutManager.isExcludedProperty(false, key))) {
        ret.add(key);
      }
    }
    return (String[])ret.toArray(new String[ret.size()]);
  }

  public String getParameterName()
  {
    return (String)getConfig().get("cq.wcm.msm.action.parameter", "");
  }

  public String getTitle() {
    ValueMap configValue = getConfig();
    return (String)configValue.get("jcr:title", configValue.get("cq.wcm.msm.action.title", getName()));
  }

  public void write(JSONWriter jsonWriter) throws JSONException {
    jsonWriter.object();
    jsonWriter.key("name").value(getName());
    jsonWriter.key("parameter").value(getParameterName());
    jsonWriter.key("title").value(getTitle());
    jsonWriter.key("rank").value(getRank());
    jsonWriter.key("properites");
    jsonWriter.array();
    for (String prop : getPropertiesNames()) {
      jsonWriter.value(prop);
    }
    jsonWriter.endArray();
    jsonWriter.endObject();
  }
}