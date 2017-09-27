$(function() {
	// 搜索按钮
	$("#btnSearch").click(function() {
		/*searchParams = $("#frmSearch").serializeArray();*/
		$('#tblMain').grid("fnPageChange","first");
	});

});
$(function() {
    //初始化出发地省份选择
    BindCity("");   
    //初始化目的地省份选择
    BindCity1("");   
});
// 表格
loadScript("/js/hui/jquery.hui.grid.js",function(){
    $("#tblMain").grid({
        "aoColumns":[
            {sTitle: '<label class="no-margin"><input type="checkbox" name="checkbox style-0 " class="checkbox style-0 checkAll" id="checkAll"><span></span></label>',sName: "idCheckbox",sWidth: "20px",sClass: "center",bSortable: false},
            {sTitle: "车牌号", sName: "carnum","bSortable": false},
      			{sTitle: "车长", sName: "car_length","bSortable": false},
      			{sTitle: "箱型", sName: "carriage_type","bSortable": false},
            {sTitle: "额定载重", sName: "rated_load","bSortable": false},
            {sTitle: "司机", sName: "driver_name","bSortable": false},
            {sTitle: "联系方式", sName: "driver_phone","bSortable": false},
			      {sTitle: "当前位置", sName: "address","bSortable": false}

    ],
        "fnServerData":function(sSource,aoData,fnCallback){
            var searchParams = $("#frmSearch").serializeArray();
            $ips.gridLoadData(sSource,aoData,fnCallback,"truck_source","getDriverRoute",searchParams,function(data){
                  if(data.result){

                      $.each(data.result, function(i, item) {
                          item.idCheckbox = '<label class="checkbox"><input id="'+item.ts_id+'" type="checkbox" name="checkbox-inline" value="'+item.ts_id+'" class="checkbox style-0"><span></span></label>';
                          item.address =  '<input id="car_' + item.id + '" type="hidden" >';
                          $ips.load("truck_source", "getAddressList", {driver_phone: item.driver_phone, type: item.type, carnum: item.carnum}, function(result) {
                              if(result.address){
                                  $("#car_"+item.id).parent().html(result.address);
                              }
                          });
                      });
                  }else{
                  $('#shipmentTbl').html('<div style="width:300px;height:100px;margin-left:30px;line-height:100px;" >暂无历史记录</div>');
              }
            });
        }
    });
});


 //获取id
 function getRowId() {
     var id = $('#tblMain input:checkbox[class="checkbox style-0"]:checked').val();
     return id;
 }
 //查看按钮操作
 function edit() {
     $('#truck_source').html('');
     var id=getRowId();
     $('#boxWorks').modal();
     $ips.load("truck_source", "getHistory", "id=" + id, function(data){
         if(!jQuery.isEmptyObject(data.history)){
               $.each(data.history, function(i, item) {
                 var html='';
                 html+='<center>';
                 html+='<p><span>'+item.time+'</span>&nbsp;&nbsp;&nbsp;<span>'+item.action+'</span></p>'
                 html+='</center>';
                 $('#truck_source').append(html);
             });  
           }else{
                $('#truck_source').html('<div style="width:300px;height:100px;margin-left:30px;line-height:100px;" >暂无历史记录</div>');
           }
         
     });
}
