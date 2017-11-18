<?php
/** 
 * 运单操作类
 * Author Zhm
 * 2016-07-12
 */

class shipment extends control{

	/**
	 * 获取运单列表
	 * Author ZHM
	 * 2016-7-12
	 */
	public function getShipments() {
		$params = fixer::input('request')->get();
		$data = $this->loadService('shipment')->getShipments($params);
        $this->view->result = $data;
        $this->display();
	}
	/**
	 * 获取运单id列表
	 * Author ZHM
	 * 2016-7-13
	 */
	public function getShipmentCodes() {
		$params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->getShipmentCodes($params);
        $this->view->result = $data;
        $this->display();
	}
	/**
	 * 获取司机列表
	 * Author ZHM
	 * 2016-7-13
	 */
	public function getDrivers() {
		$params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->getDrivers($params);
        $this->view->result = $data;
        $this->display();
	}
	/**
	 * 获取车牌列表
	 * Author ZHM
	 * 2016-7-13
	 */
	public function getCarnums() {
		$params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->getCarnums($params);
        $this->view->result = $data;
        $this->display();
	}
	/**
	 * 获取司机手机号列表
	 * Author ZHM
	 * 2016-7-13
	 */
	public function getDriver_phone() {
		$params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->getDriver_phone($params); 
        $this->view->result = $data;
        $this->display();
	}

    /**
     * 获取运单相关订单列表
     * Author ZHM
     * 2016-7-13
     */
    public function getOrderList() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->getOrderList($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 运单相关订单列表打印运输凭证专用
     * Author SUNJIE
     * 2017-1-12
     */
    public function getOrderListPrint() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->getOrderListPrint($params);
        $this->view->result = $data;
        $this->display();
    }

	/**
	 * 获取运单相关订单列表
	 * Author Ivan
	 * 2016-9-18
	 */
	public function getOrderListById() {
		$params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->getOrderListById($params);  
        $this->view->result = $data;
        $this->display();
	}
	/**
	 * 转包上报
	 * Author ZHM
	 * 2016-7-13
	 */
	public function subcontracting() {
		$params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->subcontracting($params);
        $this->view->result = $data;
        $this->display();
	}
	/**
	 * 承运商运单列表转包上报
	 * Author Ivan
	 * 2016-7-13
	 */
	public function applySubcontract() {
		$params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->applySubcontract($params);
        $this->view->result = $data;
        $this->display();
	}  
	/**
	 * Desc:进出厂扫码验证
	 * @Author Lvison
	 */
	public function checkScan(){
		$params = fixer::input('request')->getArray();
		$data = $this->shipmentService->checkScan($params);
		$this->view->result = $data;
		$this->display();
	}

	/**
	 * 2016-7-21
	 * Author ZHM
	 * 同步运单数据
	 */
	public function syncShipment(){
		$params = fixer::input('request')->getArray();
		$data = $this->loadService('shipment')->syncShipment($params['param']);
		$this->view->result = $data;
		$this->display();
	}

	/**
	 * 2016-7-26
	 * Author ZHM
	 * 身份验证
	 */
	public function getRole() {
		$params = fixer::input('request')->getArray();
		$data = $this->loadService('shipment')->getRole($params);
		$this->view->result = $data;
		$this->display();
	}

	/**
	 * 2016-7-26
	 * Author ZHM
	 * 身份验证
	 */
	public function dispatchCarnum() {
		$params = fixer::input('request')->getArray();
		$data = $this->loadService('shipment')->dispatchCarnum($params);
		$this->view->result = $data;
		$this->display();
	}
	/**
	 * 定时任务推送微信提醒
	 */
	public function pushoverdueinfo() {
		$params = fixer::input('request')->getArray();
		$data = $this->loadService('shipment')->pushoverdueinfo($params);
		$this->view->result = $data;
		$this->display();
	} 
	/**
	 * 2016-7-27
	 * Author ZHM
	 * 获取承运商列表
	 */
	public function getBaseCarriers() {
		$params = fixer::input('request')->getArray();
		$data = $this->loadService('shipment')->getBaseCarriers($params);
		$this->view->result = $data;
		$this->display();
	}
	/**
	 * 2016-7-27
	 * Author ZHM
	 * 获取承运商车辆
	 */
	public function getCarrierCarnums(){
		$params = fixer::input('request')->getArray();
		$data = $this->loadService('shipment')->getCarrierCarnums($params);
		$this->view->result = $data;
		$this->display();
	}
	/**
	 * 获取出发地列表
	 * Author ZHM
	 * 2016-8-10
	 */
	public function getFromlocation() {
		$params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->getFromlocation($params); 
        $this->view->result = $data;
        $this->display();
	}
	/**
	 * 获取目的地列表
	 * Author ZHM
	 * 2016-8-10
	 */
	public function getTolocation() {
		$params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->getTolocation($params);
        $this->view->result = $data;
        $this->display();
	}

