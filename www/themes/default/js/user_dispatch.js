var warehouse_id =''
$(function() {	

	// 搜索按钮
	$("#btnSearch").click(function() {
		searchParams = $("#frmSearch").serializeArray();
		deletedId = [];
		$('#tblMain').grid("fnPageChange","first");
	});

    //删除调度账号
    $('#delete').click('on',function(){
        var id = getRowIds();
        if(!id || id == ''){
            $ips.alert('请选择删除项');
            return false;
        }
        var ids = id.split(',');
        debugger;
        $ips.confirm("您确定要删除这"+ids.length+"条记录吗?",function(btn) {
            if (btn == "确定") {
                $ips.lockPage();
                $ips.load("user", "delDispatchUser", {id:ids}, function(result){
                    $ips.unLockPage();
                    if(result.code == 0) {
                        $ips.succeed("删除成功！");
                        $('#tblMain').dataTable().fnDraw();
                    } else {
                        $ips.error("操作失败:"+result.message);
                    }
                });
            }
        });
    });

    //设置G7S机构
    $('#add').click('on',function(){
        $('#add_user').modal('show');
    });

    //保存基地orgcode
    $('#saveUser').click('on',function(){
        var phone = $('#phone').val();
        if(phone != ''){
            $ips.load('user','addDispatch',{phone:phone,warehouse_id:warehouse_id},function(data){
                if(data.code == 0){
                    $('#add_user').modal('hide');
                    $('#tblMain').dataTable().fnDraw();
                    $ips.succeed('新增成功');
                }else{
                    $ips.error(data.message);
                }
            });
        }else{
            $ips.error('请填写手机号');
        }
    });
});

// 表格
loadScript("/js/hui/jquery.hui.grid.js",function(){
    $("#tblMain").grid({
        "aoColumns":[
            {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
            
            {sTitle: "手机号", sName: "phone","bSortable": false},
			{sTitle: "所属基地", sName: "name","bSortable": false},
			{sTitle: "登录时间", sName: "login_time","bSortable": false},
            {sTitle: "添加时间", sName: "create_time","bSortable": false},
            {sTitle: "openid", sName: "openid","bSortable": false},

    ],
        "fnServerData":function(sSource,aoData,fnCallback){
            //var searchParams = $("#frmSearch").serializeArray();
            $ips.gridLoadData(sSource,aoData,fnCallback,"user","getDispatchUser",{},function(data){
                if(data.result){
                    $.each(data.result, function(i, item) {
                        item.idCheckbox = '<label class="checkbox"><input id="'+item.id+'" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';
                        warehouse_id = item.warehouse_id;
				  });
                }
            });
        }
    });
});



//获得所要删除收货人的id
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