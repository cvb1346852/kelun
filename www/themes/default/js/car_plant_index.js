var searchParams = new Array();
var NowId = [];
$(function() {
    //更多搜索条件按钮!
    var btnMoreSearch = $("#btnMoreSearch");
    btnMoreSearch.attr("state", "close");
    btnMoreSearch.click(function() {
        if (btnMoreSearch.attr("state") == "close") {
            $(".widget-body-toolbar").css("height", "auto");
            btnMoreSearch.text("收起条件");
            btnMoreSearch.attr("state", "open");
        } else {
            $(".widget-body-toolbar").css("height", "70");
            btnMoreSearch.text("更多条件");
            btnMoreSearch.attr("state", "close");
        }
    });

//初始化出发地省份选择
BindCity("");
BindCity1("");
BindCity2("");


    // 搜索按钮
    $("#btnSearch").click(function() {
        searchParams = $("#frmSearch").serializeArray();
        deletedId = [];
        $('#tblMain').grid("fnPageChange","first");
    });


    //加载车牌号选择框
    $("#carnum").select2({
        placeholder: "选择车牌号",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('car_plant', 'search',{carnum: e.term},function(data) {
                var item=[];
                $.each(data.result,function(x,y){
                    item.push({id: y.carnum, text: y.carnum });
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    });


    //加载司机姓名选择框
    $("#driver_name").select2({
        placeholder: "请输入司机姓名",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('car_plant', 'search',{driver_name: e.term},function(data) {
                var item=[];
                $.each(data.result,function(x,y){
                    item.push({id: y.driver_name, text: y.driver_name });
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    });

    //加载手机号选择框
    $("#driver_phone").select2({
        placeholder: "选择手机号",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('car_plant', 'search',{driver_phone: e.term},function(data) {
                var item=[];
                $.each(data.result,function(x,y){
                    item.push({id: y.driver_phone, text: y.driver_phone });
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    });

    //加载厢型选择框
    $("#carriage_type").select2({
        placeholder: "选择厢型",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('warehouse', 'getSearchCondition',{name: 'carriage_type', value: e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: x, text: y});
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    });


    //加载厢型选择框
    $("#carriage_type_c").select2({
        placeholder: "选择厢型",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('warehouse', 'getSearchCondition',{name: 'carriage_type', value: e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: x, text: y});
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
});


//修改司机信息
$("#change_driver").click(function(){
    id = getRowId();
    if(id != null && id != undefined){
        $ips.load('car_plant', 'getById',{id:id},function(data) {
            $('#truck_source_id').val(id);
            $('#driver_phone_c').html(data.driver_phone);
            $('#driver_name_c').val(data.driver_name);
            $('#id_card_c').val(data.id_card);
            $('#carnum_c').val(data.carnum);
            $('#car_length_c').val(data.car_length);
            $('#rated_load_c').val(data.rated_load);
            if(data.carriage_type){
                $ips.load('truck_source', 'getCarriageType', {id: data.carriage_type}, function(e) {
                    var _pre_data = [];
                    $.each(e, function(k, v) {
                        $(".select2-chosen").html(v.name);
                    });
                });

                $("#carriage_type_c").val(data.carriage_type);
            }

        });
        $("#change_driver_table").modal();

    }else{
        $ips.alert("请选择运单");
    }
});

//提交修改司机信息
$("#change_driver_button").click(function(){
    var truck_source_id=$('#truck_source_id').val();
    var driver_name =$('#driver_name_c').val();
    var id_card =$('#id_card_c').val();
    var carnum =$('#carnum_c').val();
    var car_length =$('#car_length_c').val();
    var carriage_type =$('#carriage_type_c').val();
    var rated_load =$('#rated_load_c').val();


    $ips.load('car_plant', 'change_driver', {truck_source_id:truck_source_id,driver_name:driver_name,id_card:id_card,carnum:carnum,car_length:car_length,carriage_type:carriage_type,rated_load:rated_load}, function(data){
        if(data.code == 0){
            $ips.succeed(data.message);
            $("#change_driver_table").modal("hide");
        }
        else{
            $ips.error(data.message);
            $("#change_driver_table").modal("hide");
        }

    });
});



// 表格
loadScript('js/hui/jquery.hui.grid.js',runDataTables);

function runDataTables() {
    $('#tblMain').grid({
        "fixedHeader":{ isOpen:false},
        "aoColumns" : [
            {sTitle: '<tr><label class="no-margin"><input type="checkbox" class="checkbox style-0 checkAll"><span> </span></label></th></tr>', sName: "idCheckbox", "bSortable": false,sClass: "center"},
            //{sTitle: '查看',sName: "check",sClass: "center",bSortable: false},
            {sTitle: "车牌号", sName: "carnum","bSortable": false},
            {sTitle: "车长", sName: "car_length","bSortable": false},
            {sTitle: "厢型", sName: "car_type","bSortable": false},
            {sTitle: "额定载重", sName: "rated_load","bSortable": false},
            {sTitle: "司机", sName: "driver_name","bSortable": false},
            {sTitle: "联系方式", sName: "driver_phone","bSortable": false},
            {sTitle: "定位位置", sName: "address","bSortable": false},
            {sTitle: "定位时间", sName: "time","bSortable": false},
            {sTitle: "定位方式", sName: "type","bSortable": false},
        ],
        "fnServerData" : function(sSource, aoData, fnCallback) {
            $ips.gridLoadData(sSource, aoData, fnCallback, "car_plant", "search", searchParams, function(pager) {
                pager.result = pager.result ? pager.result : [];
                $.each(pager.result, function(i, item) {
                    item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';
                    //item.check = '<l1abel><span><a href="javascript:;" onclick=check_truck("'+item.id+'")>查看</a></span></label>';
                    if(item.red_black == '1'){
                        item.driver_name =  item.driver_name+'[红]'
                    }
                    else if(item.red_black == '2'){
                        item.driver_name =  item.driver_name+'[黑]'
                    }
                    if(item.type == '1'){
                        item.type = 'LBS'
                    }
                    else if(item.type == '2'){
                        item.type = '微信定位'
                    }
                    else if(item.type == '3'){
                        item.type = '微信打卡'
                    }
                });
            });
        },
        "fnDrawCallback" : function() {
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
}


//获取选中的id
function getRowId(){
    if ($('#tblMain input:checkbox[name="checkbox-inline"]:checked').length != 1) {
        $ips.alert("只能选择一条记录进行订车操作");
    } else {
        return $('#tblMain input:checkbox[name="checkbox-inline"]:checked').eq(0).val();
    }
}


function addImmediate() {
    var id = getRowId();
    if(!id || id == ''){
        $ips.alert('请选择添加项');
        return false;
    }
    $ips.load('warehouse', 'addImmediate', {id: id}, function(data){
        if (data === true) {
            $ips.succeed('添加成功！');
        } else {
            $ips.error('添加失败，请稍后重试');
        }
    });
}



//红黑名单
$("#blacklist").click(function(){
    id = getRowId();
    if(id != null && id != undefined){
        $("#remark").html('');
        $("#truck_source_id").val(id);
        $("#blacklist_s").modal();
    }else{
        $ips.alert("请选择车辆");
    }
});

//提交红黑名单判定
$("#blacklist_button").click(function(){
    var truck_source_id=$('#truck_source_id').val();
    var type = $('input[type="radio"][name="type"]:checked').val();
    var remark =$('#remark').val();

    if(type == '' || type == undefined){
        $ips.error('请选择类型');
        return false;
    }
    $ips.load('car_plant', 'blacklist_change', {truck_source_id:truck_source_id,type:type,remark:remark}, function(data){
        if(data.code == 0){
            $ips.succeed(data.message);
            $("#blacklist_s").modal("hide");
        }
        else{
            $ips.error(data.message);
            $("#blacklist_s").modal("hide");
        }

    });
});

//lbs定位
$("#lbs").click(function() {
    id = getRowId();
    $ips.load('car_plant', 'lbs', {truck_source_id:id}, function(data){
        if(data.code == 0){
            $ips.succeed(data.message);
        }
        else{
            $ips.error(data.message);
        }
    });

});
//车辆性情
$("#truck_source_info").click(function(){
    id = getRowId();
    if(id != null && id != undefined){
        $ips.load('car_plant', 'truck_source_info', {truck_source_id:id}, function(data){
            var content = '';
            content += '<h4 class="modal-title" id="tender_quoteLabel">基础信息</h4>'
            content += '<table   class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
            content += '<tbody>';
            content += '<tr>';
            content += '<td style="white-space: nowrap;">车牌号：'+data.carnum+'</th>';
            content += '<td style="white-space: nowrap;">车长：'+data.car_length+'</th>';
            content += '<td style="white-space: nowrap;">厢型：'+data.car_type+'</th>';
            content += '</tr>';
            content += '<tr>';
            content += '<td style="white-space: nowrap;">额定载重：'+data.rated_load+'</th>';
            content += '<td style="white-space: nowrap;">司机姓名：'+data.driver_name+'</th>';
            content += '<td style="white-space: nowrap;">手机号码：'+data.driver_phone+'</th>';
            content += '</tr>';
            content += '</tbody>';
            content += '</table>';


            content += '<h4 class="modal-title" >信用度</h4>'
            content += '<table class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
            content += '<tbody>';
            content += '<tr>';
            content += '<td style="white-space: nowrap;">运输次数：'+data.delivery_times+'</th>';
            content += '<td style="white-space: nowrap;">运输质量：'+data.total_grade+'</th>';
            content += '<td style="white-space: nowrap;">被投诉量：'+data.complain_num+'</th>';
            content += '</tr>';
            content += '<tr>';
            content += '<td style="white-space: nowrap;">运输距离：'+data.total_distance+'</th>';
            content += '<td style="white-space: nowrap;">吨位：'+data.total_weight+'</th>';
            content += '<td style="white-space: nowrap;">打卡次数：'+data.sign_num+'</th>';
            content += '</tr>';
            content += '</tbody>';
            content += '</table>';

            content += '<h4 class="modal-title" >挂靠关系</h4>';
            content += '<table class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
            content += '<tbody>';
            $.each(data.relation,function(i,item){
                content += '<tr>';
                content += '<td style="white-space: nowrap;">'+item.create_time+'</th>';
                content += '<td style="white-space: nowrap;">'+item.carrier_name+'</th>';
                if(item.status == '1'){
                    content += '<td style="white-space: nowrap;">待审核</th>';
                }
                else if(item.status == '2'){
                    content += '<td style="white-space: nowrap;">审核未通过</th>';
                }
                else if(item.status == '3'){
                    content += '<td style="white-space: nowrap;">审核通过</th>';
                }

                content += '</tr>';
            });
            content += '</tbody>';
            content += '</table>';
            
            content += '<h4 class="modal-title" >历史承运</h4>';
            content += '<table class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
            content += '<tbody>';
            $.each(data.driveShps,function(i,item){
                content += '<tr>';
                content += '<td style="white-space: nowrap;">'+item.fromlocation+' - '+item.tolocation +'</th>';
                content += '<td style="white-space: nowrap;">'+item.count+'次</th>';

                content += '</tr>';
            });
            content += '</tbody>';
            content += '</table>';

            $("#truck_source_info_content").html(content);
            $('#truck_source_info_s').modal('show');

        });


    }else{
        $ips.alert("请选择车辆");
    }

});


//function check_truck(id){
//    if(id != null && id != undefined){
//        $ips.load('car_plant', 'truck_source_info', {truck_source_id:id}, function(data){
//            var content = '<table   class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
//            content += '<h4 class="modal-title" id="tender_quoteLabel">基础信息</h4>'
//            content += '<thead>';
//            content += '<tr>';
//            content += '<td style="white-space: nowrap;">车牌号：'+data.carnum+'</th>';
//            content += '<td style="white-space: nowrap;">车长：'+data.car_length+'</th>';
//            content += '</tr>';
//            content += '<tr>';
//            content += '<td style="white-space: nowrap;">厢型：'+data.car_type+'</th>';
//            content += '<td style="white-space: nowrap;">额定载重：'+data.rated_load+'</th>';
//            content += '</tr>';
//            content += '<tr>';
//            content += '<td style="white-space: nowrap;">司机姓名：'+data.driver_name+'</th>';
//            content += '<td style="white-space: nowrap;">手机号码：'+data.driver_phone+'</th>';
//            content += '</tr>';
//            content += '</thead>';
//            content += '</table>';
//
//
//            content += '<table class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
//            content += '<h4 class="modal-title" >信用度</h4>'
//            content += '<thead>';
//            content += '<tr>';
//            content += '<td style="white-space: nowrap;">运输次数：'+data.delivery_times+'</th>';
//            content += '<td style="white-space: nowrap;">运输质量：'+data.total_grade+'</th>';
//            content += '</tr>';
//            content += '<tr>';
//            content += '<td style="white-space: nowrap;">被投诉量：'+data.complain_num+'</th>';
//            content += '<td style="white-space: nowrap;">运输距离：'+data.total_distance+'</th>';
//            content += '</tr>';
//            content += '<tr>';
//            content += '<td style="white-space: nowrap;">吨位：'+data.total_weight+'</th>';
//            content += '<td style="white-space: nowrap;">打卡次数：'+data.sign_num+'</th>';
//            content += '</tr>';
//            content += '</thead>';
//            content += '</table>';
//
//            content += '<table class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
//            content += '<h4 class="modal-title" >挂靠关系</h4>'
//            content += '<thead>';
//            $.each(data.relation,function(i,item){
//                content += '<tr>';
//                content += '<td style="white-space: nowrap;">'+item.create_time+'</th>';
//                content += '<td style="white-space: nowrap;">'+item.carrier_name+'</th>';
//                if(item.status == '1'){
//                    content += '<td style="white-space: nowrap;">待审核</th>';
//                }
//                else if(item.status == '2'){
//                    content += '<td style="white-space: nowrap;">审核未通过</th>';
//                }
//                else if(item.status == '3'){
//                    content += '<td style="white-space: nowrap;">审核通过</th>';
//                }
//
//                content += '</tr>';
//            });
//            content += '</thead>';
//            content += '</table>';
//
//            $("#truck_source_info_content").html(content);
//            $('#truck_source_info_s').modal('show');
//
//        });
//
//
//    }else{
//        $ips.alert("请选择车辆");
//    }
//}

