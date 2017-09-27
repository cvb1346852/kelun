
var mapHeight_all = 0;
var maptype_all = 0;

var serviceMap = null;
var serviceMarkerClusterer = null;
var currentNavigation = {
    destination: null,
    serviceDriving: null
}
var currentTruck = null;
var serviceTable = null;

var initalZoomLevel = 5;
var middleZoomLevel = 13;

var searchCircleColor   = "#0C88E8";
var navPathColor        = "#9900FF";
var eventType = new Array('未知','转包上报','天气','堵车','修路','查车','修车','签收','其他','申请签收','进厂','出厂');


/***** 收回菜单 *****/
sendMessageToGateway({'takeMenu': true});

/***** 加载一系列页面需要使用的脚本 *****/
loadServiceMapScript();

/***** 解决页面重新布局等问题 *****/
//resetPageLayout();
var height = window.screen.availHeight;
$('#mapDataBody').css('height',height-32);
function initServiceMap() {
    serviceMap = new BMap.Map("mapDiv");
    var point = new BMap.Point(116.404, 39.915);
    serviceMap.centerAndZoom(point, initalZoomLevel);

    serviceMap.enableScrollWheelZoom(true);

    serviceMap.addControl(new BMap.NavigationControl());

    // serviceMap.addEventListener("zoomend", compressServiceMarker);

}

function loadServiceMapScript() {
    loadScript("http://api.map.baidu.com/getscript?v=2.0&ak=dVeyh7XGPHUsoAmcaltrHCiP", loadClusterer, true, true);

    function loadClusterer() {
        initServiceMap();
        loadScript($ips.appPath + 'js/imap/baidu/imap.baidu.tools.markerclusterer.js', initClusterer);
    }

    function initClusterer() {
        serviceMarkerClusterer =  new MarkerClusterer(serviceMap, [], {maxZoom: middleZoomLevel - 1});
        /**初始化页面数据**/
        updateDataTables();
    }
}

/*function initDataTables() {
    serviceTable = $('#dt_basic').dataTable({
        // "sPaginationType": "bootstrap",
        "bFilter": false,
        "bInfo": false, //页脚信息
        "bScrollAutoCss": true,
        "bScrollCollapse": true,
        "sScrollY": "200px",
        "sScrollX": "100%",
        "bPaginate": false,
        // "iDisplayLength": 20, //每页显示数据量
        "bLengthChange": false, // 用户不可改变每页显示数量
        "bProcessing": true, // 是否启用进度显示，进度条等等，对处理大量数据很有用处。// 默认值：false
        "bStateSave": false, // 保存状态到cookie
        "oLanguage" : {"sUrl": $ips.appPath + getLanguageTxt()},
        "aaSorting": [],
        "aoColumns": [
            {sTitle: "距离(KM)", sName: "distance", bSortable: false, mData: "distance", sWidth: "15%"},
            {sTitle: "网点名称", sName: "name",     bSortable: false, mData: "name",    sWidth: "20%"},
            {sTitle: "联系人",   sName: "contact",  bSortable: false, mData: "contact", sWidth: "15%"},
            {sTitle: "联系电话", sName: "mobile",   bSortable: false, mData: "mobile",   sWidth: "15%"},
            {sTitle: "网点地址", sName: "address",  bSortable: false, mData: "address",  sWidth: "35%"},
        ],
        "aaData": []
    });
    updateDataTables(true);
}*/

function updateDataTables() {
    var urlParam = $ips.getUrlParams();
    searchParams = {shipmentId:urlParam.id}
    $.ajax({
        type: 'post',
        url: "rest/service.php?method=industry.history.getByShipmentId",
        data: searchParams,
        dataType: 'json',
        error: function(request){
            console.log("request nearservice error!");
        },
        success: function (response) {
            var historyPoint = response.data.historyPoint;
            var event = response.data.event;

            /*** 更新地图 ***/
            if ( serviceMap ) {
                updateServiceMap(historyPoint, event);
            }
        }
    });
}


