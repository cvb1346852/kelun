var jdata = [];
var openid = "";
var curPageNo = 1;
var pageSize = 10;
var truck_id = "";
loading = false;
$.getUserInfo('consign',0,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type != 3){
        $("#about").hide();
        $.alert("获取用户信息失败");
        return false;
    }else{
        $('.history-mission-list').html('<div class="weui_cells_tips null-notice">数据加载中...</div>');
        getTrucks(userInfo.phone, 3, openid, curPageNo, pageSize);
    }
});


function getTrucks(phone,type,openid, pageNo, pageSize) {
    var pageNo = pageNo ? pageNo : 1;
    var pageSize = pageSize ? pageSize : 10;
    //第一页先清除内容
    $.sendData('truck_source', 'search_carrier_driver', {openid: openid,pageNo: pageNo, pageSize: pageSize}, 'truck_source', function(data){
        truck_id = data.truck_id;
        jdata = jdata.concat( data.result);
          if (jdata && jdata.length > 0) {
            curPageNo ++;
            _templete();
        } else {
            $('.history-mission-list').html('<div class="weui_cells_tips null-notice">暂无挂靠承运商</div>');
        }
    });
};

function _templete(){

    var _listhtml = _.template($('#join-tmpl').html())();

    $('.history-mission-list').html(_listhtml);
}

//滚动加载
$('.container').infinite().on("infinite", function() {
    if(loading) return;
    //翻页数据加载
    loading = true;
    if(jdata.length >= 10){
        getTrucks(userInfo.phone, 3, openid, curPageNo, pageSize);
    }

});
/*获取省份下的承运商列表*/
var pdata = [];
var citydata = [];
$.sendData('truck_source', 'getprovincelist',{openid: openid}, '',function(data){
	
	pdata = data;
	
	var $select1 = $('select[name="city"]');
	var $select2 = $('select[name="carriername"]');
	
	//init
	
	//
	var _listhtml = _.template($('#select-tmpl').html())();
	$select1.append(_listhtml);
    
    //
	$select1.on('change',function(){
        citydata = [];
    	var $this = $(this);
    	for(var i =0;i<pdata.length;i++){
    		if(pdata[i].province == $this.val() ){
    			citydata = pdata[i];
    		}
    	}
    	
    	//
    	$select2.html(_.template($('#select2-tmpl').html())());
    	
    });
    
});
/*选择了省份加入数据库*/
function confirmcarrier(){
   if( ($('select[name="city"]').val() == "0") || ( $('select[name="carriername"]').val() == "0" )  ){
       $.toast("数据未选择完整");
       return ;
   }
    var searchParams = $("#search_form").serializeArray();
    $.sendData('truck_source', 'confirmcarrier', {searchParams: searchParams,openid : openid }, 'truck_source', function(data){
        if (data.code == 1) {
            $.toast(data.message);
            setTimeout("location.reload()",1500);
        } else  {
            $.toast(data.message,"cancel");
        }
    });
}
function carrierInfo(params){
 window.location.href = 'carrier_info.html'+params;
}