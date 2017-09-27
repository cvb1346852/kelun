var param = $ips.getUrlParams();
$(function() {

    $("#user_id").select2({
        placeholder: "请选择管理员账号",
        allowClear: true,
        multiple: false,
        minimumInputLength: 1,
        data:[{id:0,text:'enhancement'},{id:1,text:'bug'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}],
        query: function(query) {
            $ips.load('dispatch_set', 'findUser', {username: query.term}, function(data) {
                var _pre_data = [];
                $.each(data.result, function(k, v) {
                    _pre_data.push({id: v.id+','+ v.username+','+v.roleids, text: v.username+'('+v.realname+')'});
                });
                var data = {results: _pre_data};
                query.callback(data);
            });
        }
    }).on("select2-removed", function() {

    }).on("select2-selecting", function(f) {
        $("#carrier_id").val(f.object.id);
    });

    $ips.load('dispatch_set', 'searchWarehouse','', function(data) {
        $.each(data, function(k, v) {
            $("#push").append('<label class="checkbox" style="display: inline;"><input type="checkbox" class="checkbox style-0"  name="warehouse[]" value="'+v.orgcode+'"  id="'+v.id+'"/><span style="margin-right: 0px;vertical-align:baseline;"></span>'+v.name+' </label>');

        });
    });


});

function save() {
    if(!$('#frmInfo').validate().form()) {
        return false;
    }
    var pa = $("#frmInfo").serializeArray();
    $ips.lockPage();
    $ips.load("dispatch_set", "save", pa, function(result){
        $ips.unLockPage();
        $("#btnSubmit").attr("disabled",true);
        if(result.code == '0') {
            $ips.succeed("保存成功。");
            $ips.locate("dispatch_set","index");
        } else {
            $ips.error(result.message);
        }
    });
    return false;
}
