var searchParams = new Array();
var deletedId = [];
var IDs = [];
var Sta = [];
var pageData = [];
var NowId ='';
//定义vue.data
var carrierInfo = {
    id:'',
    carrier_name:'',
    carrier_id:'',
    organizing_code:'',
    carrier_name_s:'',
    province:'',
    city:'',
    bidding:'',
    fixed_price:'',
    trans_type:'',
    is_invoice:'',
    invoice_rate:'',
    relation_person:'',
    relation_phone:'',
    fax:'',
    address:'',
    postcode:''
}

var carrier= '';
$(function() {
    //更多搜索条件按钮!
    var btnMoreSearch = $("#btnMoreSearch");
    btnMoreSearch.attr("state", "close");
    btnMoreSearch.click(function() {
        if (btnMoreSearch.attr("state") == "close") {
            $(".widget-body-toolbar").css("height", "auto");
            btnMoreSearch.text("收起条件");
            btnMoreSearch.attr("state", "open");
        } else {
            $(".widget-body-toolbar").css("height", "70");
            btnMoreSearch.text("更多条件");
            btnMoreSearch.attr("state", "close");
        }
    });

    // 搜索按钮
    $("#btnSearch").click(function() {
        searchParams = $("#frmSearch").serializeArray();
        deletedId = [];
        $('#tblMain').grid("fnPageChange","first");
    });

    BindCity("请选择");

    //新增承运商
    $("#editPage").click(function (){
        //carrier.data = carrierInfo;
        carrier.$set('id','');
        carrier.$set('carrier_name','');
        carrier.$set('carrier_id','');
        carrier.$set('organizing_code','');
        carrier.$set('carrier_name_s','');
        carrier.$set('province','');
        carrier.$set('city','');
        carrier.$set('is_invoice','');
        carrier.$set('invoice_rate','');
        carrier.$set('relation_person','');
        carrier.$set('relation_phone','');
        carrier.$set('fax','');
        carrier.$set('address','');
        carrier.$set('postcode','');
        carrier.$set('bidding','');
        carrier.$set('fixed_price','');
        carrier.$set('carload','');
        carrier.$set('break_bulk','');
        $("#bidding").prop('checked',false);
        $("#fixed_price").prop('checked',false);
        $("#carload").prop('checked',false);
        $("#break_bulk").prop('checked',false);
        $('#short').prop('checked', false);
        $('#air').prop('checked', false);
        $('#container').prop('checked', false);
        $('#wateway').prop('checked', false);
        $('#landSea').prop('checked', false);
        $('#addCarrier').modal('show');
    });

    //关联承运商
    $("#showConnectCarrier").click(function (){
        $("#bidding2").prop('checked',false);
        $("#fixed_price2").prop('checked',false);
        $("#carload2").prop('checked',false);
        $("#break_bulk2").prop('checked',false);
        $('#short2').prop('checked', false);
        $('#air2').prop('checked', false);
        $('#container2').prop('checked', false);
        $('#wateway2').prop('checked', false);
        $('#landSea2').prop('checked', false);
        $("#carrier").val("");
        //加载承运商选择框
        //加载承运商
        $("#carrier").select2({
            placeholder: "请选择承运商",
            minimumInputLength: 2,
            multiple: false,
            allowClear: true,
            // 数据加载
            query: function(e) {
                $ips.load('carrier', 'getAllCarrier',{carrier:e.term},function(data) {
                    var item=[];
                    $.each(data,function(x,y){
                        item.push({id: y.id, text: y.carrier_name });
                    });
                    var result = {results: item};
                    e.callback(result);
                });
            }
        });
        $('#connectCarrier').modal('show');
    });

    //加载承运商
    $("#carrier").select2({
        placeholder: "请选择承运商",
        minimumInputLength: 2,
        multiple: false,
        allowClear: true,
        // 数据加载
        query: function(e) {
            $ips.load('carrier', 'getAllCarrier',{carrier:e.term},function(data) {
                var item=[];
                $.each(data,function(x,y){
                    item.push({id: y.id, text: y.carrier_name });
                });
                var result = {results: item};
                e.callback(result);
            });
        }
    });
});
//初始化Vue
loadScript("js/libs/vue.min.js",function(){

    carrier = new Vue({
        el:"#addCarrier_form",
        data:carrierInfo,
        methods:{
            saveCarrier:function(){
                if(this._data.carrier_name == ''){
                    $ips.error('承运商名称必填');
                    return false;
                }
                if(this._data.organizing_code == ''){
                    $ips.error('社会信用代码必填');
                    return false;
                }
                if(this._data.carrier_name_s == ''){
                    $ips.error('公司简称必填');
                    return false;
                }

                var trans_type = '';
                $.each($(".transType input[type='checkbox']"),function(i){
                    var one = $(".transType input[type='checkbox']")[i];
                    if($(one).is(':checked')){
                        if(trans_type == ''){
                            trans_type += $(one).val();
                        }else{
                            trans_type += ','+$(one).val();
                        }
                    }
                })
                if(trans_type == ''){
                    $ips.error('请选择运输业务类型')
                    return false;
                }else{
                    this._data.trans_type = trans_type;
                }

                if(!$("#bidding").is(':checked') && !$("#fixed_price").is(':checked')){
                    $ips.error('请选择公司合作模式')
                    return false;
                }else{
                    if($("#bidding").is(':checked')){
                        this._data.bidding = 1;
                    }else{
                        this._data.bidding = 0;
                    }
                    if($("#fixed_price").is(':checked')){
                        this._data.fixed_price = 1
                    }else{
                        this._data.fixed_price = 0;
                    }
                }

                if($('#ddlProvince').val() == ''){
                    $ips.error('请选择所在省/市');
                    return false;
                }else{
                    this._data.province = $('#ddlProvince').val();
                }
                if($('#ddlCity').val() == ''){
                    $ips.error('请选择所在市/区');
                    return false;
                }else{
                    this._data.city = $('#ddlCity').val();
                }

                if(this._data.invoice_rate == ''){
                    $ips.error('票点数必填');
                    return false;
                }
                if(parseInt(this._data.invoice_rate) >100 || parseInt(this._data.invoice_rate) <=0){
                    $ips.error('请正确填写开票点数 0-100')
                    return false;
                }
                if(parseInt(this._data.real_invoice_rate) >100 || parseInt(this._data.real_invoice_rate) <=0){
                    $ips.error('请正确填写开票点数 0-100')
                    return false;
                }
                if(this._data.relation_person == ''){
                    $ips.error('业务联系人必填');
                    return false;
                }
                if(this._data.real_invoice_rate == ''){
                    $ips.error('开票点数必填');
                    return false;
                }
                if(this._data.relation_phone == ''){
                    $ips.error('联系人手机号必填');
                    return false;
                }else if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i.test(this._data.relation_phone)){
                    $ips.error('手机号为微信车车招标登陆凭证，请正确填写');
                    return false;
                }
                    $ips.lockPage();
                    $("#updateCarrier").attr("disabled",true);
                    $ips.load('carrier','save',this._data,function(e){
                        $("#updateCarrier").attr("disabled",false);
                        $ips.unLockPage();
                        if(e.code == 0){
                            $ips.succeed('承运商保存成功')
                            $('#addCarrier').modal('hide');
                            $('#tblMain').dataTable().fnDraw();
                        }else{
                            $ips.error('保存失败'+e.message);
                        }
                    });
                
                
            }
        }
    });
});

