var urlParam = $.getUrlParams();
var openid='';
var jdata=[];
var tender_limit='';
var dun='';

$.getUserInfo('shipment',0,function(){
    openid = userInfo.openid;
    $('#openid').val(openid);
    if(userInfo.user_type!=3&&userInfo.user_type!=4){
        $('.body').hide();
        $.alert('用户信息错误');
        return false;
    }
    if(userInfo.user_type==3){
    	if(urlParam.cooperate_type==1){
    		bidquote(userInfo.phone, openid,userInfo.user_type);
    	}else{
    		fixedquote(userInfo.phone, openid,userInfo.user_type);
    	}
    }
    if(userInfo.user_type==4){
    	if(urlParam.cooperate_type==1){
			bidquote(userInfo.phone, openid,userInfo.user_type);
    	}else{
    		fixedquote(userInfo.phone, openid,userInfo.user_type);
    	}
    }
});

if(urlParam.from=='pt'){
	$.sendData('tender','updatePush',{openid:urlParam.openid,tender_id:urlParam.id},'shipment',function(data){

	});
}

//获取竞价页面
function bidquote(phone,openid,user_type){
	var tender_id = urlParam.id;
	$.sendData('tender','bidquote',{phone : phone,openid: openid,user_type : user_type,tender_id:tender_id},'shipment',function(data){
		if(data.status>1){
			$.alert('该标的已经停止报价');
			return false;
		}else{
			$('#bid').show();
			jdata=data;
			_templete();
			tender_limit=data.tenderNow;
			/*if(data.order_detail){
				var order_detail_info = "";
				$.each(data.order_detail,function(i,item){
					order_detail_info += item.serial +'&nbsp;'+ item.specification +'&nbsp;'+item.product_name +'&nbsp;'+item.quality+'<br/>' ;
				});
				$("#order_detail").html( order_detail_info);
			}*/

		}


		$.sendData('tender','checkTenderQuote',{tender_id:tender_id,openid:openid},'shipment',function(data1){
			/*if(!jQuery.isEmptyObject(data1)){
				$('.wo_price').html(data1.total_price+'元');
			}else{
				if(data.price_type==1){
					$('#zhengche').show();

				}else{
					$('#dun').show();
					dun=data.weight;
					
				}
			}*/
			if(!jQuery.isEmptyObject(data1)){
				$('.wo_price').html(data1.total_price+'元');
			}
			if(data.price_type==1){
					$('#zhengche').show();

				}else{
					$('#dun').show();
					dun=data.weight;
					
				}

		});


	});
}
//获取一口价页面
function fixedquote(phone,openid,user_type){
	var tender_id = urlParam.id;
	var openId=urlParam.openid;
	$.sendData('tender','fixedquote',{phone : phone,openid: openid,user_type : user_type,tender_id:tender_id},'shipment',function(data){
		if(data.status>1){
			$.alert('该标的已经停止报价');
			return false;
		}else{
			$('#fix').show();
			jdata=data;
			_templete();
			tender_limit=data.tenderNow;
			$('.wo_price').html(data.quote_price+'元');
			$('#quote_price').val(data.quote_price);
			/*if(data.order_detail){
				var order_detail_info = "";
				$.each(data.order_detail,function(i,item){
					order_detail_info += item.serial +'&nbsp;'+ item.specification +'&nbsp;'+item.product_name +'&nbsp;'+item.quality+'<br/>' ;
				});
				$("#order_detail").html( order_detail_info);
			}*/
		}

		$.sendData('tender','checkTenderQuote',{tender_id:tender_id,openid:openId},'shipment',function(data1){
		if(jQuery.isEmptyObject(data1)){
			   $('#fixrice').show();
			}else{
			$('#fixrice').hide();
			}
		});
	});


}



//一口价提交
function addfixed(){
	var quote_price=$('#quote_price').val();
	var openid=$('#openid').val();
	var tender_id=urlParam.id;
	$.sendData('tender','addQoute',{quote_price : quote_price,openid: openid,tender_id:tender_id},'shipment',function(data){
		if(parseInt(data.code) == 0){
				$('.ok').html('<div class="dia-font-area"><i class="weui-icon-success weui-icon_msg font-item"></i></div>'+data.msg);
				$('#chenggong').show();
                 setTimeout("reload()",1500);
            }else if(parseInt(data.code) == 1){
			$('.alarm').html('<div class="dia-font-area"><span class="c-iconfont font-item tip-font-ico">&#xe608;</span></div>'+data.msg);
			$('#alarm').show();
            }else if(parseInt(data.code) == 2){
			$('.alarm').html('<div class="dia-font-area"><span class="c-iconfont font-item tip-font-ico">&#xe608;</span></div>'+data.msg);
			$('#alarm').show();
                 setTimeout("reload()",1500);
            }else {
			$('.alarm').html('<div class="dia-font-area"><span class="c-iconfont font-item tip-font-ico">&#xe608;</span></div>'+data.msg);
			$('#alarm').show();
            }
	});

}

