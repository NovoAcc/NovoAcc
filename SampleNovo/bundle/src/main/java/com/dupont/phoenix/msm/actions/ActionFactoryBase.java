package com.dupont.phoenix.msm.actions;

import com.day.cq.wcm.api.WCMException;
import com.day.cq.wcm.msm.api.LiveActionFactory;
import com.day.cq.wcm.msm.api.RolloutManager;
import java.util.Dictionary;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.component.ComponentContext;

abstract class ActionFactoryBase<Type extends BaseAction> implements LiveActionFactory<Type> {

  private RolloutManager rolloutManager = null;
  private Dictionary props;

  protected void activate(ComponentContext context) {
    this.props = context.getProperties();
  }

  public Type createAction(Resource resource) throws WCMException {
    ValueMap resourceMap = resource != null ? (ValueMap)resource.adaptTo(ValueMap.class) : null;
    return createAction(resourceMap, this.rolloutManager);
  }

  protected abstract Type createAction(ValueMap paramValueMap, RolloutManager paramRolloutManager);

  protected void bindRolloutManager(RolloutManager paramRolloutManager)
  {
    this.rolloutManager = paramRolloutManager;
  }

  protected void unbindRolloutManager(RolloutManager paramRolloutManager)
  {
    if (this.rolloutManager == paramRolloutManager){
      this.rolloutManager = null;
    }
  }

public Dictionary getProps() {
	return props;
}
}