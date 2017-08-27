/**
 * Created by ph on 2016/8/18.
 */
/** 全局插件 **/
$.extend({
    ajaxApi:function(){
        return "http://dev.api.glela.com/";
        //return "http://api.glela.com/";
    },
    wxApi:function () {
        return "http://dev.h5.glela.com/";
        //return "http://h5.glela.com/;
    },
    imgApi:function () {
        return "http://of19dc1s3.bkt.clouddn.com/";
        //return "http://images.校妆.co/";
    },
    /*
     * penghe 2016-07-09  获取url参数值
     */
    getPara:function(name,url){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        if (url) {
            if (url.indexOf("?") != -1)
                url = url.split("?")[1];
        } else if (window.location.search.length > 1) {
            url = decodeURI(window.location.search.substr(1));
        } else {
            return '';
        }
        var r = url.match(reg);
        if (r != null) return unescape(r[2]); return '';
    },
    GetRequest:function(){
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    /*
     * penghe 2016-07-09 ajax请求
     */
    ajaxHandler:function(ajaxObj){
        var visible = ajaxObj.visible || "show";
        var approve = ajaxObj.approve || false;
        var g={
            loading:function (text) {
                var _content = "";
                if(text) _content =text;
                if(visible=="show"){ //显示加载 loading
                    var loader = '<div class="loading-box"> <div class="loading-bounce-box"> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> </div><div class="loading-content">'+_content+'</div></div>';
                    if($(".loading-box").length<1){
                        $("body").append(loader);
                        $(".loading-box").addClass("open");
                    }else{
                        if(!$(".loading-box").hasClass("open")){
                            $(".loading-box").addClass("open");
                        }
                    }
                }
            },
            //隐藏进度条
            hideload:function () {
                if($(".loading-box").length>0){
                    var visibleTime =ajaxObj.visibleTime || 0; //毫秒
                    if(visibleTime>0){
                        setTimeout(function () {
                            $(".loading-box").removeClass("open");
                        },visibleTime)
                    }else{
                        $(".loading-box").removeClass("open");
                    }
                }
            },
            // 成功返回处理
            success:function (data, textStatus) {
                try {
                    if (data == undefined || data == '') {
                        g.hideload();
                        return;
                    }
                    var result;
                    if(data.code){
                        result=data;
                    }else{
                        result = JSON.parse(data);
                    }
                    if (ajaxObj.success){
                        ajaxObj.success(result,textStatus);
                    }
                    g.hideload();
                } catch (e) {
                    g.loading("系统繁忙，请稍后再试！");
                    setTimeout(function () {
                        g.hideload();
                    }, 2500);
                }
            },
            beforeSend:function (XMLHttpRequest) {
                if(approve){
                    //XMLHttpRequest.setRequestHeader("userToken","5a2a5d9d-70a2-4a59-a1fd-cfd157ee3ad0");
                    XMLHttpRequest.setRequestHeader("userToken",JSON.parse($.getStorage("uData")).token);
                }
            },
            // 失败返回处理
            error:function (e) {
                g.hideload();
                console.error(e);
            },
            // 提交动作
            submit:function () {
                var param = null;
                if (ajaxObj.model) {
                    if (typeof ajaxObj.model == "function") {
                        param = JSON.stringify(ajaxObj.model());
                    }else{
                        param ="{}";
                    }
                }else{
                    param ="{}";
                }
                var async =ajaxObj.async || "";
                var post = ajaxObj.type || "post";
                var dataType = ajaxObj.dataType || "json";
                var url = $.ajaxApi()+""+ajaxObj.api+"";
                var option = {
                    type:post,
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    dataType: dataType,
                    url: url,
                    data:''+param+'',
                    beforeSend:g.beforeSend,
                    complete:g.hideload,
                    success: g.success,
                    error: g.error
                };
                var _ajax = $.ajax(option);
                return _ajax;
            }
        };
        //执行
        g.loading();
        return g.submit();
    },
    /*
     * 存储值localstorage
     */
    setStorage:function (name,value){
        if(window.localStorage.getItem(name)){
            window.localStorage.setItem(name,JSON.stringify(value));
        }else{
            window.localStorage[name] =JSON.stringify(value);
        }
    },
    /*
     * 读取localstorage
     */
    getStorage:function (name){
        if(window.localStorage.getItem(name))
            return window.localStorage.getItem(name);
        else
            return null;
    },
    /*
     * 删除localstorage
     */
    delStorage:function (name) {
        if(window.localStorage.getItem(name))
            return window.localStorage.removeItem(name);
    },
    /*
     * 是否是微信浏览器
     */
    isWX:function(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }
    },
    /*
     * penghe 2016-07-09 微信获取Code
     */
    GetWXCode:function(UrlHosts){
        if(window.localStorage.getItem("wx")){
            window.localStorage.removeItem('wx');
        }
        var urlhost = (UrlHosts)?UrlHosts:window.location.href;
        window.location.href ="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx65d97c0cfa18b4f8&redirect_uri="+encodeURIComponent(urlhost)+"&response_type=code&scope=snsapi_userinfo#wechat_redirect";
    },
    /*
     * ph 2016-07-09 通过网页授权获取用户基本信息
     */
    GetAccessToken:function () {
        var Request = new Object();
        Request = $.GetRequest();
        var code = Request["code"];
        if(code && code!=""){
            $.ajaxHandler({
                model:function(){
                    var obj ={};
                    obj.code =code;
                    return obj;
                },
                visible:"hide",
                visibleTime:0,
                dataType:"json",
                api:"yg_platform/undefinedUser/authorization",
                success:function (result) {
                    //console.log(result);
                    if(result.code==10000){
                        var data = result.data;
                        if(data.accessToken){
                            var obj ={};
                            obj.access_token = data.accessToken;
                            obj.openid  = data.openid;
                            obj.refresh_token =data.refreshToken;
                            obj.nickname  = data.nickName;
                            obj.headimgurl  = data.headimgurl;
                            obj.sex = data.sex;
                            obj.province =data.province;
                            $.setStorage("wx",obj);
                            if(!com_obj.isgetwx){
                                $.GetWXUserInfo();
                            }

                        }else{
                            var Request = new Object();
                            Request = $.GetRequest();
                            var code = Request["code"];
                            if(code && code!=""){
                                //alert("code获取成功");
                                //通过code换取网页授权access_token
                                $.GetAccessToken();
                            }else{
                                //重新获取code
                                $.GetWXCode();
                            }
                        }
                    }else{
                        if(window.localStorage.getItem('wx')){
                            //校验Token
                            $.VerifyAccessToken();
                        }else{
                            var Request = new Object();
                            Request = $.GetRequest();
                            var code = Request["code"];
                            if(code && code!=""){
                                //alert("code获取成功");
                                //通过code换取网页授权access_token
                                $.GetAccessToken();
                            }else{
                                //重新获取code
                                $.GetWXCode();
                            }
                        }
                    }
                }
            });
        }else{
            console.log("获取access_token失败,code为空");
        }


    },
    /*
     * ph 检验授权凭证（access_token）是否有效 并刷新access_token
     */
    VerifyAccessToken:function () {
        var token = JSON.parse(window.localStorage.getItem('wx'));
        if(token){
            $.ajaxHandler({
                model:function () {
                    var obj ={};
                    obj.accessToken = token.access_token;
                    obj.openId = token.openid;
                    obj.refreshToken = token.refresh_token;
                    return obj;
                },
                visible:"hide",
                visibleTime:0,
                dataType:"JSON",
                api:"yg_platform/undefinedUser/geiPengHeYong",
                success:function (result) {
                    //console.log(result);
                    if(result.code==10000){
                        //console.log("校验token成功");
                        var data =result.data;
                        if(data.access_token){
                            var obj ={};
                            obj.access_token = data.access_token;
                            obj.openid  = data.openid;
                            obj.refresh_token =data.refresh_token;
                            obj.nickname  = token.nickname;
                            obj.headimgurl  = token.headimgurl;
                            obj.sex = token.sex;
                            obj.province =token.province;
                            $.setStorage("wx",obj);
                            if(!com_obj.isgetwx){
                                $.GetWXUserInfo();
                            }
                        }else{
                            var Request = new Object();
                            Request = $.GetRequest();
                            var code = Request["code"];
                            if(code && code!=""){
                                //alert("code获取成功");
                                //通过code换取网页授权access_token
                                $.GetAccessToken();
                            }else{
                                $.GetWXCode();
                            }
                        }
                    }else{
                        var Request = new Object();
                        Request = $.GetRequest();
                        var code = Request["code"];
                        if(code && code!=""){
                            //alert("code获取成功");
                            //通过code换取网页授权access_token
                            $.GetAccessToken();
                        }else{
                            $.GetWXCode();
                        }
                    }
                }
            });
        }else{
            //token不存在 重新获取code
            $.GetWXCode();
        }
    },
    /*
     * ph 通过网页授权access_token和openid获取用户基本信息
     */
    GetWXUserInfo:function(){
        var token = JSON.parse(window.localStorage.getItem('wx'));
        if(token){
            $.ajaxHandler({
                model:function () {
                    var obj ={};
                    obj.nickName = token.nickname;
                    obj.sex = token.sex;
                    obj.undefinedId = token.openid;
                    obj.urlHeader = token.headimgurl;
                    return obj;
                },
                visible:"hide",
                visibleTime:0,
                dataType:"json",
                api:"yg_platform/undefinedUser/getUndefinedUserByUndefinedId",
                success:function (result) {
                    //console.log(result);
                    if(result.code==10000){
                        var data = result.data;
                        var userD  = data.userInfo;
                        var _obj  ={};
                        _obj.nickName  = data.nickName;
                        _obj.roleId  = data.roleId;
                        if(data.picture.toString().indexOf('http')>-1){
                            _obj.picture  = data.picture;
                        }else{
                            _obj.picture  = $.imgApi()+''+data.picture;
                        }
                        _obj.userName  = data.userName;
                        _obj.userId  = userD.userId;
                        _obj.persionId  =userD.persionId;
                        _obj.recommendFrom  =data.recommendFrom;
                        _obj.money  = data.money;
                        _obj.sex  = userD.sex;
                        _obj.token = data.token;
                        $.setStorage("uData",_obj);
                    }else{
                        $.toast('获取用户异常');
                    }
                }
            });
        }else{
            //access_token 不存在
        }

    }

});
/** 对象级别插件 **/
(function($){
    $.fn.extend({
        upScroll:function(options){
            var defaults = {
                speed:1000  //滚动速度
            };
            defaults.speed =  options.speed ||defaults.speed;
            setInterval('autoScroll(""+$(this)+"")',defaults.speed);
        }
    });
})(jQuery);

