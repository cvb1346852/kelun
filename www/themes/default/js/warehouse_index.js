var searchParams = new Array();
var data = [];
$(function() {	
	/*//更多搜索条件按钮!
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
	});*/

	//新增
    $("#add").click('on',function (){
		$ips.locate("warehouse", "edit");
    });

	//编辑
	$('#edit').click('on',function(){
		var id = getRowIds();
		$ips.locate("warehouse", "edit", "id="+id);
	});

	//删除
	$('#delete').click('on',function(){
		$ips.confirm("您确认删除选中的基地?", function(btn) {
			if (btn == "确定") {
				var ids = getRowIds();
				$ips.load('warehouse','delete',{ids:ids},function(data){
					if(data.code == 0){
						$ips.succeed('删除成功');
						$('#tblMain').dataTable().fnDraw();
					}else{
						$ips.error(data.message);
					}
				})
			}
		});
	})

	//设置G7S机构
	$('#g7s_set').click('on',function(){
		var id = getRowIds();
		var info = data[id];
		$('#orgcode').val(info.orgcode);
		$('#orgcode_set').modal('show');
	});

	//保存基地orgcode
	$('#saveOrgCode').click('on',function(){
		var orgcode = $('#orgcode').val();
		var id = getRowIds();
		if(orgcode != ''){
			$ips.load('warehouse','setOrgCode',{orgcode:orgcode,id:id},function(data){
				if(data.code == 0){
					$ips.succeed('设置成功');
					$('#orgcode_set').modal('hide');
					$('#tblMain').dataTable().fnDraw();
				}else{
					$ips.error(data.message);
				}
			});
		}else{
			$ips.error('请填写机构编码');
		}
	});

	//招标设置
	$('#tender_btn').click('on',function(){
		debugger;
		var id = getRowIds();
		var info = data[id];
		if(parseInt(info.tender_type) == 1){
			$('#second_type').remove('checked');
			$('#first_type').attr('checked','checked');
		}else{
			$('#first_type').remove('checked');
			$('#second_type').attr('checked','checked');
		}

		$('#first_audit_id').val(info.first_audit ? info.first_audit.id : '');
		$('#first_audit_phone').val(info.first_audit ? info.first_audit.phone : '');
		$('#first_audit_name').val(info.first_audit ? info.first_audit.name : '');
		$('#first_audit_position').val(info.first_audit ? info.first_audit.position : '');
		$('#second_audit_id').val(info.second_audit ? info.second_audit.id : '');
		$('#second_audit_phone').val(info.second_audit ? info.second_audit.phone : '');
		$('#second_audit_name').val(info.second_audit ? info.second_audit.name : '');
		$('#second_audit_position').val(info.second_audit ? info.second_audit.position : '');
		$('#tender_set').modal('show');
	});

	//保存招标设置
	$('#saveTender').click('on',function(){
		var tender_type = $('input:radio:checked').val();
		var first_audit_id = $('#first_audit_id').val();
		var first_audit_phone = $('#first_audit_phone').val();
		var first_audit_name = $('#first_audit_name').val();
		var first_audit_position = $('#first_audit_position').val();
		var second_audit_id = $('#second_audit_id').val();
		var second_audit_phone = $('#second_audit_phone').val();
		var second_audit_name = $('#second_audit_name').val();
		var second_audit_position = $('#second_audit_position').val();

		var id = getRowIds();

		if(first_audit_phone == second_audit_phone){
			$ips.error('审批人电话不能相同');
			return false;
		}
		var data = {
			id:id,
			tender_type:tender_type,
			first_audit_id:first_audit_id,
			first_audit_phone:first_audit_phone,
			first_audit_name:first_audit_name,
			first_audit_position:first_audit_position,
			second_audit_id:second_audit_id,
			second_audit_phone:second_audit_phone,
			second_audit_name:second_audit_name,
			second_audit_position:second_audit_position,
		}
		$ips.load('warehouse','tenderSet',data,function(data){
			if(data.code == 0){
				$ips.succeed('设置成功');
				$('#tender_set').modal('hide');
				$('#tblMain').dataTable().fnDraw();
			}else{
				$ips.error(data.message);
			}
		});
	});

});


// 表格
function runDataTables() {
	$('#tblMain').grid({
		"fixedHeader":{ isOpen:true},
		"fnServerData" : function(sSource, aoData, fnCallback) {
			$ips.gridLoadData(sSource, aoData, fnCallback, "warehouse", "search", searchParams, function(pager) {
                pager.result = pager.result ? pager.result : [];
				$.each(pager.result, function(i, item) {
					data[item.id] = item;
					item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';
				});
			});
		},
		"aoColumns" : [
			{
				sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',
				sName: "idCheckbox",
				sWidth: "20px",
				sClass: "center",
				bSortable: false
			},
			{sTitle: "基地名称", sName: "name","bSortable": false},
			{sTitle: "基地编号", sName: "platform_code","bSortable": false},
			{sTitle: "省", sName: "province","bSortable": false},
			{sTitle: "市", sName: "city","bSortable": false},
			{sTitle: "地址", sName: "address","bSortable": false},
			{sTitle: "G7机构编码", sName: "orgcode","bSortable": false},
			{sTitle: "评标方式", sName: "tender_type","bSortable": false},
			{sTitle: "一级审核人", sName: "first_audit_phone","bSortable": false},
			{sTitle: "二级审核人", sName: "second_audit_phone","bSortable": false}
		]
	});
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

loadScript('js/hui/jquery.hui.grid.js',runDataTables);

//导出按钮
loadScript('js/hui/jquery.hui.exportdata.js', function () {
	$('#export').exportdata({dataModule : 'warehouse',dataMethod:'search',title:'基地信息',partDataRows:10000,partSize:100});
},true,true);