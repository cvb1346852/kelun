/**
 * lvison
 * 2016-11-18
 * @type {*|Object}
 */

//展示运单列表
loadScript('/js/hui/jquery.hui.grid.js', function () {
    $('#shipmentTbl').grid({
        "aLengthMenu": [ 30, 25, 50, 100 ],
        "iDisplayLength": 30,
        "aoColumns" : [
            {sTitle: "运单号", sName: "shipment_code"},
            {sTitle: "审批价格", sName: "quote_price"},

            {sTitle: "审批结果", sName: "status"},
            {sTitle: "审批时间", sName: "update_time"},
            {sTitle: "上报时间", sName: "create_time"}

        ],
        "fnServerData" : function(sSource, aoData, fnCallback) {
            var searchParams = $("#frmSearch").serializeArray();
            var now=new Date();//取今天的日期
            $ips.gridLoadData(sSource, aoData, fnCallback, "tender", "getAuditResult", searchParams, function(data) {
                if(data.result){
                    $.each(data.result, function(i, item) {
                        if(parseInt(item.status) == 1){
                            item.status = '未通过';
                        }else if(parseInt(item.status) == 2){
                            item.status = '通过';
                        }
                    });
                }
            });
        },
        "fnDrawCallback" : function() {
            //订车操作
            var checkboxes = $("input[type='checkbox']");
            checkboxes.on("click", function() {
                /*  var $this = $(this);
                 if ($this.is(":checked")) {
                 checkboxes.prop("checked", false);
                 $this.prop("checked", true);
                 }*/
            });
        },
    });
});


$(function(){
});


