//获取用户openid
var urlParams = $.getUrlParams(window.location.search);
var userName = '';
var openid = '';
var erpType = '';
var erpTypeName ='';

$(function(){
	$.getUserInfo('shipment',0,function(){
		// 检查用户是否绑定
		openid = userInfo.openid;
		$.sendData('user', 'bindCheck', {openid: openid}, '', function(json){
			if (json.code == 1) {
				$.alert(json.msg);
			} else {
				//根据绑定情况展示页面内容
				getHtml('base', json.data.base_user_name);
				getHtml('area', json.data.area_user_name);
			}
		});
	});


});

//绑定操作
function bind(type){
	user_name = $('#username_'+type).val();
	password = $('#password_'+type).val();
	$.showLoading('正在验证账号...');
	$.sendData('user','erpBind', {type: type, openid: openid, username: user_name, password: password},'', function(json) {
		$.hideLoading();
		if (json.code == 1) {
			$('#password_'+type).val("");
			$.alert(json.msg);
			return false;
		} else {
			if(json.type == "base"){ 
			  $.toast("绑定基地ERP成功！");
			}else if(json.type == "area"){ 
			  $.toast("绑定片区ERP成功！");
			}
			getHtml(type, user_name);
		}
	});
}

//解绑操作
function unbinderp(type){
	var typeName = type == 'base' ? '基地' : '片区';
	$.confirm("您确定要解除绑定"+typeName+"ERP账号吗？", "解除绑定", function() {
		$.showLoading('正在进行解绑...');
		$.sendData('user', 'erpUnbind', {type: type, openid: openid}, '', function(json){
			$.hideLoading();
			if (json.code == 1) {
				$.alert(json.msg);
				return false;
			} else {
				$.toast("解除绑定成功！");
				getHtml(type, '');
			}
		});
	}, function() {
		//取消操作
	});
};

//初始化页面展示函数
function getHtml(type, user_name){
	userName = user_name;
	erpType = type;
	erpTypeName = erpType == 'area' ? '片区' : '基地';
	if(user_name != '' && user_name != undefined){
		var html = _.template($('#unbind_tmp').html())();
		$('#'+type).html(html);
	}else{
		var html = _.template($('#bind_tmp').html())();
		$('#'+type).html(html);
	}

}