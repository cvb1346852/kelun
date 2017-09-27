var params = $ips.getUrlParams();
var btnMoreSearch = $("#btnMoreSearch");
var userinfo = $ips.getCurrentUser();
var userRole = '';

//获取废标报表页面
//设置时间范围
function set_time_range(){
    var returntimes = moment().subtract(0, 'days').format('L')+' 00:00'+' - '+moment().format('L')+' 23:59';
    return returntimes;
}
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
//加载运单号选择框
$("#status").select2({
    placeholder: "选择状态",
    minimumInputLength: 0,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        var item=[{id:'1', text: '竞标中'},{id:'2,3', text: '已评标'},{id:'4,5', text:'废标'}];
        var data = {results: item};
        e.callback(data);
    }
});
$("#status").select2("data", {id:'1', text: '竞标中'});

//加载承运商选择框
$("#warehouse_name").select2({
    placeholder: "选择基地",
    minimumInputLength: 0,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('tender', 'getWareHouse',{warehouse_name: e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.id, text: y.name });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});

$("#btnSearch").click(function() {
    $('#tblMain').grid("fnPageChange", "first");
});
// 表格
loadScript("/js/hui/jquery.hui.grid.js",function(){
    $("#tblMain").grid({
        "aoColumns":[
            {sTitle: "操作", sName: "idAction","bSortable": false},
            {sTitle: "单号", sName: "shipment_code","bSortable": false},
            {sTitle: "状态", sName: "status","bSortable": false},
            {sTitle: "投标价格", sName: "quote_price","bSortable": false},
            {sTitle: "报价方式", sName: "price_type","bSortable": false},
            {sTitle: "竞标截止时间", sName: "tender_limit","bSortable": false},
            {sTitle: "要求到场时间", sName: "package_time","bSortable": false},
            {sTitle: "车长要求", sName: "car_length","bSortable": false},
            {sTitle: "箱型要求", sName: "carriage_type","bSortable": false},
            {sTitle: "重量", sName: "weight","bSortable": false},
            {sTitle: "体积", sName: "volume","bSortable": false},
            {sTitle: "件数", sName: "quality","bSortable": false},
            {sTitle: "出发地", sName: "fromlocation","bSortable": false},
            {sTitle: "目的地", sName: "tolocation","bSortable": false},
            {sTitle: "运输方式", sName: "shipment_method","bSortable": false}

        ],
        "fnServerData":function(sSource,aoData,fnCallback){
            var searchParams = $("#frmSearch").serializeArray();
            $ips.gridLoadData(sSource,aoData,fnCallback,"tender","getBidTenderList",searchParams,function(data){
                if(data.result){
                    $.each(data.result, function(i, item) {
                        item.idAction = '<label class="checkbox"><input id="'+item.id+'_'+item.s_id+'" type="checkbox" name="checkbox-inline" value="'+item.id+'_'+item.s_id+'" class="checkbox style-0"><span></span></label>';
                        /*item.idAction = '<a href="javascript:void(0);"  onclick="Show(\'' + item.id + '\')">查看</a>';*/
                        if(item.status==1){
                            data.result[i].status='竞标中';
                        }else if(item.status==2||item.status==3){
                            data.result[i].status='已评标';
                        }else if(item.status==4||item.status==5){
                           data.result[i].status='废标'; 
                        }
                        if(item.price_type==1){
                            data.result[i].price_type='整车报价';
                        }else if(item.price_type==2){
                            data.result[i].price_type='每吨报价';
                        }
                        if(item.carriage_type==null || item.carriage_type==''){
                            data.result[i].carriage_type='无要求';
                        }
                        if(item.car_length==null || item.car_length=='' || item.car_length=='-'){
                            data.result[i].car_length='无要求';
                        }

                    });
                }
            });
        },
        "fnDrawCallback" : function() {
            },
    });
});

