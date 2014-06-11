package com.dupont.phoenix.msm.workflow;



import java.util.HashMap;
import java.util.Map;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferencePolicy;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.jcr.resource.JcrResourceConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMException;
import com.day.cq.wcm.msm.api.RolloutManager;
import com.day.cq.wcm.msm.api.RolloutManager.RolloutParams;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.exec.WorkItem;
import com.day.cq.workflow.exec.WorkflowData;
import com.day.cq.workflow.exec.WorkflowProcess;
import com.day.cq.workflow.metadata.MetaDataMap;

@Component(metatype = true, label = "Phoenix Rollout Workflow Service")
@Service(WorkflowProcess.class)
@Properties({
    @Property(name = "service.description", value = "Phoenix Rollout Page Process"),
    @Property(name = "service.vendor", value = "Dupont"),
    @Property(name = "process.label", value = " Phoenix Rollout Page")
})
public final class RolloutWorkflow implements WorkflowProcess {

    public static final String MODEL_ID = "mt-rollout-page";

    /** Logger */
    private static final Logger LOG = LoggerFactory.getLogger(RolloutWorkflow.class);

    @Reference
    private RolloutManager rolloutManager;


    @Reference(policy = ReferencePolicy.STATIC)
    private ResourceResolverFactory factory;


    public void execute(final WorkItem item, final WorkflowSession session, final MetaDataMap map) {
        
    	final WorkflowData workflowData = item.getWorkflowData();
        final Map<String, Object> authInfo = new HashMap<String, Object>();
        authInfo.put(JcrResourceConstants.AUTHENTICATION_INFO_SESSION, session.getSession());

        try {
            final ResourceResolver resolve = factory.getResourceResolver(authInfo);
            final PageManager pm = resolve.adaptTo(PageManager.class);
            final String path = workflowData.getPayload().toString();
            final Page p = pm.getPage(path);

            rolloutPage(p);
        
        } 
        catch (final WCMException wcme) {
            LOG.error("Rollout process WCM error", wcme);
        } 
        catch (final LoginException le) {
            LOG.error("Rollout process Login ", le);
        }
        catch(final Exception ex) {
        	LOG.error("Rollout process Exception :"+ex.getLocalizedMessage(),ex);
        }

        
    }

    /**
     * Rolls out a page with default values
     * @param page
     * @return
     * @throws WCMException
     */
    private boolean rolloutPage(final Page page) throws WCMException {
        /*
         * ROLLOUT PROCESS
         */
        if (rolloutManager != null) {
           
        	LOG.info("Rollout Initiated for page :"+page.getPath());

        	final RolloutParams par = new RolloutParams();

            par.isDeep = false;
            par.master = page;
            par.reset = false;
            par.trigger = RolloutManager.Trigger.ROLLOUT;
            par.delete = false;

            rolloutManager.rollout(par);

            return true;

        } 
        else {
            LOG.debug("RolloutWorkflow Process : RolloutManager IS NULL");
            return false;
        }
    }
}

