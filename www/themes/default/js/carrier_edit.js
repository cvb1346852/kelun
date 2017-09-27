var params = $ips.getUrlParams();
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


    $('#carrier_date').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        format:'YYYY-MM-DD',
        minDate:'1900-01-01',
        maxDate:'2020-12-30'
    });

    $("#safe").select2({  //自动完成
        placeholder: "请选择保险情况",
        allowClear: false,
        multiple: true,
        minimumInputLength: 0,
        data:[{id:0,text:'enhancement'},{id:1,text:'bug'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}],
        query: function(query) {
            $ips.load('carrier', 'getSet', {safe: query.term,type:'safe'}, function(e) {
                var _pre_data = [];
                $.each(e, function(k, v) {
                    _pre_data.push({id: v.id, text: v.text});
                });
                var data = {results: _pre_data};
                query.callback(data);
            });
        }
    });

    $("#travelService").select2({
        placeholder: "可供运输服务",
        allowClear: false,
        multiple: true,
        minimumInputLength: 0,
        data:[{id:0,text:'enhancement'},{id:1,text:'bug'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}],
        query: function(query) {
            $ips.load('carrier', 'getSet', {type:'travelService'}, function(e) {
                var _pre_data = [];
                $.each(e, function(k, v) {
                    _pre_data.push({id: v.id, text: v.text});
                });
                var data = {results: _pre_data};
                query.callback(data);
            });
        }
    });

    $("#otherService").select2({
        placeholder: "其它增值服务",
        allowClear: false,
        multiple: true,
        minimumInputLength: 0,
        data:[{id:0,text:'enhancement'},{id:1,text:'bug'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}],
        query: function(query) {
            $ips.load('carrier', 'getSet', {type:'otherService'}, function(e) {
                var _pre_data = [];
                $.each(e, function(k, v) {
                    _pre_data.push({id: v.id, text: v.text});
                });
                var data = {results: _pre_data};
                query.callback(data);
            });
        }
    });

    $("#carrierarea").select2({
        placeholder: "运输区域",
        allowClear: false,
        multiple: true,
        minimumInputLength: 0,
        data:[{id:0,text:'enhancement'},{id:1,text:'bug'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}],
        query: function(query) {
            $ips.load('carrier', 'getSet', {type:'carrierarea'}, function(e) {
                var _pre_data = [];
                $.each(e, function(k, v) {
                    _pre_data.push({id: v.id, text: v.text});
                });
                var data = {results: _pre_data};
                query.callback(data);
            });
        }
    });


    if (params.carrier_id) {
        $ips.load("carrier", "getById", {'id': params.carrier_id}, function(data) {
            if(data){
                $ips.fillFormInput("frmInfo", data);
                $('#safe').select2('data', data.safe);
                $('#travelService').select2('data', data.travelService);
                $('#otherService').select2('data', data.otherService);
                $('#carrierarea').select2('data', data.carrierarea);
                if (data.carrier_type == 2 )  $('#save_type').hide();
                extenttips();
            }
        });
    }
});


function save() {
    if(!$('#frmInfo').validate().form()) {
        return false;
    }
    var pa = $("#frmInfo").serializeArray();
    if (params.id) {
        pa.push({'name':'id','value':params.id});
        pa.push({'name':'carrier_id','value':params.carrier_id});
    }
    $ips.lockPage();
    $ips.load("carrier", "save", pa, function(result){
        $ips.unLockPage();
        if(result) {
            $ips.succeed("保存成功。");
            $ips.locate("carrier","index");
        } else {
            $ips.error("保存失败。" + result);
        }
    });
    return false;
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
            extenttips(already_i);
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
            extenttips(already_i);
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
            extenttips(already_i);
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
            extenttips(already_i);
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
            extenttips(already_i);
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

}

//判断是否显示“查看”
function extenttips(isupload){
    if(!isupload){
        isupload = false;
    }
    // 附件tooltip
    var l = $('#idcardattachurl').val();
    if(l){
        $('#idcardattach_tip').css('display','block');
        var img = $("<img>").attr("src",l);
        if(isupload){
            $('.extiat').poshytip('update',img[0]);
        }else{
            $('.extiat').poshytip({
                content:img[0],
                alignTo:"target",
                alignX:"left",
                alignY:"center",
                offsetX:10
            });
        }
    }

    // 附件tooltip
    l = $('#idcardattachurl2').val();
    if(l){
        $('#idcardattach_tip2').css('display','block');
        var img = $("<img>").attr("src",l);
        if(isupload){
            $('.extiat').poshytip('update',img[0]);
        }else{
            $('.extiat').poshytip({
                content:img[0],
                alignTo:"target",
                alignX:"left",
                alignY:"center",
                offsetX:10
            });
        }
    }

    // 附件tooltip
    l = $('#idcardattachurl3').val();
    if(l){
        $('#idcardattach_tip3').css('display','block');
        var img = $("<img>").attr("src",l);
        if(isupload){
            $('.extiat').poshytip('update',img[0]);
        }else{
            $('.extiat').poshytip({
                content:img[0],
                alignTo:"target",
                alignX:"left",
                alignY:"center",
                offsetX:10
            });
        }
    }

    // 附件tooltip
    l = $('#idcardattachurl4').val();
    if(l){
        $('#idcardattach_tip4').css('display','block');
        var img = $("<img>").attr("src",l);
        if(isupload){
            $('.extiat').poshytip('update',img[0]);
        }else{
            $('.extiat').poshytip({
                content:img[0],
                alignTo:"target",
                alignX:"left",
                alignY:"center",
                offsetX:10
            });
        }
    }

    // 附件tooltip
    l = $('#idcardattachurl5').val();
    if(l){
        $('#idcardattach_tip5').css('display','block');
        var img = $("<img>").attr("src",l);
        if(isupload){
            $('.extiat').poshytip('update',img[0]);
        }else{
            $('.extiat').poshytip({
                content:img[0],
                alignTo:"target",
                alignX:"left",
                alignY:"center",
                offsetX:10
            });
        }
    }
}