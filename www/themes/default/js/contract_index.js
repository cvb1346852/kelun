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
        $ips.locatesubsystem("project/contract/edit.html",false);
    });

    //加载车牌号选择框
    $("#code").select2({
        placeholder: "选择合同编号",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('contract', 'getContractCode',{code: e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.code, text: y.code });
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    });

});


// 表格
function runDataTables() {
	$('#tblMain').grid({
		"fixedHeader":{ isOpen:true},
		"fnServerData" : function(sSource, aoData, fnCallback) {
			$ips.gridLoadData(sSource, aoData, fnCallback, "contract", "search", searchParams, function(pager) {
                pager.result = pager.result ? pager.result : [];
				$.each(pager.result, function(i, item) {
                    item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';
                    item.file = '<a href="javascript:void(0);" onclick="downloadFile(\''+item.file+'\')">下载附件</a>';
				});
			});
		},
		"aoColumns" : [
                        {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
		               	{sTitle: "合同编号", sName: "code"},
                        {sTitle: "合同附件", sName: "file"},
                        {sTitle: "合同类别", sName: "type"},
                        {sTitle: "运输方式", sName: "trans_type"},
                        {sTitle: "价格执行方式", sName: "price_type"},
                        {sTitle: "付款方式", sName: "pay_type"},
                        {sTitle: "发票税率", sName: "rate"},
                        {sTitle: "承兑汇票接受程度", sName: "bill_of_exchange"},
						{sTitle: "合同开始时间", sName: "start_time"},
						{sTitle: "合同结束时间", sName: "end_time"},
						{sTitle: "基地/片区机构", sName: "warehouse_name","bSortable": false},
						{sTitle: "承运商机构名称", sName: "carrier_name","bSortable": false}
					]
	});
}

//获取选中的id
function edit(id) {
    var id = getRowIds();
    if(!id || id == ''){
        $ips.alert('请选择编辑项');
        return false;
    }
    var ids = id.split(',');
    if(ids.length>1){
        $ips.alert('只能选择一项进行编辑');
        return false;
    }else{
        $ips.locate("contract", "edit", "id="+id);
    }
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

//下载合同附件
function downloadFile(file){
    window.location.href = 'inside.php?t=json&m=exportdata&f=downloadContract&file=' + file
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
            $ips.load("contract", "del", "id=" + id, function(result){
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