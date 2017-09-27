
var params = $ips.getUrlParams();
var btnMoreSearch = $("#btnMoreSearch");
var userinfo = $ips.getCurrentUser();
var userRole = '';
$ips.include('/js/poshytip/tip-white/tip-white.css');
// $ips.include('/js/hui/jquery.hui.grid.js');
// 搜索按钮
$("#btnSearch").click(function() {
    $('#shipmentTbl').grid("fnPageChange", "first");
});
//设置默认搜索时间
$('#statistic_date').val(set_time_range());
$('#reportTime').val(moment().format('L')+' 00:00');
//选择搜索时间
$('#statistic_date').daterangepicker({
    timePicker: true,//显示小时和分钟
    timePickerIncrement: 1, //分钟选择的间隔
    format: 'YYYY-MM-DD HH:mm', //返回值的格式
    timePicker12Hour: false, //采用24小时计时制
    showDropdowns: true, //是否显示年、月下拉框
});
//上报时间选择
$("#reportTime").daterangepicker({
    timePicker: true,
    timePickerIncrement: 1,
    format: "YYYY-MM-DD HH:mm",
    timePicker12Hour: false,
    showDropdowns: true,
    singleDatePicker: true
});
// 更多搜索条件按钮!
$("#btnMoreSearch").attr("state","close");
$("#btnMoreSearch").click(function(){
    if ($("#btnMoreSearch").attr("state") == "close"){
        $(".widget-body-toolbar").css("height","auto");
        $("#btnMoreSearch").text("收起条件");
        $("#btnMoreSearch").attr("state","open");
    }
    else {
        $(".widget-body-toolbar").css("height","70");
        $("#btnMoreSearch").text("更多条件");
        $("#btnMoreSearch").attr("state","close");
    }
});
//加载运单号选择框
$("#shipment_code").select2({
    placeholder: "选择运单号",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('bidding', 'getShipments',{orgcode:userinfo.organ.orgcode,is_tender:1, shipment_code: e.term},function(data) {
            var item=[];
            $.each(data.result,function(x,y){
                item.push({id: y.shipment_code, text: y.shipment_code });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});


$ips.load('motorcade_warehouse', 'search','', function(data) {
    $.each(data.result, function(k, v) {
        $("#push").append('<label class="checkbox" style="display: inline;"><input type="checkbox" class="checkbox style-0"  name="tender_push[motorcade][]" value="'+v.id+'"  id="'+v.id+'"/><span style="margin-right: 0px;vertical-align:baseline;"></span>'+v.name+' </label>');

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
    }

    //展示运单列表
    loadScript('/js/hui/jquery.hui.grid.js', function () {
        $('#shipmentTbl').grid({
            "aLengthMenu": [ 10, 25, 50, 100 ],
            "iDisplayLength": 10,
            "aoColumns" : [
                {sTitle: '操作', sName: "idCheckbox", bSortable: false},
                {sTitle: "发标时间", sName: "create_time" , bSortable: false},
                {sTitle: "竞标截止时间", sName: "tender_limit" , bSortable: false},
                {sTitle: "运单号", sName: "shipment_code" , bSortable: false},
                {sTitle: "出发地", sName: "fromlocation" , bSortable: false},
                {sTitle: "目的地", sName: "tolocation" , bSortable: false},
                {sTitle: "业务类型", sName: "business_type" , bSortable: false},
                {sTitle: "运输方式", sName: "shipment_method" , bSortable: false},
                {sTitle: "竞价模式", sName: "tender_type" , bSortable: false},
                {sTitle: "价格", sName: "price" , bSortable: false},
                {sTitle: "是否超额", sName: "over_price" , bSortable: false},
                {sTitle: "报价方式", sName: "price_type" , bSortable: false},
                {sTitle: "竞标状态", sName: "tender_status_view" , bSortable: false},
                {sTitle: "中标承运商", sName: "carrier_name" , bSortable: false},
                {sTitle: "车牌号", sName: "carnum" , bSortable: false},
                {sTitle: "司机姓名", sName: "driver_name" , bSortable: false},
                {sTitle: "联系方式", sName: "driver_phone" , bSortable: false},
                {sTitle: "装车件数", sName: "quality" , bSortable: false},
                {sTitle: "重量", sName: "weight" , bSortable: false},
                {sTitle: "体积", sName: "volume" , bSortable: false},

            ],
            "fnServerData" : function(sSource, aoData, fnCallback) {
                var searchParams = genSearchParams();
                var now=new Date();//取今天的日期
                $ips.gridLoadData(sSource, aoData, fnCallback, "bidding", "getShipments", searchParams, function(data) {
                    if(data.result){
                        $.each(data.result, function(i, item) {
                            is_dispatched = 0;
                            if(item.tender_limit != null && item.tender_limit != '' && item.tender_limit !== undefined ){
                                var tender_limit = new Date(item.tender_limit.replace("-","/").replace("-", "/"));
                                if(item.tender_status == '1'){
                                    item.tender_status_view = '竞标中';
                                }
                                if(item.tender_status == '2' || item.tender_status == '3' ){
                                    item.tender_status_view = '已评标';
                                }
                                if(item.tender_status == '4'){
                                    item.tender_status_view = '废标';
                                }
                            }
                            else{
                                item.tender_status_view = '未发标';
                            }


                            if (item.carnum != undefined && item.carnum != '') {
                                is_dispatched = 1;
                            }
                            item.idCheckbox = '<span><a href="javascript:;" onclick="tender_quote('+item.id+','+item.tender_id+');" >查看</a> </span>';
                            item.operating = '';
                            item.tender_type = '竞价';
                            if(item.over_price == '0'){
                                item.over_price = '否';
                            }
                            else{
                                item.over_price = '是';
                            }
                            if(item.price_type == 1){
                                item.price_type = '整车';
                            }
                            else{
                                item.price_type = '按吨';
                            }


                        });
                    }
                });
            }
        });
    });
});


$(function(){
    $("#jsprint").click(function(){
        $("#table-product").printArea();
    });
});

//设置时间范围
function set_time_range(){
    var returntimes = moment().subtract(3, 'days').format('L')+' 00:00'+' - '+moment().format('L')+' 23:59';
    return returntimes;
}

//评标
function tender_quote(shipment_id,id){
    var id = id;
    if(id != null && id != undefined){
        $ips.load('bidding', 'tenderQuoteList', {shipmentId:shipment_id,tender_id:id}, function(data){

            if(data == ''){
                $ips.alert ('此运单还没有出价');
                return false;
            }

            var now=new Date();//取今天的日期

            if (data.length>0) {

                var content = '<table id="tblMain" class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
                content += '<thead>';
                content += '<tr role="row">';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">报价方类型</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">报价方</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">手机号</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">车辆</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">开票承运商</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">含税报价</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">含税总价</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">状态</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">报价时间</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">报价备注</th>';
                content += '</tr>';
                content += '</thead>';
                content += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';

                $.each(data, function(i, item){
                    var quote_type ='';
                    var quote_type_name = '';
                    var quote_type_phone = "";
                    if(item.quote_type == '1'){
                        quote_type = '承运商';
                        quote_type_name = item.carrier_name;
                        quote_type_phone = item.relation_phone;
                    }else if(item.quote_type == '2'){
                        quote_type = '司机';
                        quote_type_name = item.driver_name;
                        quote_type_phone = item.driver_phone;
                    }else if(item.quote_type == '3'){
                        quote_type = '第三方';
                        quote_type_name = '第三方';
                        quote_type_phone = "";
                    }

                    var carnum = '';
                    if(item.carnum != ''){
                        carnum = item.carnum;
                    }else{
                        carnum = '待定';
                    }
                    var status = '';
                    if(item.status == '1'){
                        status = '未中标';
                    }
                    else if(item.status == '3'){
                        status = '中标';
                    }
                    if(item.is_cancel == '1'){
                        status = '已作废';
                    }
                    content += '<tr>';
                    content += '<td style="white-space: nowrap;">'+ quote_type +'</td>';
                    content += '<td style="white-space: nowrap;">'+ quote_type_name +'</td>';
                    content += '<td style="white-space: nowrap;">'+ quote_type_phone +'</td>';
                    content += '<td style="white-space: nowrap;">'+ carnum +'</td>';
                    content += '<td style="white-space: nowrap;">'+ item.carrier_name_s+'</td>';
                    content += '<td style="white-space: nowrap;">'+ item.quote_price + '</td>';
                    if(item.price_type == '1'){
                        content += '<td style="white-space: nowrap;">'+ item.quote_price +'</td>';
                    }
                    else{
                        content += '<td style="white-space: nowrap;">'+ Number(item.quote_price * item.tender_weight).toFixed(2) +'</td>';
                    }
                    content += '<td style="white-space: nowrap;">'+ status + '</td>';
                    content += '<td style="white-space: nowrap;">'+ item.create_time + '</td>';
                    content += '<td style="white-space: nowrap;">'+ item.quote_remark + '</td>';

                    content += '<td style="white-space: nowrap;"></td>';
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
                content += '<tbody id="history_list_id" role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';

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
            $('#tender_quote_table').modal();
        });
    }else{
        $ips.alert("请选择运单");
    }
};


