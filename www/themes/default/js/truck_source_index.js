var params = $ips.getUrlParams();
var searchParams = new Array();
var deletedId = [];
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

    $("#selfTruck").click(function(){
        $ips.locatesubsystem("project/truck_source/self_truck.html",false);
    });
    $("#editPage").click(function (){
        $ips.locatesubsystem("project/truck_source/edit.html",false);
    });
    $("#affiliated").click(function (){
        $ips.locatesubsystem("project/truck_source/edit.html?affiliated=1",false);
    });
    $("#assess").click(function (){
        $ips.locatesubsystem("project/truck_source/assess.html",false);
    });

    //导入按钮
    $("#simport").click(function(){
        $("#selftruckfile").val("");
    });
    $("#affiliated").click(function(){
        $("#affiliatedfile").val("");
    });

    //导出按钮
    loadScript('js/hui/jquery.hui.exportdata.js', function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var time = year+""+month+""+day;
        var exportSearchParams = [
            {name:"getTemplate",value:1},
        ];
        $('#selftruck_modal .export').on('click', function(){
            exportSearchParams.push({name:"filename","value":"自有车辆模板-" + time});
        });
        $('#affiliated_modal .export').on('click', function(){
            window.open('/inside.php?t=xls&m=exportdata&f=downloadTemplate&modeltype=affiliated');
            //exportSearchParams.push({name:"filename","value":"挂靠车辆模板-" + time});
        });
        //$('.export').exportdata({dataModule : 'truck_source',dataMethod:'search',searchParams: exportSearchParams,title:'车源列表',partDataRows:3000,partSize:100});
    },true,true);

    //加载车牌号选择框
    $("#carnum").select2({
        placeholder: "选择车牌号",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('truck_source', 'getSearchCondition',{name: 'carnum', value: e.term},function(data) {
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
            $ips.load('truck_source', 'getSearchCondition',{name: 'driver_name', value: e.term},function(data) {
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
        placeholder: "司机电话号码",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('truck_source', 'getSearchCondition',{name: 'driver_phone', value: e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.driver_phone, text: y.driver_phone });
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    });
    //车队选择
    $("#motorcade_name_search").select2({
        placeholder: "选择车队",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('truck_source', 'getSearchCondition',{name: 'motorcade_name', value: e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.motorcade_name, text: y.motorcade_name });
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
            $("#clearMoreRe").click();
            $ips.load('motorcade', 'getByGroup', {name: query.term}, function(e) {
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

    //厢型
    $("#carriage_type").select2({
        placeholder: "请选择厢型",
        allowClear: true,
        multiple: false,
        minimumInputLength: 1,
        query: function(query) {
            $("#clearMoreRe").click();
            $ips.load('truck_source', 'getCarriageType', {name: query.term}, function(e) {
                var _pre_data = [];
                $.each(e, function(k, v) {
                    _pre_data.push({id: v.id, text: v.name});
                });
                var data = {results: _pre_data};
                query.callback(data);
            });
        }
    })

});

// 表格
function runDataTables() {
	$('#tblMain').grid({
		"fixedHeader":{ isOpen:false},
		"fnServerData" : function(sSource, aoData, fnCallback) {
			$ips.gridLoadData(sSource, aoData, fnCallback, "truck_source", "search", searchParams, function(pager) {
                pager.result = pager.result ? pager.result : [];
				$.each(pager.result, function(i, item) {
                    item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';
                    item.weight = item.weight == 1 ? '轻载' : '重载';
                    item.cartype = item.type;
                    item.type = item.type == 1 ? 'LBS' : ( item.type == 2 ? 'GPS' : '其他');
                    item.address =  '<input id="car_' + item.id + '" type="hidden" >';
                    if(item.from == 2){
                        item.idAction = '<a href="javascript:void(0);"  onclick="aedit(\'' + item.id + '\')">查看</a>';
                        item.from =  '挂靠';
                    }else{
                        item.idAction = '<a href="javascript:void(0);"  onclick="edit(\'' + item.id + '\')">编辑</a>';
                        item.from =  '自有';
                    }//基地查看
                    if(item.w) item.idAction = '<a href="javascript:void(0);"  onclick="edit(\'' + item.id + '\')">查看</a>';
                    $ips.load("truck_source", "getAddressList", {driver_phone: item.driver_phone, type: item.cartype, carnum: item.carnum}, function(result) {
                        if(result.address){
                            $("#car_"+item.id).parent().html(result.address);
                        }
                    });

                });
			});
		},
		"aoColumns" : [
                        {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
                        {sTitle: "操作", sName: "idAction","bSortable": false},
		               	{sTitle: "车牌号", sName: "carnum","bSortable": false},
						{sTitle: "车长", sName: "car_length","bSortable": false},
						{sTitle: "厢型", sName: "carriage_type","bSortable": false},
						{sTitle: "额定载重", sName: "rated_load","bSortable": false},
						{sTitle: "司机姓名", sName: "driver_name","bSortable": false},
						{sTitle: "司机电话号码", sName: "driver_phone","bSortable": false},
                        {sTitle: "行政关系", sName: "from","bSortable": false},
                        {sTitle: "车队", sName: "motorcade_name","bSortable": false},
                        {sTitle: "位置", sName: "address","bSortable": false}
					]
	});
}

function aedit(id) {
    $ips.locate("truck_source", "edit", "id="+id+"&affiliated=1");
}

function edit(id) {
    $ips.locate("truck_source", "edit", "id="+id);
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
    var ids = id.split(',');
    $ips.confirm("您确定要删除这"+ids.length+"条记录吗?",function(btn) {
        if (btn == "确定") {
            $ips.lockPage();
            $ips.load("truck_source", "del", "id=" + id, function(result){
                $ips.unLockPage();
                if(result) {
                    $ips.succeed("操作成功！");
                    $('#tblMain').dataTable().fnDraw();
                } else {
                    $ips.error("操作失败！");
                }
            });
        }
    });
}


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

   $ips.load("truck_source", "change",{'id':NowId.join(','),'motorcade_id': $("#motorcade_id").val(),'motorcade_name': $("#motorcade_name").val()}, function(result){
       if(result) {
           $ips.succeed('操作成功');
           $('#tblMain').dataTable().fnDraw();
       } else {
           $ips.error("操作失败！");
       }
   });
}


loadScript('js/hui/jquery.hui.grid.js',runDataTables);
loadScript("js/plugin/jquery-form/jquery-form.min.js", '');
loadScript('/js/poshytip/jquery.poshytip.min.js','');
loadScript('js/hui/jquery.hui.upload.js', uploadFile);
//上传附件
function uploadFile() {
    //自有车辆导入文件上传
    $('#selftruckfile').upload({
        onSuccess: function(data) {
            // 是否覆盖数据
            var repeat = $("input[name='selftruckinsert']:checked").val();
            // 取标题
            $titles = $ips.load("import", "getTitle", "filepath=" + data.savepath + data.savename);
            log.debug($titles);
            // 存数据
            $ips.load("import", "save", "filepath=" + data.savepath + data.savename + "&repeat=" + repeat, function(data){
                if (data) {
                    $ips.succeed('导入成功！');
                    $("#btnSearch").trigger("click");
                }
            });
        }
    });
    $('#saveselftruck').bind('click', function() {
        if ($('#selftruckfile').val() == '') {
            $ips.error('无选择文件');
            return false;
        }
        $('#selftruckfile').upload('submit');
        $('#selftruck_modal .modal-header button').trigger('click');
        return false;
    });

    //挂靠车辆导入文件上传
    $('#affiliatedfile').upload({
        onSuccess: function(data) {
            // 是否覆盖数据
            var repeat = $("input[name='affiliatedinsert']:checked").val();
            // 取标题
            $titles = $ips.load("import", "getTitle", "filepath=" + data.savepath + data.savename);
            log.debug($titles);
            // 存数据
            $ips.load("import", "save", "filepath=" + data.savepath + data.savename + "&affiliated=1" + "&repeat=" + repeat, function(data){
                if (data) {
                    $ips.succeed('导入成功！');
                    $("#btnSearch").trigger("click");
                }
            });
        }
    });
    $('#saveaffiliated').bind('click', function() {
        if ($('#affiliatedfile').val() == '') {
            $ips.error('无选择文件');
            return false;
        }
        $('#affiliatedfile').upload('submit');
        $('#affiliated_modal .modal-header button').trigger('click');
        return false;
    });
}