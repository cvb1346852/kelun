<?php
class orderService extends service
{
    /*相差距离报警*/
    private $distances = 1;

    public function __construct()
    {
        parent::__construct();
    }
    /**
     * 签收人获取需要签收的订单详情
     * @param $args
     * @return array
     */
    public function detail($args)
    {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $return = [];
        if (isset($params->order_id) && $params->order_id != '') {
            $data = $this->dao->selectList('order.getOrderProduct', $params);
            $return = ['code' => 0, 'data' => $data];
        } else {
            $return = ['code' => 1, 'msg' => '未找到订单号'.$params->order_id];
        }
        return $return;
    } 
    /**
     * 签收人获取订单列表
     * @param $args
     * @return array
     */
    public function orderList($args)
    {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $user_code=$this->dao->selectOne('order.getUserCodeByPhone',array('phone'=>$params->to_phone));
        if(!empty($user_code)){
            if($user_code->base_user_code == '' && $user_code->area_user_code == ''){
               $return = ['code'=>1,'msg'=>'未绑定ERP账号，订单不可查询'];
            }
            if($user_code->base_user_code!=''){
                $params->user_code=$user_code->base_user_code;
            }else if($user_code->area_user_code!=''){
                $params->user_code=$user_code->area_user_code;
            }
        }
        //$params->role_condition = 'WHERE o.to_phone = #to_phone# ';
        $params->role_condition = 'WHERE oe.user_code = #user_code# ';
        $checkoutIn = [];
        if ($params->checkout == 1) {
            $checkoutIn[] = 1;
        } elseif ($params->checkout == 2) {
            $checkoutIn[] = 2;
            $checkoutIn[] = 3;
            $checkoutIn[] = 4;
            $checkoutIn[] = 5;
        }
        $params->checkoutIn = $checkoutIn;
        if ((isset($params->to_phone) && $params->to_phone != '') || ($params->orgcode != '' )||($params->openid != '' )) {
            $data = $this->dao->selectPage('order.getOrderList_wechat', $params);
            if($params->checkout == 2 && !empty($data->result)){
                foreach($data->result as $key=>$value){
                    $sign = $this->dao->selectOne('order.getOrderCheckoutDetail', array("order_id"=>$value->id));
                    $value->signTime = date('Y/m/d H:i',strtotime($sign->create_time));
                }
            }
            $data->checkoutIn = $checkoutIn['0'] == 1 ? true : false;
            $return = ['code' => 0, 'data' => $data];
        } else {
            $message =   $params->orgcode == '' ? '获取调度信息失败!' : '获取签收人手机号失败!';
            $return = ['code' => 1, 'msg' => $message];
        }
        return $return;
    }


    /**
     * 调度获取订单列表
     * @param $args
     * @return array
     */
    public function dispatchOrderList($args)
    {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        //获取微信用户的基础信息
        $wechatUser = $this->dao->selectOne('user.getUserInfoByOpenid',array('openid'=>$params->openid));
        if(!empty($wechatUser->openid)) {
            //调度
            if ($wechatUser->user_type == '5') {
                $wechatUserInfo = $this->dao->selectOne('warehouse.getWarehouseUser', array('phone' => $wechatUser->phone));
                $warehouseInfo = $this->dao->selectOne('warehouse.selectPage', array('id' => $wechatUserInfo->warehouse_id));
                $params->orgcode = $warehouseInfo->orgcode;
                $params->role_condition = 'WHERE o.shipment_id IN (SELECT s.id FROM `shipment` AS s WHERE s.warehouse_id = "'.$wechatUserInfo->warehouse_id.'" )';
            }
        }
        $checkoutIn = [];
        if ($params->checkout == 1) {
            $checkoutIn[] = 1;
        } elseif ($params->checkout == 2) {
            $checkoutIn[] = 2;
            $checkoutIn[] = 3;
            $checkoutIn[] = 4;
            $checkoutIn[] = 5;
        }
        $params->checkoutIn = $checkoutIn;

        if ($params->orgcode != '' ){
            $data = $this->dao->selectPage('order.getOrderList', $params);
            $return = ['code' => 0, 'data' => $data];
        } else {
            $message =   $params->orgcode == '' ? '获取调度信息失败!' : '获取签收人手机号失败!';
            $return = ['code' => 1, 'msg' => $message];
        }
        return $return;
    }

    /*获取订单列表用于订单管理列表*/ 
    public function manageOrderList($args)
    {   
        $fixer = fixer::input($args);
        $params = $fixer->get();
        //var_dump($params);exit;
        //var_dump($params);exit;
        //查订单列表
        $checkout_type = null; 
        if($params->checkout  != 1 && $params->checkout  != ""){ 
            $params->checkout =  array(2,3,4,5);
            $checkout_type = 2;
        }elseif($params->checkout  == 1){
            $params->checkout =  array(1);
            $checkout_type = 1;
        }
        /*$params->fromTime = explode(" - ",$params->statixstic_date)[0]; 
        $params->toTime = explode(" - ",$params->statixstic_date)[1];*/
        $params->create_time1 = explode(" - ",$params->create_time)[0];
        $params->create_time2 = explode(" - ",$params->create_time)[1];
        /*回单时间查询   时间处理*/
        $params->receipt_time1 = explode(" - ",$params->receipt_time)[0].' 00:00:00';
        $params->receipt_time2 = explode(" - ",$params->receipt_time)[1].' 23:59:59';
        //添加出发地和目的地的筛选
        /*$params->fromlocation = $params->ddlProvince.''.$params->ddlCity;
        $params->tolocation = $params->toloProvince.''.$params->toloCity;*/
        //基地查询下属订单
        $platform_code = $this->dao->selectOne('order.getplatform_code', array("orgcode"=>$params->orgcode));

        $params->platform_code = $platform_code->platform_code;
        $params->sortColumns = 'o.create_time desc';
        if($params->userrole == "warehouse"){
            $params->role_condition = 'LEFT JOIN `warehouse` AS `w` ON o.plat_form_code = w.platform_code WHERE o.plat_form_code = #platform_code#';

            $order = $this->dao->selectPage('order.getmanageOrderlist', $params);
            if($order->result){
                foreach($order->result as $key=>$val){
                    switch ($val->checkout) {
                               case '3':
                                   $order->result[$key]->checkout_list1 = '有异常';
                                   break;
                               case '4':
                                   $order->result[$key]->checkout_list1 = '有异常';
                                   break;
                               default:
                                   $order->result[$key]->checkout_list1 = '无异常';
                                   break;
                           }
                        
                          if($val->receipt_status==0){
                              $order->result[$key]->receipt1 = '未回单';
                          }else{
                              $order->result[$key]->receipt1 = '已回单';
                          }

                          if($val->checkout_type != 2){
                            switch ($val->checkout) { 
                            case '1':
                                $order->result[$key]->checkout1 = '未签收';
                                break;  
                            case '2':
                                $order->result[$key]->checkout1 = '已签收';
                                break; 
                            case '3':
                                $order->result[$key]->checkout1 = '已签收';
                                break; 
                            default:
                                $order->result[$key]->checkout1 = '签收确认';
                                break;
                          }
                         }else{
                                switch ($val->checkout) {
                                case '2':
                                    $order->result[$key]->checkout1 = '正常签收';
                                    break; 
                                case '3':
                                    $order->result[$key]->checkout1 = '异常签收';
                                    break; 
                                case '4':
                                    $order->result[$key]->checkout1 = '签收处理';
                                    break;  
                                case '5':
                                    $order->result[$key]->checkout1 = '签收确认';
                                    break;
                                default: 
                                    break;
                             } 
                        } 

                       if($val->from_province == $val->to_province){
                            $order->result[$key]->business_type = '省内';
                       }else{
                           $order->result[$key]->business_type = '省外';
                       }
                }
            }
        }

        $order->checkout_type = $checkout_type;
        $order->dateTime = date("Y-m-d H-i-s");
        return $order;
    }
        /**
     * 获取司机列表
     * Author ZHM
     * 2016-7-13 
     */
    public function getCodetruckinfo($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $data = $this->loadService('shipment')->getRole($params);
        if($data["code"] == 1){
            //查基地下的所有承运商
            $rt = $this->dao->selectList('order.getBasecarrier', $params);
            //查承运商所有的车辆信息
            $carrier_idArr = $rt;
            $rt = $this->dao->selectList('order.getCarriertruck',$carrier_idArr);
            $rt2 = $this->dao->selectList('order.getCarrierShipmentTruck',$carrier_idArr);

            $rt =array_merge($rt,$rt2);
               $driver_name = array();
               $driver_phone = array();
               $carnum = array();
              foreach($rt as $k=>$v){
                  //填写数据是，模糊查询
                  if(!empty($params->carnum)){
                      if(strstr($v->carnum,$params->carnum)){
                          $carnum[] = $v->carnum;
                      }
                  }elseif(!empty($params->driver_name)){
                      if(strstr($v->driver_name,$params->driver_name)){
                          $driver_name[] = $v->driver_name;
                      }
                  }elseif(!empty($params->getDriver_phone)){
                      if(strstr($v->driver_phone,$params->getDriver_phone)){
                          $driver_phone[] = $v->driver_phone;
                      }
                  }
              }
              if($params->type == 1){
                $driver_name = array_unique($driver_name);
                return $driver_name ;
              }else if($params->type == 2){
               $driver_phone = array_unique($driver_phone);
                return $driver_phone ;
              }else if($params->type == 3){
               $carnum = array_unique($carnum);
                return $carnum ; 
              }
        }else{
            throwException('身份验证失败');
        }
    }
    