function getRowIds() {
    var id = '';
    $('#tblMain input:checkbox[class="checkbox style-0"]:checked').each(function() {
        if(id==""){
            id += $(this).val();
        }else{
            id += ',' + $(this).val();
        }
    });
    return id;
}

function del() {
    var id = getRowIds();
    if(!id || id == ''){
        $ips.alert('请选择删除项');
        return false;
    }
    var ids = id.split(',');
    $ips.confirm("您确定要删除这"+ids.length+"条记录吗?",function(btn) {
        if (btn == "确定") {
            $ips.lockPage();
            $ips.load("carrier", "del", "id=" + id, function(result){
                $ips.unLockPage();
                if(result) {
                    $ips.succeed("操作成功！");
                    $('#tblMain').dataTable().fnDraw();
                } else {
                    $ips.error("操作失败！");
                }
            });
        }
    });
}

//获取选中的id
function edit() {
    var id = getRowIds();
    if(!id || id == ''){
        $ips.alert('请选择修改项');
        return false;
    }
    $ips.load('carrier','getById',{id:id},function(data){
        if(data) {
            carrier.$set('id',data.id);
            carrier.$set('carrier_name',data.carrier_name);
            carrier.$set('carrier_id',data.carrier_id);
            carrier.$set('organizing_code',data.organizing_code);
            carrier.$set('carrier_name_s',data.carrier_name_s);
            carrier.$set('province',data.province);
            carrier.$set('city',data.city);
            carrier.$set('is_invoice',data.is_invoice);
            carrier.$set('invoice_rate',data.invoice_rate);
            carrier.$set('real_invoice_rate',data.real_invoice_rate == '0.0'? '': data.real_invoice_rate);
            carrier.$set('relation_person',data.relation_person);
            carrier.$set('relation_phone',data.relation_phone);
            carrier.$set('fax',data.relation_fax);
            carrier.$set('address',data.relation_address);
            carrier.$set('postcode',data.relation_post);
            BindCity(data.city);
            if(data.trans_type_a) {
                if (data.trans_type_a.indexOf('整车') > -1) {
                    $('#carload').prop('checked', 'checked');
                }else{
                    $('#carload').removeAttr('checked');
                }
                if (data.trans_type_a.indexOf('零担') > -1) {
                    $('#break_bulk').prop('checked', 'checked');
                }else{
                    $('#break_bulk').removeAttr('checked');
                }
                if (data.trans_type_a.indexOf('短转运输') > -1) {
                    $('#short').prop('checked', 'checked');
                }else{
                    $('#short').removeAttr('checked');
                }
                if (data.trans_type_a.indexOf('航空快件') > -1) {
                    $('#air').prop('checked', 'checked');
                }else{
                    $('#air').removeAttr('checked');
                }
                if (data.trans_type_a.indexOf('集装箱') > -1) {
                    $('#container').prop('checked', 'checked');
                }else{
                    $('#container').removeAttr('checked');
                }
                if (data.trans_type_a.indexOf('水路') > -1) {
                    $('#wateway').prop('checked', 'checked');
                }else{
                    $('#wateway').removeAttr('checked');
                }
                if (data.trans_type_a.indexOf('海路') > -1) {
                    $('#landSea').prop('checked', 'checked');
                }else{
                    $('#landSea').removeAttr('checked');
                }
            }
            $('#bidding').removeAttr('checked');
            $('#fixed_price').removeAttr('checked');
            if(parseInt(data.cooperate_type_a) ==1){
                $('#bidding').prop('checked', 'checked');
            }else if(parseInt(data.cooperate_type_a) ==2){
                $('#fixed_price').prop('checked', 'checked');
            }else{
                $('#bidding').prop('checked', 'checked');
                $('#fixed_price').prop('checked', 'checked');
            }
            $('#addCarrier').modal('show');
        }else{
            $ips.error('获取承运商信息失败');
        }
    });
}


