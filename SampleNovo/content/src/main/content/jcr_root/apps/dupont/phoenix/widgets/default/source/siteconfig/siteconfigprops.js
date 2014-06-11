Dupont.siteConfigProps = {
    loadSiteConfigProps : function(dialog) {
        var designObj = CQ.WCM.getDesign(CQ.WCM.getPagePath());
        if (designObj != null && typeof (designObj) !== 'undefined') {
            var url = designObj.getPath() + "/jcr:content/siteconfig" + CQ.Sling.SELECTOR_INFINITY + CQ.HTTP.EXTENSION_JSON;
            url = CQ.HTTP.noCaching(url);
            try {
                var res = CQ.HTTP.eval(CQ.HTTP.get(url));
                if (res) {
                    //Validate and Set module props
                    //General
                    if (res.general){
                         if((res.general.externalsiteprefix) && (dialog.form.findField('./../../siteconfig/general/externalsiteprefix') != null)) {
                            dialog.form.findField('./../../siteconfig/general/externalsiteprefix').setValue(res.general.externalsiteprefix);
                        }
                        if((res.general.countryLanguage) && (dialog.form.findField('./../../siteconfig/general/countryLanguage') != null)) {
                            dialog.form.findField('./../../siteconfig/general/countryLanguage').setValue(res.general.countryLanguage);
                        }
                     
                        //more general props
                        if((res.general.searchCollectionName) && (dialog.form.findField('./../../siteconfig/general/searchCollectionName') != null)) {
                            dialog.form.findField('./../../siteconfig/general/searchCollectionName').setValue(res.general.searchCollectionName);
                        }
                        if((res.general.siteCountry) && (dialog.form.findField('./../../siteconfig/general/siteCountry') != null))  {
                            dialog.form.findField('./../../siteconfig/general/siteCountry').setValue(res.general.siteCountry);
                        }
                        if((res.general.siteLangauge) && (dialog.form.findField('./../../siteconfig/general/siteLangauge') != null))   {
                            dialog.form.findField('./../../siteconfig/general/siteLangauge').setValue(res.general.siteLangauge);
                        }
                        if((res.general.searchCountryLangCombo) && (dialog.form.findField('./../../siteconfig/general/searchCountryLangCombo') != null))  {
                            dialog.form.findField('./../../siteconfig/general/searchCountryLangCombo').setValue(res.general.searchCountryLangCombo);
                        }
                        if((res.general.megatrendFolderPath) && (dialog.form.findField('./../../siteconfig/general/megatrendFolderPath') != null))  {
                            dialog.form.findField('./../../siteconfig/general/megatrendFolderPath').setValue(res.general.megatrendFolderPath);
                        }
                        if((res.general.countryselectorURL) && (dialog.form.findField('./../../siteconfig/general/countryselectorURL') != null))  {
                            dialog.form.findField('./../../siteconfig/general/countryselectorURL').setValue(res.general.countryselectorURL);
                        }
                        if((res.general.typekitId) && (dialog.form.findField('./../../siteconfig/general/typekitId') != null))  {
                            dialog.form.findField('./../../siteconfig/general/typekitId').setValue(res.general.typekitId);
                        }                        
                    }
                    if (res.featured){
                        if((res.hlm.allowedTools) && (dialog.form.findField('./../../siteconfig/featured/allowedTools') != null)) {
                            dialog.form.findField('./../../siteconfig/featured/allowedTools').setValue(res.featured.allowedTools);
                        }
                    }
                    //HLM
                    if (res.hlm){
                        if((res.hlm.maxDisplayItemsWithCallout) && (dialog.form.findField('./../../siteconfig/hlm/maxDisplayItemsWithCallout') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/maxDisplayItemsWithCallout').setValue(res.hlm.maxDisplayItemsWithCallout);
                        }
                        if((res.hlm.maxDisplayItemsWithoutCallout) && (dialog.form.findField('./../../siteconfig/hlm/maxDisplayItemsWithoutCallout') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/maxDisplayItemsWithoutCallout').setValue(res.hlm.maxDisplayItemsWithoutCallout);
                        }
                        if((res.hlm.maxItemsViewAllWithCallout) && (dialog.form.findField('./../../siteconfig/hlm/maxItemsViewAllWithCallout') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/maxItemsViewAllWithCallout').setValue(res.hlm.maxItemsViewAllWithCallout);
                        }
                        if((res.hlm.maxItemsViewAllWithoutCallout) && (dialog.form.findField('./../../siteconfig/hlm/maxItemsViewAllWithoutCallout') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/maxItemsViewAllWithoutCallout').setValue(res.hlm.maxItemsViewAllWithoutCallout);
                        }
                        if((res.hlm.industry) && (dialog.form.findField('./../../siteconfig/hlm/industry') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/industry').setValue(res.hlm.industry);
                        }
                        if((res.hlm.subindustry) && (dialog.form.findField('./../../siteconfig/hlm/subindustry') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/subindustry').setValue(res.hlm.subindustry);
                        }
                        if((res.hlm.productcatgroup) && (dialog.form.findField('./../../siteconfig/hlm/productcatgroup') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/productcatgroup').setValue(res.hlm.productcatgroup);
                        }
                        if((res.hlm.productcat) && (dialog.form.findField('./../../siteconfig/hlm/productcat') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/productcat').setValue(res.hlm.productcat);
                        }
                        if((res.hlm.brand) && (dialog.form.findField('./../../siteconfig/hlm/brand') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/brand').setValue(res.hlm.brand);
                        }
                        if((res.hlm.subbrand) && (dialog.form.findField('./../../siteconfig/hlm/subbrand') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/subbrand').setValue(res.hlm.subbrand);
                        }
                        if((res.hlm.product) && (dialog.form.findField('./../../siteconfig/hlm/product') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/product').setValue(res.hlm.product);
                        }
                        if((res.hlm.subproduct) && (dialog.form.findField('./../../siteconfig/hlm/subproduct') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/subproduct').setValue(res.hlm.subproduct);
                        }
                        if((res.hlm.usesapplication) && (dialog.form.findField('./../../siteconfig/hlm/usesapplication') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/usesapplication').setValue(res.hlm.usesapplication);
                        }
                        if((res.hlm.article) && (dialog.form.findField('./../../siteconfig/hlm/article') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/article').setValue(res.hlm.article);
                        }
                        if((res.hlm.event) && (dialog.form.findField('./../../siteconfig/hlm/event') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/event').setValue(res.hlm.event);
                        }
                        if((res.hlm.casestudy) && (dialog.form.findField('./../../siteconfig/hlm/casestudy') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/casestudy').setValue(res.hlm.casestudy);
                        }
                        if((res.hlm.pressrelease) && (dialog.form.findField('./../../siteconfig/hlm/pressrelease') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/pressrelease').setValue(res.hlm.pressrelease);
                        }
                        if((res.hlm.video) && (dialog.form.findField('./../../siteconfig/hlm/video') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/video').setValue(res.hlm.video);
                        }
                        if((res.hlm.newsletter) && (dialog.form.findField('./../../siteconfig/hlm/newsletter') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/newsletter').setValue(res.hlm.newsletter);
                        }
                        if((res.hlm.corporatecontent) && (dialog.form.findField('./../../siteconfig/hlm/corporatecontent') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/corporatecontent').setValue(res.hlm.corporatecontent);
                        }
                        if((res.hlm.corporatesubcontent) && (dialog.form.findField('./../../siteconfig/hlm/corporatesubcontent') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/corporatesubcontent').setValue(res.hlm.corporatesubcontent);
                        }
                        if((res.hlm.corporatesubsubcontent) && (dialog.form.findField('./../../siteconfig/hlm/corporatesubsubcontent') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/corporatesubsubcontent').setValue(res.hlm.corporatesubsubcontent);
                        }
                        if((res.hlm.corporatecontentdetail) && (dialog.form.findField('./../../siteconfig/hlm/corporatecontentdetail') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/corporatecontentdetail').setValue(res.hlm.corporatecontentdetail);
                        }
                        if((res.hlm.corporatecontentvideodetail) && (dialog.form.findField('./../../siteconfig/hlm/corporatecontentvideodetail') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/corporatecontentvideodetail').setValue(res.hlm.corporatecontentvideodetail);
                        }
                        if((res.hlm.allowedTools) && (dialog.form.findField('./../../siteconfig/hlm/allowedTools') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/allowedTools').setValue(res.hlm.allowedTools);
                        }
                        if((res.hlm.pressreleasebusiness) && (dialog.form.findField('./../../siteconfig/hlm/pressreleasebusiness') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/pressreleasebusiness').setValue(res.hlm.pressreleasebusiness);
                        }
                        if((res.hlm.pressreleasecorporate) && (dialog.form.findField('./../../siteconfig/hlm/pressreleasecorporate') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/pressreleasecorporate').setValue(res.hlm.pressreleasecorporate);
                        }
                        if((res.hlm.mcdailynews) && (dialog.form.findField('./../../siteconfig/hlm/mcdailynews') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/mcdailynews').setValue(res.hlm.mcdailynews);
                        }
						if((res.hlm.mcimagedetail) && (dialog.form.findField('./../../siteconfig/hlm/mcimagedetail') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/mcimagedetail').setValue(res.hlm.mcimagedetail);
                        }
						if((res.hlm.mcvideodetail) && (dialog.form.findField('./../../siteconfig/hlm/mcvideodetail') != null)) {
                            dialog.form.findField('./../../siteconfig/hlm/mcvideodetail').setValue(res.hlm.mcvideodetail);
                        }
                        //more HLM props
                    }
                    //Social Media Chiclets
                    if (res.socialmedia){
                        if((res.socialmedia.socialmediachannellist) && (dialog.form.findField('./../../siteconfig/socialmedia/socialmediachannellist') != null)) {
                            dialog.form.findField('./../../siteconfig/socialmedia/socialmediachannellist').setValue(res.socialmedia.socialmediachannellist);
                        }
                        
                        if((res.socialmedia.sharemedia) && (dialog.form.findField('./../../siteconfig/socialmedia/sharemedia') != null)) {
                            dialog.form.findField('./../../siteconfig/socialmedia/sharemedia').setValue(res.socialmedia.sharemedia);
                        }
                        if((res.socialmedia.socialchannels) && (dialog.form.findField('./../../siteconfig/socialmedia/socialchannels') != null)) {
                            dialog.form.findField('./../../siteconfig/socialmedia/socialchannels').setValue(res.socialmedia.socialchannels);
                        }
                      //more Social Media props
                    }
                    //Footer
                    if (res.footer){
                        if((res.footer.corporateFolderPath) && (dialog.form.findField('./../../siteconfig/footer/corporateFolderPath') != null)) {
                            dialog.form.findField('./../../siteconfig/footer/corporateFolderPath').setValue(res.footer.corporateFolderPath);
                        }
                        if((res.footer.utilityLinksFolderPath) && (dialog.form.findField('./../../siteconfig/footer/utilityLinksFolderPath') != null)) {
                            dialog.form.findField('./../../siteconfig/footer/utilityLinksFolderPath').setValue(res.footer.utilityLinksFolderPath);
                        }
                        if((res.footer.copyrightText) && (dialog.form.findField('./../../siteconfig/footer/copyrightText') != null)) {
                            dialog.form.findField('./../../siteconfig/footer/copyrightText').setValue(res.footer.copyrightText);
                        }
                        if((res.footer.ipcText) && (dialog.form.findField('./../../siteconfig/footer/ipcText') != null)) {
                            dialog.form.findField('./../../siteconfig/footer/ipcText').setValue(res.footer.ipcText);
                        }
                        //more footer props
                    }
                  //Global Navigation
                    if (res.globalnav){
                    	if((res.globalnav.countryContainer) && (dialog.form.findField('./../../siteconfig/globalnav/countryContainer') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/countryContainer').setValue(res.globalnav.countryContainer);
                        }

						var checked = res.globalnav.countryContainer;
                        var checkbox = dialog.form.findField('./../../siteconfig/globalnav/countryContainer');
                        var panel = checkbox.findParentByType('panel');

                        var countrySiteFieldSet = panel.findByType('dialogfieldset')[0];
                        var countryContainerFieldSet = panel.findByType('dialogfieldset')[2];
                
                        if (checked) {
                
                            countryContainerFieldSet.show();
                            panel.doLayout();
                
                            countrySiteFieldSet.hide();
                            countrySiteFieldSet.items.each(function(field) {
                            try {
                            field.setValue();
                            } catch (e) {
                            }
                            });
                
                        } else {
                
                            countrySiteFieldSet.show();
                
                            countryContainerFieldSet.hide();
                            countryContainerFieldSet.items.each(function(field) {
                            try {
                            field.setValue();
                            } catch (e) {
                            }
                            });
                
                        }

                                        
                        if((res.globalnav.industrynode) && (dialog.form.findField('./../../siteconfig/globalnav/industrynode') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/industrynode').setValue(res.globalnav.industrynode);
                        }
                        if((res.globalnav.prodservicesnode) && (dialog.form.findField('./../../siteconfig/globalnav/prodservicesnode') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/prodservicesnode').setValue(res.globalnav.prodservicesnode);
                        }
                        if((res.globalnav.allindustrieslandingnode) && (dialog.form.findField('./../../siteconfig/globalnav/allindustrieslandingnode') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/allindustrieslandingnode').setValue(res.globalnav.allindustrieslandingnode);
                        }
                        if((res.globalnav.prodserviceslandingnode) && (dialog.form.findField('./../../siteconfig/globalnav/prodserviceslandingnode') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/prodserviceslandingnode').setValue(res.globalnav.prodserviceslandingnode);
                        }
                        // Science and Society links
                        
                        if(res.globalnav.scienceandsociety){
                            if((res.globalnav.scienceandsociety.leftcolumn) && (dialog.form.findField('./../../siteconfig/globalnav/scienceandsociety/leftcolumn') != null)) {
                                dialog.form.findField('./../../siteconfig/globalnav/scienceandsociety/leftcolumn').setValue(res.globalnav.scienceandsociety.leftcolumn);
                            }
                            if((res.globalnav.scienceandsociety.rightcolumn) && (dialog.form.findField('./../../siteconfig/globalnav/scienceandsociety/rightcolumn') != null)) {
                                dialog.form.findField('./../../siteconfig/globalnav/scienceandsociety/rightcolumn').setValue(res.globalnav.scienceandsociety.rightcolumn);
                            }
                        }

                        //View more in DuPont link
                        
                        if((res.globalnav.viewMoreLink) && (dialog.form.findField('./../../siteconfig/globalnav/viewMoreLink') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/viewMoreLink').setValue(res.globalnav.viewMoreLink);
                        }

                        if((res.globalnav.country) && (dialog.form.findField('./../../siteconfig/globalnav/country') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/country').setValue(res.globalnav.country);
                        }

                      //First Column fields 
                        if((res.globalnav.column1Title) && (dialog.form.findField('./../../siteconfig/globalnav/column1Title') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/column1Title').setValue(res.globalnav.column1Title);
                        }
                        if((res.globalnav.column1MainLink) && (dialog.form.findField('./../../siteconfig/globalnav/column1MainLink') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/column1MainLink').setValue(res.globalnav.column1MainLink);
                        }
                        if((res.globalnav.column1FeaturedLinks) && (dialog.form.findField('./../../siteconfig/globalnav/column1FeaturedLinks') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/column1FeaturedLinks').setValue(res.globalnav.column1FeaturedLinks);
                        }
                        
                        //Second Column fields 
                        if((res.globalnav.column2Title) && (dialog.form.findField('./../../siteconfig/globalnav/column2Title') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/column2Title').setValue(res.globalnav.column2Title);
                        }
                        if((res.globalnav.column2MainLink) && (dialog.form.findField('./../../siteconfig/globalnav/column2MainLink') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/column2MainLink').setValue(res.globalnav.column2MainLink);
                        }
                         if((res.globalnav.column2FeaturedLinks) && (dialog.form.findField('./../../siteconfig/globalnav/column2FeaturedLinks') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/column2FeaturedLinks').setValue(res.globalnav.column2FeaturedLinks);
                        }
                       //Thired Column fields 
                         if((res.globalnav.column3Title) && (dialog.form.findField('./../../siteconfig/globalnav/column3Title') != null)) {
                             dialog.form.findField('./../../siteconfig/globalnav/column3Title').setValue(res.globalnav.column3Title);
                         }
                        if((res.globalnav.column3MainLink) && (dialog.form.findField('./../../siteconfig/globalnav/column3MainLink') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/column3MainLink').setValue(res.globalnav.column3MainLink);
                        }
                         if((res.globalnav.column3FeaturedLinks) && (dialog.form.findField('./../../siteconfig/globalnav/column3FeaturedLinks') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/column3FeaturedLinks').setValue(res.globalnav.column3FeaturedLinks);
                        }
                         //Dupont Links
                        if((res.globalnav.dupontLinks) && (dialog.form.findField('./../../siteconfig/globalnav/dupontLinks') != null)) {
                            dialog.form.findField('./../../siteconfig/globalnav/dupontLinks').setValue(res.globalnav.dupontLinks);
                        }
                    }
                    //ContentTabs
                    if (res.contenttabs){
                        if((res.contenttabs.industry) && (dialog.form.findField('./../../siteconfig/contenttabs/industry') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/industry').setValue(res.contenttabs.industry);
                        }
                        if((res.contenttabs.subindustry) && (dialog.form.findField('./../../siteconfig/contenttabs/subindustry') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/subindustry').setValue(res.contenttabs.subindustry);
                        }
                        if((res.contenttabs.productcatgroup) && (dialog.form.findField('./../../siteconfig/contenttabs/productcatgroup') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/productcatgroup').setValue(res.contenttabs.productcatgroup);
                        }
                        if((res.contenttabs.productcat) && (dialog.form.findField('./../../siteconfig/contenttabs/productcat') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/productcat').setValue(res.contenttabs.productcat);
                        }
                        if((res.contenttabs.brand) && (dialog.form.findField('./../../siteconfig/contenttabs/brand') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/brand').setValue(res.contenttabs.brand);
                        }
                        if((res.contenttabs.subbrand) && (dialog.form.findField('./../../siteconfig/contenttabs/subbrand') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/subbrand').setValue(res.contenttabs.subbrand);
                        }
                        if((res.contenttabs.product) && (dialog.form.findField('./../../siteconfig/contenttabs/product') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/product').setValue(res.contenttabs.product);
                        }
                        if((res.contenttabs.subproduct) && (dialog.form.findField('./../../siteconfig/contenttabs/subproduct') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/subproduct').setValue(res.contenttabs.subproduct);
                        }
                        if((res.contenttabs.usesapplication) && (dialog.form.findField('./../../siteconfig/contenttabs/usesapplication') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/usesapplication').setValue(res.contenttabs.usesapplication);
                        }
                        if((res.contenttabs.article) && (dialog.form.findField('./../../siteconfig/contenttabs/article') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/article').setValue(res.contenttabs.article);
                        }
                        if((res.contenttabs.event) && (dialog.form.findField('./../../siteconfig/contenttabs/event') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/event').setValue(res.contenttabs.event);
                        }
                        if((res.contenttabs.casestudy) && (dialog.form.findField('./../../siteconfig/contenttabs/casestudy') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/casestudy').setValue(res.contenttabs.casestudy);
                        }
                        if((res.contenttabs.pressrelease) && (dialog.form.findField('./../../siteconfig/contenttabs/pressrelease') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/pressrelease').setValue(res.contenttabs.pressrelease);
                        }
                        if((res.contenttabs.pressreleasebusiness) && (dialog.form.findField('./../../siteconfig/contenttabs/pressreleasebusiness') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/pressreleasebusiness').setValue(res.contenttabs.pressreleasebusiness);
                        }
                        if((res.contenttabs.pressreleasecorporate) && (dialog.form.findField('./../../siteconfig/contenttabs/pressreleasecorporate') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/pressreleasecorporate').setValue(res.contenttabs.pressreleasecorporate);
                        }
                        if((res.contenttabs.video) && (dialog.form.findField('./../../siteconfig/contenttabs/video') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/video').setValue(res.contenttabs.video);
                        }
                        if((res.contenttabs.newsletter) && (dialog.form.findField('./../../siteconfig/contenttabs/newsletter') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/newsletter').setValue(res.contenttabs.newsletter);
                        }
                        if((res.contenttabs.corporatecontent) && (dialog.form.findField('./../../siteconfig/contenttabs/corporatecontent') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/corporatecontent').setValue(res.contenttabs.corporatecontent);
                        }
                        if((res.contenttabs.corporatesubcontent) && (dialog.form.findField('./../../siteconfig/contenttabs/corporatesubcontent') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/corporatesubcontent').setValue(res.contenttabs.corporatesubcontent);
                        }
                        if((res.contenttabs.corporatesubsubcontent) && (dialog.form.findField('./../../siteconfig/contenttabs/corporatesubsubcontent') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/corporatesubsubcontent').setValue(res.contenttabs.corporatesubsubcontent);
                        }
                        if((res.contenttabs.corporatecontentdetail) && (dialog.form.findField('./../../siteconfig/contenttabs/corporatecontentdetail') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/corporatecontentdetail').setValue(res.contenttabs.corporatecontentdetail);
                        }
                        if((res.contenttabs.corporatecontentvideodetail) && (dialog.form.findField('./../../siteconfig/contenttabs/corporatecontentvideodetail') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/corporatecontentvideodetail').setValue(res.contenttabs.corporatecontentvideodetail);
                        }
                        if((res.contenttabs.mcdailynews) && (dialog.form.findField('./../../siteconfig/contenttabs/mcdailynews') != null)) {
                            dialog.form.findField('./../../siteconfig/contenttabs/mcdailynews').setValue(res.contenttabs.mcdailynews);
                        }

                    }
                    //Gallery Vedioplayer props
                    if(res.videogallery){
                        if((res.videogallery.galleryVideoPlayerId) && (dialog.form.findField('./../../siteconfig/videogallery/galleryVideoPlayerId') != null)) {
                            dialog.form.findField('./../../siteconfig/videogallery/galleryVideoPlayerId').setValue(res.videogallery.galleryVideoPlayerId);
                        }
                        if((res.videogallery.galleryVideoPlayerKey) && (dialog.form.findField('./../../siteconfig/videogallery/galleryVideoPlayerKey') != null)) {
                            dialog.form.findField('./../../siteconfig/videogallery/galleryVideoPlayerKey').setValue(res.videogallery.galleryVideoPlayerKey);
                        }
                    }
                    //Image Media Gallery props
                    if(res.imagegallery){
                        if((res.imagegallery.imageGalleryFolderPath) && (dialog.form.findField('./../../siteconfig/imagegallery/imageGalleryFolderPath') != null)) {
                            dialog.form.findField('./../../siteconfig/imagegallery/imageGalleryFolderPath').setValue(res.imagegallery.imageGalleryFolderPath);
                        }
                        if((res.imagegallery.scene7Config) && (dialog.form.findField('./../../siteconfig/imagegallery/scene7Config') != null)) {
                            dialog.form.findField('./../../siteconfig/imagegallery/scene7Config').setValue(res.imagegallery.scene7Config);
                        }
                    }
                    // Vedio player props
                    if(res.videoplayer){
                        if((res.videoplayer.videoPlayerId) && (dialog.form.findField('./../../siteconfig/videoplayer/videoPlayerId') != null)) {
                            dialog.form.findField('./../../siteconfig/videoplayer/videoPlayerId').setValue(res.videoplayer.videoPlayerId);
                        }
                        if((res.videoplayer.videoPlayerKey) && (dialog.form.findField('./../../siteconfig/videoplayer/videoPlayerKey') != null)) {
                            dialog.form.findField('./../../siteconfig/videoplayer/videoPlayerKey').setValue(res.videoplayer.videoPlayerKey);
                        }
                        //more vedioplayer props
                    }
                    //Viewall Facets
                    /*
                    if (res.viewallfacets){
                        if((res.viewallfacets.collapse) && (dialog.form.findField('./../../siteconfig/viewallfacets/collapse') != null)) {
                            dialog.form.findField('./../../siteconfig/viewallfacets/collapse').setValue(res.viewallfacets.collapse);
                        }
                        if((res.viewallfacets.optionsPath) && (dialog.form.findField('./../../siteconfig/viewallfacets/optionsPath') != null)) {
                            dialog.form.findField('./../../siteconfig/viewallfacets/optionsPath').setValue(res.viewallfacets.optionsPath);
                        }
                        if((res.viewallfacets.limit) && (dialog.form.findField('./../../siteconfig/viewallfacets/limit') != null)) {
                            dialog.form.findField('./../../siteconfig/viewallfacets/limit').setValue(res.viewallfacets.limit);
                        }
                    }
                    */
                         //Dyanamic Link List
                    if (res.linklistdynamic){
                        if((res.linklistdynamic.article) && (dialog.form.findField('./../../siteconfig/linklistdynamic/article') != null)) {
                            dialog.form.findField('./../../siteconfig/linklistdynamic/article').setValue(res.linklistdynamic.article);
                        }
                        if((res.linklistdynamic.casestudy) && (dialog.form.findField('./../../siteconfig/linklistdynamic/casestudy') != null)) {
                            dialog.form.findField('./../../siteconfig/linklistdynamic/casestudy').setValue(res.linklistdynamic.casestudy);
                        }
                          if((res.linklistdynamic.pressrelease) && (dialog.form.findField('./../../siteconfig/linklistdynamic/pressrelease') != null)) {
                            dialog.form.findField('./../../siteconfig/linklistdynamic/pressrelease').setValue(res.linklistdynamic.pressrelease);
                        }
                        
                           if((res.linklistdynamic.video) && (dialog.form.findField('./../../siteconfig/linklistdynamic/video') != null)) {
                            dialog.form.findField('./../../siteconfig/linklistdynamic/video').setValue(res.linklistdynamic.video);
                        }
                           if((res.linklistdynamic.newsletter) && (dialog.form.findField('./../../siteconfig/linklistdynamic/newsletter') != null)) {
                            dialog.form.findField('./../../siteconfig/linklistdynamic/newsletter').setValue(res.linklistdynamic.newsletter);
                        }
                             if((res.linklistdynamic.product) && (dialog.form.findField('./../../siteconfig/linklistdynamic/product') != null)) {
                            dialog.form.findField('./../../siteconfig/linklistdynamic/product').setValue(res.linklistdynamic.product);
                        }
                         
                    }
                    //Global Navigation
                    if (res.cookiemessage){
                        if((res.cookiemessage.enabled) && (dialog.form.findField('./../../siteconfig/cookiemessage/enabled') != null)) {
                            dialog.form.findField('./../../siteconfig/cookiemessage/enabled').setValue(res.cookiemessage.enabled);
                        }
                        if((res.cookiemessage.learnmorepath) && (dialog.form.findField('./../../siteconfig/cookiemessage/learnmorepath') != null)) {
                            dialog.form.findField('./../../siteconfig/cookiemessage/learnmorepath').setValue(res.cookiemessage.learnmorepath);
                        }
                        if((res.cookiemessage.message) && (dialog.form.findField('./../../siteconfig/cookiemessage/message') != null)) {
                            dialog.form.findField('./../../siteconfig/cookiemessage/message').setValue(res.cookiemessage.message);
                        }
                    }
                    //Media Center
                    if(res.tabmc)
                    {
                        if((res.tabmc.corporateFolderPath) && (dialog.form.findField('./../../siteconfig/tabmc/corporateFolderPath') != null)) {
                            dialog.form.findField('./../../siteconfig/tabmc/corporateFolderPath').setValue(res.tabmc.corporateFolderPath);
                        }
                        if((res.tabmc.mediaCenterFolderPath) && (dialog.form.findField('./../../siteconfig/tabmc/mediaCenterFolderPath') != null)) {
                            dialog.form.findField('./../../siteconfig/tabmc/mediaCenterFolderPath').setValue(res.tabmc.mediaCenterFolderPath);
                        }
                    }
                    //Search and Promo props
                    if(res.searchandpromote){
                        if((res.searchandpromote.searchIndex) && (dialog.form.findField('./../../siteconfig/searchandpromote/searchIndex') != null)) {
                            dialog.form.findField('./../../siteconfig/searchandpromote/searchIndex').setValue(res.searchandpromote.searchIndex);
                        }
                        if((res.searchandpromote.searchURL) && (dialog.form.findField('./../../siteconfig/searchandpromote/searchURL') != null)) {
                            dialog.form.findField('./../../siteconfig/searchandpromote/searchURL').setValue(res.searchandpromote.searchURL);
                        }
                        if((res.searchandpromote.extSearchURL) && (dialog.form.findField('./../../siteconfig/searchandpromote/extSearchURL') != null))  {
                            dialog.form.findField('./../../siteconfig/searchandpromote/extSearchURL').setValue(res.searchandpromote.extSearchURL);
                        }
                    } 
                    //View all configuration Pages
                    if(res.viewallconfiguration){
                        if((res.viewallconfiguration.viewallconfiguration) && (dialog.form.findField('./../../siteconfig/viewallconfiguration/viewallconfiguration') != null)) {
                            dialog.form.findField('./../../siteconfig/viewallconfiguration/viewallconfiguration').setValue(res.viewallconfiguration.viewallconfiguration);
                        }
                        if((res.viewallconfiguration.mcviewallconfiguration) && (dialog.form.findField('./../../siteconfig/viewallconfiguration/mcviewallconfiguration') != null)) {
                            dialog.form.findField('./../../siteconfig/viewallconfiguration/mcviewallconfiguration').setValue(res.viewallconfiguration.mcviewallconfiguration);
                        }

                    }   

                    //Other Modules..(Add your modules props here just like above..)
                }
            } catch (e) {
                CQ.Ext.MessageBox.alert("Error", e.message);
            }
        } // end if designPath != null
    }
};