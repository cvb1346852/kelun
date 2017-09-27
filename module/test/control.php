<?php

class test extends control{

    /**
     * Desc:订单状态变更
     * @Author Lvison
     */
	public function testSendOrderSignInfo(){
        $data = array('code'=>'XC2816072800056','type'=>1,'time'=>date('Y-m-d H:i:s'));
        $result = $this->loadService('client')->webServiceRequest('sendOrderSignInfo',$data);
        $this->view->data  = $result;
        $this->display();
    }

    /**
     * Desc:短信推送
     * @Author Lvison
     */
    public function testSendSMS(){
        $data = array('phone'=>'15002844993','content'=>'您的验证码{586978}请在5分钟内使用有效');
        $result = $this->loadService('client')->webServiceRequest('sendOrderSignInfo',$data);
        $this->view->data  = $result;
        $this->display();
    }

    /**
     * Desc:运单状态变更
     * @Author Lvison
     */
    public function testSendShipmentStatus(){
        $data = array('code'=>'D011140918002','type'=>"3",'time'=>date('Y-m-d H:i:s'));
        $result = $this->loadService('client')->webServiceRequest('sendShipmentStatus',$data);
        $this->view->data  = $result;
        $this->display();
    }

    /**
     * Desc:推送承运商到TMS
     * @Author Lvison
     */
    public function testSendCarrier(){
        $data = array('name'=>'东皓物流有限责任公司',
            'organizing_code'=>'DHWL20060923',
            'simple_name'=>'东皓物流',
            'plat_form_code'=>'02,04',
            'city' =>'成都',
            'contact' => '浩东',
            'phone' => '15999999999',
            'fax' => '02856895689',
            'email' => 'haodong@donghao.com',
            'address' => '四川省成都市武侯区百花西路1号',
            'post_code' => '620000'
        );
        $result = $this->loadService('client')->webServiceRequest('sendCarrier',$data);
        $this->view->data  = $result;
        $this->display();
    }

    public function testCreateTinyUrl(){
        $url = 'http://demo.industry.project.g7s.chinawayltd.com/wechat/order_auth_detail.html?openid=xiaoshou&order_code=ZG123D4896&auth_status=1';
        $url = $this->loadService('client')->createTinyUrl($url);
        if($url['code'] == 1){
            $this->view->data  = $url['tinyUrl'];
        }else{
            $this->view->data  = $url['message'];
        }
        $this->display();
    }

    public function testCreateTinyUrlSina(){
//        $url = 'http://demo.industry.project.g7s.chinawayltd.com/wechat/order_auth_detail.html?openid=xiaoshou&order_code=ZG123D4896';
        $url = 'http://www.eyao56.com';
        $url = $this->loadService('client')->createTinyUrlSina($url);
        if($url['code'] == 1){
            $this->view->data  = $url['tinyUrl'];
        }else{
            $this->view->data  = $url['message'];
        }
        $this->display();
    }

    //中标信息推送到TMS
    public function sendBindConfirm(){
        $data = array('code'=>'D011150527002',//运单号
            'organizing_code'=>"CDWNWLYXGS",//中标承运商组织机构代码
            'carrier_name' => '成都伟能物流有限公司',//中标承运商
            'carnum' => '川A123456',//车牌
            'driver_name' => '张三',//中标车辆司机姓名
            'driver_phone' => '15002889696',//中标车辆司机电话
            'tender_price' => '4000',//中标价格(整车)
            'price' => '100',//每吨报价
            'weight' => '40',//吨数
            'tender_type' => '按吨报价'//按车报价：按吨报价
        );
        $result = $this->loadService('shipment')->sendBindConfirm('56');
        $this->view->data  = $result;
        $this->display();
    }

    //取消中标信息推送的TMS
    public function sendBindCancel(){
        $data = array('code'=>'D011150527002',//运单号
            'time'=>"2016-10-24 12:00:00"//取消中标时间
        );
        $result = $this->loadService('client')->webServiceRequest('sendBindCancel',$data);
        $this->view->data  = $result;
        $this->display();
    }

    /**
     * Desc:订单同步接口自测
     * @Author Lvison
     */
    public function syncOrderTest(){
        $param = '{"code": "SO2816012502487",
                "type": "1",
                "plat_form_code": "01",
                "plat_form_name": "四川科伦药业股份有限公司",
                "shipment_method": "整车运输",
                "fromlocation": "新都仓库",
                "from_address": "新都区工业大道东段520号 13541005837",
                "from_lnglat": "104.05905,30.81175",
                "tolocation": "武汉市",
                "to_address": "武汉市",
                "to_lnglat": "0.0,0.0",
                "distance": 1395,
                "quality": 2,
                "weight": 0.03832,
                "volume": 0.06217,
                "from_name": "四川科伦药业股份有限公司",
                "to_name": "四川同利药业有限公司",
                "to_phone": "13550321088",
                "plan_leave_time": "2016-01-25 14:40:00",
                "plan_arrive_time": "2016-01-25 14:40:00",
                "first_business": "宫铮2",
                "relateBill": "",
                "remark": "",
                "order_detail": [
                    {
                        "line_no": 10,
                        "product_name": "注射用头孢唑林钠",
                        "specification": "0.5g*10支*100盒",
                        "lot": "",
                        "serial": "粉针",
                        "unit_name": "箱",
                        "quality": 2,
                        "weight": 0.03832,
                        "volume": 0.06217,
                        "manufacturer": "湖南科伦制药有限公司岳阳分公司"
                    }
                ]
            }';
        $data = $this->loadService('order')->syncOrder($param);
        $this->view->data  = $data;
        $this->display();
    }

    /**
     * Desc:运单接口自测
     * @Author Lvison
     */
    public function syncShipmentTest(){
        /*$param = '{
            "code": "D011161031002",
            "type": "1",
            "plat_form_code": "01",
            "plat_form_name": "四川科伦药业股份有限公司",
            "shipment_method": "整车运输",
            "fromlocation": "新都仓库",
            "from_lnglat": "104.05905,30.81175",
            "tolocation": "武汉市",
            "to_lnglat": "0.0,0.0",
            "carrier_name": "",
            "serial_num": "Y01116100005",
            "distance": 1395,
            "quality": 10,
            "weight": 0.03832,
            "volume": 0.06217,
            "plan_leave_time": "2016-12-01 11:35:00",
            "plan_arrive_time": "2016-12-03 11:35:00",
            "status": "1",
            "ordercodes": "SO2816012502487,",
            "vehicle_type": ""
        }';*/

        $param = '{"code":"D011161101001",
        "type":"1",
        "plat_form_code":"01",
        "plat_form_name":"四川科伦药业股份有限公司",
        "shipment_method":"整车运输",
        "fromlocation":"新都仓库",
        "from_lnglat":"104.05905,30.81175",
        "tolocation":"上海市",
        "to_lnglat":"0.0,0.0",
        "carrier_name":"",
        "serial_num":"Y01116110001",
        "distance":2176,
        "quality":1250,
        "weight":17.192999999999998,
        "volume":50.318799999999996,
        "plan_leave_time":"",
        "plan_arrive_time":"",
        "status":"1",
        "ordercodes":"T201611010001,5I0133313091701991,",
        "vehicle_type":""}';
        $data = $this->loadService('shipment')->syncShipment($param);
        $this->view->data  = $data;
        $this->display();
    }

}