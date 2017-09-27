//菜单列表
var menuList = [];
//我
menuList['my'] = {url:'me.html','title':'我','image':'../jquery_weui/images/icon_nav_cell.png'};
//签收
menuList['sign'] = {url:'orderList.html','title':'签收','image':'../jquery_weui/images/icon_nav_article.png'};
//订单授权
menuList['authorize'] = {url:'order_auth.html','title':'授权','image':'../jquery_weui/images/icon_nav_article.png'};
//订单
menuList['order'] = {url:'order.html','title':'要货计划','image':'../jquery_weui/images/icon_nav_article.png'};
//运单
menuList['shipment'] = {url:'shipment.html','title':'运单','image':'../jquery_weui/images/icon_nav_article.png'};
//提货单
menuList['pickUp'] = {url:'pickUp.html','title':'我的运单','image':'../jquery_weui/images/icon_nav_article.png'};
//投诉
menuList['complaint'] = {url:'complaint.html','title':'投诉','image':'../jquery_weui/images/icon_nav_msg.png'};
//查看货源
menuList['orderSource'] = {url:'orderSource.html','title':'货源','image':'../jquery_weui/images/icon_nav_article.png'};
//招投标
menuList['tender'] = {url:'tender.html','title':'招投标','image':'../jquery_weui/images/icon_nav_button.png'};
//我的车源
menuList['truckSource'] = {url:'myTruckSource.html','title':'我的车辆','image':'../jquery_weui/images/icon_nav_article.png'};
//转包上报
menuList['report'] = {url:'subcontract.html','title':'转包上报','image':'../jquery_weui/images/icon_nav_msg.png'};
//转包上报
menuList['audit'] = {url:'approve.html','title':'价格审批','image':'../jquery_weui/images/icon_nav_msg.png'};


//各角色菜单权限 index 与 user_connect表的user_Type对应

var roleMenus = [];
//销售
roleMenus[1] = ['authorize','sign','my'];
//代收人
roleMenus[2] = ['sign','my'];
//司机
roleMenus[3] = ['orderSource','tender','pickUp','my'];
//承运商
roleMenus[4] = ['orderSource','tender','truckSource','my'];
//基地、片区
roleMenus[5] = ['order','shipment','my'];
//基地、片区
roleMenus[6] = ['audit'];

