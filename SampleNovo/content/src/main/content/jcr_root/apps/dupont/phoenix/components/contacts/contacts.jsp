<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.dupont.phoenix.*" %>
<%@taglib prefix="cq" uri="http://www.day.com/taglibs/cq/1.0" %>
<%
    ContactController ccontroller = new ContactController(resource, currentPage, slingRequest);
    pageContext.setAttribute("ccontroller", ccontroller);
%>

<c:if test="${!ccontroller.disabled}">
	<cq:includeClientLib categories="apps.dupont.widgets.custom"/>
</c:if>


<c:if test="${ccontroller.editMode and !ccontroller.contactsAvailable}">
    <div class="contacts_module">${ccontroller.entercontactsdetailLabel}</div>
</c:if>

<c:if test="${ccontroller.contactsAvailable}">
    <!-- Start Contacts Module -->
    <div class="contacts_module">
        <div class="contacts_header">${ccontroller.contactsLabel}:</div> 
        <ul>
            <c:forEach  items="${ccontroller.contacts}" var="contact">
                <li class="contact_module_contact ${contact.classIdentifier}">
    
                    <c:if test="${not empty contact.contactName}">
                        <div class="contact_name"><i><c:out value="${contact.contactName}"  escapeXml="true"/></i></div>
                    </c:if>
    
                    <c:if test="${not empty contact.contactCountry}">
                       <div class="contact_name"><i></i><c:out value="${contact.contactCountry}" escapeXml="true"/></i></div>
                    </c:if>
    
                    <c:if test="${not empty contact.contact1}">
                       <div class="contact_name"><c:out value="${contact.contact1}" escapeXml="true"/></div>
                    </c:if>
    
                    <c:if test="${not empty contact.contact2}">
                    	<div class="contact_name"><c:out value="${contact.contact2}" escapeXml="true"/></div>
                    </c:if>
    
                    <c:if test="${not empty contact.contactEmail}">
                        <div class="contact_email"><c:out value="${ccontroller.emailLabel}" escapeXml="true"/>
                        
                         <a href="mailto:<c:out value="${contact.contactEmail}" escapeXml="true"/>"><c:out value="${contact.contactEmail}" escapeXml="true"/></a></div>
                    </c:if>
                </li>
            </c:forEach>
        </ul>
    </div>
</c:if>
  
<div style="clear:both"></div>
