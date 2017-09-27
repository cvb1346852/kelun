var isweixin = isWeixin();
var jdata=[];
var openid='';
$.getUserInfo('shipment',0,function(){
     openid = userInfo.openid;
    if(userInfo.user_type!=3){
        $('.body').hide();
        $.alert('用户信息错误');
        return false;
    }
    getRouteList(openid);
});


$(function() {
    //初始化出发地省份选择
    BindCity("");   
    //初始化目的地省份选择
    BindCity1("");   
});

function getRouteList(openid){
    
    $.sendData('shipment','getRouteList',{openid:openid},'shipment',function(data){
        $('#tblMain').html('');
        if(!jQuery.isEmptyObject(data)){
            jdata=data;
            _templete();
        }else{
            $('#tblMain').html('<div style="height:40px;color:#ccc;text-align:center;margin-top:20px;">暂无线路</div>');
        }
    });
}

function del(id){
    $('#iosDialog1').show();
    $('#id').val(id);
}

$(document).on('click','#cancel',function(){
    $('#iosDialog1').hide();
});
$(document).on('click','#confirm',function(){
    var id=$('#id').val();
    $.sendData('shipment','delDriverRoute',{id:id},'',function(json){
        if(parseInt(json.code) == 0){
            $('#ok').html('<div class="dia-font-area"><i class="weui-icon-success weui-icon_msg font-item"></i></div>'+json.msg);
            $('#androidDialog1').show();
            setTimeout("location.reload()",1500);
        }else{
            $('#ok').html('<div class="dia-font-area"><i class="weui-icon-success weui-icon_msg font-item"></i></div>'+json.msg);
            $('#androidDialog1').show();
            setTimeout("location.reload()",1500);
        }
    });
});

$(function(){
    $('#showTooltips').on('click', function(){
        $('#openid').val(openid);

        var data = $("#checkout").serialize();
        var ddlProvince=$('#ddlProvince option:selected').val();
        var ddlCity=$('#ddlCity option:selected').val();
        var toloProvince=$('#toloProvince option:selected').val();
        var toloCity=$('#toloCity option:selected').val();
        if (ddlProvince==''||ddlCity==''||toloProvince==''||toloCity=='') {
            $.hideLoading();
            $('#ok').html('<div class="dia-font-area"><i class="weui-icon-success weui-icon_msg font-item"></i></div>'+'请输入完整的起点和终点');
            $('#androidDialog1').show();
        }else {
            $.sendData('shipment','saveDriverRoute',data,'',function(json){
                
                if(parseInt(json.code) == 0){
                    $.hideLoading();
                    $('#ok').html('<div class="dia-font-area"><i class="weui-icon-success weui-icon_msg font-item"></i></div>'+json.msg);
                    $('#androidDialog1').show();
                    setTimeout("location.reload()",1500);
                }else if(parseInt(json.code) == 1){
                    $('#ok').html('<div class="dia-font-area"><i class="weui-icon-success weui-icon_msg font-item"></i></div>'+json.msg);
                    $('#androidDialog1').show();
                    setTimeout("location.reload()",1500);
                }else{
                    $('#ok').html('<div class="dia-font-area"><i class="weui-icon-success weui-icon_msg font-item"></i></div>'+json.msg);
                    $('#androidDialog1').show();
                    setTimeout("location.reload()",1500);
                }
                //$.openPopup('#full');

            });
        }
    });
});
function iKnow(){
    $('#androidDialog1').hide();
    $('#iosDialog1').hide();
}
function _templete(){

    var _listhtml = _.template($('#orders-tmpl').html())();

    $('#tblMain').html(_listhtml);
}