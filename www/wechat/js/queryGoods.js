/**
 * Created by zby on 17/11/1.
 */
console.log('11');
var openid = '';
//加载订单数据
$.getUserInfo('consign',0,function(){
    //微信ID
    console.log(userInfo);
    openid = userInfo.openid;
    openid = 'oEB5ixC11-uot9Gzh1N4OPTzevaE'; // to do: temp
    if(userInfo.user_type != 1){
        $.error('无法取得用户信息');
        return false;
    }
    // getOrders(openid);
});

$(function(){
    // $.sendData('order', 'getFromNames', {openid: 'oEB5ixC11-uot9Gzh1N4OPTzevaE'}, 'consign', function(json){
    //     console.log(json);
    // });
    //
    // $.sendData('order', 'getOrderTrace', {order_code: '5I1712217092000124'}, 'consign', function(json){
    //     console.log(json);
    // });

    var val = '';
    var type = '';
    $("#search").on('click',function(e) {
        val = $('.changeui-input').val();
        if ( !val ) {
            $.error('货单号或订单号不能为空');
            return false;
        }
        type = val.substr(0, 2).toLowerCase();
        // 查询要货单
        if ('5a' === type) {
            $.sendData('order', 'erpOrderList', {goods_code: val}, 'consign', function(json) {
                console.log(json);
            });
        }
        // 查询订单
        else if ('5i' === type) {
            $.sendData('order', 'getOrderTrace', {order_code: val}, 'consign', function(json) {
                console.log(json);
            });
        }
        else {
            $.error('货单号或订单号输入不正确');
        }
    });
});