var openid = "";
$.getUserInfo('consign',1,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type != 3){
        $("#about").hide();
        $.alert("获取用户信息失败");
        return false;
    }else{
        getTrucks(userInfo.phone, 3, openid, curPageNo, pageSize);
    }
});
//加载底部菜单
buildFooter();
var curPageNo = 1;
var pageSize = 10;
var truck_id = "";
//加载数据函数
function getTrucks(phone,type,openid, pageNo, pageSize) {
    var pageNo = pageNo ? pageNo : 1;
    var pageSize = pageSize ? pageSize : 10;
    //第一页先清除内容
    $.sendData('truck_source', 'search_carrier_driver', {openid: openid,pageNo: pageNo, pageSize: pageSize}, 'truck_source', function(data){
        var trucks = data.result;
        truck_id = data.truck_id;
        if (pageNo == 1) $('.tab').html(' <table class="table"><th>省份</th><th>物流公司</th><th>联系人</th><th>手机号</th></table>');
        $('.weui-infinite-scroll').removeClass('hide');
        if (trucks && trucks.length > 0) {
            //判断是否还有下一页
            if (data.pageNo * data.pageSize < data.totalCount) {
                curPageNo += 1;
                loading = false;
            } else {
                loading = true;
                $('.weui-infinite-scroll').addClass('hide');
            }
            $.each(trucks, function(i, item){
                $('.table').append('<tr onclick=showTable("'+item.id+','+item.status+','+item.status+'")><td>'+item.province+'</td><td>'+item.carrier_name+'</td><td>'+item.relation_person+'</td><td>'+item.relation_phone+'</td></tr>');
            });
        } else {
            $('.tab').html('<div class="weui_cells_tips null-notice">暂无挂靠承运商</div>');
            $('.weui-infinite-scroll').addClass('hide');
        }
    });
};
function showTable(driver_name){
    arr = driver_name.split(",");
    var carrier_id = arr[0];
    var status_name = arr[1];
    window.location.href = 'carrier_info.html?openid='+openid+'&carrier_id='+carrier_id+'&status='+status_name;
}
var nameStr = "";
var val;
function searchcarrier(){
    $("#home-city").cityPicker({
        title: "省份 &nbsp;&nbsp;&nbsp;&nbsp; 承运商",
        showDistrict: false
    });
};
/*获取省份下的承运商列表*/
$.sendData('truck_source', 'getprovincelist',{openid: openid}, 'truck_source',function(data){
    val = data;
    loadScript('./js/city-picker.js');
});
/*选择了省份加入数据库*/
function confirmcarrier(){
    searchParams = $("#frmSearch").serializeArray();
    $.sendData('truck_source', 'confirmcarrier', {searchParams: searchParams,openid : openid }, 'truck_source', function(data){
        if (data.code == 1) {
            $.toast("添加成功");
            setTimeout("location.reload()",1500);
        } else if(data.code == 0) {
            $.toast("添加失败，请勿重复添加");
        } else if(data.code == 2) {
            $.toast("添加失败");
        }
    });
}















