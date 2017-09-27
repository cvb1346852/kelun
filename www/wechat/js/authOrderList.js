//翻页标记
var curPageNo = 1;
var pageSize = 5;
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
	getOrders(openid);
});

//切换页面加载数据
$(function(){
	//滚动加载
	$('.container').infinite().on("infinite", function() {
		//正在加载中
		if(loading) return;
		if(!is_end){
			getOrders(openid);
		}

	});
});

//加载数据函数
function getOrders(openid) {
	//翻页数据加载
	loading = true;
	//第一页先清除内容
	$.sendData('order', 'getAuthOrders', {openid: openid,pageNo: curPageNo, pageSize: pageSize}, '', function(json){
		loading = false;
		if (json.code == 0) {
			var data = json.data;
			curPageNo ++;
			if (data.result.length > 0) {
				allOrder = allOrder.concat(data.result);
				is_end = allOrder.length < data.totalCount ? false : true;
				_templete();
			} else {
				$('.have-the-goods-container').html('<div class="weui_cells_tips null-notice">暂无订单</div>');
			}
		} else {
			$('.have-the-goods-container').html('<div class="weui_cells_tips null-notice">'+ json.msg +'</div>');
		}
	});
}

//页面渲染
function _templete(){

	var _listhtml = _.template($('#orders-tmpl').html())();

	$('.have-the-goods-container').html(_listhtml);
}

//进入详情页面
function showDetail(id){
	window.location.href = "authOrderDetail.html?id="+id+'&openid='+openid;
}



