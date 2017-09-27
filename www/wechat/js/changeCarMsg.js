

var checkoutForm;
var carnum;
var car_length;
var carriage_type;
var rated_load;
//获取用户openid
$.getUserInfo('shipment',0,function(){
    //微信ID
    openid = userInfo.openid;
    if(userInfo.user_type != 3){
        $("#count").hide();
        $.alert("获取用户信息失败");
        return false;
    }else{
        $("#openid").val(userInfo.openid);
        $.sendData('truck_source', 'getTruckMsg',{phone:userInfo.phone},'',function(data) {
            carnum = data.carnum;
            car_length = data.car_length;
            carriage_type = data.carriage_type;
            rated_load = data.rated_load;
            $("#carnum").val(data.carnum);
            $("#car_length").val(data.car_length);
            $("#carriage_type").val(data.carriage_type);
            $("#rated_load").val(data.rated_load);
            $("#truck_source_id").val(data.id);
        });
    }
});
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
    $.each(data, function(i, item){
        optionVal += "<option value='"+item.id+"'>"+item.name+"</option>";
    });
    $("#carriage_type").html(optionVal);
});

function addNewstruck(){
    $.showLoading('正在操作中...');
    formId = "frmInfo";
    if (!$("#" + formId).validate(checkoutForm).form()) {
        $.toast("信息填写不完整" , "forbidden");
        return;
    }
    if($('#carnum').val() == carnum && $('#car_length').val() == car_length && $('#rated_load').val() == rated_load && $('#carriage_type').val() == carriage_type){
        $.toast("没有修改的内容，不能提交" , "forbidden");
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
    if($('#car_length').val()){
        if(!/\-?\d+(\.\d+)?/.test($('#car_length').val()))
        {
            $.toast("车长必须为数字" , "forbidden");
            return false;
        }
    };
    if($('#rated_load').val()){
        if(!/\-?\d+(\.\d+)?/.test($('#car_length').val()))
        {
            $.toast("吨位必须为数字" , "forbidden");
            return false;
        }
    };

    searchParams = $("#frmInfo").serializeArray();
    $.sendData('truck_source', 'updateTruckMsg', {searchParams:searchParams}, '', function(data){
        $.hideLoading();
        if (data) {
            $.toast("修改成功");
            setTimeout("gotolist()",1500);
        } else {
            $.error("修改失败");
        }
    });
}
function noaddNewstruck(){
    $("#carnum").val(carnum);
    $("#car_length").val(car_length);
    $("#carriage_type").val(carriage_type);
    $("#rated_load").val(rated_load);
}
function gotolist(){
    window.location.href = "myTruckSource.html?openid="+openid
}