var openid = null;
var urlParams = $.getUrlParams(window.location.search);
//获取用户openid
$.getUserInfo('shipment',2,function(){
    //微信ID;
    openid = userInfo.openid
    if(userInfo.user_type != 6){
        $("#about").hide();
        $.alert("获取用户信息失败");
        return false;
    }else{
        $.sendData('tender', 'getAuditStatus', {tender_audit_id:urlParams.tender_audit_id}, 'tender', function(data){
            if(data.status){
                if(data.status == 1){
                    $(".weui-row").hide();
                    $.alert("您已操作，操作不批准");
                }else if(data.status == 2){
                    $(".weui-row").hide();
                    $.alert("您已操作，操作批准");
                }
                getTrucks(userInfo.phone, openid,userInfo.user_type);
            }else{
                $.alert("数据获取失败");
                return false;
            }

        });
    }
});
//加载底部菜单
buildFooter();
//翻页标记
var curPageNo = 1;
var pageSize = 10;
//加载标记
var loading = false;
//加载车源数据
var carrier_id = null;
var data = null;
var shipment_id;
var quote_type;
var quote_carrier_id;
var carnum;
var warehouse_user_id;
var tender_name;
//加载数据函数
function getTrucks(phone,openid,user_type) {
    var user_type = user_type;
    var tender_id = urlParams.tender_id;
    var quote_id = urlParams.quote_id;
    //第一页先清除内容
    $.sendData('tender', 'getRetifyinfo', {phone : phone,openid: openid,user_type : user_type,tender_id:tender_id,quote_id:quote_id}, 'tender', function(data){
        shipment_id = data.shipment_id;
        quote_type = data.quote_type;
        quote_carrier_id = data.quote_carrier_id;
        carnum = data.carnum;
        warehouse_user_id = data.warehouse_user_id;
        tender_name = data.tender_name;
        shipment_code = data.shipment_code;
        package_time = data.package_time;
        data.cooperate_type = data.cooperate_type == 1 ? "竞价":"一口价";
        data.price_type = data.price_type == 1 ? "整车":"按吨";
        if(data.quote_type == 1 ){  //承运商
            $("tr.driver_name").css("display","none");
        }else if(data.quote_type == 2){
            $(".carnum").val(data.carnum);
        }
        $("#tender_name").html(data.tender_name);
        $("#plan_leave_time").html(data.plan_leave_time);
        $("#trans_type").html(data.trans_type);
        $("#cooperate_type").html(data.cooperate_type);
        $("#price_type").html(data.price_type);
        $("#carriage_type").html(data.carriage_type);
        $("#remark").html(data.remark);
        $("#quote_carrier").html(data.quote_carrier);
        $("#driver_name").html(data.driver_name);
        $("#quote_price").html(data.quote_price)
    });
};
//批准
function retifyOk(retify_type){
    var retify_type = retify_type;
    searchParams =  $("#frmSearch_retify").serializeArray();
    $.sendData('tender', 'retifyOk', {shipment_id : shipment_id,quote_type: quote_type,quote_carrier_id : quote_carrier_id,shipment_code :shipment_code,
        carnum : carnum,warehouse_user_id : warehouse_user_id,tender_name : tender_name,package_time:package_time,
        tender_id : urlParams.tender_id,quote_id : urlParams.quote_id,retify:retify_type,openid:openid}, 'shipment', function(data){
        if(data.code == "ok"){
            if (data.msg) {
                $.toast("批准操作成功");
                setTimeout(function(){gotolist()},1500);
            } else {
                $.toast("批准操作失败");
                setTimeout("location.reload()",1500);
            }
        }else if(data.code == "no"){
            if (data.msg) {
                $.toast("不批准操作成功");
                setTimeout(function(){gotolist()},1500);
            } else {
                $.toast("不批准操作失败");
                setTimeout("location.reload()",1500);
            }
        }

    });
}
function gotolist(){
    window.location.href = 'approve.html?openid='+openid;
}


