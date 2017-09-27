/**
 * Created by will_zhang on 1/5/2017.
 */
var btnMoreSearch = $("#btnMoreSearch");
var userinfo = $ips.getCurrentUser();
var userRole = '';
$ips.include('/js/poshytip/tip-white/tip-white.css');
// 搜索按钮
$("#btnSearch").click(function() {
    $('#shipmentTbl').grid("fnPageChange", "first");
});
$("#warehouse_status").css("display","none");
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
/*加载出发地*/
$(function() {
    //初始化出发地省份选择
    //BindCity("");

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
                    item.push({id: y.name, text: y.name });
                });
                var data = {results: item};
                e.callback(data);
            });
        }
    });
});
//获取查询条件
function genSearchParams(){
    var searchParams = $("#frmSearch").serializeArray();
    return searchParams;
}

//展示运单列表
$ips.load('statementlist', 'getStatementCount', {}, function(data){
        var content = '<table id="tblMain" style="width:500px;margin: 0 auto;background-color:#CCCCCC;" cellpadding="2" cellspacing="0" border="1"  class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" >';
        content += '<thead>';
        content += '<tr role="row">';
        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label=": activate to sort column ascending" style="width: 164px; white-space: nowrap;"></th>';
        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="承运商个数: activate to sort column ascending" style="width: 164px; white-space: nowrap;">承运商个数</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="车厂司机个数: activate to sort column ascending" style="width: 164px; white-space: nowrap;">车厂司机个数</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="任务司机个数: activate to sort column ascending" style="width: 164px; white-space: nowrap;">任务司机个数</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="LBS司机个数: activate to sort column ascending" style="width: 164px; white-space: nowrap;">LBS司机个数</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="签收人个数: activate to sort column ascending" style="width: 164px; white-space: nowrap;">签收人个数</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="调度单个数: activate to sort column ascending" style="width: 164px; white-space: nowrap;">调度单个数</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="零担转运单数: activate to sort column ascending" style="width: 164px; white-space: nowrap;">零担转运单数</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="GPS设备个数: activate to sort column ascending" style="width: 164px; white-space: nowrap;">GPS设备个数</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="LBS定位次数: activate to sort column ascending" style="width: 164px; white-space: nowrap;">LBS定位次数</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="微信打卡次数: activate to sort column ascending" style="width: 164px; white-space: nowrap;">微信打卡次数</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1" aria-label="发标通知次数: activate to sort column ascending" style="width: 164px; white-space: nowrap;">发标通知次数</th>';
        content += '</tr>';
        content += '</thead>';
        content += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';
        content += '<td style="white-space: nowrap;">总量</td>';
        content += '<td style="white-space: nowrap;">'+data.carrier_count+'</td>';
        content += '<td style="white-space: nowrap;">'+data.driver_count+'</td>';
        content += '<td style="white-space: nowrap;">'+data.driverTask_count+'</td>';
        content += '<td style="white-space: nowrap;">'+data.truckLBS_count+'</td>';
        content += '<td style="white-space: nowrap;">'+data.sign_count+'</td>';
        content += '<td style="white-space: nowrap;">'+data.shipment_count+'</td>';
        content += '<td style="white-space: nowrap;">'+data.order_count+'</td>';
        content += '<td style="white-space: nowrap;"></td>';
        content += '<td style="white-space: nowrap;">'+data.lbs_count+'</td>';
        content += '<td style="white-space: nowrap;">'+data.driverSign_count+'</td>';
        content += '<td style="white-space: nowrap;">'+data.tenderPush_count+'</td>';
        content += '</td>';
        content += '</tr>';
        content += '<td style="white-space: nowrap;">活跃</td>';
        content += '<td style="white-space: nowrap;">'+data.carrier_active+'</td>';
        content += '<td style="white-space: nowrap;">'+data.driver_active+'</td>';
        content += '<td style="white-space: nowrap;"></td>';
        content += '<td style="white-space: nowrap;"></td>';
        content += '<td style="white-space: nowrap;">'+data.sign_active+'</td>';
        content += '<td style="white-space: nowrap;"></td>';
        content += '<td style="white-space: nowrap;">'+data.order_active+'</td>';
        content += '<td style="white-space: nowrap;"></td>';
        content += '<td style="white-space: nowrap;"></td>';
        content += '<td style="white-space: nowrap;"></td>';
        content += '<td style="white-space: nowrap;"></td>';
        content += '</td>';
        content += '</tr>';
        content += '</tbody>';
        content += '</table>';
        $("#shipmentTbl").prepend(content);
        //加载图片
});
$ips.load('statementlist', 'getTypeNum', {type:'driver'}, function(data){
    data.name='echarts_main';
    data.tablename='每月新增司机个数';
    data.pname='本月新增司机个数';
    loadPie(data);
});
$ips.load('statementlist', 'getTypeNum', {type:'receipter'}, function(data){
    data.tablename='每月新增签收人数';
    data.name='echarts_main1';
    data.pname='本月新增签收人数';
    loadPie(data);
});
$ips.load('statementlist', 'getTypeNum', {type:'breakbulk'}, function(data){
    data.tablename='每月新增零担转运单数';
    data.name='echarts_main2';
    data.pname='本月新增零担转运单数';
    loadPie(data);
});
/*$ips.load('statementlist', 'getTypeNum', {type:'GPSnum'}, function(data){
    data.name='echarts_main3';
    data.pname='本月新增GPS数';
    loadPie(data);
});*/
$ips.load('statementlist', 'getTypeNum', {type:'LBSnum'}, function(data){
    data.tablename='每月新增LBS定位数量';
    data.name='echarts_main3';
    data.pname='本月新增LBS定位数量';
    loadPie(data);
});
$ips.load('statementlist', 'getTypeNum', {type:'signnum'}, function(data){
    data.tablename='每月签到次数';
    data.name='echarts_main4';
    data.pname='本月签到次数';
    loadPie(data);
});
$ips.load('statementlist', 'getTypeNum', {type:'tenderpush'}, function(data){
    data.tablename='每月发标通知次数';
    data.name='echarts_main5';
    data.pname='本月发标通知次数';
    loadPie(data);
});
//加载上方饼图
function loadPie(json){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(json.name));
    option = {
        title : {
        text: json.tablename,
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data:['直接访问']
        },
        grid: {
            left: '0%',
            right: '0%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                /*data : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']*/
                data : json[0].months
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:json.pname,
                type:'bar',
                /*data:[0, 32, 31, 34, 24, 33, 55, 33, 31, 34, 90, 42]*/
                data:json[0].num
            },

        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
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
        update_time=$('#statistic_date').val();
        exportSearchParams.push({name:"statistic_date","value":update_time});
        warehouse_name=$('#warehouse_name').val();
        exportSearchParams.push({name:"warehouse_name","value":warehouse_name});
    });
    exportSearchParams.push({name:"filename","value":"print-" + time});
    $('#export').exportdata({dataModule : 'statementlist',dataMethod:'getRetifyList',searchParams: exportSearchParams,title:'分级运价审批明细报表',partDataRows:3000,partSize:100});
},true,true);
