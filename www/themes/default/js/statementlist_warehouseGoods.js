/**
 * Created by will_zhang on 1/5/2017.
 */
    //设置默认搜索时间
$('#statistic_date').val(set_time_range());
//选择搜索时间
$('#statistic_date').daterangepicker({
    timePicker: true,//显示小时和分钟
    timePickerIncrement: 1, //分钟选择的间隔
    format: 'YYYY-MM-DD HH:mm', //返回值的格式
    timePicker12Hour: false, //采用24小时计时制
    showDropdowns: true, //是否显示年、月下拉框
});
$(function(){
    showTable()
});
//设置时间范围
function set_time_range(){
    var returntimes = moment().subtract(3, 'days').format('L')+' 00:00'+' - '+moment().format('L')+' 23:59';
    return returntimes;
}

//获取查询条件
function genSearchParams(){
    var searchParams = $("#frmSearch").serializeArray();
    return searchParams;
}
function showTable(){
    var userinfo = $ips.getCurrentUser();
    var searchParams = genSearchParams();
    $ips.lockPage('数据加载中...');
    $ips.load('statementlist', 'getGoods', searchParams, function(Json){
        $ips.unLockPage();
        if(Json){
            loadPie(Json);
        }else{
            $('#remarkListModal').modal('show');
        }
    });
}


//加载上方饼图
function loadPie(Json){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echarts'));
    var geoCoordMap = Json.allcity;
     var BJData = [
         [{name:'成都市'}, {name:'上海市',value:90}],
         [{name:'成都市'}, {name:'惠州市',value:50}],
         [{name:'成都市'}, {name:'沈阳市',value:40}],
         [{name:'成都市'}, {name:'丽江市',value:30}],
         [{name:'成都市'}, {name:'乌兰察布市',value:20}]
    ];
    var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

    var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geoCoordMap[dataItem[0].name];
            var toCoord = geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
                res.push({
                    fromName: dataItem[0].name,
                    toName: dataItem[1].name,
                    coords: [fromCoord, toCoord]
                });
            }
        }
        return res;
    };
    var color = ['#a6c84c', '#ffa022', '#FAFAD2','#A9A9A9', '#F08080', '#B22222','#DCDCDC', '#ffa022', '#98FB98','#1E90FF',
                 '#00BFFF', '#00FFFF','#F5FFFA', '#7FFF00', '#FFD700','#DCDCDC', '#ffa022', '#98FB98','#1E90FF', '#00BFFF',
                 '#00FFFF','#F5FFFA', '#7FFF00', '#FFD700','#00BFFF', '#00FFFF','#F5FFFA', '#7FFF00'];
    var series = [];
    Json.name_cityArr.forEach(function (item, i) {
            series.push({
                name: item[0],
                type: 'lines',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#fff',
                    symbolSize: 3
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 0,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            },
            {
                name: item[0],
                type: 'lines',
                zlevel: 2,
                symbol: ['none', 'arrow'],
                symbolSize: 10,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: planePath,
                    symbolSize: 15
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 1,
                        opacity: 0.6,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            },
            {
                name: item[0],
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbolSize: function (val) {
                    return val[2] / 8;
                },
                itemStyle: {
                    normal: {
                        color: color[i]
                    }
                },
                data: item[1].map(function (dataItem) {
                    return {
                        name: dataItem[1].name,
                        value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                    };
                })
            });
    });

    option = {
        backgroundColor: '#404a59',
        title : {
            text: '基地发货数据展示',
            subtext: '',
            left: 'center',
            textStyle : {
                color: '#fff'
            }
        },
        tooltip : {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            data:Json.dataName,
            textStyle: {
                color: '#fff'
            },
            selectedMode: 'single'
        },
        geo: {
            map: 'china',
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#404a59'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: series
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
