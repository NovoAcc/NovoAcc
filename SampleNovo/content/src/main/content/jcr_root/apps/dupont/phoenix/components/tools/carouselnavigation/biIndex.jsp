<c:set var="countBB" value="0" />
<c:forEach var="index" items="${genericTool.indexCardList }" varStatus = "i">
	<li>
		<div class="expert-pane">
			
			<div class="landing-surfaces">
				 <div class="landing-pane">
					<p>${index.indexTitle }</p>
                </div>    
				<div class="biIndexRow1">
					
					<c:set var="image" value="${index.landingSufaceImage1}" />
					<%((Scene7Image)pageContext.getAttribute("image")).draw(out); %>
					<div class="biIndexDes">
						<h3>${index.landingSurfaceTitle1}</h3>
						<c:if test="${!empty index.bbcardItemTitle1}">
							<c:set var="countBB" value="${countBB+1}" />
							<div class="pane-link indexItem" data-baseCard="${6*i.index+countBB}">
								<a class="ls-link" href="javascript:void(0)">
									${index.bbcardItemTitle1}
								</a>
							</div>
						</c:if>

						<c:if test="${!empty index.bbcardItemTitle2}">
							<c:set var="countBB" value="${countBB+1}" />
							<div class="pane-link indexItem" data-baseCard="${6*i.index+countBB}">
								<a class="ls-link" href="javascript:void(0)">
									${index.bbcardItemTitle2}
								</a>
							</div>
						</c:if>
					</div>
				</div>
				<div class="biIndexRow1">
					
					<c:set var="image" value="${index.landingSufaceImage2}" />
					<%((Scene7Image)pageContext.getAttribute("image")).draw(out); %>
					<div class="biIndexDes">
						<h3>${index.landingSurfaceTitle2}</h3>
						<c:if test="${!empty index.bbcardItemTitle3}">
							<c:set var="countBB" value="${countBB+1}" />
							<div class="pane-link indexItem" data-baseCard="${6*i.index+countBB}">
								<a class="ls-link" href="javascript:void(0)">
									${index.bbcardItemTitle3}
								</a>
							</div>
						</c:if>

						<c:if test="${!empty index.bbcardItemTitle4}">
							<c:set var="countBB" value="${countBB+1}" />
							<div class="pane-link indexItem" data-baseCard="${6*i.index+countBB}">
								<a class="ls-link" href="javascript:void(0)">
									${index.bbcardItemTitle4}
								</a>
							</div>
						</c:if>
					</div>
				</div>
				<div class="biIndexRow2">
					<!-- TODO: Set gradient colors -->
					<c:set var="countBB" value="${countBB+1}" />

                    <div class="link1 indexItem" style="background-color: #${index.bbcard5bgcolor};background:-moz-linear-gradient(90deg, #FFFFFF -315px, #${index.bbcard5bgcolor} 100%) repeat scroll 0 0 transparent;
                    background: -webkit-linear-gradient(top, #FFFFFF -315px, #${index.bbcard5bgcolor} 100%);
                    background: -o-linear-gradient(top, #FFFFFF -315px, #${index.bbcard5bgcolor} 100%);
                    background: -ms-linear-gradient(top, #FFFFFF -315px, #${index.bbcard5bgcolor} 100%);
                    background: linear-gradient(to bottom, #FFFFFF -315px, #${index.bbcard5bgcolor} 100%);
                    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#${index.bbcard5bgcolor}', endColorstr='#FFFFFF', GradientType=0 );
					" data-baseCard="${6*i.index+countBB}">
						${index.bbcardItemTitle5}
					</div>
					
					<!-- TODO: Set gradient colors --> 
					<c:set var="countBB" value="${countBB+1}" />
					<div class="link2 indexItem" style="background-color: #${index.bbcard6bgcolor};background:-moz-linear-gradient(90deg, #FFFFFF -315px, #${index.bbcard6bgcolor} 100%) repeat scroll 0 0 transparent;
                    background: -webkit-linear-gradient(top, #FFFFFF -315px, #${index.bbcard6bgcolor} 100%);
                    background: -o-linear-gradient(top, #FFFFFF -315px, #${index.bbcard6bgcolor} 100%);
                    background: -ms-linear-gradient(top, #FFFFFF -315px, #${index.bbcard6bgcolor} 100%);
                    background: linear-gradient(to bottom, #FFFFFF -315px, #${index.bbcard6bgcolor} 100%);
                    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#${index.bbcard6bgcolor}', endColorstr='#FFFFFF', GradientType=0 );" data-baseCard="${6*i.index+countBB}">
						${index.bbcardItemTitle6}
					</div>
				</div>
			</div>
		</div>
	</li>
</c:forEach>
