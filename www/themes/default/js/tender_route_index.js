var params = $ips.getUrlParams();
var searchParams = new Array();
var deletedId = [];
var NowId = [];
$(function() {
});

$(function() {

	// 搜索按钮
	$("#btnSearch").click(function() {
		searchParams = $("#frmSearch").serializeArray();
		deletedId = [];
		$('#tblMain').grid("fnPageChange","first");
	});

    //导入按钮
    $("#simport").click(function(){
        $ips.locatesubsystem("project/tender_route/simport.html",false);
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

            exportSearchParams.push({name:"filename","value":"评标线路导出-" + time});
        $('#export').exportdata({dataModule : 'tender_route',dataMethod:'search',searchParams: exportSearchParams,title:'评标线路导出',partDataRows:3000,partSize:100});
    },true,true);

});
// 表格
loadScript("/js/hui/jquery.hui.grid.js",function(){
    $("#tblMain").grid({
        "aoColumns" : [
                        {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
                        {sTitle: "起始站点", sName: "from_location","bSortable": false},
                        {sTitle: "到达站点", sName: "to_location","bSortable": false},
                        {sTitle: "最高价", sName: "price","bSortable": false},
                        {sTitle: "超额标准", sName: "over_rate","bSortable": false},
                        {sTitle: "月份", sName: "months","bSortable": false},
                        {sTitle: "运输方式", sName: "ship_method","bSortable": false},
                        {sTitle: "箱型", sName: "carriage_type","bSortable": false},
                        {sTitle: "重泡货", sName: "density","bSortable": false},
                    ],

        "fnServerData":function(sSource,aoData,fnCallback){
            var searchParams = $("#frmSearch").serializeArray();
            $ips.gridLoadData(sSource,aoData,fnCallback,"tender_route","search",searchParams,function(data){
                if(data.result){
                    $.each(data.result, function(i, item) {
                    item.idCheckbox = '<label class="checkbox"><input id="'+item.id+'" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';
                 
                  });
                }
            });
        }
    });
});


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
            $ips.load("tender_route", "del", "id=" + id, function(result){
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
    
}



function change() {
    if(!NowId || NowId == []){
        $ips.alert('数据异常');
        return false;
    }
    var over_rate=$('#over_rate').val();
   $ips.load("tender_route", "setRate",{'id':NowId.join(','),'over_rate':over_rate}, function(result){
       if(result) {
           $ips.succeed('操作成功');
           $('#tblMain').dataTable().fnDraw();
       } else {
           $ips.error("操作失败！");
       }
   });
}

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
                item.push({id: y, text: y});
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});
