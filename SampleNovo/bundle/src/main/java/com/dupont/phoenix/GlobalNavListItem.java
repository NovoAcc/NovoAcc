package com.dupont.phoenix;

import java.lang.StringBuilder;

public  class GlobalNavListItem { 
	     
    private String nodeName;
    private String nodePath;
   
    
	public String getNodeName() {
		return nodeName;
	}
	public void setNodeName(String nodeName) {
		this.nodeName = nodeName;
	}
	public String getNodePath() {
		return nodePath;
	}
	public void setNodePath(String nodePath) {
		this.nodePath = nodePath;
	}       
    public String toString() {
    	StringBuilder result = new StringBuilder();
    	result.append("nodeName:");
    	result.append(nodeName);
    	result.append("\nnodePath:");
    	result.append(nodePath);
    	
    	return result.toString();
    }
 
}
