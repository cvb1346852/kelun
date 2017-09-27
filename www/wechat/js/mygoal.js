// app.title = '坐标轴刻度与标签对齐';
var jdata;
var gradeArr;
$.getUserInfo('consign',0,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type != 3 && userInfo.user_type != 4 ){
        $("#about").hide();
        $.alert("获取用户信息失败");
        return false;
    }else{
        getTrucks(userInfo.phone, userInfo.user_type, openid);
    }
});

function getTrucks(phone,type,openid) {
    //第一页先清除内容
    $.sendData('tender', 'getSignMsg_wechat', {openid: openid,user_type:type,phone:phone}, '', function(data){
        if(data.code == 0){
            jdata = data.data;
            gradeArr = jdata.gradeArr;
        }else{
            jdata = [];
            $.alert("暂无相关数据");
        }
        var html = '';
        for(var i =0;i<5;i++){
            if(jdata.total_grade - i > 0){
                if(jdata.total_grade - i < 1){
                    html += '<span class="half-star"><i class="c-iconfont"></i><span class="half-mark"><i class="c-iconfont "></i></span></span>';
                }else{
                    html += '<i class="c-iconfont"></i>';
                }
            }else{
                html += '<i class="c-iconfont gray-star"></i>';
            }
        }
        _templete();
        $("#iconfont").html(html);
    });
};


function _templete(){

    var _listhtml = _.template($('#join-tmpl').html())();
    $('.container').html(_listhtml);
    if(parseInt(jdata.total_grade) == 0){
        gradeArr = {'1':'0','2':'0','3':'0','4':'0','5':'0'};
    }
        eachat();
}

function eachat(){

    var myChart = echarts.init(document.getElementById('main'));


    var option = {
        color: ['#ff9234'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ['5星', '4星', '3星', '2星', '1星'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'评定次数',
                type:'bar',
                barWidth: '60%',
                data:[gradeArr[5], gradeArr[4], gradeArr[3], gradeArr[2], gradeArr[1]]
            }
        ]
    };

    myChart.setOption(option);
}