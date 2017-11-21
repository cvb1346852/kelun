<template>
    <div class="map-wrap">
        <link type="text/css" rel="stylesheet" href="http://g7s.webchat.project.huoyunren.com/mobile/css/jquery.nouislider.css">

        <div id="allmap"></div>

        <div id="add-layers" class="add-layers add-layers-anim">
            <div class="review_layer">
                <div class="rangebar">
                    <div class="startPoint">始</div>
                    <div class="sliderbox" id="slider"></div>
                    <div class="endPoint">终</div>
                </div>
                <div class="daterangebox">
                    <input type="text" readonly :value="fromTime" />
                    <button v-if="sliderInfo.state == 'stop'" @click="play()" class="playbtn pause"><i class="iconfont fa-fw icon-triangle_r"></i></button>
                    <button v-if="sliderInfo.state == 'playing'" @click="pause()" class="playbtn"><i class="iconfont fa-fw icon-pause"></i></button>
                    <input type="text" readonly :value="toTime" class="pull-right text-right" />
                </div>
               <!-- <div class="rangecheckbox fs14">
                    <span>回放时间：</span>
                    <div id="rangelist" class="rangelist pull-right">
                        <span @click="setReviewTime(1)" id="1" :class="currentIndex == 1 ? 'current' : ''">前一天</span>
                        <span @click="setReviewTime(3)" id="3" :class="currentIndex == 3 ? 'current' : ''">前三天</span>
                        <span @click="setReviewTime(7)" id="7" :class="currentIndex == 7 ? 'current' : ''">前七天</span>
                    </div>
                </div>-->
            </div>
        </div>

        <div id="trail-wrap" class="trail-wrap">
            <div @click="switchLineDemo" class="trail-btn" id="trail-btn">
                <div :class="['trail-icon', isShowLineDemo ? 'trail-show' : '']"></div>
            </div>
            <div v-if="isShowLineDemo" class="trail-layer">
                <ul class="trail-inner">
                    <li class="trail-item">
                        <dl>
                            <dt class="h-speed">高</dt>
                            <dd>
                                <h4>90以上</h4>
                                <span>公里/小时</span>
                            </dd>
                        </dl>
                    </li>
                    <li class="trail-item">
                        <dl>
                            <dt class="m-speed">中</dt>
                            <dd>
                                <h4>41-90</h4>
                                <span>公里/小时</span>
                            </dd>
                        </dl>
                    </li>
                    <li class="trail-item">
                        <dl>
                            <dt class="l-speed">低</dt>
                            <dd>
                                <h4>0-40</h4>
                                <span>公里/小时</span>
                            </dd>
                        </dl>
                    </li>
                </ul>
            </div>
        </div>

        <div id="current-point">
            <div @click="showInfo" class="carnum">{{ carnum }}<i :class="['iconfont fa-fw', isShowInfo ? 'icon-arrow_up' : 'icon-arrow_down']"></i></div>
            <ul v-if="isShowInfo" class="info">
                <!--<li><span class="highlight">0公里</span>/0.0公里</li>-->
                <li><span class="highlight">{{ curPoint.time }}</span></li>
                <li><span class="highlight">{{ curPoint.speed }}</span>公里/时</li>
            </ul>
        </div>

        <alert v-model="show2">
            <div v-for="item in text" style="margin-bottom: 10px">
                <p>{{item.report_desc}}:{{item.address || '暂无位置信息'}}</p>
                <p>定位时间：{{item.create_time}}</p>
            </div>
        </alert>
    </div>
