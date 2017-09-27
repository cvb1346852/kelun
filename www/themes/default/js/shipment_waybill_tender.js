var params = $ips.getUrlParams();
$(function() {
    if (params.id) {
        $ips.load("shipment", "getShipmentInfo", {'id': params.id}, function(data) {
            if(data) {
                var html = "";
                html+='<table width="100%" border="0" class="table table-striped table-bordered table-hover has-tickbox dataTable">';
                html+='<tr> ';
                html+='<td>运单号</td>';
                html+='<td>'+data.shipment_code+'</td>';
                html+='<td>&nbsp;</td>';
                html+='<td>&nbsp;</td>';
                html+='</tr>';
                html+='<tr>';
                html+='<td>运输方式</td>';
                html+='<td>'+data.shipment_method+'</td>';
                html+='<td>业务类型</td>';
                var profession = "";
                if(data.business_type == '1'){
                    profession = "省内";
                }else{
                    profession = "省外";
                }
                html+='<td>'+profession+'</td>';
                html+='</tr>';
                html+='<tr>';
                html+='<td>出发地</td>';
                html+='<td>'+data.from_city+'</td>';
                html+='<td>目的地</td>';
                html+='<td>'+data.to_city+'</td>';
                html+='</tr>';
                html+='<tr>';
                html+='<td>招投标状态</td>';
                var now=new Date();//取今天的日期
                var tender_status_view = "";
                if(data.tender_limit != null && data.tender_limit != '' && data.tender_limit !== undefined ){
                    var tender_limit = new Date(data.tender_limit.replace("-","/").replace("-", "/"));
                    if( now< tender_limit ){
                        tender_status_view = '竞标中';
                    }
                }
                if(data.status == '1'){
                    tender_status_view = '未发标';
                }
                if(data.tender_status == '2' || data.tender_status == '3'){
                    tender_status_view = '已评标';
                }
                html+='<td>'+ tender_status_view+'</td>';
                html+='<td>&nbsp;</td>';
                html+='<td>&nbsp;</td>';
                html+='</tr>';
                html+='<tr>';
                html+='<td>车牌号</td>';
                html+='<td>'+(data.carnum ===null?"":data.carnum)+'</td>';
                html+='<td>司机姓名</td>';
                html+='<td>'+(data.driver_name ===null?"":data.driver_name)+'</td>';
                html+='</tr>';
                html+='<tr>';
                html+='<td>联系方式</td>';
                html+='<td>'+(data.driver_phone ===null?"":data.driver_phone)+'</td>';
                html+='<td>装车件数</td>';
                html+='<td>'+data.quality+'</td>';
                html+='</tr>';
                html+='<tr>';
                html+='<td>重量</td>';
                html+='<td>'+data.weight+'</td>';
                html+='<td>体积</td>';
                html+='<td>'+data.volume+'</td>';
                html+='</tr>';
                html+='<tr>';
                html+='<td>计划发车时间</td>';
                html+='<td>'+(data.plan_leave_time ===null?"":data.plan_leave_time)+'</td>';
                html+='<td>计划到达时间</td>';
                html+='<td>'+(data.plan_arrive_time ===null?"":data.plan_arrive_time)+'</td>';
                html+='</tr>';
                html+='<tr>';
                html+='<td>备注</td>';
                html+='<td>'+ data.remark +'</td>';

                html+='</tr>';
                html+='</table>';
                $("#tender-detail").html(html);
                var html = "";
                html += '<table style="width: 90%;margin-top: 20px;" border="0" class="table table-striped table-bordered table-hover has-tickbox dataTable">';
                html+='<tr> ';
                html+='<th>时间</th>';
                html+='<th>时间位置</th>';
                html+='<th>事件类型</th>';
                html+='<th>事件描述</th>';
                html+='<th>图片</th>';
                html+='</tr>';
                /*if(data.arrivewh_time!==null) {
                    html += '<tr>';
                    html += '<td>' + data.arrivewh_time + '</td>';
                    html += '<td>' + data.fromlocation + '</td>';
                    html += '<td>进厂</td>';
                    html += '<td></td>';
                    html += '<td></td>';
                    html += '</tr>';
                }
                if(data.leavewh_time!==null) {
                    html += '<td>' + data.leavewh_time + '</td>';
                    html += '<td>' + data.fromlocation + '</td>';
                    html += '<td>出厂</td>';
                    html += '<td></td>';
                    html += '<td></td>';
                    html += '</tr>';
                }*/
                $.each(data.report, function(i, item) {
                    var report_type = '';
                    if (item.report_type == 1) {
                        report_type = '转包上报';
                    }
                    if (item.report_type == 2) {
                        report_type = '天气';
                    }
                    if (item.report_type == 3) {
                        report_type = '堵车';
                    }
                    if (item.report_type == 4) {
                        report_type = '修路';
                    }
                    if (item.report_type == 5) {
                        report_type = '查车';
                    }
                    if (item.report_type == 6) {
                        report_type = '修车';
                    }
                    if (item.report_type == 7) {
                        report_type = '签收';
                    }
                    if (item.report_type == 8) {
                        report_type = '其他';
                    }
                    if (item.report_type == 10) {
                        report_type = '进场';
                    }
                    if (item.report_type == 11) {
                        report_type = '出场';
                    }
                    if (item.report_type == 12) {
                        report_type = '运抵';
                    }
                    var pic = "";
                    if(item.images!='' && item.images!==null){
                        var imgstr = item.images;
                        var imgarr = imgstr.split(",");
                        $.each(imgarr, function(i, picval) {
                            pic+='<a id="paymentattach_tip" href="javascript:show_pic(\''+picval+'\')" attr-img="'+picval+'">查看</a>';
                        });
                    }
                    html += '</tr>';
                    html += '<td>'+item.create_time+'</td>';
                    html += '<td>'+item.address+'</td>';
                    html += '<td>'+report_type+'</td>';
                    html += '<td>'+item.report_desc+'</td>';
                    html += '<td class="report_img">'+pic+'</td>';
                    html += '</tr>';
                });
                $("#shipment_report").html(html);
                var html = "";
                html += '<table style="width: 50%;margin-top: 20px;" border="0" class="table table-striped table-bordered table-hover has-tickbox dataTable">';
                html+='<tr> ';
                html+='<th>时间</th>';
                html+='<th>LBS位置</th>';
                html+='</tr>';
                $.each(data.lbslist, function(i, lbs) {
                    html += '<tr>';
                    html += '<td>' + lbs.time + '</td>';
                    html += '<td>' + lbs.address + '</td>';
                    html += '</tr>';
                });
                $("#shipment_history_point").html(html);
            }
        });
    }
});
function show_pic(photo_url){
    var img = $(this).attr("attr-img");
    $("#show").fadeIn(300);  //显示图片效果
    document.getElementById("show").style.left=$(window).width()/2-300;
    document.getElementById("show").style.top=$(window).height()/2-100;
    $("#photo").find("img").attr("src",photo_url);
    $("body").click(function(){
        $("#show").fadeOut(300); //图片消失效果
    });
}