/*function assess() {
    var id = getRowIds();
    if(!id || id == ''){
        $ips.error('请选择操作项');
        return false;
    }
    var ids = id.split(',');
    if(ids.length>1){
        $ips.error('只能选择一个');
        return false;
    }
    /!*if(!Sta[id] || Sta[id]==3) {
        $ips.error('不能重复审核');
        return false;
    }*!/
    NowId = id;
    $("#remarkListModal").modal('show');
}*/
//审核操作
function assess() {
    var id = getRowIds();
    if(!id || id == ''){
        $ips.error('请选择操作项');
        return false;
    }
    var ids = id.split(',');
    if(ids.length>1){
        $ips.error('只能选择一个');
        return false;
    }
    NowId = id;
    $ips.locatesubsystem("project/carrier/alter.html?id="+NowId,false);
}

function change(l) {
    var type = 2;
    if(l) type = 3;
    $ips.load("carrier", "agree",{'id':NowId,'type':type}, function(result){
        if(result) {
            $ips.succeed('操作成功');
            $('#tblMain').dataTable().fnDraw();
        } else {
            $ips.error("操作失败！");
        }
    });
}
//加载电话选择框
$("#motorcade1").select2({
    placeholder: "选择车队",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('warehouse', 'getMotorcade',{name: e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: y.name, text: y.name });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});

