var searchParams = new Array();
// 搜索按钮
$("#btnSearch").click(function() {
	searchParams = $("#frmSearch").serializeArray();
	deletedId = [];
	$('#tblMain').grid("fnPageChange","first");
});

loadScript('js/hui/jquery.hui.grid.js',runDataTables);

// 表格
function runDataTables() {
	$('#tblMain').grid({
		"fixedHeader":{ isOpen:true},
		"fnServerData" : function(sSource, aoData, fnCallback) {
			$ips.gridLoadData(sSource, aoData, fnCallback, "truck_source", "getG7sTruck", searchParams, function(pager) {
                pager.result = pager.result ? pager.result : [];
				$.each(pager.result, function(i, item) {
                    item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0" gpsno="'+ item.gpsno +'"><span></span></label>';
				});
			});
		},
		"aoColumns" : [
                        {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
		               	{sTitle: "车牌号", sName: "carnum","bSortable": false},
						{sTitle: "车长", sName: "length","bSortable": false},
						{sTitle: "厢型", sName: "carriagetype","bSortable": false},
						{sTitle: "额定载重", sName: "weight","bSortable": false},
						{sTitle: "司机", sName: "driver_name","bSortable": false},
						{sTitle: "联系方式", sName: "driver_phone","bSortable": false},
					]
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

function save(){
	var id = getRowIds();
    if(!id || id == ''){
        $ips.alert('请选择需要添加的车辆');
        return false;
    } else {
    	var ids = id.split(',');
    	var params = [];
    	$.each(ids, function(i, item) {
    		var checkbox = $('#'+item).parent().parent();
            var gpsno = $('#'+item).attr("gpsno");
    		var carnum = checkbox.next();
    		var length = carnum.next();
    		var carriagetype = length.next();
    		var weight = carriagetype.next();
    		var driver_name = weight.next();
    		var driver_phone = driver_name.next();
    		var data = {
    			'id' : item,
                'gpsno' : gpsno,
    			'carnum' : carnum.html(),
    			'length' : length.html(),
    			'carriagetype' : carriagetype.html(),
    			'weight' : weight.html(),
    			'driver_name' : driver_name.html(),
    			'driver_phone' : driver_phone.html()
    		};
    		params.push(data);
    	});
    	$ips.load('truck_source','saveG7sTruck', {"data" : params}, function(data){
    		if (data) {
    			$ips.locatesubsystem("project/truck_source/index.html");
    		} else {
    			$ips.error('添加失败，请稍后重试');
    		}
    	});
    }
}

