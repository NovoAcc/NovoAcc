var FoodEnabled=true
var EnergyEnabled=true;
var ProtectionEnabled=true;

function getQuerystring(key, default_) {
    if (default_==null) default_="";
    key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
    //var qs = regex.exec(params);
    if(key=="filter")
        return _filterValue;
    if(key=="nodeid")
        return _nodeIdValue;
    return "";
}

/* Add/Remove/Modify Pin information by modifying the following function, addPins.
        Parameters:
        Node Id: Unique identifier 
        Challenge: One of three values, 'Food', 'Fuel' or 'Protection'
        Hover Text: This is the text that appears on hover over the pin
        Story URL: URL of the story
        Image URL: URL of the image that displays in the on-click popup for each pin
        Lat/Long: Coordinates of story location
*/

function addPins(){
    
    addMapPoint(6748,"Energy","Less Means More","Together with Chery Automotive, DuPont showcases the use of engineered plastics to enable vehicle weight reduction.",_globalChallengesValue+"/energy/articles/less-means-more.html","", 31.352859, 118.432941 );
    addMapPoint(6552,"Food","Rennet For Cheese Production","Working closely with small farmers in Columbia, DuPont provides Marschall® brand rennet for cheese production.",_globalChallengesValue+"/food/articles/cheese-production.html","/etc/designs/dupont/tools/megatrends/source/images/columbia_still_690x345.jpg", 9.85002, -74.23857 );
    addMapPoint(1200,"Food","Improving Agriculture and Farmers’ Futures in India","Pioneer Hi-Bred is helping to improve agriculture in India with hybrid seed technology that improves crop yields.",_globalChallengesValue+"/food/articles/farmers-india.html","/etc/designs/dupont/tools/megatrends/source/images/NationalGeographic_Food_1048229_IndiaHoe_225x157.jpg", 20.328831, 85.741425 );
    addMapPoint(1237,"Food","DuPont Partnerships Bring Global Food Security Closer to More People","DuPont partnered with the African Biofortified Sorghum Project (ABS) to improve the global food security of millions who rely on sorghum as their primary diet.",_globalChallengesValue+"/food/articles/global-food-security.html","/etc/designs/dupont/tools/megatrends/source/images/NationalGeographic_Food_1309320_Sorghum_225x157.jpg", -1.285533, 36.818884 );
    addMapPoint(1205,"Food","Developing Faster, More Accurate Food Safety Tests for the Industry","The BAX® detection system is one of the best food safety tests in the industry to help ensure a safe food supply for the world.",_globalChallengesValue+"/food/articles/food-industry-tests.html","/etc/designs/dupont/tools/megatrends/source/images/NationalGeographic_Food_20288_FruitStand_225x157.jpg", 38.863435, -76.982291 );
    addMapPoint(1207,"Food","High Oleic Soybeans Provide a Healthy Solution for Trans Fats Concerns","Plenish™ high oleic soybeans create cooking oil with extreme stability in high temperatures, without hydrogenation and with 0g trans fat.",_globalChallengesValue+"/food/articles/soy-trans-fat.html","/etc/designs/dupont/tools/megatrends/source/images/NationalGeographic_%20Food_1270360_RussianTable_225x157.jpg", 41.669655, -93.712427);
    addMapPoint(1215,"Food","Increasing Productivity, with Vacuum Planting Technology in China","Pioneer Hi-Bred helps Chinese farmers to increase productivity and efficiency with better seeds and improved single kernel planting technology.",_globalChallengesValue+"/food/articles/planting-better-seeds.html","/etc/designs/dupont/tools/megatrends/source/images/NationalGeographic_Food_1215833_FarmerWalking_225x157.jpg", 38.041953, 114.504584);
    addMapPoint(1127,"Food","Sustainable Aquaculture – Creating a Healthy Source of Protein","Together with AquaChile, DuPont is introducing sustainable aquaculture techniques to sustainably maintain our fish stocks for generations to come.",_globalChallengesValue+"/food/articles/sustainable-salmon.html","/etc/designs/dupont/tools/megatrends/source/images/salmon_225x157.jpg", -35.360398, -71.187966 );
    addMapPoint(1129,"Food","Improving Rice Production in Indonesia","Together with Indonesian farmers, DuPont introduced products that help protect rice crops, improving rice production and the food supply of a growing population.",_globalChallengesValue+"/food/articles/rice-abundant.html","/etc/designs/dupont/tools/megatrends/source/images/RiceAbndt_225x157.jpg", -6.238355, 106.847534 );
    addMapPoint(1209,"Food","Providing Nutrition to Malawi with Soy Protein","Together with local growers, producers, and distributors, DuPont helped introduce a soy protein supplement to Malawi.",_globalChallengesValue+"/food/articles/soy-blessings.html","/etc/designs/dupont/tools/megatrends/source/images/soybless_225x157.jpg", -15.786111, 35.005833 );  
    addMapPoint(1211,"Food","Boosting Crop Yields with Drought-Tolerant Hybrid Seeds","Together with dedicated third-party distributors, DuPont is bringing Pioneer brand hybrid seed technology to local farmers, resulting in higher crop yields and an improved quality of life for Malawians.", _globalChallengesValue+"/food/articles/seeds-future.html","/etc/designs/dupont/tools/megatrends/source/images/seedsfuture_225x157.jpg",-9.676569, 33.409424 );  
    addMapPoint(1199,"Energy","Low-weight Performance Nylon Fuels Car Efficiency","Car efficiency can be improved using Zytel® PLUS, a low-weight performance nylon that reduces the weight of automobiles and their need for gas.",_globalChallengesValue+"/energy/articles/nylon-fuels-auto.html","/etc/designs/dupont/tools/megatrends/source/images/NationalGeographic_Energy_962641_ChinaHighway_225x157.jpg", 42.329494, -83.046829 );
    addMapPoint(1217,"Energy","Improving Ethanol Fuel Processes — Without Using Antibiotics","Our ethanol fuel process creates a higher-performing biofuel fermentation process for a better alternative to fossil fuels.",_globalChallengesValue+"/energy/articles/ethanol-fuel-production.html","/etc/designs/dupont/tools/megatrends/source/images/NationalGeographic_Energy_15485_GrenadaSugarcane_225x157.jpg", 39.739011, -75.552437 );
    addMapPoint(1202,"Energy","Generating Sustainable Energy on Wind Farms","The partnership between CG Power Systems and DuPont is successfully helping wind farms to generate sustainable energy around the world.",_globalChallengesValue+"/energy/articles/sustainable-energy.html","/etc/designs/dupont/tools/megatrends/source/images/NationalGeographic_Energy_977476_WindFarm_225x157.jpg", 55.832862, 12.068306 );
    addMapPoint(1206,"Energy","Creating the Largest Thin-film Photovoltaic Rooftop in Hong Kong","DuPont helped to create the largest-ever thin-film photovoltaic rooftop project in collaboration with the Hongkong Electric Company.",_globalChallengesValue+"/energy/articles/thin-film-photovoltaic.html","/etc/designs/dupont/tools/megatrends/source/images/NationalGeographic_Energy_962439_HongKongSkyline_225x157.jpg", 22.209889, 114.134560 );
    addMapPoint(1216,"Energy","Creating Renewable Cellulosic Ethanol Biofuel","Together with local farmers, Genera Energy, and the University of Tennessee, DuPont is developing cellulosic ethanol from crops such as switchgrass to produce sustainable fuel for local consumers.", _globalChallengesValue+"/energy/articles/harvesting-fuel.html","/etc/designs/dupont/tools/megatrends/source/images/harvest_225x157.jpg", 35.958268, -83.921601 );
    addMapPoint(1212,"Energy","Creating Sustainable Energy in Masdar, Abu Dhabi","See how DuPont contributed to Masdar’s goal of having a zero carbon footprint by providing crucial solar technology to the Suntech panels used in a 10MW solar field.",_globalChallengesValue+"/energy/articles/science-hope.html","/etc/designs/dupont/tools/megatrends/source/images/solarcity_225x157.jpg", 24.467682, 54.372356 );
    addMapPoint(1213,"Protection","Better Body Protection for Those Who Protect Us","Military and law enforcement need lightweight and flexible body protection, including bullet-resistant vests and helmets for use in stressful environments, to protect those who protect us.", _globalChallengesValue+"/protection/articles/better-protection.html","/etc/designs/dupont/tools/megatrends/source/images/bg-main-protection-us_225x157.jpg", 32.854192, -79.969397 );
    addMapPoint(1229,"Protection","Making Car Armoring More Affordable for Families in Brazil","See how we make car armoring affordable and accessible for Brazil’s families.",_globalChallengesValue+"/protection/articles/brazil-life-protection.html","/etc/designs/dupont/tools/megatrends/source/images/NationalGeographic_Protection_1243924_RioSkyline_225x157.jpg", -11.804268, -42.539063 );
    addMapPoint(1201,"Protection","Keeping the World Cooler with Ozone-friendly Refrigerants","DuPont is helping to make ozone-friendly natural refrigerants designed to replace R-22 in existing air conditioning and refrigeration systems.",_globalChallengesValue+"/protection/articles/ozone-friendly-refrigerant.html","/etc/designs/dupont/tools/megatrends/source/images/NationalGeographic_Protection_1372706_Glacier_225x157.jpg", 38.915812, -77.050956 );
    addMapPoint(1210,"Protection","Raising Safety Standards for Over 14,000 Employees","DuPont Sustainable Solutions and the MOL Energy Group helped to raise safety standards for over 14,000 employees.",_globalChallengesValue+"/protection/articles/safety-standards.html","/etc/designs/dupont/tools/megatrends/source/images/NationalGeographic_Protection_464643_PetroleumTank_225x157.jpg", 47.501361, 19.064357 );
    addMapPoint(1220,"Protection","Building Safer Roads with High-Performance Asphalt","DuPont provided Odebrecht with polymer science that helped it build a safer road and trade route across Peru and Brazil.",_globalChallengesValue+"/protection/articles/road-to-prosperity.html","/etc/designs/dupont/tools/megatrends/source/images/roads_225x157.jpg", -11.620672, -76.508789 );
    addMapPoint(1214,"Protection","Helping to Build Affordable Homes in Campeche","DuPont is helping Repshel find a solution that can replace thousands of temporary dwellings with affordable homes built of safe and sanitary modular PVC housing material.",_globalChallengesValue+"/protection/articles/affordable-homes.html","/etc/designs/dupont/tools/megatrends/source/images/homeatlast_225x157.jpg", 19.842192, -90.534565 );
    addMapPoint(1222,"Protection","Bullet-Resistant Body Armor for Brazil’s Law Enforcement Officers","By working together with Companhia Brasileira de Cartuchos, DuPont is helping provide a local solution that gives Brazil’s law enforcement officers affordable bullet-resistant body armor.", _globalChallengesValue+"/protection/articles/bullet-resistant-brazil.html","/etc/designs/dupont/tools/megatrends/source/images/brazilbullets_225x157.jpg",-23.566599, -46.653111);
    addMapPoint(1218,"Protection","Flame-Resistant Fabrics for Greater Firefighter Safety","By working with garment manufacturers and firefighters, DuPont develops innovations that help improve firefighter safety with enhanced thermal protection at higher temperatures.",_globalChallengesValue+"/protection/articles/sounds-difference.html","/etc/designs/dupont/tools/megatrends/source/images/firefighters_225x157.jpg", 39.949148, -75.163319);
    addMapPoint(1219,"Protection","Creating Safety Programs for Workers at Tata Steel","Together with Tata Steel, DuPont helped to establish new safety programs for contract workers on job sites.",_globalChallengesValue+"/protection/articles/safety-subcontinent.html","/etc/designs/dupont/tools/megatrends/source/images/tatasteel_225x157.jpg", 23.230578, 79.628906);
    addMapPoint(1225,"Protection","Developing a Better Prosthetic Foot for Amputees","Together with Niagara Prosthetics & Orthotics International and Queen’s University, Canada, DuPont is helping to produce an affordable prosthetic foot for amputees.",_globalChallengesValue+"/protection/articles/safe-footing.html","/etc/designs/dupont/tools/megatrends/source/images/safefooting_225x157.jpg", 14.090583, -89.283142);
    addMapPoint(5850,"Energy","Most Efficient Solar Panels Produced by DuPont and Sharp","Together with Sharp, DuPont helps produce one of the most efficient solar panels in the photovoltaic industry.",_globalChallengesValue+"/energy/articles/most-efficient-solar-panels.html","/etc/designs/dupont/tools/megatrends/source/images/renewable_innovation_still_225x157.jpg", 35.689484, 139.691706);
    addMapPoint(5600,"Energy","Improved Aircraft Fuel Efficiency with the Airbus A380","Working closely with Airbus, DuPont provides lightweight, composite materials to help improve fuel efficiency for the A380.",_globalChallengesValue+"/energy/articles/improving-aircraft-fuel-efficiency.html","/etc/designs/dupont/tools/megatrends/source/images/light_flight_small_225x157.jpg", 43.604652, 1.444209);
    addMapPoint(5598,"Food","Hybrid Rice Helps Improve Rice Production in High Salinity Conditions","Together with Vietnam farmers and local scientists, DuPont Pioneer introduced hybrid rice that helps improve rice production in high salinity conditions.", _globalChallengesValue+"/food/articles/hybrid-rice-improve-rice-production.html","/etc/designs/dupont/tools/megatrends/source/images/salt_of_the_earth_still_small_225x157.jpg", 10.1844631, 106.1372556);
    addMapPoint(5599,"Food","Reducing Food Waste with DuPont™ Tyvek® Air Cargo Covers","Together with Cargolux, DuPont developed DuPont™ Tyvek® Air Cargo covers to help reduce food waste during transit.",_globalChallengesValue+"/food/articles/reducing-food-waste.html","/etc/designs/dupont/tools/megatrends/source/images/world_without_food_waste_small_225x157.jpg", 49.815273, 6.129583);
    addMapPoint(5601,"Protection","Environmentally Sustainable Deicing Fluid ","Together with Kilfrost, DuPont Tate & Lyle Bio Products develop DF Sustain, a deicing fluid that has less of an impact on the environment.",_globalChallengesValue+"/protection/articles/environmentally-sustainable-deicing-fluid.html","/etc/designs/dupont/tools/megatrends/source/images/new_ice_age_med_225x157.jpg", 35.6894875, 139.691706);
    addMapPoint(5602,"Food","Advancing Food Packaging Technology with DuPont™ Surlyn® ","In collaboration with DuPont, Mixpack is using Surlyn® to advance food packaging technology and help deliver healthy, safe food to remote areas in Mexico.",_globalChallengesValue+"/food/articles/food-packaging-technology.html","/etc/designs/dupont/tools/megatrends/source/images/mexico_still_255x157.jpg", 28.630581, -106.0737);
    addMapPoint(5603,"Protection","Helping Provide the Latest in Arc Flash Protection to Russian Electrical Workers","Working together, DuPont and  Energocontract provide the latest in arc flash protection to Russian electrical workers.",_globalChallengesValue+"/protection/articles/arc-flash-protection.html","/etc/designs/dupont/tools/megatrends/source/images/arc_flash_225x157.jpg", 56.716667, 28.65);
    //addMapPoint(5604,"Energy","Enabling Building Energy Efficiency with DuPont™ Tyvek® Fluid Applied","DuPont helps provide greater building energy efficiency for the Ronald McDonald House Charities.","global-challenges/energy/building-energy-efficiency.html","/etc/designs/dupont/tools/megatrends/source/images/chicago_still_map_225x157.jpg", 41.878114, -87.629798);
    addMapPoint(5604,"Energy","Enabling Building Energy Efficiency with DuPont™ Tyvek® Fluid Applied","DuPont helps provide greater building energy efficiency for the Ronald McDonald House Charities.",_globalChallengesValue+"/energy/articles/building-energy-efficiency.html","/etc/designs/dupont/tools/megatrends/source/images/chicago_still_map_225x157.jpg", 41.878114, -87.629798);
    addMapPoint(6652,"Food","Crop Protection in Spain ׀ DuPont™ Altacor®","Together with local authorities and a Brazilian professor, DuPont helps educate farmers in Spain about the Tuta Absoluta pest and the benefits of DuPont™ Altacor®.",_globalChallengesValue+"/food/articles/crop-protection-spain.html","/etc/designs/dupont/tools/megatrends/source/images/spain_still_225x157.jpg", 37.9834449, -1.1298897);
    addMapPoint(5605,"Protection","Improving Workplace Safety with AngloAmerican","Partnering with AngloAmerican, DuPont helped improve workplace safety during construction of the Nickel mine in Barro Alto, Brazil.",_globalChallengesValue+"/protection/articles/improving-workplace-safety.html","/etc/designs/dupont/tools/megatrends/source/images/brazil_newsstill_225x157.jpg", -14.9684497, -48.9201446);
    //addMapPoint(6762,"Energy","Advancing Food Packaging Technology with DuPont™ Surlyn® ","Together with Chery Automotive, DuPont showcases the use of engineered plastics to enable vehicle weight reduction.","../../../automotive/en-us/au/vehicle-weight-reduction.html","/etc/designs/dupont/tools/megatrends/source/images/image003_3.jpg", 31.352859, 118.432941);
    addMapPoint(1230,"Food","Nutrition for Children in China | DuPont Danisco","Working to help improve nutrition for children in China, DuPont and New Hope Dairy Co., have developed a special formulated milk for China’s National School Milk Program.",_globalChallengesValue+"/food/articles/nutrition-for-children-in-china.html","/etc/designs/dupont/tools/megatrends/source/images/LessonInNutrition_Still_225x117.jpg", 25.045350, 102.709938);
    addMapPoint(1232,"Food","Rice Farming Education and Technology | DuPont Pioneer","In collaboration with the Agricultural Department of Uttar Pradesh, DuPont Pioneer provides hybrid rice seed technology and farming techniques necessary to improve rice production for their growing population.",_globalChallengesValue+"/food/articles/rice-farming-education-and-technology.html","/etc/designs/dupont/tools/megatrends/source/images/seed_school_still_225X117.jpg",27.570589,80.098187);
    addMapPoint(1234,"Food","Sugarcane Borer Control in India | DuPont™ Coragen®","DuPont is working with local farmers to control sugarcane borer pests with DuPont™ Coragen® and improve sugarcane crops in India.",_globalChallengesValue+"/food/sugarcane-borer-control.html","/etc/designs/dupont/tools/megatrends/source/images/sweetness_of_victory_still_225x117.jpg",20.593684,78.96288);
    addMapPoint(1236,"Food","Corn Farming Mechanization in China | DuPont Pioneer","Together with local farmers and partners in China, DuPont is promoting corn farming mechanization and hybrid seed technology to improve crop yields",_globalChallengesValue+"/food/agriculture-technology-in-china.html","/etc/designs/dupont/tools/megatrends/source/images/planting_prosperity_still_225x117.jpg",45.803775,126.534967);
    addMapPoint(1238,"Protection","Cotton Textile Production Protects Environment","In partnership with Huntsman, DuPont helps create Gentle Power Bleach™ system which offers reductions in energy and water consumption to the global cotton textile production.",_globalChallengesValue+"/videos/cotton-textile-production.html","/etc/designs/dupont/tools/megatrends/source/images/Handle_with_Care_225x117.png",41.156689,-8.623925);
    addMapPoint(1240,"Protection","Helping Improve Truck Safety | DuPont™ Viton®","Working with Tata Motors, DuPont is helping to improve truck safety in India, by using DuPont™ Viton® in the rear axles of the Tata Prima truck.",_globalChallengesValue+"/protection/articles/truck-safety.html","/etc/designs/dupont/tools/megatrends/source/images/There_and_Back_225x117.jpg",20.593684,78.96288);
    addMapPoint(1241,"Energy","Fashion Forward","DuPont has partnered with a leading fashion brand, K-Boxing, to promote environmentally-friendly fashion in the China textile industry.  DuPont™ Sorona®, a renewably sourced fiber, uses fewer fossil fuels to produce, is helping create better-performing sustainable textiles that are gentler on the planet.",_globalChallengesValue+"/energy/articles/china-textile-industry.html","/content/dam/assets/corporate-functions/our-approach/global-challenges/energy/articles/images/Sorona_Still_690x345.jpg",24.732246, 118.64794);
    addMapPoint(1242,"Energy","Wind in the Sails"," In collaboration with CG Power and Areva Wind, DuPont helped design a reliable offshore wind turbine for the growing renewable energy industry in Germany.  DuPont™ Nomex® is used as an insulation material and helps keep the transformer running smoothly and generating wind energy off the shores of the town of Bremerhaven.",_globalChallengesValue+"/energy/articles/germany-wind-energy.html","/content/dam/assets/corporate-functions/our-approach/global-challenges/energy/articles/images/WindintheSails_Still_690x345.jpg",53.5500000,8.5833333);
    addMapPoint(1243,"Energy","A Brighter Life ","In partnership with Moser Baer, DuPont has helped create photovoltaic panels that provide reliable solar power India.  With the help of DuPont™ Tedlar® and Solamet® materials, these solar farms are capable of operating in the remote villages and harsh climates of the Ladakh region.",_globalChallengesValue+"/energy/articles/solar-power-in-india.html","/content/dam/assets/corporate-functions/our-approach/global-challenges/energy/articles/images/ABrighterLife_Still_690x345.jpg",34.0000000,78.0000000);
    addMapPoint(1244,"Food","Farming at your Fingertips","DuPont is providing farmers with modern farming technology that helps transform farm data into increased productivity through timely and actionable information.",_globalChallengesValue+"/food/articles/modern-farming-technology.html","/content/dam/assets/corporate-functions/our-approach/global-challenges/food/articles/images/FarmingAtYourFingertips_Still_690x345.jpg",41.4080327,-92.916405);
    addMapPoint(1245,"Food","Ready, Set, Nutrition","DuPont partnered with Australian health food company, Sanitarium, to create an option for a healthy breakfast on-the-go for those with busy, active lifestyles.",_globalChallengesValue+"/food/articles/healthy-breakfast-on-the-go.html","/content/dam/assets/corporate-functions/our-approach/global-challenges/food/articles/images/ReadySetNutrition_YTStill_690x345.jpg",-33.8671390,151.2071140);
    addMapPoint(1246,"Food","Packaging;  A Quiet Revolution","Food packaging innovations play an important role in helping to eliminate food waste and improve global food security.",_globalChallengesValue+"/food/articles/food-packaging-innovations.html","/content/dam/assets/corporate-functions/our-approach/global-challenges/food/articles/images/Packaging_AQuietRevolution_690x345.jpg",39.7458330,-75.5466670);   

    //addMapPoint(1247,"Protection","Refining Protection"," ",_globalChallengesValue+"/protection/articles/","/content/dam/assets/corporate-functions/our-approach/global-challenges/energy/articles/images/",39.306184,83.2250449);
    //addMapPoint(1248,"Protection","Beating the Heat"," ",_globalChallengesValue+"/protection/articles/","/content/dam/assets/corporate-functions/our-approach/global-challenges/energy/articles/images/",22.5434470,22.5434470);
    addMapPoint(1247, "Protection","Beating the Heat", "In partnership with U.protec, DuPont has improved the design and functionality of emergency uniforms in China.", _globalChallengesValue + "protection/articles/firefighter-turnout-gear.html", "/etc/designs/dupont/tools/megatrends/source/images/protection_beating_the_Heat_225x113.jpg", 22.5434470, 114.0578180);
    addMapPoint(1248, "Protection", "Refining Protection","Together with Petrochina Tarim Oilfield Company, DuPont Sustainable Solutions is helping improve refinery safety in China. ",_globalChallengesValue + "/protection/articles/refinery-safety-in-china.html","/etc/designs/dupont/tools/megatrends/source/images/protection_refining_protection_225x113.jpg", 39.306184, 83.2250449);


}

