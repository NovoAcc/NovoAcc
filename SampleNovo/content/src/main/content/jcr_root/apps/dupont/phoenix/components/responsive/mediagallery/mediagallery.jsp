<%--

  Media gallery menu component.

  A limitless list of galleries. The list may wrap to the next line but each
  list item should remain completely on a single line.

--%>

<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.dupont.phoenix.MixedMediaGallery" %>
<%
    MixedMediaGallery mmgController = new MixedMediaGallery(resource, currentPage, slingRequest);
    pageContext.setAttribute("mmgController", mmgController);
%>
<%@page session="false"%>

<c:if test="${mmgController.editMode}">
    <cq:includeClientLib categories="apps.dupont.widgets.custom" />
    <c:if test="${!mmgController.itemsAvailable}">
	    <h3>Click here to open Media Gallery Component</h3>
	</c:if>
</c:if>

<c:if test="${mmgController.itemsAvailable}">
    <% if (currentPage.getProperties().get("cq:template",String.class).contains("responsive")) { %>
        <cq:includeClientLib categories="apps.dupont.tool.responsive.mmg" />
        <% } else { %>
        <cq:includeClientLib categories="apps.dupont.tool.nonresponsive.mmg" />
        <% } %>

    <div id="multimedia-container">
            <div id="mediamenu" class="topmenu">
    			<h2>Media</h2>
    			<ul class="mixedmedia">
                    <c:forEach  items="${mmgController.mediaList}" var="item" varStatus="status">
    					<li class="btn${status.index}" >
        					<a	href="javascript:fnGalleryMenu('${item.mediaSetLink}','${mmgController.path}')"> ${item['mediaSetTitle']}</a>
                        </li>
                    </c:forEach>
                </ul>

                <script>
                    // code for Loading First Set as Default Media Set
                    var defaultAsset= "${mmgController.defaultAsset}",
                    _itemText = "${mmgController.itemTranslatedText}";
                    var pagePath = "${mmgController.path}";
                    fnDefault(defaultAsset,pagePath);
                </script>

                <!-- Mobile dropdown display -->
                <div class="mobile-mixedmedia">
                    <c:if test="${mmgController.singleItem}">
                        <c:forEach  items="${mmgController.mediaList}" var="item" varStatus="status">
                            <ul>
                                <li class="btn${status.index}" >
                                    <a	href="javascript:fnGalleryMenu('${item.mediaSetLink}','${mmgController.path}')"> ${item['mediaSetTitle']}</a>
                                </li>
                            </ul>
                        </c:forEach>
                    </c:if>

                    <c:if test="${!mmgController.singleItem}">
                        <div class="viewtext">VIEWING:
                            <select style="width: 200px;" onchange="fnGalleryMenu(this.value,'${mmgController.path}')">
                                <c:forEach  items="${mmgController.mediaList}" var="item" varStatus="status">
                                    <c:if test="${status.index==0}">
                                        <option value="${item['mediaSetLink']}" selected="selected">${item['mediaSetTitle']}</option>
                                    </c:if>

                                    <c:if test="${status.index!=0}">
                                        <option value="${item['mediaSetLink']}">${item['mediaSetTitle']}</option>
                                    </c:if>
                                </c:forEach>
                            </select>
                        </div>
                    </c:if>
            	</div>
            <div style="clear:both"></div>
            </div>
        </div>

</c:if>
