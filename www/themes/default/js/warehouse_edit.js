var param = $ips.getUrlParams();
$(function() {
    //初始化省份选择
    BindCity("成都");
});
if(param["id"]) {
    $ips.load("warehouse", "getById", "id=" + param["id"], function(data){
        if(data){
            $('#name').val(data.name);
            $('#platform_code').val(data.platform_code);
            $('#address').val(data.address);
            $('#type').val(data.type);
            $('#orgcode').val(data.orgcode);
            $('#person').val(data.person);
            $('#phone').val(data.phone);
            BindCity(data.city);
        }
    });
}
function save() {
    if(!$('#frmInfo').validate().form()) {
        return false;
    }
    var params = $("#frmInfo").serializeArray();
    if(param["id"]) params.push({'name':'id','value':param["id"]});
    $ips.lockPage();
    $ips.load("warehouse", "save", params, function(result){
        $ips.unLockPage();
        if(result) {
            $ips.succeed("保存成功。");
            $ips.locate("warehouse","index");
        } else {
            $ips.error("保存失败。" + result);
        }
    });
    return false;
}