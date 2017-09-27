//获取url参数
var jdata=[];
var curPageNo = 1;
var pageSize = 10;
var loading = false;
var urlParam = $.getUrlParams();
var openid=urlParam.openid;
//获取用户信息
$.getUserInfo('shipment',0,function(){
    openid = userInfo.openid;
    if(userInfo.user_type!=4){
        $('.body').hide();
        $.alert('用户信息错误');
        return false;
    }

});

$(function() {
	//初始化出发地省份选择
	BindCity("");
	//初始化目的地省份选择
	BindCity1("");
});
//获取承运商平台车源信息
/*function getTruckSource(){
	$.sendData('shipment','getTruckSourceByOpenid',{pageNo:curPageNo,pageSize:pageSize},'shipment',function(data){
		if(data.result.length > 0){
			curPageNo ++;
			jdata=jdata.concat(data.result);
			jdata=data.result;

			_templete();

		}else{
			$('.my-car-list-container').html('<div class="weui_cells_tips null-notice">暂无车源</div>');
		}

	});
}*/
getSearch();
$(document).on('click','#btn',function(){
	jdata=[];
	curPageNo = 1;
	getSearch();
});
function _templete(){

	var _listhtml = _.template($('#orders-tmpl').html())();

	$('.my-car-list-container').html(_listhtml);
}

//搜索
function getSearch(){
	var from_province=$('#ddlProvince option:selected').val();
	var from_city=$('#ddlCity option:selected').val();
	var to_province=$('#toloProvince option:selected').val();
	var to_city=$('#toloCity option:selected').val();
	$.sendData('shipment','getTruckSourceByOpenid',{from_province:from_province,from_city:from_city,to_province:to_province,to_city:to_city,pageNo:curPageNo,pageSize:pageSize},'shipment',function(data){

		if(data.result.length > 0){
			curPageNo ++;
			jdata=data.result;
			_templete();
			$.each(data.result, function(i, item) {
				$.sendData("truck_source", "getAddressList", {driver_phone: item.driver_phone, type: item.type, carnum: item.carnum},'consign',function(data) {
					if(data!= null && data != undefined){
						$("#car_"+item.ts_id).html(data.address);
					}
					else{
						$("#car_"+item.ts_id).html('暂无定位');
					}

				});
			});
		}else{
			$('.my-car-list-container').html('<div class="weui_cells_tips null-notice">暂无车源</div>');
		}

	});
}
//弹框
function getshow(id){
	var id=id;
	$.sendData('shipment','getDriverMsg',{id:id,openid:openid},'shipment',function(data){
		$('#driver').html(data.driver_name);
		$('#phone').html(data.driver_phone);
		$('#location').html(data.location);
		
	});
	$("#about").popup(); 
	
}

$('.container').infinite().on("infinite", function() {
	if(loading) return;
	//翻页数据加载
	loading = true;
	/*var usertype=$('#user_type').val();*/
	if(jdata.length>=10){
		getTruckSource();
	}

});
