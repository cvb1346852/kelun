/**
 * Author ZHM
 * 2016-7-12
 */
var params = $ips.getUrlParams();
var btnMoreSearch = $("#btnMoreSearch");
var userinfo = $ips.getCurrentUser();
var userRole = '';
$ips.include('/js/poshytip/tip-white/tip-white.css');
// 搜索按钮
$("#btnSearch").click(function() {
    $('#shipmentTbl').grid("fnPageChange", "first");
}); 
/*加载出发地*/
$(function() {
    //初始化出发地省份选择
    BindCity("");

    //加载基地选择框
    $("#warehouse_name").select2({
        placeholder: "选择基地名称",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('truckfuture', 'getWarehouseNameList',{warehouse_name: e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.id, text: y.name});
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    });
});
//获取查询条件
function genSearchParams(){
    var searchParams = $("#frmSearch").serializeArray();
    searchParams.push({name: "orgcode", value:userinfo.organ.orgcode});
    searchParams.push({name: "userrole", value:userRole});
    return searchParams;
}

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
                {sTitle: "司机姓名", sName: "driver_name","bSortable": false},
                {sTitle: "手机号码", sName: "driver_phone","bSortable": false},
                {sTitle: "出发地", sName: "fromlocation","bSortable": false},
                {sTitle: "目的地", sName: "tolocation","bSortable": false},
                {sTitle: "里程", sName: "distance","bSortable": false},
                {sTitle: "计划发车时间", sName: "plan_leave_time","bSortable": true},
                {sTitle: "实际出发时间", sName: "leavewh_time","bSortable": true},
                {sTitle: "计划到达时间", sName: "plan_arrive_time","bSortable": true},
            ],
            "fnServerData" : function(sSource, aoData, fnCallback) {
                var searchParams = genSearchParams();
                $ips.gridLoadData(sSource, aoData, fnCallback, "truckfuture", "getTruckfutrue", searchParams, function(data) {
                  if(data.result){
                       $.each(data.result, function(i, item) {
                        is_dispatched = 0;
                        if (item.carnum != undefined && item.carnum != '') {
                            is_dispatched = 1;
                        }
                        item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0" dispatched="'+is_dispatched+'"><span></span></label>';
                        item.operating = '';
                        if (userRole == 'carrier') {
                            item.operating = '<a class="check_order" id="'+userinfo.organ.orgcode+'_'+item.id+'">订单详情</a>&nbsp;'
                        }
                    });
                  }    
                });
            },
            "fnDrawCallback" : function() {
                //订车操作
                var checkboxes = $("input[type='checkbox']");
                checkboxes.on("click", function() {
                    var $this = $(this);
                    if ($this.is(":checked")) {
                        checkboxes.prop("checked", false);
                        $this.prop("checked", true);
                    }
                });
            },
        });
    });
});
  
$(function(){
    $("#jsprint").click(function(){
        $("#table-product").printArea();
    });
});
 