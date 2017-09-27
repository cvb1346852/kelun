/**
 * Created by will_zhang on 1/3/2017.
 */
/**
 * Author ZHM
 * 2016-7-12
 */
var btnMoreSearch = $("#btnMoreSearch");
var userinfo = $ips.getCurrentUser();
var userRole = '';
$ips.include('/js/poshytip/tip-white/tip-white.css');
// 搜索按钮
$("#btnSearch").click(function() {
    $('#shipmentTbl').grid("fnPageChange", "first");
});

//设置默认搜索时间
$('#statistic_date').val(set_time_range());
/*$('#reportTime').val(moment().format('L')+' 00:00');*/
//选择搜索时间
$('#statistic_date').daterangepicker({
    timePicker: true,//显示小时和分钟
    timePickerIncrement: 1, //分钟选择的间隔
    format: 'YYYY-MM-DD HH:mm', //返回值的格式
    timePicker12Hour: false, //采用24小时计时制
    showDropdowns: true, //是否显示年、月下拉框
});

//设置时间范围
function set_time_range(){
    var returntimes = moment().subtract(3, 'days').format('L')+' 00:00'+' - '+moment().format('L')+' 23:59';
    return returntimes;
}
/*加载出发地*/
$(function() {
    //初始化出发地省份选择
    //BindCity("");

    //加载基地选择框
    $("#carrier_name").select2({
        placeholder: "选择承运商名称",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('statementlist', 'getResultName',{result_type: 1 , responsible_name : e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.id, text: y.carrier_name });
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
    return searchParams;
}

//展示运单列表
loadScript('js/hui/jquery.hui.grid.js', function () {
    $('#shipmentTbl').grid({
        "aoColumns" : [
            {sTitle: "制单时间", sName: "create_time","bSortable": true},
            {sTitle: "承运商", sName: "carrier_name","bSortable": false},
            {sTitle: "司机", sName: "driver_name","bSortable": false},
            {sTitle: "车牌号", sName: "carnum","bSortable": false},
            {sTitle: "车长", sName: "car_length","bSortable": false},
            {sTitle: "车型", sName: "car_type_name","bSortable": false},
            {sTitle: "起点", sName: "fromlocation","bSortable": false},
            {sTitle: "终点", sName: "tolocation","bSortable": false},
            {sTitle: "距离", sName: "distance","bSortable": true},
            {sTitle: "吨位", sName: "weight","bSortable": true},
            {sTitle: "金额", sName: "price","bSortable": true},
            {sTitle: "运输方式", sName: "shipment_method","bSortable": false},
            {sTitle: "单据号", sName: "shipment_code","bSortable": false},
        ],
    "fnServerData" : function(sSource, aoData, fnCallback) {
            var searchParams = genSearchParams();
            $ips.gridLoadData(sSource, aoData, fnCallback, "statementlist", "getShipmentReport", searchParams, function(data) {
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
    });
});

//导出按钮
loadScript('js/hui/jquery.hui.exportdata.js', function () {
    var date = new Date();
    var statistic_date='';
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var time = year+""+month+""+day;
    var exportSearchParams = [
        {name:"getTemplate",value:1},
    ];
    $('#export').on('click', function(){
        create_time=$('#statistic_date').val();
        exportSearchParams.push({name:"statistic_date","value":create_time});
        carrier_name=$('#carrier_name').val();
        exportSearchParams.push({name:"carrier_id","value":carrier_name});
    });
    exportSearchParams.push({name:"filename","value":"运输明细报表导出-" + time});
    $('#export').exportdata({dataModule : 'statementlist',dataMethod:'getShipmentReport',searchParams: exportSearchParams,title:'运输明细报表列表',partDataRows:3000,partSize:100});
},true,true);