//加载承运商选择框
$("#carrier_id").select2({
    placeholder: "选择承运商",
    minimumInputLength: 1,
    multiple: false,
    allowClear: true,
    // 数据加载
    query: function(e) {
        $ips.load('warehouse', 'getSearchCondition',{name: 'carrier_id', value: e.term},function(data) {
            var item=[];
            $.each(data,function(x,y){
                item.push({id: x, text: y });
            });
            var data = {results: item};
            e.callback(data);
        });
    }
});
function G7Set() {
    var id = getRowIds();
    if(!id || id == ''){
        $ips.alert('请选择操作项');
        return false;
    }
    var ids = id.split(',');
    if(ids.length>1){
        $ips.alert('只能选择一个');
        return false;
    }
    NowId = id;
    $('#g7s_orgcode').val(pageData[id].g7s_orgcode);
    /*$('#app_key').val(pageData[id].app_key);
    $('#app_secret').val(pageData[id].app_secret);*/
    $("#remarkListModal1").modal('show');
}


function G7Set_s() {
    if(!IDs[NowId]) {
        $ips.alert('数据异常');
        return false;
    }
    if($('#g7s_orgcode').val() == '' || $('#app_key').val() =='' || $('#app_secret').val() ==''){
        $ips.error('请完成必填项填写');
        return false;
    }
    var params = {
        'id':IDs[NowId],
        'g7s_orgcode':$('#g7s_orgcode').val(),
        /*'app_key':$('#app_key').val(),
        'app_secret':$('#app_secret').val(),*/
    };
    $ips.load("carrier", "G7Set",params, function(result){
        if(result) {
            $ips.succeed('操作成功');
            $("#remarkListModal1").modal('hide');
            $('#tblMain').dataTable().fnDraw();
        } else {
            $ips.error("操作失败！");
        }
    });
}

//管理承运商保存
function saveConnection(){
    var carrier_id = $('#carrier').val();
    var pa = $("#frmInfo").serializeArray();
    pa.push({'name':'carrier_id','value':carrier_id});

    if(!$("#bidding2").is(':checked') && !$("#fixed_price2").is(':checked')){
        $ips.error('请选择公司合作模式')
        return false;
    }else{
        if($("#bidding2").is(':checked')){
            var bidding = 1;
        }else{
            var bidding = 0;
        }
        if($("#fixed_price2").is(':checked')){
            var fixed_price = 1
        }else{
            var fixed_price = 0;
        }
    }
    pa.push({name:'bidding','value':bidding});
    pa.push({name:'fixed_price','value':fixed_price});

    var trans_type = '';
    $.each($(".transType input[type='checkbox']"),function(i){
        var one = $(".transType input[type='checkbox']")[i];
        if($(one).is(':checked')){
            if(trans_type == ''){
                trans_type += $(one).val();
            }else{
                trans_type += ','+$(one).val();
            }
        }
    })
    if(trans_type == ''){
        $ips.error('请选择运输业务类型')
        return false;
    }else{
        pa.push({name:'trans_type','value':trans_type});
    }

    $ips.lockPage();
    $ips.load('carrier','saveConnection',pa,function(result){
        $ips.unLockPage();
        if(result.code == 0){
            $("#connectCarrier").modal('hide');
            $('#tblMain').dataTable().fnDraw();
            $ips.succeed('关联承运商操作成功！');
        }else{
            $ips.error(result.message);
        }
    });
}