function updateServiceMap(historyPoint, event) {
    if ( serviceMap === null ) {
        initServiceMap();
    }
    if ( serviceMarkerClusterer ) {
        serviceMarkerClusterer.clearMarkers();
    }
    serviceMap.clearOverlays();

    /** 初始化数据 **/
    var markers = [];
    var pt = null;
    var myIcon = null;
    var marker = null;
    var infoWindow = null;
    var infoContent = "";

    /** 在地图上画聚合的事件 **/
    for ( var i = 0; i < event.length; i++ ) {
        pt = new BMap.Point(event[i].lng, event[i].lat);
        marker = new BMap.Marker(pt);  // 创建标注
        /*创建信息窗口*/
        infoContent = '<p>事件名称:' + eventType[event[i].report_type] + '</p>' +
            '<p>关联订单号:' + (event[i].order_code ? event[i].order_code :'') + '</p>' +
            '<p>时间:' + event[i].create_time + '</p>';
        infoWindow = new BMap.InfoWindow(infoContent);
        event[i].infoWindow = infoWindow;
        event[i].marker = marker;
        $(marker).data("service", event[i]);
        marker.addEventListener("click", function(e){
            var service = $(e.target).data("service");
            this.openInfoWindow(service.infoWindow);
        });
        markers.push(marker);
    }
    serviceMarkerClusterer.addMarkers(markers);

    /******** 在地图上画轨迹 ********/
    var points = [];
    var first_point = [];

    translateCallback = function (data){
        if(data.status === 0) {
            for ( var i = 0; i < data.points.length; i++ ) {
                markers = [];
                pt = new BMap.Point(data.points[i].lng, data.points[i].lat);
                if(first_point.length==0) {
                    first_point = pt;
                    serviceMap.centerAndZoom(first_point, 14);
                }
                points.push(pt);
                marker = new BMap.Marker(pt);  // 创建标注
                markers.push(marker);
            }

            serviceMap.addOverlay(new BMap.Polyline(points, {
                strokeColor : "blue",
                strokeWeight : 3,
                strokeOpacity : 0.5
            }));
        }
    }
    setTimeout(function(){
        var convertor = new BMap.Convertor();
        var pointArr = [];
        for ( var i = 0; i < historyPoint.length; i++ ) {
            pt = new BMap.Point(historyPoint[i].lng, historyPoint[i].lat);
            pointArr.push(pt);
        }
        convertor.translate(pointArr, 3, 5, translateCallback)
    }, 1000);
}

function resetPageLayout() {
    var onmessage = function (e) {
        var params = parsePostMessageParams(e.data.toString());
        mapHeight_all = params.height;
        if(mapHeight_all) {
            mapAutoHeight(mapHeight_all,maptype_all);
        }
        if ( serviceTable && $('#data_table_toggle').hasClass("fa-minus-square")) {
            /* 在展开状态下才重绘 */
            serviceTable.fnDraw();
        }
    };
    if (typeof window.addEventListener != 'undefined') {
        window.addEventListener('message', onmessage, false);
    } else if (typeof window.attachEvent != 'undefined') {
        window.attachEvent('onmessage', onmessage);
    }
}

/* 下为地图界面自适应高度,被门户调用的实现方式 */
function mapAutoHeight(pHeight, type) {
    var selfWindowHeight = $(window).height();
    var mapHeight = pHeight - 34;
    if (pHeight == null) {
        mapHeight = selfWindowHeight - 34;
    } else if (type == 0) {
        mapHeight = pHeight - 155;
    }
    $("#mapDataBody").css({"height": mapHeight});
}

//左侧表格自适应高度
function resizeTableHeight() {
    var dtHeight = $(window).height() - (34 + 54);
    $(".dataTables_wrapper").css("max-height", dtHeight);
}

function parsePostMessageParams(str) {
    try {
        var params = JSON.parse(str);
        return params;
    } catch (e) {
        return {};
    }

}

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}