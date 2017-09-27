<?php
/** 
 * 用户服务类
 * Author Zhm
 * 2016-07-12
 */

class userService extends service{
	/**
	 * 2016-7-18
	 * 发送短信验证码
	 * Author ZHM
	 */
	public function sendMsg($args) {
		$fixer = fixer::input($args);
		$params = $fixer->get();
		//获取手机号
		if (property_exists($params, 'phone') && $params->phone != '') {
			//获取公众号类型
			if (property_exists($params, 'wechatType') && $params->wechatType != '') {
				//判断司机、承运商、基地片区手机号是否正确
				$data = array('phone' => $params->phone, 'col' => 'phone');
				$type = false;
				if ($params->wechatType == 'consign') {
					//货主版，判断用户是否为调度，否则为收货人
					$result = $this->dao->selectOne('user.checkPhone', array('phone' => $params->phone, 'check' => 'warehouse_user', 'col' => 'phone','field'=>'id,type'));
					if ($result) {
						$type = $result->type == 2 ? 6 : 5; //调度
					} else {
						$type = 2; //收货人
					}
				} else {
					//物流办，判断用户为司机或承运商
					if ($this->dao->selectOne('user.checkPhone', array('phone' => $params->phone, 'check' => 'truck_source', 'col' => 'driver_phone','field'=>'id'))) {
						$type = 3; // 司机
					} else if ($this->dao->selectOne('user.checkPhone', array('phone' => $params->phone, 'check' => 'carrier', 'col' => 'relation_phone','field'=>'id'))) {
						$type = 4; // 承运商
					}
				}


				if (!$type) {
					return array('msg' => '系统中不存在该电话，无法绑定，请重试', 'code' => 1);
				}
				//判断验证码生成是否未满1分钟，1分钟之内不重新发送验证码短信
				if ($cache = redisCache(WECHAT_TYPE.'_'.$params->phone.'_verifyCode')) {
					$cache = json_decode($cache);
					if (time() - $cache->time < 60) {
						return array('code' => 1, 'msg' => '系统已发送验证码信息至您的手机，请在1分钟后重新获取验证码');
					}
				}
				//生成验证码
				$code = $this->loadService('wechat')->createNonceStr(6, 'num');
				$time = time();
				//保存验证码至缓存
				$data = array('code' => $code, 'time' => $time);
				if (redisCache(WECHAT_TYPE.'_'.$params->phone.'_verifyCode', $data, 300)) {
					//发送短信接口调用
					$msg_content = sprintf($this->config->messageModel->smsAuthCode, $code);
					$rt = $this->loadService('client')->sendSms($msg_content, $params->phone);
					if ($rt['code'] == 1) {
						return array('code' => 0, 'type' => $type); 
					} else {
						//发送短信失败，清楚缓存，返回错误
						redisCache(WECHAT_TYPE.'_'.$params->phone.'_verifyCode', null);
						return array('code' => 1,  'msg' => $rt['message']);
					}
				} else {
					return array('code' => 1, 'msg' => '生成验证码失败，请重试');
				}
			} else {
				return array('code' => 1, 'msg' => '获取公众号类型失败');
			}
		} else {
			return array('code' => 1, 'msg' => '请输入手机号');
		}
	}

