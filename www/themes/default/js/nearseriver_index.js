/*
 * 描述: 为就近服务页面服务的JS
 *
 * 作者: WangLin，wanglin_cd@huoyunren.com
 * 公司: G7
 * 历史：
 *       2016.06.08 WangLin创建
 */
var mapHeight_all = 0;
var maptype_all = 0;

var serviceNetwork = null;
var serviceMap = null;
var serviceMarkerClusterer = null;
var serviceTraffic = null;
var currentNavigation = {
    destination: null,
    serviceDriving: null
}
var currentTruck = null;
var bampAnimationTime = 2000;
var serviceTable = null;

var initalZoomLevel = 5;
var middleZoomLevel = 13;

var searchCircleColor   = "#0C88E8";
var navPathColor        = "#9900FF";

var truckStatus = {
    "行驶": "truck_moving",
    "怠速": "truck_idling",
    "熄火": "truck_stop",
    "离线": "truck_offline",
}


/***** 收回菜单 *****/
sendMessageToGateway({'takeMenu': true});

/***** 初始化页面各个操作按钮 *****/
initPageTools();

/***** 加载一系列页面需要使用的脚本 *****/
loadServiceMapScript();
loadDataTableScripts();

/***** 解决页面重新布局等问题 *****/
resetPageLayout();


function initServiceMap() {
    serviceMap = new BMap.Map("mapDiv");
    var point = new BMap.Point(106, 50);
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
    }
}

function loadDataTableScripts() {
    loadScript("../../js/plugin/datatables/jquery.dataTables-cust.min.js", dt_2);
    function dt_2() {
        loadScript("../../js/plugin/datatables/ColReorder.min.js", dt_3);
    }

    function dt_3() {
        loadScript("../../js/plugin/datatables/FixedColumns.min.js", dt_4);
    }

    function dt_4() {
        loadScript("../../js/plugin/datatables/ColVis.min.js", dt_5);
    }

    function dt_5() {
        loadScript("../../js/plugin/datatables/ZeroClipboard.js", dt_6);
    }

    function dt_6() {
        loadScript("../../js/plugin/datatables/media/js/TableTools.min.js", dt_7);
    }

    function dt_7() {
        loadScript("../../js/plugin/datatables/DT_bootstrap.js", initDataTables);
    }
}

function initDataTables() {
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
}

function updateDataTables(firstTime) {
    var searchParams = $("#service_form").serializeObject();
    if ( searchParams.search_selection == "vincode" ) {
        searchParams.carnum = searchParams.vincode;
    }
    delete searchParams.vincode;
    delete searchParams.search_selection;

    $.ajax({
        type: 'post',
        url: "inside.php?t=json&m=nearservice&f=search",
        data: searchParams,
        dataType: 'json',
        error: function(request){
            console.log("request nearservice error!");
        },
        success: function (response) {
            serviceNetwork = response.data.network;
            currentTruck = response.data.truck;

            /*** 更新地图 ***/
            if ( serviceMap ) {
                updateServiceMap(currentTruck, serviceNetwork);
            }

            /*** 更新列表 ***/
            serviceTable.fnClearTable();
            serviceTable.fnAddData(serviceNetwork);
            $("#network_count").text(serviceNetwork.length);
            serviceTable.$('tr').click( function () {
                var data = serviceTable.fnGetData( this );
                var pt = new BMap.Point(data.longitude, data.latitude);
                var zoomLevel  = serviceMap.getZoom();
                if ( zoomLevel >= middleZoomLevel ) {
                    serviceMap.setCenter(pt);
                } else {
                    serviceMap.centerAndZoom(pt, middleZoomLevel);
                }
                data.marker.openInfoWindow(data.infoWindow);
            });

            if ( firstTime && $('#data_table_toggle').hasClass("fa-minus-square") ) {
                /* 第一次进入系统隐藏掉列表 */
                $('#data_table_toggle').click();
            }

            if ( !firstTime && $('#data_table_toggle').hasClass("fa-plus-square")) {
                /* 以后每次搜索时都展开列表 */
                $('#data_table_toggle').click();
            }
        }
    });
}

