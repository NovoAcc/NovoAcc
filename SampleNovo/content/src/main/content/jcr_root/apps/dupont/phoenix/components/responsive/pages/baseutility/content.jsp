<%--
  ==============================================================================

  Override this file due to different HTML for Breadcrumb and other elements.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%

%><section id="main-container">

    <!-- Start Utility Header -->
    <div class="row utility-header">
       
        <cq:include path="utilityheadline" resourceType="/apps/dupont/phoenix/components/responsive/utilityheadline"/>

 	    <!-- Start Breadcrumbs -->
        
        <cq:include path="breadcrumb" resourceType="dupont/phoenix/components/breadcrumb"/>
        <cq:include path="breadcrumb-mobile" resourceType="dupont/phoenix/components/responsive/breadcrumb-mobile"/>

        <div class="secondary-site-search">
            <cq:include path="sitesearch" resourceType="/apps/dupont/phoenix/components/search" />
        </div>

    </div>
   
    <!-- End Base Header -->
    <!-- For Open HTML Area Component -->
    <section class="row">
        <cq:include path="openareapar" resourceType="foundation/components/parsys"/>
    </section>
    <!-- End Open HTML Area Component -->

</section>
