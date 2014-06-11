
<%@page session="false"
    import="com.day.cq.wcm.webservicesupport.Configuration,
            com.day.cq.wcm.webservicesupport.ConfigurationManager,
            com.day.cq.dam.scene7.api.constants.Scene7Constants"%>
<%@include file="/libs/foundation/global.jsp"%>
<%
    ConfigurationManager cfgMgr = sling.getService(ConfigurationManager.class);
    Configuration configuration = null;
    String scene7PageCloudConfigPath = "";

    String[] services = pageProperties.getInherited("cq:cloudserviceconfigs", new String[]{});
    if(cfgMgr != null) {
        configuration = cfgMgr.getConfiguration(Scene7Constants.CLOUD_CONFIG_ROOT, services);
        if (configuration != null) {
            scene7PageCloudConfigPath = configuration.getPath();
        }
    }
%>