function getRowId() {
    var id = $('#tblMain input:checkbox[class="checkbox style-0"]:checked').val();
    return id;
}
//报价弹框
$('#tender_msg').on('click',function(){
    $('#order_msg').html('');
    $('#remark').html('');
    $('#price_type').html('');
    $('#quote_price').val('');
    $('#history_qoute').html('');
    var id=getRowId();
    $ips.load("tender", "getTenderMsg",{id:id}, function(data){
        if(data.orderMsg){
            var html='';
            $.each(data.orderMsg, function(i, item) {
                html+='<section class="col col-8">';
                html+='<label class="select">';
                html+=item.fromlocation+'-'+item.tolocation+'&nbsp;&nbsp;'+item.weight+'吨'+'&nbsp;&nbsp;'+item.volume+'方'+'&nbsp;&nbsp;'+item.quality+'件';
                html+='</label>';
                html+='</section>';
            });
            $('#order_msg').html(html);
        }
        if(data.history_qoute){
                html='';
            $.each(data.history_qoute, function(i, item) {
                html+='<section class="col col-8">';
                html+='<label class="select">';
                html+=item.create_time+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+item.quote_price+'元';
                html+='</label>';
                html+='</section>';
            });
            $('#history_qoute').html(html);
        }
        if(data.remark==null || data.remark==''){
            data.remark="无备注";
        }
        if(data.price_type==1){
            $('#price_type').html('按整车');
        }else if(data.price_type==2){
            $('#price_type').html('按每吨');
        }
        $('#remark').html(data.remark);
    });
    $('#quote_remark').val('');
    $('#tender_quote_table').modal(); 
});
//添加报价按钮
function save(){
    var id=getRowId();
    var quote_price=$('#quote_price').val();
    var quote_remark=$('#quote_remark').val();
    if(quote_price==''){
        $ips.error("报价不能为空！");
        return false;
    }

    $ips.load("tender", "checkQoute",{id:id}, function(json){
        if(!jQuery.isEmptyObject(json)){
            $ips.confirm("重复报价会作废之前的报价!",function(btn) {
                if (btn == "确定") {
                    $ips.lockPage();
                    $ips.load("tender", "addCarrierQuote",{id:id,quote_price:quote_price,quote_remark:quote_remark}, function(data){
                        $ips.unLockPage();
                        if(data.code==0){
                                $ips.succeed(data.msg);
                                $('#tender_quote_table').modal('hide');
                                $('#tblMain').grid("fnPageChange", "first");
                            }else if(data.code==1){
                                $ips.error(data.msg);
                                $('#tender_quote_table').modal('hide');
                                $('#tblMain').grid("fnPageChange", "first");
                            }else if(data.code==2){
                               $ips.error(data.msg);
                               $('#tender_quote_table').modal('hide');
                               $('#tblMain').grid("fnPageChange", "first");
                            }
                    });
                }
            });
            
        }else{
            $('#tender_quote_table').modal('hide');
            addCarrierQuote(id,quote_price,quote_remark);
        }
    });
}
//添加报价
function addCarrierQuote(id,quote_price,quote_remark){
    $ips.load("tender", "addCarrierQuote",{id:id,quote_price:quote_price,quote_remark:quote_remark}, function(data){
        if(data.code==0){
                $ips.succeed(data.msg);
                $('#tblMain').grid("fnPageChange", "first");
            }else if(data.code==1){
                $ips.error(data.msg);
                $('#tblMain').grid("fnPageChange", "first");
            }else if(data.code==2){
               $ips.error(data.msg);
               $('#tblMain').grid("fnPageChange", "first");
            }
    });
}

var settime=''
//30面自动刷新
$('#check_check').change(function(){
    if($('#check_check').is(':checked')){
        setTime = setTimeout('refresh()',30000);
    }else{
        clearTimeout(settime);
    }
});


function refresh(){
    setTime=setTimeout('refresh()',30000);
    $('#tblMain').grid("fnPageChange", "first");
}