    /*将签收状态改为 签收确认 signOk*/
    public function signOk($args)
    {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $params->order_codes=explode(',',$params->order_code);
        $result = null;
        //判断运单是否运抵
        if(!empty($params->order_codes)){
            foreach($params->order_codes as $key=>$val){
                $getshipmentSt = $this->dao->selectOne('order.getOrders', array("order_code"=>$val));
                if(intval($getshipmentSt->status_s) < 7){
                    return ['code' => 1, 'msg' => '调度单未运抵,回单失败'];
                }
            }
          
        }

        if(!empty($params->order_codes)){
          foreach($params->order_codes as $key=>$val){
                  //签收正常    状态改为签收确认
                  $res = $this->dao->update('order.signOk', array("order_code"=>$val,"receipt_status"=>1,'receipt_time'=>true));
                      $ImageOld = $this->dao->selectOne('order.getCheckoutDetailByCode', array('order_code'=>$val));
                      if(!empty($ImageOld)){
                          $rt_update = $this->dao->update('order.updataAbnormalImage', array("order_code"=>$val,'remark_receipt'=>$params->remark_receipt));
                            $result=1;
    
                      }else{
                          $params->order_id =  $this->dao->selectOne('order.getOrderId', array("order_code"=>$val ))->id;
                          $rt_insert = $this->dao->insert('order.insertImage', array("order_code"=>$val,'create_time'=>date('Y-m-d H:i:s'),'remark_receipt'=>$params->remark_receipt));
                          $result=1;
                      }                 
                  //推送订单签收信息到TMS
                  $data = array('code'=>$val,'type'=>1,'time'=>date('Y-m-d H:i:s'));
                  $this->loadService('client')->webServiceRequest('sendOrderSignInfo',$data);
                  $result = $res;
            }
        }
        if($result > 0){
            return ['code' => 0];
        }else{
            return ['code' => 1, 'msg' => '回单失败'];;
        }
    }
    /**
     * 获取订单详细列表
     * Author ZHM
     * 2016-7-13
     */
    public function getOrderinfoprint($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();    
        $rt = $this->dao->selectPage('order.getOrderinfoprint', $params);   
        /*生成条形码*/
        return $rt;
    } 
     /**
     * 通过carrier_id获取承运商信息
     * Author ZHM
     * 2016-7-13
     */
    public function getBycarrierId($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();   
        $rt = $this->dao->selectOne('order.getBycarrierId', $params); 
        return $rt;
    }
    /**
     * 销售签收
     * @param $args
     */
    public function checkout($args)
    {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $return = [];
        if (isset($params->order_id)) {
            $params = object2array($params);
            $order = $this->dao->selectOne('order.getOrderInfo', ['id' => $params['order_id']]);
            //数据严谨性判断
            $getshipmentSt = $this->dao->selectOne('order.getOrders', array("order_code"=>$order->order_code));
            if(intval($getshipmentSt->status_s) < 7){
                return ['code' => 1, 'msg' => '订单数据不合法,签收失败'];;
            }
            if ($order->checkout != 1) {
                $return =  ['code' => 1, 'msg' => '订单已经签收,不必再次签收.'];
            } else {
                $checkout = 2; // 正常签收
                $quality_abnormal_data = json_encode($params['quality_abnormal']);
                $rating = json_encode($params['rating']);
                $errorMsgArr_str = array(
                    "data_loss",
                    "more",
                    "less",
                    "error",
                    "error_receiver",
                    "error_qrcode",
                    "error_missmatch"
                );
                if($params['product_abnormal']){
                    foreach ($params['product_abnormal'] as $key=>$value) {
                        if(in_array($key,$errorMsgArr_str)){
                            $res_key = array_keys($errorMsgArr_str,$key);
                            unset($errorMsgArr_str[$res_key[0]]);
                        }
                    }
                }

                $err_arr = array();
                if($errorMsgArr_str){
                    foreach($errorMsgArr_str as $key=>$value){
                        $err_arr[$value] = 1;
                    }
                }

                $product_abnormal = json_encode($params['product_abnormal']);
                $product_abnormal_text = '';
                if($params['product_abnormal']){
                    foreach ($err_arr as $k => $v) {
                        $product_abnormal_text .= $this->checkouError($k) . '/';
                    }
                $quality_abnormal_text = '';
                if($params['quality_abnormal'] ){
                    foreach ($params['quality_abnormal'] as $k => $v) {
                        if ($k == 'product_damage_number') {
                            $quality_abnormal_text .= $this->checkouError($k) . $v . '金额:' . $params['quality_abnormal']['product_damage_amount'] . '/';
                        }

                        if ($k == 'package_damage_number') {
                            $quality_abnormal_text .= $this->checkouError($k) . $v . '金额:' . $params['quality_abnormal']['package_damage_amount'];
                        }
                    }
                }

                }
                $quality_abnormal = $params['quality_abnormal'];

                // 异常签收
                if (count($params['product_abnormal']) != 0 || (int)$quality_abnormal['product_damage_number'] > 0
                    || (int)$quality_abnormal['product_damage_number'] > 0
                    || (int)$quality_abnormal['package_damage_number'] > 0
                    || (int)$quality_abnormal['packahe_damage_number'] > 0
                ) {
                    $checkout = 3; // 异常签收
                }

//                $params['checkout_lng'] =117.85645;
//                $params['checkout_lat'] =32.996166;

                //获取经纬度所对应的地址
                if(!empty($params['checkout_lng']) && !empty($params['checkout_lat'])) {
                    $getAddress['lng'] = $params['checkout_lng'];
                    $getAddress['lat'] = $params['checkout_lat'];
                    $lngLatAddress = $this->loadService('api')->getAddressByLngLat($getAddress);
                    $params["checkout_address"] = $lngLatAddress['address'];
                }

                $orderCheckout = new stdClass();
                $orderCheckout->order_id = $order->id;
                $orderCheckout->order_code = $order->order_code;
                $orderCheckout->product_abnormal = $product_abnormal;
                $orderCheckout->quality_abnormal = $quality_abnormal_data;
                $orderCheckout->grade = $rating;
                $orderCheckout->images = implode(',', $params['checkout-image']);;
                $orderCheckout->lng = $params['checkout_lng'];
                $orderCheckout->lat = $params['checkout_lat'];
                $orderCheckout->address = $params['checkout_address'];
                $orderCheckout->user_phone = $order->to_phone;
                $orderCheckout->create_time =  date('Y-m-d H:i:s', time());
                $orderCheckout->remark =  $params['remark'];


                $orderCheckoutUpdate = new stdClass();
                $orderCheckoutUpdate->order_id = $order->id;
                $orderCheckoutUpdate->checkout = $checkout;
                $orderCheckoutUpdate->checkout = $checkout;
                $orderCheckoutUpdate->checkout_status = true;
                 /*签收时 如果是未签收进行的回单确认，进行update或者insert*/
                /*$checkdetail = $this->dao->selectOne('order.getCheckoutDetailByCode', array("order_code"=>$orderCheckout->order_code));
                if($checkdetail){
                    $res_detail = $this->dao->update('order.CheckoutUpdateBycode', $orderCheckout);
                    if($res_detail < 0){
                        $return = ['code' => 2, 'msg' => '签收信息记录失败'];
                    }
                }else{
                    $res_detail = $this->dao->insert('order.orderCheckout', $orderCheckout);
                }*/
                if ($this->dao->insert('order.orderCheckout', $orderCheckout)){
                        $this->dao->update('order.orderCheckoutUpdate', $orderCheckoutUpdate);
                        $return = ['code' => 0, 'msg' => '签收成功', 'text' => $quality_abnormal_text];

                        //如果全部签收清除LBS缓存
                        $shipment_status = $this->dao->selectList('order.getShipmentStatus', array("shipment_id"=>$order->shipment_id));
                        $shipment_code = '';
                        $status_shipment = [];
                    foreach($shipment_status AS $key=>$val){
                        $shipment_code = $val->shipment_code;
                        $status_shipment[] = $val->checkout;
                    }
                    $status_count = array_count_values($status_shipment);
                    //所有状态中 未签收出现了总数减一次，说明是第一次签收
                    if($status_count['1'] == array_sum($status_count)-1){
                        $this->dao->update('shipment.updateStatus', array("status"=>'8',"id"=>$order->shipment_id,'arrival_date'=>date('Y-m-d H:i:s'),'update_time'=>date('Y-m-d H:i:s')));
                        // 将运单已抵达的状态推送到tms add by lvison
                        $data = array('code'=>$order->shipment_code,'time'=>date('Y-m-d H:i:s'),'type'=>"3");
                        $this->loadService('client')->webServiceRequest('sendShipmentStatus',$data);
                    }
                    //所有的订单状态里面没有  1(未签收) 了，说明已经最后一个订单签收完成了
                    if(empty($status_count['1'])){
                        //清除lbs缓存
                        $shipmentInfo = $this->dao->selectOne('shipment.getShipmentInfo', array('shipment_code'=>$order->shipment_code));
                        $lbsCarToken = json_decode(redisCache("lbs_car"),true);
                        unset($lbsCarToken[''.$shipmentInfo->driver_phone.'']);
                        redisCache("lbs_car",$lbsCarToken);
                    }
                }
                //报错，暂时屏蔽
                $errorMsgArr = array(
                        "data_loss"=>"资料遗失",
                        "more"=>"多装",
                        "less"=>"少装",
                        "error"=>"错装",
                        "error_receiver"=>"送错收货人",
                        "error_qrcode"=>"码不能识别",
                        "error_missmatch"=>"物码不一致",
                        "product_damage_number"=>"产品破损数量",
    //                    "product_damage_amount"=>"金额（元）",
                        "package_damage_number"=>"外包破损数量"
    //                    "package_damage_amount"=>"金额（元）"
                );

                $arrMsgstr = "";
                /*签收异常对应的文字信息*/
                if($params['product_abnormal']){
                    foreach($params['product_abnormal'] as $key=>$value){
                        if(array_key_exists($key,$errorMsgArr)){
                            $arrMsgstr .= $errorMsgArr[$key].'/';
                        }
                    }
                }
                //数量异常对应的文字信息
                if($params["quality_abnormal"]){
                    foreach($params["quality_abnormal"] as $key=>$value){
                       if($key == "product_damage_number"|| $key == "package_damage_number"){
                           if(!empty($value)){
                               $arrMsgstr .= $errorMsgArr[$key].''.$value.'(个),';
                           }
                       }
                    }
                    $arrMsgstr = substr($arrMsgstr , 0,-1);
                }
                $ordersInfo = $this->dao->selectOne('order.getOrders', array("order_code"=>$order->order_code));
                $getWarehouseOpenid =  $this->dao->selectOne('order.getWarehouseOpenid', array("plat_form_code"=>$order->plat_form_code));
                if ($checkout != 2) {
                    // 发送微信消息通知 调度
                    $wechatMessage = array(
                        'openid'=>$getWarehouseOpenid->openid,
                        'url'=>$_SERVER['HTTP_HOST'].'/wechat/orderReceiptDetail.html?openid='.$params["openid"].'&order_id='.$order->id.'&order_code='.$order->order_code.'&phone='.$ordersInfo->to_phone,
                        'first'=>array('value'=>'您有一条签收异常通知','color'=>'#000000'),
                        'keyword1'=>array('value'=>$order->order_code,'color'=>'#000000'),
                        'keyword2'=>array('value'=>date("Y-m-d H:i:s"),'color'=>'#000000'),
                        'remark'=>array('value'=>'签收存在以下异常:'.$arrMsgstr.'。','color'=>'#000000')//备注
                    );
                    try {
                        $re = $this->loadService('wechat')->sendTempMessage('sign_unusual', $wechatMessage, 'consign');
                    }catch(Exception $e){
                        $return = ['code' => 3, 'msg' => $e->getMessage()];
                    }
                }

                // 签收地和送达地相差一公里发送异常通知
                $toLngLat = array();
                if(!empty($order->to_lnglat) || !empty($order->to_address)){
                     //有to_address
                    $toLngLatArr = explode(',',$order->to_lnglat);
                    $toLngLat['lng'] = !empty(floatval($toLngLatArr[0])) ? floatval($toLngLatArr[0]) : '';
                    $toLngLat['lat'] = !empty(floatval($toLngLatArr[1])) ? floatval($toLngLatArr[1]) : '';
                    if(!empty($toLngLat['lng']) && !empty($toLngLat['lat'])){
                        $lngLatAddress = $this->loadService('api')->getAddressByLngLat($toLngLat);
                        $order->to_address = $lngLatAddress['address'];
                    }else{
                        if(!empty($order->to_address)){
                            //说明没有经纬度，调用接口查
                            $toAddress = ['id' => $order->id, 'address' => $order->to_address];
                            $lngLatAddress = $this->loadService('api')->getLngLat_Address(json_encode($toAddress));
                            $toLngLat = $lngLatAddress->code == 0 ? json_decode($lngLatAddress,true) : [] ;
                        }
                    }
                        $distance = 0;
                    if (!empty($toLngLat['lng']) && !empty($toLngLat['lat']) && $params['checkout_lng'] && $params['checkout_lat']) {
                        $input_params = array(
                        "lng1" => $params['checkout_lng'] ,
                        "lat1" => $params['checkout_lat'],
                        "lng2" => $toLngLat['lng'] ? $toLngLat['lng'] : '',
                        "lat2" => $toLngLat['lat'] ? $toLngLat['lat'] : '' 
                        );
                        $lnglatdistance = $this->loadService('api')->getDistance($input_params);
                        if ($lnglatdistance["distance"] > $this->distances) {
                            //TODO 发送异常通知
                            $content = '订单地址('.$order->to_address.')与签收地址('.$params["checkout_address"].')位置距离差距:' . $lnglatdistance["distance"] . '公里!';
                            $wechatMessage = array(
                                'openid'=>$getWarehouseOpenid->openid,
                                //'url'=>$_SERVER['HTTP_HOST'].'/wechat/orderReceiptDetail.html?openid='.$params["openid"].'&order_id='.$order->id.'&order_code='.$order->order_code,
                                'url'=>array('value'=>'','color'=>'#000000'),
                                'first'=>array('value'=>'您有一条签收地异常通知','color'=>'#000000'),
                                'keyword1'=>array('value'=>$order->order_code,'color'=>'#000000'),
                                'keyword2'=>array('value'=>date("Y-m-d H:i:s"),'color'=>'#000000'),
                                'remark'=>array('value'=>$content,'color'=>'#000000')//备注
                            );
                            try {
                                $re =  $this->loadService('wechat')->sendTempMessage('sign_unusual', $wechatMessage, 'consign');
                                $arr = array("checkout"=>3,"order_id"=>$order->id,"update_time"=>date('Y-m-d H:i:s'));
                                $res =  $this->dao->update('order.orderCheckoutUpdate', $arr);
                            }catch (Exception $e){
                                $return = ['code' => 3, 'msg' => $e->getMessage()];
                            }
                        }
                    }
                }
            }
        } else {
            $return = ['code' => 2, 'msg' => '没有找到待签收订单!'];
        }
         return $return;
    }

