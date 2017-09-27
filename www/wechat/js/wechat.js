var jsArray = {};
//全局变量
var userInfo = {};
var loadScript = function(scriptName, callback, reload, islocalfile) {
    if (typeof scriptName == 'undefined') {
        throw new Error('load script file is undefined');
    }
    if (typeof reload == 'undefined') {
        reload = true;
    }
    if (!jsArray[scriptName] || reload == true) {
        jsArray[scriptName] = true;
        var body = document.getElementsByTagName('body')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        var strName = scriptName;
        var privateUrl = /^http.+$/;
        if(privateUrl.test(strName) || islocalfile === true) {
            script.src = scriptName;
        } else {
            script.src = scriptName;
        }
        script.onload = callback;
        body.appendChild(script);

    } else if (callback) {
        callback();
    }

};


var loadFile = function(file, type){
    if(type == 'css'){
        document.write('<link'+' rel="stylesheet" type="text/css" media="screen" href="'+file+'">');
    }else{
        document.write('<script src="'+file+'"></script>');
    }
};
//加载插件
var jsPlugins = [
    '/jquery_weui/js/jquery-weui.js',
    '/wechat/js/menuConfig.js'
];
$.each(jsPlugins, function(i, script){
    loadFile(script, 'javascript');
});

//加载样式文件
var cssArray = [
    '/jquery_weui/lib/weui.min.css',
    '/jquery_weui/css/jquery-weui.css',
];
$.each(cssArray, function(i, css){
    loadFile(css, 'css');
});

