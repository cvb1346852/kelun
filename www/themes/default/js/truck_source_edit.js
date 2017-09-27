var params = $ips.getUrlParams();
params.type = params.type ? params.type :'';
$(function() {
    //道路许可证附件
    $('#idcardattach').hide();
    var m = $('#idcardattach').closest('label');
    m.empty();
    $('<a href="">上传</a>').attr({
        'data-toggle': 'modal',
        'data-target': '#idcard_modal'
    }).addClass('btn btn-sm btn-link').bind('click', function() {
        $('#idcardfile').val('');
    }).appendTo(m);

    $('#idcardattach2').hide();
    var m = $('#idcardattach2').closest('label');
    m.empty();
    $('<a href="">上传</a>').attr({
        'data-toggle': 'modal',
        'data-target': '#idcard_modal2'
    }).addClass('btn btn-sm btn-link').bind('click', function() {
        $('#idcardfile2').val('');
    }).appendTo(m);

    $('#idcardattach3').hide();
    var m = $('#idcardattach3').closest('label');
    m.empty();
    $('<a href="">上传</a>').attr({
        'data-toggle': 'modal',
        'data-target': '#idcard_modal3'
    }).addClass('btn btn-sm btn-link').bind('click', function() {
        $('#idcardfile3').val('');
    }).appendTo(m);

    $('#idcardattach4').hide();
    var m = $('#idcardattach4').closest('label');
    m.empty();
    $('<a href="">上传</a>').attr({
        'data-toggle': 'modal',
        'data-target': '#idcard_modal4'
    }).addClass('btn btn-sm btn-link').bind('click', function() {
        $('#idcardfile4').val('');
    }).appendTo(m);

    $('#idcardattach5').hide();
    var m = $('#idcardattach5').closest('label');
    m.empty();
    $('<a href="">上传</a>').attr({
        'data-toggle': 'modal',
        'data-target': '#idcard_modal5'
    }).addClass('btn btn-sm btn-link').bind('click', function() {
        $('#idcardfile5').val('');
    }).appendTo(m);

    $('#idcardattach6').hide();
    var m = $('#idcardattach6').closest('label');
    m.empty();
    $('<a href="">上传</a>').attr({
        'data-toggle': 'modal',
        'data-target': '#idcard_modal6'
    }).addClass('btn btn-sm btn-link').bind('click', function() {
        $('#idcardfile6').val('');
    }).appendTo(m);

    $("#carriage_type").select2({
        placeholder: "厢型",
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
    }).on("select2-removed", function() {
    }).on("select2-selecting", function(f) {
        $("#carriage_type").val(f.object.id);
    });


    $('#in_date').daterangepicker({singleDatePicker: true,showDropdowns: true,startDate:moment().add('h', 0), format:'YYYY-MM-DD',minDate:'2000-01-01',maxDate:'2050-12-30'});
    $('#drive_cert_in_date').daterangepicker({singleDatePicker: true,showDropdowns: true,startDate:moment().add('h', 0),format:'YYYY-MM-DD',minDate:'2000-01-01',maxDate:'2050-12-30'});
    $('#health_date').daterangepicker({singleDatePicker: true,showDropdowns: true,startDate:moment().add('h', 0),format:'YYYY-MM-DD',minDate:'2000-01-01',maxDate:'2050-12-30'});
    $('#operate_date').daterangepicker({singleDatePicker: true,showDropdowns: true,startDate:moment().add('h', 0),format:'YYYY-MM-DD',minDate:'2000-01-01',maxDate:'2050-12-30'});
    $('#operate_date2').daterangepicker({singleDatePicker: true,showDropdowns: true,startDate:moment().add('h', 0),format:'YYYY-MM-DD',minDate:'2000-01-01',maxDate:'2050-12-30'});
    $('#operate_annual').daterangepicker({singleDatePicker: true,showDropdowns: true,startDate:moment().add('h', 0),format:'YYYY-MM-DD',minDate:'2000-01-01',maxDate:'2050-12-30'});
    $('#operate_in_date').daterangepicker({singleDatePicker: true,showDropdowns: true,startDate:moment().add('h', 0),format:'YYYY-MM-DD',minDate:'2000-01-01',maxDate:'2050-12-30'});
    $('#security_business').daterangepicker({singleDatePicker: true,showDropdowns: true,startDate:moment().add('h', 0),format:'YYYY-MM-DD',minDate:'2000-01-01',maxDate:'2050-12-30'});
    $('#security_traffic').daterangepicker({singleDatePicker: true,showDropdowns: true,startDate:moment().add('h', 0),format:'YYYY-MM-DD',minDate:'2000-01-01',maxDate:'2050-12-30'});
    $('#security_third_date').daterangepicker({singleDatePicker: true,showDropdowns: true,startDate:moment().add('h', 0),format:'YYYY-MM-DD',minDate:'2000-01-01',maxDate:'2050-12-30'});
    $('#security_shipment_date').daterangepicker({singleDatePicker: true,showDropdowns: true,startDate:moment().add('h', 0),format:'YYYY-MM-DD',minDate:'2000-01-01',maxDate:'2050-12-30'});
    /*初始化时间 赋值为当前时间*/
    $('#in_date').val(moment().format('L'));
    $('#drive_cert_in_date').val(moment().format('L'));
    $('#health_date').val(moment().format('L'));
    $('#operate_date').val(moment().format('L'));
    $('#operate_date2').val(moment().format('L'));
    $('#operate_annual').val(moment().format('L'));
    $('#operate_in_date').val(moment().format('L'));
    $('#security_business').val(moment().format('L'));
    $('#security_traffic').val(moment().format('L'));
    $('#security_third_date').val(moment().format('L'));
    $('#security_shipment_date').val(moment().format('L'));
    if (params.id) {
        $ips.load("truck_source", "getById", {'id': params.id}, function(data) {
            if(data){
                $ips.fillFormInput("frmInfo", data);
                $("#carriage_type").select2("data", {id:data.carriage_type, text:data.carriage_type_name});
                if (data.from == 2 || params.type =='all')  $('#save_type').hide();
                //显示已上传附件
                if (data.id_card_file != '' && data.id_card_file != undefined) {
                    extenttips(false, '#idcardattachurl', '#idcardattach_tip');
                }
                if (data.license_file != '' && data.license_file != undefined) {
                    extenttips(false, '#idcardattachurl2', '#idcardattach_tip2');
                }
                if (data.drive_cert_file != '' && data.drive_cert_file != undefined) {
                    extenttips(false, '#idcardattachurl3', '#idcardattach_tip3');
                }
                if (data.run_file != '' && data.run_file != undefined) {
                    extenttips(false, '#idcardattachurl4', '#idcardattach_tip4');
                }
                if (data.operate_file != '' && data.operate_file != undefined) {
                    extenttips(false, '#idcardattachurl5', '#idcardattach_tip5');
                }
                if (data.security_file != '' && data.security_file != undefined) {
                    extenttips(false, '#idcardattachurl6', '#idcardattach_tip6');
                }
                showGPSNO();                
            }
        });
    }

    $('#callback').on('click',function(){
        history.go(-1);
    })

    showGPSNO();
    $("#type").change(function(){
        showGPSNO();
    });

    if(params.affiliated){
        $('.self').css({"display":"none"});
    }

});