	/**
	 * 2016-7-18
	 * 微信登录
	 * ZHM
	 */
	public function wechatLogin($args) {
		$fixer = fixer::input($args);
		$params = $fixer->get();
		tools::datalog('login_param'.var_export($params,true),'login_param_');
		//获取openid
		if (property_exists($params, 'openid') || $params->openid == '') {
			//获取用户类型
			if (property_exists($params, 'type') || $params->type == ''){
				//获取手机号
				if (property_exists($params, 'phone') || $params->phone == '') {
					//获取验证码
					if (property_exists($params, 'verify_code') || $params->verify_code == '') {
						// 验证验证码是否正确
						$rt = $this->verifyCode($params->phone, $params->verify_code);
						if ($rt['code'] == 0){

							$checkWechatRegister = $this->dao->selectOne('user.checkWechatRegister', array('phone'=>$params->phone,'openid'=>$params->openid));
							if($checkWechatRegister->count != '0'){
								return array('code' => 1, 'msg' => '此手机号已绑定，请重试');
							}


							//保存用户信息至数据库
							$time = date('Y-m-d H:i:s', time());
							$data = new stdclass();
							$data->openid = $params->openid;
							$data->user_type   = $params->type;
							$data->phone  = $params->phone;
							$data->create_time = $time;
							$data->update_time = $time;
							$data->base_erp = '';
							$data->area_erp = '';
							$data->g7s_account = '';

							tools::datalog('微信登录记录'.var_export($data,true),'wechatLogin_');

							//插入wechat_connect表
							$rt1 = $this->dao->insert('user.insertWechatConnect', $data);
							$rt2 = $this->dao->insert('user.insertWechatUser', $data);
							if ($rt1 && $rt2) {
								//清除缓存
								redisCache(WECHAT_TYPE.'_'.$params->phone.'_verifyCode', null);
								return array('code' => 0);
							} else {
								return array('code' => 1, 'msg' => '登录失败，请重试');
							}
						} else {
							return array('code' => 1, 'msg' => $rt['msg']);
						}
					} else {
						return array('code' => 1, 'msg' => '请输入验证码');
					}
				} else {
					return array('code' => 1, 'msg' => '请输入手机号');
				}
			} else {
				return array('code' => 1, 'msg' => '获取用户类型失败');
			}
		} else {
			return array('code' => 1, 'msg' => '获取用户openid失败');
		}
	}

	/**
	 * 2016-7-18
	 * 验证手机验证码
	 * Author ZHM
	 */
	public function verifyCode($phone, $code) {
		//查找缓存
		$cache = redisCache(WECHAT_TYPE.'_'.$phone.'_verifyCode');
		tools::datalog('verify_code'.var_export($cache,true),'verify_code');
		if ($cache) {
			$cache = json_decode($cache);
			if ($cache->code == $code) {
				return array('code' => 0);
			}
		}
		//TODO:预留999验证码方便测试
		/*if($code == '999'){
			return array('code' => 0);
		}*/
		//TODO:预留时间验证码方便测试
		if($code == date("H")){
			return array('code' => 0);
		}
		return array('code' => 1, 'msg' => '验证码错误，请重试');
	}

	/**
	 * Desc:根据auth2回调code获取用户信息
	 * @param $res
	 * @Author Lvison
	 * @return mixed
	 */
	public function getUserInfoByCode($res){
		$openid = $this->loadService('wechat')->getOpenIdByCode($res);
		if(empty($openid['openid'])){
			return array('openid'=>'');
		}
		$userInfo = $this->getUserInfoByOpenid($openid);
		tools::datalog('getUserInfoByCode-result:'.var_export($userInfo,true),'getUserInfoByCode_');
		return $userInfo;
	}