function compressServiceMarker() {
    // serviceMarkerClusterer.clearMarkers();
}

function updateServiceMap(truck, serviceNetwork) {
    if ( serviceMap === null ) {
        initServiceMap();
    }
    /** 重新搜索后隐藏导航信息 **/
    $("#navigation_result_wrapper").hide();
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

    /** 在地图上画聚合的网点 **/
    for ( var i = 0; i < serviceNetwork.length; i++ ) {
        pt = new BMap.Point(serviceNetwork[i].longitude, serviceNetwork[i].latitude);
        myIcon = new BMap.Icon("/img/nearservice/service_station.png", new BMap.Size(32, 32));
        marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
        /*创建信息窗口*/
        infoContent = '<p>网点名称:' + serviceNetwork[i].name + '</p>' +
            '<p>联系人:' + serviceNetwork[i].contact + '</p>' +
            '<p>联系方式:' + serviceNetwork[i].mobile + '</p>' +
            '<p>24小时服务电话:' + serviceNetwork[i].telephone + '</p>' +
            '最优路线:<select id="driving_policy" name="go_there">' +
                '<option value="0">速度优先</option>' +
                '<option value="1">距离优先</option>' +
                '<option value="2">避开高速</option>' +
            '</select>' +
            '<input type="button" value="去这里" onclick="drivingThere(' + serviceNetwork[i].longitude + ',' + serviceNetwork[i].latitude + ')">';
        infoWindow = new BMap.InfoWindow(infoContent);
        serviceNetwork[i].infoWindow = infoWindow;
        serviceNetwork[i].marker = marker;
        $(marker).data("service", serviceNetwork[i]);
        marker.addEventListener("click", function(e){
            var service = $(e.target).data("service");
            this.openInfoWindow(service.infoWindow);
        });
        markers.push(marker);
    }
    serviceMarkerClusterer.addMarkers(markers);

    /******** 在地图上添加卡车 ********/
    if ( currentTruck.carnum == "" ) {
        return; /** 第一次进入页面没有车辆信息 **/
    }
    if ( !currentTruck.lng || !currentTruck.lat ) {
        $ips.error("车辆定位失败");
        return;
    }
    pt = new BMap.Point(currentTruck.lng, currentTruck.lat);
    myIcon = new BMap.Icon("/img/truck/" + truckStatus[currentTruck.status] + ".png", new BMap.Size(32,32));
    marker = new BMap.Marker(pt,{icon:myIcon, rotation: currentTruck.course});  // 创建标注
    $(marker).data("truck", truck);
    truck.marker = marker;
    marker.addEventListener("click", function(e){
        var marker = this;
        var truck = $(e.target).data("truck");
        this.setAnimation(null);
        if ( truck.infoWindow ) {
            this.openInfoWindow(truck.infoWindow);
            return;
        }
        var geoc = new BMap.Geocoder();
        var pt = new BMap.Point(truck.lng, truck.lat);
        geoc.getLocation(pt, function (rs) {
            truck.address = pieceAddres(rs);
            /*创建信息窗口*/
            var infoContent = pieceTruckInfoWindowContent(truck);
            var infoWindow = new BMap.InfoWindow(infoContent);
            truck.infoWindow = infoWindow;
            marker.openInfoWindow(infoWindow);
        });
    });
    serviceMap.addOverlay(marker);
    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
    setTimeout(function () {
        currentTruck.marker.setAnimation(null);
    }, bampAnimationTime);

    /** 画搜索范围 **/
    var circle = new BMap.Circle(pt, $("#searchrange").val() * 1000,{fillColor: searchCircleColor, strokeWeight: 1 ,fillOpacity: 0.2, strokeOpacity: 0.2});
    serviceMap.addOverlay(circle);
    serviceMap.setViewport(circle.getBounds());
}

