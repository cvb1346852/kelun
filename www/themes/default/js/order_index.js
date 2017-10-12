/**
 * Author ZHM
 * 2016-7-12
 */  
var params = $ips.getUrlParams();
var btnMoreSearch = $("#btnMoreSearch");
var userinfo = $ips.getCurrentUser();
var userRole = '';
var gdata = [];
$(function() {
    //初始化出发地省份选择
    BindCity("");
    //初始化目的地省份选择
    BindCity1("");
});
$ips.include('/js/poshytip/tip-white/tip-white.css'); 
// 搜索按钮
$("#btnSearch").click(function() { 
    $('#shipmentTbl').grid("fnPageChange", "first");
});
//设置默认搜索时间
$('#statixstic_date').val(set_time_range());
$('#receipt_time').val(set_time_range());
$('#reportTime').val(moment().format('L')+' 00:00');
//选择搜索时间
$('#statixstic_date').daterangepicker({
    timePicker: true,//显示小时和分钟
    timePickerIncrement: 1, //分钟选择的间隔
    format: 'YYYY-MM-DD HH:mm', //返回值的格式
    timePicker12Hour: false, //采用24小时计时制
    showDropdowns: true, //是否显示年、月下拉框
});
$('#receipt_time').daterangepicker({
    timePicker: true,//显示小时和分钟
    timePickerIncrement: 1, //分钟选择的间隔
    format: 'YYYY-MM-DD', //返回值的格式
    timePicker12Hour: false, //采用24小时计时制
    showDropdowns: true, //是否显示年、月下拉框
});
//设置默认搜索时间
//$('#create_time').val(set_time_range());
$('#reportTime').val(moment().format('L')+' 00:00');
//选择搜索时间
$('#create_time').daterangepicker({
  //  timePicker: true,//显示小时和分钟
   // timePickerIncrement: 1, //分钟选择的间隔
    format: 'YYYY-MM-DD', //返回值的格式
    timePicker12Hour: false, //采用24小时计时制
    showDropdowns: true, //是否显示年、月下拉框
});

$('#clearDate').on('click', function () {
    $('#create_time').val('');
    return false;
});