	/**
	 * 获取运单详情
	 * Author sunjie
	 * 2016-8-30
	 */
	public function getShipmentInfo(){
		$params = fixer::input('request')->get();
		$data = $this->loadService('shipment')->getShipmentInfo($params);
		$this->view->result = $data;
		
		if (property_exists($params, 'openid') || $params->openid != '') {
			$this->view->result->_orders = $this->loadService('order')->getOrders($params);;
		}else{
			$this->view->result->_orders = $this->loadService('order')->_getOrders(array('shipment_id'=>$params->id));;
		}
		
		
		$this->display();
	}
	/**
     * Desc:获取当前省的货源信息
     * @Author Ivan
     */
     public function getOrderSource(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->getOrderSource($fix);
        $this->display();
    }
     /**
     * Desc:获取当前省的老货源信息
     * @Author Ivan
     */
     public function getOldOrderSource(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->getOldOrderSource($fix);
        $this->display();
    }
    /**
     * Desc:获取承运商关联基地所在省份
     * @Author Ivan
     */
     public function getProvince(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->getProvince($fix);
        $this->display();
    }
    /**
     * Desc: 获取承运商关系省份的历史货源信息
     * @Author Ivan
     */
     public function getOldCarrierSource(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->getOldCarrierSource($fix);
        $this->display();
    }
    /**
     * Desc: 获取承运商关系省份的货源信息
     * @Author Ivan
     */
     public function getSourceByProvince(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->getSourceByProvince($fix);
        $this->display();
    }
    /**
     * Desc: 司机查看货源详细信息
     * @Author Ivan
     */
     public function getOrderSourceDetail(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->getOrderSourceDetail($fix);
        $this->display();
    }
    /**
     * Desc:司机提交签收申请获取收货人列表
     * @Author Ivan
     */
    public function applicationReceived(){
        $fix = fixer::input('request')->get();
        $this->view->result = $this->loadService('shipment')->applicationReceived($fix);
        $this->display();
    }
     /**
     * Desc:司机提交签收申请向收货人推送消息
     * @Author Ivan
     */
    public function sendMsgByOpenid(){
        $fix = fixer::input('request')->get();
        $this->view->result = $this->loadService('shipment')->sendMsgByOpenid($fix);
        $this->display();
    }
    /**
     * Desc:司机事件上报
     * @Author Ivan
     */
     public function saveEventReport(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->saveEventReport($fix);
        $this->display();
    }
    /**
     * Desc: 获取承运商平台车源信息
     * @Author Ivan
     */
     public function getTruckSourceByOpenid(){
        $fix = fixer::input('request')->get();
        $this->view->result =$this->loadService('shipment')->getTruckSourceByOpenid($fix);
        $this->display();
    }
    /**
     * Desc: 获取司机姓名电话及当前位置（平台车源微信）
     * @Author Ivan
     */
     public function getDriverMsg(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->getDriverMsg($fix);
        $this->display();
    }
     /**
     * Desc: 获取司机长跑路线列表
     * @Author Ivan
     */
     public function getRouteList(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->getRouteList($fix);
        $this->display();
    }
    /**
     * Desc: 司机添加长跑线路
     * @Author Ivan
     */
     public function saveDriverRoute(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->saveDriverRoute($fix);
        $this->display();
    }
    /**
     * Desc: 司机删除长跑路线
     * @Author Ivan
     */
     public function delDriverRoute(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->delDriverRoute($fix);
        $this->display();
    }


	/**
	 * Desc: 获取车辆当前位置
	 * @Author sunjie
	 */
	public function getAddress(){
		$fix = fixer::input('request')->getArray();
		$this->view->result = $this->loadService('shipment')->getAddress($fix);
		$this->display();
	}

    /**
     * Desc: 检查运单的招标状态
     * @Author sunjie
     */
    public function checkTenderStatus(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->checkTenderStatus($fix);
        $this->display();
    }

    /**
     * Desc: 保存招标
     * @Author sunjie
     */
    public function saveTender(){
        $fix = fixer::input('request')->getArray();

        $this->view->result = $this->loadService('shipment')->saveTender($fix);
        $this->display();
    }

