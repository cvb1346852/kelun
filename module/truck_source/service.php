<?php
/**
 * @author zsq
 * The service file of truck_source module.
 */
class truck_sourceService extends service
{  
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 获取承运商id 划取车辆归属
     *
     */
    public function _getCarrier ()
    {
        return $this->dao->selectOne('truck_source.selectCarrier',['g7s_orgcode'=>$this->app->user->organ->orgcode]);
    }

    /**
     * 基地查看关联的承运商车源
     *
     */
    public function _getCarriers ()
    {
        return $this->dao->selectList('truck_source.selectCarriers',['orgcode'=>$this->app->user->organ->orgcode]);
    }

    /**
     * 获取基地ID
     *
     */
    public function _getWarehouse ()
    {

        $warehouse = $this->dao->selectOne('warehouse.getByOrgcode', array('orgcode' => $this->app->user->organ->orgcode));
        return $warehouse->id;
    }


    /**
     * The search page of truck_source module.
     * @w 标识，确定查看的角色
     */
    public function search ($fixer)
    { 
        $params = fixer::input($fixer)->get();
         //var_dump($params);
        if(isset($params->openid)){ 
            $return = ['code'=>1,'未查询到用户信息'];
             if(!$params->openid) return $return;
            $wechat = $this->dao->selectOne('truck_source.getByOpenId',$params);
            if(isset($wechat->user_type) && in_array($wechat->user_type,[4,5]) && isset($wechat->g7s_orgcode) && $wechat->g7s_orgcode){ 
               Ucenter::init()->setMockUser($wechat->g7s_orgcode,'orgcode');    
                $this->app->user = Ucenter::init()->getUserInfo();
            }else{
                return $return;
            }
        } 
        $w = false;
        if(!$params->from) unset($params->from);
        $carrier  =  $this -> _getCarrier();  
        if(isset($carrier->id) && $carrier->id){
            $params->carrier_id = $carrier->id ;//自己的车
        }else{
            $carriers  =  $this -> _getCarriers();///基地查看
            if(!$carriers) throwException('无法取得承运商信息');
            foreach($carriers as $v){
                $params->carrier_idIN[] = $v->id;
            }
            $w = true;
        }
        $params->status = isset($params->status) && $params->status == 1 ? 1 : 3;
        //导出模板时只导出一条数据
        if (property_exists($params, 'getTemplate') && $params->getTemplate == 1) {
            $params->pageNo = 1;
            $params->pageSize = 1;
        }  
        if (!property_exists($params, 'sortColumns') || $params->sortColumns) {
            $params->sortColumns = 'update_time DESC';
        }
        $data =  $this->dao->selectPage('truck_source.selectPage',$params);
        if($data->result){
            $Car = [];
            foreach($data->result as $v){
                $Car[] = $v->carnum;
            }
            $AllCity =  $this->dao->selectList('truck_source.selectCity',['time'=>date('Y-m-d H:i:s',strtotime('-7 days')),'carnum'=>array_unique($Car),'order'=>1]);
            $AllCarriageType =  $this->dao->selectList('truck_source.getCarriageType',['tt'=>1]);
            $Car = $CarriageType =[];//转意
            foreach($AllCity as $v){
                $Car[$v->carnum] = $v->city;
            }
            foreach($AllCarriageType as $v){
                $CarriageType[$v->id] = $v->name;
            }
            foreach($data->result as $v){
                $v->city = isset($Car[$v->carnum]) ? $Car[$v->carnum] : '';
                $v->carriage_type = isset($CarriageType[$v->carriage_type]) ? $CarriageType[$v->carriage_type] : '其它';
                $v->w = $w;//标识确定是否是基地在查看
            }
            //导出模板
            if (property_exists($params, 'getTemplate') && $params->getTemplate == 1) {
                $data->totalCount = 1;
            } 
        }
        //获取位置信息
             foreach ($data->result as $key=>$value){
                  if($value->type == 1){
                      //手机，直接查表
                     $getCity = $this->dao->selectOne('truck_source.getById_city',array("carnum"=>$value->carnum));
                     if(!empty($getCity)){
                       $value->city =$getCity->city ;
                     }
                  }elseif($value->type == 2){  //  g7s_orgcode
                     $res=array('orgcode'=>'2000VO','carnum'=>$value->carnum);
                     $result=$this->loadService('client')->g7sRequest('truck.truck.getTruckSNowAddress',$res,$value->app_key,$value->app_secret);
                  if(!empty($result['data']['result'][0]['lng']) && !empty($result['data']['result'][0]['lat'])){
                      $lng=$result['data']['result'][0]['lng'];
                      $lat=$result['data']['result'][0]['lat'];
                      $fix=array('lng'=>$lng,'lat'=>$lat);
                      $address=$this->loadService('api')->getAddressByLngLat($fix);
                      if($address['address']){
                          $value->city = $address['address'];
                      }
                    }
                  }
             }
        return $data;
    }

