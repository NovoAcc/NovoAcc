<%--

  Bulk Updater component.

  Update Node Name in Bulk

--%>
<h1>Bulk Updater</h1>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page
    import="com.day.cq.wcm.api.WCMMode,
    org.apache.sling.api.resource.Resource,
    org.apache.sling.api.resource.ResourceResolver,
    java.util.*,
    com.dupont.phoenix.BulkUpdaterHelper,
    java.util.List,
    javax.jcr.PropertyIterator, 
    javax.jcr.Property,
    javax.jcr.Node, 
    javax.jcr.NodeIterator"%>

<%
ResourceResolver resolver = slingRequest.getResourceResolver();
BulkUpdaterHelper bulkUpdaterHelper = new BulkUpdaterHelper(currentPage, resource);
String templatePath = null;
String pagePath = null;
String oldName = null;
String newName = null;
List<Node> nodeList = new ArrayList<Node>();
int size = 0;
if((properties.get("templatePath", String.class)!= null)||(properties.get("templatePath", String.class)!= ""))
{
    templatePath = properties.get("templatePath", String.class);
}
if((properties.get("pagePath", String.class)!= null)||(properties.get("pagePath", String.class)!= ""))
{
    pagePath = properties.get("pagePath", String.class);
}
if((properties.get("oldName", String.class)!= null)||(properties.get("oldName", String.class)!= ""))
{
    oldName = properties.get("oldName", String.class);
}
if((properties.get("newName", String.class)!= null)||(properties.get("newName", String.class)!= ""))
{
    newName = properties.get("newName", String.class);
}

if((WCMMode.fromRequest(slingRequest) == WCMMode.EDIT) && (templatePath == null) && (pagePath==null))
{%>

    <h1>Add Bulk Updater Content</h1>
<%}
//out.println(pagePath);

if(templatePath != null && pagePath!=null)
{
    nodeList = bulkUpdaterHelper.getItems(templatePath, pagePath);
}
size = nodeList.size();
//out.println(size);
if((size>0) && (oldName != null) && (newName != null))
{
    for(Node node : nodeList)
    {
        String nodePath = node.getPath();
        PropertyIterator propItr = null;
        PropertyIterator treePropItr = null;
        NodeIterator treeChildNodeItr = null;
        Node newChildNode = null;
        NodeIterator childNodeItr = node.getNodes(oldName);
        int index = 1;
        while(childNodeItr.hasNext())
        {
            if(index == 1)
            {
                Node childNode = (Node) childNodeItr.next();
                //out.println("Node Name : "+childNode.getName());
                if(!(childNode.getName().equalsIgnoreCase(newName)))
                {
                    newChildNode = node.addNode(newName, "nt:unstructured");
                    propItr = childNode.getProperties();
                    while(propItr.hasNext())
                    {
                        Property prop = (Property) propItr.next();
                        String[] propElementArray = prop.toString().split("/");
                        String propName = propElementArray[propElementArray.length-1];
                        String propValue = prop.getString();
                        if(!propName.equalsIgnoreCase("jcr:primaryType"))
                        {
                            newChildNode.setProperty(propName,propValue);
                        }
                        //out.println(propName+" : "+propValue);
                    }
                    newChildNode.getSession().save();
                    if(childNode.hasNodes())
                    {

                        treeChildNodeItr = childNode.getNodes();
                        while(treeChildNodeItr.hasNext())
                        {
                            Node treeChildNode = (Node)treeChildNodeItr.next();
                            Node addedTreeNode = newChildNode.addNode(treeChildNode.getName(), "nt:unstructured");
                            addedTreeNode.getSession().save();
                            //out.println(treeChildNode.getPath());
                            childNode.getSession().move(treeChildNode.getPath(), addedTreeNode.getPath());
                            addedTreeNode.remove();
                            childNode.getSession().save();

                        }
                    }
                   /* while(treeChildNodeItr.hasNext())
                    {
                        Node treeChildNode = (Node)treeChildNodeItr.next();
                        Node addedTreeNode = newChildNode.addNode(treeChildNode.getName(), "nt:unstructured");
                        treePropItr = childNode.getProperties();
                        while(treePropItr.hasNext())
                        {
                            Property prop = (Property) treePropItr.next();
                            String[] propElementArray = prop.toString().split("/");
                            String propName = propElementArray[propElementArray.length-1];
                            String propValue = prop.getString();
                            if(!propName.equalsIgnoreCase("jcr:primaryType"))
                            {
                                addedTreeNode.setProperty(propName,propValue);
                            }
                        //out.println(propName+" : "+propValue);
                        }
                        addedTreeNode.getSession().save();
                    }*/
                    childNode.remove();
                    node.getSession().save();
                }
                index = index+1;

            }

        }

    }
}%>