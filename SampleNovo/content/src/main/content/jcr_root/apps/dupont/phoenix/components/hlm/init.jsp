<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.dupont.phoenix.list.HListHelper,
					com.dupont.phoenix.hlm.HLMWrapper,
					com.dupont.phoenix.hlm.HLMFactory"%><%
try {
	HLMWrapper hlmWrapper = (HLMWrapper)request.getAttribute("hlmWrapper");
	if(hlmWrapper==null) {
		hlmWrapper = new HLMWrapper(slingRequest,currentPage);
		request.setAttribute("hlmWrapper", hlmWrapper);
	}
	HListHelper hListHelper = hlmWrapper.getHLMById(HListHelper.getId(resource));
	if(hListHelper==null) {
		hListHelper = HLMFactory.getInstance().createHLM(resource.getResourceType(), slingRequest, currentPage, resource);
	}
	request.setAttribute("hListHelper",hListHelper);
} catch(Exception e) {
	log.error(e.getMessage());
}
%>