//扩展jquery
jQuery.cookie = function(name, value, options)
{
    if (typeof value != 'undefined')
    { // name and value given, set cookie
        options = options || {};
        if (value === null)
        {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString))
        {
            var date;
            if (typeof options.expires == 'number')
            {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            }
            else
            {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    }
    else
    { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '')
        {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++)
            {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '='))
                {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

$.extend({
    sendData:function(mod, method, param, weChatType,callback){
        if(weChatType ==''){
            weChatType = 'shipment';
        }
        var url = window.location.origin+'/wechat.php?method='+weChatType+'.'+mod+'.'+method;
        $.ajax({
            type:"POST",
            url:url,
            data:param,
            dataType:"json",
            beforeSend:function(){
            },
            success:function(json){
                if(typeof json === "string"){
                    if(json.length < 1){
                        $.error('json无效，数据为空');
                        return;
                    }
                    try{
                        result = eval('('+json+')');
                    }catch(e){
                        if(typeof console.log != 'undefined')
                        $.error('服务器返回数据无法解析');
                        return false;
                    }
                }else{
                    result = json;
                }
                if(result != null && result.code != 0){
                    $.error(result.code+':'+result.message);
                    result = false;
                }else{
                    if(callback)
                        callback(result.data);
                }
            }
        });
    },

    getUrlParams: function(purl,isNoToLower){
        isNoToLower = isNoToLower || false;
        var url = purl || window.location.href;
        var paraObj = {};
        if (url.indexOf("?") < 0) {
            return paraObj;
        }
        url = url.replace('#', '');
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        if (!isNoToLower) {
            for (var i = 0; j = paraString[i]; i++) {
                paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
            }
        } else {
            for (var i = 0; j = paraString[i]; i++) {
                try {
                    paraObj[j.substring(0, j.indexOf("="))] = decodeURIComponent(j.substring(j.indexOf("=") + 1, j.length));
                } catch (ex) {
                    paraObj[j.substring(0, j.indexOf("="))] = unescape(j.substring(j.indexOf("=") + 1, j.length));
                }
            }
        }
        return paraObj;
    },

    /**
     * 失败信息提示
     */
    error: function(_content) {
        $.toptip(_content, 'error');
    },

    /**
     * 成功信息提示
     */
    success: function(_content){
        $.toptip(_content, 'success');
    },

    /**
     * 消息提示
     */
    warning: function(_content){
        $.toptip(_content, 'warning');
    },
    getUserInfo:function(type,buildMenu,callback,from){
        if(userInfo.openid != '' && userInfo.openid != undefined){
            if(callback) {
                callback();
            }
            return false;
        }
        var params = $.getUrlParams(window.location.search);
        type = (params.wechattype != undefined && params.wechattype !='') ? params.wechattype : type;
        if(params.code != undefined && params.code != ''){//此处的code是微信auth2授权回调的code，用户获取用户openid
            $.sendData('user','getUserInfoByCode',{code:params.code},type,function(data){
                userInfo = data;
                //将openid 写入cookie
                if(data.openid != null && data.openid != undefined && data.openid != ''){
                    $.cookie('openId',data.openid);
                    if(data.phone != '' && data.phone != undefined){

                    }else{
                        if(from != 'login') {
                            window.location = window.location.origin + '/wechat/login.html?weChatType=' + type + '&openid=' + data.openid;
                        }
                    }
                    if(callback)
                        callback();
                }else{
                    var openidCookie = $.cookie('openId');
                    var openid = '';
                    if(params.openid != undefined && params.openid != ''){
                        openid = params.openid;
                    }else if(openidCookie != null && openidCookie != undefined && openidCookie != ''){
                        openid = openidCookie;
                    }
                    if(openid != '' && openid != null && openid != undefined){
                        userInfo.openid = params.openid;
                        $.sendData('user','getUserInfoByOpenid',{openid:openid},type,function(data){
                            userInfo = data;
                            //将openid 写入cookie
                            if(data.openid != null && data.openid != undefined){
                                $.cookie('openId',data.openid);
                            }
                            if(data.phone != '' && data.phone != undefined){

                            }else{
                                if(from != 'login') {
                                    window.location = window.location.origin + '/wechat/login.html?weChatType=' + type + '&openid=' + data.openid;
                                }
                            }
                            if(callback)
                                callback();
                        });
                    }else{
                        $.error('无法取得用户信息');
                        return false;
                    }
                }
            });
        }else{
            var openidCookie = $.cookie('openId');
            var openid = '';
            if(params.openid != undefined && params.openid != ''){
                openid = params.openid;
            }else if(openidCookie != null && openidCookie != undefined && openidCookie != ''){
                openid = openidCookie;
            }
            if(openid != '' && openid != null && openid != undefined){
                userInfo.openid = params.openid;
                $.sendData('user','getUserInfoByOpenid',{openid:openid},type,function(data){
                    userInfo = data;
                    //将openid 写入cookie
                    if(data.openid != null && data.openid != undefined){
                        $.cookie('openId',data.openid);
                    }
                    if(data.phone != '' && data.phone != undefined){

                    }else{
                        if(from != 'login') {
                            window.location = window.location.origin + '/wechat/login.html?weChatType=' + type + '&openid=' + data.openid;
                        }
                    }
                    if(callback)
                        callback();
                });
            }else{
                $.error('无法取得用户信息');
                return false;
            }
        }

    }

});

/**
 * 是否在微信中打开
 * @returns {boolean}
 */
function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
//初始化footer;
function buildFooter(){
    //lvison update at 2016-10-24-取消所有地方菜单生成
    /*var menu = [];
    var roleMenu = roleMenus[parseInt(userInfo.user_type)];
    for(var index in roleMenu){
        menu.push(menuList[roleMenu[index]]);
    }
    var footerHtml = '<div class="weui_tabbar">';
    for (var i in menu){
        footerHtml += '<a href="'+menu[i].url+'?openid='+userInfo.openid+'" class="weui_tabbar_item weui_bar_item_on">'
            +'<div class="weui_tabbar_icon">'
            +'<img src="'+menu[i].image+'" alt="">'
            +'</div>'
            +'<p class="weui_tabbar_label">'+menu[i].title+'</p>'
            +'</a>'
    }
    footerHtml +='</div>';
    $('body').append(footerHtml);*/
}