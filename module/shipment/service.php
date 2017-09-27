<?php
/**
 * 运单服务类
 * Author Zhm
 * 2016-07-12   
 */

class shipmentService extends service{
	private $userrole = false;
	/**
	 * 获取运单列表
	 * Author ZHM
	 * 2016-7-12
	 */
	public function getShipments ($args){
		//测试逾期提醒定时任务
		 //$this->pushoverdueinfo();
		$fixer = fixer::input($args);
		$params = $fixer->get();
		//获取微信用户的基础信息
		if($params->order_code!=''){
			$shipment_id=$this->dao->selectOne('shipment.getShipmentIdByOrderCode',array('order_code'=>$params->order_code));
			$params->shipId=$shipment_id->shipment_id;
		}
		if($params->relate_bill!=''){
			$shipment_id=$this->dao->selectOne('shipment.getShipmentIdByRe',array('relateBill'=>$params->relate_bill));
			$params->shipId=$shipment_id->shipment_id;
		}
		$wechatUser = $this->dao->selectONE('user.getUserInfoByOpenid',array('openid'=>$params->openid));
		if(!empty($wechatUser)){
			//调度
			if($wechatUser->user_type == '5'){
				$wechatUserInfo = $this->dao->selectOne('warehouse.getWarehouseUser', array('phone' => $wechatUser->phone));
				$warehouseInfo = $this->dao->selectOne('warehouse.selectPage', array('id' => $wechatUserInfo->warehouse_id));
				$params->orgcode = $warehouseInfo->orgcode;
				//判断调度状态
				if($params->status == 'onway'){
					$params->status = '7';
				}
				elseif($params->status == 'arrival'){
					$params->arrival = 1;
					$params->status = "";
				}
				$params->role_condition = 'WHERE s.warehouse_id = "'.$wechatUserInfo->warehouse_id.'" ';
			}

			//司机查看提货单
			elseif($wechatUser->user_type == '3'){
				if($params->status == 'onway'){//在途
					$params->status = '7';
				}elseif($params->status == 'arrival'){
					$params->arrival = 1;
					$params->status = "";
				}else{
					$params->gtstatus = 3;
				}
				$params->role_condition = ' WHERE s.driver_phone = "'.$wechatUser->phone.'" ';
			}

			//承运商查看运单
			elseif($wechatUser->user_type == '4'){
				if($params->status == 'onway'){
					$params->pickup = 1;
					$params->status = '';
				}
				elseif($params->status == 'arrival'){
					$params->arrival = 1;
					$params->status = "";
				}
				$carrierInfo = $this->dao->selectOne('carrier.selectPage', array('relation_phone' => $wechatUser->phone));
				$params->role_condition = ' WHERE s.carrier_id = "'.$carrierInfo->carrier_id.'" ';
			}
		}
		//判断身份 司机身份不需要orgcode
		if(empty($wechatUser)){
			$params->role_condition = $this->getRoleCondition($params->orgcode);
			$params->sortColumns='s.create_time DESC';
		}
		//处理创建时间参数
		$date = explode(' - ', $params->statistic_date);
		$params->start = $date[0];
		$params->end = $date[1];
		//处理计划发车时间参数
		if($params->statistic_date_s){
		$date = explode(' - ', $params->statistic_date_s);
		$params->start = $date[0];
		$params->end = $date[1];
		}
		//添加出发地和目的地的筛选
		/*$params->fromlocation = $params->ddlProvince.''.$params->ddlCity;
		$params->tolocation = $params->toloProvince.''.$params->toloCity;*/
		//添加招投标筛选条件
		$shipment_id = array();$shipment_param = [];
		if($params->bidding_status != '' && $params->over_price != ''){
			if($params->bidding_status == '2'){
				$params->gtstatus = '2' ;
				$shipment_param = ['field'=>'shipment_id','status'=>'3','over_price'=>$params->over_price];
			}else{
				$shipment_id = array('0');
			}
		}elseif($params->bidding_status != ''){
			//根据投标状态查询运单号
			if($params->bidding_status == '0'){
				$params->status = '1';
			}elseif($params->bidding_status == '1') {
				$shipment_param = ['field' => 'shipment_id', 'now' => date('Y-m-d H:i:s'), 'isTendering' => 1];
			}elseif($params->bidding_status == '2') {
				$shipment_param = ['field'=>'shipment_id','evaluation'=>1,'over_price'=>$params->over_price];
			}
		}elseif($params->over_price != ''){
			$params->gtstatus = '2' ;
			$shipment_param = ['field'=>'shipment_id','status'=>'3','over_price'=>$params->over_price];
		}
		if(!empty($shipment_param)){
			$shipment_id = array('0');
			$shipment_ids  =  $this->dao->selectList('shipment.searchById_tender',$shipment_param);
			if(!empty($shipment_ids)){
				foreach($shipment_ids AS $key=>$val){
					$shipment_id[] =$val->shipment_id;
				}
			}
		}
		if(!empty($shipment_id)){
			$params->shipment_id = $shipment_id;
		}
		if($params->check_shipStatus){
			if($params->check_shipStatus == 'arrival'){
				unset($params->check_shipStatus);
				$params->arrival = true;
			}elseif($params->check_shipStatus == 'valid'){
				unset($params->check_shipStatus);
				$params->invalid = true;
			}
		}
		/*if($params->bidding_status != '' || $params->over_price != ''){

			//根据投标状态查询运单号
			if($params->bidding_status == '0'){
				$params->status = '1';
			}else{
				if($params->bidding_status == '1'){
					$now = date('Y-m-d H:i:s');orderCheck
					$shipment_ids  =  $this->dao->selectList('shipment.searchById_tender',['field'=>'shipment_id','now'=>$now,'over_price'=>$params->over_price,'isTendering'=>1]);
				}
				if($params->bidding_status == '2'){
					$evaluation = '1';
					$shipment_ids  =  $this->dao->selectList('shipment.searchById_tender',['field'=>'shipment_id','evaluation'=>$evaluation,'over_price'=>$params->over_price]);
				}

				$shipment_id = array('0');
				if(!empty($shipment_ids)){
					foreach($shipment_ids AS $key=>$val){
						$shipment_id[] =$val->shipment_id;
					}
				}
				$params->shipment_id = $shipment_id;
			}

		}*/
		
		//var_dump($params);exit;
		//print_r($params);
		$rt = $this->dao->selectPage('shipment.getShipments', $params);
		//承运商查看运单状态
		if($params->userrole=='carrier' || $params->is_export){
			if($rt->result){
				foreach($rt->result as $key=>$val){
					$orderSum=$this->dao->selectList('shipment.getOrderSum',array('shipment_id'=>$val->id));
					$orderIds = $this->dao->selectOne('shipment.getOrderIDs',array('shipment_id'=>$val->id));
					$orderCheckSum=$this->dao->selectList('shipment.getOrderCheckSum',array('shipment_id'=>$val->id));

					if($orderSum[0]->orderSum==0){
						$rt->result[$key]->orderCheck='无订单';
					}else{
						$rt->result[$key]->orderSum=$orderSum[0]->orderSum;
						$rt->result[$key]->orderCheckSum=$orderCheckSum[0]->orderCheckSum;
						$rt->result[$key]->notCheckNum=$orderSum[0]->orderSum-$orderCheckSum[0]->orderCheckSum;
						if($rt->result[$key]->notCheckNum==0){
							$rt->result[$key]->orderCheck='已全部回单';
						}else{
							$rt->result[$key]->orderCheck='有'.$rt->result[$key]->notCheckNum.'个未回单';
						}
						$rt->result[$key]->orderIds=$orderIds->ids;
					}
				}
			}
		}

		if ($rt->totalCount > 0) {
			//处理数据
			foreach ($rt->result as $key => $value) {
				if ($value->business_type == 1) {
					$rt->result[$key]->business_type = '省内';
				} else {
					$rt->result[$key]->business_type = '省外';
				}
				//查询司机位置
				$param = array('phone' => $value->driver_phone);
				if ($position = $this->dao->selectOne('shipment.getDriverPoint', $param)) {
					$rt->result[$key]->city = $position->city;
				}

				/*计算单价*/
				if($value->price != null){
				    $rt->result[$key]->unit_price = $value->weight == 0.00 ? '' : number_format($value->price/$value->weight,2);
				}else{
					$rt->result[$key]->unit_price = '';
				}
			}
		}
		return $rt;
	}
	/**
	 * 获取运单id列表
	 * Author ZHM
	 * 2016-7-13
	 */
	public function getShipmentCodes ($args) {
		$fixer = fixer::input($args);
		$params = $fixer->get();
		$params->role_condition = $this->getRoleCondition($params->orgcode);
		return $rt = $this->dao->selectList('shipment.getShipmentCodes', $params);
	}
	/**
	 * 获取司机列表
	 * Author ZHM
	 * 2016-7-13
	 */
	public function getDrivers ($args) {
		$fixer = fixer::input($args);
		$params = $fixer->get();
		$params->role_condition = $this->getRoleCondition($params->orgcode);
		return $rt = $this->dao->selectList('shipment.getDrivers', $params);
	}
	/**
	 * 获取车牌号列表
	 * Author ZHM
	 * 2016-7-13
	 */
	public function getCarnums ($args) {
		$fixer = fixer::input($args);
		$params = $fixer->get();
		$params->role_condition = $this->getRoleCondition($params->orgcode);
		return $rt = $this->dao->selectList('shipment.getCarnums', $params);
	}
	/**
	 * 获取司机手机号列表
	 * Author ZHM
	 * 2016-7-13
	 */
	public function getDriver_phone ($args) {
		$fixer = fixer::input($args);
		$params = $fixer->get();
		$params->role_condition = $this->getRoleCondition($params->orgcode);
		return $rt = $this->dao->selectList('shipment.getDriver_phone', $params);


	}
	/**
	 * 获取运单相关订单列表
	 * Author ZHM
	 * 2016-7-13
	 */
	public function getOrderList($args) {
		$fixer = fixer::input($args);
		$params = $fixer->get();
		$rt = $this->dao->selectList('shipment.getOrderList', $params);
		if (count($rt) > 0) {
			foreach ($rt as $key => $value) {
				switch ($value->checkout) {
					case '1':
						$rt[$key]->checkout = '未签收';
						break;
					case '2':
						$rt[$key]->checkout = '正常签收';
						break;
					case '3':
						$rt[$key]->checkout = '异常签收';
						break;
					default:
						$rt[$key]->checkout = '其他';
						break;
				}
				$value->date = date('Y-m-d');
				//订单编号生成条形码路径
				/*生成新数字*/
				$value->NewId = str_pad($value->id,8,'0',STR_PAD_LEFT);
				$value->qrcode = sprintf($this->config->Barcode,$value->NewId);
			}
		}
		return $rt;
	}

	/**
	 * 运单相关订单列表打印运输凭证专用
	 * Author SUNJIE
	 * 2017-1-12
	 */
	public function getOrderListPrint($args) {
		$fixer = fixer::input($args);
		$params = $fixer->get();
		$rt = $this->dao->selectList('shipment.getOrderListPrint', $params);
		$page = 1;
		if($rt){
			foreach($rt AS $key=>$val){
				$val->printTime = date('Y-m-d H:i:s');
				$val->printDay = date('Y年m月d日');
				if($key %5 == 0 && $key != 0){
					$page+=1;
				}
				if($key <= $page*5){
					$rt['page'.$page][] =$val;
					$rt['page'.$page][0]->curpage=$page;	
					unset($rt[$key]);

				}
			}

			$rt['page1'][0]->countpage=count($rt);
		}
		return $rt;
	}

