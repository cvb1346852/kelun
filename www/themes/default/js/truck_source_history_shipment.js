/**
 * Author ZHM
 * 2016-7-12
 */ 
var params = $ips.getUrlParams();
var userinfo = $ips.getCurrentUser();
var userRole = '';
$(function() {
    //初始化出发地省份选择
    BindCity("");   
    //初始化目的地省份选择
    BindCity1("");   
});
$ips.include('/js/poshytip/tip-white/tip-white.css');
$ips.include('/js/hui/jquery.hui.grid.js');
// 搜索按钮
$("#btnSearch").click(function() { 
    $('#shipmentTbl').grid("fnPageChange", "first");
}); 
//验证身份
$ips.load('shipment', 'getRole', {orgcode:userinfo.organ.orgcode}, function(data){
    if (data.code == 1) {
        userRole = data.role;
        if (userRole == 'warehouse') {
            $(".operating-button").append('<div class="btn-group"><a href="javascript:void(0)" id="dispatch-button" class="btn btn-default btn-only-one" data-toggle="modal" data-target="#dispatch">订车</a></div>');
        }
    } 
    //展示运单列表
    loadScript('js/hui/jquery.hui.grid.js', function () {
        $('#shipmentTbl').grid({
            "aoColumns" : [  
                {sTitle: "车牌号", sName: "carnum","bSortable": false},
                {sTitle: "车长", sName: "car_length","bSortable": false},
                {sTitle: "箱型", sName: "carriage_type","bSortable": false},
                {sTitle: "额定载重", sName: "rated_load","bSortable": false},
                {sTitle: "司机姓名", sName: "driver_name","bSortable": false},
                {sTitle: "联系方式", sName: "driver_phone","bSortable": false},
                {sTitle: "当前位置", sName: "address","bSortable": false}
            ],
            "fnServerData" : function(sSource, aoData, fnCallback) {
                var searchParams = $("#frmSearch").serializeArray();
                $ips.gridLoadData(sSource, aoData, fnCallback,"truck_source","getHistorytruck",searchParams,function(data) {
                    if(data.result.length < 0){
                            $("#table-product_detail").html("<h3 style=\"text-align:center\">暂无承运车辆信息</h3>");
                    }
                    data.result = data.result ? data.result : [];
                    $.each(data.result, function(i, item) {
                        item.address =  '<input id="car_' + item.id + '" type="hidden" >';
                        $ips.load("truck_source", "getAddressList", {driver_phone: item.driver_phone, type: item.type, carnum: item.carnum}, function(data) {
                            if(data!= null && data != undefined){
                                if(item.type == 1){
                                    $("#car_"+item.id).parent().html(data ? data.address : '暂无定位');
                                }else if(item.type == 2){
                                    $("#car_"+item.id).parent().html(data.msg ? data.msg : '暂无定位');
                                }
                            }
                            else{
                                $("#car_"+item.id).parent().html('暂无定位');
                            }

                        });
                    });



                });
            },

        });
    });

});

 
 