/*public 函数*/

// ----------------------------------
// 减运算，避免数据相除小数点后产生多位数和计算精度损失。
// ---------------------------------
function subtractNumber(arg1,arg2){
    return (arg1*1000-arg2*1000)/1000;//防止丢失精度
}
// ----------------------------------
// 乘运算，避免数据相除小数点后产生多位数和计算精度损失。
// ---------------------------------
function SubNumber(arg1,arg2){
    return (arg1*1000)*(arg2*1000)/1000000;//防止丢失精度
}
// ----------------------------------
// 相加运算，避免数据相除小数点后产生多位数和计算精度损失。
// ---------------------------------
function andNumber(arg1,arg2){
    return ((arg1*1000)+(arg2*1000))/1000;//防止丢失精度
}
// ----------------------------------
// 除，避免数据相除小数点后产生多位数和计算精度损失。
// ---------------------------------
function divideNumber(arg1,arg2){
    return ((arg1*1000)/(arg2*1000));//防止丢失精度
}
// ----------------------------------
// 函数：取当前日期(若有参数n，则推后或者提前几天)
// ----------------------------------
function getCurrentDay(n, basicDate) {
    var today = basicDate || new Date();
    if (n) {
        today = new Date(today.valueOf() + n * 24 * 60 * 60 * 1000);
    }
    var day = today.getDate();

    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    if (month < 10) {
        var strMonth = "0" + month;
    }
    else {
        strMonth = month;
    }
    if (day < 10) {
        var strDay = "0" + day;
    } else {
        strDay = day;
    }
    var date = year + "-" + strMonth + "-" + strDay;

    return date;
}