    public function checkoutDetail($args)
    {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $return = [];
        if (isset($params->order_id) && (int)$params->order_id) {
            $order = $this->dao->selectOne('order.getOrderCheckoutDetail', ['order_id' => $params->order_id]);
            $order_detail = $this->dao->selectOne('order.getOrderInfo', ['id' => $params->order_id]);
            $order_product = $this->dao->selectList('order.getOrderProduct', ['order_id' => $params->order_id]);
            if ($order) {
                $order->order_product=$order_product;
                if($order_detail){
                    $order->order_detail=$order_detail;
                }else{
                    $order->order_detail='';
                }
                $order->images=explode(',',$order->images);
                $order->quality_abnormal=json_decode($order->quality_abnormal);
                $order->grade=json_decode($order->grade);

                $product=json_decode($order->product_abnormal);
                $order->product=$product;
                $product_abnormalArr = array();

            if($product){
                foreach($product as $key=>$val){
                    if($key=='data_loss'){
                        $product_abnormalArr[]='资料遗失';
                    }elseif($key=='more'){
                        $product_abnormalArr[]='多装';
                    }
                    elseif($key=='less'){
                        $product_abnormalArr[]='少装';
                    }
                    elseif($key=='error'){
                        $product_abnormalArr[]='错装';
                    }
                    elseif($key=='error_receiver'){
                        $product_abnormalArr[]='送错收货人';
                    }
                    elseif($key=='error_qrcode'){
                        $product_abnormalArr[]='码不能识别';
                    }
                    elseif($key=='error_missmatch'){
                        $product_abnormalArr[]='物码不一致';
                    }
                }
            }

                $order->product_abnormal = $product_abnormalArr;

                $return = ['code' => 0, 'data' => $order];
            } else {
                $return = ['code' => 1, 'msg' => '未找到该订单的签收详情!'];
            }
        }

        return $return;
    }
    /**
     * 验证手机号码与订单to_phone匹配
     * Author will
     * 2016-9-30
     */
    public function verifyPhoneOrorder($args)
    {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        if ($params->phone && $params->order_id) {
            $order = $this->dao->selectList('order.getOrderProduct', ['order_id' => $params->order_id]);
            //$to_phone = $this->dao->selectOne('order.getPhone', array('order_code' => $order[0]->order_code));
            /*if ($order && $params->phone == $to_phone->to_phone) {
                return  $order;
            } else {
                return false;
            }*/
            return  $order;
        }
    }