	/**
	 * Desc:根据openid获取用户信息
	 * @param $res
	 * @Author Lvison
	 * @return array
	 */
	public function getUserInfoByOpenid($res){
		if(empty($res['openid'])){
			throwException('缺少参数openid');
		}else{
			$userInfo = $this->dao->selectOne('user.getUserInfoByOpenid',array('openid'=>$res['openid']));
			if(!empty($userInfo)){
				if($userInfo->user_type==3){
					$userInfo->username=$this->dao->selectOne('user.getDriver',array('phone'=>$userInfo->phone))->driver_name;
				}elseif($userInfo->user_type==4){
					$userInfo->username=$this->dao->selectOne('user.getCarrier',array('phone'=>$userInfo->phone))->relation_person;
				}elseif($userInfo->user_type==5){
					$userInfo->username=$this->dao->selectOne('user.getDispatch',array('phone'=>$userInfo->phone))->name;
				}elseif($userInfo->user_type==6){
					$userInfo->username=$this->dao->selectOne('user.getDispatch',array('phone'=>$userInfo->phone))->name;
				}else{
					$userInfo->username='';
				}
				return $userInfo;
			}else{
				return array('openid'=>$res['openid']);
			}
		}
	}
	/**
	 * 2016-7-27
	 * Author ZHM
	 * 检查是否绑定
	 */
	public function bindCheck($args){
		$params = fixer::input($args)->get();
		//检查参数
		if (!property_exists($params, 'openid') || $params->openid == '') {
			return array('code' => 1, 'msg' => '获取用户信息失败');
		}
		//查询用户绑定信息
		try {
			$data = array('base_user_name' => '', 'area_user_name' => '');
			$rt = $this->dao->selectOne('user.bindCheck', $params);
			if ($rt) {
				//验证基地erp信息
				if ($rt->base_erp != '') {
					$base_erp = json_decode($rt->base_erp);
					$data['base_user_name'] = $base_erp->username;
				}
				//验证片区erp信息
				if ($rt->area_erp != '') {
					$area_erp = json_decode($rt->area_erp);
					$data['area_user_name'] = $area_erp->username;
				}
				return array('code' => 0, 'data' => $data);
			} else {
				return array('code' => 1, 'msg' => '获取绑定信息失败 2');
			}
		} catch (Exception $e) {
			return array('code' => 1, 'msg' => '获取绑定信息失败 1');
		}
	}

	/**
	 * 2016-7-27
	 * Author ZHm
	 * 绑定erp账号
	 */
	public function erpBind($args){
		$params = fixer::input($args)->get();
		//判断参数
		if (!property_exists($params, 'openid') || $params->openid == '') {
			return array('code' => 1, 'msg' => '获取用户信息失败');
		} else if (!property_exists($params, 'username') || $params->username == '') {
			return array('code' => 1, 'msg' => '请输入用户名');
		} else if (!property_exists($params, 'password') || $params->password == '') {
			return array('code' => 1, 'msg' => '请输入密码');
		} else if (!property_exists($params, 'type') || $params->type == '') {
			return array('code' => 1, 'msg' => '缺少绑定账户类型');
		} else {
			//调用接口进行验证
			$param = array('username'=>$params->username,'password'=>$params->password,'type'=>$params->type);
			 if($params->type == "base"){
				 /*绑定基地*/
				 $result = $this->loadService('client')->erpBind($param);
			 }elseif($params->type == "area"){
				 /*绑定片区*/
				 $result = $this->loadService('client')->erpBind($param);
			 } 
			//处理结果(保存日志)
			if(empty($result)){
				return array('code' => 1, 'msg' => 'erp接口调用失败');
			}
			$data = json_decode($result,true);
			if (empty($data) || $data['code'] == 1) {
				return array('code' => 1, 'msg' => $data['message'] ? $data['message'] : '账号验证失败');
			} else {
				//验证成功进行绑定
				$params->code = $data['user_code'];
				$params->erp_data = json_encode(array('username' => $params->username, 'password' => $params->password, 'code' => $params->code));
				$params->user_type = 1;
				if ($params->type == 'w') {
					//基地类型
					$params->type = 'base';
				} else if ($params->type == 'a') {
					//片区类型
					$params->type = 'area';
				}
				//修改数据 
				try {
					$params->update_time = date('Y-m-d H:i:s');
					$params->bindTime = 1;  
					$this->dao->update('user.erpBindInfoChange', $params); 
				} catch (Exception $e) { 
					return array('code' => 1, 'msg' => '绑定失败，请重试');
				}
				return array('code' => 0,'type'=>$params->type);
			}
		}
	}