	/**
	 * 获取运单相关订单列表
	 * Author Ivan
	 * 2016-9-18
	 */
	public function getOrderListById($args) {
		$fixer = fixer::input($args);
		$params = $fixer->get();
		$rt = $this->dao->selectList('shipment.getOrderList', $params);
		foreach($rt as $key=>$val){
			$rt[$key]->distance=number_format($val->distance,2);
		}
		return $rt;
	}
	/**
	 * 转包上报
	 * Author ZHM
	 * 2016-7-13
	 */
	public function subcontracting($args) {
		$fixer = fixer::input($args);
		$params = $fixer->get();
		if ($params->orderid) {
			if($params->carnum) {
				//获取地址
				if ($params->position) {
					//调用接口
					$rt = $this->loadService('Client')->g7sRequest("map.api.geoSearch", array('address' => $params->position));
					if ($rt['code'] == 0) {
						//判断地址详细程度至少为市级
						if ($rt['data']['result']['ilevel'] > 3) {
							//获取经纬度
							$lat = $rt['data']['result']['lat'];
							$lng = $rt['data']['result']['lng'];
							//拆分运单、订单号
							$id = explode('_', $params->orderid);
							$params->shipment_id = $id[0];
							$params->order_id = $id[1];
							//处理参数
							$params->report_type = '转包上报';
							$params->lng = $lng;
							$params->lat = $lat;
							$params->images = '';
							$params->open_id = '';
							//保存数据
							if ($rt = $this->dao->insert("shipment.subcontracting", $params)) {
								return array('code' => 0, 'msg' => '上报成功！');
							} else {
								return array('code' => 1, 'msg' => '上报失败，请重试');
							}
						} else {
							return array('code' => 1, 'msg' => '请正确填写详细地址');
						}
					} else {
						return array('code' => 1, "msg" => $rt['message']);
					}

				} else {
					return array("code" => 1, "msg" => '缺少地址');
				}
			} else {
				return array("code" => 1, "msg" => "缺少车牌号");
			}
		} else {
			return array("code" => 1, "msg" => "缺少订单号");
		}
	}

	/**
	 * 转包上报
	 * Author Ivan
	 * 2016-9-18
	 */
	public function applySubcontract($args) {
		$fixer = fixer::input($args);
		$params = $fixer->get();
		if ($params->orderid) {
			if($params->carnum) {
				//获取地址
				if ($params->position) {
					//调用接口
					$rt = $this->loadService('Client')->g7sRequest("map.api.geoSearch", array('address' => $params->position));
					if ($rt['code'] == 0) {
						//判断地址详细程度至少为市级
						if ($rt['data']['result']['ilevel'] >= 3) {
							//获取经纬度
							$lat = $rt['data']['result']['lat'];
							$lng = $rt['data']['result']['lng'];
							//拆分运单、订单号
							$id = explode('_', $params->orderid);
							$params->shipment_id = $id[0];
							$params->order_id = $id[2];
							//处理参数
							$params->report_type = 1;
							$params->lng = $lng;
							$params->lat = $lat;
							$params->images = '';
							$params->open_id = '';
							$result = $this->dao->insert("shipment.subcontracting", $params);
							//保存数据
							if ($result) {
								return array('code' => 0, 'msg' => '上报成功！');
							} else {
								return array('code' => 1, 'msg' => '上报失败，请重试');
							}
						} else {
							return array('code' => 1, 'msg' => '请正确填写详细地址');
						}
					} else {
						return array('code' => 1, "msg" => $rt['message']);
					}

				} else {
					return array("code" => 1, "msg" => '缺少地址');
				}
			} else {
				return array("code" => 1, "msg" => "缺少车牌号");
			}
		} else {
			return array("code" => 1, "msg" => "缺少订单号");
		}
	}
	/**
	 * Desc:进出厂扫码验证
	 * @param $res
	 * @Author Lvison
	 * @return array
	 */
	public function checkScan($res){

		if(empty($res['openid'])){
			return array('code'=>0,'message'=>'缺少参数openid');
		}

		if(empty($res['scanResult'])){
			return array('code'=>0,'message'=>'缺少参数scanResult');
		}

		if(empty($res['scanType'])){
			return array('code'=>0,'message'=>'缺少参数scanType');
		}

		if(empty($res['code'])){
			return array('code'=>0,'message'=>'缺少参数code');
		}
		$warehouse = $this->dao->selectOne('shipment.getWarehouse',array('qrcode_result'=>$res['scanResult']));
		$truckSource = $this->dao->selectOne('shipment.getTruckSource',array('openid'=>$res['openid']));
		if(empty($warehouse)){
			return array('code'=>0,'message'=>'无法取得基地/片区信息');
		}
		if(empty($truckSource)){
			return array('code'=>0,'message'=>'无法取得司机信息');
		}
		if($res['scanType'] == 'in'){
			$shipment_count = $this->dao->selectOne('shipment.getShipment',array('field'=>'id,shipment_code,driver_phone,driver_name,carrier_id','maxStatus'=>6,'minStatus'=>4,'warehouse_id'=>$warehouse->id,'driver_phone'=>$truckSource->driver_phone,'code'=>$res['code']));
			if(empty($shipment_count->driver_phone) || empty($shipment_count->driver_name) || empty($shipment_count->carrier_id)){
				return array('code'=>0,'message'=>'运单信息不完整');
			}
			if(!empty($shipment_count)){
				$lastCount = $this->dao->selectOne('shipment.getShipment',array('field'=>'count(`id`) as count','status'=>6,'warehouse_id'=>$warehouse->id));
				//更新运单状态
				$this->dao->update('shipment.updateStatus',array('id'=>$shipment_count->id,'status'=>6,'arrivewh_time'=>date("Y-m-d H:i:s")));
				//发送运单状态给TMS
				$data = array('code'=>$shipment_count->shipment_code,'type'=>"1",'time'=>date('Y-m-d H:i:s'));
				//TODO:web service 暂时不通
				$this->loadService('client')->webServiceRequest('sendShipmentStatus',$data);
				/*清除 redis 缓存*/
				$redis = redisCache("sendwechatoverdue");
				$redis = json_decode($redis,true);
				if(!empty($redis[$shipment_count->shipment_code])){
					unset($redis[$shipment_count->shipment_code]);
					redisCache("sendwechatoverdue",$redis);
				}
				//上报
				$this->dao->insert('shipment.saveEventReport',array('shipment_id'=>$res['shipment_id'],'report_type'=>10,'address'=>$res['address'],'report_desc'=>'进场','lng'=>$res['lng'],'lat'=>$res['lat'],'images'=>'','openid'=>$res['openid'],'time'=>date("Y-m-d H:i:s"),'carnum'=>$truckSource->carnum));
				return array('code'=>1,'warehouseName'=>$warehouse->name,'shipmentCount'=>!empty($lastCount->count) ? $lastCount->count-1 : 0,'carnum'=>$truckSource->carnum);
			}else{
				return array('code'=>0,'message'=>'暂无任务在该区域');
			}
		}else{
			$shipment_count = $this->dao->selectOne('shipment.getShipment',array('field'=>'id,shipment_code,carrier_id,warehouse_id,plan_leave_time,plan_arrive_time,from_province,to_province,shipment_method,ship_type,weight','status'=>6,'warehouse_id'=>$warehouse->id,'driver_phone'=>$truckSource->driver_phone,'code'=>$res['code']));
			if(!empty($shipment_count)){
				//更新运单状态
				$this->dao->update('shipment.updateStatus',array('id'=>$shipment_count->id,'status'=>7,'leavewh_time'=>date("Y-m-d H:i:s")));
				//上报
				$this->dao->insert('shipment.saveEventReport',array('shipment_id'=>$res['shipment_id'],'report_type'=>11,'address'=>$res['address'],'report_desc'=>'出场','lng'=>$res['lng'],'lat'=>$res['lat'],'images'=>'','openid'=>$res['openid'],'time'=>date("Y-m-d H:i:s"),'carnum'=>$truckSource->carnum));

				if($shipment_count->ship_type==1){
					$quoteMsg=$this->dao->selectOne('shipment.getQuoteId',array('shipmentid'=>$shipment_count->id));
					if(!empty($quoteMsg) && $quoteMsg->price_type==2){
						$tallage_price=$quoteMsg->quote_price*$shipment_count->weight;
						$this->dao->update('shipment.updateTenderQuoteById',array('id'=>$quoteMsg->id,'tallage_price'=>$tallage_price,'tender_weight'=>$shipment_count->weight,'total_price'=>$tallage_price));
						$this->dao->update('shipment.updateShipmentPrice',array('id'=>$shipment_count->id,'price'=>$tallage_price));
					}

				}
				//发送最终运输信息给TMS
				$this->sendBindConfirm($res['shipment_id']);

				//发送运单状态给TMS
				$data = array('code'=>$shipment_count->shipment_code,'type'=>"2",'time'=>date('Y-m-d H:i:s'));
				$this->loadService('client')->webServiceRequest('sendShipmentStatus',$data);
				//没有GPS定位的车辆写入缓存
				if($truckSource->type == '1' && ($truckSource->shipment_method == '整车' || $truckSource->shipment_method == '整车运输')){
					$lbsCarToken = redisCache("lbs_car");
					$lbsCarToken = json_decode($lbsCarToken,true);
					if($lbsCarToken){
						$params = $lbsCarToken;
					} else{
						$params = array();
					}
					//省内省外运单判断
					if($shipment_count->from_province == $shipment_count->to_province){
						$province = '1';//省内
					}else{
						$province = '2';//省外
					}
					//查询承运商
					$carrier = $this->dao->selectOne('carrier.getCarrierById',array('id'=>$shipment_count->carrier_id));

					$param_car = array();
					$param_car["truck_source_id"] = $truckSource->id;
					$param_car["carrier_id"] = $shipment_count->carrier_id;
					$param_car["orgcode"] = $carrier->g7s_orgcode;
					$param_car["shipment_id"] = $res['shipment_id'];
					$param_car["warehouse_id"] = $shipment_count->warehouse_id;
					$param_car["carnum"] = $truckSource->carnum;
					$param_car["phone"] = $truckSource->driver_phone;
					$param_car["times"] = 0;
					$param_car["timingTimes"] = 0;
					$param_car["province"] = $province;
					$param_car["plan_leave_time"] = time();
					$param_car["timingValue"] =(strtotime($shipment_count->plan_arrive_time) - strtotime($shipment_count->plan_leave_time))/2;
					$params[''.$truckSource->driver_phone.''] = $param_car;
					redisCache("lbs_car",$params);
				}

				return array('code'=>1,'warehouseName'=>$warehouse->name,'carnum'=>$truckSource->carnum);
			}else{
				return array('code'=>0,'message'=>'	暂无任务在该区域');
			}
		}
	}

	/**
	 * Desc:发送运单运输信息到tms
	 * @param $shipmentId
	 * @Author Lvison
	 * @return bool
	 */
	public function sendBindConfirm($shipmentId){
		if(empty($shipmentId)){
			return false;
		}
		$shipment_msg=$this->dao->selectOne('shipment.getShipmentMsg',array('shipmentid'=>$shipmentId));
		
		
		if($shipment_msg->ship_type == '0'){		//一口价
			$mp = $this->dao->selectOne('maintain_price.getOneByShpid',array('shipmentid'=>$shipmentId));
			
			switch ($mp->price_type){
				case '1':
					$prePrice = $mp->price;
					$tender_type='按车报价';
					break;
				case '2':
					$prePrice=$mp->unit_price;
					$tender_type='按吨报价';
					break;
			}
			
		}else{		//招标价格
			
			$tenderMsg=$this->dao->selectOne('shipment.getTenderMessage',array('shipmentid'=>$shipmentId));
			
			if($tenderMsg->price_type==1){
				$prePrice=sprintf('%.2f',$tenderMsg->tallage_price/$shipment_msg->weight);
				$tender_type='按车报价';
			}else{
				$prePrice=$tenderMsg->quote_price;
				$tender_type='按吨报价';
			}
		}
		
		
		//$driver = $this->dao->selectOne('truck_source.getDriver',array('driver_phone'=>$shipment_msg->driver_phone));
// 		if(empty($tenderMsg->price_type)){
// 			if($shipment_msg->price_type){
// 				if($shipment_msg->price_type==1){
// 					$prePrice = $shipment_msg->price ? sprintf('%.2f',$shipment_msg->price/$shipment_msg->weight) :0;
// 					$tender_type='按车报价';
// 				}else{
// 					$prePrice=$shipment_msg->price? $shipment_msg->price : 0;
// 					$tender_type='按吨报价';
// 				}
// 			}else{
// 				$prePrice=$shipment_msg->price? $shipment_msg->price : 0;
// 				$tender_type='未设置报价方式';
// 			}
// 		}else
			
			
		$prePrice = $prePrice?$prePrice:'0';

		$data = array('code'=>$shipment_msg->shipment_code,//运单号
			'organizing_code'=>$shipment_msg->organizing_code,//中标承运商组织机构代码
			'carrier_name' => $shipment_msg->carrier_name,//中标承运商
			'carnum' => $shipment_msg->carnum,//车牌
			'driver_name' => $shipment_msg->driver_name,//中标车辆司机姓名
			'driver_phone' => $shipment_msg->driver_phone,//中标车辆司机电话
			'tender_price' => $shipment_msg->price ? $shipment_msg->price : 0,//运输价格
			'ship_type' => $shipment_msg->ship_type, //1-车车招标，0-固定运价
			'weight' => $shipment_msg->weight,//吨数
			'price' => $prePrice,//每吨价格
			'tender_type' => $tender_type,//按车报价：按吨报价
			'carriagetype'=>$shipment_msg->carriagetype //厢型
		);
		$this->loadService('client')->webServiceRequest('sendBindConfirm',$data);
	}

