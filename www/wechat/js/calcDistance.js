
var openid='';
$.getUserInfo('shipment',0,function(){
    openid = userInfo.openid;
});

$(function() {
    //初始化出发地省份选择
    BindCity("");
    //初始化目的地省份选择
    BindCity1("");
});

$(function(){
    $('#btn-calc').on('click', function(){
        $(".result-mile").html("");
        var lng1="";var lat1="";var lng2="";var lat2="";var is_wait=true;
        var ddlProvince=$('#ddlProvince option:selected').val();
        var ddlCity=$('input[name="start-input"]').val();
        var toloProvince=$('#toloProvince option:selected').val();
        var toloCity=$('input[name="end-input"]').val();
        if (ddlProvince==''||ddlCity==''||toloProvince==''||toloCity=='') {
            $.hideLoading();
            $.alert('请输入完整的起点和终点!');
        }else {
            var param = '{"address":"'+ddlProvince+ddlCity+'","id":"1"}';
            $.sendData('api','getLngLatByAddressResult',{param:param},'',function(data){
                if(data.code == '0'){
                    $.hideLoading();
                    lng1 = data.lng;
                    lat1 = data.lat;
                    var param1 = '{"address":"'+toloProvince+toloCity+'","id":"2"}';
                    $.sendData('api','getLngLatByAddressResult',{param:param1},'',function(data1){
                        if(parseInt(data1.code) == 0){
                            $.hideLoading();
                            lng2 = data1.lng;
                            lat2 = data1.lat;
                            if (lng1==''||lat1==''||lng2==''||lat2=='') {
                                $.hideLoading();
                                $.alert('请输入完整的起点和终点!');
                            }else{
                                var param2 = '{"lng1":"'+lng1+'","lat1":"'+lat1+'","lng2":"'+lng2+'","lat2":"'+lat2+'","fromId":"123456789","toId":"987654321"}';
                                $.sendData('api','getDistanceByLngLatResult',{param:param2},'',function(result){
                                    if(parseInt(result.code) == 0){
                                        $.hideLoading();
                                        $(".result-mile").html(result.distance+"千米");
                                    }else{
                                        $.error(data.message);return false;
                                    }
                                });
                            }
                        }else{
                            $.error(data1.message+'--终点');return false;
                        }
                    });
                }else{
                    $.error(data.message+'--起点');return false;
                }
            });
        }
    });
});