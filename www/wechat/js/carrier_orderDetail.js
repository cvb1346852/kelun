var urlParam = $.getUrlParams();
var openid='';
$.getUserInfo('shipment',0,function(){
    openid = userInfo.openid;
    if(userInfo.user_type!=4){
        $('.container').hide();
        $.alert('用户信息错误');
        return false;
    }
});
$('#cd').hide();
//获取货源详细信息
$.sendData('shipment','getOrderSourceDetail',urlParam,'shipment',function(data){
	if(data) {
		var tenderMsg = data.tenderMsg;
		var shipmentInfo = data.shipmentInfo;
		var ware = data.ware;
		$('#tblMain').html('');
		$('#shipment_method').html(shipmentInfo.shipment_method);
		$('#quality').html(shipmentInfo.quality);
		$('#weight').html(shipmentInfo.weight);
		$('#plan_leave_time').html(shipmentInfo.plan_leave_time);
		if (tenderMsg) {
			$('#tender_id').val(tenderMsg.id);
			$('#cooperate_type').val(tenderMsg.cooperate_type);
			if (tenderMsg.cooperate_type == 1) {
				$('#ctype').html('竞价');
			} else {
				$('#ctype').html('一口价');
			}
			$('#carriage_type').html(tenderMsg.carriage_type ? tenderMsg.carriage_type : '无要求');
			$('#car_length').html(tenderMsg.car_length!='-' ? tenderMsg.car_length :'无要求');
			$('#temperature').html(tenderMsg.temperature !='0.00-0.00' ? tenderMsg.temperature :'无要求');
			$('#ctime').text(tenderMsg.tender_limit);
		}
		if (shipmentInfo.status == 2) {

			$('#cd').show();
		}
		if (ware) {
			$('#username').html(ware.person);
			$('#phone').html(ware.phone);
			$('#address').html(ware.address);
		}

		$.each(data.order, function (i, item) {
			var html = '';
			html += '<p class="changeui-list-title"><em class="ci-font-ico">' + (i + 1) + '</em>' + item.fromlocation + '-' + item.tolocation +'&nbsp;&nbsp;'+item.order_weight+'吨&nbsp;&nbsp;'+item.order_volume+'方'+ '</p>';
			$('#tblMain').append(html);
		});
	}else{
		var html ='';
		html+='<div class="weui_cells_tips null-notice">暂无投标信息</div>';
		$('.container').html(html);
	}
});

$('#button').on('click',function(){
	var opinId=urlParam.openid;
	var tender_id=$('#tender_id').val();
	var cooperate_type=$('#cooperate_type').val();
	window.location.href = 'quote.html?openid='+opinId+'&id='+tender_id+'&cooperate_type='+cooperate_type+'&from=wc';
});
