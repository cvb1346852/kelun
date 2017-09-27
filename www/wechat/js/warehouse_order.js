//获取用户openid
getUserInfo('shipment',1);
var urlParams = $.getUrlParams(window.location.search);
if(urlParams.code != undefined && urlParams.code !=''){
	$.sendData('wechat','getOpenIdByCode',{code:urlParams.code},'consign',function(json){
	});
}
//加载底部菜单
// buildFooter();
//当前显示页面状态
var cur_show = 1;
//翻页标记
var curPageNo = 1;
//加载标记
var loading = false;
//加载订单数据
var openid = urlParams.openid;
getOrders(openid, (cur_show - 1), curPageNo);
//切换页面加载数据
$(".weui_navbar_item").on('click', function() {
    $(".weui_bar_item_on").removeClass('weui_bar_item_on');
    $(this).addClass('weui_bar_item_on');
    //显示的面板
    var show = $(this).attr('tab');
    if (cur_show != show) {
    	cur_show = show;
	    hide = show == 1 ? 2 : 1;
	    $(".tab-"+show).removeClass('hide');
		$('.tab-'+show).html('');
		$('.weui-infinite-scroll').removeClass('hide');
	    $(".tab-"+hide).addClass('hide');
	    //初始化显示参数
		curPageNo = 1;
		loading = false;
	    // 加载数据
	    getOrders(openid, (Number(show)-1));
    }
});
//展示订单-手动授权
$('.order-tab').on('click', '.auth-button', function(){
	//获取手机号
	var button = $(this);
	var order_item = button.parent().parent().parent().parent();
	var phone = button.prev().children().val();
	if (phone == '' || phone == undefined) {
		$.alert('请输入需要授权的手机号');
	} else {
		$.showLoading();
		//保存数据
		var params = {
			openid : openid,
			phone  : phone,
			order_id : order_item.attr('id')
		};
		if (cur_show == 1) {
			params.auth_status = 1;
		}
		$.sendData('order', 'orderAuth', params, '', function(json){
			$.hideLoading();
			if (json.code == 1) {
				$.alert(json.msg);
			} else {
				$.toast("授权成功", function() {
		        });
				if (cur_show == 1) {
	    			getOrders(openid, 0);
				} else {
					//更改显示
					button.parent().addClass('hide');
					button.parent().prev().html('收货：'+ phone +'（已授权）');
					button.parent().prev().removeClass('hide');
				}
			}
		});
	}
});
//展示订单详情
$('.order-tab').on('click', '.show-order', function(){
	$.showLoading();
	var order_id = $(this).parent().parent().attr('id');
	//获取订单详情
	$.sendData('order', 'getOrderDetail', {order_id: order_id}, '', function(json){
		$.hideLoading();
		if (json.code == 1) {
			$.alert(json.msg);
		} else {
			var html = '';
			html += '<div class="weui-row" style="font-size:16px">';
			if (json.data.length > 0) {
				$.each(json.data, function(i, item) {
					html += '<div class="weui-col-50">'
					html += '<h4>'+ item.product_name +'</h4>'
					html += '</div>'
					html += '<div class="weui-col-50">'
					html += '<p>'+ item.quality + item.unit_name +'</p>'
					html += '</div>'
				});
			} else {
				html += '<div class="weui-col-100">'
				html += '<h4>暂无详情</h4>'
				html += '</div>'
			}
			html += '</div>';
			$.alert(html, '订单详情');

		}
	});
});
//滚动加载
$(document.body).infinite().on("infinite", function() {
	if(loading) return;
	//翻页数据加载
	loading = true;
	getOrders(openid, (cur_show-1), curPageNo);
});
//加载数据函数
function getOrders(openid, auth_status, pageNo = 1, pageSize = 10) {
	var orderType = auth_status == 0 ? '未授权' : '已授权';
	//第一页先清除内容
	$.sendData('order', 'getOrders', {openid: openid, type: 5, auth_status: auth_status, pageNo: pageNo, pageSize: pageSize}, '', function(json){
		if (json.code == 0) {
			var data = json.data;
			var orders = data.result;
			if (pageNo == 1) {
				$('.tab-'+(Number(auth_status)+1)).html('');
				$('.weui-infinite-scroll').removeClass('hide');
			}
			if (orders.length > 0) {
				//判断是否还有下一页
				if (data.pageNo * data.pageSize < data.totalCount) {
					curPageNo += 1;
					loading = false;
				} else {
					loading = true;
					$('.weui-infinite-scroll').addClass('hide');
				}
				$.each(orders, function(i, item){
					var html = '';
					html += '<div class="weui-row weui-no-gutter order-item" id="'+ item.id +'">';
					html += '<div class="weui-col-33 truck-source">';
					html += '<h5>'+ item.carrier_name +'</h5>';
					html += '<h5>'+ item.carnum +'/'+ item.shipment_method +'</h5>';
					html += '</div>';
					html += '<div class="weui-col-66">';
					html += '<div class="order-detail">';
					html += '<h4>订单号：'+ item.order_code +'|'+ item.checkout +'</h4>';
					html += '<p>出发地：'+ item.from_name +'</p>';
					html += '<p>目的地：'+ item.to_name +'</p>';
					if (auth_status) {
						html += '<h4 class="order-authorize">收货：'+ item.to_phone +'（已授权）</h4>';
					}
					html += '</div>';
					html += '<span class="show-order"></span>';
					html += '</div>';
					html += '</div>';
					$('.tab-'+(Number(auth_status)+1)).append(html);
				});
			} else {
				$('.tab-'+(Number(auth_status)+1)).html('<div class="weui_cells_tips null-notice">暂无'+ orderType +'订单</div>');
				$('.weui-infinite-scroll').addClass('hide');
			}
		} else {
			$('.weui-infinite-scroll').addClass('hide');
			$.alert(json.msg);
			$('.tab-'+(Number(auth_status)+1)).html('<div class="weui_cells_tips null-notice">'+ json.msg +'</div>');
		}
	});
}
