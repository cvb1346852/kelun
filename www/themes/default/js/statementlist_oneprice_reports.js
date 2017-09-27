/**
 * Created by sunjie on 1/9/2017.
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
    $("#warehouse_id").select2({
        placeholder: "选择基地名称",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('statementlist', 'getResultName',{result_type: 2 , responsible_name : e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.id, text: y.name });
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
            {sTitle: "单据号", sName: "shipment_code","bSortable": false},
            {sTitle: "基地", sName: "name","bSortable": true},
            {sTitle: "承运商", sName: "carrier_name","bSortable": false},
            {sTitle: "设置时间", sName: "create_time","bSortable": false},
            {sTitle: "起点", sName: "fromlocation","bSortable": false},
            {sTitle: "终点", sName: "tolocation","bSortable": false},
            {sTitle: "吨位", sName: "weight","bSortable": false},
            {sTitle: "中标价", sName: "old_price","bSortable": false},
            {sTitle: "修改后价格", sName: "price","bSortable": false},
            {sTitle: "备注", sName: "remark","bSortable": false},
        ],
        "fnServerData" : function(sSource, aoData, fnCallback) {
            var searchParams = genSearchParams();
            $ips.gridLoadData(sSource, aoData, fnCallback, "statementlist", "oneprice_report", searchParams, function(data) {
                if(data.user_type != 'kelun_admin'){
                    $("#warehouse").css("display","none");
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
        var create_time=$('#statistic_date').val();
        exportSearchParams.push({name:"statistic_date","value":create_time});
        var warehouse_id=$('#warehouse_id').val();
        exportSearchParams.push({name:"warehouse_id","value":warehouse_id});
    });
    exportSearchParams.push({name:"filename","value":"一口价设置明细报表-" + time});
    $('#export').exportdata({dataModule : 'statementlist',dataMethod:'oneprice_report',searchParams: exportSearchParams,title:'一口价设置明细报表',partDataRows:3000,partSize:100});
},true,true);
