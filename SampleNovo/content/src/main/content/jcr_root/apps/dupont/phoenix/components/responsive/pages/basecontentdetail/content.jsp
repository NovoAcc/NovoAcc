<%--
  ==============================================================================

  Override this file due to different HTML for Breadcrumb and other elements.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%

%>
<section id="main-container">
	<!-- Start Article Detail Header -->
	<div class="row content-detail-header">
		<!-- Start Breadcrumbs -->
		<nav class="group">
			<cq:include path="breadcrumb" resourceType="dupont/phoenix/components/breadcrumb"/>
			<cq:include path="breadcrumb-mobile" resourceType="dupont/phoenix/components/responsive/breadcrumb-mobile"/>
		</nav>
		<!-- Site Search -->
		<cq:include path="sitesearch" resourceType="/apps/dupont/phoenix/components/search" />
		<!-- Start Print / Share Module -->
		<cq:include script="utilitylinks.jsp"/>
	</div>
	<!-- End Article Header -->
	<!-- Main Content -->
	<cq:include script="maincontent.jsp"/>
</section>