    /**
     * The search page of truck_source module.
     * @w 标识，承运商查看的角色
     */
    public function search_wechat ($fixer)
    {
        $params = fixer::input($fixer)->get();
        if(isset($params->openid)){
            $return = ['code'=>1,'未查询到用户信息'];
            if(!$params->openid) return $return;
            $wechat = $this->dao->selectList('truck_source.getByOpenId_wechat',array("openid"=>$params->openid));
            $params->carrier_id =$wechat[0]->id;
        }
        //根据承运商id查车
        $data =  $this->dao->selectPage('truck_source.selectPage_wechat',$params);
        //获取位置信息
        foreach ($data->result as $key=>&$value){
            $value->city = "未知定位" ;
            //$carType = $this->dao->selectOne('truck_source.getBycarriageType',array("carriage_type"=>$value->carriage_type));
            //$value->carriage_type =$carType->name;
            /*if($value->type == 1){
                //手机，直接查表
                $getCity = $this->dao->selectOne('truck_source.getById_city',array("carnum"=>$value->carnum));
                if(!empty($getCity)){
                    $value->city =$getCity->city ;
                }
            }elseif($value->type == 2){  //  g7s_orgcode
                $res=array('orgcode'=>'2000VO','carnum'=>$value->carnum);
                $result=$this->loadService('client')->g7sRequest('truck.truck.getTruckSNowAddress',$res,$value->app_key,$value->app_secret);
                if(!empty($result['data']['result'][0]['lng']) && !empty($result['data']['result'][0]['lat'])){
                    $lng=$result['data']['result'][0]['lng'];
                    $lat=$result['data']['result'][0]['lat'];
                    $fix=array('lng'=>$lng,'lat'=>$lat,'orgcode'=>'2000VO');
                    $address=$this->loadService('client')->g7sRequest('map.api.geoCode',$fix);
                    if(!empty($address)){
                        $value->city = $address['data']['result']['city'];
                    }
                }
            }*/
        }

        return $data;
    }
     /*
      * get carrier info
      */
    public function getCarrierinfo($fixer){
        $params = fixer::input($fixer)->get();
        $truck_id =  $this->loadService('tender')->getIdByopenid_driver_carrier(array('phone'=>$params->phone,'user_type'=>3));
        $carrier_info =  $this->dao->selectOne('truck_source.getCarrierinfo',array("carrier_id"=>$params->carrier_id));

        if($truck_id->id){
            $carrier_info->truck_id = $truck_id->id;
        }
        return $carrier_info;
    }
     /*
      * delete carrier_truck   relation
      */
    public function quitCarrier($fixer){
        $params = fixer::input($fixer)->get();
        $carrier  = $this->dao->selectOne('truck_source.getCarrierinfo',array("carrier_id"=>$params->carrier_id));
        $res = $this->dao->delete('truck_source.quitCarrier',array("carrier_id"=>$params->carrier_id,"truck_id"=>$params->truck_id));
        if($res){
            $history =  $this->dao->selectOne('truck_source.selectById',['field'=>'history','id'=>$params->truck_id]);
            if(isset($history->history)) {
                $history = json_decode($history->history, true);
            }else{
                $history = [];
            }
                $history[] = ['time'=>date('Y-m-d H:i:s',time()),'action'=>'退出'.$carrier->carrier_name];
                $history = $this->dao->update('truck_source.update',['history'=>json_encode($history),'id'=>$params->truck_id]);
           return true;
        }else{
           return false;
        }
    }
    /*查询司机历史加入承运商记录*/
     public function search_carrier_driver($fixer){
        $params = fixer::input($fixer)->get();
     if(isset($params->openid)){
        $return = ['code'=>1,'未查询到用户信息'];
        if(!$params->openid) return $return;
        $driverInfo = $this->dao->selectOne('truck_source.driverInfo',array("openid"=>$params->openid,"field"=>"phone,user_type"));
        $truckinfo = $this->dao->selectOne('truck_source.getTruckidByPhone',array("phone"=>$driverInfo->phone));
        $params->truck_id = $truckinfo->id;
        if($driverInfo->user_type == 3){
         $res = $this->dao->selectPage('truck_source.search_carrier_driver',$params);
        }
     }
         $res->truck_id =  $params->truck_id ;
         
        return $res;
     }
     /*getprovincelist 获得省份信息*/
      public function getprovincelist($fixer){ 
        $params = fixer::input($fixer)->get();
        $res = $this->dao->selectList('truck_source.getprovincelist');   
        /*通过每个省份，查询他所属的承运商*/   
          foreach($res as $key=>$val){ 
            $carierlist = $this->dao->selectList('truck_source.getcarierlist',$val); 
            $res[$key]->carrierlist = $carierlist; 
            $res[$key] = $val;
          }
        return $res; 
      } 
       /* 获得历史承运车辆*/
      public function getHistorytruck($fixer){ 
        $params = fixer::input($fixer)->get();
          if(empty($params->ddlProvince) && empty($params->toloProvince)){
              return array(
                  'result'=>[],
                  'totalCount'=>"0");
          };
          /*$params->fromlocation = $params->ddlProvince.''.$params->ddlCity;
          $params->tolocation = $params->toloProvince.''.$params->toloCity;*/
          $res = $this->dao->selectPage('truck_source.getHistorytruck',$params);
          if($res->result){
              foreach($res->result as $key=>$value){
                  $value->carriage_type = $this->dao->selectOne('truck_source.getBycarriageType',array("carriage_type"=>$value->carriage_type))->name;
              }
          }
          return $res;
      }
       
