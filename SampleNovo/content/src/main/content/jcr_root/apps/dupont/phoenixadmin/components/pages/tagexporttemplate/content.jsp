<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<div id="main-container">

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
	<cq:include path="exporttag" resourceType="/apps/dupont/phoenixadmin/components/exporttag"/>
	<cq:include path="openareapar" resourceType="foundation/components/parsys"/>
</div>