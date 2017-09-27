$("#selftruckfile").val("");
loadScript("js/plugin/jquery-form/jquery-form.min.js", '');
loadScript('/js/poshytip/jquery.poshytip.min.js','');
loadScript('js/hui/jquery.hui.upload.js', uploadFile);
//上传附件
function uploadFile() {
    //导入文件上传
    $('#selftruckfile').upload({
        onSuccess: function(data) {
            // 是否覆盖数据
            //var repeat = $("input[name='selftruckinsert']:checked").val();
            var repeat = 'cover';
            // 取标题
            $titles = $ips.load("import", "getTitle", "filepath=" + data.savepath + data.savename);
            log.debug($titles);
            // 存数据
            $ips.load("import", "saveTenderRoute", "filepath=" + data.savepath + data.savename + "&repeat=" + repeat, function(data){
                $ips.unLockPage();
                if (data) {
                    $ips.succeed('导入成功！');
                    setTimeout(function(){jump()},1000);
                }
            });
        }
    });
    $('#saveselftruck').bind('click', function() {
        $ips.lockPage('正在导入,请稍等...');
        if ($('#selftruckfile').val() == '') {
            $ips.error('无选择文件');
            return false;
        }
        $('#selftruckfile').upload('submit');
        $('#selftruck_modal .modal-header button').trigger('click');
        return false;
    });
}

function jump(){
    $ips.locatesubsystem("project/tender_route/index.html",false);
}
function downloadTemp(modeltype){
    window.open('/inside.php?t=xls&m=exportdata&f=downloadTemplate&modeltype=' + modeltype);
}
/*
//下载模板
loadScript('js/hui/jquery.hui.exportdata.js', function () {
	 	var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var time = year+""+month+""+day;
        var exportSearchParams = [
            {name:"getTemplate",value:1},
        ];

            exportSearchParams.push({name:"filename","value":"评标线路模板-" + time});
    $('#export').exportdata({dataModule : 'tender_route',dataMethod:'gettemp',searchParams: exportSearchParams,title:'评标线路模板',partDataRows:10000,partSize:100});
},true,true);*/
