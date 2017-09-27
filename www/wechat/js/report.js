var isweixin = isWeixin();
/*if (isweixin){
    getUserInfo('shipment',1);
}
*/
//获取用户信息
var openid='';
$.getUserInfo('shipment',0,function(){
    openid = userInfo.openid;
    if(userInfo.user_type!=3){
        $('.container').hide();
        $.alert('用户信息错误');
        return false;
    }
    $('#openid').val(openid);
});


/*var urlParam = $.getUrlParams();
$('#openid').val(urlParam.openid);
$('#shipment_code').val(urlParam.shipment_code);*/
//获取时间
var mydate=new Date();
var y=mydate.getFullYear();
var m=mydate.getMonth();
var d=mydate.getDate();
var h=mydate.getHours();
var i=mydate.getMinutes();
var s=mydate.getSeconds();
var date= y+'-'+(m+1)+'-'+d+' '+h+':'+i+':'+s;
$('#time').val(date);

$('#tianqi').on('click', function () {
   $('#report_type').val(2);
   $('#tianqi').addClass('shijianbgcolor');
   $('#duche,#xiulu,#chache,#xiuche,#qita').removeClass('shijianbgcolor');
});
$('#duche').on('click', function () {
   $('#report_type').val(3);
   $('#duche').addClass('shijianbgcolor');
   $('#tianqi,#xiulu,#chache,#xiuche,#qita').removeClass('shijianbgcolor');
});

$('#xiulu').on('click', function () {
   $('#report_type').val(4);
   $('#xiulu').addClass('shijianbgcolor');
  $('#duche,#tianqi,#chache,#xiuche,#qita').removeClass('shijianbgcolor');
});

$('#chache').on('click', function () {
   $('#report_type').val(5);
   $('#chache').addClass('shijianbgcolor');
   $('#duche,#xiulu,#tianqi,#xiuche,#qita').removeClass('shijianbgcolor');
});

$('#xiuche').on('click', function () {
   $('#report_type').val(6);
   $('#xiuche').addClass('shijianbgcolor');
   $('#duche,#xiulu,#chache,#tianqi,#qita').removeClass('shijianbgcolor');
});
$('#qita').on('click', function () {
   $('#report_type').val(8);
   $('#qita').addClass('shijianbgcolor');
  $('#duche,#xiulu,#chache,#xiuche,#tianqi').removeClass('shijianbgcolor');
});

if (isweixin) {
    //获取微信js签名
    var url = window.location.href;
    $.sendData('wechat','getJsSignature',{url:url},'shipment',function(json){
        alert
        wx.config({
            debug: false,
            appId: json.appId,
            timestamp: json.timestamp,
            nonceStr: json.nonceStr,
            signature: json.signature,
            jsApiList: [
                'getLocation'
            ]
        });
        wx.ready(function(){
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度

                    $('#lng').val(longitude);
                    $('#lat').val(latitude);
                    $.sendData('api','getAddressByLngLat',{lng:longitude,lat:latitude},'shipment',function(data){
                        $('#address').val(data.address);
                    });
                }
            });
        });

    });
} else {
    //need support https
    navigator.geolocation.getCurrentPosition(function (position) {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;
        $('#lng').val(longitude);
        $('#lat').val(latitude);
        $.sendData('api','getAddressByLngLat',{lng:longitude,lat:latitude},'shipment',function(data){
            $('#address').val(data.address);
        });
    });
}

$(function(){
    $('#showTooltips').on('click', function(){
        $.showLoading('正在完成事件上报...');
        var data = $("#checkout").serialize();
        var image_count = $("#uploaderFiles").find("input[id=checkout-image]").length;
        var report_type=$('#report_type').val();
        if (image_count < 1) {
            $.hideLoading();
            $.alert('请完成事件拍照!');
        }else if(report_type==''){
            $.hideLoading();
            $.alert('请选择事件类型!');
        }else {
            $.sendData('shipment','saveEventReport', data,'',function(json){
                
                if(parseInt(json.code) == 0){
                    $.hideLoading();
                    $.alert(json.msg);
                }else if(parseInt(json.code) == 1){
                    $.hideLoading();
                    $.alert(json.msg);
                }else{
                    $.hideLoading();
                    $.alert(json.msg);
                }
                //$.openPopup('#full');

            });
        }
    });
});

function gotolist(){
    window.location.href = 'me.html?openid='+urlParam.openid;
}

/**
 * 上传签收纸单照片
 */
document.addEventListener('DOMContentLoaded', init, false);//初始化与onload的时间相似

function init() {
    var u = new UploadPic();
    u.init({
        input: document.querySelector('#checkout-order'),
        callback: function (base64) {
            var imagelen=$("#uploaderFiles").find("input[id=checkout-image]").length;
            if(imagelen>=3){
                $.alert('最大上传3张图片');
                $.hideLoading()
                return false;
            }
            $.sendData('order', 'checkoutimage', {file: base64, type: this.fileType,order_id:'122'}, '', function(json){//删除了这个键值对 order_id: urlParams.order_id
                if (json.error == 0) {
                    var html = '<li class="weui_uploader_file" style="background-image:url('+ json.filepath +')">';
                        html += '<input type="hidden" id="checkout-image" name="checkout-image[]" value="' + json.filepath + '"/>'
                        html += '<a href="javascript:;" onclick="delimg(this)" class="weui_progress_opr"><i class="weui_icon_cancel" style="padding: 0 0 0 40px"></i></a></li>';
                    $("#uploaderFiles").append(html);
                    $('#checkout-order').val('');
                } else {
                    $.alert(json.msg);
                }
                $.hideLoading()
            });
        },
        loading: function () {
            $.showLoading('正在上传照片...');
        }
    });
}

