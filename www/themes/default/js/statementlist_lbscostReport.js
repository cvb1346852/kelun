/**
 * Created by will_zhang on 1/13/2017.
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
    //加载基地选择框
    $("#driver_phone").select2({
        placeholder: "选择司机手机号",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('statementlist', 'getDriverNameList',{driver_phone : e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.driver_phone, text: y.driver_phone });
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
            {sTitle: "司机手机号", sName: "driver_phone","bSortable": false},
            {sTitle: "司机姓名", sName: "driver_name","bSortable": false},
            {sTitle: "定位人", sName: "user_type_str","bSortable": false},
            {sTitle: "定位时间", sName: "create_time","bSortable": true},
            {sTitle: "定位位置", sName: "address","bSortable": false},
        ],
        "fnServerData" : function(sSource, aoData, fnCallback) {
            var searchParams = genSearchParams();
            $ips.gridLoadData(sSource, aoData, fnCallback, "statementlist", "getLbsCost", searchParams, function(data) {

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
        driver_phone=$('#driver_phone').val();
        exportSearchParams.push({name:"driver_phone","value":driver_phone});
    });
    exportSearchParams.push({name:"filename","value":"print-" + time});
    $('#export').exportdata({dataModule : 'statementlist',dataMethod:'getLbsCost',searchParams: exportSearchParams,title:'lbs费用明细报表（司机）',partDataRows:3000,partSize:100});
},true,true);
