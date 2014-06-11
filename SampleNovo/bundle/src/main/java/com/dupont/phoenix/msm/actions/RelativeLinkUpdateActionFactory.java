package com.dupont.phoenix.msm.actions;

import com.day.cq.wcm.msm.api.LiveAction;
import com.day.cq.wcm.msm.api.LiveActionFactory;
import com.day.cq.wcm.msm.api.LiveRelationship;
import com.day.cq.wcm.msm.api.RolloutManager;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(metatype = true, label = "Relative Link Update Action")
@Service(LiveActionFactory.class)
@Properties({
    @Property(name = "liveActionName", value = "relativeLinkUpdate"),
    @Property(name = "service.vendor", value = "DuPont"),
    @Property(name = "process.label", value = "Relative Link Update Process")
})
public class RelativeLinkUpdateActionFactory extends ActionFactoryBase<BaseAction> {
	
	//private static final Logger log = LoggerFactory.getLogger(RelativeLinkUpdateActionFactory.class);
	private static final String[] LIVE_ACTION_NAME = {RelativeLinkUpdateAction.class.getSimpleName(), "relativeLinkUpdate" };

    @Reference
    private RolloutManager rolloutManager;
	
	protected BaseUpdateAction createAction(ValueMap config, RolloutManager rolloutManager) {
		return new RelativeLinkUpdateAction(config, rolloutManager);
	}

	public String createsAction() {
		return LIVE_ACTION_NAME[0];
	}

	private static final class RelativeLinkUpdateAction extends BaseUpdateAction {
	  
		private RelativeLinkUpdateAction(ValueMap config, RolloutManager rolloutManager) {
			super(config, rolloutManager);
		}

		protected LiveAction newInstance(ValueMap config) {
			return new RelativeLinkUpdateAction(config, getRolloutManager());
		}

		protected boolean update(ResourceResolver resolver, Node masterNode, Node slaveNode, LiveRelationship relation)
				throws RepositoryException { 
			return InternalReferencesUtils.updateRefrences(resolver, masterNode, slaveNode, relation);
		}
	}

	public RolloutManager getRolloutManager() {
		return rolloutManager;
	}
}