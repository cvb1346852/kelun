var searchParams = new Array();
var deletedId = [];
var History = [];
var NowId = '';
$(function() {
    // 搜索按钮
    /*$("#btnSearch").click(function () {
        searchParams = $("#frmSearch").serializeArray();
        deletedId = [];
        $('#tblMain').grid("fnPageChange", "first");
    });*/
});
// 表格
function runDataTables() {
	$('#tblMain').grid({
		"fixedHeader":{ isOpen:true},
		"fnServerData" : function(sSource, aoData, fnCallback) {
            searchParams.push({name:'status',value:1});
			$ips.gridLoadData(sSource, aoData, fnCallback, "truck_source", "search", searchParams, function(pager) {
				$.each(pager.result, function(i, item) {
                    item.from = item.from == 2 ? '挂靠' : '自有';
					item.idAction = '<a href="javascript:void(0);"  onclick="Show(\'' + item.id + '\')">批准</a>';
                    History[item.id] = item.history;
                    item.address =  '<input id="car_' + item.id + '" type="hidden" >';
                    $ips.load("truck_source", "getAddressList", {driver_phone: item.driver_phone, type: item.type, carnum: item.carnum}, function(result) {
                        if(result.address){
                            $("#car_"+item.id).parent().html(result.address);
                        }
                    });
				});
			});
		},
		"aoColumns" : [
                        {sTitle: "车牌号", sName: "carnum","bSortable": false},
                        {sTitle: "司机", sName: "driver_name","bSortable": false},
                        {sTitle: "联系方式", sName: "driver_phone","bSortable": false},
                        {sTitle: "申请时间", sName: "update_time","bSortable": false},
                        {sTitle: "当前位置", sName: "address","bSortable": false},
                        {sTitle: "操作", sName: "idAction","bSortable": false}
					]
	});
}

//获取选中的id
function Show(id) {
    NowId = id;
    $("#remarkcontent").html('');
    var html ='<table>';
    html += '<tr><th> 运输积分 </th> <th> 运输质量 </th> <th> 被投诉量 </th></tr> ';
    html += '<tr><td> 200 </td> <td> 200 </td> <td> 0 </td></tr> ';
    html +='</table>';
    if(History[id]){
        var temp = JSON.parse(History[id]);
        html +='<table>';
        html += '<tr><th> ------- </th> </tr> ';
        $.each(temp,function(key,val){
            html += '<tr><td>'+ val.time +' '+  val.action + '</td></tr> ';
        });
        html +='</table>';
    }
    $("#remarkcontent").html(html);
    $("#remarkListModal").modal('show');
}
//同意
function Agree(type) {
    $ips.lockPage();
    $ips.load("truck_source", "agree", "type=" + type+ "&id=" + NowId , function(result){
        $ips.unLockPage();
        NowId = '';
        if(result) {
            $ips.succeed('操作成功');
            $('#tblMain').dataTable().fnDraw();
        } else {
            $ips.error("操作失败！");
        }
    });
}


loadScript('js/hui/jquery.hui.grid.js',runDataTables);