    public function checkouError($key)
    {
        $error =  [
            'data_loss' => '资料遗失',
            'more' => '多装',
            'less' => '少装',
            'error' => '错装',
            'error_receiver' => '送错收货人',
            'error_qrcode' => '码不能识别',
            'error_missmatch' => '物码不一致',

            'product_damage_number' => '产品破损数量',

            'package_damage_number' => '外包破损数量',

        ];
        return $error[$key];
    }

    public function checkoutimage()
    {
        $str = $_POST['file'];
        $type = $_POST['type'];
        $order_id = $_POST['order_id'];

        switch($type){
            case 'image/png':
                $ext='.png';
                break;
            case 'image/jpeg';
                $ext='.jpeg';
                break;
            case 'image/jpeg':
                $ext='.jpg';
                break;
            case 'image/bmp':
                $ext='.bmp';
                break;
            default:
                $ext='.jpg';
        }
        $root_path = $this->app->getAppRoot() . 'www';
        $file_name = '/attachment/' .date('Ymd').'/' . $order_id . '_' . time() . $ext;
        $file_path = $root_path . $file_name;
        if(!file_exists(dirname($file_path))){
            mkdir(dirname($file_path),0777,true);
        }
        $img_content = str_replace('data:'.$type.';base64,','',$str);
        $img_content = base64_decode($img_content);
        $result = file_put_contents($file_path,$img_content);
        $return['error'] = 0;
        $file_path = substr($file_path, 1, strlen($file_path));
        if ($result) {
            $return['filepath'] = $file_name;
        } else {
            $return['error'] = 1;
            $return['info'] = '上传失败!';
        }
        return $return;
    }
    
    public function _getOrders($args){
    	$fixer = fixer::input($args);
    	$param = $fixer->getArray();
    	$orders = $this->dao->selectList('order.getOrders', $param);
    	return $orders;
    }

    /**
     * 获取销售查看的订单列表
     * 2016-7-19
     * Author ZHM
     */
    public function getOrders($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        //获取销售信息
        if (property_exists($params, 'openid') || $params->openid != '') {
            //检查销售权限
            $rt = $this->dao->selectOne('user.getUserInfoByOpenid', array('openid' => $params->openid));
            if ($rt) {
                //判断身份
                if ($params->type == $rt->user_type && $rt->user_type == 1) {
                    //销售人员
                    //判断是否绑定
                    $user_code = array();
                    if ($rt->base_user_code != '') {
                        array_push($user_code, $rt->base_user_code);
                    }
                    if ($rt->area_user_code != '') {
                        array_push($user_code, $rt->area_user_code);
                    }
                    if (count($user_code) == 0) {
                        return array('code' => 2, 'msg' => '未绑定ERP账号，订单不可查询');
                    } else {
                        $params->user_code = $user_code;
                    }
                } else if ($params->type == $rt->user_type && $rt->user_type == 5) {
                    // 基地调度人员
                    //获取基地信息
                    if ($warehouse_info = $this->dao->selectOne('order.getWarehouseByUser', array('openid' => $params->openid))) {
                        $params->plat_form_code = $warehouse_info->platform_code;
                    } else {
                        return array('code' => 1, 'msg' => '获取基地信息失败');
                    }
                } else if ($rt->user_type == 4) {
                    // 承运商
                    $_carrier =  $this->dao->selectOne('carrier.selectPage',array('relation_phone'=>$rt->phone));
                	$params->carrier_id =$_carrier->carrier_id; 
                    
                }
                else {
                    return array('code' => 1, 'msg' => '身份验证错误');
                }
                //获取订单详情
                if ($orders = $this->dao->selectPage('order.getOrders', $params)) {
                    foreach ($orders->result as $key => $value) {
                        switch ($value->checkout) {
                            case 1:
                                $orders->result[$key]->checkout = '在途/未签收';
                                break;
                            case 2:
                                $orders->result[$key]->checkout = '正常签收';
                                break;
                            case 3:
                                $orders->result[$key]->checkout = '异常签收';
                                break;
                            default:
                                $orders->result[$key]->checkout = '签收错误';
                                break;
                        }
                    }
                    return array('code' => 0, 'data' => $orders);
                } else {
                    return array('code' => 1, 'msg' => '获取订单信息失败');
                }
            } else {
                return array('code' => 1, 'msg' => '获取用户信息失败 2');
            }
        } else {
            return array('code' => 1, 'msg' => '获取用户信息失败 1');
        }
    }

