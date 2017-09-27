$(function() {	

	// 搜索按钮
	$("#btnSearch").click(function() {
		$('#tblMain').grid("fnPageChange","first");
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
	    var returntimes = moment().startOf('month').format('YYYY-MM-DD HH:mm')+' - '+ moment().endOf('day').format('YYYY-MM-DD HH:mm');
	    return returntimes;
	}

});



// 表格
loadScript("/js/hui/jquery.hui.grid.js",function(){
    $("#tblMain").grid({
        "aoColumns":[
            //{sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
			{sTitle: "基地", sName: "name","bSortable": false},
			{sTitle: "承运商", sName: "carrier_name","bSortable": false},
            {sTitle: "报价数量", sName: "countQuote","bSortable": false},
            {sTitle: "中标数量", sName: "countWin","bSortable": false}

    ],
        "fnServerData":function(sSource,aoData,fnCallback){
            var searchParams = $("#frmSearch").serializeArray();
            $ips.gridLoadData(sSource,aoData,fnCallback,"statementlist","getWinBidList",searchParams,function(data){
                if(data.result){
                    if(data.roleName=='kelun_admin'){
                        $('#showWarehouse').css('display','block');
                    }
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
//加载基地选择框
    $("#warehouse_name").select2({
        placeholder: "选择基地名称",
        minimumInputLength: 1,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('statementlist', 'getResultName',{result_type: 2 , responsible_name : e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.id, text: y.name });
                });
                var data = {results: item};
                e.callback(data);
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
        var carrier_id=$('#carrier_id').val();
        exportSearchParams.push({name:"carrier_id","value":carrier_id});
        var warehouse_id=$('#warehouse_name').val();
        exportSearchParams.push({name:"warehouse_id","value":warehouse_id});
    });
    exportSearchParams.push({name:"filename","value":"中标统计报表-" + time});
    $('#export').exportdata({dataModule : 'statementlist',dataMethod:'getWinBidList',searchParams: exportSearchParams,title:'中标统计报表',partDataRows:3000,partSize:100});
},true,true);
