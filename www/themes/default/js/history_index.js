
$(function() {	

	// 搜索按钮
	$("#btnSearch").click(function() {
		$('#tblMain').grid("fnPageChange","first");
	});

});
//时间控件
$('#statistic_date').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        format: 'YYYY-MM',
        startDate:moment().add('h', 0),
        minDate: '2000-01-01',
        maxDate: '2030-12-30'
});
var nowdate= new Date();
var month=nowdate.getFullYear();
month+='-'+(nowdate.getMonth()+1);
$('#statistic_date').val(month);
// 表格
loadScript("/js/hui/jquery.hui.grid.js",function(){
    $("#tblMain").grid({
        "aoColumns":[
            {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
            
            {sTitle: "年/月", sName: "month","bSortable": false},
			{sTitle: "承运商", sName: "carrier_name","bSortable": false},
			{sTitle: "条数", sName: "count","bSortable": false}

    ],
        "fnServerData":function(sSource,aoData,fnCallback){
            var searchParams = $("#frmSearch").serializeArray();
            $ips.gridLoadData(sSource,aoData,fnCallback,"history","getHistoryMsg",searchParams,function(data){
                if(data.result){
                    $.each(data.result, function(i, item) {
                    item.idCheckbox = '<label class="checkbox"><input id="'+item.id+'" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';
					
				  });
                }
            });
        }
    });
});

//导出按钮
loadScript('js/hui/jquery.hui.exportdata.js', function () {
    var date = new Date();
    var statistic_date='';
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var time = year+""+month+""+day;
    var exportSearchParams = [
        {name:"getTemplate",value:1},
    ];
        $('#export').on('click', function(){
            statistic_date=$('#statistic_date').val();
             exportSearchParams.push({name:"statistic_date","value":statistic_date});
        });
        exportSearchParams.push({name:"filename","value":"LBS统计导出-" + time});
    $('#export').exportdata({dataModule : 'history',dataMethod:'getHistoryList',searchParams: exportSearchParams,title:'LBS统计',partDataRows:3000,partSize:100});
},true,true);