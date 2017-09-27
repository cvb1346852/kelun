var params = $ips.getUrlParams();
var NowId = params.id;

$ips.include('/js/poshytip/tip-white/tip-white.css');
$(function() {
    if(params.id != null){
        $ips.load("carrier", "getAlterInfo",{'id':params.id}, function(result){
            if(result){
                $("#carrier_name").val(result.carrier_name);
                $("#carrier_name_s").val(result.carrier_name_s);
                $("#province").val(result.province);
                $("#city").val(result.city);
                $("#societycode").val(result.societycode);
                $("#organizing_code").val(result.organizing_code);
                $("#representative").val(result.representative);
                $("#capital").val(result.capital == '0' ? '' : (result.capital +'  万元'));
                var is_invoice = (result.is_invoice == 1) ? "允许" : "不允许";
                $("#is_invoice").val(is_invoice);
                $("#invoice_rate").val(result.invoice_rate);
                $("#real_invoice_rate").val(result.real_invoice_rate);
                $("#carrier_introduce").val(result.carrier_introduce);
                $("#carrier_date").val(result.carrier_date);
                $("#trans_type").val(result.trans_type);

                $("#carrierarea").val(result.carrierarea);
                $("#strengthline").val(result.strengthline);
                $("#selfcar").val(result.selfcar);
                $("#othercar").val(result.othercar);
                $("#relation_person").val(result.relation_person);
                $("#relation_phone").val(result.relation_phone);
                $("#relation_email").val(result.relation_email);
                $("#relation_fax").val(result.relation_fax);
                $("#relation_address").val(result.relation_address);
                $("#relation_post").val(result.relation_post);
                $("#warehouse_name").val(result.warehouse_name);

                //公司性质
                var property_types = {'1':'私企','2':'国企','3':'外资','4':'外资'};
                $("#property").val(property_types[result.property]);

                //显示保险情况
                var safeStr = '';
                var safe_types = {'1':'物流责任险','2':'内陆运输险','3':'财产一切险','4':'第三方责任险','5':'货物运输险','6':'交强险',
                    '7':'车损险','8':'驾驶员人身险','9':'车上人员险','10':'其它'};
                 if(result.safe){
                     var safe = result.safe.split(',');
                     $.each(safe,function(i,item){
                         safeStr += safe_types[item]+' ';
                     });
                 }
                 $("#safe").val(safeStr);

                //可供运输服务
                var travelServiceStr = '';
                var travelService_types = {'1':'空运','2':'陆运','3':'快递','4':'火车','5':'内河','6':'内海',
                    '7':'危险品','8':'冷链','9':'其它'};
                if(result.travelService){
                    var travelService = result.travelService.split(',');
                    $.each(travelService,function(i,item){
                        travelServiceStr += travelService_types[item]+' ';
                    });
                }
                $("#travelService").val(travelServiceStr);

                //其它增值服务
                var otherServiceStr = '';
                var otherService_types = {'1':'ePOD','2':'预约配送','3':'货到付款','4':'送货上楼','5':'取退货','6':'其它'};
                if(result.otherService){
                    var otherService = result.otherService.split(',');
                    $.each(otherService,function(i,item){
                        otherServiceStr += otherService_types[item]+' ';
                    });
                }
                $("#otherService").val(otherServiceStr);
                //显示附件“查看”
                if(result.roadpicture != ''){
                    $("#idcardattachurl").attr("src",result.roadpicture);

                    $("#idcardattachurl").show();
                    var img = $("<img style='z-index: 9999 !important; width:600px;'>").attr("src",result.roadpicture);
                    $('#idcardattachurl').poshytip({
                        content:img[0],
                        alignTo:"target",
                        alignX:"left",
                        alignY:"center",
                        offsetX:10,
                        z_index:9999
                    });
                }else{
                    $("#idcardattachurl").html('未上传');
                }

                //显示附件“查看”
                if(result.bankpicture != ''){
                    $("#bankpicture").attr("src",result.bankpicture);

                    $("#bankpicture").show();
                    var img = $("<img style='z-index: 9999 !important; width:600px;'>").attr("src",result.bankpicture);
                    $('#bankpicture').poshytip({
                        content:img[0],
                        alignTo:"target",
                        alignX:"left",
                        alignY:"center",
                        offsetX:10,
                        z_index:9999
                    });
                }else{
                    $("#bankpicture").html('未上传');
                }

                //显示附件“查看”
                if(result.taxpicture != ''){
                    $("#taxpicture").attr("src",result.taxpicture);

                    $("#taxpicture").show();
                    var img = $("<img style='z-index: 9999 !important; width:600px;'>").attr("src",result.taxpicture);
                    $('#taxpicture').poshytip({
                        content:img[0],
                        alignTo:"target",
                        alignX:"left",
                        alignY:"center",
                        offsetX:10,
                        z_index:9999
                    });
                }else{
                    $("#taxpicture").html('未上传');
                }

                //显示附件“查看”
                if(result.orgcodeprove != ''){
                    $("#orgcodeprove").attr("src",result.orgcodeprove);

                    $("#orgcodeprove").show();
                    var img = $("<img style='z-index: 9999 !important; width:600px;'>").attr("src",result.orgcodeprove);
                    $('#orgcodeprove').poshytip({
                        content:img[0],
                        alignTo:"target",
                        alignX:"left",
                        alignY:"center",
                        offsetX:10,
                        z_index:9999
                    });
                }else{
                    $("#orgcodeprove").html('未上传');
                }
            }
        });
    }
});

loadScript("js/plugin/jquery-form/jquery-form.min.js", '');

function change(l) {
    var type = 2;
    if(l) type = 3;
    $ips.load("carrier", "agree",{'id':NowId,'type':type}, function(result){
        if(result.code==0) {
            $ips.succeed('操作成功');
            setTimeout(function(){gotolist()},1500);
        } else if(result.code==1) {
            $ips.error(result.message);
            setTimeout(function(){gotolist()},1500);
        }
    });
}

function gotolist(){
    $ips.locatesubsystem('project/carrier/index.html',false);
}