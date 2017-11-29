/**
 * Author SUNJIE
 * 2016-7-12
 */
var params = $ips.getUrlParams();
var btnMoreSearch = $("#btnMoreSearch");
var userinfo = $ips.getCurrentUser();
var userRole = '';
var pageNo = 1;
var pageSize = 10;
/*$(function() {
    //初始化出发地省份选择
    //BindCity("");
    //初始化目的地省份选择
    //BindCity1("");
});*/

$ips.include('/js/poshytip/tip-white/tip-white.css');
// $ips.include('/js/hui/jquery.hui.grid.js');
// 搜索按钮
$("#btnSearch").click(function() {
    $('#shipmentTbl').grid("fnPageChange", "first");
});
//设置默认搜索时间
$('#reportTime').val(moment().format('L')+' 00:00');
$('#statistic_date').val(set_time_range());

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
var shipment_code_place = "选择运单号";
var carrier_id_place = "选择承运商";
var driver_place = "选择司机";
var carnum_place = "选择车辆";
if(params.data){
    jumpData  = params.data.split('_');
    $("#statistic_date").val(jumpData[0]+' 00:00 - '+jumpData[1]+' 23:59');
    pageNo = jumpData[2];
    pageSize = jumpData[3];
    if(jumpData[4]){
        shipment_code_place = jumpData[4];
    }
    $("#check_shipStatus").val(jumpData[5]);
    $("#shipment_method").val(decodeURI(jumpData[6]));
    $("#fromlocation").val(decodeURI(jumpData[7]));
    $("#tolocation").val(decodeURI(jumpData[8]));
    if(jumpData[9]){
        carrier_id_place = decodeURI(jumpData[9]);
    }
    if(jumpData[10]){
        driver_place = decodeURI(jumpData[10]);
    }
    if(jumpData[11]){
        carnum_place = decodeURI(jumpData[11]);
    }
    $("#bidding_status").val(decodeURI(jumpData[12]));
    $("#over_price").val(jumpData[13]);
    addSelect2();
}else{
    addSelect2();
}
function addSelect2(){
    //加载运单号选择框
    $("#shipment_code").select2({
        placeholder: "选择运单号",
        minimumInputLength: 1,
        multiple: false,
        allowClear: false,
        // 数据加载
        query: function(e) {
            $ips.load('shipment', 'getShipmentCodes',{orgcode:userinfo.organ.orgcode,/*is_tender:1,*/ shipment_code: e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.shipment_code, text: y.shipment_code });
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    });
    if(shipment_code_place != "选择运单号"){
        $("#shipment_code").select2("data", {id:shipment_code_place, text:shipment_code_place});
    }


//加载司机选择框
    $("#driver").select2({
        placeholder: "选择司机",
        minimumInputLength: 1,
        multiple: false,
        allowClear: false,
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

    if(driver_place != "选择司机"){
        $("#driver").select2("data", {id:driver_place, text:driver_place});
    }
//加载承运商选择框
    $("#carrier_id").select2({
        placeholder: "选择承运商",
        minimumInputLength: 1,
        multiple: false,
        allowClear: false,
        // 数据加载
        query: function(e) {
            $ips.load('warehouse', 'getSearchCondition',{name: 'carrier_id', value: e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y, text: y });
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    });
    if(carrier_id_place != "选择承运商"){
        $("#carrier_id").select2("data", {id:carrier_id_place, text:carrier_id_place});
    }
//加载车牌号选择框
    $("#carnum").select2({
        placeholder: "选择车辆",
        minimumInputLength: 1,
        multiple: false,
        allowClear: false,
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

    if(carnum_place != "选择车辆"){
        $("#carnum").select2("data", {id:carnum_place, text:carnum_place});
    }

/*//加载订车车牌号
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
    });*/

    $("#carriage_type").select2({
        placeholder: "厢型",
        allowClear: true,
        multiple: false,
        minimumInputLength: 0,
        data:[{id:0,text:'enhancement'},{id:1,text:'bug'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}],
        query: function(query) {
            $ips.load('truck_source', 'getCarriageType', {name: query.term}, function(e) {
                var _pre_data = [];
                $.each(e, function(k, v) {
                    _pre_data.push({id: v.id, text: v.name});
                });
                var data = {results: _pre_data};
                query.callback(data);
            });
        }
    }).on("change",function(e){
        if(e.val == '3A9C031FF4FA1647EA164434E71996AD' || e.val == '9D2C4D484F78AF4827D5EB6A977A4F5E'){
            $("#temperature_requirement").show();
        }else{
            $("#temperature_from").val('');
            $("#temperature_to").val('');
            $("#temperature_requirement").hide();
        }
    });

}

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
    console.log($("#statistic_date").val());
    if(params.data){
        jumpData  = params.data.split('_');
        searchParams[0].value = jumpData[0]+' 00:00 - '+jumpData[1]+' 23:59';
        if($("#statistic_date").val() != ""){
            searchParams[0].value = $("#statistic_date").val();
        }else{
            searchParams[0].value = 0;
        }
    }
    if(searchParams[0].value == ""){
        searchParams[0].value = 0;
    }
    return searchParams;
}


//验证身份
$ips.load('shipment', 'getRole', {orgcode:userinfo.organ.orgcode}, function(data){
    if (data.code == 1) {
        userRole = data.role;
        if (userRole == 'warehouse') {
            // $(".operating-button").append('<div class="btn-group"><a href="javascript:void(0)" id="dispatch-button" class="btn btn-default btn-only-one" data-toggle="modal" data-target="#dispatch">订车</a></div>');
        }
    }

    //清楚转包上报内容
    $('#reportTime').val('');
    $("#type option:first").prop("selected", 'selected');
    $('#position').val('');
    $('#reportCarnum').val('');

    //展示运单列表
    loadScript('/js/hui/jquery.hui.grid.js', function () {
        $('#shipmentTbl').grid({
            "aLengthMenu": [ 10, 25, 50, 100 ],
            "fixedHeader":{ isOpen:true},
            "iDisplayLength": pageSize,
            "iDisplayStart":(pageNo-1)*pageSize,
            "aoColumns" : [
                {sTitle: '操作', sName: "idCheckbox", bSortable: false},
                {sTitle: "运单号", sName: "shipment_code" , bSortable: false},
//                {sTitle: "业务类型", sName: "business_type" , bSortable: false},
                {sTitle: "运输方式", sName: "shipment_method" , bSortable: false},

                {sTitle: "出发地", sName: "fromlocation" , bSortable: false},
                {sTitle: "目的地", sName: "tolocation" , bSortable: false},
                {sTitle: "招投标状态", sName: "tender_status_view" , bSortable: false},

                {sTitle: "一口价", sName: "price" , bSortable: false},
                {sTitle: "价格备注", sName: "mp_remark" , bSortable: false,sClass:'dealrs'},
                {sTitle: "中标承运商", sName: "carrier_name" , bSortable: false},
                {sTitle: "车牌号", sName: "carnum" , bSortable: false},
                {sTitle: "司机姓名", sName: "driver_name" , bSortable: false},
                {sTitle: "联系方式", sName: "driver_phone" , bSortable: false},
                {sTitle: "装车件数", sName: "quality" , bSortable: false},
                {sTitle: "重量", sName: "weight" , bSortable: false},
                {sTitle: "体积", sName: "volume" , bSortable: false},
                {sTitle: "发标时间", sName: "create_time" , bSortable: false},
                {sTitle: "竞标截止时间", sName: "tender_limit" , bSortable: false},
                {sTitle: "中标时间", sName: "bid_time" , bSortable: false},

            ],
            "fnServerData" : function(sSource, aoData, fnCallback) {
                var searchParams = genSearchParams();
                var now=new Date();//取今天的日期
                $ips.gridLoadData(sSource, aoData, fnCallback, "tender", "getShipments", searchParams, function(data) {
                    pageNo = data.pageNo;
                    pageSize = data.pageSize;
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
                            }
                            else{
                                item.tender_status_view = '未发标';
                            }


                            if (item.carnum != undefined && item.carnum != '') {
                                is_dispatched = 1;
                            }
                            item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0" dispatched="'+is_dispatched+'"><span></span></label>';
                            item.operating = '';
                            if (userRole == 'carrier') {
                                item.operating = '<a class="check_order" id="'+userinfo.organ.orgcode+'_'+item.id+'">订单详情</a>&nbsp;'
                            }
                            if(item.tender_limit_color == true){
                                item.tender_limit = '<label style="white-space: normal;color:red;">'+item.tender_limit+'</label>';
                            }

                            if (item.mp_remark){
                                if(item.mp_remark.length>5 && GetStrWidth(item.mp_remark)>100){
                                    var str='';
                                    for(i=0;i<item.mp_remark.length;i++) {
                                        str += item.mp_remark.charAt(i);
                                        if (i>5 && GetStrWidth(str)>100){
                                            str +='...'
                                            break;
                                        }
                                    }
                                    item.mp_remark = "<span class='mp_remark' title='"+item.mp_remark+"' id='"+item.id+"'>"+str+"</span>";
                                }
                            }
                        });
                    }
                });
            },
            "fnDrawCallback" : function() {
                //订车操作
                var checkboxes = $("input[type='checkbox']");
                checkboxes.on("click", function() {
                  /*  var $this = $(this);
                    if ($this.is(":checked")) {
                        checkboxes.prop("checked", false);
                        $this.prop("checked", true);
                    }*/
                });
                loadScript('/js/poshytip/jquery.poshytip.min.js',function() {
                    $('.mp_remark').poshytip({
                        className: 'tip-white',
                        //alignTo: 'cursor',
                        //alignX: 'center',
                        //alignY: 'top',
                        fade: true
                    })
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

//获取选中的多个id
function getRowIds(){
    var ids = new Array();
    $('#shipmentTbl input:checkbox[name="checkbox-inline"]:checked').each(function (i,val) {
        ids[i] = this.value;
    });
    return ids;
}

//发标
$("#issue_tender").click(function(){
    id = getRowId();
    $ips.load('shipment', 'checkTenderStatus', {shipmentId:id }, function(data){
        if(data.status != '1'){
            $ips.alert ('不能发标');
            return false;
        }
        else{
            var createtime = $("#statistic_date").val();
            if(createtime){
                createtime  = createtime.split(' ');
            }else{
                createtime = set_time_range().split(' ');
            }

            var dataParams = $("#frmSearch").serialize();
            var dataParamsArr  = dataParams.split('&');
            var dataParamsStr = '';
            $.each(dataParamsArr,function(i,item){
                if(item.substr(0,item.indexOf("=")) != "statistic_date"){
                    dataParamsStr +=item.substr(item.indexOf("=")+1)+'_';
                }
            });
            $ips.locate("tender","issue_tender","id="+data.id+'&data='+createtime[0]+'_'+createtime[3]+'_'+pageNo+'_'+pageSize+'_'+dataParamsStr);
            //$ips.locate("tender","issue_tender","id="+data.id+"&data="+searchParams,false);

        }
    });
});

//改标
$("#change_tender").click(function(){
    id = getRowId();
    $ips.load('tender', 'checkTenderStatus', {shipmentId:id }, function(data){
        if(data.status == '2' && data.tender_status =='1'){

            var createtime = $("#statistic_date").val();
            if(createtime){
                createtime  = createtime.split(' ');
            }else{
                createtime = set_time_range().split(' ');
            }

            var dataParams = $("#frmSearch").serialize();
            var dataParamsArr  = dataParams.split('&');
            var dataParamsStr = '';
            $.each(dataParamsArr,function(i,item){
                if(item.substr(0,item.indexOf("=")) != "statistic_date"){
                    dataParamsStr +=item.substr(item.indexOf("=")+1)+'_';
                }
            });
            $ips.locate("tender","issue_tender",'id='+data.id+'&tender_act=edit&data='+createtime[0]+'_'+createtime[3]+'_'+pageNo+'_'+pageSize+'_'+dataParamsStr );
            // $ips.locate("tender","issue_tender",'id='+data.id+'&tender_act=edit&data=222' );
            //$ips.locatesubsystem("project/tender/issue_tender.html?id="+data.id+"&tender_act=edit",false);
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
        $ips.load('tender', 'tenderQuoteList', {shipmentId:id}, function(data){

            if(data == '' || data[0].id == null){
                $ips.alert ('此运单还没有出价');
                return false;
            }
            var tender_limit=data[0].tender_limit;
           // var tender_limit = new Date(tender_limit.replace("-","/").replace("-", "/"));

            //var now = Date.parse(new Date()) / 1000;//取今天的日期
            var now = data[0].now;
            //console.info(now);

            if(data[0].tender_status == '4'){
                $ips.alert ('无法对废标进行评标');
                return false;
            } else if(data[0].tender_status == '5'){
                $ips.alert ('无法对流标进行评标');
                return false;
            }else if(tender_limit>(now+0) ){
                $ips.alert ('竞标截止时间未到，不能评标');
                return false;
            }

            if (data.length>0) {
                if(data[0].price == '0' || data[0].price == '' || data[0].price == null){
                    //$ips.alert ('该线路暂无底价，请设置!');
                   // return false;
                }
                if(!data[0].routePrice){
                    data[0].routePrice='暂无线路底价';
                }
                if(!data[0].lastQuote){
                    data[0].lastQuote='暂无上期底价';
                }
                if(!data[0].lastYearQuote){
                    data[0].lastYearQuote='暂无同期底价';
                }
                var price = Number(data[0].price); //线路最高价
                var exceeding = Number(price * (data[0].over_rate * 0.01)) + Number(price); //超标价格
                var content='<p> '+data[0].from_location+' - '+data[0].to_location+' : 线路底价:&nbsp;&nbsp;'+data[0].routePrice+'&nbsp;&nbsp;上期底价:&nbsp;&nbsp;'+data[0].lastQuote+'&nbsp;&nbsp;同期底价:&nbsp;&nbsp;'+data[0].lastYearQuote+'</p>';
                content += '<table id="tblMain" class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
                content += '<thead>';
                content += '<tr role="row">';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">报价方类型</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">报价方</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">手机号</th>';
                //content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">车辆</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">开票承运商</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">含税报价</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">含税总价</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">中标状态</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">报价时间</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">报价备注</th>';
                content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">操作</th>';
                content += '</tr>';
                content += '</thead>';
                content += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';

                $.each(data, function(i, item){
                    //push_price = '';
                    /*计算超额率*/
                    /*if(item.maxprice != null){
                        if(item.price_type == 2){
                            push_price = (item.quote_price - item.maxprice)/(item.maxprice)*100 ;
                        }else{
                            push_price = (item.quote_price/item.weight - item.maxprice)/(item.maxprice)*100;
                        }
                    }else{
                        //*未设置线路低价*
                        push_price = '线路低价未设置';
                    }*/
                    var quote_type ='';
                    var quote_type_name = '';
                    var quote_type_phone = "";
                    if(item.quote_type == '1'){
                        quote_type = '承运商';
                        quote_type_name = item.carrier_name_s;
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
                    if(exceeding == '0' || Number(quote_price) > price){
                        operating_type = '1';
                        if(Number(quote_price) <= exceeding){
                            var auditType = '1';
                        }
                        else{
                            var auditType = '2';
                        }
                        if(price == 0){
                            var auditType = '3';
                        }

                    }
                    //超额的报价，或者没有线路超额的数据
                    if(operating_type == '1'){
                        if(item.status == '1'){
                           // operating = '预中标上报('+parseFloat(push_price).toFixed(2)+'%)';
                            operating = '预中标上报('+item.auditUser+')';
                        }
                        else if(item.status == '2'){
                            operating = '上报中('+item.auditUser+')';
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
                    content += '<td style="white-space: nowrap;"><a href="javascript:;" onclick=\'showSign("'+item.relation_id+'_'+item.quote_type+'")\'>'+ quote_type_name +'</a></td>';
                    content += '<td style="white-space: nowrap;">'+ quote_type_phone +'</td>';
                    //content += '<td style="white-space: nowrap;">'+ carnum +'</td>';
                    content += '<td style="white-space: nowrap;">'+ item.carrier_name_s+'</td>';
                    content += '<td style="white-space: nowrap;">'+ item.quote_price + '</td>';
                    if(item.price_type == '1'){
                        content += '<td style="white-space: nowrap;">'+ item.quote_price +'</td>';
                    }
                    else{
                        content += '<td style="white-space: nowrap;">'+ Number(item.quote_price * item.tender_weight).toFixed(2) +'</td>';
                    }


                    //content += '<td style="white-space: nowrap;">'+(Number(item.total_price)+Number(item.total_price) * (Number(item.invoice_rate) * 0.01))+'</td>';
                    content += '<td style="white-space: nowrap;" id=status_'+item.id+'>'+ status +'</td>';
                    content += '<td style="white-space: nowrap;">'+ item.create_time+'</td>';
                    content += '<td style="white-space: nowrap;">'+ item.quote_remark+'</td>';
                    if(data[0].shipmentStatus<7){
                        if(item.is_cancel == '0'){
                            if(item.status == '2'){
                                content += '<td style="white-space: nowrap;" id=td_'+item.id+'>'+operating+'</td>';
                            }
                            else{
                                if(operating_type == '1' && item.status == '1'){
                                    content += '<td style="white-space: nowrap;" id=td_'+item.id+'><a href="javascript:void(0)"  id=operating_'+item.id+' onclick=operating_plan("'+operating_type+'","'+item.tender_id+'","'+item.id+'","'+item.quote_price+'","'+id+'","'+item.shipment_code+'","'+auditType+'","'+item.from_city+'","'+item.to_city+'","'+quote_type_name+'","'+item.from_location+'","'+item.to_location+'")>'+ operating +'</a></td>';
                                }else if(operating == '取消中标'){
                                    content += '<td style="white-space: nowrap;" id=td_'+item.id+'><a href="javascript:void(0)"  id=operating_'+item.id+' onclick=operating_cancel("'+operating_type+'","'+item.tender_id+'","'+item.id+'","'+item.quote_price+'","'+id+'","'+item.shipment_code+'","'+auditType+'","'+item.from_city+'","'+item.to_city+'","'+quote_type_name+'","'+item.from_location+'","'+item.to_location+'")>'+ operating +'</a></td>';
                                }else {
                                    content += '<td style="white-space: nowrap;" id=td_' + item.id + '><a href="javascript:void(0)"  id=operating_' + item.id + ' onclick=operating("'+operating_type+'","'+item.tender_id+'","'+item.id+'","'+item.quote_price+'","'+id+'","'+item.shipment_code+'","'+auditType+'","'+item.from_city+'","'+item.to_city+'","'+quote_type_name+'","'+item.from_location+'","'+item.to_location+'")>' + operating + '</a></td>';
                                }
                            }
                        }
                        else{
                            content += '<td style="white-space: nowrap;">已作废</td>';
                        }
                    }
                    else{
                        if(item.is_cancel == '0'){
                            content += '<td style="white-space: nowrap;">有效</td>';
                        }
                        else{
                            content += '<td style="white-space: nowrap;">已作废</td>';
                        }
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



//批量发标
$("#issue_tenders").click(function(){
    id = getRowIds();
    if(id != null && id != undefined){
        $ips.load("tender", "checkTenderStatuies", {'shipmentId': id}, function(data) {
            if(data){
                var status = 0;
                var shipment_ids = '';
                var shipment_codes = '';
                var trans_types = '';
                $.each(data, function(k, v) {
                    if(v.status != '1'){
                        status =+1;
                    }
                    if(k != 0){
                        shipment_ids += ','+v.id;
                        shipment_codes +=  ','+ v.shipment_code;
                        trans_types += ','+ v.shipment_method;
                    }
                    else{
                        shipment_ids += v.id;
                        shipment_codes += v.shipment_code;
                        trans_types +=  v.shipment_method;
                    }
                });
                if(status != 0){
                    $ips.alert ('不能发标');
                    return false;
                }
            else{
                    var now = new Date();
                    var date = new Date(now.getTime() +  5 * 3600 * 1000);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var hour = date.getHours();
                    var minute = date.getMinutes();
                    if(parseInt(minute)<9){
                        minute = "0"+minute;
                    }
                    var second = date.getSeconds();
                    $('#tender_limit').val(year + '-' + month + '-' + day  + ' ' + hour + ':'+minute+':00');
                    //装车时间
                    var date1 = new Date(now.getTime() +  8 * 3600 * 1000);
                    var year1 = date1.getFullYear();
                    var month1 = date1.getMonth() + 1;
                    var day1 = date1.getDate();
                    var hour1 = date1.getHours();
                    var minute1 = date1.getMinutes();
                    if(parseInt(minute1)<9){
                        minute1 = "0"+minute1;
                    }
                    var second1 = date1.getSeconds();
                    $('#package_time').val(year1 + '-' + month1 + '-' + day1  + ' ' + hour1 + ':'+minute1+':00');
                    //默认时间设置
                    $('#package_time').daterangepicker({singleDatePicker: true,showDropdowns: true, timePicker: true, timePicker12Hour: false,format:'YYYY-MM-DD  HH:mm:ss',minDate:'2015-01-01',maxDate:'2050-12-30',timePickerIncrement:1});
                    $('#tender_limit').daterangepicker({singleDatePicker: true,showDropdowns: true, timePicker: true, timePicker12Hour: false,format:'YYYY-MM-DD  HH:mm:ss',minDate:'2015-01-01',maxDate:'2050-12-30',timePickerIncrement:1});

                    $("#shipment_ids").val(shipment_ids);
                    $("#shipment_codes").val(shipment_codes);
                    $("#trans_types").val(trans_types);
                    $('#issue_tenders_table').modal();
                }

            }

        });


    }else{
        $ips.alert("请选择运单");
    }
});

//保存批量发标
function savetenders() {
    if(!$('#frmInfo').validate().form()) {
        return false;
}
    var pa = $("#frmInfo").serializeArray();

    $ips.load("tender", "saveTenders", pa, function(result){
        //  $ips.unLockPage();
        if(result.status == '0') {
            $ips.succeed("保存成功。");
            $('#issue_tenders_table').modal("hide");

        } else {
            $ips.error(result.message);
        }
    });
    return false;
}

function operating(operating_type,tender_id,quote_id,quote_price,shipment_id,shipment_code,auditType,from_city,to_city,quote_type_name,from_location,to_location){
$('#operating_'+quote_id+'').css('display','none');
    $ips.confirm("您确定要这样做吗？",function(btn) {
        if (btn == "确定") {

            $('#operating_type_bidding').val(operating_type);
            $('#tender_id_bidding').val(tender_id);
            $('#quote_id_bidding').val(quote_id);
            $('#quote_price_bidding').val(quote_price);
            $('#shipment_id_bidding').val(shipment_id);
            $('#shipment_code_bidding').val(shipment_code);
            $('#auditType_bidding').val(auditType);
            $('#from_city_bidding').val(from_city);
            $('#from_location_bidding').val(from_location);
            $('#to_location_bidding').val(to_location);
            $('#to_city_bidding').val(to_city);
            $('#quote_type_name_bidding').val(quote_type_name);
            $('#bidding_remark_plantender').modal();


        }
        else{
            $('#operating_'+quote_id+'').css('display','block');
        }
    });

}


//中标上报理由提交
$("#bidding-button").click(function(){
    var bidding_remark=$('#bidding_remark').val();
    var operating_type = $('#operating_type_bidding').val();
    var tender_id = $('#tender_id_bidding').val();
    var quote_id = $('#quote_id_bidding').val();
    var quote_price = $('#quote_price_bidding').val();
    var shipment_id = $('#shipment_id_bidding').val();
    var shipment_code = $('#shipment_code_bidding').val();
    var auditType = $('#auditType_bidding').val();
    var from_city = $('#from_city_bidding').val();
    var to_city = $('#to_city_bidding').val();
    var from_location = $('#from_location_bidding').val();
    var to_location = $('#to_location_bidding').val();
    var quote_type_name = $('#quote_type_name_bidding').val();
    if(bidding_remark.length>=50){
        $ips.error('中标原因不能超过50字');
        return false;
    }
    $("#bidding-button").attr("disabled","disabled");
    $('#bidding_remark').val('');
     $ips.load('tender', 'changeTenderQuote', {operating_type:operating_type,tender_id:tender_id,quote_id:quote_id,quote_price:quote_price,shipment_id:shipment_id,shipment_code:shipment_code,auditType:auditType,from_city:from_city,to_city:to_city,quote_type_name:quote_type_name,from_location:from_location,to_location:to_location,bidding_remark:bidding_remark}, function(data){
         $("#bidding-button").attr("disabled",false);
         $('#bidding_remark_plantender').modal('hide');

         if(data.code == '0'){
         var id = data.message['quote_id'];
         $("#status_"+id).html(data.message['status']);
         $("#operating_"+id).html(data.message['operating']);
         if(data.message['operating'] == '上报中'){
         $("#td_"+id).html(data.message['operating']);
         }
         if(data.message['operating'] == '预中标上报'){
         var handle_a='<a href="javascript:void(0)"  id=operating_'+quote_id+' onclick=operating_plan("'+operating_type+'","'+tender_id+'","'+quote_id+'","'+quote_price+'","'+shipment_id+'","'+shipment_code+'","'+auditType+'","'+from_city+'","'+to_city+'","'+quote_type_name+'","'+from_location+'","'+to_location+'")>'+ data.message['operating'] +'</a>';
         $("#operating_"+id).html(data.message['operating']);
         $("#td_"+id).html(handle_a);
         }
         if(data.message['operating'] == '取消中标'){
         var handle_a='<a href="javascript:void(0)"  id=operating_'+quote_id+' onclick=operating_cancel("'+operating_type+'","'+tender_id+'","'+quote_id+'","'+quote_price+'","'+shipment_id+'","'+shipment_code+'","'+auditType+'","'+from_city+'","'+to_city+'","'+quote_type_name+'","'+from_location+'","'+to_location+'")>'+ data.message['operating'] +'</a>';
         $("#td_"+id).html(handle_a);
         }
         }
         else{
         $ips.alert(data.message);
         return false;
         }

     });

});


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
                    content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 100px; white-space: nowrap;">发送时间</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 100px; white-space: nowrap;">收信类型</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 100px; white-space: nowrap;">收信人</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 100px; white-space: nowrap;">是否发送成功</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 100px; white-space: nowrap;">是否阅读</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 100px; white-space: nowrap;">阅读时间</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 100px; white-space: nowrap;">是否报价</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 100px; white-space: nowrap;">报价时间</th>';
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
                    $("#tenderMsg").html("<h3 style=\"text-align:center;width:800px;\">暂无发标通知</h3>");
                }
            });
    $('#dispatch_tenderMsg').modal();
});
//中标通知
$("#bid_win").click(function(){
    var id = getRowId();
    $ips.load('tender', 'getShipType',[{name:"shipmentid",value:id}], function(json){
        if(json.carrier_name){
            json.is_reader=json.is_reader==0　? '未阅读':'已阅读';
            $("#bidWinMsg").html('<h3 style="text-align:center;width:800px;">'+json.carrier_name+'&nbsp;&nbsp;'+json.is_reader+'</h3>');
        }else{
            $("#bidWinMsg").html('<h3 style="text-align:center;width:800px;">未中标运单</h3>');
        }
    });
    $('#dispatch_bidwin').modal();
});

//运单查看
$("#waybill-button").click(function(){
    id = getRowId();
    if(id != null && id != undefined){
        $ips.locatesubsystem("project/shipment/waybill_tender.html?id="+id,true);
    }
});
//预中标需要弹出理由
function operating_plan(operating_type,tender_id,quote_id,quote_price,shipment_id,shipment_code,auditType,from_city,to_city,quote_type_name,from_location,to_location){
    $('#operating_type_val').val(operating_type);
    $('#tender_id_val').val(tender_id);
    $('#quote_id_val').val(quote_id);
    $('#quote_price_val').val(quote_price);
    $('#shipment_id_val').val(shipment_id);
    $('#shipment_code_val').val(shipment_code);
    $('#auditType_val').val(auditType);
    $('#from_city_val').val(from_city);
    $('#from_location_val').val(from_location);
    $('#to_location_val').val(to_location);
    $('#to_city_val').val(to_city);
    $('#quote_type_name_val').val(quote_type_name);
    $('#dispatch_plantender').modal();
}

//取消中标
function operating_cancel(operating_type,tender_id,quote_id,quote_price,shipment_id,shipment_code,auditType,from_city,to_city,quote_type_name,from_location,to_location){
    $('#operating_type_cancel').val(operating_type);
    $('#tender_id_cancel').val(tender_id);
    $('#quote_id_cancel').val(quote_id);
    $('#quote_price_cancel').val(quote_price);
    $('#shipment_id_cancel').val(shipment_id);
    $('#shipment_code_cancel').val(shipment_code);
    $('#auditType_cancel').val(auditType);
    $('#from_city_cancel').val(from_city);
    $('#to_city_cancel').val(to_city);
    $('#from_location_cancel').val(from_location);
    $('#to_location_cancel').val(to_location);
    $('#quote_type_name_cancel').val(quote_type_name);
    $('#cancel_tender').modal();
}

//预中标上报理由提交
$("#plantender-button").click(function(){
    var plan_remark=$('#plan_remark').val();
    var operating_type = $('#operating_type_val').val();
    var tender_id = $('#tender_id_val').val();
    var quote_id = $('#quote_id_val').val();
    var quote_price = $('#quote_price_val').val();
    var shipment_id = $('#shipment_id_val').val();
    var shipment_code = $('#shipment_code_val').val();
    var auditType = $('#auditType_val').val();
    var from_city = $('#from_city_val').val();
    var to_city = $('#to_city_val').val();
    var from_location = $('#from_location_val').val();
    var to_location = $('#to_location_val').val();
    var quote_type_name = $('#quote_type_name_val').val();
    if(aband_remark==''){
        $ips.error('预中标原因不能为空');
        return false;
    }else if(aband_remark.length>=50){
        $ips.error('预中标原因不能超过50字');
        return false;
    }
    $("#plantender-button").attr("disabled","disabled");
    $ips.load('tender', 'changeTenderQuote', {operating_type:operating_type,tender_id:tender_id,quote_id:quote_id,quote_price:quote_price,shipment_id:shipment_id,shipment_code:shipment_code,auditType:auditType,from_city:from_city,to_city:to_city,quote_type_name:quote_type_name,plan_remark:plan_remark,from_location:from_location,to_location:to_location}, function(data){
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
        $('#to_city_val').val('')
        $('#from_location_val').val('');
        $('#to_location_val').val('');
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
            $ips.alert (data.message);
            return false;
        }

    });

});


//取消中标理由提交
$("#canceltender-button").click(function(){
    var responsible_party=     $('input[type="radio"][name="responsible_party"]:checked').val();
    var cancel_remark=$('#cancel_remark').val();
    var operating_type = $('#operating_type_cancel').val();
    var tender_id = $('#tender_id_cancel').val();
    var quote_id = $('#quote_id_cancel').val();
    var quote_price = $('#quote_price_cancel').val();
    var shipment_id = $('#shipment_id_cancel').val();
    var shipment_code = $('#shipment_code_cancel').val();
    var auditType = $('#auditType_cancel').val();
    var from_city = $('#from_city_cancel').val();
    var to_city = $('#to_city_cancel').val();
    var from_location = $('#from_location_cancel').val();
    var to_location = $('#to_location_cancel').val();
    var quote_type_name = $('#quote_type_name_cancel').val();
    if(cancel_remark==''){
        $ips.error('取消中标原因不能为空');
        return false;
    }else if(cancel_remark.length>=50){
        $ips.error('预中标原因不能超过50字');
        return false;
    }
    if(responsible_party == ''){
        $ips.error('责任方不能为空');
        return false;
    }
    $("#canceltender-button").attr("disabled","disabled");
    $ips.load('tender', 'changeTenderQuote', {operating_type:operating_type,tender_id:tender_id,quote_id:quote_id,quote_price:quote_price,shipment_id:shipment_id,shipment_code:shipment_code,auditType:auditType,from_city:from_city,to_city:to_city,quote_type_name:quote_type_name,cancel_remark:cancel_remark,responsible_party:responsible_party,from_location:from_location,to_location:to_location}, function(data){
        $("#canceltender-button").attr("disabled",false);
        $('#cancel_tender').modal('hide');
        $('#cancel_remark').val('');
        $('#operating_type_cancel').val('');
        $('#tender_id_cancel').val('');
        $('#quote_id_cancel').val('');
        $('#quote_price_cancel').val('');
        $('#shipment_id_cancel').val('');
        $('#shipment_code_cancel').val('');
        $('#auditType_cancel').val('');
        $('#to_city_cancel').val('');
        $('#from_city_cancel').val('');
        $('#from_location_cancel').val('');
        $('#to_location_cancel').val('');
        $('#quote_type_name_cancel').val('');
        if(data.code == '0'){
            if(data.operating_type =='1'){
                var handle_a='<a href="javascript:void(0)"  id=operating_'+quote_id+' onclick=operating_plan("'+operating_type+'","'+tender_id+'","'+quote_id+'","'+quote_price+'","'+shipment_id+'","'+shipment_code+'","'+auditType+'","'+from_city+'","'+to_city+'","'+quote_type_name+'","'+from_location+'","'+to_location+'")>'+ data.message['operating'] +'</a>';
            }
            else{
                var handle_a='<a href="javascript:void(0)"  id=operating_'+quote_id+' onclick=operating("'+operating_type+'","'+tender_id+'","'+quote_id+'","'+quote_price+'","'+shipment_id+'","'+shipment_code+'","'+auditType+'","'+from_city+'","'+to_city+'","'+quote_type_name+'","'+from_location+'","'+to_location+'")>'+ data.message['operating'] +'</a>';

            }
            var id = data.message['quote_id'];
            $("#status_"+id).html(data.message['status']);
            $("#operating_"+id).html(data.message['operating']);
            $("#td_"+id).html(handle_a);

        }else{
            $ips.alert (data.message);
            return false;
        }

    });

});


//查看标的信息
$("#show_tender").click(function(){
    id = getRowId();
    if(id != null && id != undefined){
        $ips.load('tender', 'getTenderInfo', {shipmentId:id }, function(data){
         if(data){
             $('#dispatch_showTender').modal();
             $("#ship_method").html(data.trans_type);
             $("#cooperate_type_show").html(data.cooperate_type == 1 ? '竞价' : '一口价');
             //$("#car_length_show").html(data.car_length.replace(',','&nbsp;-&nbsp;'));
             $("#car_length_show").html(data.car_length== ',' ? '无要求' : (data.car_length.replace(',','&nbsp;到&nbsp;')));
             $("#price_type_show").html(data.price_type == 1 ? '整车报价' : '按吨报价');
             $("#carriage_type_show").html(data.car_name ? data.car_name : '无要求');
             $("#package_time_show").html(data.package_time);
             $("#tender_limit_show").html(data.tender_limit);
             $("#remark_show").html(data.remark ? data.remark : '未填写');
         }else{
             $ips.alert("未查询到发标信息");
         }
        });

    }else{
        $ips.alert("请选择运单");
    }
});


//指定承运商
$("#cpecify_carrier").click(function(){
    id = getRowId();
    if(id != null && id != undefined){
        //判断订单状态
        $ips.load('shipment', 'checkTenderStatus', {shipmentId:id }, function(data){
            if(data.status > 3){
                $ips.alert ('不能指定承运商');
                return false;
            }
            else{
                $('#assign_carrier_remark').val('');
                $("#cpecify_carrier_s").modal();
                $("#carries").html('');
                $("#shipmentid").val(id);
                $('#assign_carrier_remark').val(data.assign_remark);
                //加载承运商选择框
                $("#carries").select2({
                    placeholder: "选择承运商",
                    minimumInputLength: 1,
                    multiple: false,
                    allowClear: true,
                    // 数据加载
                    query: function(e) {
                        $ips.load('carrier', 'search',{'trans_type_cw': data.shipment_method,'cooperate_type_fixed_cw': '1','pageSize': '50','pageNo': '1',carrier_name: e.term,check_status:1},function(Carriers) {
                            var item=[];
                            $.each(Carriers.result,function(x,y){
                                item.push({id: y.carrier_id, text: y.carrier_name });
                            });
                            var data = {results: item};
                            e.callback(data);
                        });
                    }
                });

                $ips.load('carrier', 'search', {'trans_type_cw': data.shipment_method,'cooperate_type_fixed_cw': '1','pageSize': '50','pageNo': '1'}, function(Carriers){
                    $.each(Carriers.result, function(k, v) {
                        if(data.carrier_id == v.carrier_id){
                            $("#s2id_carries").find(".select2-chosen").html(v.carrier_name);
                            $('#carries').val(v.carrier_id);
                        }
                    });
                });
            }
        });
    }else{
        $ips.alert("请选择运单");
    }
});
//提交指定承运商
$("#cpecify_carrier_button").click(function(){
    var id=$('#shipmentid').val();
    var cpecify_carrie_id = $("#carries").val();
    var assign_remark=$('#assign_carrier_remark').val();
    if(cpecify_carrie_id == '' || cpecify_carrie_id == undefined){
        $ips.error('请选择承运商');
        return false;
    }
    $ips.load('tender', 'cpecify_carrier', {shipmentid:id,carrier_id:cpecify_carrie_id,assign_remark:assign_remark}, function(data){
        if(data.code == 0){
            $ips.succeed(data.message);
            $("#cpecify_carrier_s").modal("hide");
        }
        else{
            $ips.error(data.message);
            $("#cpecify_carrier_s").modal("hide");
        }

    });
});


//维护一口价
var dun=1;
$("#maintain_price_button").click(function(){
    id = getRowId();
    if(id != null && id != undefined){
        //判断订单状态
        $ips.load('shipment', 'checkTenderStatus', {shipmentId:id }, function(data){
            if(data.carrier_id == '' || data.carrier_id == '' || data.carrier_id == undefined){
                $ips.alert ('请先指定承运商');
                return false;
            }
            else{
                    dun=data.weight;
                    $("#maintain_price").val('');
                    $('#calculate_price').val('');
                    $("#maintain_price_remark").val('');
                    $("#maintain_price_s").modal();
                    $("#shipmentid").val(id);
                    $("#old_price").val(data.old_price);
                    $("#carrier_id_hidden").val(data.carrier_id);
            }
        });
    }else{
        $ips.alert("请选择运单");
    }

});
//指定一口价radio点击选中事件
var check_radio=2;
$('#check_radio input[name="price_type"]').click(function(){
    check_radio=$('#check_radio input[name="price_type"]:checked').val();
    if(check_radio==1){
        $('#maintain_name').text('整车价格');
        $('#calculate_name').text('单价');
        $('#calculate_price').val('');
        $('#maintain_price').val('');
    }else if(check_radio==2){
        $('#maintain_name').text('每吨价格');
        $('#calculate_name').text('总价');
        $('#calculate_price').val('');
        $('#maintain_price').val('');
    }
});
$(function () {
    $(document).on('keyup', '#maintain_price', function () {
        var self = this;
        var reg = /^[0-9]*$/
        if(reg.test(self.value)){
            if(check_radio==2){
               var tempdun=self.value*dun;
                tempdun = parseFloat(tempdun);
                tempdun = tempdun.toFixed(2);
                $('#calculate_price').val(tempdun);
            }else if(check_radio==1){
               var tempdun=self.value/dun;
                tempdun = parseFloat(tempdun);
                tempdun = tempdun.toFixed(2);
                $('#calculate_price').val(tempdun);
            }

        }
    });
})
//提交一口价
$("#maintain_price_save").click(function(){
    var id=$('#shipmentid').val();
    var old_price=$('#old_price').val();
    var maintain_price = $("#maintain_price").val();
    var maintain_price_remark = $("#maintain_price_remark").val();
    var calculate_price=$('#calculate_price').val();
    var carrier_id = $("#carrier_id_hidden").val();
    var remark = $("#maintain_price_remark").val();
    if(maintain_price == '' || maintain_price == undefined){
        $ips.error('请报价！');
        return false;
    }
    else{
        if(isNaN(maintain_price)){
            $ips.error('请填写正确的价格（纯数字）');
            return false;
        }
    }
    $ips.load('tender', 'maintain_price', {shipmentid:id,price:maintain_price,maintain_price_remark:maintain_price_remark,carrier_id:carrier_id,remark:remark,old_price:old_price,calculate_price:calculate_price,check_radio:check_radio}, function(data){
        if(data.code == 0){
            $ips.succeed(data.message);
            $("#maintain_price_s").modal("hide");
        }
        else{
            $ips.error(data.message);
            $("#maintain_price_s").modal("hide");
        }

    });
});

//
function showSign(id){
    $('.carrier_sign').html('');
    $('.driver_sign').html('');
    $ips.load('tender', 'getSignMsg', {data:id}, function(data){
        if(data.code == 0){
            var result=data.data;
            if(!result.total_price){
                result.total_price='0';
            }
            if(result.type==1){
                var content = '<table id="tblMain" class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
                content += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';
                content += '<tr>';
                content += '<td style="white-space: nowrap;">运输次数</td>';
                content += '<td style="white-space: nowrap;">'+ result.delivery_times +'</td>';
                content += '</tr>';
                content += '<tr>';
                content += '<td style="white-space: nowrap;">运输质量</td>';
                content += '<td style="white-space: nowrap;">'+ result.total_grade +'</td>';
                content += '</tr>';
                content += '<tr>';
                content += '<td style="white-space: nowrap;">被投诉量</td>';
                content += '<td style="white-space: nowrap;">'+ result.complain_num +'</td>';
                content += '</tr>';
                content += '<tr>';
                content += '<td style="white-space: nowrap;">运输距离</td>';
                content += '<td style="white-space: nowrap;">'+ result.total_distance +'</td>';
                content += '</tr>';
                content += '<tr>';
                content += '<td style="white-space: nowrap;">吨位</td>';
                content += '<td style="white-space: nowrap;">'+ result.total_weight +'</td>';
                content += '</tr>';
                content += '<tr>';
                content += '<td style="white-space: nowrap;">运单金额</td>';
                content += '<td style="white-space: nowrap;">'+ result.total_price+'</td>';
                content += '</tr>';
                content += '</tbody>';
                content +='</table>'
                $('.carrier_sign').html(content);
                $("#carrier_sign").modal();
            }else if(result.type==2){
                var cont = '<table id="tblMain" class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
                cont += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';
                cont += '<tr>';
                cont += '<td style="white-space: nowrap;">运输次数</td>';
                cont += '<td style="white-space: nowrap;">'+ result.delivery_times +'</td>';
                cont += '</tr>';
                cont += '<tr>';
                cont += '<td style="white-space: nowrap;">运输质量</td>';
                cont += '<td style="white-space: nowrap;">'+ result.total_grade +'</td>';
                cont += '</tr>';
                cont += '<tr>';
                cont += '<td style="white-space: nowrap;">被投诉量</td>';
                cont += '<td style="white-space: nowrap;">'+ result.complain_num +'</td>';
                cont += '</tr>';
                cont += '<tr>';
                cont += '<td style="white-space: nowrap;">运输距离</td>';
                cont += '<td style="white-space: nowrap;">'+ result.total_distance +'</td>';
                cont += '</tr>';
                cont += '<tr>';
                cont += '<td style="white-space: nowrap;">吨位</td>';
                cont += '<td style="white-space: nowrap;">'+ result.total_weight +'</td>';
                cont += '</tr>';
                cont += '<tr>';
                cont += '<td style="white-space: nowrap;">打卡次数</td>';
                cont += '<td style="white-space: nowrap;">'+ result.sign_num+'</td>';
                cont += '</tr>';
                cont += '</tbody>';
                cont +='</table>'
                $('.driver_sign').html(cont);
               $("#driver_sign").modal();
            }
        }
        else{
            $ips.error(data.msg);
        }

    });

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
        var check_shipStatus=$('#check_shipStatus').val();
        var shipment_method=$('#shipment_method').val();
        var fromlocation=$('#fromlocation').val();
        var tolocation=$('#tolocation').val();
        var carrier_name=$('#carrier_id').val();
        var driver=$('#driver').val();
        var carnum=$('#carnum').val();
        var bidding_status=$('#bidding_status').val();
        var over_price=$('#over_price').val();
        exportSearchParams.push(
            {name:"statistic_date","value":create_time},
            {name:"shipment_code","value":shipment_code},
            {name:"check_shipStatus","value":check_shipStatus},
            {name:"shipment_method","value":shipment_method},
            {name:"driver","value":driver},
            {name:"carrier_name","value":carrier_name},
            {name:"carnum","value":carnum},
            {name:"orgcode","value":userinfo.organ.orgcode},
            {name:"userrole","value":'warehouse'},
            {name:"fromlocation","value":fromlocation},
            {name:"tolocation","value":tolocation},
            {name:"bidding_status","value":bidding_status},
            {name:"over_price","value":over_price}
        );
    });
    $('#export').exportdata({dataModule : 'tender',dataMethod:'getShipmentsForM',searchParams: exportSearchParams,title:'派车管理',partDataRows:3000,partSize:100});
},true,true);

//获取字符串宽度
function GetStrWidth(text){
    var currentObj = $('<span>').hide().appendTo(document.body);
    $(currentObj).html(text);
    var width = currentObj.width();
    currentObj.remove();
    return width;
}

