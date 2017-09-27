var urlParam = $.getUrlParams();
var openid='';
//加载订单数据
$.getUserInfo('consign',0,function(){
	//微信ID
	openid = userInfo.openid;
	/*if(userInfo.user_type != 1){
		$.error('无法取得用户信息');
		return false;
	}*/
});
//投诉
function confirm(){
	$.showLoading('正在完成投诉...');
	var phone=urlParam.phone;
	var content=$('#content').val();
	var user_phone=$('#user_phone').val();
	if($.trim(content)==''){
		$.hideLoading();
		$.toast('投诉内容不能为空!','forbidden');
		return false;
	}
	if(user_phone==''){
		$.hideLoading();
		$.toast('手机号不能为空!','forbidden');
		return false;
	}
	if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i.test(user_phone)){
		$.hideLoading();
		$.toast('手机号码格式不正确!','forbidden');
		return false;
	}
	$.sendData('appeal','saveAppeal', {phone:phone,user_phone:user_phone,content:content},'',function(json){
                
        if(parseInt(json.code) == 0){
            $.hideLoading();
            $.alert(json.msg);
            setTimeout("gotolist()",1500);
        }else if(parseInt(json.code) == 1){
            $.hideLoading();
            $.alert(json.msg);
        }
        //$.openPopup('#full');

    });

}
function gotolist(){
    window.location.href = "appeallist.html?openid="+openid
}