function redraw(){  
    FoodEnabled= document.getElementById("filter_food").checked;
    EnergyEnabled=document.getElementById("filter_energy").checked;
    ProtectionEnabled=document.getElementById("filter_protection").checked;
    window.map.removeAllShapes();
    addPins();
}

function addMapPoint(nodeid, challenge, hoverText, infoWindowText, link, thumbnail, lat, lng){
    if(thumbnail==""){
        dataURL=link.substring(0,link.length-5)+"/_jcr_content/thumbnail.json";
        
        $.ajax({
            type: "GET",
            url: dataURL,
            async: false,
            dataType: "json",
            success: function(data) {
                thumbnail=data['fileReference'];
            }
        });


    }
    /*Check to see if we are displaying points for this megatrend*/
    if ((challenge.toUpperCase() == "FOOD" && FoodEnabled) 
            ||(challenge.toUpperCase() == "ENERGY" && EnergyEnabled) 
            || (challenge.toUpperCase() == "PROTECTION" && ProtectionEnabled)){
    
        /* Set up Icon */
        var icon;
        
        if (challenge.toUpperCase() == "FOOD"){
            icon=new MQA.Icon("/etc/designs/dupont/tools/megatrends/source/images/GreenPin.png",37,34);
        }
        if (challenge.toUpperCase() == "ENERGY"){
            icon=new MQA.Icon("/etc/designs/dupont/tools/megatrends/source/images/YellowPin.png",37,34);
        }
        if (challenge.toUpperCase() == "PROTECTION"){
            icon=new MQA.Icon("/etc/designs/dupont/tools/megatrends/source/images/PurplePin.png",37,34);
        }
    
        /*Using the MQA.Poi constructor*/
        var info=new MQA.Poi({lat:lat, lng:lng});

        /*Sets the rollover content of the POI.*/
        // info.setRolloverContent('DuPont - ' + hoverText);
                var rolloverText = 'DuPont: ' + hoverText;
              if (rolloverText.length > 128){
                     rolloverText=rolloverText.substr(0,124) + '...';
              }
              rolloverText = rolloverText.split(' ').join('&nbsp;');
              info.setRolloverContent(rolloverText);


        /*Add Info Window*/
        var infoWindowHTML = '<div id="locationContent"><div class="left"><div class="category">CHALLENGE: ' + challenge + ' </div><div class="desc">' + infoWindowText + '</div><div class="link"><a class="exit-map" href="javascript:window.parent.location=\''+ link + '\'">See This Story &gt;&gt;</a></div></div><div class="right"><img height="147" width="220" src="' + thumbnail + '"></div><div class="clear"></div></div>';
        info.setInfoContentHTML(infoWindowHTML);

        /* Add Icon */
        info.setIcon(icon);
        
        /*This will add the POI to the map in the map's default shape collection.*/
        map.addShape(info);

        /*open the info window if node is passed in query string*/
        if (getQuerystring("nodeid", "") == nodeid.toString()){
            info.toggleInfoWindow();
        }
    }
}


