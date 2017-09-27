/**
 * Created by Administrator on 2016/10/14.
 */
var params = $ips.getUrlParams();
var btnMoreSearch = $("#btnMoreSearch");
var userinfo = $ips.getCurrentUser();
var userRole = '';

$("#btnSearch").click(function() {
    $('#tblMain').grid("fnPageChange", "first");
});

/*$('#statistic_date').daterangepicker({
    timePicker: true,//显示小时和分钟
    timePickerIncrement: 1, //分钟选择的间隔
    format: 'YYYY-MM-DD HH:mm', //返回值的格式
    timePicker12Hour: false, //采用24小时计时制
    showDropdowns: true, //是否显示年、月下拉框
});*/
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
$("#shipment_code").select2({
    placeholder: "选择运单号",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('tender', 'getShipmentCodes',{orgcode:userinfo.organ.orgcode, shipment_code: e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.shipment_code, text: y.shipment_code });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});



//获取废标报表页面
// 表格
loadScript("/js/hui/jquery.hui.grid.js",function(){
    $("#tblMain").grid({
        "aoColumns":[
            {sTitle: "操作", sName: "idAction","bSortable": false},
            {sTitle: "运单号", sName: "shipment_code","bSortable": false},
            {sTitle: "业务类型", sName: "business_type","bSortable": false},
            {sTitle: "运输方式", sName: "shipment_method","bSortable": false},
            {sTitle: "出发地", sName: "fromlocation","bSortable": false},
            {sTitle: "目的地", sName: "tolocation","bSortable": false},
            {sTitle: "废标人", sName: "aband_user","bSortable": false},
            {sTitle: "废标时间", sName: "aband_time","bSortable": false},
            {sTitle: "废标原因", sName: "aband_remark","bSortable": false}

        ],
        "fnServerData":function(sSource,aoData,fnCallback){
            var searchParams = $("#frmSearch").serializeArray();
            $ips.gridLoadData(sSource,aoData,fnCallback,"tender","getAbandTender",searchParams,function(data){
                if(data.result){
                    $.each(data.result, function(i, item) {
                        item.idAction = '<a href="javascript:void(0);"  onclick="Show(\'' + item.id + '\')">查看</a>';

                    });
                }
            });
        }
    });
});

function Show(id) {
    $ips.load('tender', 'abandTenderQuoteList', {tender_id:id}, function(data){
        if (data.length>0) {

            var content = '<table id="tblMain" class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
            content += '<thead>';
            content += '<tr role="row">';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">报价方类型</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">报价方</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">车辆</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">开票承运商</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">不含税价格</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">含税价格</th>';
            content += '</tr>';
            content += '</thead>';
            content += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';

            $.each(data, function(i, item){

                var carnum = '';
                if(item.carnum != ''){
                    carnum = item.carnum;
                }else{
                    carnum = '待定';
                }
                var quote_type = '';
                if(item.quote_type == '1'){
                    quote_type = '承运商';
                }else if(item.quote_type == '2'){
                    quote_type = '司机';
                }else if(item.quote_type == '3'){
                    quote_type = '第三方';
                }
                if(item.quote_price==''){item.quote_price=='--';}
                content += '<tr>';
                content += '<td style="white-space: nowrap;">'+ quote_type +'</td>';
                content += '<td style="white-space: nowrap;">'+ item.quote_type_name +'</td>';
                content += '<td style="white-space: nowrap;">'+ carnum +'</td>';
                content += '<td style="white-space: nowrap;">'+item.carrier_name+'</td>';
                content += '<td style="white-space: nowrap;">'+item.quote_price+'</td>';
                content += '<td style="white-space: nowrap;">'+item.tallage_price+'</td>';
                content += '</tr>';
            });

            content += '<table id="tblMain" class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
            content += '<h4 class="modal-title" id="tender_quoteLabel">操作历史</h4>'
            content += '<thead>';
            content += '<tr role="row">';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">时间</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">实施人</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">备注</th>';
            content += '</tr>';
            content += '</thead>';
            content += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';

            if(data[0].history != null){
                $.each(data[0].history, function(i, item){
                    content += '<tr>';
                    content += '<td style="white-space: nowrap;">'+item.time+'</td>';
                    content += '<td style="white-space: nowrap;">'+item.retify_name+'</td>';
                    content += '<td style="white-space: nowrap;">'+item.action+'</td>';
                    content += '</tr>';
                });
            }


            content += '</tbody>';
            content += '</table>';
            content += '</tbody>';
            content += '</table>';
            $(".tender_quote_list").html(content);
        } else {
            $(".tender_quote_list").html("<h3 style=\"text-align:center\">暂无报价信息</h3>");
        }
        $('#tender_quote_table').modal(true);
    });

}