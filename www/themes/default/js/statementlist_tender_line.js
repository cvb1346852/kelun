//表格
//loadScript("/js/hui/jquery.hui.grid.js");

function loadDataTableScripts() {
    loadScript("/js/plugin/datatables/jquery.dataTables-cust.min.js", dt_2);
    function dt_2() {
        loadScript("/js/plugin/datatables/ColReorder.min.js", dt_3);
    }
    function dt_3() {
        loadScript("/js/plugin/datatables/FixedColumns.min.js", dt_4);
    }
    function dt_4() {
        loadScript("/js/plugin/datatables/ColVis.min.js", dt_5);
    }
    function dt_5() {
        loadScript("/js/plugin/datatables/ZeroClipboard.js", dt_6);
    }
    function dt_6() {
        loadScript("/js/plugin/datatables/media/js/TableTools.min.js", dt_7);
    }
    function dt_7() {
        loadScript("/js/plugin/datatables/DT_bootstrap.js");
    }
}
loadDataTableScripts();

var _table;

$(function() {
	
	//加载基地选择框

	$ips.load('warehouse', 'genOpt',{},function(data) {
	  var item=[];
	  $.each(data,function(x,y){
	      item.push({id: y.platform_code, text:y.platform_code + y.name });
	  });
	  
	  $("#warehouse_name").select2({
		    placeholder: "选择基地名称",
		    minimumInputLength: 0,
		    multiple: false,
		    allowClear: true,
		    data:item
		});

	});

	// 搜索按钮
	$("#btnSearch").click(function() {
		var searchParams = $("#frmSearch").serializeArray();
		if(searchParams[1].value == ''){
			$ips.error('请选择基地');
			return;
		}
		
		$( "#fromlocation_list" ).empty();
		$( "#tolocation_list" ).empty();
		
        $ips.load("statementlist","getLineTender_x1",searchParams,function(data){
        	var _html = []; 
            for ( var i in data) {
            	_html.push( '<a href="javascript:void(0);" class="btn btn-default"  id="export">'+data[i].fromlocation+'</a>');
			}
            $('#fromlocation_list').html(_html.join(' '));
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
	    var returntimes = moment().startOf('month').format('YYYY-MM-DD HH:mm')+' - '+ moment().endOf('month').format('YYYY-MM-DD HH:mm');
	    return returntimes;
	}

});

$('#fromlocation_list').on('click','a',function(e){
	$( "#tolocation_list" ).empty();
	var $this = $(this);
	$('#frmSearch #fromlocation').val(text = $this.text());
	var searchParams = $("#frmSearch").serializeArray();
    $ips.load("statementlist","getLineTender_x2",searchParams,function(data){
    	var _html = []; 
        for ( var i in data) {
        	_html.push( '<a href="javascript:void(0);" class="btn btn-default"  id="export">'+data[i].tolocation+'</a>');
		}
        $('#tolocation_list').html(_html.join(' '));
    });
    
});



$('#tolocation_list').on('click','a',function(e){
	var $this = $(this);
	$('#frmSearch #tolocation').val(text = $this.text());
	
	if(typeof(_table) != "undefined" ){
		_table.fnDestroy();
        $('#tblMain').empty(); 
	}
	
	var searchParams = $("#frmSearch").serializeArray();
	$ips.load("statementlist","getLineTender_x3",searchParams,function(data){
		var _title = []; 
		_title.push( {sTitle: "调度单号", sName: "shipment_code","bSortable": false});
		_title.push( {sTitle: "运输方式", sName: "shipment_method","bSortable": false});
		_title.push( {sTitle: "发标日期", sName: "create_date","bSortable": false});
		_title.push( {sTitle: "中标单价", sName: "_price","bSortable": false});
		_title.push( {sTitle: "中标总价", sName: "sum_price","bSortable": false});
		
	    for ( var i in data) {
	    	_title.push( {sTitle: data[i].qtname, sName: data[i].relation_id,"bSortable": false,swidth:'100px'});
		}
	    
	  //报警框信息
		_table = $("#tblMain").dataTable({
	        "sPaginationType" : "bootstrap_full",
			"bServerSide" : true,
			"bAutoWidth": true,
	        "bFilter": false,
	        "aoColumns": _title,
	        "bInfo": false, //页脚信息
	        "bPaginate": false,//不分页
	        "bScrollAutoCss": true,
	        "bScrollCollapse": true,
	        "iDisplayLength": 0, //每页显示数据量
	        "bLengthChange": true, // 用户不可改变每页显示数量
	        "bProcessing": true, // 是否启用进度显示，进度条等等，对处理大量数据很有用处。// 默认值：false
	        "bStateSave": false, // 保存状态到cookie
	        "sZeroRecords" : "没有检索到数据",
	        "fnServerData":function(sSource, aoData, fnCallback){
	            var searchParams = $("#frmSearch").serializeArray();
	            $ips.gridLoadData(sSource, aoData, fnCallback,"statementlist","getLineTender", searchParams, function(pager) {
	            	
	            	console.info(pager);
	            	$.each(pager.result, function(i, v) {
	            		for(var _v in v){
	            			
	            			if(_v.length == 32){
	            				
	            				if(v[_v] != null && Number(v.min_price) >= Number(v[_v]) ){
		            				v[_v] = '<i title="min" class="fa fa-circle txt-color-green"></i>'+v[_v];
		            			}
		            			if(v.relation_id == _v){	//中标项
		            				v[_v] = '<span class="zb">'+v[_v]+'</span>';
		            			}
	            			}
	            			

	            			
	            		}
	            	});
	            	
	            	console.info(pager.result);
	                
	            });
	        },
	        "fnDrawCallback": function(oSettings) {
//	            $(oSettings.nTable).find("tr:last td").css({
//	                "border": '1px solid #DDDDDD'
//	            });
//	            
	            $(oSettings.nTable).css('width','100%'); //列表自适应宽度
	            $(oSettings.nTable).find("th,td").css('white-space', 'nowrap'); //列表中字段不换行
	            
	            
	        }
	    });
    
    
 });
	
	
});