// ----------------------------------
// 函数：取当前月份(若有参数n，则推后或者提前几月)
// ----------------------------------
function getCurrentMonth(n) {
    var today = new Date();
    if (!n) n = 0;
    var month = today.getMonth() + 1 + n;
    var year = today.getFullYear();
    if (month < 10) {
        var strMonth = "0" + month;
    }
    else {
        strMonth = month;
    }
    var date = year + "-" + strMonth;

    return date;
}

//--------------------------------------------
//函数：获得当前的日期和时间（格式：2009-06-12 12:09:06）
//-------------------------------------------------
function CurentTime() {
    var now = new Date();

    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ms = now.getSeconds();     //秒
    var clock = year + "-";

    if (month < 10)
        clock += "0";

    clock += month + "-";

    if (day < 10)
        clock += "0";

    clock += day + " ";

    if (hh < 10) { clock += "0"; }
    clock += hh + ":";
    if (mm < 10) { clock += '0'; }
    clock += mm + ":";
    if (ms < 10) { clock += '0'; }
    clock += ms;
    return (clock);
}
// ----------------------------------
// 金额格式化函数：s:金额 n:保留几位小数
// ----------------------------------
function fmoney(s, n) {
    n = n >= 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    //是否是负数
    var prestr = '';
    if (s.substring(0, 1) == "-") {
        s = s.substring(1, s.length);
        prestr = '-';
    }
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }

    if (n == 0)
        return prestr + t.split("").reverse().join("");
    else
        return prestr + t.split("").reverse().join("") + "." + r;
}
// ----------------------------------
// 还原格式化金额
// ----------------------------------
function rmoney(s) {
    return parseFloat(s.replace(/[^\d\.-]/g, ""));
}
// ----------------------------------
// 根据指定日期计算与指定日期的天数
// ---------------------------------
function diffDays(s1){
    s1 = s1.replace(/-/g, "/");
    s1 = new Date(s1);
    s2 = new Date();
    var days= s1.getTime() - s2.getTime();
    var times = parseInt(Math.abs(days / (1000 * 60 * 60 * 24)));
    return times;
}

