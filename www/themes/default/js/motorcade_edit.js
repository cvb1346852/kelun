var param = $ips.getUrlParams();
if(param["id"]) {
    $ips.load("motorcade", "getById", "id=" + param["id"], function(data){
        if(data){
            $('#name').val(data.name);
            $('#contact').val(data.contact);
            $('#phone').val(data.phone);
            $('#note').val(data.note);
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
    $ips.load("motorcade", "save", params, function(result){
        $ips.unLockPage();
        if(result) {
            $ips.succeed("保存成功。");
            $ips.locate("motorcade","index");
        } else {
            $ips.error("保存失败。" + result);
        }
    });
    return false;
}