<%--

  Media gallery menu component.

  A limitless list of
galleries. The list may wrap to the next line but each
list item should remain completely on a single line.

--%>
<%@include file="/libs/foundation/global.jsp"%>
<%@ page
	import="com.day.cq.wcm.api.WCMMode,
    				org.apache.sling.commons.json.JSONObject,
					java.util.*,
    com.dupont.phoenix.GlobalConstants"%>
<%@page session="false"%>
<cq:includeClientLib categories="apps.dupont.responsive" />
<cq:includeClientLib categories="apps.dupont.widgets.custom" />


<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<!-- Specifying a per-page Home screen icon -->
		<link rel="apple-touch-icon" href=""/>
	    <link rel="apple-touch-startup-image" href="" />

<script language="javascript" type="text/javascript"
	src="<%= GlobalConstants.s7domain %>/s7sdk/2.5/js/s7sdk/utils/Utils.js"></script>
<script language="javascript" type="text/javascript">
    	// temporary lib path include, this restriction will likely be removed in future releases


        s7sdk.Util.lib.include('s7sdk.common.Button');
        s7sdk.Util.lib.include('s7sdk.event.Event');
        s7sdk.Util.lib.include('s7sdk.common.Container');
        s7sdk.Util.lib.include('s7sdk.video.VideoControls');                                                                                         
        s7sdk.Util.lib.include('s7sdk.set.MediaSet');
        s7sdk.Util.lib.include('s7sdk.set.SpinView');
        s7sdk.Util.lib.include('s7sdk.set.Swatches');
        s7sdk.Util.lib.include('s7sdk.image.ZoomView');
        s7sdk.Util.lib.include('s7sdk.video.VideoPlayer'); 
        s7sdk.Util.lib.include('s7sdk.common.ControlBar');
       


    </script>
<script
	src="/etc/designs/dupont/phoenix/responsiveclientlib/source/js/scene7SDK.js"> </script>
<script
                src="/etc/designs/dupont/phoenix/responsiveclientlib/source/js/jquery-1.8.2.min.js"></script>
</head>


	<%

	String[] mixedMediaItems = null;
	List<Map> mediaList = new ArrayList<Map>();
	String asset = null;
	String defaultAsset = null;
	final Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);


    if((properties.get("mixmedia",null) != null)&&(properties.get("mixmedia",null) != ""))
    {
		mixedMediaItems = properties.get("mixmedia",String[].class);
    }

	if(isEdit && (mixedMediaItems == null))
    {%>
	<h3>Click here to open Media Gallery Component</h3>
	<%}
	else{
	
        /* ***** Mix Media Set - Code Start ***** */
	 

		for( String mediaItem : mixedMediaItems )
		{
			Map<String,String> mediaItemMap = new HashMap<String,String>();
    		JSONObject jObject = new JSONObject(mediaItem);
    		String mediaSetLink = jObject.get("mediaSetLink").toString();
            String[] parts = mediaSetLink.split("/");
            String lastWord = parts[parts.length - 1];
            mediaSetLink="eidupont/"+lastWord;    // company name from scene7 config = eidupont
    		String mediaSetTitle = jObject.get("mediaSetTitle").toString();
			mediaItemMap.put("mediaSetLink",mediaSetLink);
			mediaItemMap.put("mediaSetTitle",mediaSetTitle);
    		mediaList.add(mediaItemMap);
    	}

    	%>
   
	<div id="container" class="container">
		<div id="mediamenu" class="topmenu">
			<h2>Media</h2>
			<ul class="mixedmedia">
				<%
         	int counter = 0;

         	for(Map<String,String> mediaMap : mediaList) {

				asset = mediaMap.get("mediaSetLink");
                if (counter==0){
				defaultAsset = asset;
                }
                %>
				<li class="btn<%=counter%>" >

                    <a	href="javascript:fnGalleryMenu('<%=asset%>')"> <%out.println(mediaMap.get("mediaSetTitle"));%></a>
				</li>
				<%counter=counter+1;
            }%>
			</ul>

			<script>
            // code for Loading First Set as Default Media Set
			var defaultAsset= "<%=defaultAsset%>";
			fnDefault(defaultAsset);
    	</script>

			<!-- Mobile dropdown display -->
			<div class="mobile-mixedmedia">
				<% 
                String mobileasset = null; 
              String mobilesingleasset = null; 

        if(mediaList.size() == 1)
        {
            for(Map<String,String> mediamobileMap : mediaList) {

            mobileasset = mediamobileMap.get("mediaSetLink");
            defaultAsset = mobileasset;
              %>
				<ul>
					<li class="btn<%=counter%>"><a
						href="javascript:fnGalleryMenu('<%=mobileasset%>')"> <%out.println(mediamobileMap.get("mediaSetTitle"));%></a>
					</li>
				</ul>
			</div>
			<%counter=counter+1;
            }

        } else {

                %>	<div class="viewtext">VIEWING:
			<select style="width: 200px;" onchange="fnGalleryMenu(this.value)">
				<%
                int mobileCounter = 0;
                for(Map<String,String> mediaMap : mediaList) {
                          mobileasset = mediaMap.get("mediaSetLink");
                          if(mobileCounter==0){%>
				<option value="<%=mobileasset%>" selected="selected"><%=mediaMap.get("mediaSetTitle")%></option>
				defaultAsset = mobileasset;
				<%}else{%>
				<option value="<%=mobileasset%>"><%=mediaMap.get("mediaSetTitle")%></option>
				<%}
              mobileCounter=mobileCounter+1;                          
              }%>
			</select>

			<%}%>
			</div>
		</div>


		<br /> <br />
		<%

	/* ***** Mix Media Set - Code END ***** */


	%>

		<div id="s7VideoView"></div>
		<div id="s7ZoomView"></div>
		<div id="s7Spinview"></div>
		<div id="mixedMediaSwatch"></div>

	
	</div>


	<%}%>


	