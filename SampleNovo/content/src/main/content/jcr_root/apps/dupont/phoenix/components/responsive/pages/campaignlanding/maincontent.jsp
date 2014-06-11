<%--
  ==============================================================================

  All Segment Templates should provide row content within pagecontent.jsp file.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.day.cq.wcm.api.WCMMode"%>
<%
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
 %> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
 <% } %>
<section id="intro" class="group">
	<div>
		<div class="two-thirds column">
			<cq:include path="introbodytext"
				resourceType="dupont/phoenix/components/introbodytext" />
            <div>
                <div class="row-wrapper-cta campaign-landing-cta-wrapper">
                    <div class="one-half column">
                        <cq:include path="calltoaction-1"
                            resourceType="dupont/phoenix/components/calltoaction" />
                    </div>
                    <div class="one-half column">
                        <cq:include path="calltoaction-2"
                            resourceType="dupont/phoenix/components/calltoaction" />
                    </div>
                </div>
            </div>
		</div>
		<div class="one-third column">
			<cq:include path="calltoaction"
				resourceType="dupont/phoenix/components/calltoaction" />
			<cq:include path="form"
				resourceType="dupont/phoenix/components/responsive/campaigns/formcampaign" />
		</div>
	</div>

</section>
<div class="rows-wrapper">
	<cq:include script="pagecontent.jsp" />
	<div style="clear: both"></div>
</div>

<!-- Multimedia Gallery -->
<div class="campaign-landing-mmg">
<cq:include path="multimediagallery"
	resourceType="dupont/phoenix/components/responsive/mediagallery" />
</div>
