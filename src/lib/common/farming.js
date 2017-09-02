var bridge;
//JsInteraction的通讯模块
var JsInteraction;

$(function(){
	//页面元素加载完成
	if (!JsInteraction) {
	    if(window.initReady){  
	    	initReady();
	    }
	}else {
		initWebViewJavascriptBridge();
	}
});
            

function initWebViewJavascriptBridge()
{
    setupWebViewJavascriptBridge(function(callbackBridge) {
    	bridge = callbackBridge;
	    if(window.initReady){  
			initReady();
	    }
    })
}

function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
}

function sendData2Objc(data, callback) {
    if (bridge) {
        bridge.callHandler('ObjcCallback', data, function(response) {
            callback(response);
        })
    }else {
    	initWebViewJavascriptBridge();
    }
}

//设置全局变量
function set(key,value) {
	if (JsInteraction) {
        JsInteraction.set(key, value);
	}else {
		var data = {'cmd':'set','key':key,'value':value};
		sendData2Objc(data, null);
	}
}
//获取全局变量
function get(key, callback) {
	if (JsInteraction) {
        var val = JsInteraction.get(key);
        callback(val);
	}else {
		var data = {'cmd':'get','key':key};
		sendData2Objc(data, callback);
	}
}
//获取用户登陆信息
function getUserInfo(callback){
	if (JsInteraction) {
        var val = JsInteraction.getUserInfo();
		var obj = eval(val);
        callback(obj);
	}else {
		var data = {'cmd':'getUserInfo'};
		sendData2Objc(data, callback);
	}
}
//获取用户设置的位置信息
function getLocationInfo(callback){
	if (JsInteraction) {
        var val = JsInteraction.getLocationInfo();
		// var obj = eval(val);
        callback(val);
	}else {
		var data = {'cmd':'getLocationInfo'};
		sendData2Objc(data, callback);
	}
}
//获取当前的的位置信息
function getCurrentLocationInfo(callback){
	if (JsInteraction) {
        var val = JsInteraction.getCurrentLocationInfo();
		// var obj = eval(val);
        callback(val);
	}else {
		var data = {'cmd':'getCurrentLocationInfo'};
		sendData2Objc(data, callback);
	}
}
//获取app版本
function getversion(callback){
	if (JsInteraction) {
        var val = JsInteraction.getversion();
        callback(val);
	}else {
		var data = {'cmd':'getversion'};
		sendData2Objc(data, callback);
	}
}

//打开分享
function share(shareImage, shareText, shareTitle, shareURL, isOrder, orderid){
	if (JsInteraction) {
        JsInteraction.share(shareImage, shareText, shareTitle, shareURL, isOrder, orderid);
	}else {
		var data = {'cmd':'share', 'shareImage':shareImage, 'shareText':shareText, 'shareTitle':shareTitle, 'shareURL':shareURL, 'isOrder':isOrder, 'orderid':orderid};
		sendData2Objc(data, null);
	}
}

//跳转登陆
function gotoLogin() {
	if (JsInteraction) {
        JsInteraction.gotoLogin();
	}else {
		var data = {'cmd':'gotoLogin'};
		sendData2Objc(data, null);
	}
}

//检查是否安装微信客户端
function isWechatInstall(callback)
{
	if (JsInteraction) {
        var val = JsInteraction.isWechatInstall();
        callback(val);
	}else {
		var data = {'cmd':'isWechatInstall'};
		sendData2Objc(data, callback);
	}
}

//检查是否安装支付宝客户端
function isAlipayInstall(callback)
{
	if (JsInteraction) {
        var val = JsInteraction.isAlipayInstall();
        callback(val);
	}else {
		var data = {'cmd':'isAlipayInstall'};
		sendData2Objc(data, callback);
	}
}

//使用外部浏览器打开页面
function openInSafari(url)
{
	if (JsInteraction) {
		JsInteraction.openInSafari(url);
	}else {
		var data = {'cmd':'openInSafari', 'url':url};
		sendData2Objc(data, null);
	}
}

//图片预览
function imagePreview(imageArray, index)
{
	if (JsInteraction) {
		JsInteraction.imagePreview(''+imageArray, index);
	}else {
		var data = {'cmd':'imagePreview', 'imageArray':imageArray, 'index':index};
		sendData2Objc(data, null);
	}
}

//图片上传
function uploadImage(imageCount)
{
	if (JsInteraction) {
		JsInteraction.uploadImage(imageCount);
	}else {
		var data = {'cmd':'uploadImage', 'imageCount':imageCount};
		sendData2Objc(data, null);
	}
}
//获得地址
function getAddress()
{
    if (JsInteraction) {
        JsInteraction.getAddress();
    }else {
        var data = {'cmd':'getAddress'};
        sendData2Objc(data, null);
    }
}

//获取一次当前经纬度
function requestMylocation()
{
	if (JsInteraction) {
		JsInteraction.requestMylocation();
	}else {
		var data = {'cmd':'requestMylocation'};
		sendData2Objc(data, null);
	}
}

//朗读文字
function readText(text)
{
	if (JsInteraction) {
		JsInteraction.readText(text);
	}else {
		var data = {'cmd':'readText', 'text':text};
		sendData2Objc(data, null);
	}
}

//返回农耕云原生页面
function backtoNative()
{
	if (JsInteraction) {
		JsInteraction.backtoNative();
	}else {
		var data = {'cmd':'backtoNative'};
		sendData2Objc(data, null);
	}
}

/*H5调动方法
 * url 需要打开的url
 */
function openH5(url)
{
	if (JsInteraction) {
		JsInteraction.openH5(url);
	}else {
		var data = {'cmd':'openH5','url':url};
		sendData2Objc(data, null);
	}
}
/*返回H5上一个页面
 * isReload  是否刷新,1:刷新；0：不刷新
 */
function backtoPrev(isReload)
{
	if (JsInteraction) {
		JsInteraction.backtoPrev(isReload);
	}else {
		var data = {'cmd':'backtoPrev','isReload':isReload};
		sendData2Objc(data, null);
	}
}
/*
 * 返回农耕云首页
 */
function toHome()
{
	if (JsInteraction) {
		JsInteraction.toHome();
	}else {
		var data = {'cmd':'toHome'};
		sendData2Objc(data, null);
	}
}
/*
 * 返回农耕云个人中心
 */
function toCenter()
{
	if (JsInteraction) {
		JsInteraction.toCenter();
	}else {
		var data = {'cmd':'toCenter'};
		sendData2Objc(data, null);
	}
}
/*
 * 获取设备ID（手机串号IMEI）
 */
function getIMEI(callback){
	if (JsInteraction) {
        var val = JsInteraction.getIMEI();
        callback(val);
	}else {
		var data = {'cmd':'getIMEI'};
		sendData2Objc(data, callback);
	}
}
/*
 * 获取手机型号
 */
function getPhoneModel(callback){
	if (JsInteraction) {
        var val = JsInteraction.getPhoneModel();
        callback(val);
	}else {
		var data = {'cmd':'getPhoneModel'};
		sendData2Objc(data, callback);
	}
}