	/**
	 * 2016-7-21
	 * Author ZHM
	 * 同步运单数据接口
	 */
	public function syncShipment($json = ''){
		//保存日志
		tools::datalog('同步运单参数'.var_export($json,true),'syncShipment_');
		if ($json == '') {
			throwException('获取json数据失败', 0);
		}
		$params = json_decode($json);
		if (empty($params)) {
			throwException('json数据解析失败', 0);
		}
		//若为数组统一转换为对象
		if (is_array($params)) {
			$params = array2object($params);
		}
		//时间
		$time = date('Y-m-d H:i:s');
		//参数验证
		if (!property_exists($params, 'code') || $params->code == '') {
			throwException('缺少调度单号', 0);
		}
		if (!property_exists($params, 'type') || $params->type == '') {
			throwException('缺少变更类型', 0);
		} else if ($params->type == 1 || $params->type == 2) {
			if (!property_exists($params, 'plat_form_code') || $params->plat_form_code == '') {
				throwException('缺少基地/片区编码', 0);
			} else {
				//验证基地片区编码是否正确
				try {
					$rt = $this->dao->selectOne('shipment.getWarehouseId', array('platform_code' => $params->plat_form_code));
					if (!$rt) {
						echo json_encode(array('code' => 0, 'message' => '基地/片区编码错误'));
						exit();
					} else {
						$params->warehouse_id = $rt->id;
					}
				} catch (Exception $e) {
					throwException('获取基地信息失败', 0);
				}
			}
			if (!property_exists($params, 'plat_form_name') || $params->plat_form_name == '') {
				throwException('缺少基地/片区名称', 0);
			}
			if (!property_exists($params, 'shipment_method') || $params->shipment_method == '') {
				throwException('缺少运输方式', 0);
			}

			//$params->shipment_method = $params->shipment_method == '整车运输' ? '整车' : '零担';
			if (!property_exists($params, 'fromlocation') || $params->fromlocation == '') {
				throwException('缺少出发地地址', 0);
			}
			$params->from_province = $params->from_province ? $params->from_province : '';
			$params->from_city = $params->from_city ? $params->from_city : '';

			if (!property_exists($params, 'tolocation') || $params->tolocation == '') {
				throwException('缺少目的地地址', 0);
			}
			$params->to_province = $params->to_province ? $params->to_province : '';
			$params->to_city = $params->to_city ? $params->to_city : '';

			/*if (!property_exists($params, 'quality') || $params->quality == '') {
				throwException('缺少货物数量', 0);
			}*/
			if (!property_exists($params, 'weight') || $params->weight == '') {
				throwException('缺少货物重量', 0);
			}
			if (!property_exists($params, 'volume') || $params->volume == '') {
				throwException('缺少货物体积', 0);
			}
			/*if (!property_exists($params, 'plan_leave_time') || $params->plan_leave_time == '') {
				throwException('缺少计划出发时间', 0);
			}
			if (!property_exists($params, 'plan_arrive_time') || $params->plan_arrive_time == '') {
				throwException('缺少计划到达时间', 0);
			}*/
			if (!property_exists($params, 'status') || $params->status == '') {
				throwException('缺少调度单状态', 0);
			}
			/*if (!property_exists($params, 'ordercodes') || $params->ordercodes == '') {
				throwException('缺少订单号', 0);
			}*/
			/*if (!property_exists($params, 'distance') || $params->distance == '') {
				throwException('缺少运距', 0);
			}*/
			if (!property_exists($params, 'from_address')) {
				$params->from_address = '';
			}
			if (!property_exists($params, 'to_address')) {
				$params->to_address = '';
			}
			if (!property_exists($params, 'from_lnglat')) {
				$params->from_lnglat = '';
			}
			if (!property_exists($params, 'to_lnglat')) {
				$params->to_lnglat = '';
			}
			if (!property_exists($params, 'remark')) {
				$params->remark = '';
			}
			if (!property_exists($params, 'vehicle_type')) {
				$params->vehicle_type = '';
			}
			if (!property_exists($params, 'serial_num')) {
				$params->serial_num = '';
			}
			if (!property_exists($params, 'originator')) {
				$params->originator = '';
			}
			if (!property_exists($params, 'is_tender') || $params->is_tender != 2) {
				$params->is_tender = 1;
			}
			if (property_exists($params, 'carrier_name') && $params->carrier_name != '') {
				//验证承运商及车辆信息
				try {
					$rt = $this->dao->selectOne('shipment.carrierCheck', array('carrier_name' => $params->carrier_name));
					if ($rt) {
						$params->is_tender = 2;
					}
					else {
						$params->carrier_id = '';
					}
				} catch (Exception $e) {
					tools::datalog('获取车辆承运商信息失败错误'.var_export($e->getMessage(),true),'syncShipment_');
					throwException('获取车辆承运商信息失败', 0);
				}
			} else {
				$params->carrier_id = '';
				$params->carnum = '';
			}
		}

		//判断操作类型
		if ($params->type == 1) {
			$params->create_time = $params->making_time?$params->making_time:$time;
			$params->update_time = $time;
			$params->year_month = $params->year_month ? $params->year_month : date('Y-m');
			$params->deleted = 0;
			$old_shipment = $this->dao->selectOne('shipment.getShipmentId', array("shipment_code" => $params->code));
			if(!empty($old_shipment)){
				$shipment_id = $old_shipment->id;
				$params->id = $old_shipment->id;
				unset($params->status);
				unset($params->is_tender);
				$this->dao->update('shipment.clearOrders',$params);
				$this->dao->update('shipment.updateShipment',$params);
				
				//吨位变化更新价格
				$params->shipmentid = $shipment_id;
				$shipment_msg=$this->dao->selectOne('shipment.getShipmentMsg',$params);
				if($shipment_msg->ship_type==1){
					
					$quoteMsg=$this->dao->selectOne('shipment.getQuoteId',$params);
					if(!empty($quoteMsg) && $quoteMsg->price_type==2){
						$tallage_price=$quoteMsg->quote_price*$shipment_msg->weight;
						$this->dao->update('shipment.updateTenderQuoteById',array('id'=>$quoteMsg->id,'tallage_price'=>$tallage_price,'tender_weight'=>$shipment_msg->weight,'total_price'=>$tallage_price));
						$this->dao->update('shipment.updateShipmentPrice',array('id'=>$params->shipmentid,'price'=>$tallage_price));
						tools::datalog('shipment_id:'.$params->shipmentid.' '.var_export($tallage_price,true),'syncPrice_');
					}
				}else{
					
					$mp = $this->dao->selectOne('maintain_price.getOneByShpid',array('shipmentid'=>$shipment_id));
					if($mp && $mp->price_type == '2'){
						$tallage_price = $shipment_msg->weight * $mp->unit_price;
						$this->dao->update('shipment.updateShipmentPrice',array('id'=>$params->shipmentid,'price'=>$tallage_price));
					}
					
				}
				
				
			}else{
				$last_insert = $this->dao->insert('shipment.insertShipment', $params);
				$shipment_id = $last_insert['id'];

				//系统自动授权
				/*$ordercodes = explode(',', $params->ordercodes);
				foreach ($ordercodes as $code) {
					$code = trim($code);
					$rest=$this->dao->selectOne('order.phoneCheck',array('order_code'=>$code));
					if($rest){
						$author_history = array("time"=>date('Y-m-d H:i:s'),"content"=>'系统自动授权成功，授权给'.$rest->to_phone);
					}else{
						$author_history = array("time"=>date('Y-m-d H:i:s'),"content"=>'系统自动授权失败，授权给'.$rest->to_phone);
					}
					$author_history = json_encode($author_history);
					$this->dao->update('order.updateHistory',array('author_history'=>$author_history,'order_code'=>$code));
				}*/
			}

			//更新订单的运单号
			$ordercodes = explode(',', $params->ordercodes);
			foreach ($ordercodes as $code) {
				$code = trim($code);
				if(empty($code)){
					continue;
				}
				//更新订单表
				try {
					$update_data = array(
						'order_code' 		=> $code,
						'shipment_code' 	=> $params->code,
						'shipment_id' 		=> $shipment_id,
						'update_time' 		=> $time,
						'plan_leave_time' 	=> $params->plan_leave_time,
						'plan_arrive_time' 	=> $params->plan_arrive_time,
						'from_address' 		=> $params->from_address,
						'to_address' 		=> $params->to_address,
						'from_lnglat' 		=> $params->from_lnglat,
						'to_lnglat' 		=> $params->to_lnglat,
						'deleted'			=> 0
					);
					$this->dao->update('order.orderUpdate', $update_data);
				} catch (Exception $e) {
					//保存错误日志
					tools::datalog('更新订单运单号错误'.var_export($e->getMessage(),true),'syncShipment_');
					throwException('新增运单失败 2', 0);
				}
			}
			echo json_encode(array('code' => 1, 'message' => ''));
			exit();
		} else if ($params->type == 3) {
			//修改\删除运单
			//检查运单是否存在
			if ($shipment = $this->dao->selectOne('shipment.getShipmentId', array("shipment_code" => $params->code))) {
				//删除运单
				$this->dao->update('shipment.updateShipment',array('id'=>$shipment->id,'deleted'=>1,'update_time'=>date('Y-m-d H:i:s')));
				echo json_encode(array('code' => 1, 'message' => ''));
				exit();
			} else {
				throwException('运单不存在', 0);
			}
		}else {
			throwException('不支持该变更类型', 0);
		}
	}

	/*定时推送消息给逾期车主 未完成*/
	public function pushoverdueinfo(){
		//  //读缓存
		 //$this->loadService("tender")->addRedisByPackage(array("shipment_code"=>"123456","tender_id"=>"9"));
		$redis = redisCache("sendwechatoverdue");
		$redis = json_decode($redis,true);
		$size = 100;
		$totle = (int)ceil(count($redis) / $size );
		if($totle){
			for($i=1;$i<=$totle;$i++){
				$newarr = array();
				$newarr = array_slice($redis, ($i-1)*$size, $size,true);
				foreach($newarr as $key=>$value){
					if($value){
						/*定时任务 读取缓存，并推送到微信端*/
						if(strtotime($value["plan_leave_time"])-time() >= 0){
							if(strtotime($value["plan_leave_time"])-time() > 3600*2-30  && strtotime($value["plan_leave_time"])-time() < 3600*2+30){
								$this->sendTempMessageoverdue($value,array("type"=>"还有两个小时到计划出发时间，请尽快到位"));
							}elseif(strtotime($value["plan_leave_time"])-time() <= 60){
								$this->sendTempMessageoverdue($value,array("type"=>"计划出发时间已到，请尽快到位"));
							}
						}else{
							/*已经逾期，清除缓存*/
							unset($redis[$key]);
							redisCache("sendwechatoverdue",$redis);
						}
					}
				}
			}
			exit;
		}
	}
	/*推送消息给逾期车主*/
	public function sendTempMessageoverdue($args,$type){
		/*通过车牌号查询openid*/
		$openid = $this->dao->selectOne('shipment.getOpenid', array("driver_phone"=>$args["driver_phone"]));
		$fixer = array(
			'openid'=>$openid->openid,
			'url'=>'',
			'first'=>array('value'=>$type["type"],'color'=>'#000000'),
			'keyword1'=>array('value'=>$args["tender_route"],'color'=>'#000000'), //货运线路
			'keyword2'=>array('value'=>$args["plan_leave_time"],'color'=>'#000000'),//提货点
			'remark'=>array('value'=>"请尽快到场装车，感谢配合",'color'=>'#000000')//备注
		);
		$data = $this->loadService('weChat')->sendTempMessage('shipment_overdue',$fixer,'shipment');
		return $data["errmsg"];
	}

