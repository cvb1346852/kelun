/**
 * Author ZHM
 * 2016-7-12
 */
var btnMoreSearch = $("#btnMoreSearch");
$ips.include('/js/poshytip/tip-white/tip-white.css');
// 搜索按钮
$("#btnSearch").click(function() {
    $('#shipmentTbl').grid("fnPageChange", "first");
});
//设置默认搜索时间
$('#create_time').val(set_time_range());
$('#reportTime').val(moment().format('L')+' 00:00');
//选择搜索时间
$('#statixstic_date').daterangepicker({
    timePicker: true,//显示小时和分钟
    timePickerIncrement: 1, //分钟选择的间隔
    format: 'YYYY-MM-DD HH:mm', //返回值的格式
    timePicker12Hour: false, //采用24小时计时制
    showDropdowns: true, //是否显示年、月下拉框
});

//设置默认搜索时间
$('#create_time').val(set_time_range());
$('#reportTime').val(moment().format('L')+' 00:00');
//选择搜索时间
$('#create_time').daterangepicker({
    timePicker: true,//显示小时和分钟
    timePickerIncrement: 1, //分钟选择的间隔
    format: 'YYYY-MM-DD HH:mm', //返回值的格式
    timePicker12Hour: false, //采用24小时计时制
    showDropdowns: true, //是否显示年、月下拉框
});
//设置时间范围  3天前
function set_time_range(){
    var returntimes = moment().subtract(7, 'days').format('L')+' 00:00'+' - '+moment().format('L')+' 23:59';
    return returntimes;
}

