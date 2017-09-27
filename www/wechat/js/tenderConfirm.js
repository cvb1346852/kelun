var openid = null;
var urlParams = $.getUrlParams(window.location.search);
$("#frmSearch_ok_driver").hide();
$("#frmSearch_ok_carrier").hide();
var user_type;
var shipment_code ;
var driverList = [];
var selectOne = '';
var sendData = {};
//加载车源数据
var carrier_id = null;
var s_status ;

//获取用户openid
$.getUserInfo('shipment',0,function(){
    //微信ID;
    openid = userInfo.openid
    user_type = userInfo.user_type;
    userInfo.user_type == 3 ? $("#frmSearch_ok_carrier").hide():$("#frmSearch_ok_driver").hide();
    if(userInfo.user_type != 3 && userInfo.user_type != 4){
        $.alert("获取用户信息失败");
        return false;
    }else{
        if(userInfo.user_type == 3){
            $("#frmSearch_ok_driver").show();
        }else if(userInfo.user_type == 4){
            $("#frmSearch_ok_carrier").show();
        }
        getTrucks(userInfo.phone, openid,userInfo.user_type);
    }
});


//加载数据函数
function getTrucks(phone,openid,user_type) {
    var user_type = user_type;
    var tender_id = urlParams.tender_id;
    //第一页先清除内容
    $.sendData('tender', 'getTenderById', {phone : phone,openid: openid,user_type : user_type,tender_id:tender_id}, '', function(data){
        shipment_code = data.shipment_code;
        carrier_id = data.carrier_id;
        s_status = data.s_status;
        if(parseInt(data.s_status) >= 4){
            if(user_type == 3){
                $("#confirmOk").hide();
                $("#frmSearch_ok_driver").show();
                $("#frmSearch_ok_carrier").hide();
            }else{
                $("#confirmOk").show();
                $("#frmSearch_ok_driver").hide();
                $("#frmSearch_ok_carrier").show();
                $("#gotoAddtruck").css('display','block');
            }
                $("#carnum").attr("disabled","true");
        }else if(userInfo.user_type == 4){
                $("#gotoAddtruck").css('display','block');
        }

        if(data.carriage_type != "冷冻" && data.carriage_type != "冷藏"){
            $("#temperature").html("无要求");
        }else{
            $("#temperature").html(data.temperature ? data.temperature+'℃' : '无要求');
        }
        html = '';
        $.each(data.orderRoute,function(i,item){
            i = i+1;
            html  += '<p class="changeui-list-title"><em class="ci-font-ico">'+i+'</em>'+item.fromlocation+'-'+item.tolocation+'&nbsp;&nbsp;'+item.weight+'吨&nbsp;&nbsp;'+item.volume+'方</p>';
        });
        $("#tender_name").html(html);
         $("#tblMain").append('<p class="changeui-list-title" style="margin-bottom:10px;">'+data.fromlocation+'到'+data.tolocation+'线路 <span style="color:#125dc7">('+data.distance+')公里</span></p>');
         $("#trans_type").html(data.trans_type);
         $("#car_length").html(data.car_length!='-' ? data.car_length+'米' :'无要求');
         $("#carriage_type").html(data.carriage_type ? data.carriage_type : '无要求');
         $("#weight").html(data.weight);
         $("#volume").html(data.volume);
         $("#package_time").html(data.package_time);
         $("#remark").html(data.remark);
         $("#carnum").val(data.carnum);
         $("#id_card").val(data.id_card);
         $("#driver_name").val(data.driver_name);
         $("#carrier_carnum").val(data.carnum);
         var driver_phone = data.driver_phone ? data.driver_phone : '输入司机手机号';

        sendData.shipmentid = data.shipment_id;
        sendData.tender_id = data.id;
        sendData.plat_form_code = data.plat_form_code;
        /*加载车辆模糊查询功能*/
        $("#driver_phone").select2({
            placeholder: driver_phone,
            minimumInputLength: 1,
            multiple: false,
            allowClear: false,
            // 数据加载
            query: function(e) {
                $.sendData('truck_source', 'getCarnumByCarrierid', {carrier_id: carrier_id,'driver_phone':e.term}, '',function(result) {
                    var item=[];
                    $.each(result,function(x,y){
                        driverList[y.driver_phone] = y;
                        item.push({id: y.driver_phone, text: y.driver_phone });
                    });
                    var data = {results: item};
                    e.callback(data);
                });
            }
        }).on("change", function(choosed) {
            selectOne = driverList[choosed.val];
            if(selectOne){
                $('#driver_name').val(selectOne.driver_name);
                $('#id_card').val(selectOne.id_card);
                $('#carrier_carnum').val(selectOne.carnum);
            }
        });

        $("#driver_phone").select2("data", {id:driver_phone, text:driver_phone});


    });

};

 //中标订车司机订
function confirmOk(){
    if(userInfo.user_type == 4){
        if($("#driver_phone").val() == '输入司机手机号' ){
            $.toast("请选择司机手机号" , "forbidden");
            return false;
        }
        if(s_status >=7){
            $.toast("车辆已经在途中，不能指派司机" , "forbidden");
            return false;
        }
    }

    sendData.userType = userInfo.user_type;
    sendData.driver_phone = $('#driver_phone').val();
    sendData.driver_name = $('#driver_name').val();
    sendData.carnum = userInfo.user_type == 3 ? $('#carnum').val() : $('#carrier_carnum').val();
    sendData.id_card = $('#id_card').val();
    sendData.tender_quote_id = urlParams.tender_quote_id;
    sendData.shipment_code = shipment_code;
    sendData.openid = openid;

    $.showLoading('操作中，请稍等...');
    $.sendData('tender', 'confirmOk', sendData, '', function(data){
        $.hideLoading();
        if (data.code == 1) {
            $.alert(data.message);
            return false;
        } else {
            $.toast("订车成功");
            setTimeout("gotolist()",2000);
            $.sendData('tender', 'addRedis_sendMsg', sendData, 'shipment', function(data){});
        }
    });
}
function closeDiv(){
    $('#androidDialog2').hide(true);
}
function gotolist(){
    window.location.href = "tender.html?openid="+openid
}

function gotoAddtruck(){
    window.location.href = "addNewtruck.html?openid="+openid
}