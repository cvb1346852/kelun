var params = $ips.getUrlParams();
var data = params.data;
params.type = params.type ? params.type :'';
params.tender_act = params.tender_act ? params.tender_act :'';
$(function() {
    //默认时间设置
    //$('#package_time').daterangepicker({singleDatePicker: true,showDropdowns: true, timePicker: true, timePicker12Hour: false,format:'YYYY-MM-DD  HH:mm:ss',minDate:'2015-01-01',maxDate:'2050-12-30',timePickerIncrement:1});
    //$('#tender_limit').daterangepicker({singleDatePicker: true,showDropdowns: true, timePicker: true, timePicker12Hour: false,format:'YYYY-MM-DD  HH:mm:ss',minDate:'2015-01-01',maxDate:'2050-12-30',timePickerIncrement:1});
    $ips.load('motorcade_warehouse', 'search','', function(data) {
        $.each(data.result, function(k, v) {
            $("#push").append('<label class="checkbox" style="display: inline;"><input type="checkbox" class="checkbox style-0"  name="tender_push[motorcade][]" value="'+v.id+'"  id="'+v.id+'"/><span style="margin-right: 0px;vertical-align:baseline;"></span>'+v.name+' </label>');

        });
    });

    $("#carriage_type").select2({
        placeholder: "无要求",
        allowClear: true,
        multiple: false,
        minimumInputLength: 0,
        data:[{id:0,text:'enhancement'},{id:1,text:'bug'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}],
        query: function(query) {
            $ips.load('truck_source', 'getCarriageType', {name: query.term}, function(e) {
                var _pre_data = [];
                $.each(e, function(k, v) {
                    _pre_data.push({id: v.id, text: v.name});
                });
                var data = {results: _pre_data};
                query.callback(data);
            });
        }
    }).on("change",function(e){
        if(e.val == '3A9C031FF4FA1647EA164434E71996AD' || e.val == '9D2C4D484F78AF4827D5EB6A977A4F5E'){
            $("#temperature_requirement").show();
        }else{
            $("#temperature_from").val('');
            $("#temperature_to").val('');
            $("#temperature_requirement").hide();
        }
    });


    if (params.id) {
        $ips.load("tender", "checkTenderStatus", {'shipmentId': params.id}, function(data) {
            if(data){
                if(params.tender_act == 'edit'){
                    if(data.status != "2" || data.tender_status != "1"){
                        $ips.alert ('不能改标');
                        return false;
                    }
                    if(data.cooperate_type == 2){
                        $('#price').css({"display":"block"});
                        $('#price_type').css({"display":"none"});
                        $("#cooperate_type input:radio[name='cooperate_type']").eq(1).attr("checked",true);
                        $('#price input').val(data.price);
                    }else{
                        $('#price').css({"display":"none"});
                        $('#price_type').css({"display":"block"});
                        $("#cooperate_type input:radio[name='cooperate_type']").eq(0).attr("checked",true);
                        $('#price').val("");
                        if(data.price_type == "1"){
                            $("#price_type input:radio[name='price_type']").eq(1).attr("checked",true);
                        }
                        if(data.price_type == "2"){
                            $("#price_type input:radio[name='price_type']").eq(0).attr("checked",true);
                        }

                    }
                    if(data.car_length){
                        var str = data.car_length;
                        var strs= new Array(); //定义一数组
                        strs=str.split(",");
                        $("#car_length").val(strs[0]);
                        $("#car_length1").val(strs[1]);
                    }
                    if(data.carriage_type == '3A9C031FF4FA1647EA164434E71996AD' || data.carriage_type == '9D2C4D484F78AF4827D5EB6A977A4F5E'){
                        $("#temperature_requirement").show();
                        $("#temperature_from").val(data.temperature_from);
                        $("#temperature_to").val(data.temperature_to);
                    }else{
                        $("#temperature_requirement").hide();
                        $("#temperature_from").val("");
                        $("#temperature_to").val("");
                    }
                    if(data.carriage_type){
                        $ips.load('truck_source', 'getCarriageType', {id: data.carriage_type}, function(e) {
                            var _pre_data = [];
                            $.each(e, function(k, v) {
                                $(".select2-chosen").html(v.name);
                            });
                        });

                        $("#carriage_type").val(data.carriage_type);
                    }

                    $("#remark").val(data.remark);
                    $("#package_time").val(data.package_time);
                    $("#tender_limit").val(data.tender_limit);
                    //默认时间设置
                    $('#package_time').daterangepicker({singleDatePicker: true,showDropdowns: true, timePicker: true, timePicker12Hour: false,format:'YYYY-MM-DD  HH:mm:ss',minDate:'2015-01-01',maxDate:'2050-12-30',timePickerIncrement:1});
                    $('#tender_limit').daterangepicker({singleDatePicker: true,showDropdowns: true, timePicker: true, timePicker12Hour: false,format:'YYYY-MM-DD  HH:mm:ss',minDate:'2015-01-01',maxDate:'2050-12-30',timePickerIncrement:1});
                   // $("#frmInfo input[type='text']").attr("readonly",true);
                    $("input:radio").attr("disabled",true);
                    //$("#remark").attr("readonly",true);
                    //$("#frmInfo input[type='redio']").attr("disabled",true);

                    $("#package_time").attr("readonly",false);
                    $("#tender_limit").attr("readonly",false);
                    if(data.bidder_select!=""){
                        if(data.bidder_select.carrier == '1'){
                            $("input.checkbox[name='tender_push[carrier]']").attr("checked",true);
                        }
                        if(data.bidder_select.warehouse == '1'){
                            $("input.checkbox[name='tender_push[warehouse]']").attr("checked",true);
                        }
                        if(data.bidder_select.route == '1'){
                            $("input.checkbox[name='tender_push[route]']").attr("checked",true);
                        }
                        if(data.bidder_select.history == '1'){
                            $("input.checkbox[name='tender_push[history]']").attr("checked",true);
                        }
                        if(data.bidder_select.motorcade != '' && data.bidder_select.motorcade != null){
                            $.each(data.bidder_select.motorcade, function(k,v) {
                              $("input.checkbox[id='"+v+"']").attr("checked",true);
                            });
                        }

                    }
                }else{
                    if(data.status != '1'){
                        $("#btnSubmit").attr("disabled",true);
                        $ips.alert ('不能发标');
                        return false;
                    }
                    var now = new Date();
                    var date = new Date(now.getTime() +  5 * 3600 * 1000);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var hour = date.getHours();
                    var minute = date.getMinutes();
                    if(parseInt(minute)<9){
                        minute = "0"+minute;
                    }
                    var second = date.getSeconds();
                    $('#tender_limit').val(year + '-' + month + '-' + day  + ' ' + hour + ':'+minute+':00');
                    //装车时间
                    var date1 = new Date(now.getTime() +  8 * 3600 * 1000);
                    var year1 = date1.getFullYear();
                    var month1 = date1.getMonth() + 1;
                    var day1 = date1.getDate();
                    var hour1 = date1.getHours();
                    var minute1 = date1.getMinutes();
                    if(parseInt(minute1)<9){
                        minute1 = "0"+minute1;
                    }
                    $("#remark").val(data.s_remark);
                    var second1 = date1.getSeconds();
                    $('#package_time').val(year1 + '-' + month1 + '-' + day1  + ' ' + hour1 + ':'+minute1+':00');
                    //默认时间设置
                    $('#package_time').daterangepicker({singleDatePicker: true,showDropdowns: true, timePicker: true, timePicker12Hour: false,format:'YYYY-MM-DD  HH:mm:ss',minDate:'2015-01-01',maxDate:'2050-12-30',timePickerIncrement:1});
                    $('#tender_limit').daterangepicker({singleDatePicker: true,showDropdowns: true, timePicker: true, timePicker12Hour: false,format:'YYYY-MM-DD  HH:mm:ss',minDate:'2015-01-01',maxDate:'2050-12-30',timePickerIncrement:1});

                }
                $("#trans_type").html(data.shipment_method);
                $("#shipment_id").val(data.id);
                $("#shipment_code").val(data.shipment_code);
                $("#trans_type_post").val(data.shipment_method);
                $("#from_province").val(data.from_province);
                $("#from_city").val(data.from_city);
                $("#to_province").val(data.to_province);
                $("#to_city").val(data.to_city);
                $("#fromlocation").val(data.fromlocation);
                $("#tolocation").val(data.tolocation);
                $("#tender_act").val(params.tender_act);

                $ips.load('tender', 'searchTenderCarrier',{'trans_type': data.shipment_method}, function(data) {
                    $.each(data, function(k, v) {
                        if(k == 0){
                            $("#preview").append(v.carrier_name);
                        }
                        else{
                            $("#preview").append(','+v.carrier_name);
                        }
                    });
                });
            }
        });
    }
});


function save() {
    if(!$('#frmInfo').validate().form()) {
        return false;
    }
    var pa = $("#frmInfo").serializeArray();
    $ips.lockPage();
    $ips.load("tender", "saveTender", pa, function(result){
        $ips.unLockPage();
        $("#btnSubmit").attr("disabled",true);
        if(result.status == '0') {
            $ips.succeed("保存成功。");
            setTimeout(function(){jump()},1500);
        } else {
            $ips.error(result.message);
        }
    });
    return false;
}
/*取消操作*/
function jump(){
    $ips.locate("tender","index","data="+data);
}
//
$("#cooperate_type :radio").change(function(){
    if($(this).val() == 2){
        $('#price').css({"display":"block"});
        $('#price_type').css({"display":"none"});

    }
    else{
        $('#price').css({"display":"none"});
        $('#price_type').css({"display":"block"});
    }

});