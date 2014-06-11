package com.dupont.phoenix.workflow.impl.process;

import java.util.HashSet;
import java.util.Set;

public class ResponsiveUpgradeConstants {
	private ResponsiveUpgradeConstants(){
		// do nothing
	}

	public static final Set<String> RESPONSIVE_TEMPLATES = new HashSet<String>();
	public static final Set<String> RESPONSIVE_RES_TYPES = new HashSet<String>();
	public static final String[] RES_TYPE_PROPS = {"sling:resourceType","selectedTool"};
	
	static {
				
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/base");// base
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/basecontentdetail");// base
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/basesegment");// base
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/basesubsegment");// base
		
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/articledetail");// 1
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/brand");// 2
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/casestudydetail");// 3
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/homepage");// 4
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/industry");// 5
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/newsletterdetail");// 6
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/pressreleasedetail");// 7
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/productcat");// 8
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/productcatgroup");// 9
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/productservicedetail");// 10
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/subbrand");// 11
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/subindustry");// 12
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/subproductservicedetail");// 13
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/usesandapplications");// 14
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/videodetail");// 15
		
		//New Templates - Release 2.3
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/baseutility");// 16
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/corporatecontent");// 17
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/corporatecontentdetail");// 18
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/corporatesubcontent");// 19
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/corporatesubsubcontent");// 20
		RESPONSIVE_TEMPLATES.add("/apps/dupont/phoenix/templates/corporatevideodetail");// 21
		
		// responsive resource types
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/articledetail");//1
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/base");//2
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/basecontentdetail");//3
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/basesegment");//4
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/basesubsegment");//5
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/brand");//6
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/casestudydetail");//7
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/homepage");//8
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/industry");//9
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/newsletterdetail");//10
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/pressreleasedetail");//1
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/productcat");//12
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/productcatgroup");//13
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/productservicedetail");//14
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/subbrand");//15
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/subindustry");//16
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/subproductservicedetail");//17
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/usesandapplications");//18
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/videodetail");//19

		//New Template pages - Release 2.3
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/baseutility");//20
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/corporatecontent");//21
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/corporatecontentdetail");//22
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/corporatesubcontent");//23
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/corporatesubsubcontent");//24
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/pages/corporatevideodetail");//25
		
		//Responsive Components
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/MSDSSearch");//1
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/bodycopy");//2
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/contenttabs");//3
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/featuredcallout");//4
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/footers/agnosticfooter");//5
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/footers/contextualfooter");//6
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/globalnav");//7
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/helpfullinks");//8
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/hero/herolarge");//9
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/hero/heronormal");//10
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/hero/homepageherocallout");//11
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/imagemediagallery");//12
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/productinformation");//13
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/secondarynav");//14
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/touttool");//15
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/hlm");//16
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/featuredb");//17
		
		//New Responsive Components - Release 2.3
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/utilityheadline");//18
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/utilitytext");//19
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/ps7videoplayer");//20
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/imagemediagallery");//21
		RESPONSIVE_RES_TYPES.add("dupont/phoenix/components/featuredx");//22
	}
}
