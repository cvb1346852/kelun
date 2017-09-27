
$(function() {

    // 搜索按钮
    $("#btnSearch").click(function() {
        $('#tblMain').grid("fnPageChange","first");
    });

});

//获取查询条件
function genSearchParams(){
    var searchParams = $("#frmSearch").serializeArray();
    return searchParams;
}

loadScript('/js/hui/jquery.hui.grid.js', function () {
    $('#tblMain').grid({
        "aLengthMenu": [ 10, 25, 50, 100 ],
        "fixedHeader":{ isOpen:true},
        "aoColumns" : [
            {sTitle: '操作', sName: "idCheckbox", bSortable: false},
            {sTitle: "用户名", sName: "user_name" , bSortable: false},
            {sTitle: "基地", sName: "warehouseName" , bSortable: false},


        ],
        "fnServerData" : function(sSource, aoData, fnCallback) {
            var searchParams = genSearchParams();
            var now=new Date();//取今天的日期
            $ips.gridLoadData(sSource, aoData, fnCallback, "dispatch_set", "search", searchParams, function(data) {
                if(data.result){
                    $.each(data.result, function(i, item) {
                        item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';

                    });
                }
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
});

//添加
$("#add").click(function(){

    $ips.locatesubsystem("project/dispatch_set/add.html",false);

});

//修改
$("#edit").click(function(){
    var id = getRowIds();
    if(!id || id == ''){
        $ips.alert('请选择修改项');
        return false;
    }
    $ips.locate("dispatch_set","edit",'id='+id);
});


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
            $ips.load("dispatch_set", "del", "id=" + id, function(result){
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