function delimg(obj)
{
    $.confirm("确定删除这张图片吗？", "删除图片", function() {
        $(obj).parent('li').remove();
    }, function() {
        //取消操作
    });
}

function UploadPic() {
    this.sw = 0;
    this.sh = 0;
    this.tw = 0;
    this.th = 0;
    this.scale = 0;
    this.maxWidth = 0;
    this.maxHeight = 0;
    this.maxSize = 0;
    this.fileSize = 0;
    this.fileDate = null;
    this.fileType = '';
    this.fileName = '';
    this.input = null;
    this.canvas = null;
    this.mime = {};
    this.type = '';
    this.callback = function () {};
    this.loading = function () {};
}

UploadPic.prototype.init = function (options) {
    this.maxWidth = options.maxWidth || 800;
    this.maxHeight = options.maxHeight || 600;
    this.maxSize = options.maxSize || 5 * 1024 * 1024;
    this.input = options.input;
    this.mime = {'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'bmp': 'image/bmp'};
    this.callback = options.callback || function () {};
    this.loading = options.loading || function () {};

    this._addEvent();
};

/**
 * @description 绑定事件
 * @param {Object} elm 元素
 * @param {Function} fn 绑定函数
 */
UploadPic.prototype._addEvent = function () {
    var _this = this;

    function tmpSelectFile(ev) {
        _this._handelSelectFile(ev);
    }

    this.input.addEventListener('change', tmpSelectFile, false);
};

/**
 * @description 绑定事件
 * @param {Object} elm 元素
 * @param {Function} fn 绑定函数
 */
UploadPic.prototype._handelSelectFile = function (ev) {
    var file = ev.target.files[0];

    this.type = file.type

    // 如果没有文件类型，则通过后缀名判断（解决微信及360浏览器无法获取图片类型问题）
    if (!this.type) {
        this.type = this.mime[file.name.match(/\.([^\.]+)$/i)[1]];
    }

    if (!/image.(png|jpg|jpeg|bmp)/.test(this.type)) {
        $.alert('选择的文件类型不是图片');
        $('#checkout-order').val('');
        return;
    }

    if (file.size > this.maxSize) {
        $.alert('选择文件大于' + this.maxSize / 1024 / 1024 + 'M，请重新选择');
        $('#checkout-order').val('');
        return;
    }

    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileType = this.type;
    this.fileDate = file.lastModifiedDate;

    this._readImage(file);
};

/**
 * @description 读取图片文件
 * @param {Object} image 图片文件
 */
UploadPic.prototype._readImage = function (file) {
    var _this = this;

    function tmpCreateImage(uri) {
        _this._createImage(uri);
    }

    this.loading();

    this._getURI(file, tmpCreateImage);
};

/**
 * @description 通过文件获得URI
 * @param {Object} file 文件
 * @param {Function} callback 回调函数，返回文件对应URI
 * return {Bool} 返回false
 */
UploadPic.prototype._getURI = function (file, callback) {
    var reader = new FileReader();
    var _this = this;

    function tmpLoad() {
        // 头不带图片格式，需填写格式
        var re = /^data:base64,/;
        var ret = this.result + '';

        if (re.test(ret)) ret = ret.replace(re, 'data:' + _this.mime[_this.fileType] + ';base64,');

        callback && callback(ret);
    }

    reader.onload = tmpLoad;

    reader.readAsDataURL(file);

    return false;
};

/**
 * @description 创建图片
 * @param {Object} image 图片文件
 */
UploadPic.prototype._createImage = function (uri) {
    var img = new Image();
    var _this = this;

    function tmpLoad() {
        _this._drawImage(this);
    }

    img.onload = tmpLoad;

    img.src = uri;
};

/**
 * @description 创建Canvas将图片画至其中，并获得压缩后的文件
 * @param {Object} img 图片文件
 * @param {Number} width 图片最大宽度
 * @param {Number} height 图片最大高度
 * @param {Function} callback 回调函数，参数为图片base64编码
 * return {Object} 返回压缩后的图片
 */
UploadPic.prototype._drawImage = function (img, callback) {
    this.sw = img.width;
    this.sh = img.height;
    this.tw = img.width;
    this.th = img.height;

    this.scale = (this.tw / this.th).toFixed(2);

    if (this.sw > this.maxWidth) {
        this.sw = this.maxWidth;
        this.sh = Math.round(this.sw / this.scale);
    }

    if (this.sh > this.maxHeight) {
        this.sh = this.maxHeight;
        this.sw = Math.round(this.sh * this.scale);
    }

    this.canvas = document.createElement('canvas');
    var ctx = this.canvas.getContext('2d');

    this.canvas.width = this.sw;
    this.canvas.height = this.sh;

    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.sw, this.sh);

    this.callback(this.canvas.toDataURL(this.type));

    ctx.clearRect(0, 0, this.tw, this.th);
    this.canvas.width = 0;
    this.canvas.height = 0;
    this.canvas = null;
};