    /*加入数据库 司机加入车队的信息*/
    public function confirmcarrier($fixer){
        $fixer = fixer::input($fixer)->getArray();
        if($fixer["openid"] != ""){
            $province_name = $fixer["searchParams"][0]["value"];
            $carrier_name = $fixer["searchParams"][1]["value"];
            $id = guid();
            $fixer['id'] = $id;
            $fixer['carrier_name'] = $carrier_name; //子查询
            $fixer['province'] = $province_name;
            $fixer['openid'] = $fixer["openid"];  //车源id 传入司机openid 子查询
            $fixer['from'] = 2;
            $fixer['status'] = 1;
            $fixer['province'] = $province_name;
            $fixer['create_time'] = date("Y-m-d H:i:s");
            /*判断是否已经添加了 不能重复添加*/
            $truck_source_info = $this->dao->selectOne('truck_source.getTruckidByopenid',$fixer);
            $fixer['truck_source_id'] = $truck_source_info->id;
            $getCarrier_id = $this->dao->selectOne('truck_source.getCarrierId',array("province"=>$fixer['province'],"carriername"=>$fixer['carrier_name']));
            $carrier_info = $this->dao->selectList('truck_source.getByCity_s',array("province"=>$fixer['province'],"carriername"=>$fixer['carrier_name']));
            /*判断该省份下 有没有 加过承运商*/
            $sameHistory =$this->dao->selectOne('truck_source.searchTruckcarrier',array("truck_source_id"=>$truck_source_info->id,"carrier_id"=>$getCarrier_id->id));
            if(!$sameHistory){
                $fixer['carrier_id'] = $getCarrier_id->id;
                //加入关系表
                $res = $this->dao->insert('truck_source.confirmcarrier',$fixer);
                if($fixer["openid"]){
                    //给承运商推送添加挂靠提醒，没有openid就不推送
                    if(!empty($carrier_info)){
                        $this->sendAddcarrier(array('driver_name'=>$truck_source_info->driver_name,'create_time'=>$fixer['create_time'],'carrierInfo'=>$carrier_info));
                    }
                    return array("code"=>1,"message"=>"申请成功,等待审核");
                }else{
                    return array("code"=>2,"message"=>"申请失败");
                 }
            }else{
                if(intval($sameHistory->deleted) == 1){
                    $this->dao->update('truck_source.pushCarrier', [
                        'carrier_id' => $getCarrier_id->id,
                        'truck_source_id' => $truck_source_info->id,
                        'deleted' => 0,
                        'status' => 1
                    ]);
                    return array("code"=>1,"message"=>"申请成功,等待审核");
                }
                return array("code"=>2,"message"=>"申请失败,不能重复添加");
            }

        }else{
            throw new RuntimeException('openid不能为空');
        }
    }
    /**
     * send 司机挂靠承运商，收到信息
     */
    public function sendAddcarrier ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if($fixer->carrierInfo){
            foreach($fixer->carrierInfo as $key=>$value){
                $fix = array(
                    'openid'=>$value->openid,
                    'url'=>$_SERVER['HTTP_HOST'].'/wechat/addNew.html?openid='.$value->openid,
                    'keyword1'=>array('value'=>$fixer->driver_name,'color'=>'#000000'),//申请人
                    'keyword2'=>array('value'=>$fixer->create_time,'color'=>'#000000'),//申请时间
                    'remark'=>array('value'=>'审核用户(点击进入审核页面)','color'=>'#000000'),
                );
                $this->loadService('wechat')->sendTempMessage('addcarrier_notice',$fix,'shipment');
            }
        }

    }

    /**
     * The save page of truck_source module.  
     *
     */
    public function save ($fixer)
    {
        $fixer = fixer::input($fixer)->getArray();  
        //检测参数 
        if($fixer["searchParams"][1]["name"] != "wechat"){
          $base = ['carnum','car_length','carriage_type','rated_load','driver_name','driver_phone'];
          foreach($base as $v){
            if(!isset($fixer[$v]) || empty(trim($fixer[$v])))
                throw new RuntimeException('红色部分为必填', 2);
         }
        }
        $fixer['last_update'] = $this->app->user->id; 
        if(!isset($fixer['id']) || !$fixer['id']){
            /*判断手机号码系统中唯一性*/
            $byphone_carrier = $this->dao->selectOne('carrier.checkPhone', array('relation_phone' => $fixer['driver_phone']));
            $byphone_warehouse = $this->dao->selectOne('warehouse.getRoute', array('phone' => $fixer['driver_phone']));
            $byphone_warehouse_user = $this->dao->selectOne('warehouse.getWarehouseUser', array('phone' => $fixer['driver_phone']));
            $byphone_wechat_connect = $this->dao->selectOne('order.getWechatConnect', array('phone' => $fixer['driver_phone'],'is_crrierAddTruce'=>$fixer['is_crrierAddTruce']));
            if(!empty($byphone_carrier) || !empty($byphone_warehouse) || !empty($byphone_warehouse_user) || !empty($byphone_wechat_connect) ){
                return array('code'=>1,'message'=>"添加失败,该手机号已经注册过其他角色,不能重复注册");
            }

            //系统中若存在该车辆且为自有车无法继续添加
            if ($this->dao->selectOne('truck_source.isSelfTruck', array('carnum' => $fixer['carnum']))) {
                throw new RuntimeException($fixer['carnum'].'为本承运商/其他承运商下的自有车，无法添加', 2);
            }
            $id = '';
            //是否重复标识
            $exist = false;
            $repeat = isset($fixer['repeat']) ? $fixer['repeat'] : 'cover';
            if ($rt = $this->dao->selectOne('truck_source.truckCheckByphone', array('driver_phone' => $fixer['driver_phone']))) {
                $id = $rt->id;
                $exist = true;
            } else {
                $id = guid();
            }
            $fixer['id'] = $id;
            $fixer['history'] =  json_encode([]);
            if(isset($fixer['apply']) && $fixer['apply']){//申请
                if(!$fixer['carrier_id']) throw new RuntimeException('必须选择申请的承运商', 2);
                $this->dao->insert('truck_source.insert_s',[
                    'carrier_id'=>$fixer['carrier_id'],
                    'motorcade_id'=>'',
                    'motorcade_name'=>'',
                    'province'=>'',
                    'truck_source_id'=>$id,
                    'from'=>2,
                    'status'=>1,
                    'last_update'=>$this->app->user->id
                ]);
            }else{
                //获取角色所属承运商
                $carrier = $this->_getCarrier();

                if(!isset($carrier->id))  throw new RuntimeException('未查询到对应的承运商信息', 2);
                if ($this->dao->selectOne('truck_source.sourceCheck', array('driver_phone' => $fixer['driver_phone'], 'carrier_id' => $carrier->id))) {
                    if (isset($fixer['affiliated']) && $fixer['affiliated'] == 1) {
                        throw new RuntimeException("手机号".$fixer['driver_phone']."已存在,无法重复添加", 2);
                    }
                } else {
                    //判断添加车源类型 挂靠 自有
                    $from = 1;
                    if (isset($fixer['affiliated']) && $fixer['affiliated'] == 1) {
                        $from = 2;
                    }

                    $rt = $this->dao->insert('truck_source.insert_s',[
                        'carrier_id'=>$carrier->id,
                        'motorcade_id'=>'',
                        'motorcade_name'=>'',
                        'province'=>'',
                        'truck_source_id'=>$id,
                        'from'=>2,
                        'status'=>3,
                        'last_update'=>$this->app->user->id
                    ]);

                }
            }
            if($fixer['type'] == 1){
                $data = array("mobile"=>$fixer['driver_phone'],"username"=>$fixer['driver_phone'],"usertype"=>'1',"opertype"=>'1');
                $this->loadService('client')->lbsSendList($data);
            }
            //检查系统中是否存在该车辆
            if ($exist) {
                //判断重复时的操作
               /* if ($repeat == 'cover') {
                    return $this->dao->update('truck_source.update',$fixer);
                } else {
                    return true;
                }*/
                return array('code'=>0,'message'=>"添加成功");
            } else {

                $data =  $this->dao->insert('truck_source.insert',$fixer);
                return array('code'=>0,'message'=>$data);
            }
        }


        $res = $this->dao->update('truck_source.update',$fixer);
        return array('code'=>0,'message'=>$res);
    } 
    /**
     * The save page of truck_source module.  
     *
     */
    public function save_wechat ($fixer)
    {
        $fixer = fixer::input($fixer)->getArray();   
        $fixer = array_column($fixer["searchParams"], 'value', 'name');
         //查看承运商信息
        $carrierinfo = $this->dao->selectOne('truck_source.getById_s',array("openid"=>$fixer["openid"]));
        $byphone = $this->dao->selectOne('truck_source.truckCheckByphone', array('driver_phone' => $fixer['driver_phone']));
        $byphone_carrier = $this->dao->selectOne('carrier.checkPhone', array('relation_phone' => $fixer['driver_phone']));
        $byphone_warehouse = $this->dao->selectOne('warehouse.getRoute', array('phone' => $fixer['driver_phone']));
        $byphone_warehouse_user = $this->dao->selectOne('warehouse.getWarehouseUser', array('phone' => $fixer['driver_phone']));
        $byphone_wechat_connect = $this->dao->selectOne('order.getWechatConnect', array('phone' => $fixer['driver_phone'],'is_crrierAddTruce'=>1));
       if(!empty($byphone_carrier) || !empty($byphone_warehouse) || !empty($byphone_warehouse_user) || !empty($byphone_wechat_connect) ){
           return array('code'=>1,'message'=>"添加失败,该手机号已经注册过其他角色,不能重复注册");
       }
        //判断手机号是否重复
        if(!$byphone->carnum){
            $id = guid();
            $fixer["id"] = $id;
            $fixer["type"] = 1;
            $result =  $this->dao->insert('truck_source.insert',$fixer);

            if($result){
                //添加车辆与承运商之间的关系
                $truck = $this->dao->selectOne('truck_source.truckCheckByphone', array('driver_phone' => $fixer['driver_phone']));
                $this->dao->insert('truck_source.insert_s',[
                    'carrier_id'=>$carrierinfo->id,
                    'motorcade_id'=>'',
                    'motorcade_name'=>'',
                    'province'=>'',
                    'truck_source_id'=>$truck->id ,
                    'from'=>2,
                    'status'=>3
                ]);
               /* if($truck->type == 1){
                    $datas = array("mobile"=>$fixer['driver_phone'],"username"=>$fixer['driver_phone'],"usertype"=>'1',"opertype"=>'1');
                    $this->loadService('client')->lbsSendList($datas);
                }*/
                return array('code'=>0,'truck_type'=>$truck->type,'driver_phone'=>$fixer['driver_phone']);

            }else{
                return array('code'=>1,'message'=>"添加失败");
            }

        }else{
            $check = $this->dao->selectOne('truck_source.searchTruckcarrier',array('truck_source_id'=>$byphone->id,'carrier_id'=>$carrierinfo->id));
            if(empty($check)) {
                $this->dao->insert('truck_source.insert_s', [
                    'carrier_id' => $carrierinfo->id,
                    'motorcade_id' => '',
                    'motorcade_name' => '',
                    'province' => '',
                    'truck_source_id' => $byphone->id,
                    'from' => 2,
                    'status' => 3
                ]);
            }else{
                if(intval($check->deleted) == 1){
                    $this->dao->update('truck_source.pushCarrier', [
                        'carrier_id' => $carrierinfo->id,
                        'truck_source_id' => $byphone->id,
                        'deleted' => '0',
                        'update_time' => date("Y-m-d H-i-s"),
                        'status' => 3
                    ]);
                }else{
                    //未删除
                  if($check->status != 3){
                      $this->dao->update('truck_source.pushCarrier', [
                          'carrier_id' => $carrierinfo->id,
                          'truck_source_id' => $byphone->id,
                          'deleted' => '0',
                          'update_time' => date("Y-m-d H-i-s"),
                          'status' => 3
                      ]);
                  }else{
                      return array('code'=>1,'message'=>"关系已经存在,添加失败");
                  }
               }
            }
            return array('code'=>0);
        }

    }

    /*
     * send LBS
     *
     */
    public function sendLbsMsg ($fixer)
    {
        $fixer = fixer::input($fixer)->getArray();
        $datas = array("mobile"=>$fixer['driver_phone'],"username"=>$fixer['driver_phone'],"usertype"=>'1',"opertype"=>'1');
        $res = $this->loadService('client')->lbsSendList($datas);
    }

    /**
     * The save page of truck_source module.
     *
     */
    public function save_wechat_driver ($fixer)
    {
        $fixer = fixer::input($fixer)->getArray();
        $fixer = array_column($fixer["searchParams"], 'value', 'name');
        //查看车辆表
        $truck = $this->dao->selectOne('truck_source.truckCheckByphone', array('driver_phone' => $fixer['driver_phone']));
        $byphone_carrier = $this->dao->selectOne('carrier.checkPhone', array('relation_phone' => $fixer['driver_phone']));
        $byphone_warehouse = $this->dao->selectOne('warehouse.getRoute', array('phone' => $fixer['driver_phone']));
        $byphone_warehouse_user = $this->dao->selectOne('warehouse.getWarehouseUser', array('phone' => $fixer['driver_phone']));
        $byphone_wechat_connect = $this->dao->selectOne('order.getWechatConnect', array('phone' => $fixer['driver_phone']));
        if(!empty($truck)){
            return array('code'=>1,'message'=>"添加失败,该手机号已经注册过司机,不能重复注册");
        }
        if(!empty($byphone_carrier) || !empty($byphone_warehouse) || !empty($byphone_warehouse_user) || !empty($byphone_wechat_connect) ){
            return array('code'=>1,'message'=>"添加失败,该手机号已经注册过其他角色,不能重复注册");
        }
        //通过省份获取承运商id
        /*$carrierInfo = $this->dao->selectOne('truck_source.getByCity_s', $fixer);
        if (!$carrierInfo->id || !$carrierInfo->openid || $carrierInfo == null) {
            return array('code' => 1, 'message' => "承运商信息不完整");
        }*/
        //判断手机号是否重复
        if (!$truck->carnum) {
            $id = guid();
            $fixer["id"] = $id;
            $fixer["type"] = 1;
            $result = $this->dao->insert('truck_source.insert', $fixer);
            if ($result) {
                //添加车辆与承运商之间的关系
                $truck = $this->dao->selectOne('truck_source.truckCheckByphone', array('driver_phone' => $fixer['driver_phone']));
                /*$rt = $this->dao->insert('truck_source.insert_s', [
                    'carrier_id' => $carrierInfo->id,
                    'motorcade_id' => '',
                    'motorcade_name' => '',
                    'province' => '',
                    'truck_source_id' => $truck->id,
                    'from' => 2,
                    'status' => 1,
                    'create_time' => date("Y-m-d H-i-s")
                ]);*/
                /*if ($truck->type == 1) {
                    $datas = array("mobile" => $fixer['driver_phone'], "username" => $fixer['driver_phone'], "usertype" => '1', "opertype" => '1');
                    $this->loadService('client')->lbsSendList($datas);
                }
                return array('code' => 0);*/

                return array('code'=>0,'truck_type'=>$truck->type,'driver_phone'=>$fixer['driver_phone']);

            } else {
                return array('code' => 1, 'message' => "添加失败");
            }
        } else {
            return array('code' => 1, 'message' => "手机号已绑定车辆" . $truck->carnum);
        }
    }

    /**
     * The getById page of truck_source module.
     *
     */
    public function getById ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!$fixer->id) return [];
        $data =  $this->dao->selectOne('truck_source.getById',$fixer);
        if(isset($data->carriage_type) && $data->carriage_type){
            $carriage_name =  $this->dao->selectOne('truck_source.getCarriageType',['id'=>$data->carriage_type]);
            $data->carriage_type_name = isset($carriage_name->name) ? $carriage_name->name : '其它';
        }
        return $data;
    } 
      /**
     * The getById page of truck_source module.
     *
     */
    public function pushCarrier ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        $fixer->status = $fixer->type == "ok" ? 3 : 2;
        $fixer->update_time = date("Y-m-d H-i-s");
        $truckinfo = $this->dao->selectOne('truck_source.getTruckidByPhone',array("phone"=>$fixer->driver_phone));
        $carrierinfo = $this->dao->selectOne('truck_source.getById_s',array("openid"=>$fixer->openid));
        $fixer->truck_source_id = $truckinfo->id;
        $history =  $this->dao->selectOne('truck_source.selectById',['field'=>'history','id'=>$fixer->truck_source_id]);
        if(isset($fixer->openid) && $fixer->truck_source_id){
            $fixer->carrier_id = $carrierinfo->id;
            //更新到车辆关系表
            $res =  $this->dao->update('truck_source.pushCarrier',$fixer);
             if($res > 0){
                 if($fixer->status == 3){
                  /*说明添加承运商成功将数据记录到  truck_source*/
                     if(isset($history->history)){
                         $history = json_decode($history->history,true);
                     }else{
                         $history = [];
                     }
                         $history[] = ['time'=>date('Y-m-d H:i:s',time()),'action'=>'加入'.$carrierinfo->carrier_name];
                         //更新到车辆表
                         $history = $this->dao->update('truck_source.update',['history'=>json_encode($history),'id'=>$fixer->truck_source_id]);
                 }elseif($fixer->status == 2){
                     /*说明添加承运商失败将数据记录到  truck_source*/
                     if(isset($history->history)) {
                         $history = json_decode($history->history, true);
                     }else{
                             $history = [];
                     }
                         $history[] = ['time'=>date('Y-m-d H:i:s',time()),'action'=>'加入'.$carrierinfo->carrier_name.'未通过'];
                         $history = $this->dao->update('truck_source.update',['history'=>json_encode($history),'id'=>$fixer->truck_source_id]);
                 }
                   return true;
             }else{
                   return false;
             }
        } 
    }
    /**
     * The del page of truck_source module.
     *
     */
    public function del ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!$fixer->id) return [];
        $ids = explode(',',$fixer->id);
        $carrier  =  $this -> _getCarrier();

        foreach($ids as $v){
            $this->dao->update('truck_source.del',['id'=>$v,'carrier_id'=> $carrier->id]);
        }
        return true;
    }
    /**
     * The del page of truck_source module.
     *
     */
    public function getTruckMsg ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        $truckinfo = $this->dao->selectOne('truck_source.getTruckidByPhone',array("phone"=>$fixer->phone));
        return $truckinfo;
    }
    /**
     * The agree page of truck_source module.
     *
     */
    public function agree ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!in_array($fixer->type,[2,3]) || !$fixer->id) return false;
        $carrier  =  $this -> _getCarrier();
        if(!isset($carrier->id) || !isset($carrier->name))  throw new RuntimeException('未查询到对应的承运商信息', 2);
        $data = $this->dao->update('truck_source.updateAgree',['status'=>$fixer->type,'id'=>$fixer->id,'last_update'=>$this->app->user->id,'from'=>2]);
        if($data){
            $history =  $this->dao->selectOne('truck_source.selectById',['field'=>'history','id'=>$fixer->id]);
            if(isset($history->history)) {
                $history = json_decode($history->history, true);
            }else{
                $history = [];
            }
            $action = '加入'.$carrier->name;
            $action .= $fixer->type == 2 ? '未通过' : '';
            $history[] = ['time'=>date('Y-m-d H:i:s',time()),'action'=>$action];
            $this->dao->update('truck_source.update',['history'=>json_encode($history),'id'=>$fixer->id]);
        }
        return $data;
    }

    /**
     * The agree page of truck_source module.
     *
     */
    public function getCarriageType ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        return  $this->dao->selectList('truck_source.getCarriageType',$fixer);
    }
    /**
     * The agree page of truck_source module.
     *
     */
    public function updateTruckMsg ($fixer)
    {
        $fixer = fixer::input($fixer)->getArray();
        $fixer["searchParams"]  =  array_column( $fixer["searchParams"],'value','name');;
        $res = $this->dao->update('truck_source.update',array(
            "id"=>$fixer["searchParams"]["truck_source_id"],
            "carnum"=>$fixer["searchParams"]["carnum"],
            "rated_load"=>$fixer["searchParams"]["rated_load"],
            "carriage_type"=>$fixer["searchParams"]["carriage_type"],
            "car_length"=>$fixer["searchParams"]["car_length"]));
        if($res > 0){
            return true;
        }else{
            return false;
        }

    }


    /**
     * The change page of truck_source module.
     *
     */
    public function change ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!$fixer->id || !$fixer->motorcade_id || !$fixer->motorcade_name) return false;
        $carrier = $this->_getCarrier();
        if(!isset($carrier->id) || !isset($carrier->name))  throw new RuntimeException('未查询到对应的承运商信息', 2);
        $fixer->last_update = $this->app->user->id;
        $ids = explode(',',$fixer->id);
        foreach($ids as $v){
            $fixer->id = $v;
            $this->dao->update('motorcade.updateChange',$fixer);
        }
        return  true;
    }


    /**
     * The change page of truck_source_warehouse module.
     *
     */
    public function changeWarehouse ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!$fixer->id || !$fixer->motorcade_id || !$fixer->motorcade_name) return false;
        $warehouseid = $this->_getWarehouse();
        if(!isset($warehouseid)) throw new RuntimeException('未查询到对应的基地信息', 2);
        $fixer->last_update = $this->app->user->id;
        $ids = explode(',',$fixer->id);
        foreach($ids as $v){
            $fixer->id = $v;
            $this->dao->update('motorcade_warehouse.updateChange',$fixer);
        }
        return  true;
    }


    /**
     * 2016-8-15
     * ZHM
     * 获取车辆信息
     */
    public function getG7sTruck($args) {
        $params = fixer::input($args)->get();
        $data = array();
        $data['term'] = $params->carnum;
        $data['pageNo'] = empty($params->pageNo) ? 1 : $params->pageNo;
        $data['pageSize'] = empty($params->pageSize) ? 10 : $params->pageSize;
        //获取承运商appket secret
        $carrier = $this->_getCarrier();
        if(!isset($carrier->id))  throw new RuntimeException('未查询到对应的承运商信息', 2);
        //查询车辆
        $result = $this->loadService('client')->g7sRequest('truck.truck.getTrucks', $data, $carrier->app_key, $carrier->app_secret);
        if ($result['code'] != 0) {
            throw new RuntimeException('获取车辆信息失败：'.$result['message'], 2);
        } else {
            $data = $result['data'];
            if (count($data['result']) > 0) {
                foreach ($data['result'] as $key => $value) {
                    //获取车辆此时的司机信息
                    $rt = $this->loadService('client')->g7sRequest('truck.interfaces.getCurrentDriverInfo', array('gpsno' => $value['gpsno']), $carrier->app_key, $carrier->app_secret);
                    if ($rt['code'] == 0) {
                        $data['result'][$key]['driver_name'] = empty($rt['data']['result']['currentdriver']) ? '未知司机' : $rt['data']['result']['currentdriver'];
                        $data['result'][$key]['driver_phone'] = empty($rt['data']['result']['currentphone']) ? '未知号码' : $rt['data']['result']['currentphone'];
                    } else {
                        throw new RuntimeException('获取车辆信息失败：'.$rt['message'], 2);
                    }
                }
            }
            return $data;
        }
    }

    /**
     * 保存自有车辆
     * 2016-8-16
     * ZHM
     */
    public function saveG7sTruck($args) {
        $params = fixer::input($args)->get();
        $trucks = array();
        //获取厢型数据用于转义
        $allType = $this->dao->selectList('truck_source.getCarriageType',['tt'=>1]);
        $carriageType = array();
        foreach ($allType as $type) {
            $carriageType[$type->name] = $type->id;
        }
        foreach ($params->data as $key => $value) {
            //处理数据
            $data = array(
                'type'          => 2,
                'gpsno'         => $value['gpsno'],
                'carnum'        => $value['carnum'],
                'car_length'    => $value['length'],
                'carriage_type' => isset($carriageType[$value['carriagetype']]) ? $carriageType[$value['carriagetype']] : $carriageType['其它'],
                'rated_load'    => $value['weight'],
                'driver_name'   => $value['driver_name'],
                'driver_phone'  => $value['driver_phone']
            );
            try {
                $this->save($data);
            } catch (Exception $e) {
                throw new RuntimeException($e->getMessage(), 2);
            }
        }
        return true;
    }

    /**
     * 2016-8-18
     * ZHM
     * 处理导入车辆数据
     */
    public function create($args) {
        $params = fixer::input($args)->getArray();
        $table_title = $params[1];
        $affiliated = $params['affiliated'];
        $repeat = $params['repeat'];
        unset($params['affiliated']);
        unset($params['repeat']);
        $title = array();
        include_once 'validater.php';
        //处理表头
        foreach ($table_title as $key => $value) {
            switch ($value) {
                case '车牌号':
                    $title[$key] = 'carnum';
                    break;
                case '车长':
                    $title[$key] = 'car_length';
                    break;
                case '额定载重(吨)':
                    $title[$key] = 'rated_load';
                    break;
                case '厢型':
                    $title[$key] = 'carriage_type';
                    break;
                case '司机姓名':
                    $title[$key] = 'driver_name';
                    break;
                case '司机电话':
                    $title[$key] = 'driver_phone';
                    break;
                case '身份证号':
                    $title[$key] = 'id_card';
                    break;
            }
        }
        //获取厢型数据用于转义
        $allType = $this->dao->selectList('truck_source.getCarriageType',['tt'=>1]);
        $carriageType = array();
        foreach ($allType as $type) {
            $carriageType[$type->name] = $type->id;
        }
        // 验证并插入数据
        foreach ($params as $key => $content) {
            //验证数据
            if ($key > 1) {
                $row = array();
                foreach ($content as $no => $value) {
                    $row[$title[$no]] = $value;
                }
                $fixer = fixer::input($row);
                //验证参数
                $fixer->check($truckSourceValidater, 'carnum,car_length,rated_load,carriage_type,driver_name,driver_phone,id_card');
                if (fixer::isError()) {
                    $error = array();
                    foreach (fixer::getError() as $key => $value) {
                        array_push($error, $key.': '.$value);
                    }
                    $error = implode(', ', $error);
                    throw new RuntimeException($error, 555);
                } else {
                    //处理厢型数据
                    $row['carriage_type'] = isset($carriageType[$row['carriage_type']]) ? $carriageType[$row['carriage_type']] : $carriageType['其它'];
                    $row['affiliated'] = $affiliated;
                    $row['repeat'] = $repeat;
                    $this->save($row);
                }
            }
        }
        return true;
    }

    /**
     * 搜索车牌号
     * 2016-8-24
     * ZHM
     */
    public function getSearchCondition($args) {
        $params = fixer::input($args)->get();
        if (!property_exists($params, 'name') || $params->name == ''){
            throw new RuntimeException("缺少搜索条件", 2);
        }
        $carrier = $this -> _getCarrier();
        if(isset($carrier->id) && $carrier->id){
            $params->carrier_id = $carrier->id ;//自己的车
        }else{
            $carriers  =  $this -> _getCarriers();///基地查看
            if(!$carriers) return new Pager();
            foreach($carriers as $v){
                $params->carrier_idIN[] = $v->id;
            }
        }
        return $this->dao->selectList('truck_source.getSearchCondition', $params);
    }
    /**
     * 获取平台车源信息
     * 2016-8-26
     * Ivan
     */
    public function getDriverRoute($args) {
        $params = fixer::input($args)->get();
        $orgcode=$this->app->user->organ->orgcode;//调用接口参数
        $params->orgcode=$orgcode;
        if($params->ddlProvince==''&&$params->toloProvince==''&&$params->ddlCity==''&&$params->toloCity==''){
            $result=array('result'=>array(),'totalCount'=>0);
        }else{
            $result=$this->dao->selectPage('truck_source.getDriverRoute', $params);
            $carnums=array();
            foreach($result->result as $key=>$val){
                if($val->type==1){
                    $address=$this->dao->selectOne('truck_source.getLbsMsg', array('id'=>$val->ts_id));
                    $result->result[$key]->location=$address->address;
                }
                if($val->type==2){
                    //调用接口 carnum是查出来的作为接口入参； 暂时隐藏
                    $carnums[]=$val->carnum;
                    $data=array('orgcode'=>$orgcode,'carnum'=>$val->carnum);
                    $res=$this->loadService('client')->g7sRequest('truck.truck.getTruckSNowAddress',$data,'cdtest','51f9c98dfaf8b3eb9274933b611a4708');
                    if(!empty($res['data']['result'][0]['lng']) && !empty($res['data']['result'][0]['lat'])){

                        $lng=$res['data']['result'][0]['lng'];
                        $lat=$res['data']['result'][0]['lat'];
                        $fix=array('lng'=>$lng,'lat'=>$lat);
                        $address=$this->loadService('api')->getAddressByLngLat($fix);
                        $result->result[$key]->location=$address['address'];
                    }
                }
                $result->result[$key]->carriage_type=$this->dao->selectOne('truck_source.getCarType', array('id'=>$val->carriage_type))->name;

            }
        }
        return $result;
    }
    /**
     * 获取平台车源历史记录
     * 2016-8-26
     * Ivan
     */
    public function getHistory($args) {
        $params = fixer::input($args)->get();
        $result=$this->dao->selectList('truck_source.getHistory', $params);
        $result[0]->history=json_decode($result[0]->history);
        if($result[0]->history!=''||$result[0]->history!=null){
            foreach($result[0]->history as $key =>$val){
              $result[0]->history[$key]->time=date('Y m/d',strtotime($val->time));
          }
        }
        return $result[0];
    }
    /**
     * 司机打卡信息保存
     * 2016-8-26
     * will
     */
    public function driverSign($args) {
        $params = fixer::input($args)->get();
        if($params->phone){
            $truckInfo = $this->dao->selectOne('truck_source.getTruckidByPhone',array("phone"=>$params->phone));
            //添加进 truck_source
            if($truckInfo->sign_time && substr($truckInfo->sign_time,0,10) == date("Y-m-d")){
                //说明是当天的重复打卡
                $arr = array("id"=>$truckInfo->id,
                             "sign_time"=>date("Y-m-d H:i:s"));
            }else{
                $arr = array("id"=>$truckInfo->id,
                             "sign_num"=>$truckInfo->sign_num + 1,
                             "sign_time"=>date("Y-m-d H:i:s"));
            }
              $this->dao->update('truck_source.update',$arr);

            //添加进history_point表
            $AddressInfo = $this->dao->selectOne('shipment.getDriverPoint',array("phone"=>$params->phone,'type'=>3));
            if($AddressInfo->id){
                  $this->dao->update('shipment.updatePoint',
                    array("id"=> $AddressInfo->id ,
                        "address"=>$params->address,
                        "carrier_id"=>'',
                        "lng"=>$params->lng,
                        "lat"=>$params->lat));
            }else{
                  $this->dao->insert('shipment.saveReportLbs',
                         array("type"=> 3 ,
                             "address"=>$params->address,
                             "carrier_id"=>'',
                             "lng"=>$params->lng,
                             "lat"=>$params->lat,
                             "truck_source_id"=>$truckInfo->id,
                             "phone"=>$params->phone,
                             "time"=>date("Y-m-d H:i:s"),
                             "carnum"=>$truckInfo->carnum));
            }
            return array("code"=>1,message=>"签到成功");
        }else{
            return array("code"=>0,message=>"信息不完整,签到失败");
        }

    }

    /**
     * Desc:车辆信息管理
     * @param $fixer
     * @Author Lvison
     * @return Pager
     */
    public function searchAll ($fixer)
    {
        $params = fixer::input($fixer)->get();

        if (!property_exists($params, 'sortColumns') || $params->sortColumns) {
            $params->sortColumns = 'update_time DESC';
        }
        $params->pageSize = $params->pageSize ? $params->pageSize : 10;
        $params->pageNo = $params->pageNo ? $params->pageNo : 10;

        $data =  $this->dao->selectPage('truck_source.getAllTruckSource',$params);

        //获取位置信息
        foreach ($data->result as $key=>$value){
            if($value->type == 1){
                //手机，直接查表
                $getCity = $this->dao->selectOne('truck_source.getById_city',array("carnum"=>$value->carnum));
                if(!empty($getCity)){
                    $value->city =$getCity->city ;
                }
            }elseif($value->type == 2){  //  g7s_orgcode
                $res=array('orgcode'=>'2000VO','carnum'=>$value->carnum);
                $result=$this->loadService('client')->g7sRequest('truck.truck.getTruckSNowAddress',$res,$value->app_key,$value->app_secret);
                if(!empty($result['data']['result'][0]['lng']) && !empty($result['data']['result'][0]['lat'])){
                    $lng=$result['data']['result'][0]['lng'];
                    $lat=$result['data']['result'][0]['lat'];
                    $fix=array('lng'=>$lng,'lat'=>$lat);
                    $address=$this->loadService('api')->getAddressByLngLat($fix);
                    if($address['address']){
                        $value->city = $address['address'];
                    }
                }
            }
        }
        return $data;
    }
    public function getCarnumByCarrierid($args) {
        $params = fixer::input($args)->get();
        if (!property_exists($params, 'carrier_id') || $params->carrier_id == ''){
            throw new RuntimeException("承运商id不能为空", 2);
        }
        $getCarnum =  $this->dao->selectList('truck_source.getCarnumByCarrierid',$params);
        return $getCarnum;
    }

    /**
     * Desc: 获取车辆当前位置
     * @Author sunjie
     */
    function getAddressList($res){
        $fixer = fixer::input($res);
        $params = $fixer->getArray();
        //LBS获取定位
        if($params['type'] == '1'){
            $address = $this->dao->selectOne('history.getAddress',array("driver_phone"=>$params['driver_phone']));
        }
        //gps获取定位
        elseif($params['type'] == '2'){
            $app_key_secret =$this->dao->selectOne('truck_source.getApp_key_secret',array("driver_phone"=>$params['driver_phone']));
            $address = $this->loadService('client')->gpsSendLocation(array("carnum"=>$params['carnum'],"key_secret"=>$app_key_secret));
        }
        return $address;
    }
     /**
     * 获取车队选择框
     *
     */
    public function getMotorcade ($fixer)
    {
        $name = fixer::input($fixer)->get('name');
        $warehouseId = $this->loadService('truck_source')->_getWarehouse();
        if(!isset($warehouseId))  return [];
        return  $this->dao->selectList('truck_source.getMotorcade',['name'=>$name,'warehouse_id'=>$warehouseId]);
    }


    /**
     * 获取司机手机号列表
     * Author sunjie
     * 2016-11-22
     */
    public function getDriverPhone ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $params->role_condition = $this->getRoleCondition($params->orgcode);
        return $rt = $this->dao->selectList('shipment.getDrivers', $params);
    }
    /**
     * 给3万活跃司机发送签到通知
     * Author ivan
     * 2016-11-22
     */
    public function signInTimeing($args){
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $pageNo=json_decode(redisCache("pageNo"),true);
        $params->pageSize=0;
        $endtime=json_decode(redisCache("endtime"),true);

        if(!empty($endtime)&&(time()-$endtime>27000)){
          redisCache('flag',array());
        }
        $flag=json_decode(redisCache('flag'),true);
          if(empty($flag)){
            if(empty($pageNo)){
              $params->pageNo=1;
              redisCache("pageNo",1);
            }else{
              $params->pageNo=$pageNo+1;
              redisCache("pageNo",$params->pageNo);
            }
            $params->pageSize=100;
          
          $params->start=date('Y-m-d H:i:s',strtotime('-10 days'));
          $params->end=date('Y-m-d H:i:s',time());
          if($params->pageNo<=300){
            $drivers=$this->dao->selectPage('truck_source.getDrivers',$params);
            if(empty($drivers->result)){
              redisCache("pageNo",array());
              redisCache('flag',1);
              redisCache("endtime",time());
            }else{
              foreach($drivers->result as $key=>$val){
                $fix = array(
                  'openid'=>$val->openid,
                  'url'=>$_SERVER['HTTP_HOST'].'/wechat/driverSign.html?openid='.$val->openid,
                  'first'=>array('value'=>'打卡免费获取当地货源信息。','color'=>'#000000'),
                  'keyword1'=>array('value'=>'打卡获得当前最新货源200条。','color'=>'#000000'),//内容
                  'keyword2'=>array('value'=>date('Y-m-d H:i:s',time()),'color'=>'#000000'),//时间
                  'remark'=>array('value'=>'打卡领积分,请积极参与。','color'=>'#000000')
                );
                $sendmsg =$this->loadService('wechat')->sendTempMessage('sign_in',$fix,'shipment');
              }
            }
          }else{
            redisCache("pageNo",array());
            redisCache('flag',1);
            redisCache("endtime",time());
          }
        }
    }

    /**
     * 获取车辆信息
     *
     */
    public function truckCheckByphone ($args)
    {
        $fixer = fixer::input($args);
        $params = $fixer->get();

        return  $this->dao->selectList('truck_source.truckCheckByphone',$params);
    }
    
    public function delcar_wechat ($fixer)
    {
    	$params = fixer::input($fixer)->get();
    	if(isset($params->openid)){
    		$return = ['code'=>1,'未查询到用户信息'];
    		if(!$params->openid) return $return;
    		$wechat = $this->dao->selectList('truck_source.getByOpenId_wechat',array("openid"=>$params->openid));
    		$params->carrier_id =$wechat[0]->id;
    	}
    	
    	return $this->dao->update('truck_source.del',['id'=>$params->rid,'carrier_id'=> $params->carrier_id]);
    	
    }
}