// ----------------------------------
// 微信网页授权  OAuth2.0
// ---------------------------------
function wxAccredit(){
    if(window.localStorage.getItem('wx')){
        //校验token是否有效
        $.VerifyAccessToken();
    }else{
        var Request = new Object();
        Request = $.GetRequest();
        var code = Request["code"];
        if(code && code!=""){
            //alert("code获取成功");
            //通过code换取网页授权access_token
            $.GetAccessToken();
        }else{
            $.GetWXCode();
        }
    }
    //
    if($.getStorage("uData")){
        //用户存在
        userId = JSON.parse($.getStorage("uData")).userId;
    }
}

var apiURL = "http://test.farmercloude.com/api/index.php";//农耕云接口地址
// apiURL = "http://www.farmercloude.com/api/index.php";//接口地址
var SECURITY='security'; //接口访问密钥
var PAGE_NUM=10; //列表页每页加载条数
var PAGE=1;//默认第一页
var sign = 1;
var passengers = [1,2,3,4,5,6,7,8,9,10];//乘客人数
// var userid_array = ['1'];
// var userid = userid_array[Math.floor((Math.random()*userid_array.length))]; 


//将对象按照属性名升序排列，并返回新对象
function objKeySort(obj) {//排序的函数
    var newkey = Object.keys(obj).sort();
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newObj = {};//创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
//        if(!$.isArray(obj[newkey[i]])){
            newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
//        }
    }
    return newObj;//返回排好序的新对象
}