// 表格
function runDataTables() {
    $('#tblMain').grid({
        "fixedHeader":{ isOpen:true},
        "fnServerData" : function(sSource, aoData, fnCallback) {
            $ips.gridLoadData(sSource, aoData, fnCallback, "carrier", "search", searchParams, function(pager) {
                pager.result = pager.result ? pager.result : [];
                $.each(pager.result, function(i, item) {
                    IDs[item.id]=item.carrier_id;
                    Sta[item.id]=item.status;
                    pageData[item.id]=item;
                    item.idCheckbox = '<label class="checkbox"><input id="' + item.id + '" type="checkbox" name="checkbox-inline" value="'+item.id+'" class="checkbox style-0"><span></span></label>';
                    item.check_status = item.check_status == 0 ? '未审核' : ( item.check_status == 2 ? '未通过' : '通过');
                    item.is_invoice = item.is_invoice    == 1 ? '允许' : '不允许';
                    item.invoice_rate = item.invoice_rate ? item.invoice_rate+'%' : '--' ;
                    item.real_invoice_rate = (item.real_invoice_rate == '0.0' ||item.real_invoice_rate == null)  ? '--' : item.real_invoice_rate+'%' ;
                    item.name = item.name ? item.name : '' ;
                });
            });
        },
        "aoColumns" : [
            {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
            {sTitle: "承运商名称", sName: "carrier_name","bSortable": false},
            {sTitle: "运输类型", sName: "trans_type","bSortable": false},
            {sTitle: "审核状态", sName: "check_status","bSortable": false},
            {sTitle: "社会信用代码 ", sName: "organizing_code","bSortable": false},
            {sTitle: "所在省 ", sName: "province","bSortable": false},
            {sTitle: "所在市", sName: "city","bSortable": false},
            {sTitle: "代开票", sName: "is_invoice","bSortable": false},
            {sTitle: "开票点数", sName: "real_invoice_rate","bSortable": false},
            {sTitle: "税点", sName: "invoice_rate","bSortable": false},
            {sTitle: "G7机构编号", sName: "g7s_orgcode","bSortable": false},
            {sTitle: "业务联系人", sName: "relation_person","bSortable": false},
            {sTitle: "联系人手机号", sName: "relation_phone","bSortable": false},
            {sTitle: "注册时间", sName: "create_time","bSortable": false},
            {sTitle: "审核机构", sName: "name","bSortable": false}
        ]
    });
}

loadScript('js/hui/jquery.hui.grid.js',runDataTables);

//导出按钮
loadScript('js/hui/jquery.hui.exportdata.js', function () {
    $('#export').exportdata({dataModule : 'carrier',dataMethod:'search',searchForm: '#frmSearch',title:'承运商列表',partDataRows:10000,partSize:100});
},true,true);


//设置默认结算承运商
function setDefaultCarrier(){
    $ips.load("carrier", "carrierCheck",'', function(result){
        var carrier_name='';
        if(result){
            carrier_name=result.carrier_name
        }else{
            carrier_name='请选择承运商';
        }
        //加载承运商选择框
        $("#default_carrier").select2({
            placeholder: carrier_name,
            minimumInputLength:2,
            multiple: false,
            allowClear: true,
            // 数据加载
            query: function(e) {
                $ips.load('carrier', 'getCarriers',{'postname':e.term},function(data) {
                    var item=[];
                    $.each(data,function(x,y){
                        item.push({id: y.carrier_name, text: y.carrier_name });
                    });
                    var data = {results: item};
                    e.callback(data);
                });
            }
        }).on("select2-removed", function() {
        });
        $("#remarkListModalc").modal('show');
        $("#default_carrier").select2("data", {id:result.carrier_name, text:result.carrier_name});
    });
   
}

function changeCarrier() {
    var default_carrier=$('#default_carrier').val();
   $ips.load("carrier", "setDefauleCarrier",{'default_carrier':default_carrier}, function(result){
       if(result) {
           $ips.succeed('操作成功');
           $('#tblMain').dataTable().fnDraw();
       } else {
           $ips.error("操作失败！");
       }
   });
}
