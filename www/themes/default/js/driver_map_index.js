var params = $ips.getUrlParams();
var btnMoreSearch = $("#btnMoreSearch");
var userinfo = $ips.getCurrentUser();
var userRole = '';
var pageNo = 1;
var pageSize = 100;

/***** 收回菜单 *****/
sendMessageToGateway({'takeMenu': true});

/***** 加载一系列页面需要使用的脚本 *****/
loadServiceMapScript();

/***** 解决页面重新布局等问题 *****/
var height = window.screen.availHeight;
$('#mapDataBody').css('height',height-32);

// 搜索按钮
$("#btnSearch").click(function() {
    loadServiceMapScript();
});

//设置默认搜索时间
$('#reportTime').val(moment().format('L')+' 00:00');
$('#statistic_date').val(set_time_range());

//选择搜索时间
$('#statistic_date').daterangepicker({
    timePicker: true,//显示小时和分钟
    timePickerIncrement: 1, //分钟选择的间隔
    format: 'YYYY-MM-DD HH:mm', //返回值的格式
    timePicker12Hour: false, //采用24小时计时制
    showDropdowns: true, //是否显示年、月下拉框
});

//上报时间选择
$("#reportTime").daterangepicker({
    timePicker: true,
    timePickerIncrement: 1,
    format: "YYYY-MM-DD HH:mm",
    timePicker12Hour: false,
    showDropdowns: true,
    singleDatePicker: true
});

//设置时间范围
function set_time_range(){
    var returntimes = moment().format('L')+' 00:00'+' - '+moment().format('L')+' 23:59';
    return returntimes;
}

//加载车牌号选择框
$("#carnum").select2({
    placeholder: "选择车辆",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('truck_source', 'truckCheckByphone',{carnum:e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.carnum, text: y.carnum });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});

function initServiceMap() {
    // 百度地图API功能
    map = new BMap.Map("allmap");
    map.centerAndZoom(new BMap.Point(104.0715030000,30.6588240000), 6);
    map.enableScrollWheelZoom();

    var styleOptions = {
        strokeColor:"blue",    //边线颜色。
        fillColor:"blue",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 0.8,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'dashed' //边线的样式，solid或dashed。
    }
    //实例化鼠标绘制工具
    var drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingType: BMAP_DRAWING_MARKER, enableDrawingTool: true,
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_LEFT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            scale:0.8,
            drawingTypes : [
                BMAP_DRAWING_RECTANGLE
            ]
        },
        setDrawingMode:BMAP_DRAWING_RECTANGLE,
        rectangleOptions: styleOptions //矩形的样式
    });

    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', function(e){
        var overlays = [];
        overlays.push(e.overlay);
        for(var i = 0; i < overlays.length; i++){
            map.removeOverlay(overlays[i]);
        }
        overlays.length = 0
        $ips.load('driver_map', 'search',{'statistic_date':$("#frmSearch").serializeArray()[0]['value'],'carnum':$("#frmSearch").serializeArray()[1]['value'],'path':e.overlay.getPath(),pageSize:5},function(data) {
            var content = '<table id="tblMain" class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
            content += '<thead>';
            content += '<tr role="row">';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">司机姓名</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">车牌号</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">手机号</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">定位时间</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">位置</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">车长</th>';
            content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">车型</th>';
            content += '</tr>';
            content += '</thead>';
            $.each(data.result,function(i,item){
                content += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';
                content += '<tr>';
                content += '<td style="white-space: nowrap;">'+ item.driver_name +'</td>';
                content += '<td style="white-space: nowrap;">'+ item.carnum +'</td>';
                content += '<td style="white-space: nowrap;">'+ item.phone +'</td>';
                content += '<td style="white-space: nowrap;">'+ item.time+'</td>';
                content += '<td style="white-space: nowrap;">'+ item.address + '</td>';
                content += '<td style="white-space: nowrap;">'+ item.car_length + '</td>';
                content += '<td style="white-space: nowrap;">'+ item.carriage_type + '</td>';
                content += '</tr>';

            });
            content += '</table>';
            content += '<ul id="pagination-digg">';

            var page = Math.ceil(data.totalCount / 5);

            //上一页
            if(data.pageNo != '1'){
                content += '<li class="next"><a href="javascript:;" onclick="page('+data.pageNo+'-1,'+data.lat1+','+data.lat2+','+data.lng1+','+data.lng2+')">&laquo;Previous</a></li>';
            }
            else{
                content += '<li class="previous-off">&laquo;Previous</li>';
            }
            for(i=1;i<=page;i++){
                if(i == data.pageNo ){
                    content += '<li class="active">'+i+'</li>';
                }
                else{
                    content += '<li><a href="javascript:;" onclick="page('+i+','+data.lat1+','+data.lat2+','+data.lng1+','+data.lng2+')">'+i+'</a></li>';
                }
            }

            //下一页
            if((data.pageNo != page) &&  page != '0'){
                content += '<li class="next"><a href="javascript:;" onclick="page('+data.pageNo+'+1,'+data.lat1+','+data.lat2+','+data.lng1+','+data.lng2+')">Next &raquo;</a></li>';
            }
            else{
                content += '<li class="previous-off">Next &raquo;</li>';
            }

            content += '</ul>';

            $("#drivers").html(content);

            if(data.totalCount != 0){
                $('.jRibbon').toggleClass('up', 300);
                $('.jBar').show();
            }
            else{
                $('.jBar').hide();
            }

        });
        drawingManager.close();
    } );

    renderingMap(pageNo);
}
function loadServiceMapScript() {

    loadScript("http://api.map.baidu.com/getscript?v=2.0&ak=dVeyh7XGPHUsoAmcaltrHCiP", loadClusterer, true, true);
    loadScript("http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js", loadClusterer, true, true);
    loadScript("http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.js", loadClusterer, true, true);

    function loadClusterer() {
        initServiceMap();
    }
}

