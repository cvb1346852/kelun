var urlParams = $.getUrlParams(window.location.search);
var wechatType = 'shipment';
if (urlParams.wechattype != undefined && urlParams.wechattype != '') {
	wechatType = urlParams.wechattype;
}

//根据用户类型显示logo
if (wechatType == 'shipment') {
	$('.logo-img').attr('src','img/my-acc-icos/kelun_logo@1x.png');
} else {
	$('.logo-img').attr('src','img/my-acc-icos/kelun_logo@2x.png');
}

$.getUserInfo(wechatType,0,function(){
	var openid = userInfo.openid;
	if (openid != undefined && openid != '') {
		//检查是否已经登录
		$.sendData('user', 'checkLogin', {openid: openid}, wechatType, function(json){
			if (json.code == 0) {
				if (json.islogin === true) {
					if(json.user_type == 6){
						window.location.href = './approve.html?openid='+openid
					}else {
						window.location.href = './me.html?openid=' + openid;
					}
				}
			} else {
				$.alert(json.msg);
			}
		});

		var register_url = 'addCarMsg.html?openid='+openid;
		$('.register').attr('href',register_url);
		if(wechatType == 'shipment'){
			$('.register_div').css('display','block');
		}
	} else {
		$.alert('获取用户信息失败');
	}
},'login');
//发送验证码
$('#send_msg').on('click', function(){
	//参数判断
	if($(this).html()!="获取验证码"){
		return false;
	}
	var phone = $('#phone').val();
	if (phone == '' || phone == undefined) {
		$.alert('请输入手机号');
	} else {
		$.showLoading();
		$.sendData('user','sendMsg',{wechatType: wechatType, phone: phone},'',function(json){
			$.hideLoading();
			if (json.code == 0) {
				$("#login").attr("type", json.type);
				sendCode();
			} else {
				$.alert(json.msg);
			}
		});
	}
});
//注册绑定 
$('#login').on('click', function(){
	// 参数判断
	var phone = $('#phone').val();
	var verify_code = $('#verify_code').val();
	if (phone == '' || phone == undefined) {
		$.alert('请输入手机号');
	} else if (verify_code == '' || verify_code == undefined) {
		$.alert('请输入验证码');
	} else {
		//获取用户类型
		var type = $("#login").attr("type");
		$.showLoading();
		$.sendData('user', 'wechatLogin', {type: type, openid: userInfo.openid, phone: phone, verify_code: verify_code}, '', function(json){
			$.hideLoading();
			if (json.code == 0) {
				$.alert('登陆成功！');
				if(type == 6){
					window.location.href = './approve.html?openid='+userInfo.openid;
				}else {
					window.location.href = './me.html?openid=' + userInfo.openid;
				}
			} else {
				$.alert(json.msg);
			}
		});
	}
});
var clock = '';
var nums = 180;
var btn;
function sendCode()
{
	clock = setInterval(doLoop, 1000); //一秒执行一次
}
function doLoop()
{
	nums--;
	if(nums > 0){
		$("#send_msg").addClass("weui-btn_disabled");
		$("#send_msg").html("("+nums+"s)后再获取");
	}else{
		clearInterval(clock); //清除js定时器
		$("#send_msg").removeClass("weui-btn_disabled");
		$("#send_msg").html("获取验证码");
		nums = 60; //重置时间
	}
}