    /**
     * 2016-7-20
     * 手动授权订单
     * Author ZHM
     */
    public function orderAuth($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();

        //检查销售人员权限
        if (property_exists($params, 'openid') || $params->openid != '') {
            $rt = $this->dao->selectOne('order.getSales', array('openid' => $params->openid));
            if ($rt) {
                //销售人员user_code
                $user_code = array();
                if ($rt->base_user_code != '') {
                    array_push($user_code, $rt->base_user_code);
                }
                if ($rt->area_user_code != '') {
                    array_push($user_code, $rt->area_user_code);
                }
                //检查参数
                if (!property_exists($params, 'phone') || trim($params->phone) == '') {
                    return array('code' => 1, 'msg' => '请输入电话号码');
                } else if (!property_exists($params, 'order_id') || trim($params->order_id) == '') {
                    return array('code' => 1, 'msg' => '获取订单信息失败');
                }

                if (count($user_code) == 0) {
                    return array('code' => 2, 'msg' => '未绑定ERP账号，订单不可查询');
                } else {
                    $params->user_code = $user_code;
                    $order = $this->dao->selectOne('order.getOrderInfo', ['id' => $params->order_id]);
                    $author_history = json_decode($order->author_history,true);
                    $author_history_new = array("time"=>date('Y-m-d H:i:s'),"content"=>'手动授权成功,授权给'.$params->name.':'.$params->phone);
                    $author_history[] = $author_history_new;
                    $params->author_history = json_encode($author_history);

                }

                //检查被授权人员，不能为销售人员
                try {
                    if ($this->dao->selectOne('order.getSales', array('phone' => $params->phone))) {
                        return array('code' => 1, 'msg' => '无法授权给该用户，请重试');
                    }
                } catch (Exception $e) {
                    return array('code' => 1, 'msg' => '获取被授权人员信息失败');
                }
                //授权操作
                try {
                    $this->dao->update('order.orderAuth', $params);
                    $wechatConnect = $this->dao->selectOne('order.getWechatConnect', array('phone' => $params->phone));
                    if(!empty($wechatConnect->openid)){
                        $fix = array(
                            'openid'=>$wechatConnect->openid,
                            'url'=>$_SERVER['HTTP_HOST'].'/wechat/orderReceipt.html?openid='.$wechatConnect->openid.'&order_id='.$order->id.'&order_code='.$order->order_code,
                            'keyword1'=>array('value'=>$order->order_code,'color'=>'#000000'),
                            'keyword2'=>array('value'=>$order->carnum,'color'=>'#000000'),
                            'keyword3'=>array('value'=>$order->driver_name,'color'=>'#000000'),
                            'remark'=>array('value'=>'总计'.$order->quality.'件，总重'.$order->weight.'吨，货品体积'.$order->volume.'立方米','color'=>'#000000'),
                        );
                        $this->loadService('wechat')->sendTempMessage('order_auth',$fix,'shipment');
                    }
                    else{
                       // $msg_content = sprintf($this->config->messageModel->smsAccredit, $url);
                       // $rt = $this->loadService('client')->sendSms($msg_content, $params->phone);
                        /*推送短信消息 申请签收*/
                        /*$url_sms = $this->config->webHost.'/r.html?d='.$order->guid;
                        $msg_content = sprintf($this->config->messageModel->smsAccredit,$url_sms);
                        $this->loadService('client')->sendSms($msg_content, $url_sms);*/
                    }
                    return array('code' => 0,'msg'=>$author_history_new);
                } catch (Exception $e) {
                    return array('code' => 1, 'msg' => '授权失败，请重试');
                }
            } else {
                return array('code' => 1, 'msg' => '抱歉，非销售人员无法进行该操作');
            }
        } else {
            return array('code' => 1, 'msg' => '获取用户信息失败');
        }
    }

    /**
     * 2016-7-20
     * 获取订单详情
     * Author ZHM
     */
    public function getOrderDetail($args){
        $fixer = fixer::input($args);
        $params = $fixer->get();
        //检查参数
        if (property_exists($params, 'order_id') && trim($params->order_id) != '') {
            //获取订单详情
            $rt = $this->dao->selectList('order.getOrderDetail', $params);
            return array('code' => 0, 'data' => $rt);
        }
        return array('code' => 1, 'msg' => '获取订单信息失败');
    }
    /**
     * 2016-7-20
     * 获取订单回单照片以及描述
     * Author wil
     */
    public function showCheckImg($args){
        $fixer = fixer::input($args);
        $params = $fixer->get();
        //检查参数
        if (property_exists($params, 'order_code') && trim($params->order_code) != '') {
            //获取订单详情
            $rt = $this->dao->selectOne('order.getCheckoutDetailByCode', $params);
            return array('code' => 0, 'msg' => $rt);
        }
        return array('code' => 1, 'msg' => '获取回单信息失败');
    }

    /**
     * 2016-7-25
     * 同步订单数据接口
     * ZHM
     */
    public function syncOrder($json = '') {
        //保存参数至日志
        tools::datalog('同步订单参数'.var_export($json,true),'syncOrder_');
        if ($json == '') {
            throwException('获取json数据失败', 0);
        }
        $params = json_decode($json);
        if (empty($params)) {
            throwException('json数据无法解析', 0);
        }
        //若为数组统一转换为对象
        if (is_array($params)) {
            $params = array2object($params);
        }
        //时间
        $time = date('Y-m-d H:i:s');
        //订单号
        $order_code = '';
        //参数验证
        if (!property_exists($params, 'code') || $params->code == '') {
            throwException('缺少订单编号', 0);
        } else {
            $order_code = $params->code;
        }
        if (!property_exists($params, 'type') || $params->type == '') {
            throwException('缺少变更类型', 0);
        } else if ($params->type == 1) {
            if (!property_exists($params, 'shipment_method') || $params->shipment_method == '') {
                throwException('缺少运输方式', 0);
            }
            if (!property_exists($params, 'fromlocation') || $params->fromlocation == '') {
                throwException('缺少出发地', 0);
            }
            if (!property_exists($params, 'tolocation') || $params->tolocation == '') {
                throwException('缺少目的地', 0);
            }
            if (!property_exists($params, 'quality') || $params->quality == '') {
                throwException('缺少货物数量', 0);
            }
            if (!property_exists($params, 'weight') || $params->weight == '') {
                throwException('缺少货物重量', 0);
            }
            if (!property_exists($params, 'volume') || $params->volume == '') {
                throwException('缺少货物体积', 0);
            }
            if (!property_exists($params, 'from_name') || $params->from_name == '') {
                throwException('缺少发货方', 0);
            }
            if (!property_exists($params, 'to_name') || $params->to_name == '') {
                throwException('缺少收货方', 0);
            }
            if (!property_exists($params, 'to_phone') || $params->to_phone == '') {
                throwException('缺少收货方联系电话', 0);
            }
            /*if (!property_exists($params, 'plan_leave_time') || $params->plan_leave_time == '') {
                throwException('缺少计划出发时间', 0);
            }
            if (!property_exists($params, 'plan_arrive_time') || $params->plan_arrive_time == '') {
                throwException('缺少计划到达时间', 0);
            } */
            if (!property_exists($params, 'plat_form_code') || $params->plat_form_code == '') {
                throwException('缺少基地/片区编码', 0);
            }
            if (!property_exists($params, 'plat_form_name') || $params->plat_form_name == '') {
                throwException('缺少基地/片区名称', 0);
            }
            /*if (!property_exists($params, 'distance') || $params->distance == '') {
                throwException('缺少运距', 0);
            }*/
            if (!property_exists($params, 'first_business') || $params->first_business == '') {
                throwException('缺少业务员', 0);
            }

            /*if (!property_exists($params, 'relateBill') || $params->relateBill == '') {
                throwException('要货计划单号', 0);
            }*/

            //获取制单人信息
            $params->user_code = '';
            if(!empty($params->relateBill)) {
                if ($rt = $this->dao->selectOne('order.getUserCode', array('order_code' => $params->relateBill))) {
                    $params->user_code = $rt->user_code;
                }
            }

            //验证订单明细
            if (!property_exists($params, 'order_detail') || !is_array($params->order_detail) || count($params->order_detail) <= 0) {
                throwException('缺少订单明细', 0);
            } else {
                foreach ($params->order_detail as $detail) {
                    $detail = is_array($detail) ? (object)$detail : $detail;
                    $rt = $this->orderDetailParamsVerify($detail);
                    if (!$rt['verify']) {
                        throwException($rt['msg'], 0);
                    }
                }
            }
            //明细信息
            $order_detail = $params->order_detail;
            //保存订单表
            unset($params->order_detail);
            $params->create_time = $time;
            $params->update_time = $time;
            $params->guid = $this->guid8();
            $params->shipment_type = $params->shipment_type ? $params->shipment_type :'';

            $params->from_province = $params->from_province ? $params->from_province : '';
            $params->from_city = $params->from_city ? $params->from_city : '';
            $params->to_province = $params->to_province ? $params->to_province : '';
            $params->to_city = $params->to_city ? $params->to_city : '';

            try {
                //判断订单是否存在
                $old_order = $this->dao->selectOne('order.getOrderId', array('order_code' => $order_code));
                if (!empty($old_order)) {
                    $order_id = $old_order->id;
                    $params->deleted = 0;
                    $params->id = $old_order->id;
                    $this->dao->update('order.orderUpdate', $params);
                } else {
                    $last_insert = $this->dao->insert('order.insertOrder', $params);
                    $order_id = $last_insert['id'];
                }
            }catch (Exception $e) {
                //保存错误日志
                tools::datalog('插入订单表错误'.var_export($e->getMessage(),true),'syncOrder_');
                throwException('新增订单失败 1', 0);
            }


            //订单详情参数
            foreach ($order_detail as $detail) {
                $detail = is_array($detail) ? (object)$detail : $detail;
                // 处理需要保存至订单详情表的参数
                $param = array(
                    'order_id'      => $order_id,
                    'order_code'    => $order_code,
                    'line_no'       => $detail->line_no,
                    'product_name'  => $detail->product_name,
                    'specification' => $detail->specification,
                    'lot'           => $detail->lot,
                    'serial'        => $detail->serial,
                    'unit_name'     => $detail->unit_name,
                    'quality'       => $detail->quality,
                    'weight'        => $detail->weight,
                    'volume'        => $detail->volume,
                    'manufacturer'  => $detail->manufacturer,
                    'create_time'   => $time,
                    'update_time'   => $time,
                );
                $this->dao->insert('order.insertOrderDetail', $param);
            }
            echo json_encode(array('code' => 1, 'message' => ''));
            exit();
        } else if ($params->type == 3) {
            //删除订单操作
            try {
                $this->dao->update('order.orderUpdate', array('update_time' => $time, 'order_code' => $params->code, 'deleted' => 1));
                $this->dao->update('order.updateOrderDetail',array('order_code'=>$params->code,'deleted'=>1,'update_time'=>$time));
            } catch (Exception $e) {
                //保存错误日志
                tools::datalog('删除订单失败错误'.var_export($e->getMessage(),true),'order.syncOrder_');
                throwException('删除订单失败', 0);
            }
            echo json_encode(array('code' => 1, 'message' => ''));
            exit();
        } else {
            throwException('不支持该变更类型', 0);
        }
    }