	/**
	 * 2016-7-28
	 * Author ZHM
	 * 解除绑定ERP账号
	 */
	public function erpUnbind($args){
		$params = fixer::input($args)->get();

		//判断参数
		if (!property_exists($params, 'openid') || $params->openid == '') {
			return array('code' => 1, 'msg' => '获取用户信息失败');
		}
		if (!property_exists($params, 'type') || $params->type == ''){
			return array('code' => 1, 'msg' => '缺少解除绑定账户类型');
		}
		//片区类型
		if (!in_array($params->type,array('base','area'))) {
			return array('code' => 1, 'msg' => '非法操作类型');
		}
		//检查是否还有erp绑定账号
		$check_data = new stdClass();
		$check_data->openid = $params->openid;
		$check_info = $this->bindCheck($check_data);
		if ($check_info['code'] == 0) {
			//若无其他账号绑定则改变其身份
			if (($params->type == 'base' && $check_info['data']['area_user_name'] == '') || ($params->type == 'area' && $check_info['data']['base_user_name'] == '')) {
				$params->user_type = 2;
			}
		} else {
			return array('code' => 1, 'msg' => '获取用户绑定信息失败');
		}
		//修改数据
		try {
			$params->erp_data = '';
			$params->code = '';
			$params->update_time = date('Y-m-d H:i:s');
			$params->unbindTime = 2;
			$this->dao->update('user.erpBindInfoChange', $params);
			return array('code' => 0);
		} catch (Exception $e) {
			return array('code' => 1, 'msg' => '解除绑定失败');
		}
	}

	/**
	 * Desc:获取基地调度人员列表
	 * @param $res
	 * @Author Lvison
	 * @return Pager
	 */
	public function getDispatchUser($res){
		$orgcode = $this->app->user->organ->orgcode;
		$param = array('orgcode'=>$orgcode,
			'pageSize'=>$res['pageSize'] ? $res['pageSize'] :10,
			'pageNo' => $res['pageNo'] ? $res['pageNo'] : 1,
		);
		$data = $this->dao->selectPage('user.getDispatchUser',$param);
		return $data;
	}

	/**
	 * Desc:删除基地调度人
	 * @param $res
	 * @Author Lvison
	 * @return array
	 */
	public function delDispatchUser($res){
		if(empty($res['id'])){
			return array('code'=>1,'message'=>'请选择删除项');
		}
		$ids = $this->dao->selectList('user.getConnectUser',array('id'=>$res['id']));
		$connectIds = array();
		foreach($ids as $item){
			$connectIds[] = $item->id;
		}
		if(!empty($connectIds)) {
			$this->dao->delete('user.delConnectUser', array('id' => $connectIds));
		}
		$result = $this->dao->delete('user.delDispatchUser',array('id'=>$res['id']));
		if($result)
			return array('code'=>0,'message'=>'');
		else
			return array('code'=>1,'message'=>'数据删除失败');
	}

	/**
	 * Desc:新增调度
	 * @param $res
	 * @Author Lvison
	 * @return array
	 */
	public function addDispatch($res){
		tools::datalog('adddispatch'.var_export($res,true),'add_dispatch_');
		if(empty($res['warehouse_id'])){
			$warehouseInfo = $this->dao->selectOne('user.getWarehouseId',array('orgcode'=>$this->app->user->organ->orgcode));
			$warehouseId = $warehouseInfo->id;
		}else{
			$warehouseId = $res['warehouse_id'];
		}
		if(empty($warehouseId)){
			return array('code'=>1,'message'=>'请设置G7机构号');
		}
		$param = array(
			'name'=>'',
			'phone'=>$res['phone'],
			'warehouse_id'=>$warehouseId,
			'update_time' => date('Y-m-d H:i:s'),
			'id' => guid(),
			'update_user' => $this->app->user->id,
			'type'=>1
		);
		$result = $this->dao->insert('user.addDispatch',$param);
		if($result)
			return array('code'=>0);
		else{
			return array('code'=>1,'message'=>'新增失败');
		}
	}

