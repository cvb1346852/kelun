var urlParams = $.getUrlParams(window.location.search);
var openid = '';
if (urlParams.openid != undefined && urlParams.openid != '') {
	openid = urlParams.openid;
}else{
	$.error('无法获得用户信息');
}

//退出登录
$('#logout').on('click', function(){
	// 参数判断
	$.showLoading();
	$.sendData('user', 'wechatLogout', {openid: openid}, '', function(json){
		$.hideLoading();
		if (json.code == 1) {
			$.alert('退出成功！');
			window.location.href = './login.html?wechatType='+urlParams.wechattype+'&openid='+openid;
		} else {
			$.alert(json.message);
		}
	});
});