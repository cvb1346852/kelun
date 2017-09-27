var urlParams = $.getUrlParams(window.location.search);
var phone = urlParams.phone;
$("#phone").val(phone);
var isweixin = isWeixin();
var openid='';
if (isweixin){
    $.getUserInfo('consign',1,function(){
        openid = userInfo.openid;
        $('#openid').val(openid);
        if(userInfo.user_type!=1 && userInfo.user_type!=2 ){
            $.alert('用户信息错误');
            return false;
        }
    });
}else{
    if(phone){
        $.sendData('order','verifyPhoneOrorder',{phone:phone,order_id:urlParams.order_id},'shipment',function(data){
            //验证失败
            if(!data){
                $.alert("获取订单信息无效");
                $("#showTooltips").hide();
            }
        });
    }
}
var order_code = urlParams.order_code;
$("#order_code").html(order_code);
$("#order_id").val(urlParams.order_id);
/*var urlParams = $.getUrlParams(window.location.search);
 if (urlParams.order_id != undefined && urlParams.order_id != '') {
 $.sendData('order', 'detail', {order_id:urlParams.order_id}, 'shipment', function(json){
 if (json.code == 0) {
 var data = json.data;


 if (data.length > 0) {
 var html = '';
 $.each(data, function(i, item){
 order_code = item.order_code;
 });
 html += '<input class="hide" type="hide" name="order_id" value="' + urlParams.order_id + '" />';
 $('#submit').append(html);
 $('#submit').removeClass('hide');
 } else {
 $('#order_product_list').html('<div class="weui_cells_tips null-notice">暂无产品</div>');
 $('#submit').addClass('hide');
 }
 } else {
 $.alert(json.msg);
 }
 });
 }else {
 $.alert('订单id未找到!');
 history.go(-1);
 }*/
var latitude = null;
var longitude = null;
if (isweixin) {
    //获取微信js签名
    var url = window.location.href;
    $.sendData('wechat','getJsSignature',{url:url},'shipment',function(json){
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
                    latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
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
$(".my-rating-6").starRating({
    useFullStars: true,
    callback: function(currentRating, el){
        el.find("input").val(currentRating);
    }
});
$(function(){
    $('#showTooltips').on('click', function(){
        $.showLoading('正在完成签收...');
        var image_count = $("#order-product-image-back").find("input[id=checkout-image]").length+$("#order-product-image-lose").find("input[id=checkout-image]").length+$("#order-product-image-other").find("input[id=checkout-image]").length;
        var rating_driver_taidu = $("#rating_driver_taidu").val();
        var rating_jidigoutong = $("#rating_jidigoutong").val();
        console.log(rating_driver_taidu, '-----',rating_jidigoutong);
        if (image_count < 1) {
            $.hideLoading();
            $.alert('请完成纸单拍照!');
        } else if(parseInt(rating_jidigoutong) < 1 || parseInt(rating_driver_taidu) < 1) {
            $.hideLoading();
            $.alert('请完成评价!');
        }  else if($('#lng').val() === null ||  $('#lat').val() === null ) {
            $.hideLoading();
            $.alert('位置获取失败，请稍后重试!');
        }else {
            var data = $("#checkout").serialize();
            $.sendData('order','checkout', data,'shipment',function(json){
                $.hideLoading();
                text = json.text ? json.text : "";
                if(parseInt(json.code) == 0){
                    $.success('签收成功!'+text);
                    setTimeout(function(){gotolist()},3000);
                }else{
                    $.success(json.msg+''+text);
                    setTimeout(function(){gotolist()},3000);
                }
            });
        }
    });
});


function gotolist(){

    window.location.href = 'orderList.html?openid='+openid;
}

/**
 * 上传签收纸单照片 货损照片
 */
document.addEventListener('DOMContentLoaded', init, false);

function init() {
    var u = new UploadPic();
    u.init({
        input: document.querySelector('#checkout-order-lose'),
        callback: function (base64) {

            $.sendData('order', 'checkoutimage', {file: base64, type: this.fileType, order_id: urlParams.order_id}, '', function(json){
                if (json.error == 0) {
                    var html = '<li class="weui_uploader_file" style="background-image:url('+ json.filepath +')">';
                    html += '<input type="hidden" id="checkout-image" name="checkout-image[]" value="' + json.filepath + '"/>'
                    html += '<a href="javascript:;" onclick="delimg(this)" class="weui_progress_opr"><i class="weui_icon_cancel" style="padding: 0 0 0 40px"></i></a></li>';
                    $("#order-product-image-lose").html(html);
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
/**
 * 上传签收纸单照片 回单照片
 */
document.addEventListener('DOMContentLoaded', init1, false);
function init1() {
    var u = new UploadPic();
    u.init({
        input: document.querySelector('#checkout-order-back'),
        callback: function (base64) {

            $.sendData('order', 'checkoutimage', {file: base64, type: this.fileType, order_id: urlParams.order_id}, '', function(json){
                if (json.error == 0) {
                    var html = '<li class="weui_uploader_file" style="background-image:url('+ json.filepath +')">';
                    html += '<input type="hidden" id="checkout-image" name="checkout-image[]" value="' + json.filepath + '"/>'
                    html += '<a href="javascript:;" onclick="delimg(this)" class="weui_progress_opr"><i class="weui_icon_cancel" style="padding: 0 0 0 40px"></i></a></li>';
                    $("#order-product-image-back").html(html);
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
/**
 * 上传签收纸单照片 其他照片
 */
document.addEventListener('DOMContentLoaded', init2, false);
function init2() {
    var u = new UploadPic();
    u.init({
        input: document.querySelector('#checkout-order-other'),
        callback: function (base64) {

            $.sendData('order', 'checkoutimage', {file: base64, type: this.fileType, order_id: urlParams.order_id}, '', function(json){
                if (json.error == 0) {
                    var html = '<li class="weui_uploader_file" style="background-image:url('+ json.filepath +')">';
                    html += '<input type="hidden" id="checkout-image" name="checkout-image[]" value="' + json.filepath + '"/>'
                    html += '<a href="javascript:;" onclick="delimg(this)" class="weui_progress_opr"><i class="weui_icon_cancel" style="padding: 0 0 0 40px"></i></a></li>';
                    $("#order-product-image-other").html(html);
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
    this.maxSize = options.maxSize || 3 * 1024 * 1024;
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

    this.type = file.type;

    // 如果没有文件类型，则通过后缀名判断（解决微信及360浏览器无法获取图片类型问题）
    if (!this.type) {
        this.type = this.mime[file.name.match(/\.([^\.]+)$/i)[1]];
    }

    if (!/image.(png|jpg|jpeg|bmp)/.test(this.type)) {
        $.alert('选择的文件类型不是图片');
        return;
    }

    if (file.size > this.maxSize) {
        $.alert('选择文件大于' + this.maxSize / 1024 / 1024 + 'M，请重新选择');
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


