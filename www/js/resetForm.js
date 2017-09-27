function resetForm(){
    $('#frmSearch')[0].reset();

    $('#s2id_shipment_code').find("span.select2-chosen").html("选择运单号");
    $('#s2id_shipment_code').removeClass("select2-allowclear");

    $('#s2id_order_code').find("span.select2-chosen").html("选择订单号");
    $('#s2id_order_code').removeClass("select2-allowclear");

    $('#s2id_serial_num').find("span.select2-chosen").html("选择订单号");
    $('#s2id_serial_num').removeClass("select2-allowclear")

    $('#s2id_relate_bill').find("span.select2-chosen").html("选择订单号");
    $('#s2id_relate_bill').removeClass("select2-allowclear")

    $('#s2id_carrier_id').find("span.select2-chosen").html("选择承运商");
    $('#s2id_carrier_id').removeClass("select2-allowclear");

    $('#s2id_driver').find("span.select2-chosen").html("选择司机");
    $('#s2id_driver').removeClass("select2-allowclear");

    $('#s2id_carnum').find("span.select2-chosen").html("选择车辆");
    $('#s2id_carnum').removeClass("select2-allowclear");

    $('#s2id_driver_phone').find("span.select2-chosen").html("选择联系方式");
    $('#s2id_driver_phone').removeClass("select2-allowclear");

}