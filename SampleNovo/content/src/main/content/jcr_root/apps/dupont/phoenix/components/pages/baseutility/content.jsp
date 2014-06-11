<%--
  ==============================================================================

  Override this file due to different HTML for Breadcrumb and other elements.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%

%><div id="main-container">

    <!-- Start Utility Header -->
    <div class="row utility-header">
        
         <!-- Start Breadcrumbs -->
       
        
        <cq:include path="utilityheadline" resourceType="dupont/phoenix/components/utilityheadline"/>

        <div class="breadcrumb padding-left group">
            <cq:include path="breadcrumb" resourceType="dupont/phoenix/components/breadcrumb"/>
        </div>

        <!-- Site Search -->
        <cq:include path="sitesearch" resourceType="/apps/dupont/phoenix/components/search" />      
    
    </div>
    <div style="clear:both"></div>
    <!-- End Base Header -->
    
    <!-- For Open HTML Area Component -->
    <cq:include path="openareapar" resourceType="foundation/components/parsys"/>
    <!-- End Open HTML Area Component -->
    <div style="clear:both"></div>
    
</div>