$('#clearDate2').on('click', function () {
    $('#receipt_time').val('');
    return false;
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
//加载司机选择框
$("#driver").select2({
    placeholder: "选择司机",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('order', 'getCodetruckinfo',{orgcode:userinfo.organ.orgcode, driver_name: e.term,type:1},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y, text: y});
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
        $ips.load('order', 'getCodetruckinfo',{orgcode:userinfo.organ.orgcode, carnum:e.term,type:3},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y, text: y });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
}); 
//加载电话
$("#driver_phone").select2({
    placeholder: "选择联系方式",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('order', 'getCodetruckinfo',{orgcode:userinfo.organ.orgcode, getDriver_phone:e.term,type:2},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y, text: y });
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
    //查看订单
    $("#ordersInfo-button").click(function(){
        $("#table-product_detail").html("<h3 style=\"text-align:center\">获取数据中</h3>");
         getcarrier();
        id = getRowId();
        if(id != null && id != undefined){
            $ips.load('order', 'getOrderinfoprint', {orgcode:userinfo.organ.orgcode, order_code:id}, function(data){
                if (data.result.length > 0) {
                    var content = '<table id="tblMain" style="width:100%;background-color:#CCCCCC;" cellpadding="2" cellspacing="0" border="1"  class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" >';
                    content += '<thead>';
                    content += '<tr role="row">';
                    content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="货物名称: activate to sort column ascending" style="width: 164px; white-space: nowrap;">货物名称</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="规格: activate to sort column ascending" style="width: 164px; white-space: nowrap;">规格</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="批号: activate to sort column ascending" style="width: 164px; white-space: nowrap;">批号</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="序列号: activate to sort column ascending" style="width: 164px; white-space: nowrap;">类型</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="包装单位: activate to sort column ascending" style="width: 164px; white-space: nowrap;">包装单位</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="订单数量: activate to sort column ascending" style="width: 164px; white-space: nowrap;">订单数量</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="重量: activate to sort column ascending" style="width: 164px; white-space: nowrap;">重量</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="体积: activate to sort column ascending" style="width: 164px; white-space: nowrap;">体积</th>';
                    content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="生产厂家: activate to sort column ascending" style="width: 164px; white-space: nowrap;">生产厂家</th>';
                    content += '</tr>';
                    content += '</thead>';
                    content += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';
                    $.each(data.result, function(i, item){
                        var color = i%2 == 0 ? 'even' : 'odd';
                        content += '<tr class="'+color+'">';
                        content += '<td style="white-space: nowrap;">'+item.product_name+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.specification+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.lot+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.serial+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.unit_name+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.quality+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.weight+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.volume+'</td>';
                        content += '<td style="white-space: nowrap;">'+item.manufacturer+'</td>';
                        content += '</td>';
                        content += '</tr>';
                        $("#img").show();
                        $("#img").attr("src","img/code/"+item.order_code+".png");
                    });
                    content += '</tbody>';
                    content += '</table>';
                    $("#table-product_detail").html(content);
                    //加载图片
                } else {
                    $("#table-product_detail").html("<h3 style=\"text-align:center\">暂无订单信息</h3>");
                     $("#img").hide();
                }
            });
        }else{
            $ips.alert("请选择订单");
        }
    });  
// 打印
 function getcarrier(){
    $('#shipmentTbl input:checkbox[class="checkbox style-0"]:checked').each(function() {
        carrier_id = $(this).attr('data_carrier');
      $ips.load("order", "getBycarrierId", {id:carrier_id}, function(data) {
          showCarrier(data);
      });    
    });  
 };

    //查看签收详情
$("#orderReceipt-button").click(function(){

    var checkoutInfo = [];
    var images = [];
    var quality_abnormal = [];
    $("#remark").html('');
    id = getRowId();
    $ips.load("order", "checkoutDetail", {order_id:id}, function(data) {
        checkoutInfo = data.data;
        if(data.data){
            $("#signinfo_error").hide();
            $("#signinfo").show();
            $("#remark").html(data.data.remark);
            if(checkoutInfo.grade){
                var grade = data.data.grade;
                $("#jidigoutong").html(grade.jidigoutong);
                $("#driver_taidu").html(grade.driver_taidu)
            };
            if(checkoutInfo.images){
                images = checkoutInfo.images;
                if(images[0]){
                 $("#img1").attr("src",images[0]);

                    $("#img1").show();
                    var img = $("<img style='z-index: 9999 !important;'>").attr("src",images[0]);
                    $('#img1').poshytip({
                        content:img[0],
                        alignTo:"target",
                        alignX:"left",
                        alignY:"center",
                        offsetX:10,
                        z_index:9999
                    });

                }else{
                    $("#img1").hide();
                }
                if(images[1]){
                    $("#img2").attr("src",images[1]);
                    $("#img2").show();

                    var img = $("<img style='z-index: 9999 !important;'>").attr("src",images[1]);
                    $('#img2').poshytip({
                        content:img[0],
                        alignTo:"target",
                        alignX:"left",
                        alignY:"center",
                        offsetX:10,
                        z_index:9999
                    });
                }else{
                    $("#img2").hide();
                }
                if(images[2]){
                    $("#img3").attr("src",images[2]);
                    $("#img3").show();

                    var img = $("<img style='z-index: 9999 !important;'>").attr("src",images[2]);
                    $('#img3').poshytip({
                        content:img[0],
                        alignTo:"target",
                        alignX:"left",
                        alignY:"center",
                        offsetX:10,
                        z_index:9999
                    });
                }else{
                    $("#img3").hide();
                }
            }
            if(checkoutInfo.quality_abnormal){
                quality_abnormal = checkoutInfo.quality_abnormal;
                $("#package_damage_amount").html(quality_abnormal["package_damage_amount"] ? quality_abnormal["product_damage_number"] : '无');
                $("#package_damage_number").html(quality_abnormal["package_damage_number"] ? quality_abnormal["package_damage_number"] : '无');
                $("#product_damage_amount").html(quality_abnormal["product_damage_amount"] ? quality_abnormal["product_damage_amount"] : '无');
                $("#product_damage_number").html(quality_abnormal["product_damage_number"] ? quality_abnormal["product_damage_number"] : '无');
            }
                var  product_abnormal = '';
            $.each(data.data.product_abnormal,function(i,item){
                product_abnormal += item+'&nbsp';
            });
            $("#product_abnormal").html(product_abnormal != '' ? product_abnormal : '无');
        }else{
            $("#signinfo").hide();
            $("#signinfo_error").show();
            $("#signinfo_error").html("未获取订单签收信息");
        }

    });

});

    /*获取承运商信息*/
 function showCarrier(data)
{
    $("#carrier_name").html(data.carrier_name);
    $("#carrier-phone").html(data.relation_phone);
}   
    //展示订单列表
    loadScript('js/hui/jquery.hui.grid.js', function () {
        $('#shipmentTbl').grid({
            "aoColumns" : [
                {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
                {sTitle: "订单号", sName: "order_code",bSortable:false},
                {sTitle: "件数", sName: "quality",bSortable:false},
                {sTitle: "回单状态", sName: "receipt",bSortable:false},
                {sTitle: "回单时间", sName: "receipt_time",bSortable:false},
                {sTitle: "运输方式", sName: "shipment_method",bSortable:false},
                {sTitle: "一级业务员", sName: "first_business",bSortable:false},
                {sTitle: "业务类型", sName: "business_type",bSortable:false},
                {sTitle: "目的地", sName: "tolocation",bSortable:false},
                {sTitle: "收货方", sName: "to_name",bSortable:false},
                {sTitle: "收货方联系电话", sName: "to_phone",bSortable:false},
                {sTitle: "开单时间", sName: "create_time",bSortable:true},
                {sTitle: "签收状态", sName: "checkout",bSortable:false},
                {sTitle: "是否异常", sName: "checkout_list",bSortable:false},

                {sTitle: "出发地", sName: "fromlocation",bSortable:false},
                {sTitle: "发货方名称", sName: "from_name",bSortable:false},
                //{sTitle: "里程数", sName: "distance",bSortable:false},
                {sTitle: "车牌号", sName: "carnum",bSortable:false},
                {sTitle: "司机姓名", sName: "driver_name",bSortable:false},
                {sTitle: "司机电话", sName: "driver_phone",bSortable:false},
                //{sTitle: "计划发车时间", sName: "plan_leave_time",bSortable:true},
                //{sTitle: "计划到达时间", sName: "plan_arrive_time",bSortable:true},
            ],
            "fnServerData" : function(sSource, aoData, fnCallback) {
                var searchParams = genSearchParams();
                $ips.gridLoadData(sSource, aoData, fnCallback, "order", "manageOrderList", searchParams, function(data) {
                  if(data.result){
                       $.each(data.result, function(i, item) {
                           gdata[item.order_code] = {'s_status' : item.s_status};
                        is_dispatched = 0;
                        if (item.carnum != undefined && item.carnum != '') {
                            is_dispatched = 1;
                        }
                        item.idCheckbox = '<label class="checkbox">'
                            +'<input id="' + item.order_code + '" type="checkbox" '
                            +'name="checkbox-inline" class="checkbox style-0" value="'+item.order_code+'" data_status="'+item.receipt_status+'"  data_carrier="'+item.carrier_id+'" '
                            +'><span></span></label>';
                        item.operating = ''; 

                        $("#makedate").html(data.dateTime);
                           switch (item.checkout) {
                               case '3':
                                   item.checkout_list = '<span class="label label-warning font-sm" class="checkout">有异常</span>';
                                   break;
                               case '4':
                                   item.checkout_list = '<span class="label label-warning font-sm" class="checkout">有异常</span>';
                                   break;
                               default:
                                   item.checkout_list = '<span class="label label-success font-sm">无异常</span>';
                                   break;
                           }

                           item.receipt=item.receipt_status=='0' ? '<span class="label label-warning font-sm">未回单</span>' : '<span class="label label-success font-sm">已回单</span>';

                         if(data.checkout_type != 2){
                            switch (item.checkout) { 
                            case '1':
                                item.checkout = '<span class="label label-warning font-sm" class="checkout">未签收</span>';
                                break;  
                            case '2':
                                item.checkout = '<span class="label label-success font-sm">已签收</span>';
                                break; 
                            case '3':
                                item.checkout = '<span class="label label-success font-sm">已签收</span>';
                                break; 
                            default:
                                item.checkout = '<span class="label label-success font-sm">签收确认</span>';
                                break;
                          }
                         }else{
                            switch (item.checkout) {
                            case '2':
                                item.checkout = '<span class="label label-success font-sm">正常签收</span>';
                                break; 
                            case '3':
                                item.checkout = '<span class="label label-success font-sm">异常签收</span>';
                                break; 
                            case '4':
                                item.checkout = '<span class="label label-success font-sm">签收处理</span>';
                                break;  
                            case '5':
                                item.checkout = '<span class="label label-success font-sm">签收确认</span>';
                                break;
                            default: 
                                break;
                         } 
                        } 
                        if (userRole == 'carrier' || userRole == 'warehouse') {
                            item.operating = '<a class="check_order" id="'+userinfo.organ.orgcode+'_'+item.id+'">订单详情</a>&nbsp;'
                        }
                           if(item.from_province == item.to_province){
                                item.business_type = '省内'
                           }
                           else{
                               item.business_type = '省外'
                           }
                    });
                  }    
                });
            },
            "fnDrawCallback" : function() {
                /*//订车操作
                var checkboxes = $("input[type='checkbox']");
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
$(function(){
    $("#jsprint").click(function(){
        $("#table-product").printArea();
    });
});
 /*回单确认*/
$("#signOk-button").on('click',function(){
    remove();
    loadScript("js/plugin/jquery-form/jquery-form.min.js", '');
    loadScript('js/hui/jquery.hui.upload.js', uploadFile);
    var order_code =getRowIds();
    var order_codes=order_code.split(',');
    var  checkout_name = "";
    var num = 0;
    if(!order_code || order_code == ''){
        $ips.alert('请选择操作项');
        return false;
    }
    $.each(order_codes,function (i,v) {
        if(gdata[v].s_status != 8){
            num++;
        }
    });
    if (num>0){
        $ips.alert('操作项里有 '+num+' 项未运抵');
        return false;
    }
    $('#shipmentTbl input:checkbox[class="checkbox style-0"]:checked').each(function() {
        checkout_type = $(this).attr('data_status');
    });
    $('#shipmentTbl input:checkbox[class="checkbox style-0"]:checked').each(function() {
        order_id = $(this).attr('order_id');
    });
    console.log(checkout_type);
    if(checkout_type == 0){
        //$('#idcard').html('<input type="file"  id="idcardfile" size="100px" name="file" value="123456"/>');
        if(order_codes.length>1){
            $('.idcardfile').hide();
            $("#remark_signNo").val('');
            $("#checkout_type").val(checkout_type);
            $('#boxWorks').modal(); 
        }else{
            $('.idcardfile').show();
            $("#remark_signNo").val('');
            $("#checkout_type").val(checkout_type);
            $('#boxWorks').modal(); 
        }
        

    } else{
        $ips.alert('已经回单,不能进行操作');
        return false;
    }

});
function remove(){
    var file = $("#idcard") ;
    file.html('<input type="file"  id="idcardfile" size="100px" name="file" value="123456"/>');
    file.after(file.clone().val(""));
    file.remove();
}
/*回单查看*/
$("#signOk-show").on('click',function(){
    var order_code =getRowId();
    var  checkout_name = "";
    if(!order_code || order_code == ''){
        $ips.alert('请选择操作项');
        return false;
    }
    $('#shipmentTbl input:checkbox[class="checkbox style-0"]:checked').each(function() {
        checkout_type = $(this).attr('data_status');
    });
    $('#shipmentTbl input:checkbox[class="checkbox style-0"]:checked').each(function() {
        order_id = $(this).attr('order_id');
    });
    if(checkout_type == 0){
        $ips.alert('您未回单确认,不能进行操作');
        return false;

    } else{
        $ips.load("order", "showCheckImg", {order_code:order_code}, function(result){
            if(result.code == 0) {
                if(result.msg){
                    $("#remark_show").html(result.msg.remark_receipt ? result.msg.remark_receipt : '无');
                    $("#showCheckImg").attr("src",result.msg.abnormal_images);
                    $('#ordersImage').modal('show');
                }
            } else {
                $ips.error(result.msg);
            }
        });
    }

});
//上传附件
function uploadFile() {
    $('#idcardfile').upload({
        module: 'import',
        method: 'uploadImage',
        onSuccess: function(data) {
            if(data.code == 0){
                var abnormal_images=data.data;
                var order_code =getRowId();
                var remark = $("#remark_signNo").val();
                var checkout_type = $("#checkout_type").val();
                checkout_type = checkout_type == 3 ? 3 : 2;
                $("#saveidcard").attr("disabled",true);
                $ips.load("order", "updataAbnormalImage", {order_code:order_code,abnormal_images:abnormal_images,remark_receipt:remark}, function(data) {
                    if(data.code == 1){
                        $ips.load("order", "signOk", {order_code:order_code,checkout_type:checkout_type}, function(result){
                            $("#saveidcard").attr("disabled",false);
                            if(result.code == 0) {
                                $ips.succeed("操作成功!");
                                $('#boxWorks').modal('hide');
                                $('#shipmentTbl').dataTable().fnDraw();

                            } else if(result.code == 1){
                                $ips.error("操作失败！"+result.msg);
                                $('#boxWorks').modal('hide');
                            }
                        });
                    }else{
                        $ips.error("操作失败！"+data.message);
                        $('#boxWorks').modal('hide');
                        $('#shipmentTbl').dataTable().fnDraw();
                    }
                });
            }else{
                $ips.error("图片上传失败！"+data.message);
                $('#boxWorks').modal('hide');
                $('#shipmentTbl').dataTable().fnDraw();
            }
        }
    });

}

/*回单确认*/
$('#saveidcard').bind('click', function() {

    if ($('#idcardfile').val() != '') {
        $('#idcardfile').upload('submit');
        $('#idcard_modal .modal-header button').trigger('click');
        return false;
    }
    var order_code =getRowIds();
    var order_codes = order_code.split(',');
    var remark = $("#remark_signNo").val();
    var checkout_type = $("#checkout_type").val();
    checkout_type = checkout_type == 3 ? 3 : 2;
    $("#saveidcard").attr("disabled",true);
    $ips.load("order", "signOk", {order_code:order_code,checkout_type:checkout_type,remark_receipt:remark}, function(result){
        $("#saveidcard").attr("disabled",false);
        if(result.code == 0) {
            $ips.succeed("操作成功!");
            $('#boxWorks').modal('hide');
            $('#shipmentTbl').dataTable().fnDraw();

        } else if(result.code == 1){
            $ips.error("操作失败！"+result.msg);
            $('#boxWorks').modal('hide');
        }
    });
});
//设置时间范围  3天前
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
        var create_time=$('#create_time').val();
        var receipt_time=$('#receipt_time').val();
        var serial_num=$('#serial_num').val();
        var order_code=$('#order_code').val();
        var shipment_code=$('#shipment_code').val();
        var carnum=$('#carnum').val();
        var carrier_id=$('#carrier_id').val();
        var ddlProvince=$('#ddlProvince').val();
        var ddlCity=$('#ddlCity').val();
        var toloProvince=$('#toloProvince').val();
        var toloCity=$('#toloCity').val();
        var first_business=$('#first_business').val();
        var receipt=$('#receipt').val();
        var shipment_type=$('#shipment_type').val();
        var year_month=$('#year_month').val();      
        var driver=$('#driver').val();
        var driver_phone=$('#driver_phone').val();
        exportSearchParams.push(
            {name:"create_time","value":create_time},
            {name:"receipt_time","value":receipt_time},
            {name:"serial_num","value":serial_num},
            {name:"order_code","value":order_code},
            {name:"shipment_code","value":shipment_code},
            {name:"carnum","value":carnum},
            {name:"carrier_id","value":carrier_id},
            {name:"driver","value":driver},
            {name:"ddlProvince","value":ddlProvince},
            {name:"ddlCity","value":ddlCity},
            {name:"toloProvince","value":toloProvince},
            {name:"toloCity","value":toloCity},
            {name:"first_business","value":first_business},
            {name:"receipt","value":receipt},
            {name:"driver_phone","value":driver_phone},
            {name:"shipment_type","value":shipment_type},
            {name:"orgcode","value":userinfo.organ.orgcode},
            {name:"userrole","value":'warehouse'},
            {name:"year_month","value":year_month}
        );
    });
    $('#export').exportdata({dataModule : 'order',dataMethod:'manageOrderList',searchParams: exportSearchParams,title:'订单管理',partDataRows:3000,partSize:100});
},true,true);