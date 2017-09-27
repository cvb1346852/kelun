//翻页标记
var curPageNo = 1;
var pageSize = 5;
var is_end = false;
var loading = false;
var openid = '';
var phone='';
//页面数据
var allOrder = []
//加载订单数据
$.getUserInfo('shipment',0,function(){
    //微信ID
    openid = userInfo.openid;
    phone=userInfo.phone;
    /*if(userInfo.user_type != 1){
        $.error('无法取得用户信息');
        return false;
    }*/
    getAppeallList(phone);
});

//切换页面加载数据
$(function(){
    //滚动加载
    $('.have-the-goods-container').infinite().on("infinite", function() {
        //正在加载中
        if(loading) return;
        if(!is_end){
            getAppeallList(openid);
        }

    });
});

//加载数据函数
function getAppeallList(openid) {
    //翻页数据加载
    loading = true;
    //第一页先清除内容
    $.sendData('appeal', 'getAppeallList', {phone: phone,pageNo: curPageNo, pageSize: pageSize}, '', function(json){
        loading = false;
        if (json.code == 0) {
            var data = json.data;
            curPageNo ++;
            if (data.result.length > 0) {
                allOrder = allOrder.concat(data.result);
                $.each(allOrder, function(i, item){
                    if(item.result==0){
                        allOrder[i].result='未判定';
                    }else if(item.result==1){
                        allOrder[i].result='成立';
                    }else if(item.result==2){
                        allOrder[i].result='不成立';
                    }
                    if(item.responsible_name==""){
                        item.responsible_name='-';
                    }
                    if(item.responsible_type==1){
                        allOrder[i].responsible_type='承运商';
                    }else if(item.responsible_type==2){
                        allOrder[i].responsible_type='基地';
                    }
                });
                is_end = allOrder.length < data.totalCount ? false : true;
                _templete();
            } else {
                $('.have-the-goods-container').html('<div class="weui_cells_tips null-notice">暂无投诉信息</div>');
            }
        } else {
            $('.have-the-goods-container').html('<div class="weui_cells_tips null-notice">暂无投诉信息</div>');
        }
    });
}

//页面渲染
function _templete(){

    var _listhtml = _.template($('#orders-tmpl').html())();

    $('.have-the-goods-container').html(_listhtml);
}

//进入详情页面
function appeal(){
    window.location.href = "appeal.html?openid="+openid+"&phone="+phone;
}



