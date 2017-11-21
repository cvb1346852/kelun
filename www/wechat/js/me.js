//获取用户openid

$.getUserInfo('shipment',0,function(){
	//根据用户类型加载页面test
	var openid = userInfo.openid;
	var phone = userInfo.phone;
	var username=userInfo.username;
	var character = '';
	var button = '';
	var menu = '';
	switch (userInfo.user_type) {
		case '1': //销售
			menu += '<li class="item">';
			menu += '<a href="./erpbind.html?openid='+openid+'">';
			menu += '<img src="./img/my-acc-icos/shortcut_tianjiaguakao@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">绑定ERP</span>';
			menu += '</a>';
			menu += '</li>';
			/*menu += '<li class="item">';
			menu += '<a href="./order_auth.html?openid='+openid+'">';
			menu += '<img src="./img/my-acc-icos/shortcut_dingdanshouquan@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">订单授权</span>';
			menu += '</a>';
			menu += '</li>';*/
			menu += '<li class="item">';
			menu += '<a href="./orderList.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_dingdanqianshou@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">订单签收</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="../wechat/kelun/dist/#/getGoods?openid='+openid+'">';
			menu += '<img src="./img/my-acc-icos/shortcut_yaohuojihua@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">要货计划</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./appeallist.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/complain@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">投诉建议</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./logout.html?wechattype=consign&openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/setting@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">退出</span>';
			menu += '</a>';
			menu += '</li>';
			break;
		case '2': //代收人
			character += '个人会员';
			menu += '<li class="item">';
			menu += '<a href="./erpbind.html?openid='+openid+'">';
			menu += '<img src="./img/my-acc-icos/shortcut_tianjiaguakao@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">绑定ERP</span>';
			menu += '</a>';
			menu += '</li>';
			/*menu += '<li class="item">';
			menu += '<a href="./orderList.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_dingdanqianshou@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">订单签收</span>';
			menu += '</a>';
			menu += '</li>';*/
			menu += '<li class="item">';
			menu += '<a href="./appeallist.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/complain@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">投诉建议</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./logout.html?wechattype=consign&openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/setting@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">退出</span>';
			menu += '</a>';
			menu += '</li>';
			break;
		case '3':
			character += '我是司机';  
			button+='<a href="./driverSign.html?openid='+openid+'" class="weui-dialog__btn acc-sign-days">签到</a>';
			menu += '<li class="item">';
			menu += '<a href="javascript:;">';
			menu += '<img src="./img/my-acc-icos/keep-account@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">记账</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./calcDistance.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/ranging@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">计算运距</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./join_carrier.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/add-shop@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">加入承运商</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./addRoute.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/my-line@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">我的线路</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./appeallist.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/complain@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">投诉建议</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./orderSource.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_zuixinhuoyuan@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">我的货源</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="javascript:;">';
			menu += '<img src="img/my-acc-icos/hot-phone@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">热线客服</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./bidList.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_chechezhaobiao@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">车车招标</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./tender.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/my-bid@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">我的投标</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./report.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/up-thing@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">事件上报</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./appRecived.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/apply@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">申请签收</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./mygoal.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_wodejifen@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">我的得分</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./changeCarMsg.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/car-msg@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">车辆信息</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./logout.html?wechattype=shipment&openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/setting@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">退出</span>';
			menu += '</a>';
			menu += '</li>';
			break;
		case '4':
			character += '我是承运商';
			menu += '<li class="item">';
			menu += '<a href="./addNew.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_shenhejiaru@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">加入审核</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./myTruckSource.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/car-msg@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">我的车辆</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./addNewtruck.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_tianjiaguakao@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">添加挂靠</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./calcDistance.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/ranging@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">计算运距</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./appeallist.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/complain@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">投诉建议</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./tender.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/my-bid@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">我的投标</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./bidList.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_chechezhaobiao@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">车车招标</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./pickUp.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_wodeyundan@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">我的运单</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./source_distribution.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_pingtaicheyuan@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">常跑线路</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./orderSource.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_zuixinhuoyuan@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">我的货源</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./mygoal.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_wodejifen@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">我的得分</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./logout.html?wechattype=shipment&openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/setting@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">退出</span>';
			menu += '</a>';
			menu += '</li>';
			break;
		case '5':
			character += '我是调度';
			menu += '<li class="item">';
			menu += '<a href="./shipment.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_wodeyundan@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">我的运单</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./appeallist.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/complain@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">投诉建议</span>';
			menu += '</a>';
			menu += '</li>';
			/*menu += '<li class="item">';
			 menu += '<a href="./shipment.html?openid='+openid+'">';
			 menu += '<img src="img/my-acc-icos/shortcut_jididingdan@2x.png" class="ci-main-ico" />';
			 menu += '<span class="font">基地定单</span>';
			 menu += '</a>';
			 menu += '</li>';*/
			menu += '<li class="item">';
			menu += '<a href="./logout.html?wechattype=consign&openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/setting@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">退出</span>';
			menu += '</a>';
			menu += '</li>';
			break;
		case '6':
			character += '我是价格审批人';
			menu += '<li class="item">';
			menu += '<a href="./approve.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/shortcut_jiageshenpi@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">审批列表</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./appeallist.html?openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/complain@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">投诉建议</span>';
			menu += '</a>';
			menu += '</li>';
			menu += '<li class="item">';
			menu += '<a href="./logout.html?wechattype=consign&openid='+openid+'">';
			menu += '<img src="img/my-acc-icos/setting@2x.png" class="ci-main-ico" />';
			menu += '<span class="font">退出</span>';
			menu += '</a>';
			menu += '</li>';
			break;
		default:
			$.alert('获取用户信息错误');
	}
	// 加载页面内容
	//$('.character h3').html(character);
	$('.acc-phone').html(phone);
	$('.acc-name').html(username);
	$('.my-acc-list').html(menu);
	$('.my-acc-main').append(button);
	if(userInfo.user_type==3||userInfo.user_type==4||userInfo.user_type==2){
		$.sendData('carrier','updateActiveTime', {openid:openid,user_type:userInfo.user_type},'',function(json){

		});
	}	
});