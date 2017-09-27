/**
 * Created by will_zhang on 1/5/2017.
 */
var btnMoreSearch = $("#btnMoreSearch");
var userinfo = $ips.getCurrentUser();
var userRole = '';
$ips.include('/js/poshytip/tip-white/tip-white.css');
// 搜索按钮
$("#btnSearch").click(function() {
    $('#shipmentTbl').grid("fnPageChange", "first");
});
$("#warehouse_status").css("display","none");
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
    $("#warehouse_name").select2({
        placeholder: "选择基地名称",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('statementlist', 'getResultName',{result_type: 2 , responsible_name : e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.name, text: y.name });
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
            {sTitle: "基地", sName: "plat_form_name","bSortable": false},
            {sTitle: "审批时间", sName: "update_time","bSortable": true},
            {sTitle: "终点", sName: "tolocation","bSortable": false},
            {sTitle: "吨位", sName: "weight","bSortable": true},
            {sTitle: "体积", sName: "volume","bSortable": true},
            {sTitle: "报价类型", sName: "price_type_str","bSortable": true},
            {sTitle: "中标价", sName: "tender_price","bSortable": false},
            {sTitle: "超标率", sName: "push_price","bSortable": false},
            {sTitle: "一级审批价", sName: "first_audit","bSortable": false},
            {sTitle: "二级审批价", sName: "second_audit","bSortable": false},
        ],
        "fnServerData" : function(sSource, aoData, fnCallback) {
            var searchParams = genSearchParams();
            $ips.gridLoadData(sSource, aoData, fnCallback, "statementlist", "getRetifyList", searchParams, function(data) {
                if(data.user_type != 'warehouse'){
                    $("#warehouse_status").css("display","block");
                }
                /*if(data.result){
                    $.each(data.result,function(i,item){
                        if(item.maxprice == null){
                            item.first_audit = '0' ;
                            item.second_audit = '0' ;
                        }else{
                            var maxprice = Number(item.maxprice); //线路最高价
                            var exceeding = Number(maxprice * (item.over_rate * 0.01)) + maxprice; //超标价格
                            item.first_audit = maxprice == null ? '0' : maxprice;
                            item.second_audit = exceeding == null ? '0' : exceeding;
                        }
                        item.tender_price = item.tender_price == null  ?  ' 0 ': (item.price_type == 1 ? (item.tender_price / item.weight) : item.tender_price);
                        item.push_price =  item.maxprice == null  ?  ' 0 ': (item.price_type == 1 ? (item.tender_price - item.maxprice)/(item.maxprice)*100 : (item.tender_price - item.maxprice)/(item.maxprice*item.weight)*100);
                    });
                }*/

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
        update_time=$('#statistic_date').val();
        exportSearchParams.push({name:"statistic_date","value":update_time});
        warehouse_name=$('#warehouse_name').val();
        exportSearchParams.push({name:"warehouse_name","value":warehouse_name});
    });
    exportSearchParams.push({name:"filename","value":"print-" + time});
    $('#export').exportdata({dataModule : 'statementlist',dataMethod:'getRetifyList',searchParams: exportSearchParams,title:'分级运价审批明细报表',partDataRows:3000,partSize:100});
},true,true);
