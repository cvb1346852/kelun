/**
 * Author ZHM
 * 2016-7-12
 */ 
var params = $ips.getUrlParams();
var btnMoreSearch = $("#btnMoreSearch");
var userinfo = $ips.getCurrentUser();
 $ips.load('shipment', 'checkeCarrier',{orgcode:userinfo.organ.orgcode},function(data) {
    if(data.code==2){
        $ips.error('非法访问');
        return false;
    }
 });
var userRole = '';
/*$(function() {
    //初始化出发地省份选择
    BindCity("");   
    //初始化目的地省份选择
    BindCity1("");   
});*/
$ips.include('/js/poshytip/tip-white/tip-white.css');
$ips.include('/js/hui/jquery.hui.grid.js');
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
$('#reportTime').daterangepicker({singleDatePicker: true,showDropdowns: true, timePicker: true, timePicker12Hour: false,format:'YYYY-MM-DD  HH:mm:ss',minDate:'2015-01-01',maxDate:'2050-12-30'});
/*$("#reportTime").daterangepicker({
    timePicker: true,
    timePickerIncrement: 1,
    format: "YYYY-MM-DD HH:mm",
    timePicker12Hour: false, 
    showDropdowns: true,
    singleDatePicker: true
});*/
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
        $ips.load('shipment', 'getShipmentCodes',{orgcode:userinfo.organ.orgcode, shipment_code: e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.shipment_code, text: y.shipment_code });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});

//加载司机选择框
$("#driver").select2({
    placeholder: "选择司机",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('shipment', 'getDrivers',{orgcode:userinfo.organ.orgcode, driver_name: e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.driver_name, text: y.driver_name });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});

//加载出发地选择框
 /*$("#fromlocation").select2({
    placeholder: "选择出发地",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('shipment', 'getFromlocation',{orgcode:userinfo.organ.orgcode, fromlocation: e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.fromlocation, text: y.fromlocation });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});

//加载目的地选择框
$("#tolocation").select2({
    placeholder: "选择目的地",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('shipment', 'getTolocation',{orgcode:userinfo.organ.orgcode, tolocation: e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.tolocation, text: y.tolocation });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});*/

//加载承运商
$("#dispatch_carrier").select2({
    placeholder: "选择承运商",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('shipment', 'getBaseCarriers',{orgcode:userinfo.organ.orgcode, carrier:e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.id, text: y.carrier_name });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});

//加载车牌号选择框
$("#carnum").select2({
    placeholder: "选择车辆",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('shipment', 'getCarnums',{orgcode:userinfo.organ.orgcode, carnum:e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.carnum, text: y.carnum });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});
//加载订车车牌号
$("#dispatch_carnum").select2({
    placeholder: "选择车辆",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('shipment', 'getCarrierCarnums',{orgcode:userinfo.organ.orgcode, carnum:e.term, carrier_id:$('#dispatch_carrier').val()},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.carnum, text: y.carnum });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});

/*//订车按钮
$(".operating-button").on("click", "#dispatch-button", function(){
    id = getRowId();
    if(id != null && id != undefined){
        console.log($("#"+id).attr('dispatched'));
        if ($("#"+id).attr('dispatched') == 1) {
            $ips.alert("该订单已订车，无法重复订车", function(){
                $("#dispatch").modal("hide");
            });
        } else {
            $("#dispatch-submit").attr("sid",id);
        }
    }else{
        $ips.alert("请选择运单");
    }
});*/


//LBS
$("#lbs-button").click(function(){
    id = getRowId();
    if(id != null && id != undefined){
        $ips.load('shipment', 'lbs', {shipmentid:id, user_type:'2'}, function(data){
            if(data.code == 0){
                $ips.succeed(data.message);
            }
            else{
                $ips.error(data.message);
            }
        });

    }else{
        $ips.alert("请选择运单");
    }
});
//获取查询条件
function genSearchParams(){
    var searchParams = $("#frmSearch").serializeArray();
    searchParams.push({name: "orgcode", value:userinfo.organ.orgcode});
    searchParams.push({name: "userrole", value:userRole});
    return searchParams;
}
 //查看运单回放