	/**
	 * 接口地址解析
	 * ZHM
	 * 2016-7-26
	 */
	private function addressResolution($address) {
		if ($address != '') {
			//接口调用
			$rt = $this->loadService('Client')->g7sRequest("map.api.geoSearch", array('address' => $address));
			if ($rt['code'] == 0) {
				//判断地址详细程度至少为省级
				if ($rt['data']['result']['ilevel'] >= 2) {
					//返回地址信息
					return array('code' => 1, 'data' => $rt['data']['result']);
				} else {
					return array('code' => 0, 'msg' => '请正确填写详细地址');
				}
			} else {
				return array('code' => 0, "msg" => $rt['message']);
			}
		} else {
			return array('code' => 0, 'msg' => '缺少地址');
		}
	}

	/**
	 * 2016-7-26
	 * 接口里程测量
	 * 2016-7-26
	 */
	private function getDistance($from, $to) {
		if ($from == '' || $to == '') {
			return array('code' => 0, 'msg' => '缺少地址');
		} else {
			//接口调用
			$rt = $this->loadService('Client')->g7sRequest("map.api.distanceMeasure", array('site_A' => $from, 'site_B' => $to));
			if ($rt['code'] == 0) {
				//返回距离
				return array('code' => 1, 'distance' => $rt['data']['distance']);
			} else {
				return array('code' => 0, 'msg' => $rt['message']);
			}
		}
	}

	/**
	 * 2016-7-26
	 * Author ZHM
	 * 身份验证
	 */
	public function getRole($args) {
		$params = fixer::input($args)->get();
		if (property_exists($params, 'orgcode') && $params->orgcode != '') {
			//验证身份
			if ($this->dao->selectOne('shipment.checkRole', array('orgcode' => $params->orgcode, 'table' => 'carrier', 'condition' => 'g7s_orgcode'))) {
				//身份为承运商v
				return array('code' => 1, 'role' => 'carrier');
			} else if ($this->dao->selectOne('shipment.checkRole', array('orgcode' => $params->orgcode, 'table' => 'warehouse', 'condition' => 'orgcode'))) {
				//身份为基地片区调度
				return array('code' => 1, 'role' => 'warehouse');
			} else {
				throwException('身份验证失败');
			}
		} else {
			throwException('获取组织信息失败');
		}
	}

	/**
	 * 2016-7-26
	 * Author ZHM
	 * 身份验证
	 */
	public function dispatchCarnum($args) {
		$params = fixer::input($args)->get();
		//判断参数
		if (!property_exists($params, 'id') || $params->id == '') {
			throwException('请选择运单');
		} else if(!property_exists($params, 'carrier_id') || $params->carrier_id == '') {
			throwException('请选择承运商');
		} else if (!property_exists($params, 'carnum') || $params->carnum == '') {
			throwException('请选择车牌号');
		} else {
			//保存数据
			try {
				$this->dao->update('shipment.updateShipment', $params);

			} catch (Exception $e) {
				throwException($e->getMessage());
			}
			return array('code' => 0);
		}
	}

	/**
	 * 2016-7-27
	 * Author ZHM
	 * 获取承运商列表
	 */
	public function getBaseCarriers($args) {
		$params = fixer::input($args)->get();
		//判断参数
		if (!property_exists($params, 'carrier') || $params->carrier == '') {
			throwException('请输入承运商名称');
		} else {
			//查询数据
			try {
				$rt = $this->dao->selectList('shipment.getBaseCarriers', $params);
				return $rt;
			} catch (Exception $e) {
				throwException($e->getMessage());
			}
		}
	}

	/**
	 * 2016-7-27
	 * Author
	 * 通过身份添加条件
	 */
	private function getRoleCondition($orgcode, $w_condition = null, $c_condition = null) {

		//基地身份的条件
		$w_condition = empty($w_condition) ? 'LEFT JOIN `warehouse` AS `w` ON s.warehouse_id = w.id WHERE w.orgcode = #orgcode#' : $w_condition;
		//承运商身份的条件
		$c_condition = empty($c_condition) ? 'LEFT JOIN `carrier` AS `c` ON s.carrier_id = c.id WHERE c.g7s_orgcode = #orgcode#' : $c_condition;
		//验证参数
		if ($orgcode == '') {
			throwException('获取用户身份失败 1');
		}
		//获取身份
		if (!$this->userrole){
			$role_check = new stdClass();
			$role_check->orgcode = $orgcode;
			$rt = $this->getRole($role_check);
			if ($rt['code'] == 1) {
				$this->userrole = $rt['role'];
			} else {
				throwException('获取用户身份失败 2');
			}
		}
		if ($this->userrole == 'carrier') {
			return $c_condition;
		} else if ($this->userrole == 'warehouse') {

			return $w_condition;
		} else {
			throwException('非法身份');
		}
	}

	/**
	 * 2016-7-27
	 * Author ZHM
	 * 获取承运商车辆
	 */
	public function getCarrierCarnums($args){
		$params = fixer::input($args)->get();
		//判断参数
		if (!property_exists($params, 'carrier_id') || $params->carrier_id == '') {
			throwException('请先选择承运商');
		}
		//查询
		try {
			return $this->dao->selectList('shipment.getCarrierCarnums', $params);
		} catch (Exception $e) {
			throwException($e->getMessage());
		}
	}

	/**
	 * 根据订单获取承运商电话名称等信息
	 * @param $args
	 */
	public function getCarrierInfoByOrderid($args)
	{
		$params = fixer::input($args)->get();
		if (!property_exists($params, 'order_id') || $params->order_id == '') {
			throwException('未找到此订单');
		}

		try {
			return $this->dao->selectOne('shipment.getCarrierInfoByOrderid', $params);
		} catch (Exception $e) {
			throwException($e->getMessage());
		}
	}
	/**
	 * 获取出发地列表
	 * Author ZHM
	 * 2016-8-10
	 */
	public function getFromlocation($args) {
		$params = fixer::input($args)->get();
		$params->role_condition = $this->getRoleCondition($params->orgcode);
		return $rt = $this->dao->selectList('shipment.getFromlocation', $params);
	}

	/**
	 * 获取目的地列表
	 * Author ZHM
	 * 2016-8-10
	 */
	public function getTolocation($args) {
		$params = fixer::input($args)->get();
		$params->role_condition = $this->getRoleCondition($params->orgcode);
		return $rt = $this->dao->selectList('shipment.getTolocation', $params);
	}

	/**
	 * 获取运单详情
	 * Author sunjie
	 * 2016-8-30
	 */
	public function getShipmentInfo($args){

		$params = fixer::input($args)->get();
		//PC查看
		if(!isset($params->openid)){
			$shipmentInfo = $this->dao->selectOne('shipment.getShipmentInfoForID', $params);
			//查看订单详情
			$order_detail = $this->dao->selectList('shipment.getOrderDetail',array("field"=>"od.product_name,od.unit_name,od.quality,o.from_address,o.to_address,o.weight,o.volume","shipment_id"=>$shipmentInfo->id));
			$shipmentInfo->order_detail = $order_detail;
			//获取事件列表
			$shipmentInfo->report = $this->dao->selectList('shipment.getShipmentReport',array("shipment_id"=>$shipmentInfo->id));
			//获取LBS
			$shipmentInfo->lbslist = $this->dao->selectList('history.getLbs',array("carnum"=>$shipmentInfo->carnum,"update_time"=>$shipmentInfo->arrival_date ? $shipmentInfo->arrival_date : date('Y-m-d H:i:s'),"create_time"=>$shipmentInfo->create_time));
			return $shipmentInfo;
		}
		//获取微信用户的基础信息
		$wechatUser = $this->dao->selectONE('user.getUserInfoByOpenid',array('openid'=>$params->openid));
		if(!empty($wechatUser->openid)){
			//调度
			if($wechatUser->user_type == '5'){
				$shipmentInfo = $this->dao->selectOne('shipment.getShipmentInfo', $params);
				//整车运输获取车辆位置
				if($shipmentInfo->shipment_method != '零担'){
					//有设备的车辆通过GPS获取当前位置
					if($shipmentInfo->type == 2 && !empty($shipmentInfo->gpsno)){
						$shipmentInfo->truckOrgcode = $this->dao->selectOne('shipment.getTruckCode', array("truck_source_id"=>$shipmentInfo->truck_source_id))->g7s_orgcode;
						$app_key_secret =$this->dao->selectOne('truck_source.getApp_key_secret',array("driver_phone"=>$shipmentInfo->driver_phone));
						$shipmentInfo->address = $this->loadService('client')->gpsSendLocation(array("carnum"=>$shipmentInfo->carnum,"key_secret"=>$app_key_secret));
					}
					//没有设备的车辆通过LBS定位获取当前位置
					elseif($shipmentInfo->type == 1){
						$lbsCarToken = json_decode(redisCache("lbs_car"),true);
						$lbsAddress = $lbsCarToken[$shipmentInfo->driver_phone];
						$shipmentInfo->address = $lbsAddress['address'];
					}
				}
				//获取事件列表
				$shipmentInfo->report = $this->dao->selectList('shipment.getShipmentReport',array("shipment_id"=>$shipmentInfo->id));
				return $shipmentInfo;

			}elseif($wechatUser->user_type == '3'||$wechatUser->user_type == '4'){
				$shipmentInfo = $this->dao->selectOne('shipment.getShipmentInfo', $params);
				//查看订单详情
				$order_detail = $this->dao->selectList('shipment.getOrderDetail',array("field"=>"od.product_name,od.unit_name,od.quality","shipment_id"=>$shipmentInfo->id));
				$shipmentInfo->order_detail = $order_detail;
				return $shipmentInfo;
			}else{
				return array('code'=>1,'message'=>'您无权限查看数据');
			}

		}



	}
	/**
	 * Desc:获取当前省的货源信息
	 * @param $res
	 * @Author Ivan
	 */
	public function getOrderSource($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		/*$v=strpos($params['address'],'省')+3;*/
		$address = $this->loadService('Client')->g7sRequest("map.api.geoCode", array('orgcode' =>'','lng'=>$params['lng'],'lat'=>$params['lat']));
		/*$params['address']=substr($params['address'],0,$v);*/
		$params['address']=$address['data']['result']['province'];
		$result=$this->dao->selectPage('shipment.getOrderSource',$params);
		if($result->result){
			foreach($result->result as $key=>$val){
			$result->result[$key]->warename=$this->dao->selectOne('shipment.getWareName',array('id'=>$val->warehouse_id))->name;
			$result->result[$key]->path=$val->fromlocation.'-'.$val->tolocation;
			$result->result[$key]->plan_leave_time=substr($val->plan_leave_time,0,strpos($val->plan_leave_time,' '));
			$result->result[$key]->pama=$val->id.'_'.$val->status;
			}	
		}
		
		return $result;
	}
	/**
	 * Desc:获取当前省的老货源信息
	 * @param $res
	 * @Author Ivan
	 */
	public function getOldOrderSource($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		$v=strpos($params['address'],'省')+3;
		$params['address']=substr($params['address'],0,$v);
		$result=$this->dao->selectList('shipment.getOldOrderSource',$params);
		foreach($result as $key=>$val){
			$f=strpos($val->from_province,'省');
			$t=strpos($val->to_province,'省');
			$result[$key]->path=substr($val->from_province,0,$f).'-'.substr($val->to_province,0,$t);
			$result[$key]->plan_leave_time=substr($val->plan_leave_time,0,strpos($val->plan_leave_time,' '));
		}
		return $result;
	}
	/**
	 * Desc:获取承运商关联基地所在的省
	 * @param $res
	 * @Author Ivan
	 */
	public function getProvince($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		$params['create_time'] = date('Y-m-d H:i:s',strtotime('-2 day'));
		$result=$this->dao->selectList('shipment.getProvince',$params);
		return $result;
	}
	/**
	 * Desc:获取承运商关联基地所在省的历史货源信息
	 * @param $res
	 * @Author Ivan
	 */
	public function getOldCarrierSource($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		$result=$this->dao->selectList('shipment.getOldCarrierSource',$params);
		return $result;
	}
	/**
	 * Desc:获取承运商关联基地所在省的货源信息
	 * @param $res
	 * @Author Ivan
	 */
	public function getSourceByProvince($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		$params['create_time'] = date('Y-m-d H:i:s',strtotime('-2 day'));
		$result=$this->dao->selectPage('shipment.getSourceByProvince',$params);
		if($result->result){
			foreach($result->result as $key=>$val){
			$result->result[$key]->warename=$this->dao->selectOne('shipment.getWareName',array('id'=>$val->warehouse_id))->name;
			$result->result[$key]->path=$val->fromlocation.'-'.$val->tolocation;
			$result->result[$key]->pama=$val->id.'_'.$val->status;
			$result->result[$key]->plan_leave_time= $val->plan_leave_time != '0000-00-00 00:00:00' ? date('Y-m-d',strtotime($val->plan_leave_time)) :'';
			}	
		}
		
		return $result;
	}
	/**
	 * Desc:司机，承运商查看货源详细信息
	 * @param $res
	 * @Author Ivan
	 * @return array
	 */
	public function getOrderSourceDetail($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		$ware=$this->dao->selectOne('shipment.getWareHouseMsg',$params);
		$tenderMsg=$this->dao->selectOne('shipment.getTenderMsg',$params);
		$shipmentInfo = $this->dao->selectOne('shipment.getShipmentMsg',array('shipmentid'=>$params['id']));
		$return = array('ware'=>$ware ? $ware:'','tenderMsg'=>'','order'=>array(),'shipmentInfo'=>$shipmentInfo);
		if($tenderMsg){
			$tenderMsg->car_length=str_replace(",","-",$tenderMsg->car_length);
			$tenderMsg->tender_limit=date('Y/m/d H:i',strtotime($tenderMsg->tender_limit));
			$tenderMsg->temperature = $tenderMsg->temperature_from.'-'.$tenderMsg->temperature_to;
			if($tenderMsg->carriage_type){
				$carType = $this->dao->selectOne('truck_source.getBycarriageType',array("carriage_type"=>$tenderMsg->carriage_type));
				$tenderMsg->carriage_type =$carType->name;
				if($tenderMsg->carrige_type!='冷藏'&& $tenderMsg->carrige!='冷冻'){
					$tenderMsg->temperature='无';
				}
			}
			$return['tenderMsg'] = $tenderMsg;
		}
		$result=$this->dao->selectList('shipment.getOrderSourceDetail',$params);
		if($result){
			foreach($result as $key=>$val){
				$result[$key]->plan_leave_time=date('Y-m-d',strtotime($val->plan_leave_time));
			}
			$return['order'] = $result;
		}
		return $return;
	}
	/**
	 * Desc:向收货人发送收货申请获取收货人列表
	 * @param $res
	 * @Author Ivan
	 */
	public function applicationReceived($res){
		$fixer = fixer::input($res);
		$params = $fixer->get();
		$driver =$this->dao->selectOne('shipment.getDriverName',$params);
		$rt=$this->dao->selectList('shipment.selectOrder',array('driver_phone'=>$driver->driver_phone));
		if($rt){
			$rt[0]->driver_name=$driver->driver_name;
		}

		return $rt;
	}
	/**
	 * Desc:向收货人发送收货申请推送消息
	 * @param $res
	 * @Author Ivan
	 */
	public function sendMsgByOpenid($res){
		$fixer = fixer::input($res);
		$params = $fixer->get();
		$params->orderids=explode(',',$params->order_id);
		$params->applytime=date('Y-m-d H:i:s',time());
		//更新order表中的申请签收时间
		/*$result=$this->dao->update('shipment.updateOrderAppTime',$params);*/
		//发送微信消息
		foreach($params->orderids as $key=>$val){
			//微信模板推送
			$r=$this->dao->update('shipment.updateOrderAppTime',array('order_id'=>$val,'applytime'=>$params->applytime));
			$params->orderId=$val;
			$params->report_type=9;
			$params->report_desc='申请签收';
			$params->create_time=date('Y-m-d H:i:s',time());
			$res=$this->dao->insert('shipment.insertReport',$params);
			$result=$this->dao->selectOne('shipment.getRecivedMsg',array('order_id'=>$val));
			$fix = array(
				'openid'=>$result->openid,//收货人openid $val o0qQEwIV-WnnNGYpqG2NE_w_IvsE
				'url'=>$_SERVER['HTTP_HOST'].'/wechat/orderReceipt.html?openid='.$result->openid.'&order_id='.$result->id.'&order_code='.$result->order_code,
				'first'=>array('value'=>'你有一条申请签收！','color'=>'#000000'),
				'keyword1'=>array('value'=>$result->order_code,'color'=>'#000000'),//车牌号 params->carnum
				'keyword2'=>array('value'=>$params->carnum,'color'=>'#000000'),//时间params->date
				'keyword3'=>array('value'=>$params->driver_name,'color'=>'#000000'),//申请位置params->address
				'remark'=>array('value'=>'司机在'.$params->address.'发起申请签收','color'=>'#000000')
			);
			$sendmsg =$this->loadService('wechat')->sendTempMessage('apply_notice',$fix,'consign');
		}
		if($sendmsg->errcode==0){
			$result=array('code'=>0,'msg'=>'申请成功');
		}else{
			$result=array('code'=>1,'msg'=>'申请失败');
		}
		return $result;
	}

