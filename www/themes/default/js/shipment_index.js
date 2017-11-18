/**
 * Author ZHM
 * 2016-7-12
 */ 
var params = $ips.getUrlParams();
var btnMoreSearch = $("#btnMoreSearch");
var userinfo = $ips.getCurrentUser();
var userRole = '';

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}

$(function() {
    //初始化出发地省份选择
    //BindCity("");
    //初始化目的地省份选择
    //BindCity1("");
});
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
//加载订单号选择框
$("#order_code").select2({
    placeholder: "选择订单号",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('shipment', 'getOrderCodes',{orgcode:userinfo.organ.orgcode, order_code: e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.order_code, text: y.order_code });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});
//加载连续单号选择框
$("#serial_num").select2({
    placeholder: "选择订单号",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('shipment', 'getSerialNum',{orgcode:userinfo.organ.orgcode, serial_num: e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.serial_num, text: y.serial_num });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});
//加载相关单据号选择框
$("#relate_bill").select2({
    placeholder: "选择订单号",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('shipment', 'getRelateBill',{orgcode:userinfo.organ.orgcode, relateBill: e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.relateBill, text: y.relateBill });
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
$("#fromlocation").select2({
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
});

//加载承运商选择框
$("#carrier_id").select2({
    placeholder: "选择承运商",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('warehouse', 'getSearchCondition',{name: 'carrier_id', value: e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: x, text: y });
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

//订车按钮
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
});


//LBS
$("#lbs-button").click(function(){
    id = getRowId();
    if(id != null && id != undefined){
        $ips.load('shipment', 'lbs', {shipmentid:id,user_type:'1'}, function(data){
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
$("#show_history").on('click',function(){
    id = getRowId();
    $ips.load('shipment','checkHistory',{shipmentId:id},function(data){
        if(parseInt(data.code) == 2){
            $ips.locate("history", "show_shipment", "id="+id,true);
        }else if(parseInt(data.code) == 0){
            if (data.ty){
                console.debug(data.ty);
                //$ips.locate("history", "coord", "ty="+data.ty,true);
            }else {
                var historyUrl = 'truck/v2/review/index.html?searchid='+data.truck.searchid+'&searchtype=truckid&searchno='+data.truck.searchno;
                historyUrl += '&begintime='+data.truck.begintime+'&endtime='+data.truck.endtime;
                $ips.locatesubsystem(historyUrl,true);
            }
        }else{
            $ips.error(data.message);
        }
    });
});

//验证身份
$ips.load('shipment', 'getRole', {orgcode:userinfo.organ.orgcode}, function(data){
    if (data.code == 1) {
        userRole = data.role;
        if (userRole == 'warehouse') {
           // $(".operating-button").append('<div class="btn-group"><a href="javascript:void(0)" id="dispatch-button" class="btn btn-default btn-only-one" data-toggle="modal" data-target="#dispatch">订车</a></div>');
        }
    }
    //查看订单
    $("#ordersInfo-button").click(function(){
        id = getRowId();
        if(id != null && id != undefined){
            $ips.load('shipment', 'getOrderList', {orgcode:userinfo.organ.orgcode, shipmentId:id}, function(data){
                if (data.length > 0) {
                        var content = '<table id="tblMain" class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
                        content += '<thead>';
                        content += '<tr role="row">';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="订单号: activate to sort column ascending" style="white-space: nowrap;">订单号</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="签收状态: activate to sort column ascending" style="white-space: nowrap;">签收状态</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="订单数量: activate to sort column ascending" style="white-space: nowrap;">订单数量</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="订单重量: activate to sort column ascending" style="white-space: nowrap;">订单重量</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="运距: activate to sort column ascending" style="white-space: nowrap;">运距</th>';
                         content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="发货方: activate to sort column ascending" style="white-space: nowrap;">发货方</th>';
//                         content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="发货方电话: activate to sort column ascending" style="white-space: nowrap;">发货方电话</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="目的地: activate to sort column ascending" style="white-space: nowrap;">目的地</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="目的地地址: activate to sort column ascending" style="white-space: nowrap;">目的地地址</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="收货方: activate to sort column ascending" style="white-space: nowrap;">收货方</th>';
                        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="收货方电话: activate to sort column ascending" style="white-space: nowrap;">收货方电话</th>';
                        content += '</tr>';
                        content += '</thead>';
                        content += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';

                    $.each(data, function(i, item){
                        var color = i%2 == 0 ? 'even' : 'odd';
                        var weight = parseFloat(item.weight)
                        content += '<tr class="'+color+'">';
                        content += '<td style="white-space: nowrap;">'+item.order_code+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.checkout+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.order_quality+'</td>';
                        content += '<td style="white-space: nowrap;">'+weight.toFixed(3)+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.distance+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.from_name+'</td>';
//                        content += '<td style="white-space: nowrap;">'+item.from_phone+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.tolocation+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.to_address+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.to_name+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.to_phone+'</td>';
                        if (userRole == 'carrier') {
                            content += '<a id="'+item.shipment_id+'_'+item.order_code+'" class="report editable editable-click" data-toggle="modal" data-target="#reportInfo">转包上报</a>&nbsp;';
                        }
                        content += '</td>';
                        content += '</tr>';
                    });
                        content += '</tbody>';
                        content += '</table>';
                        $(".ordersInfo-table").html(content);
                } else {
                    $(".ordersInfo-table").html("<h3 style=\"text-align:center\">暂无订单信息</h3>");
                }
            });
        }else{
            $ips.alert("请选择运单");
        }
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

    //打印运输凭证
    $("#printOrderInfo-button").click(function(){
        id = getRowId();
        if(id != null && id != undefined){
            var page = 0;
            $ips.load('shipment', 'getOrderListPrint', {orgcode:userinfo.organ.orgcode, shipmentId:id}, function(data){
                var content = '';
                var datacount = count(data);
                if (data.page1.length != 0) {
                    $.each(data, function(i, item){
                        if(item['0'].carrier_name == null){
                            var carrier_name = '无';
                        }
                        else{
                            var carrier_name = item['0'].carrier_name;
                        }
                     
                            content += '<div '+ ( i != 'page'+datacount ? 'style="page-break-after : always;"':'') +' >';
                            content += '<table width="100%" border="0" class="xytable" style="font-size:10px;">';
                            content += '<tr> <td  colspan="4"> <div align="center" style="font-size:16px; font-weight:bold;">' + item['0'].from_name + '运输保证协议</div> </td></tr>';
//                          var myDate = new Date();
                            content += '<tr><td colspan="4"><div align="center">' + item['0'].printDay + '</div></td></tr>';
                            content += '<tr><td  colspan="2">发货方:<span id="ddd">' + item['0'].from_name + '</td><td >连续号:<span>' + item['0'].serial_num + '</span></td></tr>';
                            content += '<tr><td  colspan="2">承运商:<span>' + carrier_name + '</span></td><td>打印时间:<span>' + item['0'].printTime + '</span></td></tr>';
                            content += '<tr><td>车牌号:<span>' + item['0'].carnum + '</span></td><td>发货仓库:<span>' + item['0'].fromlocation + '</span></td><td>运输方式:<span>' + item['0'].shipment_method + '</span></td></tr>';
                            content += '</table>';


                            content += '<table width="100%"  border="1" cellpadding="0" cellspacing="0" bordercolor="#000" style="border-collapse: collapse; font-size:10px;" class="xytable">';
                            content += '<tr>';
                            content += '<th>发货单据</th>';
                            content += '<th style="white-space:nowrap;">业务员</th>';
                            content += '<th>到站</th>';
                            content += '<th>件数</th>';
                            content += '<th>吨位</th>';
                            content += '<th>方量</th>';
                            content += '<th>备注</th>';
                            content += '</tr>';
                            $.each(item, function(i, item) {
                                var volume = parseFloat(item.volume);
                                var weight = parseFloat(item.weight);
                                var quality = parseFloat(item.orderquality);
                                content += '<tr><td>' + item.order_code + '</td>';
                                content += '<td style="white-space:nowrap;">' + item.first_business + '</td>';
                                content += '<td style="white-space:nowrap;">' + item.tolocation + '</td>';
                                content += '<td>' + quality.toFixed(1) + '</td>';
                                content += '<td>' + weight.toFixed(3) + '</td>';
                                content += '<td>' + volume.toFixed(3) + '</td>';
                                content += '<td>' + (item.to_address === null ? "" : item.to_address) + '</td></tr>';


                            });
                            if(i == 'page'+datacount){
                                //content += '<table width="100%" border="0">';
                                content += '<tr><td style="border:0">合计：</td> <td style="border:0">&nbsp;</td><td style="border:0">&nbsp;</td> <td style="border:0"> '+ Number( item['0'].total_quality ).toFixed(1) +'</td><td style="border:0"> '+Number(item['0'].total_weight).toFixed(3)+'</td><td style="border:0" > '+Number(item['0'].total_volume).toFixed(3)+'</td><td style="border:0"></td></tr>';
                                //content += '</table>';
                            }


                            content += '<table width="100%" border="0" class="xytable" style="font-size:10px;">';
                            content += '<tr><td  colspan="3" >&nbsp;</td></tr>';
                            content += '<tr colspan="3" >1、承运方（驾驶员）在本协议签字后_____小时内，必须将运载货物送到指定地点，并移交给收货方。逾期未到者，每逾期24小时，支付违约金200元，以此类推，直至将运载货物安全运抵。</br>2、承运方（驾驶员）必须保证随车携带资料（包括但不限于：出库单）及时、完整的移交给收货方，不得缺失。</br>3、承运方（驾驶员）提供的运输工具符合运载货物的要求。</br>4、承运方（驾驶员）运输途中必须采取合理、有效的运输安全防护措施，防止运载货物在运输过程中发生盗抢、遗失、调换等事故；确保运输途中不被破损、污染以及导致产品不能正常使用等事故。若出现交通事故或纠纷，必须以保证运载货物安全、质量不受损坏为处理第一原则。</br>5、该批药品同车承运货物不夹带以下物品： a、枪支、军用或警用械具类（含主要部件）及其仿制品等；b、易燃易爆品、毒害品及其仿制品，危险化学品、放射性物品等；c、制恐、制爆、危害安全的管制刀具、锐器、钝器等；d、国家禁止的宣传品或音影制品等。</br>6、不将自己的车辆用油或备用油私自转（卖）给不知底细或来路不明的陌生人。</br>7、承运过程中遇到公安机关或其他检查部门的检查时积极配合。</br>8、承运方（驾驶员）承诺：本人在签字时，已阅读并理解上述条款内容，且保证按上述条款内容执行。</td></tr>';
                            content += '<tr><td width="35%">送货人：' + '' + '</td><td width="35%">联系电话：' + item['0'].driver_phone + '</td><td width="30%">第'+item['0'].curpage+'页,共'+data.page1['0'].countpage+'页</td></tr>';
                            content += '<tr><td></td><td>制单人：'+item['0'].originator+'</td><td>复核：</td></tr>';
                            content += '</table>';
                            content += '</div>';

                    });


                        $("#table-product").html(content);
                }

                else {
                    $(".table-product").html("<h3 style=\"text-align:center\">暂无订单信息</h3>");
                }
            });
        }else{
            $ips.alert("请选择运单");
        }
    });

    //展示运单列表
    loadScript('/js/hui/jquery.hui.grid.js', function () {
        $('#shipmentTbl').grid({
            "aLengthMenu": [ 30, 50, 100 ],
            "iDisplayLength": 30,
            "fixedHeader":{ isOpen:true},
            "aoColumns" : [
                {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox" class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
                //{sTitle: '操作', sName: "idCheckbox", bSortable: false},
                {sTitle: "运单号", sName: "shipment_code", bSortable: false},
                //{sTitle: "业务类型", sName: "business_type", bSortable: false},
                {sTitle: "运输方式", sName: "shipment_method", bSortable: false},
                {sTitle: "承运商名称", sName: "carrier_name", bSortable: false},
                {sTitle: "设备号", sName: "tycode", bSortable: false},
                {sTitle: "绑定状态", sName: "is_binding", bSortable: false},
                {sTitle: "含税总价", sName: "price", bSortable: false},
                {sTitle: "含税单价", sName: "unit_price", bSortable: false},
                {sTitle: "报价方式", sName: "price_type",bSortable: false},
                {sTitle: "连续号", sName: "serial_num",bSortable: false},
                {sTitle: "装车件数", sName: "quality"},
                {sTitle: "重量", sName: "weight"},
                {sTitle: "体积", sName: "volume"},
                {sTitle: "出发地", sName: "fromlocation", bSortable: false},
                {sTitle: "目的地", sName: "tolocation", bSortable: false},
                /*{sTitle: "调度里程数", sName: "distance"},*/
                /*{sTitle: "招投标状态", sName: "tender_status_view"},*/
                {sTitle: "运单状态", sName: "tender_status_view", bSortable: false},
                {sTitle: "车牌号", sName: "carnum", bSortable: false},
                {sTitle: "司机姓名", sName: "driver_name", bSortable: false},
                {sTitle: "联系方式", sName: "driver_phone", bSortable: false},
                /*{sTitle: "司机位置", sName: "city"},*/
                /*{sTitle: "计划发车时间", sName: "plan_leave_time"},
                {sTitle: "计划到达时间", sName: "plan_arrive_time"},*/
                {sTitle: "制单时间", sName: "create_time"},
                {sTitle: "进厂时间", sName: "arrivewh_time"},
                {sTitle: "出厂时间", sName: "leavewh_time"},
                {sTitle: "运抵时间", sName: "arrival_date"},
            ],
            "fnServerData" : function(sSource, aoData, fnCallback) {
                var searchParams = genSearchParams();
                      var now=new Date();//取今天的日期
                    $ips.gridLoadData(sSource, aoData, fnCallback, "shipment", "getShipments", searchParams, function(data) {
                  if(data.result){
                       $.each(data.result, function(i, item) {
                        is_dispatched = 0;
                            if(item.tender_limit != null && item.tender_limit != '' && item.tender_limit !== undefined ){
                                var tender_limit = new Date(item.tender_limit.replace("-","/").replace("-", "/"));
                                if( now< tender_limit ){
                                    item.tender_status_view = '竞标中';
                                }
                            }
                        item.is_binding = item.is_binding==1 ? '绑定':'未绑定';
                        if (item.carnum != undefined && item.carnum != '') {
                            is_dispatched = 1;
                        }
                        item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0" dispatched="'+is_dispatched+'"><span></span></label>';
                        item.operating = '';
                        if (userRole == 'carrier') {
                            item.operating = '<a class="check_order" id="'+userinfo.organ.orgcode+'_'+item.id+'">订单详情</a>&nbsp;'
                        }

                       if(item.status == '1'||item.status == '2'||item.status == '3'){
                           item.tender_status_view = '未生效';
                       }
                       if(item.status == '4'||item.status == '5'){
                           item.tender_status_view = '生效';
                       }
                       if(item.status == '6'){
                           item.tender_status_view = '装车';
                       }
                       if(item.status == '7'){
                           item.tender_status_view = '在途';
                       }
                       if(item.status == '8'||item.status == '9'||item.status == '10'){
                           item.tender_status_view = '运抵';
                       }
                       item.price_type=item.price_type ? item.price_type==1 ? '整车' : '每吨' : '';
                       if(item.weight){
                            item.unit_price=item.price/item.weight;
                            item.unit_price = parseFloat(item.unit_price);
                            item.unit_price = item.unit_price.toFixed(2);
                       }

                       });
                  }
                });
            },
            "fnDrawCallback" : function() {
                //订车操作
                /*var checkboxes = $("input[type='checkbox']");
                checkboxes.on("click", function() {
                    var $this = $(this);
                    if ($this.is(":checked")) {
                        checkboxes.prop("checked", false);
                        $this.prop("checked", true);
                    }
                });*/
            },
        });
    });
});

//获取选中的id
function getRowIds() {
    var id = '';
    $('#shipmentTbl input:checkbox[class="checkbox style-0"]:checked').each(function() {
        if(id==""){
            id += $(this).val();
        }else{
            id += ',' + $(this).val();
        }
    });
    return id;
}

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
    $ips.load('shipment', 'subcontracting',subparams,function(data) {
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
    var returntimes = moment().format('L')+' 00:00'+' - '+moment().format('L')+' 23:59';
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
//打印转运单
 $("#printtranshipment").click(function(){
        id = getRowId();
        if(id != null && id != undefined){
             $ips.load('shipment', 'getOrderList', {orgcode:userinfo.organ.orgcode, shipmentId:id }, function(data){
               if (data.length > 0) {
                  /* if(data[0].shipment_method != '零担'){
                       /!*$('#ordersInfo_s').hide();*!/
                       $ips.alert("只有零担才能打印订单");return false;
                   }*/
                   $("#ordersInfo_s").modal();
                   var content = '';
                 $.each(data, function(i, item){
                    if(content){
                        content += '<table style="width: 90mm; height: 95mm; page-break-after : always;"  border="1">';
                    }else{
                        content = ' <table style="width: 90mm; height: 95mm; page-break-after : always;" border="1">';
                    }

                     if(item.order_code){
                        content += '<tr><td colspan="2"><div align="center"><img src='+item.qrcode+' id="img" /><br><span>'+item.NewId+'</span></div></td></tr>';
                        //content += '<tr><td colspan="2"><div align="center"><img src='+item.qrcode+' id="img" /><br><span>'+item.order_code+'</span></div></td></tr>';

                     }
                     content += '<tr><td colspan="2"><div align="left"  style="margin-left: 5%;">编码：'+item.order_code+'</div></td></tr>';
                     var weight = parseFloat(item.weight);
                     content += '<tr><td colspan="2"><div align="left"  style="margin-left: 5%;">单位：'+item.from_name+'</div></td></tr>';
                     var carrier_name =  item.carrier_name == null ? '' : item.carrier_name;
                     var relation_phone =  item.relation_phone == null ? '' : item.relation_phone;
                     content += '<tr><td colspan="2"><div align="left"  style="margin-left: 5%;">承运：<span id="carrier_name_s">'+carrier_name+'  '+relation_phone+'</span></div></td></tr>';
                     content += '<tr><td colspan="2"><div align="left"  style="margin-left: 5%;">日期：'+item.date+'</div></td></tr>';
                     content += '<tr><td colspan="2"><div align="left"  style="margin-left: 5%;">到站：'+item.fromlocation + ' - ' + item.tolocation+'</div></td></tr>';
                     content += '<tr><td style="width: 60mm; padding-left: 5%"><p>1.微信扫一扫二维码</p> <p>2.选择在途-零担转包</p><p>3.扫条码</p></td><td style="width: 30mm;"  align="center" ><img src="barCode/QRcode.jpg" height="90px" width="90px"/></td></tr>';
                     content  +=  '</table>';
                    });

                   $("#table-product_s").html(content); 
               } else {
                   $("#table-product_s").html("<h3 style=\"text-align:center\">暂无订单信息</h3>");
               }  
            });
        }else{
            $ips.alert("请选择运单");
        } 
});




//发标
$("#issue_tender").click(function(){
    id = getRowId();
    $ips.load('shipment', 'checkTenderStatus', {shipmentId:id }, function(data){
        if(data.status != '1'){
            $ips.alert ('不能发标');
            return false;
        }
        else{
            $ips.locatesubsystem("project/shipment/issue_tender.html?id="+data.id,false);

        }
    });
});

//改标
$("#change_tender").click(function(){
    id = getRowId();
    $ips.load('shipment', 'checkTenderStatus', {shipmentId:id }, function(data){
        if(data.status == '2' && data.tender_status =='1'){
            $ips.locatesubsystem("project/shipment/issue_tender.html?id="+data.id+"&tender_act=edit",false);
        }else{
            $ips.alert ('不能改标');
            return false;

        }
    });
});


//评标
$("#tender_quote").click(function(){
    id = getRowId();
    if(id != null && id != undefined){
        $ips.load('shipment', 'tenderQuoteList', {shipmentId:id}, function(data){

            if(data == ''){
                $ips.alert ('此运单还没有出价');
                return false;
            }
            var tender_limit=data[0].tender_limit;
            var tender_limit = new Date(tender_limit.replace("-","/").replace("-", "/"));

            var now=new Date();//取今天的日期
            if(data[0].tender_status == '4'){
                $ips.alert ('无法对废标进行评标');
                return false;
            } else if(data[0].tender_status == '5'){
                $ips.alert ('无法对流标进行评标');
                return false;
            }else if(tender_limit>now ){
                $ips.alert ('竞标截止时间未到，不能评标');
                return false;
            }

            if (data.length>0) {
                var price = Number(data[0].price); //线路最高价
                var exceeding = Number(price * (data[0].over_rate * 0.01)) + Number(price); //超标价格

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
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">中标状态</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">操作</th>';
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

                    var quote_price = '';
                    if(item.price_type == '1'){//整车
                        quote_price = Number(item.quote_price)/Number(item.tender_weight);
                    }
                    else{//按吨
                        quote_price = Number(item.quote_price);
                    }

                    var carnum = '';
                    if(item.carnum != ''){
                        carnum = item.carnum;
                    }else{
                        carnum = '待定';
                    }

                    var status = '';
                    var operating ='';
                    var operating_type = '0';
                    var auditType = '0';
                    if(exceeding == '0' || Number(quote_price) >= price){
                        operating_type = '1';
                        if(Number(quote_price) < exceeding){
                            var auditType = '1';
                        }
                        else{
                            var auditType = '2';
                        }
                    }

                    //超额的报价，或者没有线路超额的数据
                    if(operating_type == '1'){
                        if(item.status == '1'){
                            operating = '预中标上报';
                        }
                        else if(item.status == '2'){
                            operating = '上报中';
                            status = '上报中';
                        }
                        else if(item.status == '3'){
                            operating = '取消中标';
                            status = '中标';
                        }
                    }
                    //没有超额的报价数据
                    if(operating_type == '0'){
                        if(item.status == '1'){
                            operating = '置为中标';
                        }
                        else if(item.status == '3'){
                            operating = '取消中标';
                            status = '中标';
                        }
                    }
                    content += '<tr>';
                    content += '<td style="white-space: nowrap;">'+ quote_type +'</td>';
                    content += '<td style="white-space: nowrap;">'+ quote_type_name +'</td>';
                    content += '<td style="white-space: nowrap;">'+ quote_type_phone +'</td>';
                    content += '<td style="white-space: nowrap;">'+ carnum +'</td>';
                    content += '<td style="white-space: nowrap;">'+ item.carrier_name+'</td>';
                    content += '<td style="white-space: nowrap;">'+ item.quote_price + '</td>';
                    if(item.price_type == '1'){
                        content += '<td style="white-space: nowrap;">'+ item.quote_price +'</td>';
                    }
                    else{
                        content += '<td style="white-space: nowrap;">'+ Number(item.quote_price * item.tender_weight).toFixed(2) +'</td>';
                    }


                    //content += '<td style="white-space: nowrap;">'+(Number(item.total_price)+Number(item.total_price) * (Number(item.invoice_rate) * 0.01))+'</td>';
                    content += '<td style="white-space: nowrap;" id=status_'+item.id+'>'+ status +'</td>';
                    if(item.is_cancel == '0'){
                        if(item.status == '2'){
                            content += '<td style="white-space: nowrap;" id=td_'+item.id+'>上报中</td>';
                        }
                        else{
                            if(operating_type == '1' && item.status == '1'){
                                content += '<td style="white-space: nowrap;" id=td_'+item.id+'><a href="javascript:void(0)"  id=operating_'+item.id+' onclick=operating_plan("'+operating_type+'","'+item.tender_id+'","'+item.id+'","'+item.quote_price+'","'+id+'","'+item.shipment_code+'","'+auditType+'","'+item.from_city+'","'+item.to_city+'","'+quote_type_name+'")>'+ operating +'</a></td>';
                            }else {
                                content += '<td style="white-space: nowrap;" id=td_' + item.id + '><a href="javascript:void(0)"  id=operating_' + item.id + ' onclick=operating("' + operating_type + '","' + item.tender_id + '","' + item.id + '","' + item.quote_price + '","' + id + '","' + item.shipment_code + '","' + auditType + '","' + item.from_city + '","' + item.to_city + '","' + quote_type_name + '")>' + operating + '</a></td>';
                            }
                        }
                    }
                    else{
                        content += '<td style="white-space: nowrap;">已作废</td>';
                    }
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
});

function operating(operating_type,tender_id,quote_id,quote_price,shipment_id,shipment_code,auditType,from_city,to_city,quote_type_name){

    if(status == '2'){
        $ips.alert ('审批人正在审批，无法取消操作');
        return false;
    }

    $ips.confirm("您确定要这样做吗？",function(btn) {
        if (btn == "确定") {

            $ips.load('shipment', 'changeTenderQuote', {operating_type:operating_type,tender_id:tender_id,quote_id:quote_id,quote_price:quote_price,shipment_id:shipment_id,shipment_code:shipment_code,auditType:auditType,from_city:from_city,to_city:to_city,quote_type_name:quote_type_name}, function(data){
                if(data.code == '0'){
                    var handle_a='<a href="javascript:void(0)"  id=operating_'+quote_id+' onclick=operating_plan("'+operating_type+'","'+tender_id+'","'+quote_id+'","'+quote_price+'","'+shipment_id+'","'+shipment_code+'","'+auditType+'","'+from_city+'","'+to_city+'","'+quote_type_name+'","'+status+'")>'+ data.message['operating'] +'</a>';
                    var id = data.message['quote_id'];
                    $("#status_"+id).html(data.message['status']);
                    $("#operating_"+id).html(data.message['operating']);
                    if(data.message['operating'] == '上报中'){
                        $("#td_"+id).html(data.message['operating']);
                    }
		            if(data.message['operating'] == '预中标上报'){
                        $("#operating_"+id).html(data.message['operating']);
                        $("#td_"+id).html(handle_a);
                    }
                }
                else{
                  alert (data.message);
                  return false;
              }

            });
        }
    });

}
//废标
$("#aband_tender").click(function(){
    var id = getRowId();
    $('#aband_remark').val('');
    $('#shipmentid').val(id);
    $('#dispatch_abandtender').modal();

});

//aband
$("#aband").click(function(){
    var id=$('#shipmentid').val();
    var aband_remark=$('#aband_remark').val();
    if(aband_remark==''){
        $ips.error('废标原因不能为空');
        return false;
    }else if(aband_remark.length>50){
        $ips.error('废标原因不能超过50字');
        return false;
    }
    $ips.load('tender', 'abandTender', {shipmentid:id,aband_remark:aband_remark}, function(data){
        if(data.code==1){
            $ips.error(data.msg);
            $("#dispatch_abandtender").modal("hide");
        }else if(data.code==0){
            $ips.succeed(data.msg);
            $("#dispatch_abandtender").modal("hide");
        }else if(data.code==2){
            $ips.error(data.msg);
            $("#dispatch_abandtender").modal("hide");
        }else{
            $ips.error(data.msg);
            $("#dispatch_abandtender").modal("hide");
        }
    });
});

//发标通知
$("#tender_msg").click(function(){
    var id = getRowId();
    $('#shipmentid').val(id);
    $ips.load('tender', 'tenderMsg',[{name:"shipmentid",value:id}], function(data){
        if (data.length>0) {
            var content = '<table id="tblMain" class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
            content += '<thead>';
            content += '<tr role="row">';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">发送时间</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">收信类型</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">收信人</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">是否发送成功</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">是否阅读</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">阅读时间</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">是否报价</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">报价时间</th>';
            content += '</tr>';
            content += '</thead>';
            content += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';

            $.each(data, function(i, item){
                if(item.status ==1){
                    item.status='未发送';
                }else if(item.status==2||item.status==4){
                    item.status='发送失败';
                }else{
                    item.status='发送成功';
                }
                if(item.to_type == 1){
                    item.to_type = '承运商';
                }else{
                    item.to_type = '司机';
                }
                if(item.is_read == 1){
                    item.is_read = '已阅读';
                }else{
                    item.is_read = '未阅读';
                }
                if(!item.push_time){item.push_time='--';}
                if(!item.read_time){item.read_time='--';}

                content += '<tr>';
                content += '<td style="white-space: nowrap;">'+ item.push_time +'</td>';
                content += '<td style="white-space: nowrap;">'+ item.to_type +'</td>';
                content += '<td style="white-space: nowrap;">'+ item.to_name +'</td>';
                content += '<td style="white-space: nowrap;">'+item.status+'</td>';
                content += '<td style="white-space: nowrap;">'+item.is_read+'</td>';
                content += '<td style="white-space: nowrap;">'+item.read_time+'</td>';
                content += '<td style="white-space: nowrap;">'+item.is_apply+'</td>';
                content += '<td style="white-space: nowrap;">'+item.create_time+'</td>';
                content += '</tr>';
            });
            content += '</tbody>';
            content += '</table>';
            $("#tenderMsg").html(content);
        } else {
            $("#tenderMsg").html("<h3 style=\"text-align:center\">暂无发标通知</h3>");
        }
    });
    $('#dispatch_tenderMsg').modal();
});
//运单查看
$("#waybill-button").click(function(){
    id = getRowId();
    if(id != null && id != undefined){
        $ips.locatesubsystem("project/shipment/waybill_tender.html?id="+id,true);
    }
});
//预中标需要弹出理由
function operating_plan(operating_type,tender_id,quote_id,quote_price,shipment_id,shipment_code,auditType,from_city,to_city,quote_type_name){
    if(status == '2'){
        $ips.alert ('审批人正在审批，无法取消操作');
        return false;
    }
    $('#dispatch_plantender').modal();
    $('#operating_type_val').val(operating_type);
    $('#tender_id_val').val(tender_id);
    $('#quote_id_val').val(quote_id);
    $('#quote_price_val').val(quote_price);
    $('#shipment_id_val').val(shipment_id);
    $('#shipment_code_val').val(shipment_code);
    $('#auditType_val').val(auditType);
    $('#from_city_val').val(from_city);
    $('#to_city_val').val(to_city);
    $('#quote_type_name_val').val(quote_type_name);
}
$("#plantender-button").click(function(){
    var aband_remark=$('#plan_remark').val();
    var operating_type = $('#operating_type_val').val();
    var tender_id = $('#tender_id_val').val();
    var quote_id = $('#quote_id_val').val();
    var quote_price = $('#quote_price_val').val();
    var shipment_id = $('#shipment_id_val').val();
    var shipment_code = $('#shipment_code_val').val();
    var auditType = $('#auditType_val').val();
    var from_city = $('#from_city_val').val();
    var to_city = $('#to_city_val').val();
    var quote_type_name = $('#quote_type_name_val').val();
    if(aband_remark==''){
        $ips.error('预中标原因不能为空');
        return false;
    }else if(aband_remark.length>=50){
        $ips.error('预中标原因不能超过50字');
        return false;
    }
    $("#plantender-button").attr("disabled","disabled");
    $ips.load('shipment', 'changeTenderQuote', {operating_type:operating_type,tender_id:tender_id,quote_id:quote_id,quote_price:quote_price,shipment_id:shipment_id,shipment_code:shipment_code,auditType:auditType,from_city:from_city,to_city:to_city,quote_type_name:quote_type_name,aband_remark:aband_remark}, function(data){
        $("#plantender-button").attr("disabled",false);
        $('#dispatch_plantender').modal('hide');
        $('#plan_remark').val('');
        $('#operating_type_val').val('');
        $('#tender_id_val').val('');
        $('#quote_id_val').val('');
        $('#quote_price_val').val('');
        $('#shipment_id_val').val('');
        $('#shipment_code_val').val('');
        $('#auditType_val').val('');
        $('#from_city_val').val('');
        $('#to_city_val').val('');
        $('#quote_type_name_val').val('');
        if(data.code == '0'){
            var id = data.message['quote_id'];
            $("#status_"+id).html(data.message['status']);
            $("#operating_"+id).html(data.message['operating']);
            if(data.message['operating'] == '上报中'){
                $("#td_"+id).html(data.message['operating']);
            }
            var content = "";
            var action = data.message['history'].action;
            action = action.replace("\n","<br>");
            content += '<tr>';
            content += '<td style="white-space: nowrap;">'+data.message['history'].time+'</td>';
            content += '<td style="white-space: nowrap;">'+data.message['history'].retify_name+'</td>';
            content += '<td style="white-space: nowrap;">'+action+'</td>';
            content += '</tr>';
            $("#history_list_id").append(content);
        }else{
            alert (data.message);
            return false;
        }

    });

});

//进厂弹框
$("#enter_factory").click(function(){
    var mydate=new Date();
    var y=mydate.getFullYear();
    var m=mydate.getMonth();
    var d=mydate.getDate();
    var h=mydate.getHours();
    var i=mydate.getMinutes();
    var s=mydate.getSeconds();
    if(parseInt(i)<=9){
        i = "0"+i;
    }
    if(parseInt(s)<=9){
        s = "0"+s;
    }
    var date= y+'-'+(m+1)+'-'+d+' '+h+':'+i+':'+'00';
    $('#enterTime').val(date);
        //进厂事件控件
    $('#enterTime').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true, 
        timePicker: true, 
        timePicker12Hour: false,
        format:'YYYY-MM-DD HH:mm:ss',
        minDate:'2015-01-01',
        maxDate:'2050-12-30',
        timePickerIncrement:1
    });
    //$('.calendar-time').append('<button class="applyBtn_s btn btn-success btn-sm pull-right btn-small">确定</button>');
    $('#dispatch_enterfactory').modal();
});
//出厂弹框
$("#out_factory").click(function(){
    var mydate=new Date();
    var y=mydate.getFullYear();//必须要有默input 认value
    var m=mydate.getMonth();
    var d=mydate.getDate();
    var h=mydate.getHours();
    var i=mydate.getMinutes();
    var s=mydate.getSeconds();
    if(parseInt(i)<=9){
        i = "0"+i;
    }
    if(parseInt(s)<=9){
        s = "0"+s;
    }
    var date= y+'-'+(m+1)+'-'+d+' '+h+':'+i+':'+'00';
    $('#outTime').val(date);
    //出厂事件控件
    $("#outTime").daterangepicker({
        singleDatePicker: true,//必须要有默input 认value
        showDropdowns: true, 
        timePicker: true, 
        timePicker12Hour: false,
        format:'YYYY-MM-DD HH:mm:ss',
        minDate:'2015-01-01',
        maxDate:'2050-12-30',
        timePickerIncrement:1
    });
    var id = getRowId();
    $("#orderMsg").html('');
    $ips.load('shipment', 'getOrderMsg',{shipmentid:id}, function(data){
        if (data.length>0) {
            var content = '<table id="tblMain" class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
            content += '<thead>';
            content += '<tr role="row">';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 80px; white-space: nowrap;">货物名称</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 80px; white-space: nowrap;">规格</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 80px; white-space: nowrap;">批号</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 80px; white-space: nowrap;">序列号</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 80px; white-space: nowrap;">包装单位</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 80px; white-space: nowrap;">数量</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 80px; white-space: nowrap;">重量</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 80px; white-space: nowrap;">体积</th>';
            content += '</tr>';
            content += '</thead>';
            content += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';

            $.each(data, function(i, item){
                if(!item.push_time){item.push_time='--';}
                if(!item.read_time){item.read_time='--';}

                content += '<tr>';
                content += '<td style="white-space: nowrap;">'+ item.product_name +'</td>';
                content += '<td style="white-space: nowrap;">'+ item.specification +'</td>';
                content += '<td style="white-space: nowrap;">'+ item.lot +'</td>';
                content += '<td style="white-space: nowrap;">'+item.serial+'</td>';
                content += '<td style="white-space: nowrap;">'+item.unit_name+'</td>';
                content += '<td style="white-space: nowrap;">'+item.quality+'</td>';
                content += '<td style="white-space: nowrap;">'+item.weight+'</td>';
                content += '<td style="white-space: nowrap;">'+item.volume+'</td>';
                content += '</tr>';
            });
            content += '</tbody>';
            content += '</table>';
            $("#orderMsg").html(content);
        } else {
            $("#orderMsg").html("<h3 style=\"text-align:center\">此为空运单暂无订单信息</h3>");
        }
    });
    $('#dispatch_outfactory').modal();
});
//运抵弹框
$("#complete").click(function(){
    var mydate=new Date();
    var y=mydate.getFullYear();
    var m=mydate.getMonth();
    var d=mydate.getDate();
    var h=mydate.getHours();
    var i=mydate.getMinutes();
    var s=mydate.getSeconds();
    if(parseInt(i)<=9){
        i = "0"+i;
    }
    if(parseInt(s)<=9){
        s = "0"+s;
    }
    var date= y+'-'+(m+1)+'-'+d+' '+h+':'+i+':'+'00';
    $('#arriveTime').val(date);
        //运抵时间控件
    $('#arriveTime').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true, 
        timePicker: true, 
        timePicker12Hour: false,
        format:'YYYY-MM-DD HH:mm:ss',
        minDate:'2015-01-01',
        maxDate:'2050-12-30',
        timePickerIncrement:1
    });
    $('#dispatch_complete').modal();
});
//进厂确定
$("#enterf").click(function(){
    var id = getRowId();
    var enterTime=$('#enterTime').val();
    $ips.load('shipment', 'enterFactory',{shipmentid:id,enterTime:enterTime}, function(data){
        if(data.code==2){
            $ips.succeed(data.msg);
            $('#shipmentTbl').dataTable().fnDraw();
            $('#dispatch_enterfactory').modal('hide');
        }else{
           $ips.error (data.msg);
            $('#dispatch_enterfactory').modal('hide');
        }
    });
});
//出场确定
$("#outf").click(function(){
    var id = getRowId();
    var outTime=$('#outTime').val();
    $ips.load('shipment', 'outFactory',{shipmentid:id,outTime:outTime}, function(data){
        if(data.code==2){
            $ips.succeed(data.msg);
            $('#shipmentTbl').dataTable().fnDraw();
            $('#dispatch_outfactory').modal('hide');
        }else{
           $ips.error (data.msg);
            $('#dispatch_outfactory').modal('hide');
        }
    });
});

//运抵
$('#arrive').on('click',function(){
    var id = getRowIds();
    var arriveTime=$('#arriveTime').val();
    $ips.load('shipment', 'complete',{shipmentId:id,arriveTime:arriveTime}, function(data){
        if(data.code==0){
            $ips.succeed('操作成功');
            $('#shipmentTbl').dataTable().fnDraw();
            $('#dispatch_complete').modal('hide');
        }else{
            $ips.error (data.msg);
            $('#dispatch_complete').modal('hide');
            return false;
        }
    });
})

function count(o){
    var t = typeof o;
    if(t == 'string'){
        return o.length;
    }else if(t == 'object'){
        var n = 0;
        for(var i in o){
            n++;
        }
        return n;
    }
    return false;
}

//导出按钮
loadScript('js/hui/jquery.hui.exportdata.js', function () {
    /*var date = new Date();
    var statistic_date='';
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var time = year+""+month+""+day;
    var exportSearchParams = [
        {name:"getTemplate",value:1},
    ];*/
    $('#export').on('click', function(){
        $('#orgcode').val(userinfo.organ.orgcode);
        /*var create_time=$('#statistic_date').val();
        var shipment_code=$('#shipment_code').val();
        var order_code=$('#order_code').val();
        var shipment_method=$('#shipment_method').val();
        var fromlocation=$('#fromlocation').val();
        var tolocation=$('#tolocation').val();
        var carrier_id=$('#carrier_id').val();
        var driver=$('#driver').val();
        var carnum=$('#carnum').val();
        var serial_num=$('#serial_num').val();
        var relate_bill=$('#relate_bill').val();
        exportSearchParams.push(
            {name:"statistic_date","value":create_time},
            {name:"shipment_code","value":shipment_code},
            {name:"order_code","value":order_code},
            {name:"shipment_method","value":shipment_method},
            {name:"driver","value":driver},
            {name:"carrier_id","value":carrier_id},
            {name:"carnum","value":carnum},
            {name:"orgcode","value":userinfo.organ.orgcode},
            {name:"userrole","value":'warehouse'},
            {name:"fromlocation","value":fromlocation},
            {name:"tolocation","value":tolocation},
            {name:"serial_num","value":serial_num},
            {name:"relate_bill","value":relate_bill}
        );*/
    });
    //$('#export').exportdata({dataModule : 'shipment',dataMethod:'getShipmentsForW',searchParams: exportSearchParams,title:'调度单',partDataRows:3000,partSize:100});
    $('#export').exportdata({dataModule : 'shipment',dataMethod:'getShipmentsForW',searchForm: '#frmSearch',title:'调度单',partDataRows:3000,partSize:100});
},true,true);

//绑定按钮
$('#binding').on('click',function(){
    $('#binding_org').modal();
})
$("#tycode").select2({
    placeholder:'请选择设备号',
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    query: function(query) {
        $ips.load('shipment', 'getTycode', {term: query.term}, function(e) {
            var _pre_data = [];
            //e = JSON.parse(e);
            $.each(e, function(k, v) {
                _pre_data.push({id: v, text: v});
            });
            var data = {results: _pre_data};
            query.callback(data);
        });
    }
});
//绑定确定按钮
$('#binding_button').on('click',function(){
    var id = getRowIds();
    var tycode = $('#tycode').val();
    if (tycode == ''){
        $ips.error('设备号为空');
    }else{
        $ips.load('shipment', 'binding',{id:id,tycode:tycode}, function(data){
            if(data.code==0){
                $ips.succeed('操作成功');
                $('#shipmentTbl').dataTable().fnDraw();
                $('#binding_org').modal('hide');
            }else{
                console.debug(data);
                $ips.error (data.message);
                $('#binding_org').modal('hide');
                return false;
            }
        });
    }
})