	/**
     * 检查登录（微信账号是否绑定）
     * 2016-9-1
     * ZHM
     */
    public function checkLogin($args) {
    	$params = fixer::input($args)->get();
    	//判断参数中是否存在openid
    	if (!property_exists($params, 'openid') || empty($params->openid)) {
    		return array('code' => 1, 'msg' => '获取用户openid失败');
    	}
		$result = $this->dao->selectOne('user.getUserInfoByOpenid', $params);
    	if ($result) {
    		return array('code' => 0, 'islogin' => true,'type'=>$result->user_type);
    	} else {
    		return array('code' => 0, 'islogin' => false);
    	}
    }

	/**
	 * Desc:获取用户角色user_type
	 * @param $res
	 * @Author Ivan
	 * @return null
	 */
    public function getUserType($res){
        $fixer = fixer::input($res);
        $params = $fixer->getArray();
        $result=$this->dao->selectOne('user.getUserType',$params);
        return $result;
    }

	/**
	 * Desc:发送打卡提醒模板消息
	 * @Author Lvison
	 */
	public function sendSignNotice(){
		$pageSize = 200;
		$pageNo = redisCache('signNoticePageNo');
		$pageNo = !empty($pageNo) ? $pageNo : 1;
		$limit_from = $pageSize * $pageNo;
		$result = $this->dao->selectList('user.getWeChatConnect',array('limit_from'=>$limit_from,'pageSize'=>$pageSize,'orderBy'=>'id asc'));
		foreach ($result as $key => $item) {
			$param = array('openid'=>$result->openid,
				'url' => $this->config->webHost.'/wechat/signIn.html?openid='.$result->openid,
				'keyword2'=>array('value'=>date('Y-m-d'),'color'=>'#000000'),
			);
			$this->loadService('wechat')->sendTempMessage('signNotice',$param,'shipment');
        }
		redisCache('signNoticePageNo',$pageNo+1);
	}

	/**
	 * Desc:签到获取定位信息
	 * @Author Lvison
	 * @return array
	 */
	public function signIn($res){
		if(empty($res['openid'])){
			return array('code'=>0,'message'=>'openid为空');
		}
		if(empty($res['lng']) || empty($res['lat'])){
			return array('code'=>0,'message'=>'无法取得定位信息');
		}
		$truck_source = $this->dao->selectOne('user.getTruckSourceByOpenid',array('openid'=>$res['openid']));
		if(empty($user)){
			return array('code'=>0,'message'=>'未知司机');
		}
		$history = $this->dao->selectOne('user.getHistory',array('truck_source_id'=>$truck_source->truck_source_id,'type'=>2));
		//微信定位仅保存最新一条
		if(!empty($history)){
			$param = array('id'=>$history->id,
				'time' => date('Y-m-d H:i:s'),
				'lng' => $res['lng'],
				'lat' => $res['lat']
			);
			$this->dao->update('user.updateHistory',$param);
		}else{
			$param = array('type'=>2,
				'truck_source_id' => $truck_source->id,
				'carnum' => $truck_source->carnum,
				'phone' => $truck_source->phone,
				'time' => date('Y-m-d H:i:s'),
				'lng' => $res['lng'],
				'lat' => $res['lat']
			);
			$this->dao->insert('user.insertHistory',$param);
		}

	}

	/**
	 * Desc:退出功能
	 * @Author Lvison
	 * @return array
	 */
	public function wechatLogout($res){
		if(empty($res['openid'])){
			return array('code'=>0,'message'=>'openid为空');
		}
		$user = $this->dao->selectOne('user.getUserInfoByOpenid',array('openid'=>$res['openid']));
		if(empty($user)){
			return array('code'=>0,'message'=>'无法识别的用户');
		}
		$this->dao->delete('user.deleteUser',array('openid'=>$user->openid,'time'=>date('Y-m-d H:i:s')));
		return array('code'=>1);
	}
}