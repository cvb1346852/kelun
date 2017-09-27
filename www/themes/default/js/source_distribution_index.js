var searchParams = new Array();
var deletedId = [];
$(function() {  

    // 搜索按钮
    $("#btnSearch").click(function() {
        searchParams = $("#frmSearch").serializeArray();
        deletedId = [];
        $('#tblMain').grid("fnPageChange","first");
    });

});
// 表格
loadScript("/js/hui/jquery.hui.grid.js",function(){
    $("#tblMain").grid({
        "aoColumns":[
            {sTitle: "基地", sName: "warehouse_name","bSortable": false},
            {sTitle: "目的地省", sName: "to_province","bSortable": false},
            {sTitle: "目的地市", sName: "to_city","bSortable": false},
            {sTitle: "到站", sName: "tolocation","bSortable": false},
            {sTitle: "运输方式", sName: "shipment_method","bSortable": false},
            {sTitle: "件数", sName: "quality","bSortable": false},
            {sTitle: "重量", sName: "weight","bSortable": false},
            {sTitle: "招标时间", sName: "tender_time","bSortable": false},
            {sTitle: "制单时间", sName: "create_time","bSortable": false}

    ],
        "fnServerData":function(sSource,aoData,fnCallback){
            var province=$('#province').val();
            $ips.gridLoadData(sSource,aoData,fnCallback,"source_distribution","search",[{name:"province",value:province}],function(data){
                if(data.result){
                    $.each(data.result, function(i, item) {
                    
                  });
                }
            });
        }
    });
});

loadScript("/js/hui/jquery.hui.grid.js",function(){
    $ips.load("source_distribution","getProvince",'',function(data){
        if(data){
           $.each(data, function(i, item){
                var html='';
                html+='<a id="btnSearch'+i+'" href="javascript:void(0)"  onclick="getProvince('+i+');" class="btn btn-primary  btn-sm" type="button" style="margin-top:16px;margin-left:10px;float:left;">'+item.from_province+'</a>';
                $('#pro').append(html);
            }); 
        }     
    });
});

function getProvince(i){
    var pro=$('#btnSearch'+i).html();
    $('#province').val(pro);
    $('#tblMain').grid("fnPageChange","first");
}