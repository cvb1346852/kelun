var param = $ips.getUrlParams();
$(function() {
    $('#start_time').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        format: 'YYYY-MM-DD',
        startDate:moment().add('h', 0),
        minDate: '2000-01-01',
        maxDate: '2030-12-30'
    });
    $('#end_time').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        startDate:moment().add('h', 0),
        format: 'YYYY-MM-DD',
        minDate: '2000-01-01',
        maxDate: '2030-12-30'
    });
    $('#start_time').val(moment().format('L'));
    $('#end_time').val(moment().format('L'));

    $('#idcardattach').hide();
    var m = $('#idcardattach').closest('label');
    m.empty();
    $('<a href="">上传</a>').attr({
        'data-toggle': 'modal',
        'data-target': '#idcard_modal'
    }).addClass('btn btn-sm btn-link').bind('click', function() {
        $('#idcardfile').val('');
    }).appendTo(m);

    if (param["id"]) {
        $ips.load("contract", "getById", "id=" + param["id"], function (data) {
            if (data) {
                $ips.fillFormInput("frmInfo", data);
                $("#carrier_id").select2("data", {id:data.carrier_id, text:data.carrier_name});
                extenttips();
            }
        });
    }

    $("#carrier_id").select2({
        placeholder: "请选择承运商",
        allowClear: true,
        multiple: false,
        minimumInputLength: 1,
        data:[{id:0,text:'enhancement'},{id:1,text:'bug'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}],
        query: function(query) {
            $ips.load('contract', 'getByGroup', {name: query.term}, function(e) {
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
        $("#carrier_id").val(f.object.id);
    });
});
function save() {
    if(!$('#frmInfo').validate().form()) {
        return false;
    }
    /*判断手机号码是否规范*/
    if($('#phone').val()){
        if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i.test($('#phone').val()))
        {
            $ips.error("手机号码格式不正确");
            return false;
        }
    }else{
        $ips.error("手机号码不能为空");
        return false;
    };
    var params = $("#frmInfo").serializeArray();
    if(param["id"]) params.push({'name':'id','value':param["id"]});
    $ips.lockPage();
    $ips.load("contract", "save", params, function(result){
        $ips.unLockPage();
        if(result) {
            $ips.succeed("保存成功。");
            $ips.locate("contract","index");
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
    $('#idcardfile').upload({
        module: 'import',
        method: 'upload',
        onSuccess: function(data) {
            if(data.code == 0){
                $ips.error("上传失败," + data.data);
                return false;
            }
            if($('#idcardattachurl').val()){
                var   already_i = true;
            }else{
                already_i = false;
            }
            $('#idcardattachurl').val(data.savepath+data.savename);
            //显示下载
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
}

//下载合同文件
function downloadFile(){
    var file = $('#idcardattachurl').val();
    window.location.href = 'inside.php?t=json&m=exportdata&f=downloadContract&file=' + file
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
    }else{
        $('#idcardattach_tip').css('display','none');
    }


}