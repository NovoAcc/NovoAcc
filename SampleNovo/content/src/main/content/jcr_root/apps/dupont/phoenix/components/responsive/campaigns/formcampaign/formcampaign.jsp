<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<mgs:controller var="formCampaigns" cls="com.dupont.phoenix.campaigns.FormCampaignHelper" />
<c:set var="formCampaign" scope="page" value="${formCampaigns.formBean}"/>
<c:set var="campaign"  value="${properties['campaignName']} : ${formCampaign.pageTitle}"/>

<span record="'', {'pagedata.campaign': '${campaign}',
                                'pagedata.campaignCode': '${properties['campaignCode']}',
'pagedata.titleOfForm': '${properties['titleOfForm']}'}">
</span>

<!-- Main Section container starts here-->
<div>
      <c:if test="${(empty properties['text'] and formCampaign.editModeFlag) or (not formCampaign.showHideFlag and formCampaign.editModeFlag)}">
			Campaign Form
      </c:if>
     <c:if test="${not empty properties['text'] and formCampaign.showHideFlag}">
         <c:if test="${not empty formCampaign.selectedCSSFilePaths}">
         <c:forEach items="${formCampaign.selectedCSSFilePaths}" var="filePath">
				<c:if test="${not empty filePath}">
             		<link rel="stylesheet" type="text/css" href="${filePath}">
				</c:if>
		 </c:forEach>
         </c:if>
         <c:if test="${not empty formCampaign.selectedJSFilePaths}">
         <c:forEach items="${formCampaign.selectedJSFilePaths}" var="filePath">
             <c:if test="${not empty filePath}">
             	<script src="${filePath}" type="text/javascript"></script>
             </c:if>
		 </c:forEach>
         </c:if>
			${fn:replace(properties['text'], "#DISCLAIMER#", formCampaign.disclaimertext)}
      </c:if>
</div>