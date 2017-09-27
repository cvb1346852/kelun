var urlParam = $.getUrlParams();
var openid='';
var allOrder = [];
//加载订单数据
$.getUserInfo('consign',0,function(){
	//微信ID
	openid = userInfo.openid;
	if(userInfo.user_type != 1){
		$.error('无法取得用户信息');
		return false;
	}
	getOrders(urlParam.id);
});


//加载数据函数
function getOrders(id) {
	//翻页数据加载
	loading = true;
	//第一页先清除内容
	$.sendData('order', 'getAuthOrderDetail', {id:id,openid:openid}, '', function(json){
		if (json.code == 0) {
			allOrder =json.data;
			_templete();
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
	window.location.href = "authOrderDetail.html?id="+id;
}