	/**
	 * Desc:事件提交，存入report表
	 * @param $res
	 * @Author Lvison
	 * @return array
	 */
	public function saveEventReport($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		$shipment=$this->dao->selectOne('shipment.getshipment_id',$params);
		if(empty($shipment)){
			return array('code'=>1,'msg'=>'上报失败，没有要上报的运单');
		}
		$params['images'] = implode(',',$params['checkout-image']);;
		$params['carnum']=$shipment->carnum;
		$params['shipment_id']=$shipment->id;
		$params['carrier_id']=$shipment->carrier_id;
		$params['phone']=$shipment->driver_phone;
		$params['type']=2;
		$params['truck_source_id']=$shipment->truck_source_id;
		$res=$this->dao->insert('shipment.saveReportLbs',$params);
		$result =$this->dao->insert('shipment.saveEventReport',$params);
		if($result){
			return array('code' => 0, 'msg' => '上报成功！');
		}else{
			return array('code' => 1, 'msg' => '上报失败！');
		}
	}

	/**
	 * Desc:获取承运商平台车源信息
	 * @param $res
	 * @Author Lvison
	 * @return array|Pager
	 */
	public function getTruckSourceByOpenid($res){
		$fixer = fixer::input($res);
		$params = $fixer->get();
		if($params->from_province==''&&$params->from_city==''&&$params->to_province==''&&$params->to_city==''){
			$result=array('result'=>array());
		}else{
			$result=$this->dao->selectPage('shipment.getTruckSourceByOpenid',$params);
			foreach($result->result as $key=>$val){
				$result->result[$key]->carriage_type=$this->dao->selectOne('shipment.getCarriageType',array('id'=>$val->carriage_type))->name;
			}
		}

		return $result;
	}

	/**
	 * Desc:获取司机姓名电话及当前位置（平台车源微信）
	 * @param $res
	 * @return null
	 */
	public function getDriverMsg($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		$orgcode=$this->dao->selectOne('shipment.getOrgcodeByOpenid',$params);//接口调用用
		$result=$this->dao->selectOne('shipment.getDriverMsg',$params);

		$carnum=$result->carnum;//接口调用所用参数
		//lbs定位需要查表
		if($result->type==1){
			$address=$this->dao->selectOne('shipment.getLbsMsg',array('id'=>$result->id));
			$result->location=$address->address;
		}
		//调用接口获取司机当前位置

		if($result->type==2){
			$data=array('orgcode'=>'2000VO','carnum'=>'自DX00032');
			$res=$this->loadService('client')->g7sRequest('truck.truck.getTruckSNowAddress',$data,'cdtest','51f9c98dfaf8b3eb9274933b611a4708');

			$lng=$res['data']['result'][0]['lng'];
			$lat=$res['data']['result'][0]['lat'];
			$fix=array('lng'=>$lng,'lat'=>$lat);
			$address=$this->loadService('api')->getAddressByLngLat($fix);
			$result->location=$address['address'];

		}

		return $result;
	}

	/**
	 * Desc:获取司机长跑路线列表
	 * @param $res
	 * @Author Ivan
	 */
	public function getRouteList($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		$phone=$this->dao->selectOne('shipment.getPhoneByOpenid',$params);
		$result=$this->dao->selectList('shipment.getRouteList',array('phone'=>$phone->phone));
		return $result;
	}
	/**
	 * Desc:司机添加长跑线路
	 * @param $res
	 * @Author Ivan
	 */
	public function saveDriverRoute($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		$route_id=$this->dao->selectOne('shipment.getRouteId',$params);
		$truck_source_id=$this->dao->selectOne('shipment.getTruckSourceId',$params);
		$re=array();
		if($route_id){
			$res=$this->dao->selectOne('shipment.getRid',array('route_id'=>$route_id->id,'truck_source_id'=>$truck_source_id->id));
			if($res){
				$re=array('code'=>2,'msg'=>'线路已经存在');
			}else{
				$result=$this->dao->insert('shipment.saveTruckRoute',array('route_id'=>$route_id->id,'truck_source_id'=>$truck_source_id->id));
				if($result){
					$re=array('code' => 0, 'msg' => '添加成功!');
				}else{
					$re=array('code' => 1, 'msg' => '添加失败!');
				}
			}

		}else{
			$params['create_time']=date('Y-m-d H:i:s',time());
			$params['id']=guid();
			$res=$this->dao->insert('shipment.saveDriverRoute',$params);
			$result=$this->dao->insert('shipment.saveTruckRoute',array('route_id'=>$params['id'],'truck_source_id'=>$truck_source_id->id));
			if($result){
				$re=array('code' => 0, 'msg' => '添加成功!');
			}else{
				$re=array('code' => 1, 'msg' => '添加失败!');
			}
		}


		return $re;
	}
	/**
	 * Desc:删除长跑路线
	 * @param $res
	 * @Author Ivan
	 */
	public function delDriverRoute($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		$params['route_id']=explode('_',$params['id'])[0];
		$params['truck_source_id']=explode('_',$params['id'])[1];
		$result=$this->dao->delete('shipment.delDriverRoute',$params);
		if($result){
			return array('code' => 0, 'msg' => '删除成功!');
		}else{
			return array('code' => 1, 'msg' => '删除失败!');
		}
	}


	/**
	 * Desc: 获取车辆当前位置
	 * @Author sunjie
	 */
	function getAddress($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();

		//LBS获取定位
		if($params['type'] == '1'){
			$address = $this->loadService('history')->lbsSendLocation($params['driver_phone'],'1');
		}
		//gps获取定位
		elseif($params['type'] == '2'){
			$app_key_secret =$this->dao->selectOne('truck_source.getApp_key_secret',array("driver_phone"=>$params['driver_phone']));
			$address = $this->loadService('client')->gpsSendLocation(array("carnum"=>$params['carnum'],"key_secret"=>$app_key_secret));
		}
		return array('msg' =>$address);
	}

	/**
	 * Desc: 获取运单状态
	 * @Author sunjie
	 */
	function checkTenderStatus($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		$result=$this->dao->selectOne('shipment.checkTenderStatus',array('id'=>$params['shipmentId']));
		if(isset($result->bidder_select) && $result->bidder_select!=""){
			$result->bidder_select = json_decode($result->bidder_select,true);
		}else{
			$result->bidder_select ="";
		}
		return $result;
	}