function pieceAddres(rs) {
    var addComp = rs.addressComponents;
    var address = addComp.province;
    if ( addComp.city  != addComp.province ) {
        address += addComp.city;
    }
    address += addComp.district + addComp.street;
    if ( addComp.streetNumber ) {
        address += addComp.streetNumber;
    }
    return address;
}

function pieceTruckInfoWindowContent(truck) {
    var infoContent = '<p>VIN码: ' + truck.vincode + '</p>' +
        '<p>车牌号: ' + truck.carnum + '</p>' +
        '<p>车辆类型: ' + truck.vehicleType + '</p>' +
        '<p>当前位置: ' + truck.address + '</p>' +
        '<p>最新时间: ' + truck.time + '</p>';
    return infoContent
}

function drivingThere(lng, lat) {
    if ( !currentTruck.lng || !currentTruck.lat ) {
        return;
    }
    if ( currentNavigation.serviceDriving ) {
        currentNavigation.serviceDriving.clearResults();
    }
    var routePolicy = [
            BMAP_DRIVING_POLICY_LEAST_TIME,
            BMAP_DRIVING_POLICY_LEAST_DISTANCE,
            BMAP_DRIVING_POLICY_AVOID_HIGHWAYS
        ];
    var start = new BMap.Point(currentTruck.lng, currentTruck.lat);
    var end = new BMap.Point(lng, lat);
    currentNavigation.serviceDriving = new BMap.DrivingRoute(serviceMap, {
        renderOptions:{
            map: serviceMap,
            autoViewport: true,
            panel: "navigation_result",
        },
        policy: routePolicy[$("#driving_policy").val()],
        onPolylinesSet: function (routes) {
            for ( var i = 0; i < routes.length; i ++ ) {
                var polyline = routes[i].getPolyline();
                polyline.setStrokeColor(navPathColor);
            }
        }
    });
    currentNavigation.serviceDriving.search(start, end);

    /** 显示导航信息 **/
    $("#navigation_result").show();
    $("#navigation_result_wrapper").show();
    $("#rightToggleBtn i").addClass("fa-caret-right");
}

function initPageTools() {
    /* 全屏按钮 */
    $("a.jarviswidget-fullscreen-btn").bind("click",function(){
        if(maptype_all == 1){
            maptype_all=0;
        }else{
            maptype_all = 1;
        }
        mapAutoHeight(mapHeight_all,maptype_all);
        return false;
    });

    /* 搜索按钮 */
    initSearchCondition();

    /* 右边导航列表 隐藏与显示 控制按钮 */
    $("#rightToggleBtn").click(function () {
        $("#navigation_result").toggle();
        $("#rightToggleBtn i").toggleClass("fa-caret-right");
    });

    /* 主体左右布局 */
    initTableToggle();

    /* 实时路况 */
    $('#mapToolDiv_traffic').click(function () {
        if ( $(this).hasClass("clicked") ) {
            $(this).removeClass("clicked");
            serviceMap.removeTileLayer(serviceTraffic);
        } else {
            $(this).addClass("clicked");
            serviceTraffic = new BMap.TrafficLayer();
            serviceMap.addTileLayer(serviceTraffic);
        }
    });

    /* 结束导航按钮 */
    $('#mapToolDiv_clear').click(function () {
        if ( currentNavigation.serviceDriving ) {
            currentNavigation.serviceDriving.clearResults();
        }
        $("#navigation_result_wrapper").hide();
    });

    $('#table_opt_wrapper .table-title').click(function () {
        $("#data_table_toggle").click();
    });
}

