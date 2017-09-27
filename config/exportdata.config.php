<?php

/**
 * 导出字段设置
 *
 * <p>
 * 导出供应商信息
 * </p>
 *
 * PHP version 5.4
 *
 * @author Jarvan <caoshuaijun@huoyunren.com>
 */
return array(
    // 车辆导出
    'truck_source-search' => array(
        "carnum" => "车牌号",
        "car_length" => "车长",
        "carriage_type" => "厢型",
        "rated_load" => "额定载重",
        "driver_name" => "司机姓名",
        "driver_phone" => "司机电话号码",
        "from" => "行政关系",
        "motorcade_name" => "车队",
        "city" => "位置"
    ),
    // 基地导出
    'warehouse-search' => array(
        "name" => "基地名称",
        "platform_code" => "基地编号",
        "province" => "省",
        "city" => "市",
        "address" => "地址",
        "orgcode" => "G7机构编码",
        "tender_type" => "评标方式",
        "first_audit_phone" => "一级审核人",
        "second_audit_phone" => "二级审核人"
    ),
    // 收货人导出
    'consignee-search' => array(
        "phone" => "手机号",
        "create_time" => "注册时间",
        "base_erp" => "基地ERP",
        "area_erp" => "片区ERP",
        "bind_time" => "绑定时间",
        "unbind_time" => "解绑时间",
        "bctime" => "最新签收时间"
    ),
    // 评标线路模板
    'tender_route-gettemp' => array(
        "from_province" => "起点省份",
        "from_city" => "起点城市",
        "to_province" => "终点省份",
        "to_city" => "终点城市",
        "price" => "最高价",
        "over_rate" => "超额标准"
    ),
    // 评标线路导出
    'tender_route-search' => array(
        "from_location" => "起始站点",
        "to_location" => "到达站点",
        "price" => "最高价",
        "over_rate" => "超额标准",
        "months" => "月份",
        "ship_method" => "运输方式",
    	"carriage_type" => "箱型",
    	"density" => "重泡货",
    ),
    // LBS导出
    'history-getHistoryMsg' => array(
        "month" => "年/月",
        "carrier_name" => "承运商",
        "count" => "条数",
    ),
    // LBS导出
    'history-getHistoryList' => array(
        "time" => "时间",
        "carrier_name" => "承运商名称",
        "carnum" => "车牌号",
        "phone" => "手机号",
        "address" => "定位位置",
    ),
    // 运输质量明细报表导出
    'statementlist-getOrderTrans' => array(
        "create_time" => "制单时间",
        "carrier_name" => "承运商",
        "driver_name" => "司机",
        "grade" => "打分",
    ),
    // 废标报表导出
    'statementlist-getAbandTenderList' => array(
        "shipment_code" => "标号",
        "name" => "基地",
        "carrier_name" => "承运商",
        "create_time" => "制单时间",
        "fromlocation" => "起点",
        "tolocation" => "终点",
        "weight" => "重量",
        "tender_time" => "发标时间",
        "aband_time" => "废标时间",
        "aband_remark" => "废标备注",
    ),
    // 取消中标导出
    'statementlist-getAbandWinBidList' => array(
        "shipment_code" => "标号",
        "name" => "基地",
        "relation_name" => "被取消中标方",
        "shipment_time" => "制单时间",
        "fromlocation" => "起点",
        "tolocation" => "终点",
        "weight" => "吨位",
        "quote_price" => "价格",
        "tender_time" => "发标时间",
        "create_time" => "取消中标时间",
        "responsible_party" => "责任方",
        "remark" => "取消中标备注",
    ),
    // 中标统计导出
    'statementlist-getWinBidList' => array(
        "name" => "基地",
        "carrier_name" => "承运商",
        "countQuote" => "报价数量",
        "countWin" => "中标数量",
    ),
    // 运输明细报表导出
    'statementlist-getShipmentReport' => array(
        "create_time" => "制单时间",
        "carrier_name" => "承运商",
        "driver_name" => "司机",
    	"carnum" => "车牌号",
    	"car_length" => "车长",
    	"car_type_name" => "车型",
        "fromlocation" => "起点",
        "tolocation" => "终点",
        "distance" => "距离",
        "weight" => "吨位",
        "price" => "金额",
        "shipment_method" => "运输方式",
        "shipment_code" => "单据号",
    ),
    //基地被投诉报表
    'statementlist-getAppealWU' => array(
        "responsible_name" => "基地名称",
        "create_time" => "被投诉时间",
        "remark" => "备注",
    ),
    //承运商被投诉报表
    'statementlist-getAppealCarrier' => array(
    "responsible_name" => "承运商名称",
    "create_time" => "被投诉时间",
    "remark" => "备注",
    ),

    //分级运价审批明细报表
    'statementlist-getRetifyList' => array(
        "plat_form_name" => "基地",
        "update_time" => "审批时间",
        "tolocation" => "终点",
        "weight" => "吨位",
        "volume" => "体积",
        "tender_price" => "中标价",
        "push_price" => "超标率",
        "first_audit" => "一级审批价",
        "second_audit" => "二级审批价",
    ),

    //一口价设置明细报表 (sunjie)
    'statementlist-oneprice_report' => array(
        "shipment_code" => "单据号",
        "name" => "基地",
        "carrier_name" => "承运商",
        "create_time" => "设置时间",
        "fromlocation" => "起点",
        "tolocation" => "终点",
        "weight" => "吨位",
        "old_price" => "中标价",
        "price" => "修改后价格",
    	"remark" => "备注",
    ),
//承运商竞标关注明细
    'statementlist-getCarrierAttentionDetail' => array(
        "shipment_code" => "标号",
        "carrier_name" => "承运商",
        "tender_time" => "发标时间",
        "is_read" => "是否阅读",
        "read_time" => "阅读时间",
        "quote" => "是否投标",
        "tender_quote_time" => "投标时间",
    ),
    //承运商竞标明细报表
    'statementlist-getCarrierBidDetail' => array(
        "shipment_code" => "标号",
        "name" => "基地",
        "carrier_name" => "承运商",
        "create_time" => "竞标时间",
        "quote_price" => "价格",
        "fromlocation" => "起点",
        "tolocation" => "终点",
        "status" => "是否中标",
        "price" => "中标价",
    ),
    //承运商考核报表
    'statementlist-getCarrierEvaluationList' => array(
        "carrier_name" => "承运商名称",
        "total_grade" => "运输服务质量",
        "quote_rate" => "竞标会标率",
        "arraive_num" => "到达时效",
        "send_car" => "派车时效",
        "order_num" => "运输质量",
        "lbs_rate" => "提供位置服务率",
    ),
    //基地考核报表
    'statementlist-getWareEvaluationList' => array(
        "name" => "承运商名称",
        "load_quality" => "装货质量",
        "total_grade" => "基地服务质量",
    ),
    //承运商排名报表
    'statementlist-getCarrierRankingList' => array(
        "carrier_name" => "承运商名称",
        "relation_person" => "联系人",
        "relation_phone" => "手机号",
        "delivery_times" => "运输次数",
        "order_num" => "运输质量",
        "total_price" => "运单金额",
        "total_grade" => "订单评分",
        "complain_num" => "投诉量",
        "total_distance" => "运输距离",
    ),
    //司机排名报表
    'statementlist-getDriverRankingList' => array(
        "driver_name" => "司机姓名",
        "driver_phone" => "手机号",
        "delivery_times" => "运输次数",
        "order_num" => "运输质量",
        "sign_num" => "打卡记录",
        "total_grade" => "订单评分",
        "complain_num" => "投诉量",
        "total_distance" => "距离",
        "total_weight" => "吨位",
    ),
    //到站中标价分析报表
    'statementlist-getArriveList' => array(
        "plat_form_name" => "基地",
        "carrier_name" => "承运商",
        "create_time" => "制单时间",
        "tolocation" => "终点",
        "price" => "中标价",
    ),
    //固定运价合同提醒报表
    'statementlist-getReportList' => array(
        "name" => "基地",
        "carrier_name" => "承运商",
        "create_time" => "合同时间",
        "start_time" => "起止时间",
    ),
    //回单明细报表
    'statementlist-getReceiptList' => array(
        "order_code" => "订单号",
        "plat_form_name" => "承运商",
        "create_time" => "制单时间",
        "first_business" => "业务员",
        "to_name" => "收货方",
        "carrier_name" => "承运商",
        "is_receipt" => "是否电子签收",
        "is_sign" => "是否回单",
    ),
    //电子签收明细报表
    'statementlist-getReceiptList' => array(
        "order_code" => "订单号",
        "plat_form_name" => "承运商",
        "create_time" => "制单时间",
        "first_business" => "业务员",
        "to_name" => "收货方",
        "carrier_name" => "承运商",
        "is_receipt" => "是否电子签收",
        "is_error_checkout" => "是否异常签收",
    ),
    //费用明细报表（司机）
    'statementlist-getLbsCost' => array(
    "driver_phone" => "司机手机号",
    "driver_name" => "司机姓名",
    "user_type_str" => "定位人",
    "create_time" => "定位时间",
    "address" => "定位位置",
),
    //调度单定位明细报表
    'statementlist-getLbsDetailList' => array(
    "shipment_code" => "运单号",
    "plat_form_name" => "基地",
    "carrier_name" => "承运商",
    "lbs_type" => "定位类型",
    "lbs_count" => "LBS定位次数",
),

    //发标、中标时间明细报表 sunjie
    'statementlist-tenderlist' => array(
        "shipment_code" => "单据号",
        "name" => "基地",
        "create_time" => "发标时间",
        "tender_limit" => "竞标截止时间",
        "quote_time" => "中标时间",
        "kaibiao" => "开标时间差",
        "pingbiao" => "评标时间差",
    ),
    //lbs费用统计报表 sunjie
    'statementlist-lbsConstStatistical' => array(
        "company" => "单位",
        "company_type" => "单位类型",
        "total" => "条数",
        "total_price" => "金额",
    ),
    //lbs费用明细报表（调度单） sunjie
    'statementlist-lbsCostShipment' => array(
        "shipment_code" => "调度单号",
        "carrier_name" => "承运商",
        "create_time" => "定位时间",
        "address" => "定位位置",
    ),
    //改标明细报表 sunjie
    'statementlist-changeTender' => array(
        "shipment_code" => "标号",
        "name" => "基地",
        "fromlocation" => "起点",
        "tolocation" => "终点",
        "weight" => "吨位",
        "old_creat_time" => "发标时间",
        "old_tender_limit" => "原发标的报价截止时间",
        "tender_limit" => "改标后的报价截止时间",
        "create_time" => "改标时间",
    ),
//调度单导出
		'shipment-getShipmentsForW' => array(
				"shipment_code" => "运单号",
				"shipment_method" => "运输方式",
				"carrier_name" => "承运商名称",
				"price" => "含税总价",
				"unit_price" => "含税单价",
				"price_type" => "报价方式",
				"serial_num" => "连续号",
				"quality" => "件数",
				"weight" => "重量",
				"volume" => "体积",
				"fromlocation" => "出发地",
				"tolocation" => "目的地",
				"tender_status_view" => "运单状态",
				"carnum" => "车牌号",
				"driver_name" => "司机姓名",
				"driver_phone" => "联系方式",
				"create_time" => "制单时间",
				"arrivewh_time" => "进厂时间",
				"leavewh_time" => "出厂时间",
				"arrival_date" => "运抵时间"
		),
		//派车管理导出
		'tender-getShipmentsForM' => array(
				"shipment_code" => "运单号",
				"shipment_method" => "运输方式",
				"fromlocation" => "出发地",
				"tolocation" => "目的地",
				"tender_status_view" => "招投标状态",
				"price" => "一口价",
				"carrier_name" => "中标承运商",
				"carnum" => "车牌号",
				"driver_name" => "司机姓名",
				"driver_phone" => "联系方式",
				"quality" => "装车件数",
				"weight" => "重量",
				"volume" => "体积",
				"create_time" => "发标时间",
				"tender_limit" => "竞标截止时间",
				"bid_time" => "中标时间"
		),
		//订单管理导出
		'order-manageOrderList' => array(
				"order_code" => "订单号",
				"quality" => "件数",
				"receipt1" => "回单状态",
				"shipment_method" => "运输方式",
				"first_business" => "一级业务员",
				"business_type" => "业务类型",
				"tolocation" => "目的地",
				"to_name" => "收货方",
				"to_phone" => "收货方联系电话",
				"create_time" => "开单时间",
				"checkout1" => "签收状态",
				"checkout_list1" => "是否异常",
				"fromlocation" => "出发地",
				"from_name" => "发货方名称",
				"carnum" => "车牌号",
				"driver_name" => "司机姓名",
				"driver_phone" => "司机电话"
		),
    //承运商我的运单导出
    'shipment-getShipments' => array(
        "shipment_code" => "运单号",
    	"serial_num" => "连续号",
        "business_type" => "业务类型",
        "orderCheck" => "订单回单状态",
    	"orderIds" => "订单IDs",
        "shipment_method" => "运输方式",
        "fromlocation" => "出发地",
        "tolocation" => "目的地",
        "carnum" => "车牌号",
        "driver_name" => "司机姓名",
        "driver_phone" => "联系方式",
        "quality" => "装车件数",
        "weight" => "重量",
        "volume" => "体积",
        "plan_leave_time" => "计划发车时间",
    	"plan_leave_date" => "计划发车日期",
        "plan_arrive_time" => "计划到达时间",
        "unit_price" => "单价",
        "price" => "总价",
    	"arrivewh_time"=>"进厂时间",
    		"leavewh_time"=>"出厂时间",
    		"arrival_date"=>"运抵时间",
    ),
  //承运商列表导出
    'carrier-search' => array(
        "carrier_name" => "承运商名称",
        "trans_type" => "运输类型",
        "status_text" => "审核状态",
        "organizing_code" => "组织机构代码",
        "province" => "所在省",
        "city" => "所在市",
        "is_invoice_text" => "代开票",
        "real_invoice_rate_text" => "开票点数",
        "invoice_rate_text" => "税点",
        "g7s_orgcode" => "G7机构编号",
        "relation_person" => "业务联系人",
        "relation_phone" => "联系人手机号",
        "create_time" => "注册时间",
        "name" => "审核机构",
    ),

);
