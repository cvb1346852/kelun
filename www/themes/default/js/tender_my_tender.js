var params = $ips.getUrlParams();
var btnMoreSearch = $("#btnMoreSearch");
var userinfo = $ips.getCurrentUser();
var userRole = '';

$("#btnSearch").click(function() {
    $('#tblMain').grid("fnPageChange", "first");
});


//设置时间范围
function set_time_range(){
    var returntimes = moment().subtract(3, 'days').format('L')+' 00:00'+' - '+moment().format('L')+' 23:59';
    return returntimes;
}
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
//加载运单号选择框
$("#status").select2({
    placeholder: "选择状态",
    minimumInputLength: 0,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        var item=[{id:'1,2', text: '未中标'},{id:'3', text: '中标'},{id:'4,5', text:'废标'}];
        var data = {results: item};
        e.callback(data);
    }
});



//获取废标报表页面
// 表格
loadScript("/js/hui/jquery.hui.grid.js",function(){
    $("#tblMain").grid({
        "aoColumns":[
            /*{sTitle: "操作", sName: "idAction","bSortable": false},*/
            {sTitle: "单号", sName: "shipment_code","bSortable": false},
            {sTitle: "状态", sName: "status","bSortable": false},
            /*{sTitle: "订车", sName: "shipment_method","bSortable": false},*/
            {sTitle: "投标时间", sName: "create_time","bSortable": false},
            {sTitle: "投标价格", sName: "quote_price","bSortable": false},
            {sTitle: "报价方式", sName: "price_type","bSortable": false},
            {sTitle: "车长要求", sName: "car_length","bSortable": false},
            {sTitle: "箱型要求", sName: "carriage_type","bSortable": false},
            {sTitle: "重量", sName: "weight","bSortable": false},
            {sTitle: "体积", sName: "volume","bSortable": false},
            {sTitle: "件数", sName: "quality","bSortable": false},
            {sTitle: "出发地", sName: "fromlocation","bSortable": false},
            {sTitle: "目的地", sName: "tolocation","bSortable": false},
            {sTitle: "运输方式", sName: "shipment_method","bSortable": false}

        ],
        "fnServerData":function(sSource,aoData,fnCallback){
            var searchParams = $("#frmSearch").serializeArray();
            $ips.gridLoadData(sSource,aoData,fnCallback,"tender","getMyTenderList",searchParams,function(data){
                if(data.result){
                    $.each(data.result, function(i, item) {
                        /*item.idAction = '<a href="javascript:void(0);"  onclick="Show(\'' + item.id + '\')">查看</a>';*/
                        /*item.idAction = '<label class="checkbox"><input id="'+item.id+'" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';*/
                        if(item.status==1){
                            item.status='未中标';
                        }else if(item.status==2){
                            item.status='预中标';
                        }else if(item.status==3){
                            item.status='中标';
                        }
                        if(item.price_type==1){
                            data.result[i].price_type='整车报价';
                        }else if(item.price_type==2){
                           data.result[i].price_type='每吨报价'; 
                        }
                        if(item.carriage_type==null || item.carriage_type==''){
                            data.result[i].carriage_type='无要求';
                        }
                        if(item.car_length==null || item.car_length=='' || item.car_length=='-'){
                            data.result[i].car_length='无要求';
                        }
                    });
                }
            });
        }
    });
});
