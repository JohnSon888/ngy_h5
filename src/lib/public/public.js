var date= new Date();
date.setTime(date.getTime()+1*60*60*1000);//cookie有效时间为1小时
function setCookies(name,value,time){
	$.cookie(name,value, { expires: date }); //创建一个cookie并设置有效时间为expiresDate:
}

//判断时间
function showTime(sts,ets){ //sts:开始时间  ets:结束时间
    var tt = new Array();
    var ts = parseInt(new Date().getTime()/1000);//当前时间戳
    if(sts!=''&&sts>ts) {disTime = parseInt(sts)-ts;}
    else {disTime = parseInt(ets)-ts;}
    var d = (parseInt(disTime/(24*3600))<10&&parseInt(disTime/(24*3600))>=0)?("0"+parseInt(disTime/(24*3600))):parseInt(disTime/(24*3600));//
    var h = (parseInt((disTime-d*24*3600)/(3600))<10&&parseInt((disTime-d*24*3600)/(3600))>=0)?("0"+parseInt((disTime-d*24*3600)/(3600))):parseInt((disTime-d*24*3600)/(3600));//
    var m = (parseInt((disTime-d*24*3600-h*3600)/60)<10&&parseInt((disTime-d*24*3600-h*3600)/60)>=0)?("0"+parseInt((disTime-d*24*3600-h*3600)/60)):parseInt((disTime-d*24*3600-h*3600)/60);
    var s = (parseInt((disTime-d*24*3600-h*3600-m*60))<10&&parseInt((disTime-d*24*3600-h*3600-m*60))>=0)?("0"+parseInt((disTime-d*24*3600-h*3600-m*60))):parseInt((disTime-d*24*3600-h*3600-m*60));
    return tt = {d:d,h:h,m:m,s:s};
}

//判断对象不为null
function isNull(data){ 
	return (data == "" || data == 'undefined' || data == 'null') ? false : data; 
}

//时间戳转化为本地时间　type 1:Y-m-d 2:Y-m-d H:i 3.M月D日 H:i 4 M/D 5. Y.M.D
function toLocalTime(nS,type) {     
	  // return new Date(parseInt(nS) * 1000).toLocaleDateString().replace(/:\d{1,2}$/,' ');    
	   	var date = new Date(parseInt(nS)*1000);
		Y = date.getFullYear();
		M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
		D = date.getDate()<10?'0'+date.getDate():date.getDate();
		h = date.getHours()<10?'0'+date.getHours():date.getHours();
		m = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
		s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
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
        if(type==5){
            return Y+'.'+M+'.'+D;
        }if(type==6){
            return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s; 
        }
        if(type==7){
            return Y+M+D; 
        }
        if(type==8){
            return Y+'-'+M+'-'+D+'T'+h+':'+m; 
	}
	}


//拆分url得到'='後面的參數,获取传递的参数
function GetQueryParam(str){
    var LocString=String(window.document.location.href);
    var rs=new RegExp("(^|)"+str+"=([^&]*)(&|$)","gi").exec(LocString),tmp;
    if(tmp=rs)return decodeURI(tmp[2]);
    return "undefined";
}

//手机号码中间用星号代替
	function phone_replace(phone){
		if(!isNull(phone)){
			var lphone = '还没绑定手机哦！';
		}else{
			var myphone=phone.substr(3,4);//在字符串中抽取从start下标开始的指定数目的字符
	  		var lphone=phone.replace(myphone,"****");
		}
	  	return lphone;
	}

/*获得地址栏参数　
 * 地址格式如：abc.html?id=12&order_id=34
 * 调用方法如：GetQueryString("id");则返回12
 * */
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

//将金额已小数点为界限拆分，如33.66 拆分为 33  66
function takeApartPrice(number){
	if(typeof(number)=="number"){
		price = parseFloat(number).toFixed(2);
    	price_int=price.split(".");//活动价格33.6.分解为33  6
    	return price_int;
	}
	
}

//日期字符串转换成时间戳
function get_unix_time(dateStr)//dateStr格式为“2014-05-08 00:22:11 ”
{
    var newstr = dateStr.replace(/-/g,'/'); 
    var date =  new Date(newstr); 
    var time_str = date.getTime().toString();
    return time_str.substr(0, 10);
}

//把当前时间戳转化为格林威治时间
function getGMT(){
	var dt = new Date;
	var tt = dt.setMinutes( dt.getMinutes() + dt.getTimezoneOffset() ); // 当前时间(分钟) + 时区偏移(分钟)
	var gmt = parseInt(tt/1000);
	return gmt;
	// console.log( "格林尼治时间戳: ", dt.getTime() );
	// console.log( "用本地时间格式显示: ", dt.toLocaleString() );
}

//获取当前时间戳
function getTIME(){
	var ts = parseInt(new Date().getTime()/1000);//当前时间戳
	return ts;
}

//文档高度
	function getDocumentTop() {
	    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
	    if (document.body) {
	        bodyScrollTop = document.body.scrollTop;
	    }
	    if (document.documentElement) {
	        documentScrollTop = document.documentElement.scrollTop;
	    }
	    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;    return scrollTop;
	}
	//可视窗口高度
	function getWindowHeight() {
	    var windowHeight = 0;    
	    if (document.compatMode == "CSS1Compat") {
	        windowHeight = document.documentElement.clientHeight;
	    } else {
	        windowHeight = document.body.clientHeight;
	    }
	    return windowHeight;
	}
	//滚动条滚动高度
	function getScrollHeight() {
	    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
	    if (document.body) {
	        bodyScrollHeight = document.body.scrollHeight;
	    }
	    if (document.documentElement) {
	        documentScrollHeight = document.documentElement.scrollHeight;
	    }
	    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;    return scrollHeight;
	}
//正则判断是否是URL地址
	function checkUrl(url) {  
        var strReg = /^((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)$/ig;  
        if(!strReg.test(url)) {
            return false;  
        } else {  
            return true;  
        }  
    }  
function IsURL(str_url){        
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"         
                    + "?(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?" //ftp的user@        
                    + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184        
                    + "|" // 允许IP和DOMAIN（域名）        
                    + "([0-9a-zA-Z_!~*'()-]+\.)*" // 域名- www.        
                    + "([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]\." // 二级域名        
                    + "[a-zA-Z]{2,6})" // first level domain- .com or .museum        
                    + "(:[0-9]{1,4})?" // 端口- :80        
                    + "((/?)|"         
                    + "(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/?)$";        
    var re=new RegExp(strRegex);        
    return re.test(str_url);        
}    
//回车提交事件
    $(document).keyup(function(event){
        if(event.keyCode ==13){
          $(".search-icon").trigger("click");
        }
    });
   // 改变网址参数
    function changeUrlParam(params,value){
      //获取页面完整地址
        var url = window.location.href;
        var arr = url.split("?");
        url = arr[0]+'?'+params+'='+value;
        return url;
    }

   