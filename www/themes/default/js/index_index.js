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
            $.sendData('carrier', 'getSet', {safe: query.term,type:'safe'}, '',function(e) {
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
            $.sendData('carrier', 'getSet', {type:'travelService'},'', function(e) {
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
            $.sendData('carrier', 'getSet', {type:'otherService'},'', function(e) {
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
            $.sendData('carrier', 'getSet', {type:'carrierarea'}, '',function(e) {
                var _pre_data = [];
                $.each(e, function(k, v) {
                    _pre_data.push({id: v.id, text: v.text});
                });
                var data = {results: _pre_data};
                query.callback(data);
            });
        }
    });

    $("#warehouse_id").select2({
        placeholder: "请选择基地/片区名",
        allowClear: true,
        multiple: false,
        minimumInputLength: 2,
        data:[{id:0,text:'enhancement'},{id:1,text:'bug'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}],
        query: function(query) {
            $.sendData('warehouse', 'getByGroup', {name: query.term,group:'name'},'', function(e) {
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
        $("#warehouse_id").val(f.object.id);
        $("#warehouse_name").val(f.object.text);
    });


    //初始化省份选择
    BindCity("请选择");

});


function save() {
    if(!$('#frmInfo').validate().form()) {
        return false;
    }
    var pa = $("#frmInfo").serializeArray();

    pa.push({'name':'apply','value':'apply'});
    if($('#carrier_name').val() == ''){
        $ips.error('请填写公司名称')
        return false;
    }
    if($('#carrier_name_s').val() == ''){
        $ips.error('请填写公司简称')
        return false;
    }
    if($('#ddlProvince').val() == ''){
        $ips.error('请选择所在省/市')
        return false;
    }
    if($('#ddlCity').val()  == ''){
        $ips.error('请选择所在市/区')
        return false;
    }
    if($('#organizing_code').val() == ''){
        $ips.error('请填写社会信用代码')
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
        pa.push({name:'trans_type','value':trans_type});
    }

    if(!$("#bidding").is(':checked') && !$("#fixed_price").is(':checked')){
        $ips.error('请选择公司合作模式')
        return false;
    }else{
        if($("#bidding").is(':checked')){
            var bidding = 1;
        }else{
            var bidding = 0;
        }
        if($("#fixed_price").is(':checked')){
            var fixed_price = 1
        }else{
            var fixed_price = 0;
        }
    }
    pa.push({name:'bidding','value':bidding});
    pa.push({name:'fixed_price','value':fixed_price});

    if($('#is_invoice').val() == 1){
        if($('#invoice_rate').val() == '') {
            $ips.error('请填写票点数')
            return false;
        }
        if(parseInt($('#invoice_rate').val()) >100 || parseInt($('#invoice_rate').val()) <=0){
            $ips.error('请正确填写票点数 0-100')
            return false;
        }
        if(parseInt($('#real_invoice_rate').val()) >100 || parseInt($('#real_invoice_rate').val()) <=0){
            $ips.error('请正确填写开票点数 0-100')
            return false;
        }
    }
    if($('#real_invoice_rate').val() == ''){
        $ips.error('请填写开票点数')
        return false;
    }
    if($('#relation_person').val() == ''){
        $ips.error('请填写联系人')
        return false;
    }
    if($('#relation_phone').val() == ''){
        $ips.error('请填写联系电话')
        return false;
    }else if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i.test($('#relation_phone').val())){
        $ips.error('手机号为微信车车招标登陆凭证，请正确填写');
        return false;
    }
    if($('#warehouse_id').val() == ''){
        $ips.error('请选择审核基地')
        return false;
    }
    $ips.lockPage();
    $.sendData("carrier", "save", pa,'', function(result){
        $ips.unLockPage();
        if(result.code == 0) {
            $ips.succeed("申请成功。");
        } else if(result.code == 3){
            $ips.error(result.message);
        } else{
            $ips.error("保存失败，请联系客服");
        }
    });
    return false;
}

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

(function( $ ) {

    $.widget( "hui.upload", {
        options: {
            // 默认参数
            buttonText: "选择文件",
            onSuccess: false,		// 上传成功回调函数
            onError: false,			// 上传失败回调函数
            module : "import",
            method : "upload"
        },

        _create: function() {
            var opts = this.options;

            var e = this.element;
            var label = e.parents("label");
            label.attr("for", "file").addClass("input-file");
            e.wrap('<div class="button"></div>').after("<span>浏览</span>");
            label.append('<input type="text" placeholder="选择文件..." readonly="readonly">');
            label.append('<div class="progress"><div class="progress-bar bg-color-blue" style="width: 0%;">0%</div></div>');
            label.children("div.progress").hide();
            e.change(function() {
                label.children("input").val(e.val());
            });
        },

        submit: function() {
            var opts = this.options;
            var e = this.element;
            var from = e.parents("form");
            var label = e.parents("label");
            var btn = label.find("div.button span");
            var progress = label.children("div.progress");
            var bar = progress.children("div");
            from.ajaxSubmit({
                url: $ips.appPath + "rest/service.php?method=kelun." + opts.module + "." + opts.method,
                dataType:  'json',
                beforeSend: function() {
                    var percentVal = '0%';
                    bar.width(percentVal);
                    bar.html(percentVal);
                    btn.text("上传中...");
                    progress.show();
                },
                uploadProgress: function(event, position, total, percentComplete) {
                    var percentVal = percentComplete + '%';

                    bar.width(percentVal);
                    bar.html(percentVal);
                },
                success: function(data) {
                    var percentVal = '100%';

                    bar.width(percentVal);
                    bar.html(percentVal);
                    btn.text(opts.buttonText);
                    progress.hide();

                    if (opts.onSuccess)
                        opts.onSuccess(data);
                },
                error:function(xhr) {
                    bar.width('0')
                    btn.text("上传失败");
                    log.debug(xhr.responseText);

                    if (opts.onError)
                        opts.onError(data);
                }
            });
        }
    });

})( jQuery );

$.extend({
    sendData:function(mod, method, param, weChatType,callback){
        if(weChatType ==''){
            weChatType = 'kelun';
        }
        var url = window.location.origin+'/rest/service.php?method='+weChatType+'.'+mod+'.'+method;
        $.ajax({
            type:"POST",
            url:url,
            data:param,
            dataType:"json",
            beforeSend:function(){
            },
            success:function(json){
                $ips.unLockPage();
                if(typeof json === "string"){
                    if(json.length < 1){
                        $ips.error('json无效，数据为空');
                        return;
                    }
                    try{
                        result = eval('('+json+')');
                    }catch(e){
                        if(typeof console.log != 'undefined')
                            $ips.error('服务器返回数据无法解析');
                        return false;
                    }
                }else{
                    result = json;
                }
                if(result != null && result.code != 0){
                    $ips.error(result.message);
                    result = false;
                }else{
                    if(callback)
                        callback(result.data);
                }
            }
        });
    }

});
loadScript("js/plugin/jquery-form/jquery-form.min.js", '');
loadScript('/js/poshytip/jquery.poshytip.min.js',uploadFile());