</template>
<style lang="less">
    .pull-right {
        float: right;
    }
    .map-wrap {
        width: 100%;
        height: 100%;
    }
    #allmap {width: 100%;height: 100%;margin:0;}
    .add-layers{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        /*display: none;*/
        box-shadow: 0 0 10px rgba(0,0,0,.2);
    }
    .add-layers-anim{
        -webkit-transition:all .5s;
        transition:all .4s;
    }
    .review_layer{ background-color: rgba(255,255,255,.9); padding: 8px}

    /*轨迹条组件*/
    .rangebar{
        position: relative;
        padding: 8px 0;
    }
    .rangebar .startPoint,.rangebar .endPoint{
        position: absolute;
        top: 0;
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 20px;
        border-radius: 50%;
        z-index: 999;
        font-size: 12px;
    }
    .rangebar .startPoint{
        left: 0;
        background-color: #AAA;
        color: #fff;
        border:2px solid #AAA;
    }
    .rangebar .endPoint{
        right: 0;
        background-color: #fff;
        color: #333;
        border:2px solid #2C87EB;
    }
    .rangebar .sliderbox{
        margin: 0 12px;
    }

    .daterangebox{
        position: relative;
        border:1px solid #d7d7d7;
        -webkit-border-radius: 3px;
        border-radius: 3px;
        background: #fafafa;
        box-shadow: inset 0 0 2px rgba(100,100,100,0.2);
        padding: 2px 6px;
        height: 30px;
        line-height: 24px;
        margin: 13px 0 10px 0;
    }
    .daterangebox input{
        width: 100px;
        font-size: 16px;
        height: 24px;
        line-height: 24px;
        color: #646464;
    }
    .daterangebox button.playbtn{
        display: block;
        position: absolute;
        width:50px;
        height: 40px;
        line-height: 40px;
        background-color: #d6a848;
        -webkit-border-radius:20px;
        border-radius: 20px;
        left: 50%;
        top:-6px;
        margin-left: -25px;
    }
    .daterangebox button.pause{
        background-color: #cf4762;
    }
    .daterangebox button.disable{
        background: #aaaaaa;
    }
    .daterangebox button.playbtn i{
        font-size: 20px;
        color: #ffffff;
    }
    .rangecheckbox{
        margin-top: 15px;
        padding-top: 5px;
        color: #999;
        border-top: 1px solid #ddd;
    }
    .rangecheckbox .rangelist{
        font-size: 0;
        overflow: hidden;
        position: relative;
    }
    .rangecheckbox .rangelist span{
        display: inline-block;
        padding: 0 8px;
        font-size:14px;
    }
    .rangecheckbox .rangelist span{
        margin-left: -1px;
        border-left: 1px solid #eee;
        font-weight: bold;
    }
    .rangecheckbox .rangelist span.current{
        color: #625eab;
    }

    #current-point{
        display: none;
        width: 6.25rem; position: fixed; left: .75rem; top: .75rem; background-color: rgba(0,0,0,.9); border-radius: .25rem; overflow: hidden}
    #current-point .carnum{ position: relative; padding-left: .5rem; height: 1.5rem; font-size: 16px; color: #fff; line-height: 1.5rem; font-weight: bold}
    #current-point .carnum .iconfont{ position: absolute; width: 1.5rem; height: 1.5rem; top: 0; right: 0; text-align: center; line-height: 1.5rem; font-weight: normal}
    #current-point .carnum:active{background-color:#000}
    #current-point .info{ padding:.45rem 0 .5rem .5rem;  border-top: 1px solid rgba(255,255,255,.3)}
    #current-point .info li{ height: 1.05rem; line-height: 1.05rem; font-size: 12px; color: #8e8e8e}
    #current-point .info .highlight{ color: #fdb032}


    /*轨迹回放线段颜色说明*/
    .trail-wrap{
        position: absolute;
        top: 86px;
        right:10px;
        width: 35px;
        height: 35px;
        border-radius: 2px;
        background: rgba(255,255,255,.9);
        box-shadow: 0 1px 5px rgba(0,0,0,.3);
        -webkit-box-shadow: 0 1px 5px rgba(0,0,0,.3);
        z-index: 1000;
        /*display:none;*/
    }
    .trail-btn{
        position: absolute;
        width: 100%;
        height: 100%;
        display: -webkit-box;
        -webkit-box-align: center;
        -webkit-box-pack: center;
    }
    .trail-icon{
        width: 15px;
        height: 15px;
        background: url(../../static/img/map_ctrl_icon.png) no-repeat -60px -5px;
        background-size: 162px 27px;
    }
    .trail-show{
        background-position: -6px -5px;
    }

    .trail-layer{
        position: absolute;
        top:29px;
        right:0;
        width: 105px;
        background-color:#fff;
        border-radius: 2px;
        overflow: hidden;
    }
    .trail-inner{
        padding:3px 0 0 13px;
    }
    .trail-item{
        line-height: 44px;
        font-size: 0;
    }
    .trail-item dl{

    }
    .trail-item dt{
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-right: 9px;
        text-align: center;
        line-height:24px;
        color: #fff;
        font-size: 14px;
    }
    .trail-item dd{
        position: relative;
        display: inline-block;
        line-height: 16px;
        top:7px;
        margin: 0;
    }
    .trail-item dd h4{
        font-size: 14px;
        color: #333;
        margin: 0;
        font-weight: normal;
    }
    .trail-item dd span{
        font-size: 12px;
        color: #999;
    }
    .trail-item .h-speed{
        background-color: #ee4647;
    }
    .trail-item .m-speed{
        background-color: #50c67c;
    }
    .trail-item .l-speed{
        background-color: #2884db;
    }

    .icon-triangle_r:before { content: "\e601"; }
    .icon-pause:before { content: "\e600"; }
