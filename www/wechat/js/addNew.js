
//获取用户openid
$.getUserInfo('shipment',0,function(){
    //微信ID 
    openid = userInfo.openid;
    if(userInfo.user_type != 4){
            $("#about").hide();
            $.alert("获取用户信息失败"); 
            return false;
    }else{
      getTrucks(userInfo.phone, 4, openid, curPageNo, pageSize); 

    }
});
//加载底部菜单
buildFooter();
//翻页标记
var curPageNo = 1;
var pageSize = 10;
//加载标记
var loading = false;
//加载车源数据  
//滚动加载
$(document.body).infinite().on("infinite", function() {
    if(loading) return;
    //翻页数据加载
    loading = true;
    getTrucks(userInfo.phone, 4, openid, curPageNo, pageSize);

});  
//车源id
var id;
//加载数据函数
function getTrucks(phone,type,openid, pageNo, pageSize) { 
     var pageNo = pageNo ? pageNo : 1;
     var pageSize = pageSize ? pageSize : 10;
    //第一页先清除内容
    $.sendData('truck_source', 'search_wechat', {openid: openid,pageNo: pageNo, pageSize: pageSize,status : 1}, 'truck_source', function(data){
        trucks = data.result;
        curPageNo ++;
        if ( trucks &&  trucks.length > 0 ) {
            $.each(trucks, function(i, item) {
                var html ='';
                html+=' <div class="changeui-weui-panel"  onclick=showTable("'+item.driver_name+','+item.driver_phone+','+item.city+','+item.carnum+'")>';
                html+='   <p class="changeui-list-title">'+item.carnum+'</p><div class="weui-flex"><div class="weui-flex__item"><div class="list-item-mark-Coral" id="statusColor">待审核</div><div class="weui-flex changeui-list-inner-item">';
                html+='   <div class="weui-flex__item text-right text-right-item">车长：</div>';
                html+=' <div class="weui-flex__item">'+item.car_length+'</div>';
                html+='   </div><div class="weui-flex changeui-list-inner-item">';
                html+='   <div class="weui-flex__item text-right text-right-item">箱型：</div>';
                html+=' <div class="weui-flex__item">'+item.carriage_type+'</div></div></div><div class="weui-flex__item"><div class="weui-flex changeui-list-inner-item">';
                html+='    <div class="weui-flex__item text-right text-right-item">重量：</div>';
                html+='  <div class="weui-flex__item">'+item.rated_load+'</div>';
                html+='  </div>';
                html+='  <div class="weui-flex changeui-list-inner-item">';
                html+='     <div class="weui-flex__item text-right text-right-item">司机：</div>';
                html+=' <div class="weui-flex__item">'+item.driver_name+'</div></div></div></div><div class="changeui-signle-line"></div><div class="weui-flex">';
                html+='  <div class="weui-flex__item">';
                html+='  <div class="text-center">';
                html+='  <i class="c-iconfont phone-ico">&#xe601;</i>';
                html+='  <span class="vl-m">'+item.driver_phone+'</span>';
                html+='   </div>';
                html+='  </div>';
                html+='  <div class="weui-flex__item">';
                html+='   <div class="text-center">';
                html+='  <i class="c-iconfont map-ico">&#xe600;</i>';
                html+= '<span class="vl-m" id="car_' + item.id + '"></span>';
                $.sendData("truck_source", "getAddressList", {driver_phone: item.driver_phone, type: item.type, carnum: item.carnum},'consign',function(data) {
                    if(data!= null && data != undefined){
                        if(item.type == 1){
                            $("#car_"+item.id).html(data ? data.address : '暂无定位');
                        }else if(item.type == 2){
                            $("#car_"+item.id).html(data.msg ? data.msg : '暂无定位');
                        }

                    }
                    else{
                        $("#car_"+item.id).html('暂无定位');
                    }

                });
                html+='   </div>';
                html+='   </div>';
                html+='   </div>';
                html+='   </div>';
                $('#tblMain').append(html);
            });
        }else{
            var html ='';
            html+='<div class="weui_cells_tips null-notice">暂无审核信息</div>';
            $('#tblMain').append(html);
        };
    });
};
var arr="" ;
/*function showTable(driver_name){
   arr = driver_name.split(",")
   $("#driver_name").html(arr[0]);
   $("#driver_phone").html(arr[1]);
   $("#city").html(arr[2]);
   $("#about").popup();  
} */
function showTable(driver_name){
    $('#androidDialog2').show(true);
    arr = driver_name.split(",")
    $("#driver_name").html(arr[0]);
    $("#driver_phone").html(arr[1]);
    $("#city").html(arr[2]);
    $("#carnum").html(arr[3]);
    $(function(){
        var  $androidDialog2 = $('#androidDialog2');;
        $('#showAndroidDialog2').on('click', function(){
            $androidDialog2.fadeIn(200);
        });
    });
}
/*加入承运商*/
function pushCarrier(){
    $('#androidDialog2').hide();
    $.showLoading('正在操作中...');
    searchParams = $("#frmSearch").serializeArray();
    var driver_phone = arr[1];
      $.sendData('truck_source','pushCarrier', {driver_phone: driver_phone,openid : openid,type:"ok"}, 'truck_source', function(data){
          $.hideLoading();
            if (data) {
                $.toast("操作成功");
                setTimeout("gotolist()",1500);
            } else {
                $.toast("操作失败");
                setTimeout("gotolist()",1500);
            }
    }); 
}
  /*不同意加入承运商*/
function NopushCarrier(){
    $('#androidDialog2').hide();
    $.showLoading('正在操作中...');
     searchParams = $("#frmSearch").serializeArray();
    var driver_phone = arr[1];
      $.sendData('truck_source', 'pushCarrier', {driver_phone: driver_phone,openid : openid,type:"no"}, 'truck_source', function(data){
          $.hideLoading();
            if (data) {
              $.toast("操作成功");  
               setTimeout("gotolist()",1500);
            } else {
              $.toast("操作失败");
                setTimeout("gotolist()",1500);
            }
    }); 
}
function gotolist(){
    window.location.href = 'addNew.html?openid='+openid+'&m='+10000*Math.random();

}