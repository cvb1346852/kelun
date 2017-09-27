
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
		
        $ips.load("statementlist","getLineTenderTrend_y1",searchParams,function(data){
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
	    var returntimes = moment().startOf('year').format('YYYY-MM-DD HH:mm')+' - '+ moment().endOf('month').format('YYYY-MM-DD HH:mm');
	    return returntimes;
	}

});

$('#fromlocation_list').on('click','a',function(e){
	$( "#tolocation_list" ).empty();
	var $this = $(this);
	$('#frmSearch #fromlocation').val(text = $this.text());
	var searchParams = $("#frmSearch").serializeArray();
    $ips.load("statementlist","getLineTenderTrend_y2",searchParams,function(data){
    	var _html = []; 
        for ( var i in data) {
        	_html.push( '<a href="javascript:void(0);" class="btn btn-default"  id="export">'+data[i].tolocation+'</a>');
		}
        $('#tolocation_list').html(_html.join(' '));
    });
    
});

var myChart;

$('#tolocation_list').on('click','a',function(e){
	var $this = $(this);
	$('#frmSearch #tolocation').val(text = $this.text());
	
	if(typeof(_table) != "undefined" ){
		_table.fnDestroy();
        $('#tblMain').empty(); 
	}
	
	var searchParams = $("#frmSearch").serializeArray();
	$ips.load("statementlist","getLineTenderTrend",searchParams,function(data){
		
		var _mdates = [];
		var _avg_price = [];
		var _sum_weight = [];
		for(var _k in data.result){
			_mdates.push(data.result[_k].mdate);
			_avg_price.push([data.result[_k].mdate,data.result[_k].avg_price]);
			_sum_weight.push([data.result[_k].mdate,data.result[_k].sum_weight]);
		}
		// 基于准备好的dom，初始化echarts实例
        myChart = echarts.init(document.getElementById('echarts_main'));

        // 指定图表的配置项和数据
        var 
        option = {
        	    title: {
        	        text: ''
        	    },
        	     toolbox: {
        	        feature: {
        	            saveAsImage: {}
        	        }
        	    },
        	    legend: {
        	        data:['价格走势','货量走势']
        	    },
        	    tooltip: {
        	        trigger: 'axis',
        	        axisPointer: {
        	            type: 'cross',
        	            label: {
        	                backgroundColor: '#283b56'
        	            }
        	        }
        	    },
        	    xAxis: [
        	        {
        	        type : 'category',
        	        axisTick : {interval : 0},
        	        data : _mdates
        	    },
        	    {
        	        type : 'category',
        	        data : _mdates
        	        }
        	    ],
        	    yAxis: [
        	        {
        	            type: 'value',
        	            scale: true,
        	            name: '价格',
        	            min: 0,
        	            boundaryGap: [0, 1]
        	        },
        	        {
        	            type: 'value',
        	            scale: false,
        	            name: '重量',
        	            // max: 1200,
        	            min: 0,
        	            boundaryGap: [0, 1],
        	            splitLine:false
        	        }
        	    ],
        	    
        	    series: [
        	        {
        	        name: '价格走势',
        	        type: 'line',
        	        data: _avg_price
        	        },
        	         {
        	        name: '货量走势',
        	        type: 'bar',
        	        yAxisIndex: 1,
        	        xAxisIndex: 1,
        	        data: _sum_weight
        	        }
        	    ]
        	};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
		
    
 });
	
	
	
	
});