//竞价提交
function addbid(){
	var quote_price_dun=$('#quote_price_dun').val();
	var quote_price_che=$('#quote_price_che').val();
	if(!/^[0-9]*$/.test(quote_price_dun)){
	    $.toast("报价必须是数字" , "forbidden");
	         return false;      
	}
	if(!/^[0-9]*$/.test(quote_price_che)){
      $.toast("报价必须是数字" , "forbidden");
         return false;      
	}
	if(quote_price_dun==''){
		var quote_price=quote_price_che;
	}else{
		var quote_price=quote_price_dun;
	}
	var openid=$('#openid').val();
	var quote_remark=$('#quote_remark').val();
	var tender_id=urlParam.id;
	if(quote_price==''){
		$('.alarm').html('<div class="dia-font-area"><span class="c-iconfont font-item tip-font-ico">&#xe608;</span></div>'+'报价不能为空');
		$('#alarm').show();
		return false;
	}
	$.showLoading('正在完成报价...');
	$.sendData('tender','checkTenderQuote',{tender_id:tender_id,openid:openid},'shipment',function(json){
		if(!jQuery.isEmptyObject(json)){
			$.hideLoading();
			$('#alarm_repeat').show();
			$('#repeat_confirm').on('click',function(){
				$('#alarm_repeat').hide();
				addqoute(quote_price,openid,tender_id,quote_remark);

			});
		}else{
			addqoute(quote_price,openid,tender_id,quote_remark);
		}
	});
	/*$.sendData('tender','addQoute',{quote_price : quote_price,openid: openid,tender_id:tender_id},'shipment',function(data){
		if(parseInt(data.code) == 0){
			$('.ok').html('<div class="dia-font-area"><i class="weui-icon-success weui-icon_msg font-item"></i></div>'+data.msg);
			$('#chenggong').show();

                 setTimeout("reload()",1500);
            }else if(parseInt(data.code) == 1){
			$('.alarm').html('<div class="dia-font-area"><span class="c-iconfont font-item tip-font-ico">&#xe608;</span></div>'+data.msg);
			$('#alarm').show();
            }else if(parseInt(data.code) == 2){
			$('.alarm').html('<div class="dia-font-area"><span class="c-iconfont font-item tip-font-ico">&#xe608;</span></div>'+data.msg);
			$('#alarm').show();
                 setTimeout("reload()",1500);
            }else{
			$('.alarm').html('<div class="dia-font-area"><span class="c-iconfont font-item tip-font-ico">&#xe608;</span></div>'+data.msg);
			$('#alarm').show();
            }
	});*/
	
}

//报价请求
function addqoute(quote_price,openid,tender_id,quote_remark){
	$.sendData('tender','addQoute',{quote_price : quote_price,openid: openid,tender_id:tender_id,quote_remark:quote_remark},'shipment',function(data){
		if(parseInt(data.code) == 0){
			$('.ok').html('<div class="dia-font-area"><i class="weui-icon-success weui-icon_msg font-item"></i></div>'+data.msg);
				$.hideLoading();
				$('#chenggong').show();
                 setTimeout("reload()",1500);
            }else if(parseInt(data.code) == 1){
				$.hideLoading();
				$('.alarm').html('<div class="dia-font-area"><span class="c-iconfont font-item tip-font-ico">&#xe608;</span></div>'+data.msg);
				$('#alarm').show();
            }else if(parseInt(data.code) == 2){
				$.hideLoading();
				$('.alarm').html('<div class="dia-font-area"><span class="c-iconfont font-item tip-font-ico">&#xe608;</span></div>'+data.msg);
				$('#alarm').show();
                 setTimeout("reload()",1500);
            }else{
				$.hideLoading();
				$('.alarm').html('<div class="dia-font-area"><span class="c-iconfont font-item tip-font-ico">&#xe608;</span></div>'+data.msg);
				$('#alarm').show();
            }
	});
}
function reload(){
	window.location.href=window.location.href+"&mm="+10000*Math.random();
}

function _templete(){

	var _listhtml = _.template($('#orders-tmpl').html())();

	$('#tenderMsg').html(_listhtml);
}

/*function order_detail_info() {
	$('#xiangqing').show(true);
}*/

function closeDiv(){
	$('#xiangqing').hide(true);
}

$(document).on('click','#quit',function(){
	opendid=urlParam.opeind;
	window.location.href='./bidList.html?openid='+openid;
});

//弹框操作
$(document).on('click','#back',function(){
	$('#alarm').hide();
});
$(document).on('click','#confirm',function(){
	$('#alarm').hide();
});
$(document).on('click','#iknow',function(){
	$('#chenggong').hide();
});
$(document).on('click','#repeat_back',function(){
	$('#alarm_repeat').hide();
});

