var jdata;
var auditStatus;
var urlParams = $.getUrlParams(window.location.search);
var realname = decodeURI(urlParams.realname);
var tender_id;
var quote_id ;
var tender_audit_id = urlParams.tender_audit_id;
var button;
var carrier_id = null;
var data = null;
var shipment_id;
var quote_type;
var quote_carrier_id;
var carnum;
var warehouse_user_id;
var tender_name;
var tallage_price;
var quote_price;
//获取用户openid
$.getUserInfo('shipment',0,function(){
    //微信ID;
    openid = userInfo.openid
    if(userInfo.user_type != 6){
        $("#about").hide();
        $.alert("获取用户信息失败");
        return false;
    }else{
        $.sendData('tender', 'getAuditStatus', {tender_audit_id:urlParams.tender_audit_id}, 'tender', function(data){
            if(data.status){
                auditStatus = data.status;
                tender_id =  data.tender_id;
                quote_id = data.quote_id;
                getTrucks(userInfo.phone, openid,userInfo.user_type);
                if(data.status == 1){
                    //$("#handle").hide();
                    $.alert("您已操作，操作不批准");
                }else if(data.status == 2){
                    //$("#handle").hide();
                    $.alert("您已操作，操作批准");
                }
            }else{
                $.alert("数据获取失败");
                return false;
            }

        });
    }
});
//加载车源数据

function _templete(){

    var _listhtml = _.template($('#retify-tmpl').html())();

    $('.price-check-container').html(_listhtml);


    $('#handle').html(_.template($('#t-tmpl').html())());

    /*if(jdata.operating_type == 2 && jdata.warehouse_type == 1){
        $("#handle").css("display","none");
    }*/

}
//加载数据函数
function getTrucks(phone,openid,user_type) {
    var user_type = user_type;
    //第一页先清除内容
    $.sendData('tender', 'getRetifyinfo', {phone : phone,openid: openid,user_type : user_type, tender_id:tender_id,quote_id:quote_id,tender_audit_id:tender_audit_id}, '', function(data){
        shipment_id = data.shipment_id;
        quote_type = data.quote_type;
        quote_carrier_id = data.quote_carrier_id;
        carnum = data.carnum;
        warehouse_user_id = data.warehouse_user_id;
        tender_name = data.tender_name;
        shipment_code = data.shipment_code;
        package_time = data.package_time;
        tallage_price = data.tallage_price;
        quote_price = data.quote_price;
        jdata = data;
        jdata.unit_price = jdata.price_type  == 1 ? jdata.quote_price/jdata.weight : jdata.quote_price; //单价
        jdata.totalPrice = jdata.price_type  == 1 ? jdata.quote_price : jdata.quote_price * jdata.weight;//总价
        if(jdata.maxprice != ""){
            if(jdata.price_type == 2){
                jdata.push_price = (jdata.quote_price - jdata.maxprice)/(jdata.maxprice)*100 ;
            }else{
                jdata.push_price = (jdata.quote_price/jdata.weight - jdata.maxprice)/(jdata.maxprice)*100;
            }
        }else{
             /*未设置线路低价*/
               jdata.push_price = -1;
        }

        //jdata.push_price =    ?  '0': (jdata.price_type == 1 ? (jdata.quote_price - jdata.maxprice)/(jdata.maxprice)*100 : (jdata.quote_price - jdata.maxprice)/(jdata.maxprice*jdata.weight)*100);
        _templete();
    });
};

function gotolist(){
    window.location.href = 'approve.html?openid='+openid;
}

//批准
function retifyOk(retify_type){
    var retify_type = retify_type;
    if(retify_type == 'no'){
        var retify_text = '不批准';
    }else{
        var retify_text = '批准';
    }
    $.confirm("确定要进行"+retify_text+"操作吗", "价格审批", function() {
        $.showLoading('操作中，请稍等...');
        var audit_remark = $("#audit_remark").val();
        searchParams =  $("#frmSearch_retify").serializeArray();

        $.sendData('tender', 'retifyOk', {shipment_id : shipment_id,quote_type: quote_type,quote_carrier_id : quote_carrier_id,shipment_code :shipment_code,
            carnum : carnum,warehouse_user_id : warehouse_user_id,tender_name : tender_name,package_time:package_time,
            tender_id : tender_id,quote_id : quote_id,retify:retify_type,openid:openid,tender_audit_id:tender_audit_id,audit_remark:audit_remark,tallage_price:tallage_price,quote_price:quote_price}, 'shipment', function(data){
            $.hideLoading();
            if(data.code == "ok"){
                if (data.data) {
                    $.toast("批准操作成功");
                    setTimeout(function(){gotolist()},1500);
                } else {
                    $.toast(data.msg,'cancel');
                }
            }else if(data.code == "no"){
                if (data.msg) {
                    $.toast("不批准操作成功");
                    setTimeout(function(){gotolist()},1500);
                } else {
                    $.toast("不批准操作失败",'cancel');
                }
            }

        });
    }, function() {
        //取消操作
    });

}