    /**
     * Desc:生成八位随机号码
     * @Author Lvison
     * @return string
     */
    private function guid8(){
        $charId = strtoupper(md5(uniqid(rand(), true)));
        $uuid = substr($charId, 0, 8);
        return $uuid;
    }

    /**
     * Desc:通过订单随机随返回订单信息
     * @param $res
     * @Author Lvison
     * @return array|null
     */
    public function getOrderByGuid($res){
        if(empty($res['guid']))
            return array();
        $order = $this->dao->selectOne('order.getOrderByGuid',$res);
        return $order;
    }

    /**
     * Desc:验证订单明细参数
     * @param $params
     * @Author Lvison
     * @return array
     */
    private function orderDetailParamsVerify($params) {
        if (!property_exists($params, 'line_no') || $params->line_no == '') {
            return array('verify' => 0, 'msg' => '缺少行号');
        }
        else if (!property_exists($params, 'product_name') || $params->product_name == '') {
            return array('verify' => 0, 'msg' => '缺少货物名称');
        }
        /*else if (!property_exists($params, 'specification') || $params->specification == '') {
            return array('verify' => 0, 'msg' => '缺少货物规格');
        }
        else if (!property_exists($params, 'lot') || $params->lot == '') {
            return array('verify' => 0, 'msg' => '缺少批号');
        }
        else if (!property_exists($params, 'serial') || $params->serial == '') {
            return array('verify' => 0, 'msg' => '缺少序列号');
        }
        else if (!property_exists($params, 'unit_name') || $params->unit_name == '') {
            return array('verify' => 0, 'msg' => '缺少包装单位名称');
        }
        else if (!property_exists($params, 'manufacturer') || $params->manufacturer == '') {
            return array('verify' => 0, 'msg' => '缺少生产厂家');
        }*/
        else if (!property_exists($params, 'quality') || $params->quality == '') {
            return array('verify' => 0, 'msg' => '缺少货物数量');
        }
        else if (!property_exists($params, 'weight') || $params->weight == '') {
            return array('verify' => 0, 'msg' => '缺少货物重量');
        }
        else if (!property_exists($params, 'volume') || $params->volume == '') {
            return array('verify' => 0, 'msg' => '缺少货物体积');
        }
         else {
            return array('verify' => 1);
        }
    }

    /**
     * 更新订单数据接口
     * 2016-7-25
     * ZHM
     */
    public function updateOrderDetail($json = '') {
        //参数保存日志
        tools::datalog('更新订单数据参数'.var_export($json,true),'updateOrderDetail_');
        if ($json == '') {
            throwException('获取json数据失败', 0);
        }
        $params = json_decode($json);
        if (empty($params)) {
            throwException('json数据无法解析', 0);
        }
        //若为数组统一转换为对象
        if (is_array($params)) {
            $params = array2object($params);
        }
        //报错信息
        $error = '更新订单详情失败';
        //订单详情id
        $order_detail_id = '';
        //验证订单号
        if (!property_exists($params, 'code') || $params->code == '') {
            throwException('缺少订单编号', 0);
        } else if (!property_exists($params, 'line_no') || $params->line_no == '') {
            throwException('缺少行号', 0);
        } else {
            //检查订单详情是否存在
            $order_detail = $this->dao->selectOne('order.getOrderDetail', array('order_code' => $params->code, 'line_no' => $params->line_no));
            if (!$order_detail) {
                throwException('不存在该订单明细', 0);
            } else {
                $order_detail_id = $order_detail->id;
            }
        }
        //判断操作类型
        if (!property_exists($params, 'type') || $params->type == '') {
            throwException('缺少变更类型', 0);
        } else if ($params->type == 2) {
            //验证订单详情参数
            $rt = $this->orderDetailParamsVerify($params);
            if (!$rt['verify']) {
                throwException($rt['msg'], 0);
            }
        } else if ($params->type == 3) {
            //删除订单
            $params = new stdClass();
            $params->deleted = 1;
            //报错信息
            $error = '删除订单详情失败';
        } else {
            throwException('不支持该变更类型', 0);
        }
        $params->id = $order_detail_id;
        $params->update_time = date('Y-m-d H:i:s', time());
        //更新订单详情数据
        try {
            $this->dao->update('order.updateOrderDetail', $params);
        } catch (Exception $e) {
            //保存错误日志
            tools::datalog('更新订单详情表错误'.var_export($e->getMessage(),true),'order.updateOrderDetail_');
            throwException($error, 0);
        }
        echo json_encode(array('code' => 1, 'message' => ''));
        exit();
    }

    /**
     * 2016-7-29
     * Author ZHM
     * 接收ERP推送订单接口
     */
    public function syncOrderErp($params) {
        //参数保存日志
        tools::datalog('ERP订单信息参数'.var_export($params,true),'syncOrderErp_');
        if (empty($params)) {
            throwException('获取参数失败', 1);
        }
        //若为数组统一转换为对象
        if (is_array($params)) {
            $params = array2object($params);
        }
        //判断参数
        if (!property_exists($params, 'code') || $params->code == '') {
            throwException('缺少订单编号', 1);
        } else {
            $params->order_code = $params->code;
            unset($params->code);
        }
        if (!property_exists($params, 'desc')) {
            throwException('缺少订单信息描述', 1);
        }
        if (!property_exists($params, 'user_code') || $params->user_code == '') {
            throwException('缺少制单人的编号', 1);
        }
        if (!property_exists($params, 'status') || $params->status == '') {
            throwException('缺少订单状态', 1);
        }
        $params->type = $params->type == 'NC_5' ? 'base' : 'area';
        $params->create_time = date('Y-m-d H:i:s');
        //保存数据
        try {
            $this->dao->insert('order.insertOrderErp', $params);
        } catch (Exception $e) {
            tools::datalog('插入erp订单表错误'.var_export($e->getMessage(),true),'order.insertOrderErp_');
            throwException('插入数据失败', 1);
        }
        echo json_encode(array('code' => 0, 'message' => ''));
        exit();
    }