function save() {
    /*判断身份证号码是否规范*/
    if($('#id_card').val()){
        if(!/(^\d{15}$)|(^\d{17}(\d|X)$)/.test($('#id_card').val()))
        {
            $ips.error("身份证号码格式不正确");
            return false;
        }
    }else{
        $ips.error("身份证号码不能为空");
        return false;
    };
    if(!$('#frmInfo').validate().form()) {
        return false;
    }
    var pa = $("#frmInfo").serializeArray();
    if (params.id) {
        pa.push({'name':'id','value':params.id});
    }
    if (params.affiliated) {
        pa.push({'name':'affiliated','value':params.affiliated});
    }
    pa.push({'name':'is_crrierAddTruce','value':true});
    $ips.lockPage();
    $ips.load("truck_source", "save", pa, function(result){
        $ips.unLockPage();
        if(result.code == 0) {
            $ips.succeed("保存成功。");
            setTimeout("gotolist()",1500);
        } else {
            $ips.error( result.message);
        }
    });
}

function gotolist(){
    $ips.locate("truck_source","index");
}
loadScript("js/plugin/jquery-form/jquery-form.min.js", '');
loadScript('/js/poshytip/jquery.poshytip.min.js','');
loadScript('js/hui/jquery.hui.upload.js', uploadFile);
//上传附件
function uploadFile() {
    //身份证上传
    $('#idcardfile').upload({
        module: 'import',
        method: 'uploadImage',
        onSuccess: function(data) {
            if($('#idcardattachurl').val()){
                var already_i = true;
            }else{
                already_i = false;
            }
            $('#idcardattachurl').val(data.data);
            //显示附件“查看”
            extenttips(already_i, '#idcardattachurl', '#idcardattach_tip');
        }
    });
    $('#saveidcard').bind('click', function() {
        if ($('#idcardfile').val() == '') {
            $ips.error('无选择文件');
            return false;
        }
        $('#idcardfile').upload('submit');
        $('#idcard_modal .modal-header button').trigger('click');
        return false;
    });

    //身份证上传
    $('#idcardfile2').upload({
        module: 'import',
        method: 'uploadImage',
        onSuccess: function(data) {
            if($('#idcardattachurl2').val()){
                var already_i = true;
            }else{
                already_i = false;
            }
            $('#idcardattachurl2').val(data.data);
            //显示附件“查看”
            extenttips(already_i, '#idcardattachurl2', '#idcardattach_tip2');
        }
    });
    $('#saveidcard2').bind('click', function() {
        if ($('#idcardfile2').val() == '') {
            $ips.error('无选择文件');
            return false;
        }
        $('#idcardfile2').upload('submit');
        $('#idcard_modal2 .modal-header button').trigger('click');
        return false;
    });

    //身份证上传
    $('#idcardfile3').upload({
        module: 'import',
        method: 'uploadImage',
        onSuccess: function(data) {
            if($('#idcardattachurl3').val()){
                var already_i = true;
            }else{
                already_i = false;
            }
            $('#idcardattachurl3').val(data.data);
            //显示附件“查看”
            extenttips(already_i, '#idcardattachurl3', '#idcardattach_tip3');
        }
    });
    $('#saveidcard3').bind('click', function() {
        if ($('#idcardfile3').val() == '') {
            $ips.error('无选择文件');
            return false;
        }
        $('#idcardfile3').upload('submit');
        $('#idcard_modal3 .modal-header button').trigger('click');
        return false;
    });

    //身份证上传
    $('#idcardfile4').upload({
        module: 'import',
        method: 'uploadImage',
        onSuccess: function(data) {
            if($('#idcardattachurl4').val()){
                var already_i = true;
            }else{
                already_i = false;
            }
            $('#idcardattachurl4').val(data.data);
            //显示附件“查看”
            extenttips(already_i, '#idcardattachurl4', '#idcardattach_tip4');
        }
    });
    $('#saveidcard4').bind('click', function() {
        if ($('#idcardfile4').val() == '') {
            $ips.error('无选择文件');
            return false;
        }
        $('#idcardfile4').upload('submit');
        $('#idcard_modal4 .modal-header button').trigger('click');
        return false;
    });

    //身份证上传
    $('#idcardfile5').upload({
        module: 'import',
        method: 'uploadImage',
        onSuccess: function(data) {
            if($('#idcardattachurl5').val()){
                var already_i = true;
            }else{
                already_i = false;
            }
            $('#idcardattachurl5').val(data.data);
            //显示附件“查看”
            extenttips(already_i, '#idcardattachurl5', '#idcardattach_tip5');
        }
    });
    $('#saveidcard5').bind('click', function() {
        if ($('#idcardfile5').val() == '') {
            $ips.error('无选择文件');
            return false;
        }
        $('#idcardfile5').upload('submit');
        $('#idcard_modal5 .modal-header button').trigger('click');
        return false;
    });

    //身份证上传
    $('#idcardfile6').upload({
        module: 'import',
        method: 'uploadImage',
        onSuccess: function(data) {
            if($('#idcardattachurl6').val()){
                var already_i = true;
            }else{
                already_i = false;
            }
            $('#idcardattachurl6').val(data.data);
            //显示附件“查看”
            extenttips(already_i, '#idcardattachurl6', '#idcardattach_tip6');
        }
    });
    $('#saveidcard6').bind('click', function() {
        if ($('#idcardfile6').val() == '') {
            $ips.error('无选择文件');
            return false;
        }
        $('#idcardfile6').upload('submit');
        $('#idcard_modal6 .modal-header button').trigger('click');
        return false;
    });

}

//判断是否显示“查看”
function extenttips(isupload, url_target, tip_target){
    if(!isupload){
        isupload = false;
    }
    // 附件tooltip
    var l = $(url_target).val();
    if(l){
        $(tip_target).css('display','block');
        var img = $("<img>").attr("src",l);
        if(isupload){
            $(tip_target+' .extiat').poshytip('update',img[0]);
        }else{
            $(tip_target+' .extiat').poshytip({
                content:img[0],
                alignTo:"target",
                alignX:"left",
                alignY:"center",
                offsetX:10
            });
        }
    }
}

function showGPSNO() {
    if ($('#type').val() == 2) {
        $('.gpsno-input').css({'display':'block'});
    } else {
        $('#gpsno').val("");
        $('.gpsno-input').css({'display':'none'});
    }
}
