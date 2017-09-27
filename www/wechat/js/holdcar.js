var isweixin = isWeixin();
var urlParams = $.getUrlParams(window.location.search);

var openid = '';
var order_detail_info ="";
var shipment_code = urlParams.shipment_code;
var driverList = [];
var selectOne = '';
var sendData = {};
//加载车源数据
var carrier_id = null;
//加载数据函数
function getShipment(openid, shipment_code) {
    $.sendData('Shipment', 'getShipmentInfo', {openid: openid, shipment_code: shipment_code}, 'Shipment', function(data){
        $('#shipment_id').val(data.id);
        $('#carnum').val(data.carnum);
        $('#truck_source_id').val(data.truck_source_id);
        $('#openid').val(openid);
        carrier_id=data.carrier_id;
        var shipments = data;
        $('.weui-infinite-scroll').removeClass('hide');
        var html = '';
        html+='<p class="changeui-list-title" style="margin-bottom:10px;">'+data.fromlocation+' - '+data.tolocation+'</p>';
        html+='<div class="weui-flex">';
        html+='<div class="weui-flex__item">';
        html+='<div class="weui-flex changeui-list-inner-item">';
        html+='<div class="weui-flex__item text-right text-right-item">目的地：</div>';
        html+='<div class="weui-flex__item">'+data.tolocation+'</div>';
        html+='</div>';
        html+='</div>';
        html+='<div class="weui-flex__item">';
        html+='<div class="weui-flex changeui-list-inner-item">';
        html+='<div class="weui-flex__item text-right text-right-item">途径地：</div>';
        html+='<div class="weui-flex__item">暂无</div>';
        html+='</div>';
        html+='</div>';
        html+='</div>';
        html+='<div class="weui-flex">';
        html+='<div class="weui-flex__item">';
        html+='<div class="weui-flex changeui-list-inner-item">';
        html+='<div class="weui-flex__item text-right text-right-item">运输方式：</div>';
        html+='<div class="weui-flex__item">'+data.shipment_method+'</div>';
        html+='</div>';
        html+='</div>';
        html+='<div class="weui-flex__item">';
        html+='<div class="weui-flex changeui-list-inner-item">';
        html+='<div class="weui-flex__item text-right text-right-item"></div>';
        html+='<div class="weui-flex__item"></div>';
        html+='</div>';
        html+='</div>';
        html+='</div>';

        html+='<div class="changeui-list-inner-item single">';
        html+='<span class="text-right text-right-item item">运单信息：</span>';
        html+='<span class="single-right-item item">'+data.shipment_code+'</span>';
        html+='</div>';

        html+='<div class="weui-flex">';
        html+='<div class="weui-flex__item">';
        html+='<div class="weui-flex changeui-list-inner-item">';
        html+='<div class="weui-flex__item text-right text-right-item">重量：</div>';
        html+='<div class="weui-flex__item">'+data.weight+'吨</div>';
        html+='</div>';
        html+='</div>';
        html+='<div class="weui-flex__item">';
        html+='<div class="weui-flex changeui-list-inner-item">';
        html+='<div class="weui-flex__item text-right text-right-item">体积：</div>';
        html+='<div class="weui-flex__item">'+data.volume+'立方米</div>';
        html+='</div>';
        html+='</div>';
        html+='</div>';

        html+='<div class="changeui-list-inner-item single">';
        html+='<span class="text-right text-right-item item">计划发车：</span>';
        html+='<span class="single-right-item item">'+data.plan_leave_time+'</span>';
        html+='</div>';
        html+='<div class="changeui-list-inner-item single">';
        html+='<span class="text-right text-right-item item">备注：</span>';
        html+='<span class="single-right-item item">'+data.assign_remark+'</span>';
        html+='</div>';

        $('#pickUpInfo_id').prepend(html);
        
        
        var _o_html = '';
        $.each(data._orders.data.result, function (i, item) {
        	_o_html += '<p class="changeui-list-title"><em class="ci-font-ico">' + (i + 1) + '</em>' + item.to_address  +'</p><p class="changeui-list-title">'+item.order_quality+'件&nbsp;&nbsp;'+item.order_weight+'吨&nbsp;&nbsp;'+item.order_volume+'方'+ '</p>';
		});
        $('#tblMain').append(_o_html);
        
        /*$.sendData('Shipment', 'getDriverPhones', {carrier_id:carrier_id}, 'Shipment', function(json){
             var ht = '';
            $.each(json,function(i,item){  
               ht+= '<option value="'+item.driver_phone+'">'+item.driver_phone+'</option>';
            });
            $('#driver_phone').append(ht);
            if(data.ship_driver_phone){
                $("#driver_phone option[value='"+data.ship_driver_phone+"']").attr("selected", true);
                $('#driver_name').val(data.driver_name);
                $('#id_card').val(data.id_card);
                $('#carrier_carnum').val(data.carnum);
            }
        });*/
        var driver_phone = data.driver_phone ? data.driver_phone : '输入司机手机号';
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
        if(data.ship_driver_phone){
            $('#driver_name').val(data.driver_name);
            $('#id_card').val(data.id_card);
            $('#carrier_carnum').val(data.carnum);
        }

    });

    
}
$.getUserInfo('shipment',0,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type != 3 && userInfo.user_type != 4){
        $.error('无法取得用户信息');
        return false;
    }
    getShipment(openid, shipment_code);

});

/*$('#driver_phone').change(function(){
    $.showLoading('正在获取数据...');
    var driver_phone=$(this).children('option:selected').val();
    $.sendData('Shipment', 'getDriverMessage', {driver_phone:driver_phone}, 'Shipment', function(data){
        $.hideLoading();
        if(data){
            $('#driver_name').val(data.driver_name);
            $('#id_card').val(data.id_card);
            $('#carrier_carnum').val(data.carnum);  
        }else{

            $('#driver_name').val('');
            $('#id_card').val('');
            $('#carrier_carnum').val('');  
        }
        
    });

});*/




function confirmOk(){
        var id=$('#shipment_id').val();
        var driver_phone =  $("#driver_phone").val();
        var carnum =  $("#carrier_carnum").val();
        var driver_name =  $("#driver_name").val();
        var truck_source_id =  $("#truck_source_id").val();
        var openId=$('#openid').val();
        /*if(driver_phone == '' || driver_phone == undefined){
            $.error('请选择司机');
            return false;
        }*/
        if($("#driver_phone").val() == '输入司机手机号' ){
            $.toast("请选择司机手机号" , "forbidden");
            return false;
        }
        $.sendData('shipment', 'cpecify_driver', {driver_phone:driver_phone,shipmentid:id,carnum:carnum,driver_name:driver_name,truck_source_id:truck_source_id,openid:openId}, 'Shipment', function(data2){
            if(data2.code == '0'){
                $.alert('订车成功');
                setTimeout("gotolist()",1500);
            }
            else{
                $.alert(data2.message);
                return false;
            };
        });
}

function gotolist(){
    window.location.href = "pickUp.html?openid="+openid;
}