//展示订单列表
loadScript('js/hui/jquery.hui.grid.js', function () {
$('#shipmentTbl').grid({
    "aoColumns" : [
        {sTitle: '<tr><label class="no-margin"><input type="checkbox" class="checkbox style-0 checkAll"><span> </span></label></th></tr>', sName: "idCheckbox", "bSortable": false},
        {sTitle: "投诉时间", sName: "create_time",bSortable:true},
        {sTitle: "联系方式", sName: "connect_phone",bSortable:false},
        {sTitle: "投诉内容", sName: "content",bSortable:false},
        {sTitle: "仲裁结果", sName: "result",bSortable:false},
        {sTitle: "责任方类型", sName: "responsible_type",bSortable:false},
        {sTitle: "责任方", sName: "responsible_name",bSortable:false},
        {sTitle: "车辆", sName: "responsible_carnum",bSortable:false},
    ],
    "fnServerData" : function(sSource, aoData, fnCallback) {
        var searchParams = $("#frmSearch").serializeArray();
        $ips.gridLoadData(sSource, aoData, fnCallback, "appeal", "searchList", searchParams, function(data) {
            if(data.result){
                $.each(data.result, function(i, item) {
                    item.idCheckbox = '<label class="checkbox">'
                        +'<input id="' + item.id + '" type="checkbox" '
                        +'name="checkbox-inline" class="checkbox style-0" value="'+item.id+','+item.content+','+item.result+','+item.responsible_type+','+item.responsible_name+','+item.responsible_carnum+','+item.remark+'" data_status="'+item.checkout+'"'
                        +'><span></span></label>';
                    switch (item.result) {
                        case '0':
                            item.result = '<span class="label label-warning font-sm" class="checkout">未判定</span>';
                            break;
                        case '1':
                            item.result = '<span class="label label-success  font-sm" class="checkout">成立</span>';
                            break;
                        case '2':
                            item.result = '<span class="label label-danger font-sm" class="checkout">不成立</span>';
                            break;
                    }
                    switch (item.responsible_type) {
                        case '1':
                            item.responsible_type = '<span class="label label-primary font-sm" class="checkout">承运商</span>';
                            break;
                        case '2':
                            item.responsible_type = '<span class="label label-info font-sm" class="checkout">基地</span>';
                            break;
                    }
                    item.content = item.content.substring (0,50);
                });

            }
        });
    }
});
});
//查看运单回放
$("#ordersInfo-button").on('click',function(){
        var responsible_carnum = '';
        var responsible_name = '';
        id = getRowId();
        /*将字符串截取显示*/
        paramArr = id.split(",");
        id = paramArr[0];
        content = paramArr[1];
        result = paramArr[2];
        responsible_type = paramArr[3];
        responsible_name = paramArr[4];
        responsible_carnum = paramArr[5];
        remark = paramArr[6];
        $("#responsible_type_old").val(responsible_type);
        $("#result_name_old").val(responsible_name);
        $("#appeal_id").val(id);
        $("#content_text").html(content);
        $("#result").val(result);
        $("#responsible_type").val(responsible_type == 'null' ? 0 : responsible_type);//带入默认责任方 类型
        responsible_name = paramArr[4] ?  paramArr[4] : "请选择责任方";//带入默认责任方
        responsible_carnum = responsible_carnum ?  paramArr[5] : "请选择车牌号";//带入默认车牌号
        $("#remark").val(remark== 'null' ? '' : remark);

        loadparams(responsible_name,responsible_carnum);
});
function loadparams(responsible_name,responsible_carnum){
    $("#result_name").select2({
        placeholder: responsible_name,
        minimumInputLength: 2,
        multiple: false,
        allowClear: false,
        // 数据加载
        query: function(e) {
            $ips.load('appeal', 'getResultName',{result_type: $("#responsible_type").val() , responsible_name : e.term},function(data) {
                if(!data){
                    $ips.error("请选择责任方类型！");
                    return false;
                }
                var item=[];
                $.each(data,function(x,y){
                    if($("#responsible_type").val() == 1){
                        item.push({id: y.carrier_name, text: y.carrier_name });
                    }else{
                        item.push({id: y.name, text: y.name });
                    }
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    }).on("select2-removed", function() {
    });
    if(responsible_name != "请选择责任方"){
        $("#result_name").select2("data", {id:responsible_name, text:responsible_name});
    }else{
        $("#result_name").select2("data", {id:'请选择责任方', text:'请选择责任方'});
    }
    console.info(responsible_carnum);
 //加载车牌号选择框
        $("#carnum").select2({
            placeholder: responsible_carnum,
            minimumInputLength: 2,
            multiple: false,
            allowClear: false,
            // 数据加载
            query: function(e) {
                $ips.load('appeal', 'getResultName',{result_type:3,carnum : e.term},function(data) {
                    var item=[];
                    item.push({id: '请选择车牌号', text: '请选择车牌号' });
                    $.each(data,function(x,y){
                        item.push({id: y.carnum, text: y.carnum });
                    });
                    var data = {results: item};
                    e.callback(data);
                });
            }
        }).on("select2-removed", function() {
        });
    if(responsible_carnum != "请选择车牌号"){
        $("#carnum").select2("data", {id:responsible_carnum, text:responsible_carnum});
    }else{
        $("#carnum").select2("data", {id:'请选择车牌号', text:'请选择车牌号'});
    }
};


//提交仲裁
function saveidcard  () {
    if($("#result").val() == 0){
        $ips.error("请选择仲裁结果");
        return false;
    }
    if($("#responsible_type").val() == 0){
        $ips.error("请选择责任方类型");
        return false;
    }
    if($("#result_name").val() == "请选择责任方" || $("#result_name").val() == ''){
        $ips.error("请选择责任方名称");
        return false;
    }
    if($("#carnum").val() == "请选择车牌号"){
        $("#carnum").val('');
    }
    if($("#responsible_type_old").val() != $("#responsible_type").val() && $("#result_name").val() == $("#result_name_old").val()){
        $ips.error("请重新选择责任方");
        return false;
    }
    $("#jsprint_s").attr("disabled",true);
    var order_code =getRowId();
    var searchParams = $("#frmSearch_appeal").serializeArray();
    $ips.load("appeal", "updateAppeal", searchParams, function(result){
        if(result) {
            $ips.succeed("操作成功!");
            $('#ordersInfo').modal('hide');
            $('#shipmentTbl').dataTable().fnDraw();
            //setTimeout( window.location.reload(), 3000 );
        } else {
            $ips.error("操作失败！"+result.message);
            $('#ordersInfo').modal('hide');
            $('#shipmentTbl').dataTable().fnDraw();
        }
    });
};

//删除消息
$("#deleted-button").on('click',function(){
    id = getRowIds();
    if(!id || id == ''){
        $ips.alert('请选择删除项');
        return false;
    }
    /*将字符串截取显示*/
    var length = id.split(',').length;
    $ips.confirm("您确定要删除这"+length+"条投诉吗？",function(btn) {
        if (btn == "确定") {
            $ips.lockPage();
            $ips.load('appeal', 'deletedAppeal', {ids:id}, function(data){
                $ips.unLockPage();
                if(data){
                    $ips.succeed("操作成功!");
                    $('#ordersInfo').modal('hide');
                    $('#shipmentTbl').dataTable().fnDraw();
                }
                else{
                    $ips.error("操作失败！"+result.message);
                    $('#ordersInfo').modal('hide');
                    $('#shipmentTbl').dataTable().fnDraw();
                }

            });
        }
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
        create_time=$('#create_time').val();
        exportSearchParams.push({name:"create_time","value":create_time});
    });
    exportSearchParams.push({name:"filename","value":"投诉列表导出-" + time});
    $('#export').exportdata({dataModule : 'appeal',dataMethod:'searchList',searchParams: exportSearchParams,title:'投诉列表',partDataRows:3000,partSize:100});
},true,true);


loadScript("js/plugin/jquery-form/jquery-form.min.js", '');
//获取选中的id
function getRowId(){
    if ($('#shipmentTbl input:checkbox[name="checkbox-inline"]:checked').length == 0) {
        $ips.alert("请选择至少一条记录进行操作");
    } else {
        return $('#shipmentTbl input:checkbox[name="checkbox-inline"]:checked').eq(0).val();
    }
}

function getRowIds() {
    var id = '';
    $('#shipmentTbl input:checkbox[class="checkbox style-0"]:checked').each(function() {
        idStr = $(this).val().substr(0,$(this).val().indexOf(","));
        if(id==""){
            id += idStr;
        }else{
            id += ',' + idStr;
        }
    });
    return id;
}