var searchParams = new Array();
var deletedId = [];
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

    $("#editPage").click(function (){
        $ips.locatesubsystem("project/motorcade_warehouse/edit.html",false);
    });

});


// 表格
function runDataTables() {
	$('#tblMain').grid({
		"fixedHeader":{ isOpen:true},
		"fnServerData" : function(sSource, aoData, fnCallback) {
			$ips.gridLoadData(sSource, aoData, fnCallback, "motorcade_warehouse", "search", searchParams, function(pager) {
                pager.result = pager.result ? pager.result : [];
				$.each(pager.result, function(i, item) {
					item.type = item.type == 1 ? '基地' : '片区';
                    item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';
                    item.idAction = '<a href="javascript:void(0);"  onclick="edit(\'' + item.id + '\')">编辑</a>';
				});
			});
		},
		"aoColumns" : [
                        {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
                        {sTitle: "操作", sName: "idAction","bSortable": false},
		               	{sTitle: "车队名称", sName: "name"},
						{sTitle: "联系人", sName: "contact"},
						{sTitle: "联系电话", sName: "phone"},
						{sTitle: "备注", sName: "note"},
						{sTitle: "更新时间", sName: "update_time"}
					]
	});
}

//获取选中的id
function edit(id) {
    $ips.locate("motorcade_warehouse", "edit", "id="+id,false);
}

//获取选中的id
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
            $ips.load("motorcade_warehouse", "del", "id=" + id, function(result){
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

loadScript('js/hui/jquery.hui.grid.js',runDataTables);