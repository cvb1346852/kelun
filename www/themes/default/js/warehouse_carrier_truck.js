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
            $ips.load('warehouse', 'getSearchCondition',{name: 'carnum', value: e.term},function(data) {
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
            $ips.load('warehouse', 'getSearchCondition',{name: 'driver_name', value: e.term},function(data) {
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
            $ips.load('warehouse', 'getSearchCondition',{name: 'driver_phone', value: e.term},function(data) {
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

});

// 表格
loadScript('js/hui/jquery.hui.grid.js',runDataTables);

function runDataTables() {
    $('#tblMain').grid({
        "fixedHeader":{ isOpen:true},
        "aoColumns" : [
                        {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
                        {sTitle: "车牌号", sName: "carnum","bSortable": false},
                        {sTitle: "车长", sName: "car_length","bSortable": false},
                        {sTitle: "厢型", sName: "carriage_type","bSortable": false},
                        {sTitle: "额定载重", sName: "rated_load","bSortable": false},
                        {sTitle: "司机", sName: "driver_name","bSortable": false},
                        {sTitle: "联系方式", sName: "driver_phone","bSortable": false},
                        {sTitle: "当前位置", sName: "city","bSortable": false}
                    ],
        "fnServerData" : function(sSource, aoData, fnCallback) {
            $ips.gridLoadData(sSource, aoData, fnCallback, "warehouse", "carrierTruck", searchParams, function(pager) {
                pager.result = pager.result ? pager.result : [];
                $.each(pager.result, function(i, item) {
                    item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';
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

function addImmediate() {
    var id = getRowIds();
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