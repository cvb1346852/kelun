var jdata;
var urlParams = $.getUrlParams(window.location.search);
    jdata = urlParams;
var phone = urlParams.phone;
var order_detail_info = '';
$("#phone").val(phone);
var isweixin = isWeixin();
var openid='';
var volume = 0;
var weight = 0;
var quality = 0;
 if (isweixin){
        $.getUserInfo('consign',0,function(){
            openid = userInfo.openid;
            $('#openid').val(openid);
            if(userInfo.user_type!=1 && userInfo.user_type!=2 ){
                $.alert('用户信息错误');
                return false;
            }else{
              phone = userInfo.phone;
                loadparams(phone);
            }
        });
}else{
     if(phone){
         phone = urlParams.phone;
         openid = urlParams.openid;
         loadparams(phone);
     }
}
function loadparams(phone){
    if(phone){
        $.sendData('order','verifyPhoneOrorder',{phone:phone,order_id:urlParams.order_id},'shipment',function(data){
            //验证失败
            if(data){
                $.each(data,function(i,item){
                    /*order_detail_info += item.product_name+''+item.quality+''+item.unit_name+'/';*/
                    order_detail_info += item.serial +'&nbsp;'+ item.specification +'&nbsp;'+item.product_name +'&nbsp;'+item.quality+'<br/>' ;
                    weight = parseInt(weight) + parseFloat(item.weight);
                    volume =  parseInt(volume) + parseFloat(item.volume);
                    quality =  parseInt(quality) + parseFloat(item.quality);
                });
                jdata.order_detail_info = order_detail_info;
                jdata.order_detail = data;
                jdata.volume = volume;
                jdata.weight = weight;
                jdata.quality = quality;
                _templete();

            }else{
                _templete();
            }
        });
    }else{
        $.alert('用户信息错误');
        return false;
    }

};

$("#order_code").html(order_code);
$("#order_id").val(urlParams.order_id);
function closeDiv(){
    $('#androidDialog2').hide(true);
}
function _templete(){
    var orderInfoHtml = _.template($('#order_info_tmp').html())();
    $('#checkout').prepend(orderInfoHtml);
    var consign_option_html = _.template($('#consign_option_tmp').html())();
    $('#option_consign').html(consign_option_html);
    addListener();

    $(document).on('click','#st11', function(){
        $("#st15,#st14,#st13,#st12,#st11").addClass("gray-star");
        $("#st11").removeClass("gray-star");
        $("#rating_driver_taidu").val(1);
    });
    $(document).on('click','#st12', function(){
        $("#st15,#st14,#st13,#st12,#st11").addClass("gray-star");
        $("#st12,#st11").removeClass("gray-star");
        $("#rating_driver_taidu").val(2);
    });
    $(document).on('click','#st13', function(){
        $("#st15,#st14,#st13,#st12,#st11").addClass("gray-star");
        $("#st13,#st12,#st11").removeClass("gray-star");
        $("#rating_driver_taidu").val(3);
    });
    $(document).on('click','#st14', function(){
        $("#st15,#st14,#st13,#st12,#st11").addClass("gray-star");
        $("#st14,#st13,#st12,#st11").removeClass("gray-star");
        $("#rating_driver_taidu").val(4);
    });
    $(document).on('click','#st15', function(){
        $("#st15,#st14,#st13,#st12,#st11").addClass("gray-star");
        $("#st15,#st14,#st13,#st12,#st11").removeClass("gray-star");
        $("#rating_driver_taidu").val(5);
    });
    $(document).on('click','#st21', function(){
        $("#st25,#st24,#st23,#st22,#st21").addClass("gray-star");
        $("#st21").removeClass("gray-star");
        $("#rating_jidigoutong").val(1);
    });
    $(document).on('click','#st22', function(){
        $("#st25,#st24,#st23,#st22,#st21").addClass("gray-star");
        $("#st22,#st21").removeClass("gray-star");
        $("#rating_jidigoutong").val(2);
    });
    $(document).on('click','#st23', function(){
        $("#st25,#st24,#st23,#st22,#st21").addClass("gray-star");
        $("#st23,#st22,#st21").removeClass("gray-star");
        $("#rating_jidigoutong").val(3);
    });
    $(document).on('click','#st24', function(){
        $("#st25,#st24,#st23,#st22,#st21").addClass("gray-star");
        $("#st24,#st23,#st22,#st21").removeClass("gray-star");
        $("#rating_jidigoutong").val(4);
    });
    $(document).on('click','#st25', function(){
        $("#st25,#st24,#st23,#st22,#st21").addClass("gray-star");
        $("#st25,#st24,#st23,#st22,#st21").removeClass("gray-star");
        $("#rating_jidigoutong").val(5);
    });

    var  $androidDialog2 = $('#androidDialog2');
    $('#order_detail_info').on('click',function(){
        $('#androidDialog2').show(true);
        $androidDialog2.fadeIn(200);
    });
    /*$(document).on('click','#order_detail_info', function(){
        $('#androidDialog2').show(true);
        $androidDialog2.fadeIn(200);
    });
*/
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
var url = window.location.href;
if (isweixin) {
    //获取微信js签名
    $.sendData('wechat','getJsSignature',{url:url},'shipment',function(json){
        wx.config({
            debug: false,
            appId: json.appId,
            timestamp: json.timestamp,
            nonceStr: json.nonceStr,
            signature: json.signature,
            jsApiList: [
                'scanQRCode',
                'closeWindow',
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
                }
            });
        });
    });
} else {
    //need support https

    if(window.navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleSuccess,handleError);
    }else{
        alert('不支持获取定位');
    }
}
function handleSuccess(position){
    longitude = position.coords.longitude;
    latitude = position.coords.latitude;
    $('#lng').val(longitude);
    $('#lat').val(latitude);
    alert(longitude);
    $.sendData('api', 'getAddressByLngLat', {lng: longitude, lat: latitude}, 'shipment', function (data) {
        $('#address').val(data.address);
    });
}
function handleError(error){
    //alert(JSON.stringify(error));
}
$(function(){
    $(document).on('click','#showTooltips', function(){
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
        }/*  else if($('#lng').val() == "" ||  $('#lat').val() == "" ) {
            $.hideLoading();
            $.alert('位置获取失败,请稍后重试!');
        }*/else {
            var data = $("#checkout").serialize();

            $.sendData('order','checkout', data,'shipment',function(json){
                $.hideLoading();
                if(parseInt(json.code) == 0){
                    $.toast('签收成功!');
                    setTimeout(function(){gotolist()},3000);
                }else{
                    $.toast(json.msg,"cancel");
                }
            });
        }
    });
});