    /**
     * Desc: 获取运单的投标信息
     * @Author sunjie
     */
    public function tenderQuoteList(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->tenderQuoteList($fix);
        $this->display();
    }

    /**
     * Desc: 改变投标状态
     * @Author sunjie
     */
    public function changeTenderQuote(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->changeTenderQuote($fix);
        $this->display();
    }
    /**
     * Desc: 通过orgcode查看是否为承运商
     * @Author Ivan
     */
    public function checkeCarrier(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('shipment')->checkeCarrier($fix);
        $this->display();
    }

	/**
	 * Desc:运单回放
	 * @Author Lvison
	 */
	public function checkHistory(){
		$fix = fixer::input('request')->getArray();
		$this->view->result = $this->loadService('shipment')->checkHistory($fix);
		$this->display();
	}
    /**
     * Desc:调度触发进厂事件
     * @Author Lvison
     */
    public function enterFactory(){
        $fix = fixer::input('request')->get();
        $this->view->result = $this->loadService('shipment')->enterFactory($fix);
        $this->display();
    }
    /**
     * Desc:调度触发出厂事件
     * @Author Lvison
     */
    public function outFactory(){
        $fix = fixer::input('request')->get();
        $this->view->result = $this->loadService('shipment')->outFactory($fix);
        $this->display();
    }

	/**
	 * Desc:运抵操作
	 * @Author Lvison
	 */
	public function complete(){
		$fix = fixer::input('request')->getArray();
		$this->view->result = $this->shipmentService->complete($fix);
		$this->display();
	}



    /**
     * Desc:指定司机
     * @Author sunjie
     */
    public function cpecify_driver(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->shipmentService->cpecify_driver($fix);
        $this->display();
    }
    /**
     * Desc:查改该承运商下司机
     * @Author sunjie
     */
    public function getDriverPhones(){
        $fix = fixer::input('request')->get();
        $this->view->result = $this->shipmentService->getDriverPhones($fix);
        $this->display();
    }
    /**
     * Desc:依据电话获取司机信息
     * @Author sunjie
     */
    public function getDriverMessage(){
        $fix = fixer::input('request')->get();
        $this->view->result = $this->shipmentService->getDriverMessage($fix);
        $this->display();
    }
    /**
     * Desc:依据运单id获取订单信息
     * @Author ivan
     */
    public function getOrderMsg(){
        $fix = fixer::input('request')->get();
        $this->view->result = $this->loadService('shipment')->getOrderMsg($fix);
        $this->display();
    }
    /**
     * Desc:更新固定运价是否阅读
     * @Author ivan
     */
    public function updateIsReader(){
        $fix = fixer::input('request')->get();
        $this->view->result = $this->loadService('shipment')->updateIsReader($fix);
        $this->display();
    }

    /**
     * Desc:获取LBS定位
     * @Author sunjie
     */
    public function lbs(){
        $fix = fixer::input('request')->get();
        $this->view->result = $this->loadService('shipment')->lbs($fix);
        $this->display();
    }
    /**
     * 获取订单号
     * Author ZHM
     * 2016-7-13
     */
    public function getOrderCodes() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->getOrderCodes($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 获取连续号
     * Author ZHM
     * 2016-7-13
     */
    public function getSerialNum() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->getSerialNum($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 获取相关单据号
     * Author ZHM
     * 2016-7-13
     */
    public function getRelateBill() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->getRelateBill($params);
        $this->view->result = $data;
        $this->display();
    }

    //定时任务获取LBS定位
    public function lbsTiming(){
        $data =  $this->loadService('history')->lbsTiming();
        $this->view->result = $data;
        $this->display();

    }
    
    public function test(){
    	$this->loadService('tender')->carrierAssignCarWechatMessage(array('shipment_id' =>'52447','driver_phone'=>'18081069689'));
    }

    /**
     * 绑定天眼设备
     * 2017-10-20
     */
    public function binding(){
        $params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->binding($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 获取天眼设备
     * 2017-10-24
     */
    public function getTycode(){
        $params = fixer::input('request')->get();
        $data = $this->loadService('shipment')->getTycode($params);
        $this->view->result = $data;
        $this->display();
    }

    public function test2(){
        $fix = fixer::input('request')->getArray();
        $data = $this->loadService('shipment')->test2($fix);
        $this->view->result = $data;
        $this->display();
    }
}


