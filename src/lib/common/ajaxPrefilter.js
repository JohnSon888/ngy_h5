var pendingRequests = {};
// 所有ajax请求的通用前置filter
$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
    var key = generatePendingRequestKey(options);
    //请求是否已经存在
    if(!pendingRequests[key]){
    storePendingRequest(key,jqXHR);
    }else{
    //如果ajax请求已经存在，下一次相同的请求则取消，防止重复请求
    jqXHR.abort();
    //pendingRequests[key].abort(); // 放弃先触发的提交
    }
    //ajax请求完成时，从临时对象中清除请求对应的数据
    var complete = options.complete;
    options.complete = function(jqXHR, textStatus) {
        //延时1000毫秒删除请求信息，表示同Key值请求不能在此时间段内重复提交
        setTimeout(function(){
        delete pendingRequests[jqXHR.pendingRequestKey];
        },1000);
        if ($.isFunction(complete)) {
        complete.apply(this, arguments);
        }
    };
    //统一的错误处理
    var error = options.error;
    options.error = function(jqXHR, textStatus) {
        errorHandler(jqXHR, textStatus);
        if ($.isFunction(error)) {
        error.apply(this, arguments);
        }
    };
});
/**
* 当ajax请求发生错误时，统一进行拦截处理的方法
*/
function errorHandler(jqXHR, textStatus){
    switch (jqXHR.status){
    case(500):
    internalError(jqXHR);
    break;
    case(403):
    accessDenied(jqXHR);
    break;
    case(408):
    timeoutError(jqXHR);
    break;
    case(404):
    pageNotFound(jqXHR);
    break;
    default:
    //otherError(jqXHR, textStatus);
    }
}
function pageNotFound(jqXHR){
    Component.warningMessageBox({
        content:"请求访问的地址或内容不存在！"
    });
}
function accessDenied(jqXHR){
    Component.warningMessageBox({
        content:"你无权进行此操作或页面访问！"
    });
}
function internalError(jqXHR){
    Component.warningMessageBox({
        content:"服务器存在错误，未能正确处理你的请求！"
    });
}
function timeoutError(jqXHR){
    window.location.href=contextPath + "/j_spring_security_logout";
}
function otherError(jqXHR, textStatus){
    Component.warningMessageBox({
        content:"未知错误，错误代码：" + textStatus
    });
}
/**
* 将ajax请求存储到临时对象中，用于根据key判断请求是否已经存在
*/
function storePendingRequest(key, jqXHR){
    pendingRequests[key] = jqXHR;
    jqXHR.pendingRequestKey = key;
}
/**
* 根据ajax请求参数构建一个临时存储key,此处简单的使用url作为key，
* 不考虑为解决请求类型为get时相同路径引起的缓存问题，采用随机码构建URL的情况
*/
function generatePendingRequestKey(options){
    return options.url;
}