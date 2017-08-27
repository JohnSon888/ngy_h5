var userid=0;
var telephone='';
var username='';
var lng='';
var lat='';
var location_info=0;
var location_address = '';
var location_areaIDs = '';
var location_areaNames = '';
var current_location_info=0;
var current_location_address = '';
var current_location_areaIDs = '';
var current_location_areaNames = '';
var phoneIMEI = '';//手机串号
var phoneModels = '';//手机型号
var useragent = navigator.userAgent;
if (useragent.indexOf("farmingcloud")>0) {
    // alert('魔都行囊APP');
     requestMylocation();
    if (useragent.indexOf("farmingcloud/ios")>0) {
        // alert('魔都行囊IOS');
        function initReady()
        {
            requestMylocation();
            //页面初始化获取用户ID
            getUserInfo(function(value){
                userid = parseInt(value['userid']);
                telephone = value['phone'];
                username = value['username'];
                $.setStorage('userid',userid);
            });
            userid = $.getStorage('userid');
            //获取用户设置的位置信息
            getLocationInfo(function(value){
                var address_info = '';
                var area_value = eval('('+value+')');
                var province_info = area_value['province']['areaID'];
                var city_info = area_value['city']['areaID'];
                var area_info = area_value['area']['areaID'];
                var town_info= area_value['town']['areaID'];
                var village_info = area_value['village']['areaID'];
                var province_name = area_value['province']['areaName'];
                var city_name = area_value['city']['areaName'];
                var area_name = area_value['area']['areaName'];
                var town_name = area_value['town']['areaName'];
                var village_name = area_value['village']['areaName'];
                location_areaIDs = province_info+','+city_info+','+area_info+','+town_info+','+village_info;
                location_areaNames = province_name+','+city_name+','+area_name+','+town_name+','+village_name;
                if(province_info==''){
                    location_info = '';
                }else{
                    address_info += province_name;
                    if(city_info==''){
                        location_info = province_info;
                    }else{
                        address_info += city_name;
                        if(area_info==''){
                            location_info = city_info;
                        }else{
                            address_info += area_name;
                            if(town_info==''){
                                location_info = area_info;
                            }else{
                                address_info += town_name;
                                if(village_info==''){
                                    location_info = town_info;
                                }else{
                                    address_info += village_name;
                                    location_info = village_info;
                                }
                            }
                        }
                    }
                }
                location_address = address_info;
                $.setStorage('location_address',location_address);
                $.setStorage('location_areaIDs',location_areaIDs);
                $.setStorage('location_areaNames',location_areaNames);
            });
            location_address = $.getStorage('location_address');
            location_areaIDs = $.getStorage('location_areaIDs');
            location_areaNames = $.getStorage('location_areaNames');
            //获取当前位置
            getCurrentLocationInfo(function(value){
                var address_info = '';
                var area_value = eval('('+value+')');
                var province_info = area_value['province']['areaID'];
                var city_info = area_value['city']['areaID'];
                var area_info = area_value['area']['areaID'];
                var town_info= area_value['town']['areaID'];
                var village_info = area_value['village']['areaID'];
                var province_name = area_value['province']['areaName'];
                var city_name = area_value['city']['areaName'];
                var area_name = area_value['area']['areaName'];
                var town_name = area_value['town']['areaName'];
                var village_name = area_value['village']['areaName'];
                current_location_areaIDs = province_info+','+city_info+','+area_info+','+town_info+','+village_info;
                current_location_areaNames = province_name+','+city_name+','+area_name+','+town_name+','+village_name;
                if(province_info==''){
                    current_location_info = '';
                }else{
                    address_info += province_name;
                    if(city_info==''){
                        current_location_info = province_info;
                    }else{
                        address_info += city_name;
                        if(area_info==''){
                            current_location_info = city_info;
                        }else{
                            address_info += area_name;
                            if(town_info==''){
                                current_location_info = area_info;
                            }else{
                                address_info += town_name;
                                if(village_info==''){
                                    current_location_info = town_info;
                                }else{
                                    address_info += village_name;
                                    current_location_info = village_info;
                                }
                            }
                        }
                    }
                }
                current_location_address = address_info;
                $.setStorage('current_location_address',current_location_address);
                $.setStorage('current_location_areaIDs',current_location_areaIDs);
                $.setStorage('current_location_areaNames',current_location_areaNames);
            });
            current_location_address = $.getStorage('current_location_address');
            current_location_areaIDs = $.getStorage('current_location_areaIDs');
            current_location_areaNames = $.getStorage('current_location_areaNames');
        }
    }else if (useragent.indexOf("farmingcloud/android")>0) {
//         alert('魔都行囊Android');
        getUserInfo(function(value){
            userid = value==undefined?0:parseInt(value['userid']);
            telephone = value==undefined?'':parseInt(value['phone']);
            username = value==undefined?'':value['username'];
        });
        getLocationInfo(function(value){
            var address_info = '';
                var area_value = eval(value);
                var province_info = area_value["province"] != undefined?(area_value['province']['areaID']!=0)?area_value['province']['areaID']:'':'';
                var city_info = area_value["city"] != undefined?(area_value['city']['areaID']!=0)?area_value['city']['areaID']:'':'';
                var area_info = area_value["area"] != undefined?(area_value['area']['areaID']!=0)?area_value['area']['areaID']:'':'';
                var town_info = area_value["town"] != undefined?(area_value['town']['areaID']!=0)?area_value['town']['areaID']:'':'';
                var village_info = area_value["village"] != undefined?(area_value['village']['areaID']!=0)?area_value['village']['areaID']:'':'';
                var province_name = area_value["province"] != undefined?(area_value['province']['areaID']!=0)?area_value['province']['areaID']:'':'';
                var city_name = area_value['city'] != undefined?(area_value['city']['areaID']!=0)?area_value['city']['areaID']:'':'';
                var area_name = area_value['area'] != undefined?(area_value['area']['areaID']!=0)?area_value['area']['areaID']:'':'';
                var town_name = area_value['town'] != undefined?(area_value['town']['areaID']!=0)?area_value['town']['areaID']:'':'';
                var village_name = area_value['village'] != undefined?(area_value['village']['areaID']!=0)?area_value['village']['areaID']:'':'';
                if(province_info==''){
                    location_info = '';
                }else{
                    // location_areaNames = province_name;
                    address_info += province_name;
                    if(city_info==''){
                        location_info = province_info;
                    }else{
                        // location_areaNames = province_name+','+city_name;
                        address_info += city_name;
                        if(area_info==''){
                            location_info = city_info;
                        }else{
                            // location_areaNames = province_name+','+city_name+','+area_name;
                            address_info += area_name;
                            if(town_info==''){
                                location_info = area_info;
                            }else{
                                // location_areaNames = province_name+','+city_name+','+area_name+','+town_name;
                                address_info += town_name;
                                if(village_info==''){
                                    location_info = town_info;
                                }else{
                                    address_info += village_name;
                                    location_info = village_info;
                                }
                            }
                        }
                    }
                }
                location_address = address_info;
                $.setStorage('location_address',location_address);
                location_areaIDs = province_info+','+city_info+','+area_info+','+town_info+','+village_info;
                location_areaNames = province_name+','+city_name+','+area_name+','+town_name+','+village_name;
        });
        //获取当前位置
        getCurrentLocationInfo(function(value){
            var address_info = '';
                var area_value = eval(value);
                var province_info = area_value["province"] != undefined?(area_value['province']['areaID']!=0)?area_value['province']['areaID']:'':'';
                var city_info = area_value["city"] != undefined?(area_value['city']['areaID']!=0)?area_value['city']['areaID']:'':'';
                var area_info = area_value["area"] != undefined?(area_value['area']['areaID']!=0)?area_value['area']['areaID']:'':'';
                var town_info = area_value["town"] != undefined?(area_value['town']['areaID']!=0)?area_value['town']['areaID']:'':'';
                var village_info = area_value["village"] != undefined?(area_value['village']['areaID']!=0)?area_value['village']['areaID']:'':'';
                var province_name = area_value["province"] != undefined?(area_value['province']['areaID']!=0)?area_value['province']['areaID']:'':'';
                var city_name = area_value['city'] != undefined?(area_value['city']['areaID']!=0)?area_value['city']['areaID']:'':'';
                var area_name = area_value['area'] != undefined?(area_value['area']['areaID']!=0)?area_value['area']['areaID']:'':'';
                var town_name = area_value['town'] != undefined?(area_value['town']['areaID']!=0)?area_value['town']['areaID']:'':'';
                var village_name = area_value['village'] != undefined?(area_value['village']['areaID']!=0)?area_value['village']['areaID']:'':'';
                var province_name1 = area_value["province"] != undefined?(area_value['province']['areaName']!=0)?area_value['province']['areaName']:'':'';
                var city_name1 = area_value['city'] != undefined?(area_value['city']['areaName']!=0)?area_value['city']['areaName']:'':'';
                var area_name1 = area_value['area'] != undefined?(area_value['area']['areaName']!=0)?area_value['area']['areaName']:'':'';
                var town_name1 = area_value['town'] != undefined?(area_value['town']['areaName']!=0)?area_value['town']['areaName']:'':'';
                var village_name1 = area_value['village'] != undefined?(area_value['village']['areaName']!=0)?area_value['village']['areaName']:'':'';
                if(province_info==0){
                    current_location_info = '';
                }else{
                    // location_areaNames = province_name;
                    address_info += province_name1;
                    if(city_info==0){
                        current_location_info = province_info;
                    }else{
                        // location_areaNames = province_name+','+city_name;
                        address_info += city_name1;
                        if(area_info==0){
                            current_location_info = city_info;
                        }else{
                            // location_areaNames = province_name+','+city_name+','+area_name;
                            address_info += area_name1;
                            if(town_info==0){
                                current_location_info = area_info;
                            }else{
                                // location_areaNames = province_name+','+city_name+','+area_name+','+town_name;
                                address_info += town_name1;
                                if(village_info==0){
                                    current_location_info = town_info;
                                }else{
                                    address_info += village_name1;
                                    current_location_info = village_info;
                                }
                            }
                        }
                    }
                }
                current_location_address = address_info;
                $.setStorage('current_location_address',current_location_address);
                current_location_areaIDs = province_info+','+city_info+','+area_info+','+town_info+','+village_info;
                current_location_areaNames = province_name1+','+city_name1+','+area_name1+','+town_name1+','+village_name1;
        });
    }
}else {
    // console.info('外部浏览器');
}

 $(function(){
     requestMylocation();
 })
    function didUpdateLocation(longitude, latitude){
        lng = longitude;
        lat = latitude;
    }