function renderingMap(pageNo){
    var searchParams = genSearchParams(pageNo);
    //加载司机位置
    $ips.load('driver_map', 'search',searchParams,function(data) {
        $.each(data.result,function(i,item){
            var marker = new BMap.Marker(new BMap.Point(item.gps.bd_lng,item.gps.bd_lat));  // 创建标注
            var content = '司机姓名：'+item.driver_name+'</br>'+
                '车牌号：'+item.carnum+'</br>'+
                '经纬度：'+item.gps.bd_lng+','+item.gps.bd_lat+'</br>'+
                '位置：'+item.address+'</br>'+
                '定位时间：'+item.time+'</br>'+
                '电话：'+item.phone+'</br>'+
                '车长：'+item.car_length+'</br>'+
                '车型：'+item.carriage_type
            map.addOverlay(marker);               // 将标注添加到地图中
            addClickHandler(content,marker);
        });
        if(data.result != ''){
            setTimeout(function(){
                renderingMap(data.pageNo+1);
            },1000);
        }

    });

    function addClickHandler(content,marker){
        marker.addEventListener("click",function(e){
                openInfo(content,e)}
        );
    }
    function openInfo(content,e){
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow,point); //开启信息窗口
    }
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

    //获取查询条件
    function genSearchParams(pageNo){
        var searchParams = $("#frmSearch").serializeArray();
        searchParams.push({name: "pageSize", value:100});
        searchParams.push({name: "pageNo", value:pageNo});
        return searchParams;
    }

}

function page(page,lat1,lat2,lng1,lng2){

    $ips.load('driver_map', 'search',{'statistic_date':$("#frmSearch").serializeArray()[0]['value'],'carnum':$("#frmSearch").serializeArray()[1]['value'],pageSize:5,lat1:lat1,lat2:lat2,lng1:lng1,lng2:lng2,pageNo:page},function(data) {
        var content = '<table id="tblMain" class="table table-striped table-bordered table-hover has-tickbox dataTable" aria-describedby="tblMain_info" style="width: 100%;">';
        content += '<thead>';
        content += '<tr role="row">';
        content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">司机姓名</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">车牌号</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">手机号</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">定位时间</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">位置</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">车长</th>';
        content += '<th tabindex="0" rowspan="1" colspan="1"  style="width: 164px; white-space: nowrap;">车型</th>';
        content += '</tr>';
        content += '</thead>';
        $.each(data.result,function(i,item){
            content += '<tbody role="alert" aria-live="polite" aria-relevant="all" style="background-color: rgb(255, 255, 255);">';
            content += '<tr>';
            content += '<td style="white-space: nowrap;">'+ item.driver_name +'</td>';
            content += '<td style="white-space: nowrap;">'+ item.carnum +'</td>';
            content += '<td style="white-space: nowrap;">'+ item.phone +'</td>';
            content += '<td style="white-space: nowrap;">'+ item.time+'</td>';
            content += '<td style="white-space: nowrap;">'+ item.address + '</td>';
            content += '<td style="white-space: nowrap;">'+ item.car_length + '</td>';
            content += '<td style="white-space: nowrap;">'+ item.carriage_type + '</td>';
            content += '</tr>';

        });
        content += '</table>';
        content += '<ul id="pagination-digg">';

        var page = Math.ceil(data.totalCount/5);
        if(data.pageNo != '1'){
            content += '<li class="next"><a href="javascript:;" onclick="page('+data.pageNo+'-1,'+data.lat1+','+data.lat2+','+data.lng1+','+data.lng2+')">&laquo;Previous</a></li>';
        }
        else{
            content += '<li class="previous-off">&laquo;Previous</li>';
        }

        for(i=1;i<=page;i++){
            if(i == data.pageNo ){
                content += '<li class="active">'+i+'</li>';
            }
            else{
                content += '<li><a href="javascript:;" onclick="page('+i+','+data.lat1+','+data.lat2+','+data.lng1+','+data.lng2+')">'+i+'</a></li>';
            }
        }
        //下一页
        if(data.pageNo == page){
            content += '<li class="previous-off">Next &raquo;</li>';
        }
        else{
            content += '<li class="next"><a href="javascript:;" onclick="page('+data.pageNo+'+1,'+data.lat1+','+data.lat2+','+data.lng1+','+data.lng2+')">Next &raquo;</a></li>';
        }
        content += '</ul>';

        $("#drivers").html(content);

        if(data.totalCount != 0){
            $('.jRibbon').toggleClass('up', 300);
            $('.jBar').show();
        }
        else{
            $('.jBar').hide();
        }

    });
}