</style>
<style scoped>
    @font-face {font-family: "iconfont";
        src: url('//at.alicdn.com/t/font_1463732597_8878891.eot'); /* IE9*/
        src: url('//at.alicdn.com/t/font_1463732597_8878891.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'), /* chrome,firefox */
        url('//at.alicdn.com/t/font_1463732597_8878891.ttf') format('truetype'), /* chrome,firefox,opera,Safari, Android, iOS 4.2+*/
        url('//at.alicdn.com/t/font_1463732597_8878891.svg#iconfont') format('svg'); /* iOS 4.1- */
        src: url('//at.alicdn.com/t/font_1463732597_8878891.eot')\0; /* ie8 fix */

    }
    .iconfont {
        font-family:"iconfont" !important;
        font-size:16px;
        font-style:normal;
        -webkit-font-smoothing: antialiased;
        -webkit-text-stroke-width: 0.2px;
        -moz-osx-font-smoothing: grayscale;
    }
    .icon-pause:before { content: "\e600"; }
    .icon-triangle_r:before { content: "\e601"; }
</style>
<script>
    import Vue from 'vue'
    import { Alert } from 'vux'
    const moment = require('moment');

    var toTimestamp = Date.parse(new Date())
    toTimestamp /= 1000 // 当前时间时间戳,秒为单位
    var from1dayTimestamp = (toTimestamp - ( 60 * 60 * 24 )) * 1000 // 一天前时间戳,秒为单位
    var from3dayTimestamp = (toTimestamp - ( 60 * 60 * 24 * 3 )) * 1000 // 一天前时间戳,秒为单位
    var from7dayTimestamp = (toTimestamp - ( 60 * 60 * 24 * 7 )) * 1000 // 一天前时间戳,秒为单位
    var globe_Marker = [];
    var marker;

    export default {
        components: {
            Alert,
        },
        data() {
            return {
                show2: false,
                text: '',
                time: '',
                truckid: this.$route.query.truckid,
                carnum: this.$route.query.carnum,
                openid:this.$route.query.openid,
                currentIndex: 1,
                from1dayTime: moment(from1dayTimestamp).format('MM-DD hh:mm'),
                from3dayTime: moment(from3dayTimestamp).format('MM-DD hh:mm'),
                from7dayTime: moment(from7dayTimestamp).format('MM-DD hh:mm'),
                toTime: moment(toTimestamp).format('MM-DD hh:mm'),
                fromTime: moment(from1dayTimestamp).format('MM-DD hh:mm'),

                from1dayTimeDetail: moment(from1dayTimestamp).format('yyyy-MM-DD hh:mm'),
                from3dayTimeDetail: moment(from3dayTimestamp).format('yyyy-MM-DD hh:mm'),
                from7dayTimeDetail: moment(from7dayTimestamp).format('yyyy-MM-DD hh:mm'),
                toTimeDetail: moment(toTimestamp).format('yyyy-MM-DD hh:mm'),
                fromTimeDetail: moment(from1dayTimestamp).format('yyyy-MM-DD hh:mm'),
                isShowInfo: true,
                isShowLineDemo: false,
                points: [],
                pts: [],
                ptsLen: 0,
                curPoint: {
                    time: moment(from1dayTimestamp).format('hh:mm:ss/MM-DD'),
                    speed: 0
                },
                sliderInfo: {
                    timer: null,//定时器
                    index: 0,
                    speed: 50,
                    cur: 0,//当前播放轨迹点的索引
                    state: 'stop' //播放状态,
                }
            }
        },
        computed: {
            sliderIndex() {
                return parseInt($("#slider").val())
            }
        },
        activated() {
            this.initMap()
        },
//        attached() {
//            this.initMap()
//        },
        methods: {
            isEmpty(obj) {
                for(var prop in obj) {
                    if(obj.hasOwnProperty(prop))
                        return false
                }

                return JSON.stringify(obj) === JSON.stringify({}) || JSON.stringify(obj) === JSON.stringify([])
            },
            showInfo() {
                if ( this.isShowInfo ) {
                    this.isShowInfo = false
                }
                else {
                    this.isShowInfo = true
                }
            },
            switchLineDemo() {
                if ( this.isShowLineDemo ) {
                    this.isShowLineDemo = false
                }
                else {
                    this.isShowLineDemo = true
                }
            },
            setReviewTime(index) {
                if (index == 1 || index == 3 || index == 7) {
                    this.currentIndex = index
                    let fromIndex = 'from' + index + 'dayTime'
                    let fromDetailIndex = 'from' + index + 'dayTimeDetail'
                    this.fromTime = this[fromIndex]
                    this.fromTimeDetail = this[fromDetailIndex]

                    if (this.sliderInfo.timer) {
                        clearInterval(this.sliderInfo.timer)
                    }
                    omap.clearOverlays()
                    this.getPoints()
                }
                else {
                    return;
                }
            },
            makeCurPoint(index) {
                if (index >= this.ptsLen) {
                    return;
                }
//                let time = formatTime(parseInt(this.pts[index].t) / 1000 , 'hh:mm:ss/MM-dd')
                let time = moment(parseInt(this.pts[index].timestamp) / 1000).format('MM-DD hh:mm')

                this.curPoint = {
                    time: time,
                    speed: this.pts[index].s
                }
            },
            makePoints(pts) {
                let data = pts

                for (let i=0; i<this.ptsLen; i++) {
                    this.points[i] = new G7SMap.Point(data[i].lng, data[i].lat)
                }
            },
            getPoints() {
                const data = JSON.parse(localStorage.getItem('mapData'));
                if (data.coord) {
                    this.pts = data.coord.data;
                    this.ptsLen = this.pts.length;
                    this.initSlider( this.ptsLen - 1 );
                    this.makePoints( this.pts );
                    this.makeLine( this.pts );
                } else if(data.lbs){
                    const text = data.lbs.message
                    this.$vux.alert.show({
                        title: '',
                        content: text,
                        onShow () {
                        },
                        onHide () {
                        }
                    })
                } else {
                    if (data.lingdan.length === 0) {
                        this.$vux.alert.show({
                            title: '零担转运',
                            content: '没有在途信息',
                            onShow () {
                            },
                            onHide () {
                            }
                        })
                    } else {
                        const text = data.lingdan;
                        this.text = text;
                        this.show2 = true;
                    }
                }
//                this.$http.post('api.php?type=getCarHistory',
//                    {
//                        openid:this.openid,
//                        truckid: this.truckid,
//                        from: this.fromTimeDetail,
//                        to: this.toTimeDetail
//                    })
//                    .then( ( {data} ) => {
//                        console.log(data)
//                        if ( !this.isEmpty(data) ) {
//                            this.carnum = data.carnum
//                            this.pts.push.apply( this.pts, data.point )
////                            this.pts = data.point
//                            this.ptsLen = this.pts.length  // temp
//
//                            if (data.totalcount == 1000 && data.point[999].t < toTimestamp * 1000) {
////                                this.fromTimeDetail = formatTime(parseInt(data.point[999].t) / 1000, 'yyyy-MM-dd hh:mm:ss')
//                                this.fromTimeDetail = 2
//                                this.getPoints()
//                            }
//                            else {
//                                this.initSlider( this.ptsLen )
//                                this.makePoints( this.pts )
////                            this.drawLine( this.points )
//                                this.makeLine( this.pts )
//                            }
//                        }
//                    })
            },
            makeCurVisible(index) {
                let bounds = omap.getBounds()
                if( !bounds.containsPoint(this.points[index]) ){
                    omap.panTo(this.points[index], {
                        noAnimation: true
                    });
                }
            },
            play(index=undefined) {
                let self = this
                if (self.sliderInfo.cur < self.ptsLen - 1) {
                    self.sliderInfo.state = 'playing'

                    let _index = index
                    if ( _index === undefined ) {
                        _index = self.sliderInfo.cur || 0
                    }
                    $("#slider").val(_index)
                    self.makeCurVisible(_index)
                    self.setTruckPosition(_index)
                    self.makeCurPoint(_index)

                    self.sliderInfo.cur = _index
                    _index = _index + 1;

                    //动画播放
                    if (self.sliderInfo.timer) {
                        clearInterval(self.sliderInfo.timer)
                    }
                    self.sliderInfo.timer  = setInterval(function(){
                        self.play( _index )
                    }, self.sliderInfo.speed);
                }
                else {
                    clearInterval(self.sliderInfo.timer);
                    this.sliderInfo.state = 'stop'
                    self.sliderInfo.cur = 0
                    //播放结束后改变地图可缩放级别到最大
//                    omap.setZoom(18)
                }

            },
            pause() {
                this.sliderInfo.state = 'stop'
                if (this.sliderInfo.timer) {
                    clearInterval(this.sliderInfo.timer)
                }
            },
            jump(index) {
                this.pause()
                this.sliderInfo.cur = index

                this.setTruckPosition(index)
                this.makeCurPoint(index)
            },
            fn_addTruck(lng, lat) {
                var markeropt = {
                    icon : {
                        url : 'static/img/truck_stop_slected.png',
                        size : [28,28],
                        imageSize: [28,28],
                        anchor : [14,14]
                    },
                    title : ''
                }
                var pt = new G7SMap.Point(lng, lat);
                marker = new G7SMap.Marker(pt, markeropt);
                marker.setZIndex(101);
                omap.addOverlay(marker);
                globe_Marker.push(marker);
            },
            fn_addMarkerUser(pt, type) {
                let imgUrl = ''

                if ( 'first' === type ) {
                    imgUrl = 'static/img/truck_start.png'
                }
                else if ( 'last' === type ) {
                    imgUrl = 'static/img/truck_end.png'
                }


                let markeropt = {
                    icon : {
                        url : imgUrl,
                        size : [32,32],
                        imageSize: [32,32],
                        anchor : [16,16]
                    },
                    title : ''
                }
                let marker = new G7SMap.Marker(pt, markeropt);
                omap.addOverlay(marker);
                globe_Marker.push(marker);
            },
            drawLine(pts) {
                let me = this

                omap.setViewport(pts);
                omap.panBy(0, -128)
                setTimeout(function(){
                    let pointArr = [];
                    let len = pts.length
                    for(let i = 0 ; i < len ; i++) {
                        pointArr.push(new G7SMap.Point(pts[i].lng, pts[i].lat));
                    }

                    if (len > 0) {
                          me.fn_addTruck( pointArr[0].lng, pointArr[0].lat )
                        me.fn_addMarkerUser(pointArr[0], 'first');
                        me.fn_addMarkerUser(pointArr[len-1], 'last');

                        let polyline = new G7SMap.Polyline(pointArr,
                                {
                                    strokeColor : '#363F44',
                                    strokeWeight : 6,
                                    showDir : true
                                }
                        );
                        omap.addOverlay(polyline);
                    }
                }, 0);
            },
            /**
             * 根据速度画线
             * @param points
             */
            makeLine(points, lineArray) {
                let self = this
                //点分段
                //all level speed line points
                var stepPointsArray = [];
                //速度区间与对应的画线颜色
                var speedConfig = [
                    {speed: 0, color: "#2884db"},
                    {speed: 40, color: "#50c67c"},
                    {speed: 90, color: "#ff595a"}
                ];
                //参考速度
                var baseSpeed = 0;
                //参考颜色
                var baseColor = speedConfig[0].color;
                //参考角度
                var angular = -1;
                //允许最大的角度偏差
                var deviation = 5;
                //same level speed array
                var sameLevelPoints = [];
                function _updateBaseSpeed(currSpeed){
                    for(var i = 0, len = speedConfig.length; i < len; i++) {
                        if(currSpeed <= speedConfig[i].speed) {
                            break;
                        }
                    }
                    return speedConfig[(i-1) > 0? (i-1) : 0];
                }
                if(points.length){
                    for (var i = 0; i < points.length; i++) {
                        var obj = points[i];
                        var speed = +obj.s;
                        var newSpeed = _updateBaseSpeed(speed);
                        //角度抽稀优化处理
                        if(Math.abs(obj.c-angular)<=deviation){
                            var prev = points[i-1];
                            var next = points[i+1];
                            //突变因子：连续角度偏差大于指定值，速度与上一点保持在同一范围（0\40\80\120）
                            if(prev && next && Math.abs(prev.c-angular)<=deviation && Math.abs(next.c-angular)<=deviation && newSpeed.speed === baseSpeed){
                                //当路径变化在偏差范围之内，则忽略该点，进行下一次循环
                                continue;
                            }else{
                                angular = obj.c;
                            }
                        }else{
                            angular = obj.c;
                        }

                        //先放入之前的分段数组，保证连线不断
                        sameLevelPoints.push(obj);

                        //断档时处理
                        if( newSpeed.speed !== baseSpeed) {
                            if(sameLevelPoints.length){
                                stepPointsArray.push({speed: baseSpeed, color: baseColor, points:sameLevelPoints});
                            }
                            baseSpeed = newSpeed.speed;
                            baseColor = newSpeed.color;
                            sameLevelPoints = [];
                            sameLevelPoints.push(obj);
                        }
                        //循环结束时，将最后一个分阶数组放入
                        if(i==points.length-1 && sameLevelPoints.length){
                            stepPointsArray.push({speed:baseSpeed, color: baseColor, points:sameLevelPoints});
                        }
                    }

                    var count = 0;
                    omap.setViewport(self.points)
//                    debugger
                    omap.panBy(0, -128)
                    //按照分阶数组画线
                    let stepLen = stepPointsArray.length
                    if (stepLen > 0) {
                        let lastPtsLen = stepPointsArray[stepLen-1].points.length
                        self.fn_addTruck( stepPointsArray[0].points[0].lng, stepPointsArray[0].points[0].lat )
                        self.fn_addMarkerUser(stepPointsArray[0].points[0], 'first');
                        self.fn_addMarkerUser(stepPointsArray[stepLen-1].points[lastPtsLen-1], 'last');
                    }

                    for (var i = 0; i < stepPointsArray.length; i++) {
                        var obj = stepPointsArray[i];
                        var color = obj.color;
                        var points = [];
                        for (var j = 0; j < obj.points.length; j++) {
                            var p = obj.points[j];
                            var point =  new G7SMap.Point(p.lng, p.lat)
//                            var point = new BMap.Point(p.lng,p.lat);
                            points.push(point);
                        }
                        count = count+obj.points.length;

                        let polyline = new G7SMap.Polyline(points,
                                {
                                    strokeColor : color,
                                    strokeWeight : 5,
                                    showDir : true
                                }
                        );
                        omap.addOverlay(polyline);
                        if(arguments.length==2){
                            lineArray.push(polyline);
                        }
                    }
                }
            },
            setTruckPosition(cur) {
                if (cur >= this.ptsLen) {
                    return;
                }
                console.info(cur)
                let pt = this.points[cur]
                let angle = this.pts[cur].c


                marker.setPosition(pt)
                marker.setRotation(angle)

                this.makeCurVisible(cur)
            },
            initSlider(max) {
                let self = this
                //设置播放进度条
                $('#slider').noUiSlider({
                    animate: false,
                    start: [0],
                    connect: "lower",
                    step: 1,
                    range: {
                        'min': 0,
                        'max': max
                    }
                }, true).on({
                    change: function () {
                        if (self.sliderInfo.timer) {
                            clearInterval(self.sliderInfo.timer)
                        }
                        let cur = parseInt($("#slider").val())
                        self.jump( cur )
                    }
                });
            },
            initMap() {
                let self = this
                G7SMap.init({
                    id:'allmap',
                    verdor:'bmap',
                    showVendor: [],
                    zoom: 5,
                    zoomControl: {visible : true, position: 'TOP_RIGHT'},
                    center: [108.946781, 34.270311],//中国中心点坐标附近
                    mapTypeControl: false
                }).then(function(map) {
//                    debugger;
                    window.omap = map
                    window.gecoder = new G7SMap.Geocoder()



                    self.getPoints()
                });
            },
        }
    }
</script>
