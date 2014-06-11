
<%@page session="false"
	import="com.day.cq.dam.api.Asset,
            com.day.cq.dam.scene7.api.Scene7DAMService,
            org.apache.sling.api.resource.PersistableValueMap"%>
<%@include file="/libs/foundation/global.jsp"%>
<%
                String damAssetref="";

    String fileReference = properties.get("fileReference", String.class);
   if(fileReference != null &&
            (fileReference.indexOf("/e2/") != -1 ||  fileReference.indexOf("/is/image/") != -1))
   {

   }
else {
    damAssetref =fileReference;
   }

        if (fileReference != null) {
        Resource assetResource = resourceResolver.getResource(fileReference);
        if (assetResource != null) {
            Asset asset = assetResource.adaptTo(Asset.class);
             if (asset != null) {
                Scene7DAMService s7ds = sling.getService(Scene7DAMService.class);

                if (s7ds != null) {
                    String reference = s7ds.getS7FileReference(asset);

                    if (reference != null && !reference.equals(fileReference)) {
                        fileReference = reference;
                        try {
                            PersistableValueMap props = resource.adaptTo(PersistableValueMap.class);
                            props.put("fileReference", fileReference);
                             props.save();

                            props.put("damPath", damAssetref);
                            props.save();
                        } catch (Exception e) {
                            log.error("Unable to save fileReference " + fileReference, e);
                        }
                    }
                }
              }
        }
    }
%>
