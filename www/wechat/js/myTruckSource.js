var openid = "";
var jdata;
//翻页标记
var curPageNo = 1;
var pageSize = 10;
//加载标记
var loading = false;
$.getUserInfo('shipment',0,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type == 4){
        getTrucks(userInfo.phone, 4, openid, curPageNo, pageSize);
    }else if(userInfo.user_type == 3){
        window.location.href = 'join_carrier.html?openid='+openid;
    }else{
        $(".button_sp_area").hide();
        $('.tab').html('<div class="weui_cells_tips null-notice">暂时没数据</div>');
        $('.weui-infinite-scroll').addClass('hide');
        return false;
    }
});
$(function(){
    var $searchBar = $('#searchBar'),
        $searchResult = $('#searchResult'),
        $searchText = $('#searchText'),
        $searchInput = $('#searchInput'),
        $searchClear = $('#searchClear'),
        $searchCancel = $('#searchCancel');

    function hideSearchResult(){
        $searchResult.hide();
        $searchInput.val('');
    }
    function cancelSearch(){
        hideSearchResult();
        $searchBar.removeClass('weui-search-bar_focusing');
        $searchText.show();
    }

    /*$searchText.on('click', function(){
        $searchBar.addClass('weui-search-bar_focusing');
        $searchInput.focus();
    });
    $searchInput
        .on('blur', function () {
            if(!this.value.length) cancelSearch();
        })
        .on('input', function(){
            if(this.value.length) {
                $searchResult.show();
            } else {
                $searchResult.hide();
            }
        })
    ;
    $searchClear.on('click', function(){
        hideSearchResult();
        $searchInput.focus();
    });
    $searchCancel.on('click', function(){
        cancelSearch();
        $searchInput.blur();
    });*/
});
function addNewtruck(){
     window.location.href = 'addNewtruck.html?openid='+openid;
}
function addNew(){
     window.location.href = 'addNew.html?openid='+openid;
}
function distribution(){
     window.location.href = 'source_distribution.html?openid='+openid;
}
//加载数据函数
function getTrucks(phone,type,openid, pageNo, pageSize) {
     var pageNo = pageNo ? pageNo : 1;
     var pageSize = pageSize ? pageSize : 10;
    //第一页先清除内容
    $.sendData('truck_source', 'search_wechat', {openid: openid,pageNo: pageNo, pageSize: pageSize,status : 3}, 'truck_source', function(data){
        var trucks = data.result;
        curPageNo ++;
        if ( trucks &&  trucks.length > 0) {
            jdata = trucks;
            $.each(trucks, function(i, item) {
                  var html ='';
                html+=' <div class="changeui-weui-panel" onclick=showTable("'+item.id+'","'+item.carnum+'")>';
                html+='   <p class="changeui-list-title">'+item.carnum+'</p><div class="weui-flex"><div class="weui-flex__item"><div class="weui-flex changeui-list-inner-item">';
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
                html+= '<span class="" id="car_' + item.id + '"></span>';
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
            html+='<div class="weui_cells_tips null-notice">暂无车源</div>';
            $('#tblMain').append(html);
        };
    });
};


//滚动加载
$('.my-car-list-container').infinite().on("infinite", function() {
    if(loading) return;
    //翻页数据加载
    
    if(jdata.length >= pageSize){
        getTrucks(userInfo.phone, 4, openid, curPageNo, pageSize);
    }else{
    	loading = true;
    }
});

function showTable(rId,carNum){
    $('#androidDialog2').show(true);
    $("#rid").val(rId);
    $("#carnum").html(carNum);
}

function closeTable(){
    var  $androidDialog2 = $('#androidDialog2');;
    $androidDialog2.fadeOut(200);
}


function pushCarrier(){
    $('#androidDialog2').hide();
    $.showLoading('正在操作中...');
    searchParams = $("#frmSearch").serializeArray();
    searchParams.push( {'name':'openid','value': openid});
    $.sendData('truck_source','delcar_wechat',searchParams, 'truck_source', function(data){
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
    window.location.href = 'myTruckSource.html?openid='+openid+'&m='+10000*Math.random();

}