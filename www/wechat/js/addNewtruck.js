
//获取用户openid 
  $.getUserInfo('shipment',0,function(){
      //微信ID 
      openid = userInfo.openid;
      if(userInfo.user_type != 4){
             $("#count").hide();    
              $.alert("获取用户信息失败"); 
              return false;
      }else{ 
            $("#openid").val(userInfo.openid);

      }
  }); 

var checkoutForm; 
loadScript("../js/plugin/jquery-form/jquery-form.min.js", runFormValidation); 
loadScript("../js/plugin/jquery-validate/jquery.validate.js");
loadScript("../js/plugin/select2/select2.js");
//加载底部菜单
//加载车源数据 
 function runFormValidation() {
   checkoutForm = {
        // Rules for form validation
        rules: {
            carnum: {
                required: true,

            },
            car_length: {
                required: true,
            }, 
            rated_load: {
                required: true,
            }, 
            driver_name:{
                required : true, 
            }
        },
        // Messages for form validation
        messages: {
            carnum: {
                required: "必填项",
            },
            car_length: {
                required: "必填项",
            }, 
            rated_load:{
                required: "必填项", 
            }, 
            driver_name:{
                 required: "必填项", 
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    };
     
}

$.sendData('truck_source', 'getCarriageType', '', '',function(result) {
    var data = result;
    var optionVal = '';
    optionVal += "<option>请选择</option>";
    $.each(data, function(i, item){
        optionVal += "<option value='"+item.id+"'>"+item.name+"</option>";
    });
    $("#carriage_type").html(optionVal);
});

 function addNewstruck(){ 
      formId = "frmInfo";
      if (!$("#" + formId).validate(checkoutForm).form()) {
      	  $.toast("红色信息部分请填写完整" , "forbidden");
        return;
    }
     /*车牌号*/
     if($('#carnum').val()){
         if(!/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test($('#carnum').val()))
         {
             $.toast("车牌号格式不正确" , "forbidden");
             return false;
         }
     }else{
         $.toast("请输入车牌号" , "forbidden");
         return false;
     };
     /*必须为数字*/
     if($('#car_length').val() == "请选择"){
         $.toast("请选择车长" , "forbidden");
         return false;
     };
     if($('#carriage_type').val() == "请选择"){
         $.toast("请选择箱型" , "forbidden");
         return false;
     };
     if($('#rated_load').val()){
         if(!/^[0-9]*$/.test($('#rated_load').val()) && !/^((\d+\.\d*[1-9]\d*)|(\d*[1-9]\d*\.\d+)|(\d*[1-9]\d*))$/.test($('#rated_load').val()))
         {
             $.toast("吨位必须为数字" , "forbidden");
             return false;
         }
     };

 	 /*身份证号码*/
 	 if($('#id_card').val()){
        if(!/(^\d{15}$)|(^\d{17}(\d|X)$)/.test($('#id_card').val()))
        {
            $.toast("身份证号码格式不正确" , "forbidden");
            return false;
        }
     }else{
    	$.toast("请输入身份证号码" , "forbidden");
        return false;
     };
      /*验证手机号*/
      if($('#driver_phone').val()){
        if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i.test($('#driver_phone').val()))
        {
            $.toast("手机号码格式不正确" , "forbidden");
            return false;
        }
      }else{
     	$.toast("请输入手机号码" , "forbidden");
        return false;
     };
    searchParams = $("#frmInfo").serializeArray();
     $.showLoading('数据添加中,请稍等...');
    $.sendData('truck_source', 'save_wechat', {searchParams:searchParams}, 'truck_source', function(data){
        $.hideLoading();
        if (data.code == 0) {
            $.toast("添加成功");
            setTimeout("gotolist()",2000);
            if(data.truck_type == 1){
                $.sendData('truck_source', 'sendLbsMsg', {driver_phone:data.driver_phone}, '', function(data){});
            }
        } else {
            $.error(data.message);
        }
    });
 }
function gotolist(){
    window.location.href = "myTruckSource.html?openid="+openid
}