$("#playback-button").click(function(){
    id = getRowId();
    if(id != null && id != undefined){
            $ips.locate("shipment", "back", "id="+id);   
        }
});
//验证身份
$ips.load('shipment', 'getRole', {orgcode:userinfo.organ.orgcode}, function(data){
    if (data.code == 1) {
        userRole = data.role;
        if (userRole == 'warehouse') {
          //  $(".operating-button").append('<div class="btn-group"><a href="javascript:void(0)" id="dispatch-button" class="btn btn-default btn-only-one" data-toggle="modal" data-target="#dispatch">订车</a></div>');
        }
    }
    //查看订单
    $("#ordersInfo-button").click(function(){
        id = getRowId();
        if(id != null && id != undefined){
            $ips.load('shipment', 'getOrderListById', {orgcode:userinfo.organ.orgcode, shipmentId:id}, function(data){
                if (data.length > 0) {
                        var content = '<table id="tblMain" class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
                        content += '<thead>';
                        content += '<tr role="row">';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="订单号: activate to sort column ascending" style="width: 100px; white-space: nowrap;">订单号</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="签收状态: activate to sort column ascending" style="width: 80px; white-space: nowrap;">签收状态</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="订单数量: activate to sort column ascending" style="width: 80px; white-space: nowrap;">订单数量</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="订单重量: activate to sort column ascending" style="width: 80px; white-space: nowrap;">订单重量</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="运距: activate to sort column ascending" style="width: 80px; white-space: nowrap;">运距</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="出发地: activate to sort column ascending" style="width: 164px; white-space: nowrap;">出发地</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="出发地地址: activate to sort column ascending" style="width: 164px; white-space: nowrap;">出发地地址</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="目的地: activate to sort column ascending" style="width: 164px; white-space: nowrap;">目的地</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="目的地地址: activate to sort column ascending" style="width: 164px; white-space: nowrap;">目的地地址</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="发货方: activate to sort column ascending" style="width: 164px; white-space: nowrap;">发货方</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="发货方联系电话: activate to sort column ascending" style="width: 164px; white-space: nowrap;">发货方联系电话</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="收货方: activate to sort column ascending" style="width: 164px; white-space: nowrap;">收货方</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="收货方联系电话: activate to sort column ascending" style="width: 100px; white-space: nowrap;">收货方联系电话</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="activate to sort column ascending" style="width: 100px; white-space: nowrap;">操作</th>';
                        content += '</tr>';
                        content += '</thead>';
                        content += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';

                    $.each(data, function(i, item){
                        var color = i%2 == 0 ? 'even' : 'odd';
                        content += '<tr class="'+color+'">';
                        content += '<td style="white-space: nowrap;">'+item.order_code+'</td>';
                        switch (item.checkout) {
                                case '1':
                                   content += '<td style="white-space: nowrap;">未签收</td>';
                                   break;
                                case '2':
                                   content += '<td style="white-space: nowrap;">正常签收</td>';
                                   break;
                                case '3':
                                   content += '<td style="white-space: nowrap;">异常签收</td>';
                                   break;
                                case '4':
                                   content += '<td style="white-space: nowrap;">签收处理</td>';
                                   break;
                                case '5':
                                   content += '<td style="white-space: nowrap;">签收确认</td>';
                                   break;
                           }
                        var weight = parseFloat(item.weight);
                        if(item.quality==null){
                            item.quality='';
                        }
                        content += '<td style="white-space: nowrap;">'+item.quality+'</td>';
                        content += '<td style="white-space: nowrap;">'+weight.toFixed(3)+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.distance+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.fromlocation+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.from_address+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.tolocation+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.to_address+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.from_name+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.from_phone+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.to_name+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.to_phone+'</td>';
                        content += '<td style="white-space: nowrap;text-align: center;">';
                        if (userRole == 'carrier') {
                            content += '<a id="'+item.shipment_id+'_'+item.order_code+'_'+item.id+'" class="report editable editable-click" data-toggle="modal" data-target="#reportInfo">转包上报</a>&nbsp;';
                        }
                        content += '</td>';
                        content += '</tr>';
                    });
                        content += '</tbody>';
                        content += '</table>';
                        $(".ordersInfo-table").html(content);
                } else {
                    $(".ordersInfo-table").html("<h3 style=\"text-align:center;display：inline-block;width:800px;\">暂无订单信息</h3>");
                }
            });
        }else{
            $ips.alert("请选择运单");
        }
    });

    //获取司机手机号
    $("#driver_phone").select2({
        placeholder: "司机手机号",
        minimumInputLength: 1,
        query: function(query) {
            $ips.load('truck_source', 'search', {driver_phone_like: query.term,pageSize:50,pageNo:1}, function(e) {
                var _pre_data = [];
                $.each(e.result, function(k, v) {
                    _pre_data.push({id: v.driver_phone, text: v.driver_phone});
                });
                var data = {results: _pre_data};
                query.callback(data);
            });
        }
    }).on("change",function(v){
        $ips.load('truck_source', 'search', {driver_phone: v.val}, function(e) {
            $("#driver_name").html(e.result[0].driver_name);
            $('#drive_license').html(e.result[0].drive_license);
            $('#car_num').val(e.result[0].carnum);
            $('#truck_source_id').val(e.result[0].id);
        });

    });

    //订车
    $("#dispatch-button").click(function(){
        id = getRowId();
        if(id != null && id != undefined){
            $ips.load('shipment', 'checkTenderStatus', {shipmentId:id }, function(data){
                if(data.status >=7){
                    $ips.alert ('此运单状态已不可指定车辆');
                    return false;
                }
                else{
                    $ips.load("shipment", "getShipmentInfo",{id:id}, function(data2){
                        $("#order_detail").html('');
                        $.each(data2._orders, function(i, item){
                            $("#order_detail").append(item.from_address+'-'+item.to_address+'&nbsp;'+item.order_weight+'吨&nbsp;'+item.order_volume+'方</br>');
                        });
                        if(data2.driver_phone != ''){
                            $ips.load('truck_source', 'search', {driver_phone: data2.driver_phone,pageSize:50,pageNo:1}, function(e) {
                                var _pre_data = [];
                                $.each(e.result, function(k, v) {
                                    $("#s2id_driver_phone").find(".select2-chosen").html(v.driver_phone);
                                });
                            });
                        }

                        $('#shipmentid').val(id);
                        $('#remark').html(data2.assign_remark);
                        $('#driver_phone').val(data2.driver_phone);
                        $('#driver_name').html(data2.driver_name);
                        $('#drive_license').html(data2.drive_license);
                        $('#car_num').val(data2.carnum);
                        $('#truck_source_id').val(data2.truck_source_id);
                        $("#dispatch_car_table").modal();
                    });
                }
            });
        }else{
            $ips.alert("请选择运单");
        }
    });

    //提交指定司机
    $("#dispatch_car_button").click(function(){
        var id=getRowId();
        var driver_phone =  $("#driver_phone").val()
        var carnum =  $("#car_num").val()
        var truck_source_id =  $("#truck_source_id").val()
        var driver_name =  $("#driver_name").html()
        if(driver_phone == '' || driver_phone == undefined){
            $ips.error('请选择司机');
            return false;
        }

        $ips.load('shipment', 'cpecify_driver', {driver_phone:driver_phone,shipmentid:id,carnum:carnum,driver_name:driver_name,truck_source_id:truck_source_id}, function(data2){
            if(data2.code == 0){
                $ips.succeed(data2.message);
                $("#dispatch_car_table").modal("hide");
            }
            else{
                $ips.error(data2.message);
                $("#cpecify_carrier_s").modal("hide");
            }
        });


    });

    $("#truck_source").click(function(){
        $ips.locate("truck_source","index");
    });
    //清楚转包上报内容
    $('#reportTime').val('');
    $("#type option:first").prop("selected", 'selected');
    $('#position').val('');
    $('#reportCarnum').val('');
    // 转包上报
    $(".ordersInfo-table").on("click", "a.report", function(){
        $('#reportTime').val('');
        $("#type option:first").prop("selected", 'selected');
        $('#position').val('');
        $('#reportCarnum').val('');
        $("#ordersInfo").modal("hide");
        $("#soid").val($(this).attr("id"));
        $("#orderid").html($(this).attr("id").split("_")[1]);
        
    });

    //展示运单列表
    loadScript('js/hui/jquery.hui.grid.js', function () {
        $('#shipmentTbl').grid({
            "aoColumns" : [
                {sTitle: "操作",sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
                {sTitle: "运单号", sName: "shipment_code",bSortable: false},
                {sTitle: "连续号", sName: "serial_num",bSortable: false},
                {sTitle: "业务类型", sName: "business_type",bSortable: false},
                {sTitle: "订单回单状态", sName: "orderCheck",bSortable: false},
                {sTitle: "运输方式", sName: "shipment_method",bSortable: false},
                {sTitle: "出发地", sName: "fromlocation",bSortable: false},
                {sTitle: "目的地", sName: "tolocation",bSortable: false},
                {sTitle: "车牌号", sName: "carnum",bSortable: false},
                {sTitle: "司机姓名", sName: "driver_name",bSortable: false},
                {sTitle: "联系方式", sName: "driver_phone",bSortable: false},
                {sTitle: "装车件数", sName: "quality",bSortable: false},
                {sTitle: "重量", sName: "weight",bSortable: false},
                {sTitle: "体积", sName: "volume",bSortable: false},
                {sTitle: "计划发车时间", sName: "plan_leave_time",bSortable: false},
                {sTitle: "计划到达时间", sName: "plan_arrive_time",bSortable: false},
                {sTitle: "单价", sName: "unit_price",bSortable: false},
                {sTitle: "总价", sName: "price",bSortable: false},
                {sTitle: "进厂时间", sName: "arrivewh_time"},
                {sTitle: "出厂时间", sName: "leavewh_time"},
                {sTitle: "运抵时间", sName: "arrival_date"},
            ],
            "fnServerData" : function(sSource, aoData, fnCallback) {
                var searchParams = genSearchParams();
                $ips.gridLoadData(sSource, aoData, fnCallback, "shipment", "getShipments", searchParams, function(data) {
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

function showCarrier(data)
{
    $("#makedate").html(data.update_time);
    $("#yunshufangshi").html(data.update_time);
    $("#carrier-name").html(data.carrier_name);
    $("#carrier-phone").html(data.relation_phone);
}

function showDetail(data)
{
    var html = '';
    for (i=0; i<data.length; i++) {
        html += '<tr><td>'+ data[i].product_name +'</td>' +
            ' <td>' + data[i].specification + '</td>' +
            '<td>' + data[i].lot + '</td>' +
            '<td>' + data[i].serial + '</td>' +
            '<td>' + data[i].unit_name + '</td>' +
            '<td>' + data[i].quality + '</td>' +
            '<td>' + data[i].weight + '</td>' +
            '<td>' + data[i].volume + '</td>' +
            '<td>' + data[i].manufacturer + '</td>' +
            '</tr>';
    }
    $("#table-product_detail").html(html);

}

$(function(){
    $("#jsprint").click(function(){
        $("#table-product").printArea();
    });
});
//打印转运单
$(function(){
    $("#jsprint_s").click(function(){
        $("#table-product_s").printArea();
    });
});
//提交订车
$('#dispatch-submit').on('click', function(){
    var dispatch_params = {
        carnum: $("#dispatch_carnum").val(),
        carrier_id: $("#dispatch_carrier").val(),
        id: $(this).attr('sid')
    };
    $ips.load('shipment', 'dispatchCarnum', dispatch_params, function(data){
        if (data.code == 0) {
            $ips.succeed('订车成功');
            $("#dispatch").modal("hide");
            $("#btnSearch").trigger("click");
            // location.reload();
        }
    });
});
//转包上报弹框样式控制
$('.label-row').css({"width":"100%"});
$('.label-row-title').css({"text-align":"center", "display":"inline-block", "width":"30%"});
$('.label-row-input').css({"width":"280px", "height":"30px"});
//提交转包上报
$('.reported').on('click', function(){
    var orderid = $("#soid").val();
    var time    = $("#reportTime").val();
    var type    = $("#type").val();
    var position = $("#position").val();
    var carnum  = $("#reportCarnum").val();
    var subparams = {
        orderid: orderid,
        time: time,
        type: type,
        position: position,
        carnum: carnum
    };
    $ips.load('shipment', 'applySubcontract',subparams,function(data) {
        if (data.code == 0) {
            $ips.succeed("上报成功！");
            $("#reportInfo").modal("hide");
        } else {
            $ips.error(data.msg);
        }
    });
});
//设置时间范围
function set_time_range(){
    var returntimes = moment().subtract(3, 'days').format('L')+' 00:00'+' - '+moment().format('L')+' 23:59';
    return returntimes;
}
//获取选中的id
function getRowId(){
    if ($('#shipmentTbl input:checkbox[name="checkbox-inline"]:checked').length != 1) {
        $ips.alert("只能选择一条记录进行订车操作");
    } else {
        return $('#shipmentTbl input:checkbox[name="checkbox-inline"]:checked').eq(0).val();
    }
}

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
        var shipment_code=$('#shipment_code').val();
        var shipment_method=$('#shipment_method').val();
        var driver=$('#driver').val();
        var carnum=$('#carnum').val();
        var fromlocation=$('#fromlocation').val();
        var tolocation=$('#tolocation').val();
        exportSearchParams.push(
            {name:"statistic_date_s","value":create_time},
            {name:"shipment_code","value":shipment_code},
            {name:"shipment_method","value":shipment_method},
            {name:"driver","value":driver},
            {name:"carnum","value":carnum},
            {name:"orgcode","value":userinfo.organ.orgcode},
            {name:"is_export","value":true},
            {name:"fromlocation","value":fromlocation},
            {name:"tolocation","value":tolocation},
            {name:"shipment_carrier","value":"shipment_carrier-" + time}
        );
    });
    $('#export').exportdata({dataModule : 'shipment',dataMethod:'getShipments',searchParams: exportSearchParams,title:'承运商我的运单',partDataRows:3000,partSize:100});
},true,true);