    /**
     * Desc:订单转包上报
     * @param $res
     * @Author Lvison
     * @return array
     */
    public function subcontract($res){
        if($res->order_code==''){
            return array('code' => 1, 'message' => '无法取得订单信息');
        }
        $order_codes = explode(',',$res->order_code);
        $order = $this->dao->selectList('order.getOrderByCode',array('order_codes'=>$order_codes));
        /*$order=$this->dao->selectOne('order.getOrderByOrderCode',array('order_code'=>$res->order_code));*/
        if(empty($order)){
            return array('code'=>1,'message'=>'未知订单号');
        }
        foreach($order as $key=>$val){
            $carnum=$this->dao->selectOne('order.getCarNumByCode',array('order_code'=>$val->order_code));
            $param = array('openid'=>$res->openid,
                'order_id' => $val->id,
                'shipment_id' => $val->shipment_id,
                'report_type' => 1,
                'address' => $res->address,
                'lng' => $res->lng,
                'lat' => $res->lat,
                'carnum'=>$carnum->carnum,
                'report_desc' => '转包',
                'create_time' => date('Y-m-d H:i:s')
            );
            $result=$this->dao->insert('order.report',$param);
        }
        

        return array('code'=>0);

    }
    /**
     * 获取运单id列表
     * Author Ivan
     * 2016-9-06
     */
    public function updataAbnormalImage ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        if($params->order_code && $params->abnormal_images){
            $ImageOld = $this->dao->selectOne('order.getCheckoutDetailByCode', $params);
           if(!empty($ImageOld)){
               $rt_update = $this->dao->update('order.updataAbnormalImage', $params);
               if($rt_update > 0){
                   return array('code' => 1, 'message' => '上传图片成功');
               }else{
                   return array('code' => 0, 'message' => '上传图片失败');
               }
           }else{
               $params->order_id =  $this->dao->selectOne('order.getOrderId', array("order_code"=>$params->order_code ))->id;
               $params->create_time = date('Y-m-d H:i:s');
               $rt_insert = $this->dao->insert('order.insertImage', $params);
               if(!empty($rt_insert)){
                   return array('code' => 1, 'message' => '上传图片成功');
               }else{
                   return array('code' => 0, 'message' => '上传图片失败');
               }
           }
        }else{
            return array('code' => 0, 'message' => '图片路径获取失败');
        }

    }
    /**
     * 获取该销售订单管理列表
     * Author Ivan
     * 2016-9-06
     */
    public function getAuthOrders ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        if (property_exists($params, 'openid') || $params->openid != '') {
            //检查销售权限
            $rt = $this->dao->selectOne('user.getUserInfoByOpenid', array('openid' => $params->openid));
            $name=$this->dao->selectOne('order.getUserName', array('phone' => $rt->phone));
            if ($rt) {
                //判断身份
                if ($rt->user_type == 1) {
                    //销售人员
                    //判断是否绑定
                    $user_code = array();
                    if ($rt->base_user_code != '') {
                        array_push($user_code, $rt->base_user_code);
                    }
                    if ($rt->area_user_code != '') {
                        array_push($user_code, $rt->area_user_code);
                    }
                    if (count($user_code) == 0) {
                        return array('code' => 2, 'msg' => '未绑定ERP账号，订单不可查询');
                    } else {
                        $params->user_code = $user_code;
                    }
                }else {
                    return array('code' => 1, 'msg' => '身份验证错误');
                }
                if ($params->begin_time && $params->end_time){
                    $params->time = 1;
                }
                if($params->plat_form_name){
                    $a = [];
                    $descs = $this->dao->selectList('order.getAuthOrders', $params);
                    foreach ($descs as $k=>$val){
                        $b = json_decode($val->desc);
                        foreach ($b->order_details as $v){
                            if ($params->plat_form_name == $v->manufacturer){
                                $a[] = $val->id;
                                break;
                            }
                        }
                    }
                    if ($a != ''){
                        $params->arr_id = $a;
                    }
                }
                //获取订单详情
                $orders = $this->dao->selectPage('order.getAuthOrders', $params);
                if ($orders) {
                    foreach($orders->result as $key=>$val){
                        $val->desc=json_decode($val->desc);
                        $str='';
                        foreach($val->desc->order_details as $k=>$v){
                            $str.=$v->goods_name.$v->audit_quality.'件'.' ';
                        }
                        $orders->result[$key]->detail=$str;
                        $orders->result[$key]->userName=$name->name;
                        $orders->result[$key]->create_time=date('Y/m/d',strtotime($val->create_time));

                        $rs = $this->dao->selectOne('order.getOrderIdByRelateBill',['relateBill'=>$val->order_code]);
                        if ($rs){
                            $orders->result[$key]->qipiao = 1;
                        }else{
                            $orders->result[$key]->qipiao = 0;
                        }
                    }
                    return array('code' => 0, 'data' => $orders);
                } else {
                    return array('code' => 1, 'msg' => '获取订单信息失败');
                }
            } else {
                return array('code' => 1, 'msg' => '获取用户信息失败 2');
            }
        } else {
            return array('code' => 1, 'msg' => '获取用户信息失败 1');
        }

    }
    /**
     * 该销售获取订单详情
     * Author Ivan
     * 2016-9-06
     */
    public function getAuthOrderDetail ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $shipment_id=$this->dao->selectList('order.getShipmentId',array('id'=>$params->id));
        /*$rst = $this->dao->selectOne('user.getUserInfoByOpenid', array('openid' => $params->openid));
        $name=$this->dao->selectOne('order.getUserName', array('phone' => $rst->phone));*/
        $rt = $this->dao->selectOne('order.getAuthOrderDetail', array('id' => $params->id));
        
        if(!empty($shipment_id)){
            foreach($shipment_id as $key=>$val){
                $holdcar=$this->dao->selectList('order.getHoldCar', array('id' => $val->shipment_id));
                if(!empty($holdcar)){
                    $holdcar[0]->address='';
                    $holdcar[0]->order_name='定车';
                }
                $report=$this->dao->selectList('order.getReport', array('id' => $val->shipment_id));
                if(!empty($report)){
                    foreach($report as $k=>$v){
                        if($v->order_name==1){
                            $report[$k]->order_name='转包上报';
                        }elseif($v->order_name==2){
                            $report[$k]->order_name='天气';
                        }
                        elseif($v->order_name==3){
                            $report[$k]->order_name='堵车';
                        }
                        elseif($v->order_name==4){
                            $report[$k]->order_name='修路';
                        }
                        elseif($v->order_name==5){
                            $report[$k]->order_name='查车';
                        }
                        elseif($v->order_name==6){
                            $report[$k]->order_name='修车';
                        }
                        elseif($v->order_name==7){
                            $report[$k]->order_name='签收';
                        }
                        elseif($v->order_name==8){
                            $report[$k]->order_name='其他';
                        }
                        elseif($v->order_name==9){
                            $report[$k]->order_name='申请签收';
                        }
                        elseif($v->order_name==10){
                            $report[$k]->order_name='进厂';
                        }
                        elseif($v->order_name==11){
                            $report[$k]->order_name='出厂';
                        }
                    }
                }
                $lbs=$this->dao->selectList('order.getLbs', array('id' => $val->shipment_id));
                if(!empty($lbs)){
                    foreach($lbs as $k=>$v){
                        if($v->order_name==1){
                            $lbs[$k]->order_name='LBS定位';
                        }
                    }
                }
                $orderReceipt=$this->dao->selectList('order.getOrderReceipt', array('id' => $val->shipment_id));
                if(!empty($orderReceipt)){
                    foreach($orderReceipt as $k=>$v){
                        $orderReceipt[$k]->order_name='签收';
                    }
                }
                $message=array_merge($holdcar,$report,$lbs,$orderReceipt);
                if(!empty($message)){
                    $sort = array(  
                                'direction' => 'SORT_ASC', //排序顺序标志 SORT_DESC 降序；SORT_ASC 升序  
                                'field'     => 'order_time',       //排序字段  
                        ); 
                    $arrSort = array();  
                    foreach($message AS $uniqid => $row){  
                        foreach($row AS $ke=>$value){  
                            $arrSort[$ke][$uniqid] = $value;  
                        }  
                    }
                    if($sort['direction']){  
                        array_multisort($arrSort[$sort['field']], constant($sort['direction']), $message);  
                    }
                }
                $shipment_id[$key]->message=$message;

            }
        }
        $desc=json_decode($rt->desc);
        $str='';
        if($desc->order_details){
            foreach($desc->order_details as $key=>$val){
            $str.=$val->goods_name.$val->audit_quality.'件'.' ';
            }
        }
        $rt->date=date('Y/m/d',strtotime($rt->create_time));
        $rt->detail=$str;
        $rt->desc=$desc;
        $rt->message=$shipment_id;
        return array('code' => 0, 'data' => $rt);

    }

    /**
     *根据要货单获取订单列表接口——微信
     * @param $args
     * @return array
     */
    public function erpOrderList($args){
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $params->role_condition = 'WHERE oe.order_code = #goods_code#';
        if ($params->goods_code != '' ) {
            $data = $this->dao->selectPage('order.getOrderList_wechat', $params);
            /*if($data->result){//getOrderDetail
                foreach ($data->result as $val){
                    $rs = $this->dao->selectList('order.getOrderDetail', ['order_code'=>$val->order_code]);
                    $val->detail = $rs;
                }
            }*/
            return $data;
        }else{
            throwException('缺少要货单号',1);
        }/*elseif($params->exact == '' && $params->openid != ''){//非精确查找
            if ($params->goods_code != '' ){
                $data = $this->dao->selectPage('order.getOrderList_wechat', $params);
                return $data;
            }elseif($params->plat_form_code != '' || $params->begin_time != ''){
                $rt = $this->dao->selectOne('user.getUserInfoByOpenid', array('openid' => $params->openid));
                if ($rt->user_type == 1) {
                    //销售人员
                    //判断是否绑定
                    $user_code = array();
                    if ($rt->base_user_code != '') {
                        array_push($user_code, $rt->base_user_code);
                    }
                    if ($rt->area_user_code != '') {
                        array_push($user_code, $rt->area_user_code);
                    }
                    if (count($user_code) == 0) {
                        throwException('未绑定ERP账号，订单不可查询',2);
                    } else {
                        $params->user_code = $user_code;
                    }
                }else {
                    throwException('身份验证错误',1);
                }
                $params->role_condition = 'WHERE 1';

                $rs = $this->dao->selectPage('order.getOrderList_wechat2', $params);
                return $rs;
            }else{
                throwException('请选择查询条件',1);
            }
        }*/
        /*if ($params->goods_code != '' ){
            $data = $this->dao->selectPage('order.getOrderList_wechat', $params);
            return $data;
        } else {
            throwException('获取订单列表失败',1);
        }*/
    }

    /**
     * 获取要货单模糊查询列表接口--微信
     */
    public function getErpGoodsCodes ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $rt = $this->dao->selectOne('user.getUserInfoByOpenid', array('openid' => $params->openid));
        if ($rt->user_type == 1) {
            //销售人员
            //判断是否绑定
            $user_code = array();
            if ($rt->base_user_code != '') {
                array_push($user_code, $rt->base_user_code);
            }
            if ($rt->area_user_code != '') {
                array_push($user_code, $rt->area_user_code);
            }
            if (count($user_code) == 0) {
                throwException('未绑定ERP账号，订单不可查询',2);
            } else {
                $params->user_code = $user_code;
            }
        }else {
            throwException('身份验证错误',1);
        }
        return $rt = $this->dao->selectList('order.getErpGoodsCodes', $params);
    }

    /**
     * 获取要货基地下拉列表接口--微信
     */
    public function getFromNames ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        if (property_exists($params, 'openid') || $params->openid != '') {
            //检查销售权限
            $rt = $this->dao->selectOne('user.getUserInfoByOpenid', array('openid' => $params->openid));
            if ($rt) {
                //判断身份
                if ($rt->user_type == 1) {
                    //销售人员
                    //判断是否绑定
                    $user_code = array();
                    if ($rt->base_user_code != '') {
                        array_push($user_code, $rt->base_user_code);
                    }
                    if ($rt->area_user_code != '') {
                        array_push($user_code, $rt->area_user_code);
                    }
                    if (count($user_code) == 0) {
                        throwException('未绑定ERP账号，订单不可查询',2);
                    } else {
                        $params->user_code = $user_code;
                    }
                }else {
                    throwException('身份验证错误',1);
                }
                //获取订单详情
                $manu = [];
                $manu2 = [];
                //获取基地名
                if ($descs = $this->dao->selectList('order.getErpDesc', $params)) {
                    foreach($descs as $val){
                        $val = json_decode($val->desc);
                        foreach ($val->order_details as $v){
                            $plat_form_name = $v->manufacturer;
                            if (!in_array($plat_form_name,$manu2)){
                                $v = $this->dao->selectOne('order.getPlatFromCode', ['plat_form_name'=>$plat_form_name]);
                                $manu[] = ['name'=>$plat_form_name,'code'=>$v->plat_form_code];
                                $manu2[]=$plat_form_name;
                            }
                        }
                    }
                    return $manu;
                } else {
                    throwException('获取订单信息失败',1);
                }
            } else {
                throwException('获取用户信息失败',1);
            }
        } else {
            throwException('获取用户信息失败',1);
        }
    }

    /**
     * 订单跟踪详情接口--微信
     */
    public function getOrderTrace($args){
        $fixer = fixer::input($args);
        $params = $fixer->get();
        if (property_exists($params, 'order_code') || $params->order_code != '') {
            $data = $this->dao->selectOne('order.getOrderTrace',['order_code'=>$params->order_code]);
            if ($data->shipment_method == '整车运输'){
                $gps = $this->loadService('shipment')->checkHistoryWx(['shipmentId'=>$data->shipment_id]);
                if($gps['code'] == 2){
                    $data->lbs=$this->loadService('shipment')->lbs(['shipmentid'=>$data->shipment_id,'user_type'=>'1']);
                    $data->lbs['message'] = 'LBS：'.$data->lbs['message'];
                    //$ips.locate("history", "show_shipment", "id="+id,true);
                }elseif($gps['code'] == 0){
                    if ($gps['ty']){
                        $data->coord=$gps['ty'];
                    }elseif($gps['smart']){
                        $data->coord=$gps['smart'];
                    }
                }else{
                    $data->trackMes = $gps['message'];
                }
            }elseif($data->shipment_method == '零担运输'){
                $report = $this->dao->selectList('shipment.getShipmentReport_2',array("shipment_id"=>$data->shipment_id));
                $data->lingdan = $report;
            }
            return $data;
        }else {
            throwException('获取订单失败',1);
        }
    }

    public function dingwei(){
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $data = array2object([]);
        if ($data->shipment_method == '整车运输'){
            $gps = $this->loadService('shipment')->checkHistoryWx(['shipmentId'=>$params->shipment_id]);
            if($gps['code'] == 2){
                $data->lbs=$this->loadService('shipment')->lbs(['shipmentid'=>$params->shipment_id,'user_type'=>'1']);
                $data->lbs['message'] = 'LBS：'.$data->lbs['message'];
                //$ips.locate("history", "show_shipment", "id="+id,true);
            }elseif($gps['code'] == 0){
                if ($gps['ty']){
                    $data->coord=$gps['ty'];
                }elseif($gps['smart']){
                    $data->coord=$gps['smart'];
                }
            }else{
                $data->trackMes = $gps['message'];
            }
        }elseif($data->shipment_method == '零担运输'){
            $report = $this->dao->selectList('shipment.getShipmentReport_2',array("shipment_id"=>$params->shipment_id));
            $data->lingdan = $report;
        }
        return $data;
    }
}
