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
            $ips.load('warehouse', 'getImmediateSearchCondition',{name: 'carnum', value: e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.carnum, text: y.carnum });
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    });
    //加载司机选择框
    $("#driver_name").select2({
        placeholder: "选择司机",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('warehouse', 'getImmediateSearchCondition',{name: 'driver_name', value: e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.driver_name, text: y.driver_name });
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    });
    //加载电话选择框
    $("#driver_phone").select2({
        placeholder: "选择联系方式",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('warehouse', 'getImmediateSearchCondition',{name: 'driver_phone', value: e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
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
    /*//加载承运商选择框
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
    });*/
    //加载电话选择框
    $("#motorcade1").select2({
        placeholder: "选择车队",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('warehouse', 'getMotorcade',{name: e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.name, text: y.name });
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    });
    //设置车队
    $("#motorcade").select2({
        placeholder: "请选择车队",
        allowClear: true,
        multiple: false,
        minimumInputLength: 1,
        data:[{id:0,text:'enhancement'},{id:1,text:'bug'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}],
        query: function(query) {
            $("#clearMoreRe_warehouse").click();
            $ips.load('motorcade_warehouse', 'getByGroup', {name: query.term}, function(e) {
                var _pre_data = [];
                $.each(e, function(k, v) {
                    _pre_data.push({id: v.id, text: v.name});
                });
                var data = {results: _pre_data};
                query.callback(data);
            });
        }
    }).on("select2-removed", function(e) {
        $("#motorcade").val('');
        $("#motorcade_id").val('');
        $("#motorcade_name").val('');
    }).on("select2-selecting", function(f) {
        $("#motorcade").val(f.object.text);
        $("#motorcade_id").val(f.object.id);
        $("#motorcade_name").val(f.object.text);
    });
});
function exChange() {
    var id = getRowIds();
    if(!id || id == ''){
        $ips.alert('请选择操作项');
        return false;
    }
    NowId = id.split(',');
    $("#remarkListModal").modal('show');
    $("#set").html('你已选择 '+NowId.length+' 辆车');
    $("#motorcade_id").val('');
    $("#motorcade_name").val('');
}



function change() {
    if(!NowId || NowId == []){
        $ips.alert('数据异常');
        return false;
    }

    $ips.load("truck_source", "changeWarehouse",{'id':NowId.join(','),'motorcade_id': $("#motorcade_id").val(),'motorcade_name': $("#motorcade_name").val()}, function(result){
        if(result) {
            $ips.succeed('操作成功');
            $('#tblMain').dataTable().fnDraw();
        } else {
            $ips.error("操作失败！");
        }
    });
}


// 表格
loadScript('js/hui/jquery.hui.grid.js',runDataTables);

function runDataTables() {
    $('#tblMain').grid({
        "fixedHeader":{ isOpen:false},
        "aoColumns" : [
                        {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
                        {sTitle: "车牌号", sName: "carnum","bSortable": false},
                        {sTitle: "车长", sName: "car_length","bSortable": false},
                        {sTitle: "厢型", sName: "carriage_type","bSortable": false},
                        {sTitle: "额定载重", sName: "rated_load","bSortable": false},
                        {sTitle: "司机", sName: "driver_name","bSortable": false},
                        {sTitle: "联系方式", sName: "driver_phone","bSortable": false},
                        {sTitle: "车队", sName: "motorcade","bSortable": false},
                        {sTitle:  "当前位置", sName: "address","bSortable": false}
                    ],
        "fnServerData" : function(sSource, aoData, fnCallback) {
            $ips.gridLoadData(sSource, aoData, fnCallback, "warehouse", "immediateTruck", searchParams, function(pager) {
                pager.result = pager.result ? pager.result : [];
                $.each(pager.result, function(i, item) {
                    var mycars=searchParams;
                    item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';
                    item.address =  '<input id="car_' + item.id + '" type="hidden" >';
                    $ips.load("truck_source", "getAddressList", {driver_phone: item.driver_phone, type: item.type, carnum: item.carnum}, function(result) {
                        if(result.address){
                            $("#car_"+item.id).parent().html(result.address);
                        }
                    });

                });
            });
        },
        "fnDrawCallback" : function() {
            $('#checkAll').click(function(){
                $(".btn-only-one").addClass('disabled');
                if ($(this).is(":checked")) {
                    $(".btn-must-one").removeClass('disabled');
                } else {
                    $(".btn-must-one").addClass('disabled');
                }
            });
        }
    });
}

function getRowIds() {
    var id = '';
    $('#tblMain input:checkbox[class="checkbox style-0"]:checked').each(function() {
        if(id==""){
            id += $(this).val();
        }else{
            id += ',' + $(this).val();
        }
    });
    return id;
}

function del() {
    var id = getRowIds();
    if(!id || id == ''){
        $ips.alert('请选择删除项');
        return false;
    }
    var length = id.split(',').length;
    $ips.confirm("您确定要删除这"+length+"条记录吗?",function(btn) {
        if (btn == "确定") {
            $ips.lockPage();
            $ips.load('warehouse', 'immediateTruckDelete', {id: id}, function(data){
                $ips.unLockPage();
                if (data == true) {
                    $ips.succeed('删除成功！');
                    $("#btnSearch").trigger("click");
                } else {
                    $ips.error('删除失败，请稍后重试');
                }
            });
        }
    });
}