function gotolist(){

    window.location.href = 'orderList.html?openid='+openid;
}

function init2() {
    var u = new UploadPic();
    u.init({
        input: document.querySelector('#checkout-order-other'),
        callback: function (base64) {

            $.sendData('order', 'checkoutimage', {
                file: base64,
                type: this.fileType,
                order_id: urlParams.order_id
            }, '', function (json) {
                if (json.error == 0) {
                    var html = '<li class="weui_uploader_file" style="background-image:url(' + json.filepath + ')">';
                    html += '<input type="hidden" id="checkout-image" name="checkout-image[]" value="' + json.filepath + '"/>'
                    html += '<a href="javascript:;" onclick="delimg(this)" class="weui_progress_opr"><i class="weui_icon_cancel" style="padding: 0 0 0 40px"></i></a></li>';
                    $("#order-product-image-other").append(html);
                    $("#order-product-image-other").find('.weui_uploader_input_wrp').hide();
                    $(".weui_uploader_input").val("");
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

function init() {
    var u = new UploadPic();
    u.init({
        input: document.querySelector('#checkout-order-lose'),
        callback: function (base64) {

            $.sendData('order', 'checkoutimage', {
                file: base64,
                type: this.fileType,
                order_id: urlParams.order_id
            }, '', function (json) {
                if (json.error == 0) {
                    var html = '<li class="weui_uploader_file" style="background-image:url(' + json.filepath + ')">';
                    html += '<input type="hidden" id="checkout-image" name="checkout-image[]" value="' + json.filepath + '"/>'
                    html += '<a href="javascript:;" onclick="delimg(this)" class="weui_progress_opr"><i class="weui_icon_cancel" style="padding: 0 0 0 40px"></i></a></li>';
                    $("#order-product-image-lose").append(html);
                    $("#order-product-image-lose").find('.weui_uploader_input_wrp').hide();
                    $(".weui_uploader_input").val("");
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

function init1() {
    var u = new UploadPic();
    u.init({
        input: document.querySelector('#checkout-order-back'),
        callback: function (base64) {

            $.sendData('order', 'checkoutimage', {
                file: base64,
                type: this.fileType,
                order_id: urlParams.order_id
            }, '', function (json) {
                if (json.error == 0) {
                    var html = '<li class="weui_uploader_file" style="background-image:url(' + json.filepath + ')">';
                    html += '<input type="hidden" id="checkout-image" name="checkout-image[]" value="' + json.filepath + '"/>'
                    html += '<a href="javascript:;" onclick="delimg(this)" class="weui_progress_opr"><i class="weui_icon_cancel" style="padding: 0 0 0 40px"></i></a></li>';
                    $("#order-product-image-back").append(html);
                    $("#order-product-image-back").find('.weui_uploader_input_wrp').hide();
                    $(".weui_uploader_input").val("");
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

//为上传按钮绑定事件
function addListener() {
    /**
     * 上传签收纸单照片 货损照片
     */
    init();
    /**
     * 上传签收纸单照片 回单照片
     */
    init1();
    /**
     * 上传签收纸单照片 其他照片
     */
    init2();


}
function delimg(obj)
{
    $.confirm("确定删除这张图片吗？", "删除图片", function() {
        $(obj).parent('li').prev().show();
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
        $(".weui_uploader_input").val("");
        return;
    }

    if (file.size > this.maxSize) {
        $.alert('选择文件大于' + this.maxSize / 1024 / 1024 + 'M，请重新选择');
        $(".weui_uploader_input").val("");
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


