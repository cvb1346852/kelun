$(function() {	

	// 搜索按钮
	$("#btnSearch").click(function() {
		/*searchParams = $("#frmSearch").serializeArray();*/
		$('#tblMain').grid("fnPageChange","first");
	});

});

// 表格
loadScript("/js/hui/jquery.hui.grid.js",function(){
    $("#tblMain").grid({
        "aoColumns":[
            {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
            
            {sTitle: "手机号", sName: "phone","bSortable": false},
			{sTitle: "注册时间", sName: "create_time","bSortable": false},
			{sTitle: "基地ERP", sName: "base_erp","bSortable": false},
            {sTitle: "片区ERP", sName: "area_erp","bSortable": false},
            {sTitle: "绑定时间", sName: "bind_time","bSortable": false},
            {sTitle: "解绑时间", sName: "unbind_time","bSortable": false},
			{sTitle: "最新签收时间", sName: "bctime","bSortable": false}

    ],
        "fnServerData":function(sSource,aoData,fnCallback){
            var searchParams = $("#frmSearch").serializeArray();
            $ips.gridLoadData(sSource,aoData,fnCallback,"consignee","search",searchParams,function(data){
                if(data.result){
                    $.each(data.result, function(i, item) {
                    item.idCheckbox = '<label class="checkbox"><input id="'+item.id+'" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';
					if(item.base_erp=="" || item.base_erp==null){
						item.base_erp='--';
					}
                    if(item.area_erp=="" || item.area_erp==null){
                        item.area_erp='--';
                    }
					if(item.user_type==2){
						item.erp='--';
					}
                    if(item.bind_time==null ||item.bind_time==''){
                        item.bind_time='--';
                    }
                    if(item.unbind_time==null || item.unbind_time=='' ){
                        item.unbind_time='--';
                    }
                    if(item.bctime=='' || item.bctime==null){
                        item.bctime='--';
                    }
				  });
                }
            });
        }
    });
});

//获取解绑id
function getRowId() {
    var id = $('#tblMain input:checkbox[class="checkbox style-0"]:checked').val();
    return id;
}
//解绑操作按钮
function edit() {
    var id=getRowId();
    $("#id").val(id); 
    $ips.load("consignee", "geterp", "id=" + id, function(data){
        if(data.base_erp==''&& data.area_erp==''){
             $('#boxWorks2').modal(); 
        }else{
            $('#boxWorks').modal();
            if(data.base_erp==''){
                $('#unbindbase').hide();
            }
            if(data.area_erp==''){
                $('#unbindarea').hide();
            }
        }
    });
}
//erp解绑
function unbinderp(){
     $ips.lockPage();
     var params = $("#iccard_bind_forms").serializeArray();
     var addrenttime = $('#addrenttime').val();
     $ips.load("consignee", "unbind", params, function(data) {
        $ips.unLockPage();
        if(data) {
            $ips.succeed("解绑成功！");
            $('#boxWorks').modal('hide'); 
            $('#tblMain').dataTable().fnDraw();
        } else {
            $ips.error("解绑失败！");
        }

     });
      
} 
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

//删除所选收货人
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
            $ips.load("consignee", "del", "id=" + id, function(result){
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
//加载手机号选择框
$("#phone").select2({
    placeholder:"请选择手机号",
    minimumInputLength:0,
    allowClear:true,
    multiple:false,
    //selectOnBlur:false,
    query:function(query){
        $ips.load("consignee","getPhone",{"postname":query.term},function(data){
            if(data){
                var _pre_data = [];
                $.each(data,function(i,item){
                    _pre_data.push({id:item.phone,text:item.phone});
                });
                var info = {results:_pre_data};
                query.callback(info);
            }
        });
    }
}); 
//导出按钮
loadScript('js/hui/jquery.hui.exportdata.js', function () {
    $('#export').exportdata({dataModule : 'consignee',dataMethod:'search',title:'收货人信息',partDataRows:10000,partSize:100});
},true,true);
