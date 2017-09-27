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
            exportSearchParams.push({name:"filename","value":"挂靠车辆模板-" + time});
        });
        $('.export').exportdata({dataModule : 'truck_source',dataMethod:'search',searchParams: exportSearchParams,title:'车源列表',partDataRows:3000,partSize:100});
    },true,true);


});

// 表格
function runDataTables() {
	$('#tblMain').grid({
		"fixedHeader":{ isOpen:true},
		"fnServerData" : function(sSource, aoData, fnCallback) {
			$ips.gridLoadData(sSource, aoData, fnCallback, "truck_source", "searchAll", searchParams, function(pager) {
                pager.result = pager.result ? pager.result : [];
				$.each(pager.result, function(i, item) {
                    item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';
                    item.weight = item.weight == 1 ? '轻载' : '重载';
                    item.type = item.type == 1 ? 'LBS' : ( item.type == 2 ? 'GPS' : '其他');
                    item.idAction = '<a href="javascript:void(0);"  onclick="edit(\'' + item.id + '\')">查看</a>';
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
						{sTitle: "联系方式", sName: "driver_phone","bSortable": false},
                        {sTitle: "位置", sName: "city","bSortable": false}
					]
	});
}
function edit(id) {
    $ips.locate("truck_source", "edit", "id="+id+'&type=all');
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