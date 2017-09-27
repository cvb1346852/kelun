$.getUserInfo('consign',0,function(){
    openid = userInfo.openid;
    if(userInfo.user_type!=1 && userInfo.user_type!=2 ){
        $.alert('用户信息错误');
        return false;
    }
});
var urlParams = $.getUrlParams(window.location.search);
if (urlParams.order_id != undefined && urlParams.order_id != '') {
    $.sendData('order', 'checkoutDetail', {order_id:urlParams.order_id}, 'shipment', function(json){
        if (json) {
            var data = json.data;
            var order_code = urlParams.order_id;

            if (data) {
                $("#order_code").html(data.order_code);

                // 图片
                var image = data.images.split(',');
                if (image) {
                    var html = '';
                    for (var i = 0; i < image.length; i++) {
                        html += '<li class="weui_uploader_file" style="background-image:url('+ image[i] +')">';
                    }
                    $("#order-product-image").append(html);
                }

                // 签收项
                var product_abnormal = eval('(' + data.product_abnormal + ')');
                if (product_abnormal) {
                    for(var x in product_abnormal){
                        if (product_abnormal[x] == 1) {
                            $("#product_abnormal_" + x).attr("checked", true);
                        }
                    }
                }

                var quality_abnormal = eval('(' + data.quality_abnormal + ')');
                if (quality_abnormal) {
                    for(var x in quality_abnormal){
                        $("#quality_abnormal_" + x).val(quality_abnormal[x]);
                    }
                }

                // 评分
                var rating = eval('(' + data.grade + ')');
                if (rating) {
                    for(var x in rating){

                        $("#rating_" + x).starRating({
                            initialRating: rating[x],
                            useFullStars: true,
                            readOnly: true,
                        });
                    }
                }

            } else {
                $('#order_product_list').html('<div class="weui_cells_tips null-notice">暂无产品</div>');

            }
        } /*else {
         $.alert(json.msg);
         setTimeout(history.go(-1), 2000);
         }*/
    });
}/*else {
 $.alert('订单id未找到!');
 history.go(-1);
 }*/