	/**
	 * Desc: 保存招标信息
	 * @Author sunjie
	 * @deprecated
	 */
	public function saveTender($res)
	{
		$fixer = fixer::input($res)->getArray();
		$bidder_select =array('carrier'=>0,"warehouse"=>0,"route"=>0,"history"=>0,"motorcade"=>0);
		if($fixer['tender_act']=='edit') {
			$result = $this->dao->selectOne('shipment.checkTenderStatus', array('id' => $fixer['shipment_id']));
			if ($result && $result->tender_status == 1 && $result->status == 2) {
			}else{
				throw new RuntimeException('不能改标', 2);
			}
			$fixer['cooperate_type'] = $result->cooperate_type;
			$fixer['price_type'] = $result->price_type;
			if($result->bidder_select!=""){
				$bidder_select=json_decode($result->bidder_select,true);
			}
		}else{
			$hasTender = $this->dao->selectOne('shipment.searchById_tender', array('field' => 'id','isSendTender'=>1,'shipment_id'=>$fixer['shipment_id']));
			if(!empty($hasTender)){
				throw new RuntimeException('此运单已发标', 2);
			}
		}
		if($fixer['cooperate_type'] == '2'){
			$base = ['cooperate_type', 'price_type', 'price',  'temperature_from','temperature_to', 'tender_limit', 'package_time'];
		}
		else{
			$base = ['cooperate_type', 'price_type', 'temperature_from', 'temperature_to',  'tender_limit', 'package_time'];
		}
		//检测参数
		foreach ($base as $v) {
			if(($fixer['carriage_type'] != '3A9C031FF4FA1647EA164434E71996AD' && $fixer['carriage_type'] != '9D2C4D484F78AF4827D5EB6A977A4F5E') && ($v=='temperature_from' || $v=='temperature_to')){//冷冻和冷藏不需要温度
				continue;
			}
			$value =  strval($fixer[$v]);
			if (!isset($value) || $value==''){
				throw new RuntimeException('红色部分为必填', 2);
			}
		}
		if(empty($fixer['tender_push']) && $fixer['tender_act']!='edit'){
			throw new RuntimeException('请选择竞标方', 2);
		}

		if(strtotime($fixer['tender_limit'])< strtotime(date("Y-m-d H:i:s"))){
			throw new RuntimeException('竞标截止时间不能小于当前时间', 2);
		}
		if(strtotime($fixer['package_time'])< strtotime($fixer['tender_limit'])){
			throw new RuntimeException('要求到场时间不能小于竞标截止时间', 2);
		}
		if($fixer['car_length1']< $fixer['car_length']){
			throw new RuntimeException('车长不符合要求', 2);
		}
		$not_in_openid = array();
		$bidder_select =array('carrier'=>$bidder_select['carrier']==1?1:intval($fixer['tender_push']['carrier']),"warehouse"=>$bidder_select['warehouse']==1?1:intval($fixer['tender_push']['warehouse']),
			"route"=>$bidder_select['route']==1?1:intval($fixer['tender_push']['route']),"history"=>$bidder_select['history']==1?1:intval($fixer['tender_push']['history']),"motorcade"=>!empty($bidder_select['motorcade'])?$fixer['tender_push']['motorcade']:'');
		if($fixer['tender_act']=='edit'){
			$tenderResult['id'] = $result->tender_id;
		}else{

			//写入tender
			$tenderResult =$this->dao->insert('shipment.saveTender',[
				'shipment_id'=>$fixer['shipment_id'],
				'shipment_code'=>$fixer['shipment_code'],
				'trans_type'=>$fixer['trans_type'],
				'cooperate_type'=>$fixer['cooperate_type'],
				'price'=>$fixer['price'],
				'price_type'=>$fixer['price_type'],
				'car_length'=>$fixer['car_length'].','.$fixer['car_length1'],
				'carriage_type'=>$fixer['carriage_type'],
				'temperature_from'=>$fixer['temperature_from'],
				'temperature_to'=>$fixer['temperature_to'],
				'tender_limit'=>$fixer['tender_limit'],
				'remark'=>$fixer['remark'],
				'status'=>'1',
				'package_time'=>$fixer['package_time'],
				'valid'=>'1',
				'create_time'=>date("Y-m-d H:i:s"),
				'bidder_select'=>json_encode($bidder_select)
			]);
		}
		//修改运单状态为竞标中
		$this->dao->update('shipment.updateStatus',['id'=>$fixer['shipment_id'],'status'=>'2']);
		//获取基地信息
		$warehouse = $this->dao->selectOne('warehouse.getByOrgcode', array('orgcode' => $this->app->user->organ->orgcode));
		//承运商
		$truck_source_id_array = array();
		$tenderPushCarrier = array();
		$tenderPushTruck = array();

		if($fixer['tender_push']['carrier'] ==1){
			$relation_phone_array = array();
			$carrier = $this->dao->selectList('carrier.selectPage',['warehouse_id'=>$warehouse->id,'trans_type'=>$fixer['trans_type']]);
			foreach($carrier AS $key=>$val){
				$relation_phone_array[]=$val->relation_phone;
			}
			if(!empty($relation_phone_array)){
				$tenderPushCarrier = $this->dao->selectList('shipment.selectTenderCarrier',['relation_phone'=>$relation_phone_array,'not_in_openid'=>$not_in_openid ]);
				foreach($tenderPushCarrier AS $key=>$val){
					$val->to_type = 1;
				}
			}
		}

		//基地直属车辆
		if($fixer['tender_push']['warehouse'] ==1){
			$warehouseTruck = $this->dao->selectPage('warehouse.immediateTruck',['warehouse_id'=>$warehouse->id ]);
			foreach($warehouseTruck->result AS $key=>$val){
				$truck_source_id_array[]=$val->truck_source_id;
			}
		}
		//线路车辆
		if($fixer['tender_push']['route'] ==1){
			$routeTruck = $this->dao->selectList('shipment.selectRouteTruck', ['from_province'=>$fixer['from_province'] ,'from_city'=>$fixer['from_city'],'to_province'=>$fixer['to_province'],'to_city'=>$fixer['to_city'] ]);
			foreach($routeTruck AS $key=>$val){
				$truck_source_id_array[]=$val->truck_source_id;
			}
		}
		//历史承运车辆
		if($fixer['tender_push']['history'] ==1){
			$historyTruck = $this->dao->selectList('shipment.selectHistoryTruck', ['from_province'=>$fixer['from_province'] ,'from_city'=>$fixer['from_city'],'to_province'=>$fixer['to_province'],'to_city'=>$fixer['to_city'] ]);
			foreach($historyTruck AS $key=>$val){
				$truck_source_id_array[]=$val->truck_source_id;
			}
		}
		//基地车队车辆
		if(!empty($fixer['tender_push']['motorcade'])){
			$warehouseMotorcadeTruck = $this->dao->selectList('warehouse.immediateTruck',['warehouse_id'=>$warehouse->id,'warehouse_motorcade_id'=>$fixer['tender_push']['motorcade'] ]);
			foreach($warehouseMotorcadeTruck AS $key=>$val){
				$truck_source_id_array[]=$val->truck_source_id;
			}
		}
		//查询所有符合条件的车辆
		if(!empty($truck_source_id_array)){
			$truck_source_id_array = array_unique($truck_source_id_array);
			$tenderPushTruck = $this->dao->selectList('shipment.selectTenderTruck',['truck_source_id'=>$truck_source_id_array ,'carriage_type'=>$fixer['carriage_type'],'car_length'=>$fixer['car_length'],'car_length1'=>$fixer['car_length1'] ]);
			foreach($tenderPushTruck AS $key=>$val){
				$val->to_type = 2;
			}
		}


		//推送消息入库
		$tenderPush =array_merge($tenderPushCarrier,$tenderPushTruck);
		if(!empty($tenderPush)){
			foreach($tenderPush AS $key=>$val){
					$this->dao->insert('shipment.saveTenderPush', [
						'tender_id' => $tenderResult['id'],
						'from_user' => $warehouse->name,
						'to_type' => $val->to_type,
						'relation_id' => $val->user_id,
						'phone' => $val->user_phone,
						'to_name' => $val->to_name,
						'openid' => $val->openid,
						'status' => '1',
						'type' => '1',
						'create_time' => date("Y-m-d H:i:s")
					]);
			}
		}
		return  array('status'=>'0','message'=>$fixer['tender_act']=='edit'?'改标成功':'发标成功');
	}



	/**
	 * Desc: 获取招标的报价列表
	 * @Author sunjie
	 */
	function tenderQuoteList($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		$AuditId=$this->dao->selectOne('shipment.selectAuditId',array('orgcode'=>$this->app->user->organ->orgcode));
		if($AuditId->tender_type == '1'){
			$result = $this->dao->selectList('shipment.tenderQuoteListFirst',array('id'=>$params['shipmentId']));
		}else{
			$result = $this->dao->selectList('shipment.tenderQuoteList',array('id'=>$params['shipmentId']));
		}
		if(isset($result[0]->history)){
			$result[0]->history = str_replace('\n','<br>',$result[0]->history);
			$result[0]->history = json_decode($result[0]->history);
		}
		return $result;
	}


	/**
	 * Desc: 改变投标状态
	 * @Author sunjie
	 */
	function changeTenderQuote($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();

		$tenderQuote =$this->dao->selectOne('shipment.selectTenderQuote',array('id'=>$params['quote_id']));
		$history =  $this->dao->selectOne('tender.searchById_tender',['field'=>'history','id'=>$params['tender_id']]);
		$history = json_decode($history->history,true);

		if($tenderQuote->status == '1'){
			$status = array('2','3','4');
			//判断所有的出价合法条件
			$result=$this->dao->selectOne('shipment.selectTenderQuote',array('tender_id'=>$params['tender_id'],'status'=>$status));
			if(!empty($result)){
				return array('code'=>'1','message'=>'请先取消中标的报价！');
			}
		}

		//中标
		if($tenderQuote->status == '2'){
			return array('code'=>'1','message'=>'审批人正在审核！');
		}

		//取消中标
		if($tenderQuote->status== '3'){
			$changeStatus = '1';
			$history[] = ['time'=>date('Y-m-d H:i:s',time()),"retify_name"=>$this->app->user->realname,'action'=>'取消'.$params['quote_type_name'].'中标'];
			$this->dao->update('shipment.updateTender',['id'=>$params['tender_id'],'status'=>$changeStatus,'quote_id'=>$params['quote_id'],'over_price'=>$params['operating_type'],'update_time'=> date('Y-m-d H:i:s',time()),'history'=>json_encode($history)]);
			$this->dao->update('shipment.updateShipment',['id'=>$params['shipment_id'],'status'=>'2']);

			//删除逾期提醒
			$redis = redisCache("sendwechatoverdue");
			$redis = json_decode($redis,true);
			unset($redis[$params['shipment_code']]);
			redisCache("sendwechatoverdue",$redis);

			if($params['operating_type'] == '1'){
				$result = array('code'=>'0','message'=>array('quote_id'=>$params['quote_id'],'operating'=>'预中标上报','status'=>'','history'=>end($history)));
			}
			else{
				$result = array('code'=>'0','message'=>array('quote_id'=>$params['quote_id'],'operating'=>'中标','status'=>'','history'=>end($history)));
			}
		}
		//预中标
		if($params['operating_type'] == '1' && $tenderQuote->status == '1'){
			$changeStatus = '2';
			$history_action = '设置'.$params['quote_type_name'].'预中标'."\n".$params['aband_remark'];
			$history[] = ['time'=>date('Y-m-d H:i:s',time()),"retify_name"=>$this->app->user->realname,'action'=>$history_action];
			$this->dao->update('shipment.updateTender',['id'=>$params['tender_id'],'status'=>$changeStatus,'quote_id'=>$params['quote_id'],'over_price'=>$params['operating_type'],'update_time'=> date('Y-m-d H:i:s',time()),'history'=>json_encode($history)]);
			$AuditId=$this->dao->selectOne('shipment.selectAuditId',array('orgcode'=>$this->app->user->organ->orgcode));
			if($params['auditType'] == '1'){
				$warehouse_user_id = $AuditId->first_audit_id;
			}else{
				$warehouse_user_id = $AuditId->second_audit_id;
			}
			if(empty($warehouse_user_id)){
				$result = array('code'=>'1','message'=>'暂无审批人，请联系总部添加');
				return $result;
			}
			$auditPush = $this->dao->selectOne('shipment.getAuditUser',array('id'=>$warehouse_user_id));
			if(empty($auditPush)){
				$result = array('code'=>'1','message'=>'无法获得审批人微信信息，请提醒审批人登录微信公众号');
				return $result;
			}
			//写入审批表
			$tenderAuditResult=$this->dao->insert('shipment.insertTenderAudit',array('tender_id'=>$params['tender_id'],'quote_id'=>$params['quote_id'],'quote_price'=>$params['quote_price'],'warehouse_user_id'=>$warehouse_user_id,'create_time'=> date('Y-m-d H:i:s',time())));
			//给审核人推送消息
//			$auditPush=$this->dao->selectOne('warehouse.getWarehouseUser',array('id'=>$warehouse_user_id));
			$fix = array(
				'openid'=>$auditPush->openid,
				'url'=>$_SERVER['HTTP_HOST'].'/wechat/retify.html?tender_id='.$params[tender_id].'&quote_id='.$params[quote_id].'&openid='.$auditPush->openid.'&tender_audit_id='.$tenderAuditResult[id].'&realname='.$this->app->user->realname,
				'keyword1'=>array('value'=>$this->app->user->realname,'color'=>'#000000'),
				'keyword2'=>array('value'=>date('Y-m-d H:i:s',time()),'color'=>'#000000'),
				'keyword3'=>array('value'=>$params['from_city'].'-'.$params['to_city'],'color'=>'#000000'),
				'remark'=>array('value'=>$params['aband_remark'],'color'=>'#000000'),
			);
			$this->loadService('wechat')->sendTempMessage('tenderAudit',$fix,'consign');
			$result = array('code'=>'0','message'=>array('quote_id'=>$params['quote_id'],'operating'=>'上报中','status'=>'上报中','history'=>end($history)));
		}
		//中标
		if($params['operating_type'] == '0' && $tenderQuote->status == '1'){
			$changeStatus = '3';
			$history[] = ['time'=>date('Y-m-d H:i:s',time()),"retify_name"=>$this->app->user->realname,'action'=>'设置'.$params['quote_type_name'].'中标'];
			$this->dao->update('shipment.updateTender',['id'=>$params['tender_id'],'status'=>$changeStatus,'quote_id'=>$params['quote_id'],'over_price'=>$params['operating_type'],'update_time'=> date('Y-m-d H:i:s',time()),'history'=>json_encode($history)]);
			$this->dao->update('shipment.updateShipment',['id'=>$params['shipment_id'],'status'=>$changeStatus]);
			$this->dao->update('tender.update_tender_quote',['id'=>$params['quote_id'],'status'=>$changeStatus]);
			//发送模板消息
			$this->loadService('tender')->SendTenderAgree(array('tender_id'=>$params['tender_id'],'tender_name'=>$params['from_city'].'-'.$params['to_city']));
			//逾期提醒缓存写入
			$this->loadService('tender')->addRedisByPackage(["shipment_code"=>$params['shipment_code'],"tender_id"=>$params['tender_id']]);
			$result = array('code'=>'0','message'=>array('quote_id'=>$params['quote_id'],'operating'=>'取消中标','status'=>'中标','history'=>end($history)));
		}

		//修改出价状态
		$this->dao->update('shipment.updateTenderQuote',['id'=>$params['quote_id'],'status'=>$changeStatus]);

		return $result;

	}

