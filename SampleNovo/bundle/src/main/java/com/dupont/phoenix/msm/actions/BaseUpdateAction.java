package com.dupont.phoenix.msm.actions;

import com.day.cq.wcm.api.WCMException;
import com.day.cq.wcm.msm.api.LiveRelationship;
import com.day.cq.wcm.msm.api.RolloutManager;

import javax.jcr.Item;
import javax.jcr.ItemNotFoundException;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.nodetype.NodeType;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;

public abstract class BaseUpdateAction extends BaseAction {

	protected BaseUpdateAction(ValueMap config, RolloutManager rolloutManager) {
		super(config, rolloutManager);
	}

	protected boolean handles(Resource source, Resource target,
			LiveRelationship relation, boolean resetRollout)
			throws RepositoryException, WCMException {
		return true;
	}

	protected void doExecute(Resource source, Resource target,
			LiveRelationship relation, boolean autoSave, boolean resetRollout)
			throws RepositoryException, WCMException {

		Node masterNode = source != null ? getWorkingNode((Node) source
				.adaptTo(Node.class)) : null;
		Node slaveNode = target != null ? getWorkingNode((Node) target
				.adaptTo(Node.class)) : null;
		if ((masterNode != null) && (slaveNode != null)
				&& (relation.getStatus().isSourceExisting())) {
			boolean changed = update(source.getResourceResolver(), masterNode,
					slaveNode, relation);
			if ((changed) && (autoSave)){
				slaveNode.getSession().save();
			}
		}
	}

	protected abstract boolean update(ResourceResolver paramResourceResolver,
			Node paramNode1, Node paramNode2,
			LiveRelationship paramLiveRelationship) throws RepositoryException,
			WCMException;

	public static Node getWorkingNode(Node node) throws ItemNotFoundException,
			RepositoryException {
		if ((node != null) && (node.isNodeType("nt:hierarchyNode"))) {
			String name = getPrimaryItemName(node);
			if (name != null) {
				Item item = node.getPrimaryItem();
				if (item.isNode()) {
					return (Node) item;
				}
				return item.getParent();
			}
		}

		return node;
	}

	private static String getPrimaryItemName(Node node)
			throws RepositoryException {
		String name = node.getPrimaryNodeType().getPrimaryItemName();
		if (name != null) {
			return name;
		}
		NodeType[] mixins = node.getMixinNodeTypes();
		for (NodeType mixin : mixins) {
			name = mixin.getPrimaryItemName();
			if (name != null) {
				return name;
			}
		}
		return null;
	}
}