<c:set var="listItem" scope="page" value="${viewAllBean.results}" />
<%@page import="com.day.cq.wcm.foundation.Image, org.apache.commons.lang.StringUtils, java.util.Map, com.dupont.phoenix.commons.Scene7Image"%>


	<c:if test="${not empty listItem}">
		<c:forEach items="${listItem}" var="item">
			<div class="search-result <c:out value="${item.tagString}"/> <c:out value="${item.contentType}"/>">
				<h4 class="general-view">
                    <a href="<c:out value='${item.linkURL}'/>"><c:out value="${item.linkText}" /></a>
				</h4>
				<div class="result-content">
                    <c:set var="img" value = "${item.thumbnail}" />
                            <% 
    						String imgSrc = "";
    						Image img = (Image)pageContext.getAttribute("img");
							String s7src = ((Scene7Image)img).getScene7ImageSrc();
								if(!StringUtils.isEmpty(s7src)){
									imgSrc = s7src;
                                }else{
									imgSrc = img.getSrc();
                                }
							String title = img.getTitle();

							%>
					<c:choose>
						<c:when test="${not empty item.thumbnail && item.imageContent}">
                            <div class="clear-image">
                                <a href="<c:out value='${item.linkURL}'/>">
                                      <img data-src="<%=imgSrc%>" align="left" title="<%=title%>" src=""/>
                                </a>
                            </div>
						</c:when>
					</c:choose>
					<h4 class="grid-view">
                        <a href="<c:out value='${item.linkURL}'/>"><c:out value="${item.linkText}" /></a>
					</h4>
					<p>
						<c:out value="${item.shortDesc}" />
					</p>
				</div>
				<!-- result-content -->
			</div>
			<!-- search-result -->
		</c:forEach>
	</c:if>

