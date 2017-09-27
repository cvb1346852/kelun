//当前显示页面状态
var cur_show = 0;
//翻页标记
var curPageNo = 1;
var pageSize = 10;
var is_end = false;
var loading = false;
var openid = '';
//页面数据
var allOrder = []
//加载订单数据
$.getUserInfo('consign',0,function(){
	//微信ID
	openid = userInfo.openid;
	if(userInfo.user_type != 1){
		$.error('无法取得用户信息');
		return false;
	}
	getOrders(openid, cur_show);
});

//切换页面加载数据
$(function(){
	$('.weui-navbar__item').on('click', function () {
		$(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');
		//初始化显示参数
		var show = parseInt($(this).attr('data'));
		if (cur_show != show) {
			cur_show = show;
			curPageNo = 1;
			allOrder = [];
			$('.express-delivery-list').html('');
			getOrders(openid,  cur_show);
		}
	});
	//滚动加载
	$('.express-delivery-list').infinite().on("infinite", function() {
		//正在加载中
		if(loading) return;
		if(!is_end){
			getOrders(openid, cur_show);
		}

	});
});

//加载数据函数
function getOrders(openid, auth_status) {
	//翻页数据加载
	loading = true;
	var orderType = auth_status == 0 ? '未授权' : '已授权';
	//第一页先清除内容
	$.sendData('order', 'getOrders', {openid: openid, type: 1, auth_status: auth_status, pageNo: curPageNo, pageSize: pageSize}, '', function(json){
		loading = false;
		if (json.code == 0) {
			var data = json.data;
			curPageNo ++;
			if (data.result.length > 0) {
				allOrder = allOrder.concat(data.result);
				is_end = allOrder.length < data.totalCount ? false : true;
				_templete();
			} else {
				$('.express-delivery-list').html('<div class="weui_cells_tips null-notice">暂无'+ orderType +'订单</div>');
			}
		} else {
			$('.express-delivery-list').html('<div class="weui_cells_tips null-notice">'+ json.msg +'</div>');
		}
	});
}

//页面渲染
function _templete(){

	var _listhtml = _.template($('#orders-tmpl').html())();

	$('.express-delivery-list').html(_listhtml);
}

//进入详情页面
function showDetail(order_id){
	window.location.href = "order_auth_detail.html?order_id="+order_id+"&auth_status="+cur_show;
}