	/**
	 * Desc: 通过orgcode查看是否为承运商
	 * @Author Ivan
	 */
	function checkeCarrier($res){
		$fixer = fixer::input($res);
		$params = $fixer->getArray();
		$result=$this->dao->selectOne('shipment.checkeCarrier',$params);
		if($result){
			return array('code'=>1);
		}else{
			return array('code'=>2);
		}
	}
	/**
	 * Desc: 调度出发进厂事件
	 * @Author Ivan
	 */
	function enterFactory($res){
		$fixer = fixer::input($res);
		$params = $fixer->get();
		//查看该运单是否已经存在进出场事件
		$res=$this->dao->selectOne('shipment.getReport',$params);
		$shipment_msg=$this->dao->selectOne('shipment.getShipmentMsg',$params);
		$openid=$this->dao->selectOne('shipment.getOpenidByPhone',array('phone'=>$shipment_msg->driver_phone));
		if($openid){
			$openid=$openid->opeind;
		}else{
			$openid='';
		}
		if(!$shipment_msg->driver_phone) throw new RuntimeException('缺少司机手机号', 2);
		if(!$shipment_msg->driver_name) throw new RuntimeException('缺少司机姓名', 2);
		if(!$shipment_msg->carrier_id) throw new RuntimeException('缺少承运商', 2);
		if($res){
			return array('code'=>1,'msg'=>'已存在进厂事件');

		}else{
			//更新运单状态
			$this->dao->update('shipment.updateStatus',array('id'=>$params->shipmentid,'status'=>6,'arrivewh_time'=>$params->enterTime));
			//发送运单状态给TMS
			$data = array('code'=>$shipment_msg->shipment_code,'type'=>"1",'time'=>date('Y-m-d H:i:s'));
			//TODO:web service 暂时不通
			$this->loadService('client')->webServiceRequest('sendShipmentStatus',$data);
			/*清除 redis 缓存*/
				$redis = redisCache("sendwechatoverdue");
				$redis = json_decode($redis,true);
				unset($redis[$shipment_msg->shipment_code]);
				redisCache("sendwechatoverdue",$redis);
			//上报
			$params->shipment_id=$params->shipmentid;
			$params->time=$params->enterTime;
			$params->report_type=10;
			$params->address='';
			$params->report_desc='进场';
			$params->lng='';
			$params->lat='';
			$params->images='';
			$params->openid=$openid;
			$params->carnum=$shipment_msg->carnum;
			$this->dao->insert('shipment.saveEventReport',$params);
			return array('code'=>2,'msg'=>'进厂事件上报成功');
		}
	}
	/**
	 * Desc: 调度出发出厂事件
	 * @Author Ivan
	 */
	function outFactory($res){
		$fixer = fixer::input($res);
		$params = $fixer->get();
		$res=$this->dao->selectOne('shipment.getReport',$params);
		$re=$this->dao->selectOne('shipment.getReportOut',$params);
		$shipment_msg=$this->dao->selectOne('shipment.getShipmentMsg',$params);
		if($shipment_msg->ship_type==1){
			$quoteMsg=$this->dao->selectOne('shipment.getQuoteId',$params);
			if(!empty($quoteMsg) && $quoteMsg->price_type==2){
				$tallage_price=$quoteMsg->quote_price*$shipment_msg->weight;
				$this->dao->update('shipment.updateTenderQuoteById',array('id'=>$quoteMsg->id,'tallage_price'=>$tallage_price,'tender_weight'=>$shipment_msg->weight,'total_price'=>$tallage_price));
				$this->dao->update('shipment.updateShipmentPrice',array('id'=>$params->shipmentid,'price'=>$tallage_price));	
			}
			
		}
		$order_msg=$this->dao->selectList('shipment.getOrderMsg',$params);
		if(empty($order_msg)) throw new RuntimeException('该运单没有订单不能出厂', 2);
		$openid=$this->dao->selectOne('shipment.getOpenidByPhone',array('phone'=>$shipment_msg->driver_phone));
		if($openid){
			$openid=$openid->opeind;
		}else{
			$openid='';
		}
		if(!$res){
			return array('code'=>1,'msg'=>'请先进行进厂操作');

		}else{
			if($re){
				return array('code'=>3,'msg'=>'不能重复出场操作');
			}else{
				//更新运单状态
			$this->dao->update('shipment.updateStatus',array('id'=>$params->shipmentid,'status'=>7,'leavewh_time'=>$params->outTime));

			//上报
			$params->shipment_id=$params->shipmentid;
			$params->time=$params->outTime;
			$params->report_type=11;
			$params->address='';
			$params->report_desc='出场';
			$params->lng='';
			$params->lat='';
			$params->images='';
			$params->openid=$openid;
			$params->carnum=$shipment_msg->carnum;
			$this->dao->insert('shipment.saveEventReport',$params);
			//发送最终运输信息给tms
			$this->sendBindConfirm($params->shipment_id);
				//发送运单状态给TMS
			$data = array('code'=>$shipment_msg->shipment_code,'type'=>"2",'time'=>date('Y-m-d H:i:s'));
				//TODO:web service 暂时不通
			$this->loadService('client')->webServiceRequest('sendShipmentStatus',$data);
			//没有GPS定位的车辆写入缓存
			if($shipment_msg->type == '1'  && ($shipment_msg->shipment_method == '整车' || $shipment_msg->shipment_method == '整车运输')){
					$lbsCarToken = redisCache("lbs_car");
					$lbsCarToken = json_decode($lbsCarToken,true);
					if($lbsCarToken){
						$param = $lbsCarToken;
					} else{
						$param = array();
					}
					if($shipment_msg->from_province == $shipment_msg->to_province){
						$province = '1';//省内
					}else{
						$province = '2';//省外
					}

					$param_car = array();
					$param_car["truck_source_id"] = $shipment_msg->id;
					$param_car["carrier_id"] = $shipment_msg->carrier_id;
					$param_car["orgcode"] = $shipment_msg->g7s_orgcode;
					$param_car["shipment_id"] = $params->shipmentid;
					$param_car["warehouse_id"] = $shipment_msg->warehouse_id;
					$param_car["carnum"] = $shipment_msg->carnum;
					$param_car["phone"] = $shipment_msg->driver_phone;
					$param_car["times"] = 0;
					$param_car["timingTimes"] = 0;
					$param_car["plan_leave_time"] = time();
					$param_car["timingValue"] =(strtotime($shipment_msg->plan_arrive_time) - strtotime($shipment_msg->plan_leave_time))/2;
					$param_car["province"] = $province;
					$param[''.$shipment_msg->driver_phone.''] = $param_car;
					redisCache("lbs_car",$param);
				}
			return array('code'=>2,'msg'=>'出厂事件上报成功');
			}
			
		}
	}

	/**
	 * Desc:运抵
	 * @param $res
	 * @Author Lvison
	 * @return array
	 */
	public function complete($res){
		if(empty($res['shipmentId'])){
			return array('code'=>1,'message'=>'无效的运单');
		}
		$orgcode=$this->app->user->organ->orgcode;
		$openid=$this->dao->selectOne('shipment.getOpenidByOrgcode',array('orgcode'=>$orgcode));
		$ids = explode(',',$res['shipmentId']);
		$shipmentList = $this->dao->selectList('shipment.getShipmentsByIds',array('id'=>$ids));
		foreach($shipmentList as $key=>$val){
			if($val->status<7){
				throw new RuntimeException('存在未出厂运单,不能运抵操作', 2);
			}
			if($val->status>=8){
				throw new RuntimeException('已运抵，不能重复运抵', 2);
			}
		}
		//更新运单状态-推送状态到tms
		foreach ($shipmentList as $item) {
			$res['carnum']=$item->carnum;
			$res['report_type']=12;
			$res['time']=$res['arriveTime'];
			$res['address']='';
			$res['report_desc']='运抵';
			$res['lng']='';
			$res['lat']='';
			$res['images']='';
			$res['openid']=$openid?$openid->openid:'';
			$res['shipment_id']=$item->id;
			$this->dao->insert('shipment.saveEventReport',$res);
			$this->dao->update('shipment.updateStatus',array('id'=>$item->id,'update_time'=>date('Y-m-d H:i:s'),'arrival_date'=>$res['arriveTime'],'status'=>8));
			$data = array('code'=>$item->shipment_code,'time'=>date('Y-m-d H:i:s'),'type'=>"3");
			$this->loadService('client')->webServiceRequest('sendShipmentStatus',$data);
			
		}

		return array('code'=>0);

	}

