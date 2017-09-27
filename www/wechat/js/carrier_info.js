var urlParam = $.getUrlParams();
var jdata = [];
var carrier_id = urlParam.carrier_id;
var status = urlParam.status;
var openid = "";
$.getUserInfo('consign',0,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type != 3){
        $.alert("获取用户信息失败");
        return false;
    }else{
        showTable(userInfo.phone, 3, openid);
    }
});
var truck_id ;
var carier_id;
function showTable(phone,type,openid){
    var phone = phone;
    $.sendData('truck_source', 'getCarrierinfo', {carrier_id: carrier_id,openid : openid ,phone:phone}, 'truck_source', function(data){
        data.status = parseInt(urlParam.status);
        jdata = data;
        _templete();
        if(status== 1){
             status = "审核中";
        }else if( status == 2){
             status = "审核未通过";
        }else if( status == 3){
             status = "审核通过";
        };
        truck_id = data.truck_id;
        carier_id= data.id;
        $("#province").html(data.province);
        $("#carrier_name").html(data.carrier_name);
        $("#carrier_name_s").html(data.carrier_name_s);
        $("#trans_type").html(data.trans_type);
        $("#relation_person").html(data.relation_person);
        $("#relation_phone").html(data.relation_phone+' <i class="c-iconfont phone-ico">&#xe601;</i>');
        $("#relation_address").html(data.relation_address+'<i class="c-iconfont map-ico"></i>');
        $("#status").html(status);
    });
}
function quitCarrier(){
    
    $.showLoading('正在退出承运商...');
    $.sendData('truck_source', 'quitCarrier', [{name:"carrier_id",value:carrier_id},{name:"truck_id",value:truck_id}], 'truck_source', function(data){
        $.hideLoading();
        if (data) {
            $.toast("退出成功");
            setTimeout("gotolist()",1500);
        } else {
            $.toast("退出失败");
            setTimeout("location.reload()",1500);
        }
    });
};
function gotolist(){
    window.location.href = "join_carrier.html?openid="+openid
}
function gotoAppeal(){
    window.location.href = "appeal.html?openid="+openid
}


function _templete(){

    var _listhtml = _.template($('#carrierinfo-tmpl').html())();

    $('.shippers-detail-container').html(_listhtml);
}