/* An example of using the MQA.EventUtil to hook into the window load event and execute defined function 
passed in as the last parameter. You could alternatively create a plain function here and have it 
executed whenever you like (e.g. <body onload="yourfunction">). */ 

MQA.EventUtil.observe(window, 'load', function() {

    /*Create an object for options*/ 
        var options={
        elt:document.getElementById('map'),       /*ID of element on the page where you want the map added*/ 
        zoom:0,                                   /*initial zoom level of the map*/ 
        latLng:{lat:12, lng:0},                   /*center of map in latitude/longitude */ 
        mtype:'map',                              /*map type (map)*/ 
        bestFitMargin:0,                          /*margin offset from the map viewport when applying a bestfit on shapes*/ 
        zoomOnDoubleClick:true                    /*zoom in when double-clicking on map*/ 
    };

    /*Construct an instance of MQA.TileMap with the options object*/ 
    window.map = new MQA.TileMap(options);

    MQA.withModule('largezoom', function() {
        map.addControl(
            new MQA.LargeZoom(), 
            new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5))
        );
    });
    
    addPins();

    var filter = getQuerystring("filter");
   
    if(filter  == "food"){
        document.getElementById("filter_protection").checked = false ;
        document.getElementById("filter_energy").checked = false ;
        document.getElementById("filter_food").checked = true ;
    } else if(filter  == "protection") {
        document.getElementById("filter_food").checked = false ;
        document.getElementById("filter_energy").checked = false ;
        document.getElementById("filter_protection").checked = true ;
    } else if(filter  == "energy"){
        document.getElementById("filter_food").checked = false ;
        document.getElementById("filter_protection").checked = false ;
        document.getElementById("filter_energy").checked = true ;
    }
    
    redraw();
    
    if(!jQuery(".disclaimer").html()!="<div style=\"clear:both\"></div>" ){

        jQuery(".button.red-button.megatrend-fancybox").css("margin-bottom","30px");
    }

});