//将对象的属性值拼接成字符串
function objChangeStr(obj){
    var newkey = Object.keys(obj).sort();
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var str = '';
    for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
        str += obj[newkey[i]];
    }
    return str;//返回拼接后的字符串
}
//时间戳　(秒)　转化为本地时间　type 1:Y-m-d 2:Y-m-d H:i 3.M月D日 H:i
function getLocalTime(nS,type) {     
      // return new Date(parseInt(nS) * 1000).toLocaleDateString().replace(/:\d{1,2}$/,' ');    
        nS=parseInt(nS)* 1000;

       var date = new Date(nS);
        Y = date.getFullYear();
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        D = date.getDate();
        h = date.getHours();
        m = date.getMinutes();
        s = date.getSeconds();
        if(h==0){
            h='00';
        }
        if(m==0){
            m='00';
        }
        if(s==0){
            s='00';
        }
        if(type==1){
            return Y+'-'+M+'-'+D;
        }
        if(type==2){
            return Y+'-'+M+'-'+D+' '+h+':'+m; 
        }
        if(type==3){
            return M+'月'+D+'日'+' '+h+':'+m;
        }
        if(type==4){
            return M+'/'+D;
        }
        if(!type){
            return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s; 
        }
    } 

//获取短信验证码
function getMsgVerify(phone,type){//0不检查，1检查注册，2检查未注册，3检查第三方账号是否可以绑定
    var cmd = 'getCode';//接口命令
    var ts = parseInt(new Date().getTime()/1000);//当前时间戳
    var jsonp=1; //活动列表传过来的
    var params = {
            'phone' : phone,
            // 'debug':1, //测试状态
            'type':type,
            };
    params = objKeySort(params);//按照属性名升序排列
    var params_str = objChangeStr(params);//拼接params参数的属性值
    params.verify = $.md5(cmd+ts+params_str+SECURITY);//生成验证码

    $.ajax({
        type: "POST",
        url: apiURL,//接口地址
        data: {'cmd':cmd,'ts':ts,'params':params,'jsonp':jsonp},
        dataType: "jsonp",
        success: function(data){
//            console.info(data);
            var message=data['resultMessage'];
            layer.msg(message);
            if(data['resultCode']==1){
                if(sign==0){
                    demo();
                }
            }else{

            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
             console.info(XMLHttpRequest.status);
             console.info(XMLHttpRequest.readyState);
             console.info(textStatus);
        },
    });
}
function demo(){
    var oBtn=document.querySelector(".reg_code");
			jsq=setInterval(function(){
				
			time--;
			if(time<0){
				clearInterval(jsq);
				jsq=null;
				time=60;
				oBtn.innerHTML="获取验证码";
			}else{
				oBtn.innerHTML=time;
			}
		},1000);
	}

//***************************通用收藏接口****************************
function mark(params){     // type:1农机；2农活；3零活；4商品；5圈子；6零工；7二手
    var cmd = 'Mark';//接口命令
    var ts = parseInt(new Date().getTime()/1000);//当前时间戳
    var jsonp=1; //活动列表传过来的
    params = objKeySort(params);//按照属性名升序排列
    var params_str = objChangeStr(params);//拼接params参数的属性值
    params.verify = $.md5(cmd+ts+params_str+SECURITY);//生成验证码

    $.ajax({
        type: "POST",
        url: apiURL,//接口地址
        data: {'cmd':cmd,'ts':ts,'params':params,'jsonp':jsonp},
        dataType: "jsonp",
        success: function(data){
            var message=data['resultMessage'];
            layer.msg('收藏成功');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
             console.info(XMLHttpRequest.status);
             console.info(XMLHttpRequest.readyState);
             console.info(textStatus);
        },
    });
}

//**************************通用取消收藏接口********************
function UnMark(params){     // type:1农机；2农活；3零活；4商品；5圈子；6零工；7二手
    var cmd = 'UnMark';//接口命令
    var ts = parseInt(new Date().getTime()/1000);//当前时间戳
    var jsonp=1; //活动列表传过来的
    params = objKeySort(params);//按照属性名升序排列
    var params_str = objChangeStr(params);//拼接params参数的属性值
    params.verify = $.md5(cmd+ts+params_str+SECURITY);//生成验证码

    $.ajax({
        type: "POST",
        url: apiURL,//接口地址
        data: {'cmd':cmd,'ts':ts,'params':params,'jsonp':jsonp},
        dataType: "jsonp",
        success: function(data){
            var message=data['resultMessage'];
            layer.msg('成功取消收藏');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
             console.info(XMLHttpRequest.status);
             console.info(XMLHttpRequest.readyState);
             console.info(textStatus);
        },
    });
}

//*****************************评论星标展示***********************
function showStar(num){
    if(isNaN(num)){num=0;}
    var num = num*1;
    var comment_star = '';
    var comment_no = '';
    var little_star = '';
    if(num-parseInt(num)!=0){
        little_star = '<span class="fl star-a star little-star"></span>';
    }
    for(i=1;i<=num;i++){
        comment_star += '<span class="fl star-a star"></span>';
    }
    for(j=num+1;j<=5;j++){
        comment_no += '<span class="fl star-a"></span>';
    }
    comment_star += little_star+comment_no;
    return comment_star;
}

//*********************************通用留言接口***********************************
    function msgRelease(params){
        var cmd = 'msgRelease';//通用留言接口命令
        var ts = parseInt(new Date().getTime()/1000);//当前时间戳
        var jsonp = 1;
        params = objKeySort(params);//按照属性名升序排列
        var params_str = objChangeStr(params);//拼接params参数的属性值
        params.verify = $.md5(cmd+ts+params_str+'security');//生成验证码           
        $.ajax({
            url : apiURL,//接口地址
             data : {'cmd':cmd, 'ts':ts, 'params':params, 'jsonp':jsonp},
            dataType : 'jsonp',
            success: function(data){
                if(data['resultCode']==1){
                    layer.msg("留言成功!");
                }else{
                    layer.msg("留言失败，系统出错!");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                layer.msg('网络请求延迟！');
                console.info(XMLHttpRequest.status);
                console.info(XMLHttpRequest.readyState);
                console.info(textStatus);
            },
        });
    }

  //*********************************通用忽略未读消息接口***********************************
    function ignoreMessage(params){
        var cmd = 'ignoreMessage';//通用忽略未读消息接口命令
        var ts = parseInt(new Date().getTime()/1000);//当前时间戳
        var jsonp = 1;
        params = objKeySort(params);//按照属性名升序排列
        var params_str = objChangeStr(params);//拼接params参数的属性值
        params.verify = $.md5(cmd+ts+params_str+'security');//生成验证码           
        $.ajax({
            url : apiURL,//接口地址
             data : {'cmd':cmd, 'ts':ts, 'params':params, 'jsonp':jsonp},
            dataType : 'jsonp',
            success: function(data){
                if(data['resultCode']==1){
                    layer.msg("已忽略未读消息!");
             		setTimeout(function(){
             			window.location.reload();
	    			},1000);  
                }else{
                    layer.msg("忽略未读消息失败，系统出错!");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                layer.msg('网络请求延迟！');
                console.info(XMLHttpRequest.status);
                console.info(XMLHttpRequest.readyState);
                console.info(textStatus);
            },
        });
    }
    
/************************************地图关闭信息窗体***********************************/
    function closeInfoWindow(map) {
        map.clearInfoWindow();
    }

    /***************************判断用户是否登录*******************************************/
    function judgeIsLogin(){
        if(!isNull($.getStorage('userid'))){
        // if(!isNull(userid)){
            gotoLogin();
            return false;
        }else{
            return true;
        }
    }

    $(document).on('click','.self',function(){
            layer.msg("自己的发布不可以自己预定哦！");
    })
	/**
	 * 处理app返回的图片地址
	 */
	function handleAppValue(value){
		var images_arr = value.split(',');
		var images_arr_new = [];
		for(var i in images_arr){
			if(images_arr[i] != ''){
				images_arr_new.push(images_arr[i]);
			}
		}
		return images_arr_new;//返回图片地址数组
	}

    /***************************时间样式处理****************************************/
    function timeStyle(timeString){
        var time = timeString.replace(/\/,[\u4e00-\u9fa5]/g,"-");
        return time;//返回图片地址数组
    }

    /*************************高德地图地理编码*************************************
    *str:地区字符串   num:地图缩放级别
    */
    function geocoder(str,num) {
        var geocoder = new AMap.Geocoder({

        });
        //地理编码,返回地理编码结果
        geocoder.getLocation(str, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                geocoder_CallBack(result,num);
            }
        });
    }
    function addMarker(i, d) {
        var marker = new AMap.Marker({
            map: map,
            position: [ d.location.getLng(),  d.location.getLat()]
        });
        var infoWindow = new AMap.InfoWindow({
            content: d.formattedAddress,
            offset: {x: 0, y: -30}
        });
        marker.on("mouseover", function(e) {
            infoWindow.open(map, marker.getPosition());
        });
    }
    //地理编码返回结果展示
    function geocoder_CallBack(data,num) {
        //地理编码结果数组
        var geocode = data.geocodes;
        var lng = geocode[0].location.getLng();
        var lat = geocode[0].location.getLat();
        $('.lng').val(lng);
        $('.lat').val(lat);
        if($('#container').length>0){
            $('.lng_val').val(lng);
            $('.lat_val').val(lat);
            switch(parseInt(num)){
                case 8:map.setZoomAndCenter(num, [lng, lat]);break;
                case 10:map.setZoomAndCenter(num, [lng, lat]);break;
                case 12:map.setZoomAndCenter(num, [lng, lat]);break;
                case 14:map.setZoomAndCenter(num, [lng, lat]);break;
                case 16:map.setZoomAndCenter(num, [lng, lat]);break;
                case 4:map.setZoomAndCenter(num, [lng, lat]);break;
                default:break;
            }
            
        }
    }
    /*************************高德地图地理编码******/
    //  function regeocoder(lnglatXY) {  //逆地理编码
    //     var geocoder = new AMap.Geocoder({ 

    //     });        
    //     geocoder.getAddress(lnglatXY, function(status, result) {
    //         if (status === 'complete' && result.info === 'OK') {
    //             geocoder_CallBack(result);
    //         }
    //     });  
    // }
    // function geocoder_CallBack(data) {
    //     var address = data.regeocode.formattedAddress; //返回地址描述
    //     $('.myLocation').val(address);
    // }
    /*************************end 高德地图地理编码**************************************/
    /*********************忽略单条未读消息****************************/
function readMessage(params){
    var cmd = 'readMessage';//通用忽略未读消息接口命令
    var ts = parseInt(new Date().getTime()/1000);//当前时间戳
    var jsonp = 1;
    params = objKeySort(params);//按照属性名升序排列
    var params_str = objChangeStr(params);//拼接params参数的属性值
    params.verify = $.md5(cmd+ts+params_str+'security');//生成验证码           
    $.ajax({
        url : apiURL,//接口地址
         data : {'cmd':cmd, 'ts':ts, 'params':params, 'jsonp':jsonp},
        dataType : 'jsonp',
        success: function(data){
            console.info(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.msg('网络请求延迟！');
            console.info(XMLHttpRequest.status);
            console.info(XMLHttpRequest.readyState);
            console.info(textStatus);
        },
    });
}
/*********************获取区域位置相关信息****************************************/
function mapZoom(type){
        var address = '';
    if(!isNull(type)){
        var sf_name = $('.sf option:selected').text();
        var cs_name = $('.cs option:selected').text();
        var qx_name = $('.qx option:selected').text();
        var xz_name = $('.xz option:selected').text();
        var cz_name = $('.cz option:selected').text();
        var sf = $('.sf option:selected').attr('areaID');
        var cs = $('.cs option:selected').attr('areaID');
        var qx = $('.qx option:selected').attr('areaID');
        var xz = $('.xz option:selected').attr('areaID');
        var cz = $('.cz option:selected').attr('areaID');
    }else{
        var sf_name = $('.sf1 option:selected').text();
        var cs_name = $('.cs1 option:selected').text();
        var qx_name = $('.qx1 option:selected').text();
        var xz_name = $('.xz1 option:selected').text();
        var cz_name = $('.cz1 option:selected').text();
        var sf = $('.sf1 option:selected').attr('areaID');
        var cs = $('.cs1 option:selected').attr('areaID');
        var qx = $('.qx1 option:selected').attr('areaID');
        var xz = $('.xz1 option:selected').attr('areaID');
        var cz = $('.cz1 option:selected').attr('areaID');
    }
        if(sf==-1){
//            layer.msg('请选择省份');
            return false;
        }else{
            address += sf_name;
            if(cs==0){
                // layer.msg('请选择城市');
                var area_sort = sf;
                var zoom_class = 8;
                // return false;
            }else{
                address += cs_name;
                if(qx==0){
                    // layer.msg('请选择区县');
                    var area_sort = cs;
                    var zoom_class = 10;
                    // return false;
                }else{
                    address += qx_name;
                    if(xz==0){
                        // layer.msg('请选择乡镇');
                        var area_sort = qx;
                        var zoom_class = 12;
                        // return false;
                    }else{
                        address += xz_name;
                        if(cz==0){
                            // layer.msg('请选择村庄');
                            var area_sort = xz;
                            var zoom_class = 14;
                            // return false;
                        }else{
                            var area_sort = cz;
                            address += cz_name;
                            var zoom_class = 16;
                        }
                    }
                }
            }
            return map_need = [area_sort,address,zoom_class];
        }
    }
    /*********************添加点标****************************************/
    function addMaker(lng_lat){
        markers = [];
        $.each(lng_lat,function(i,marker){  //lng_lat
                    if(isNull(marker.lng)&&isNull(marker.lat)){
                        marker = new AMap.Marker({
                            map: map,
                            position: [marker.lng, marker.lat],
                            clickable:true,
                        });
                        markers.push(marker);
                    }
                }); 
        $.each(markers,function(i){
                    markers[i].on('click', function(e){
                        if($('.voice').length>0){
                        closeInfoWindow(map);
                        $('.synthesis-cont').remove();
                    }     
                        var message = openInfo(i);
                        infoWindow = new AMap.InfoWindow({
                            content: message[0],  //使用默认信息窗体框样式，显示信息内容
                            isCustom:true,  //使用自定义窗体
                        });
                        infoWindow.open(map, map.getCenter());
                        // readText(message[1]);
                    })
                });     
    }
    
    $(document).on('touchend','#container',function(){
        if($('.voice').length>0){
            closeInfoWindow(map);
            $('.synthesis-cont').remove();
        }       
    })