function initSearchCondition() {
    /* 搜索 按钮 */
    $("#mapview_searchbtn").click(function () {
        serviceSearch();
    });
    /* 控制 搜索范围 输入框 */
    $("#searchrange").on("keydown", number_input_control);
    /* 搜索条件 之 vincode与车牌号选择框 */
    $('#search_selection').change(function (event) {
        var value = $(event.target).val();
        if ( value == "vincode") {
            $('#vincode_cell').show();
            $('#gpsno_cell').hide();
        } else {
            $('#vincode_cell').hide();
            $('#gpsno_cell').show();
        }
    });
    loadScript('/js/plugin/select2/select2.min.js', function () {
        //车辆VIN码
        $("#vincode").select2({
            placeholder: "请输入车辆VIN码",
            minimumInputLength: 1,
            multiple: false,
            allowClear: true,
            // 数据加载
            query: function (e) {
                $ips.load('nearservice', 'getTruckList', {vincodeLK: e.term.trim()}, function (data) {
                    var item = [];
                    for (var i = 0; i < data.length; i++) {
                        item.push({id: data[i].carnum, text: data[i].vincode});
                    }
                    var info = {
                        results: item
                    }
                    e.callback(info);
                });
            }
        });
        $("#carnum").select2({
            placeholder: "请输入车牌号",
            minimumInputLength: 1,
            multiple: false,
            allowClear: true,
            // 数据加载
            query: function (e) {
                $ips.load('nearservice', 'getTruckList', {keyword: e.term}, function (data) {
                    var item = [];
                    for (var i = 0; i < data.length; i++) {
                        item.push({id: data[i].carnum, text: data[i].carnum});
                    }
                    var info = {
                        results: item
                    }
                    e.callback(info);
                });
            }
        });
        $("#servicelevel").select2({
            placeholder: "请选择",
            minimumInputLength: 0,
            multiple: false,
            allowClear: true,
            //数据加载
            query: function (e) {
                $ips.load('network', 'getNetworkLevelList', {}, function (data) {
                    var item = [];
                    for (var i = 0; i < data.length; i++) {
                        item.push({id: data[i].id, text: data[i].name});
                    }
                    var info = {
                        results: item
                    }
                    e.callback(info);
                });
            }
        });
        $("#servicetype").select2({
            placeholder: "请选择",
            minimumInputLength: 0,
            multiple: false,
            allowClear: true,
            //数据加载
            query: function (e) {
                $ips.load('network', 'getNetworkTypeList', {}, function (data) {
                    var item = [];
                    for (var i = 0; i < data.length; i++) {
                        item.push({id: data[i].id, text: data[i].name});
                    }
                    var info = {
                        results: item
                    }
                    e.callback(info);
                });
            }
        });

    }, true, true);
}

function serviceSearch() {
    var searchParams = $("#service_form").serializeObject();
    if ( searchParams.search_selection == "vincode" ) {
        if ( searchParams.vincode == "" ) {
            $ips.error("请输入车辆VIN码");
            return;
        }
    } else {
        if ( searchParams.carnum == "" ) {
            $ips.error("请输入车牌号");
            return;
        }
    }

    var distance = searchParams.distance;

    if ( distance < 0 || distance > 500 ) {
        $ips.error("请输入0到500的搜索范围");
        return;
    }

    updateDataTables();
}

function number_input_control( event ) {
    /*8：退格键、46：delete、37-40： 方向键
     **48-57：主键盘区的数字、96-105：小键盘区的数字
     **110、190：小键盘区和主键盘区的小数
     **189、109：小键盘区和主键盘区的负号
     **enter:13
     **/
    var event = event || window.event; //IE、FF下获取事件对象
    var cod = event.charCode||event.keyCode; //IE、FF下获取键盘码
    if (cod == 13){
        /*按enter键*/
        serviceSearch();
    } else {
        if(cod!=8 && cod != 46 && !((cod >= 48 && cod <= 57) || (cod >= 96 && cod <= 105) || (cod >= 37 && cod <= 40))){
            notValue(event);
        }
    }
    function notValue(event){
        event.preventDefault ? event.preventDefault() : event.returnValue=false;
    }
}

function initTableToggle() {
    $('#data_table_toggle').click(function () {
        if ( $(this).hasClass("fa-plus-square") ) {
            $(this).removeClass("fa-plus-square");
            $(this).addClass("fa-minus-square");
            $('#data_table_wrapper').show();
            serviceTable.fnDraw();
        } else {
            $(this).addClass("fa-plus-square");
            $(this).removeClass("fa-minus-square");
            $('#data_table_wrapper').hide();
        }
    });
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