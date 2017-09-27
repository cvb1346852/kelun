var urlParam = $.getUrlParams();
var openid='';
$.getUserInfo('shipment',0,function(){
    openid = userInfo.openid;
    if(userInfo.user_type!=3&&userInfo.user_type!=4){
        $('.body').hide();
        $.alert('用户信息错误');
        return false;
    }
    getBidList(openid);
});
//
function getBidList(openid){
	$.sendData('tender','getBidList',{openid:openid},'shipment',function(data){
		if(data.length>0){
			$('#openid').val(openid);
			jdata=data;
			_templete();
		}else{
			$('.my-waybill-list-container').html('<div class="weui_cells_tips null-notice">暂无竞单</div>');
		}

	});
}
function edit(data){
	var openId=$('#openid').val();
	var item=data.split('_');
	var tender_id=item[0];
	var cooperate_type=item[1];
	window.location.href = 'quote.html?openid='+openId+'&id='+tender_id+'&cooperate_type='+cooperate_type+'&from=wc';
}

function _templete(){

	var _listhtml = _.template($('#orders-tmpl').html())();

	$('.my-waybill-list-container').html(_listhtml);
}

function goto(url){
	window.location.href =url;
}