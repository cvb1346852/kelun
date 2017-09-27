var params = $ips.getUrlParams();


if (params.id) {
    $ips.load("dispatch_set", "getDispatchInfo", {'id': params.id}, function(data) {
        if(data){
            $('#user_id').val(data['0'].user_name);
            $('#dispatch_id').val(params.id);
            var warehouse = jQuery.parseJSON(data['0'].warehouse);

            $ips.load('dispatch_set', 'searchWarehouse','', function(data) {
                $.each(data, function(k, v) {
                    $("#push").append('<label class="checkbox" style="display: inline;"><input type="checkbox" class="checkbox style-0"  name="warehouse[]" value="'+v.orgcode+'"  id="'+v.orgcode+'"/><span style="margin-right: 0px;vertical-align:baseline;"></span>'+v.name+' </label>');

                });

                for(var i=0;i<warehouse.length;i++){
                    $("input.checkbox[id='"+warehouse[i]+"']").attr("checked",true);
                }
            });

        }
        else{
            $ips.locatesubsystem("project/dispatch_set/index.html",false);
        }
    });
}


function save() {
    if(!$('#frmInfo').validate().form()) {
        return false;
    }
    var pa = $("#frmInfo").serializeArray();
    $ips.lockPage();
    $ips.load("dispatch_set", "update", pa, function(result){
        $ips.unLockPage();
        $("#btnSubmit").attr("disabled",true);
        if(result.code == '0') {
            $ips.succeed(result.message);
            $ips.locate("dispatch_set","index");
        } else {
            $ips.error(result.message);
        }
    });
    return false;
}
