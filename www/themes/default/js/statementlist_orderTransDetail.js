$(function() {	

	// 搜索按钮
	$("#btnSearch").click(function() {
		$('#tblMain').grid("fnPageChange","first");
	});

});


//设置默认搜索时间 
$('#statistic_date').val(set_time_range());
/*$('#reportTime').val(moment().format('L')+' 00:00');*/
//选择搜索时间
$('#statistic_date').daterangepicker({
    timePicker: true,//显示小时和分钟
    timePickerIncrement: 1, //分钟选择的间隔
    format: 'YYYY-MM-DD HH:mm', //返回值的格式
    timePicker12Hour: false, //采用24小时计时制
    showDropdowns: true, //是否显示年、月下拉框
});

//设置时间范围
function set_time_range(){
    var returntimes = moment().subtract(3, 'days').format('L')+' 00:00'+' - '+moment().format('L')+' 23:59';
    return returntimes;
}
// 表格
loadScript("/js/hui/jquery.hui.grid.js",function(){
    $("#tblMain").grid({
        "aoColumns":[
            //{sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
            
            {sTitle: "制单时间", sName: "create_time","bSortable": true},
			{sTitle: "承运商", sName: "carrier_name","bSortable": false},
			{sTitle: "司机", sName: "driver_name","bSortable": false},
            {sTitle: "打分", sName: "grade","bSortable": false}

    ],
        "fnServerData":function(sSource,aoData,fnCallback){
            var searchParams = $("#frmSearch").serializeArray();
            $ips.gridLoadData(sSource,aoData,fnCallback,"statementlist","getOrderTrans",searchParams,function(data){
                if(data.result){
                    $.each(data.result, function(i, item) {
                    //item.idCheckbox = '<label class="checkbox"><input id="'+item.id+'" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';

				  });
                }
            });
        }
    });
});

//加载手机号选择框
$("#carrier_id").select2({
    placeholder:"请选择承运商",
    minimumInputLength:1,
    allowClear:true,
    multiple:false,
    //selectOnBlur:false,
    query:function(query){
        $ips.load("statementlist","getResultName",{result_type: 1 , responsible_name : query.term},function(data){
            if(data){
                var _pre_data = [];
                $.each(data,function(i,item){
                    _pre_data.push({id:item.id,text:item.carrier_name});
                });
                var info = {results:_pre_data};
                query.callback(info);
            }
        });
    }
}); 
//导出按钮
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
        var create_time=$('#statistic_date').val();
        exportSearchParams.push({name:"statistic_date","value":create_time});
        var carrier_id=$('#carrier_id').val();
        exportSearchParams.push({name:"carrier_id","value":carrier_id});
    });
    exportSearchParams.push({name:"filename","value":"运输质量明细报表-" + time});
    $('#export').exportdata({dataModule : 'statementlist',dataMethod:'getOrderTrans',searchParams: exportSearchParams,title:'运输质量明细报表',partDataRows:3000,partSize:100});
},true,true);
