var openid = null;
var jdata=[];
var cheackOut = 1;
//翻页标记
var curPageNo = 1;
var pageSize = 10;
var totalCount;
//加载标记
var loading = false;
    //获取用户openid
$.getUserInfo('consign',0,function(){
    //微信ID;
    openid = userInfo.openid
    if(userInfo.user_type != 6){
        $("#about").hide();
        $.alert("获取用户信息失败");
        return false;
    }else{
        getTrucks(userInfo.phone, 1, openid, curPageNo, pageSize);
    }
});

$(".weui-navbar__item").on('click', function() {
       jdata=[];
       $('.history-mission-list').html('');
       $.showLoading('数据获取中...');
       $('.weui-navbar__item').removeClass('weui-bar__item_on');
       $(this).addClass('weui-bar__item_on');
       var cur_show = $(this).text().trim() == '未审核' ? 1:2;
       cheackOut = cur_show;
       //初始化显示参数
       curPageNo = 1;
       loading = false;
       getTrucks(userInfo.phone, cur_show,openid,curPageNo, pageSize);
});
//加载数据函数
function getTrucks(phone,cur_show,openid, pageNo, pageSize) {
    //第一页先清除内容
    $.sendData('tender', 'getApproveList', {phone : phone, checkout: cur_show, openid: openid,pageNo: pageNo, pageSize: pageSize}, 'tender', function(data){
        $.hideLoading();
        totalCount = data.totalCount;
        if ( data.result &&  data.result.length > 0) {
            jdata = jdata.concat(data.result);
            curPageNo ++;
            if(Math.ceil(totalCount/pageSize) >= curPageNo){
              loading=false;
            }
            
            _templete();
        }else {
            $('.history-mission-list').html('<div class="weui_cells_tips null-notice">暂无投标信息</div>');
        }
    });
};


function _templete(){
          var _listhtml = _.template($('#approve-tmpl').html())();
          $('.history-mission-list').html(_listhtml);
}

//滚动加载
$('.container').infinite().on("infinite", function() {
          if(loading) return;
          //翻页数据加载
          loading = true;
          cur_show = cheackOut;
          if(Math.ceil(totalCount/pageSize) > (curPageNo-1)){
          getTrucks(userInfo.phone, cur_show,openid,curPageNo, pageSize);
    }

});


function goto(param){
   window.location.href = param;
}