	/**
	 * Desc:运单回放
	 * @param $res
	 * @Author Lvison
	 * @return array
	 */
	function checkHistory($res){
		$shipmentId = $res['shipmentId'];

		$checkCar = $this->dao->selectOne('shipment.checkGpsCar',array('id'=>$shipmentId));
		$g7sCar = $this->loadService('truck.truck')->getTrucks(array('carnum'=>$checkCar->carnum,'fromtype'=>3));
		$g7sCar = object2array($g7sCar);
		if($g7sCar['totalCount'] > 0 && $g7sCar['result']){
			$oneTruck = $g7sCar['result'][0];
			if($oneTruck['carnum'] == $checkCar->carnum){
				$checkCar->begintime = !empty($checkCar->leavewh_time) ? $checkCar->leavewh_time : $checkCar->create_time;
				$checkCar->endtime = !empty($checkCar->arrival_date) ? $checkCar->arrival_date : date('Y-m-d H:i:s');
				$checkCar->searchid = $oneTruck['truckid'];
				$checkCar->searchno = $oneTruck['gpsno'];
				return array('code'=>0,'truck'=>$checkCar);
			}
			return array('code'=>2,'message'=>'');
		}
		if(empty($checkCar->type) || $checkCar->type == 1){
			return array('code'=>2,'message'=>'');
		}

		/*$checkCarrier = $this->dao->selectOne('shipment.checkCarrier',array('truck_source_id'=>$checkCar->id));
		if(empty($checkCarrier->g7s_orgcode) || empty($checkCarrier->app_key)  || empty($checkCarrier->app_secret)){
			return array('code'=>1,'message'=>'无法获取接口调用凭证，请填写');
		}

		$param = array('carnum'=>$checkCar->carnum,
			'begintime'=>!empty($checkCar->leavewh_time) ? $checkCar->leavewh_time : $checkCar->create_time,
			'endtime'=>!empty($checkCar->arrival_date) ? $checkCar->arrival_date : date('Y-m-d H:i:s'),
			'spacing'=>30,
			'app_key'=>$checkCarrier->app_key,
			'app_secret'=>$checkCarrier->app_secret,
			'method'=>'truck.webapi.review'
		);
		$url = $this->loadService('client')->getWebApiUrl($param);
		if($url['code'] == 1){
			return array('code'=>1,'message'=>$url['message']);
		}else{

			return array('code'=>0,'url'=>$url['url']);
		}*/
	}


	/**
	 * Desc:指定司机
	 * @param $res
	 * @Author sunjie
	 */
	function cpecify_driver($res){
		$shipment_info = $this->dao->selectOne('shipment.getShipmentId',array('shipment_id'=>$res['shipmentid']));

		if($shipment_info->dispatch_count >= '100' ){
			return array('code'=>1,'message'=>'已超过订车次数');
			return false;
		}
		if($shipment_info->status >= '7' ){
			return array('code'=>1,'message'=>'此运单状态已不可指定车辆');
			return false;
		}
		if($shipment_info->status==6){
            $this->dao->update('shipment.updateShipment',array('id'=>$res['shipmentid'],'driver_name'=>$res['driver_name'],'driver_phone'=>$res['driver_phone'],'carnum'=>$res['carnum'],'dispatch_count'=>$shipment_info->dispatch_count));
            return array('code'=>'0','message'=>'指定成功');
        }
		$this->dao->update('tender.updateTruckSource',array('driver_phone'=>$res['driver_phone'],'carnum'=>$res['carnum'] ));
		$result = $this->dao->update('shipment.updateShipment',array('id'=>$res['shipmentid'],'driver_phone'=>$res['driver_phone'],'driver_name'=>$res['driver_name'],'carnum'=>$res['carnum'],'status'=>'4','dispatch_count'=>$shipment_info->dispatch_count,'dispatch_time'=>date('Y-m-d H:i:s')));
		tools::datalog('订车日志'.var_export($result,true),'cpecify_driver_');

		//逾期提醒
		$this->loadService('tender')->addRedisByPackage(array("shipment_id"=>$res['shipmentid']));
		//装货提醒
		$this->loadService('tender')->carrierAssignCarWechatMessage(array('shipment_id' =>$res['shipmentid'],'driver_phone'=>$res['driver_phone']));
		//lbs定位
		if($shipment_info->shipment_method == '整车' || $shipment_info->shipment_method == '整车运输'){
			$data = array('carrier_id'=>$shipment_info->carrier_id,'type'=>'1','truck_source_id'=>$res['truck_source_id'],'carnum'=>$res['carnum'],'phone'=>$res['driver_phone']);

			$lbs_return =  $this->loadService('history')->lbsSendLocation_NoRedis($data);

			if($lbs_return['code'] == '0'){
				//写入定位历史表
				$carrier = $this->dao->selectOne('shipment.checkeCarrier', array('orgcode' => $this->app->user->organ->orgcode));
				$is_carrier = empty($carrier)?'1':'2';
				//ivan
				if(isset($res['openid'])&& !empty($res['openid'])){
						$org=$this->dao->selectOne('shipment.getCarrierByOpenid',array('openid'=>$res['openid']));
						if($org){
							$orgcode=$org->g7s_orgcode;
						}else{
							$orgcode='';
						}
						
						$is_carrier='2';
					}else{
						$orgcode=$this->app->user->organ->orgcode;
					}
				$this->dao->insert('car_plant.save_lbs_history', array('truck_source_id' => $res['truck_source_id'],'type'=>'3','user_type'=>$is_carrier,'orgcode'=>$orgcode,'shipment_id'=>$res['shipmentid'],'address'=>$lbs_return['msg']));

				return array('code'=>'0','message'=>'定位成功，当前位置：'.$lbs_return['msg']);
			}
			else{
				//验证司机手机号是否注册LBS
				$lbs_res = $this->loadService('client')->checkLbsRegister($res['driver_phone']);
				$this->dao->update('tender.updateTruckSource',array('driver_phone'=>$res['driver_phone'],'carnum'=>$res['carnum'],'lbs_register'=>$lbs_res));
				if($lbs_res == '0'){
					return array('code'=>'0','message'=>'司机未开通LBS定位服务');
				}
				else{
					return array('code'=>'0','message'=>'定位失败，请查看是否欠费');
				}
			}
		}
		else{
			return array('code'=>'0','message'=>'指定成功');
		}


	}
	/**
	 * Desc:查找承运商下所有司机电话
	 * @param $res
	 * @Author Ivan
	 */
	public function getDriverPhones($fixer){
 		$params = fixer::input($fixer)->get();
 		$result=$this->dao->selectList('shipment.getDriverPhones',$params);
 		return $result;
 	}
 	/**
	 * Desc:获取司机信息依据电话
	 * @param $res
	 * @Author Ivan
	 */
	public function getDriverMessage($fixer){
 		$params = fixer::input($fixer)->get();
 		$result=$this->dao->selectOne('shipment.getDriverMessage',$params);
 		return $result;
 	}
 	/**
	 * Desc:依据运单id获取订单信息
	 * @param $res
	 * @Author Ivan
	 */
	public function getOrderMsg($fixer){
 		$params = fixer::input($fixer)->get();
 		$result=$this->dao->selectList('shipment.getOrderMsg',$params);
 		return $result;
 	}
 	/**
	 * Desc:更新固定运价是否阅读
	 * @param $res
	 * @Author Ivan
	 */
	public function updateIsReader($fixer){
 		$params = fixer::input($fixer)->get();
 		$result=$this->dao->update('shipment.updateIsReader',$params);
 		return $result;
 	}


	/**
	 * Desc:lbs定位
	 * @param $res
	 * @Author sunjie
	 */
	public function lbs($fixer){
		$params = fixer::input($fixer)->getarray();

		$shipment_info = $this->dao->selectOne('shipment.getShipmentId',array('shipment_id'=>$params['shipmentid']));
		$truck_source_info = $this->dao->selectOne('truck_source.truckCheckByphone', array('driver_phone' => $shipment_info->driver_phone));

		$lastLbs = $this->dao->selectOne('car_plant.lbs_history', array('truck_source_id'=>$truck_source_info->id));
		$LbsCount = $this->dao->selectOne('car_plant.lbs_history_count', array('shipment_id'=>$params['shipmentid'],'type'=>'1'));

		if(empty($shipment_info->driver_phone)){
			return array('code'=>'1','message'=>'还没有派车，无法定位。');
		}

		if($shipment_info->shipment_method != '整车运输' || $shipment_info->status != '7'){
			return array('code'=>'1','message'=>'运单不符合定位条件（只限于在途的整车运单）');
		}
		if(strtotime($lastLbs->lastLbs)+1800 >= time()){
			return array('code'=>'1','message'=>'每个运单半个小时最多定位一次!');
		}
		if($LbsCount->shipment_count >= '4'){
			return array('code'=>'1','message'=>'一个运单最多定位4次!');
		}

		//定位
		$data = array('carrier_id'=>'','type'=>'1','truck_source_id'=>$truck_source_info->id,'carnum'=>$truck_source_info->carnum,'phone'=>$shipment_info->driver_phone);
		$lbs_return = $this->loadService('history')->lbsSendLocation_NoRedis($data);

		if($lbs_return['code'] == '0'){
			//写入定位历史表
			$this->dao->insert('car_plant.save_lbs_history', array('truck_source_id' => $truck_source_info->id,'type'=>'1','user_type'=>$params['user_type'],'orgcode'=>$this->app->user->organ->orgcode,'shipment_id'=>$params['shipmentid'],'address'=>$lbs_return['msg']));
			return array('code'=>'0','message'=>'定位成功，当前位置：'.$lbs_return['msg']);
		}
		else{
			//验证司机手机号是否注册LBS
			$lbs_res = $this->loadService('client')->checkLbsRegister($truck_source_info->driver_phone);
			$this->dao->update('tender.updateTruckSource',array('driver_phone'=>$truck_source_info->driver_phone,'carnum'=>$truck_source_info->carnum,'lbs_register'=>$lbs_res));
			if($lbs_res == '0'){
				return array('code'=>'1','message'=>'司机未开通LBS定位服务');
			}
			else{
				return array('code'=>'1','message'=>'定位失败');
			}
		}



	}
	/**
	 * Desc:获取订单号
	 * @param $res
	 * @Author Ivan
	 */
	public function getOrderCodes($fixer){
 		$params = fixer::input($fixer)->get();
 		$result=$this->dao->selectList('shipment.getOrderCodes',$params);
 		return $result;
 	}
 	/**
	 * Desc:获取连续号
	 * @param $res
	 * @Author Ivan
	 */
	public function getSerialNum($fixer){
 		$params = fixer::input($fixer)->get();
 		$result=$this->dao->selectList('shipment.getSerialNum',$params);
 		return $result;
 	}
 	/**
	 * Desc:获取相关单据号
	 * @param $res
	 * @Author Ivan
	 */
	public function getRelateBill($fixer){
 		$params = fixer::input($fixer)->get();
 		$result=$this->dao->selectList('shipment.getRelateBill',$params);
 		return $result;
 	}
 	/**
	 * Desc:调度单导出
	 * @param $res
	 * @Author Ivan
	 */
	public function getShipmentsForW($fixer){
 		$params = fixer::input($fixer)->get();
        if($params->check_shipStatus){
            if($params->check_shipStatus == 'arrival'){
                unset($params->check_shipStatus);
                $params->arrival = true;
            }elseif($params->check_shipStatus == 'valid'){
                unset($params->check_shipStatus);
                $params->invalid = true;
            }
        }
 		if($params->order_code!=''){
			$shipment_id=$this->dao->selectOne('shipment.getShipmentIdByOrderCode',array('order_code'=>$params->order_code));
			$params->shipId=$shipment_id->shipment_id;
		}
		if($params->relate_bill!=''){
			$shipment_id=$this->dao->selectOne('shipment.getShipmentIdByRe',array('relateBill'=>$params->relate_bill));
			$params->shipId=$shipment_id->shipment_id;
		}
		//处理创建时间参数
		$date = explode(' - ', $params->statistic_date);
		$params->start = $date[0];
		$params->end = $date[1];

 		$params->role_condition = $this->getRoleCondition($params->orgcode);
		$params->sortColumns='s.create_time DESC';
 		$result=$this->dao->selectPage('shipment.getShipments',$params);
 		if ($result->totalCount > 0) {
			//处理数据
			foreach ($result->result as $key => $value) {
				if ($value->business_type == 1) {
					$result->result[$key]->business_type = '省内';
				} else {
					$result->result[$key]->business_type = '省外';
				}

				if($value->price != null){
				    $result->result[$key]->unit_price = $value->weight == 0.00 ? '' : number_format($value->price/$value->weight,2);
				}else{
					$result->result[$key]->unit_price = '';
				}
				if($value->status == '1'||$value->status == '2'||$value->status == '3'){
                           $value->tender_status_view = '未生效';
                       }
                       if($value->status == '4'||$value->status == '5'){
                           $value->tender_status_view = '生效';
                       }
                       if($value->status == '6'){
                           $value->tender_status_view = '装车';
                       }
                       if($value->status == '7'){
                           $value->tender_status_view = '在途';
                       }
                       if($value->status == '8'||$value->status == '9'||$value->status == '10'){
                           $value->tender_status_view = '运抵';
                       }
                       $value->price_type=$value->price_type ? $value->price_type==1 ? '整车' : '每吨' : '';
			}
		}
 		return $result;
 	}
 	
 
}