//    getIMEI(function(ID){
//        phoneIMEI = ID;
//    });
//    getPhoneModel(function(model){
//        phoneModels = model;
//    });
/**
*   登陆成功回调
*   userid          用户id
*   username        用户昵称
*   phone           手机号
*   avatar          头像
**/
function loginSuccessed(userid, username, phone, avatar){
	userid = parseInt(userid);
	window.location.reload();
}

/**
*   退出回调
*   logout: 1 退出成功；0 退出失败
**/
function logOut(logout){
    if(logout==1){
        $.delStorage('userid');
    }
}

function isLogin(){
	userid = parseInt($.getStorage('userid'));
	if(isNaN(userid)){
		userid = 0;
	}else{
		userid = parseInt($.getStorage('userid'));
	}
	return userid;
}

// location_address = "上海市市辖区黄浦区";
// location_areaIDs = "1,452,1435,,";
// location_areaNames = "上海市,市辖区,黄浦区,,";
// value = '{"area":{"areaID":1443,"areaName":"闵行区"},"city":{"areaID":452,"areaName":"市辖区"},"province":{"areaID":1,"areaName":"上海市"},"town":{"areaID":12520,"areaName":"新虹街道"},"village":{"areaID":0,"areaName":""}}';
// // getCurrentLocationInfo(function(value){
//             var address_info = '';
//                 var area_value = eval('('+value+')');
//                 var province_info = area_value["province"] != undefined?(area_value['province']['areaID']!=0)?area_value['province']['areaID']:'':'';
//                 var city_info = area_value["city"] != undefined?(area_value['city']['areaID']!=0)?area_value['city']['areaID']:'':'';
//                 var area_info = area_value["area"] != undefined?(area_value['area']['areaID']!=0)?area_value['area']['areaID']:'':'';
//                 var town_info = area_value["town"] != undefined?(area_value['town']['areaID']!=0)?area_value['town']['areaID']:'':'';
//                 var village_info = area_value["village"] != undefined?(area_value['village']['areaID']!=0)?area_value['village']['areaID']:'':'';
//                 var province_name = area_value["province"] != undefined?(area_value['province']['areaName']!=0)?area_value['province']['areaName']:'':'';
//                 var city_name = area_value['city'] != undefined?(area_value['city']['areaName']!=0)?area_value['city']['areaName']:'':'';
//                 var area_name = area_value['area'] != undefined?(area_value['area']['areaName']!=0)?area_value['area']['areaName']:'':'';
//                 var town_name = area_value['town'] != undefined?(area_value['town']['areaName']!=0)?area_value['town']['areaName']:'':'';
//                 var village_name = area_value['village'] != undefined?(area_value['village']['areaName']!=0)?area_value['village']['areaName']:'':'';
//                 if(province_info==0){
//                     current_location_info = '';
//                 }else{
//                     // location_areaNames = province_name;
//                     address_info += province_name;
//                     if(city_info==0){
//                         current_location_info = province_info;
//                     }else{
//                         // location_areaNames = province_name+','+city_name;
//                         address_info += city_name;
//                         if(area_info==0){
//                             current_location_info = city_info;
//                         }else{
//                             // location_areaNames = province_name+','+city_name+','+area_name;
//                             address_info += area_name;
//                             if(town_info==0){
//                                 current_location_info = area_info;
//                             }else{
//                                 // location_areaNames = province_name+','+city_name+','+area_name+','+town_name;
//                                 address_info += town_name;
//                                 if(village_info==0){
//                                     current_location_info = town_info;
//                                 }else{
//                                     address_info += village_name;
//                                     current_location_info = village_info;
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 current_location_address = address_info;
//                 $.setStorage('current_location_address',current_location_address);
//                 current_location_areaIDs = province_info+','+city_info+','+area_info+','+town_info+','+village_info;
//                 current_location_areaNames = province_name+','+city_name+','+area_name+','+town_name+','+village_name;
//         // });
// console.info(current_location_areaNames);