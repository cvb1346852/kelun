<?php
/**
 * @author zsq
 * The service file of carrier module.
 */
class carrierService extends service
{
    public function __construct()
    {
        parent::__construct();
        $this->group =['carrier_name','relation_phone'];
        $this->safe =[
            ['id'=>1,'text'=>'物流责任险'],
            ['id'=>2,'text'=>'内陆运输险'],
            ['id'=>3,'text'=>'财产一切险'],
            ['id'=>4,'text'=>'第三方责任险'],
            ['id'=>5,'text'=>'货物运输险'],
            ['id'=>6,'text'=>'交强险'],
            ['id'=>7,'text'=>'车损险'],
            ['id'=>8,'text'=>'驾驶员人身险'],
            ['id'=>9,'text'=>'车上人员险'],
            ['id'=>10,'text'=>'其它']
        ];
        $this->travelService =[
            ['id'=>1,'text'=>'空运'],
            ['id'=>2,'text'=>'陆运'],
            ['id'=>3,'text'=>'快递'],
            ['id'=>4,'text'=>'火车'],
            ['id'=>5,'text'=>'内河'],
            ['id'=>6,'text'=>'内海'],
            ['id'=>7,'text'=>'危险品'],
            ['id'=>8,'text'=>'冷链'],
            ['id'=>9,'text'=>'其它']
        ];
        $this->otherService =[
            ['id'=>1,'text'=>'ePOD'],
            ['id'=>2,'text'=>'预约配送'],
            ['id'=>3,'text'=>'货到付款'],
            ['id'=>4,'text'=>'送货上楼'],
            ['id'=>5,'text'=>'取退货'],
            ['id'=>6,'text'=>'其它']
        ];
        $this->carrierarea =[
            ['id'=>1,'text'=>'华东地区（包括山东、江苏、安徽、浙江、福建、上海)'],
            ['id'=>2,'text'=>'华南地区 （包括广东、广西、海南'],
            ['id'=>3,'text'=>'华中地区 (包括湖北、湖南、河南、江西)'],
            ['id'=>4,'text'=>'华北地区 (包括北京、天津、河北、山西、内蒙古)'],
            ['id'=>5,'text'=>'西北地区(包括宁夏、新疆、青海、陕西、甘肃)'],
            ['id'=>6,'text'=>'东北地区( 包括辽宁、吉林、黑龙江)'],
            ['id'=>7,'text'=>'西南地区 (包括四川、云南、贵州、西藏、重庆)'],
            ['id'=>8,'text'=>'台港澳地区 (包括台湾、香港、澳门)']
        ];
    }

    public function _getWarehouse ()
    {
    	tools::datalog(var_export(Ucenter::init()->getUserInfo()->organ->orgcode,true),'orgcode_');
        $result =  $this->dao->selectOne('warehouse.getByOrgcode',['orgcode'=>Ucenter::init()->getUserInfo()->organ->orgcode]);
        if($result){
            return $result;
        }else{
            throwException('无法取得对应基地信息');
        }
    }

    /**
     * The getByGroup getSet of carrier module.
     *
     */
    public function getSet ($fixer)
    {
        $type = fixer::input($fixer)->get('type');
        return isset($this->$type) ? $this->$type : [];
    }
    /**
     * The search page of carrier module.
     *
     */
    public function search ($fixer)
    {
        $params = fixer::input($fixer)->get();
        $warehouse = $this->_getWarehouse();
        if(!isset($warehouse->id) || !$warehouse->id){
            throwException('无法取得登录用户基地信息',2);
        }
        $params->warehouse_id = $warehouse->id;
        if(!$params->property) unset($params->property);
        $params->pageSize = $params->pageSize ? $params->pageSize : 10;
        $params->pageNo = $params->pageNo ? $params->pageNo : 1;
        $params->sortColumns = 'create_time desc';
        tools::datalog('params_'.var_export($params,true),'param_');
        $result = $this->dao->selectPage('carrier.selectPage',$params);
        foreach ($result->result as $key=>$item) {
            $item->status_text = $item->status == 1 ? '未审核' : ( $item->status == 2 ? '未通过' : '通过');
            $item->is_invoice_text  = $item->is_invoice == 1 ? '允许' : '不允许';
            $item->invoice_rate_text = $item->invoice_rate ? $item->invoice_rate.'%' : '--' ;
            $item->real_invoice_rate_text = ( $item->real_invoice_rate == '0.0' || $item->real_invoice_rate == null)  ? '--' :  $item->real_invoice_rate+'%' ;
        }
        return $result;
    }

    /**
     * The save page of carrier module.
     */
    public function save ($fixer)
    {
        $fixer = fixer::input($fixer)->getArray();
        if(!$fixer['organizing_code']) throw new RuntimeException('社会信用代码必填且唯一', 2);
        $phoneCheck=$this->dao->selectOne('carrier.checkPhone',array('relation_phone'=>$fixer['relation_phone']));
        $carrierCheck = $this->dao->selectOne('carrier.checkOrgcode',array('organizing_code'=>$fixer['organizing_code']));
        $carrierName=$this->dao->selectOne('carrier.checkCarrierName',array('carrier_name'=>$fixer['carrier_name']));
        //检查该电话是否在其他地方注册过
        $byphone = $this->dao->selectOne('truck_source.truckCheckByphone', array('driver_phone' => $fixer['relation_phone']));
        $byphone_warehouse = $this->dao->selectOne('warehouse.getRoute', array('phone' => $fixer['relation_phone']));
        $byphone_warehouse_user = $this->dao->selectOne('warehouse.getWarehouseUser', array('phone' => $fixer['relation_phone']));
        $byphone_wechat_connect = $this->dao->selectOne('order.getWechatConnect', array('phone' => $fixer['relation_phone'],'type'=>4));
       if(!empty($byphone) || !empty($byphone_warehouse) || !empty($byphone_warehouse_user) || !empty($byphone_wechat_connect)){
           return array('code'=>3,'message'=>"添加失败,该手机号已经注册过其他角色,不能重复注册");
       }
        $id = guid();
        $fixer['last_update'] = $this->app->user->id;
        // organizing_code 社会信用代码唯一
        if(isset($fixer['apply']) && $fixer['apply']){//申请
            
            if(!$fixer['warehouse_id'] || !$fixer['warehouse_name']) throw new RuntimeException('必须选择申请的基地', 2);
            $carrier =  $this->dao->selectOne('carrier.selectPage',['warehouse_id'=>$fixer['warehouse_id'],'relation_phone'=>$fixer['relation_phone']]);



            //判断该电话是否已经注册
            if($phoneCheck){
                if($phoneCheck->check_status==0 || $phoneCheck->check_status==2){
                    if($carrierCheck && $carrierCheck->id!=$phoneCheck->id) return array('code'=>3,'message'=>'社会信用代码重复');
                    if($carrierName && $carrierName->id!=$phoneCheck->id) return array('code'=>3,'message'=>'承运商名称重复');
                    $fixer['id']=$phoneCheck->id;
                    $this->dao->update('carrier.update',$fixer);
                    if(!$carrier){
                        $result =  $this->dao->insert('carrier.insert_s',[
                            'carrier_id'=>$phoneCheck->id,
                            'warehouse_id'=>$fixer['warehouse_id'],
                            'warehouse_name'=>$fixer['warehouse_name'],
                            'trans_type'=>$fixer['trans_type'],
                            'cooperate_type'=>$fixer['bidding'] ? ($fixer['fixed_price'] ? 3 : 1) : ($fixer['fixed_price'] ? 2 : 1),
                            'phone'=>isset($fixer['relation_phone']) ? $fixer['relation_phone'] : '',
                            'last_update'=>$this->app->user->id,
                            'status'=>1,
                            'carrier_type'=>2,
                        ]);
                    }
                    return array('code'=>0);
                }else{
                    return array('code'=>3,'message'=>'该手机号已经注册过承运商');
                }
            }else{
                if($carrierCheck) return array('code'=>3,'message'=>'社会信用代码重复');
                if($carrierName) return array('code'=>3,'message'=>'承运商名称重复');
                $fixer['id'] =  $id;
                $this->dao->insert('carrier.insert',$fixer);
                $result =  $this->dao->insert('carrier.insert_s',[
                    'carrier_id'=>$id,
                    'warehouse_id'=>$fixer['warehouse_id'],
                    'warehouse_name'=>$fixer['warehouse_name'],
                    'trans_type'=>$fixer['trans_type'],
                    'cooperate_type'=>$fixer['bidding'] ? ($fixer['fixed_price'] ? 3 : 1) : ($fixer['fixed_price'] ? 2 : 1),
                    'phone'=>isset($fixer['relation_phone']) ? $fixer['relation_phone'] : '',
                    'last_update'=>$this->app->user->id,
                    'status'=>1,
                    'carrier_type'=>2,
                ]);
                return array('code'=>0);
            }
        }
        //修改
        if(isset($fixer['carrier_id']) && $fixer['carrier_id']){
            $carrierCheck = $this->dao->selectOne('carrier.checkOrgcode',array('organizing_code'=>$fixer['organizing_code']));
            if($carrierName && $carrierName->id!=$fixer['carrier_id']) return array('code'=>3,'message'=>'承运商名称重复');
            if($carrierCheck && $carrierCheck->id!=$fixer['carrier_id']){
                throw new RuntimeException('社会信用代码重复', 2);
            }else{
                if($phoneCheck && $phoneCheck->id!=$fixer['carrier_id']) throw new RuntimeException('该电话已注册,不能重复', 2);
                if($carrierCheck->organizing_code!=$fixer['organizing_code']) return array('code'=>3,'message'=>'社会信用代码不可更改');

                $carrierMsg=$this->dao->selectOne('carrier.getCarrierById',array('id'=>$fixer['carrier_id']));

                $this->dao->update('carrier.updateAgree',[
                    'id'=>$fixer['id'],
                    'trans_type' => $fixer['trans_type'] ? $fixer['trans_type'] :$carrierMsg->trans_type,
                    'cooperate_type' => $fixer['bidding'] ? ($fixer['fixed_price'] ? 3 : 1) : ($fixer['fixed_price'] ? 2 : 1),
                    'phone'=>isset($fixer['relation_phone']) ? $fixer['relation_phone'] : '',
                    'last_update'=>$this->app->user->id
                ]);

                $fixer['id'] = $fixer['carrier_id'];
                $this->push($fixer);

                $fixer = array(
                    'id' => $fixer['id'],
                    'carrier_name' =>  $fixer['carrier_name'],
                    'carrier_name_s' => $fixer['carrier_name_s'] ? $fixer['carrier_name_s']:$carrierMsg->carrier_name_s,
                    'province' => $fixer['province'] ? $fixer['province']:$carrierMsg->province,
                    'city' => $fixer['city'] ? $fixer['city']:$carrierMsg->city,
                    'representative' => $fixer['representative'] ? $fixer['representative']:$carrierMsg->representative,
                    'property' => $fixer['property'] ? $fixer['property']:$carrierMsg->property,
                    'capital' => $fixer['capital'] ? $fixer['capital']:$carrierMsg->capital,
                    'carrier_date' => $fixer['carrier_date'] ? $fixer['carrier_date']:$carrierMsg->carrier_date,
                    'societycode' => $fixer['societycode'] ? $fixer['societycode']:$carrierMsg->societycode,
                    'organizing_code' => $fixer['organizing_code'] ? $fixer['organizing_code']:$carrierMsg->organizing_code,
                    'roadpicture' => $fixer['roadpicture'] ? $fixer['roadpicture']:$carrierMsg->roadpicture,
                    'bankpicture' => $fixer['bankpicture'] ? $fixer['bankpicture']:$carrierMsg->bankpicture,
                    'taxpicture' => $fixer['taxpicture'] ? $fixer['taxpicture']:$carrierMsg->taxpicture,
                    'orgcodeprove' => $fixer['orgcodeprove'] ? $fixer['orgcodeprove']:$carrierMsg->orgcodeprove,
                    'carrier_introduce' => $fixer['carrier_introduce'] ? $fixer['carrier_introduce']:$carrierMsg->carrier_introduce,
                    'safe' => $fixer['safe'] ? $fixer['safe']:$carrierMsg->safe,
                    'travelService' => $fixer['travelService'] ? $fixer['travelService']:$carrierMsg->travelService,
                    'otherService' => $fixer['otherService'] ? $fixer['otherService']:$carrierMsg->otherService,
                    'carpercent' => $fixer['carpercent'] ? $fixer['carpercent']:$carrierMsg->carpercent,
                    'carrierarea' => $fixer['carrierarea'] ? $fixer['carrierarea']:$carrierMsg->carrierarea,
                    'strengthline' => $fixer['strengthline'] ? $fixer['strengthline']:$carrierMsg->strengthline,
                    'selfcar' => $fixer['selfcar'] ? $fixer['selfcar']:$carrierMsg->selfcar,
                    'selfcarprove' => $fixer['selfcarprove'] ? $fixer['selfcarprove']:$carrierMsg->selfcarprove,
                    'othercar' => $fixer['othercar'] ? $fixer['othercar']:$carrierMsg->othercar,
                    'relation_person' => $fixer['relation_person'] ? $fixer['relation_person']:$carrierMsg->relation_person,
                    'relation_phone' => $fixer['relation_phone'] ? $fixer['relation_phone']:$carrierMsg->relation_phone,
                    'relation_fax' => $fixer['fax'] ? $fixer['fax']:$carrierMsg->relation_fax,
                    'relation_email' => $fixer['relation_email'] ? $fixer['relation_email']:$carrierMsg->relation_email,
                    'relation_address' => $fixer['address'] ? $fixer['address']:$carrierMsg->relation_address,
                    'relation_post' => $fixer['postcode'] ? $fixer['postcode']:$carrierMsg->relation_post,
                    'last_update' => $fixer['last_update'] ? $fixer['last_update']:$carrierMsg->last_update,
                    'is_invoice' => $fixer['is_invoice'] ? $fixer['is_invoice']:$carrierMsg->is_invoice,
                    'invoice_rate' => $fixer['invoice_rate'] ? $fixer['invoice_rate']:$carrierMsg->invoice_rate,
                    'real_invoice_rate' => $fixer['real_invoice_rate'] ? $fixer['real_invoice_rate']:$carrierMsg->real_invoice_rate,
                    'trans_type' => $fixer['trans_type'] ? $fixer['trans_type'] :$carrierMsg->trans_type,
                    'cooperate_type' => $fixer['bidding'] ? ($fixer['fixed_price'] ? 3 : 1) : ($fixer['fixed_price'] ? 2 : 1),
                );
                $result = $this->dao->update('carrier.update',$fixer);
                if($result){
                    return array('code'=>0);
                }
            }
            
        }else{
            if($phoneCheck) throw new RuntimeException('该电话已注册,不能重复', 2);
            if($carrierName) throw new RuntimeException('承运商名称重复', 2);
            $fixer['id'] = $id;
            $warehouse = $this->_getWarehouse();
            if(!isset($warehouse->id))  throw new RuntimeException('无查询到对应的基地/片区信息', 2);
            $carrier =  $this->dao->selectOne('carrier.selectPage',['warehouse_id'=>$warehouse->id,'organizing_code'=>$fixer['organizing_code']]);
            if($carrierCheck){
                throw new RuntimeException('已经添加了该承运商信息', 2);
            }else{
                $fixer = array(
                    'id' => $fixer['id'],
                    'carrier_name' =>  $fixer['carrier_name'],
                    'carrier_name_s' => $fixer['carrier_name_s'] ? $fixer['carrier_name_s']:'',
                    'province' => $fixer['province'] ? $fixer['province']:'',
                    'city' => $fixer['city'] ? $fixer['city']:'',
                    'representative' => $fixer['representative'] ? $fixer['representative']:'',
                    'property' => $fixer['property'] ? $fixer['property']:'',
                    'capital' => $fixer['capital'] ? $fixer['capital']:'',
                    'carrier_date' => $fixer['carrier_date'] ? $fixer['carrier_date']:'',
                    'societycode' => $fixer['societycode'] ? $fixer['societycode']:'',
                    'organizing_code' => $fixer['organizing_code'] ? $fixer['organizing_code']:'',
                    'roadpicture' => $fixer['roadpicture'] ? $fixer['roadpicture']:'',
                    'bankpicture' => $fixer['bankpicture'] ? $fixer['bankpicture']:'',
                    'taxpicture' => $fixer['taxpicture'] ? $fixer['taxpicture']:'',
                    'orgcodeprove' => $fixer['orgcodeprove'] ? $fixer['orgcodeprove']:'',
                    'carrier_introduce' => $fixer['carrier_introduce'] ? $fixer['carrier_introduce']:'',
                    'safe' => $fixer['safe'] ? $fixer['safe']:'',
                    'travelService' => $fixer['travelService'] ? $fixer['travelService']:'',
                    'otherService' => $fixer['otherService'] ? $fixer['otherService']:'',
                    'carpercent' => $fixer['carpercent'] ? $fixer['carpercent']:'',
                    'carrierarea' => $fixer['carrierarea'] ? $fixer['carrierarea']:'',
                    'strengthline' => $fixer['strengthline'] ? $fixer['strengthline']:'',
                    'selfcar' => $fixer['selfcar'] ? $fixer['selfcar']:'',
                    'selfcarprove' => $fixer['selfcarprove'] ? $fixer['selfcarprove']:'',
                    'othercar' => $fixer['othercar'] ? $fixer['othercar']:'',
                    'relation_person' => $fixer['relation_person'] ? $fixer['relation_person']:'',
                    'relation_phone' => $fixer['relation_phone'] ? $fixer['relation_phone']:'',
                    'relation_fax' => $fixer['fax'] ? $fixer['fax']:'',
                    'relation_email' => $fixer['relation_email'] ? $fixer['relation_email']:'',
                    'relation_address' => $fixer['address'] ? $fixer['address']:'',
                    'relation_post' => $fixer['postcode'] ? $fixer['postcode']:'',
                    'last_update' => $fixer['last_update'] ? $fixer['last_update']:'',
                    'is_invoice' => $fixer['is_invoice'] ? $fixer['is_invoice']:'',
                    'invoice_rate' => $fixer['invoice_rate'] ? $fixer['invoice_rate']:'',
                    'real_invoice_rate' => $fixer['real_invoice_rate'] ? $fixer['real_invoice_rate']:'',
                    'trans_type' => $fixer['trans_type'] ? $fixer['trans_type'] :'',
                    'cooperate_type' => $fixer['bidding'] ? ($fixer['fixed_price'] ? 3 : 1) : ($fixer['fixed_price'] ? 2 : 1),
                    'warehouse_id'=>$warehouse->id,
                );
                $this->dao->insert('carrier.insert',$fixer);
            }
            $result = $this->dao->insert('carrier.insert_s',[
                'carrier_id'=>$id,
                'warehouse_id'=>$warehouse->id,
                'warehouse_name'=>$warehouse->name,
                'trans_type' => $fixer['trans_type'] ? $fixer['trans_type'] :'',
                'cooperate_type' => $fixer['bidding'] ? ($fixer['fixed_price'] ? 3 : 1) : ($fixer['fixed_price'] ? 2 : 1),
                'phone'=>isset($fixer['relation_phone']) ? $fixer['relation_phone'] : '',
                'last_update'=>$this->app->user->id,
                'status'=>3,
                'carrier_type'=>1,
            ]);
            $this->dao->update('carrier.updateCheckStatus',array('id'=>$id,'status'=>1));
            $this->push($fixer);
            if($result){
                return array('code'=>0);
            }
        }
    }

    /**
     * The push page of carrier module.
     */
    public function push ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        $data = new stdClass();
        $data->name = $fixer->carrier_name ;
        $data->organizing_code = $fixer->organizing_code;
        $data->simple_name = $fixer->carrier_name_s ;
        $data->city = $fixer->city;
        $data->contact = $fixer->relation_person ? $fixer->relation_person : '';
        $data->phone =$fixer->relation_phone ? $fixer->relation_phone :'';
        $data->fax = $fixer->fax ? $fixer->fax :'';
        $data->email = $fixer->relation_email?$fixer->relation_email:'';
        $data->real_invoice_rate = $fixer->real_invoice_rate?$fixer->real_invoice_rate:'';
        $data->address = $fixer->address ? $fixer->address : '';
        $data->post_code = $fixer->postcode ? $fixer->postcode : '';
        //这里获取承运商对应的所有基地orgcode
        $plat_form_code = $this->dao->selectList('carrier.selectPlat_form_code',['id'=>$fixer->id]);
        $a = [];
        if($plat_form_code){
            foreach($plat_form_code as $v){
                $a[]=$v->platform_code;
            }
        }
        $data->plat_form_code = implode(',',$a);
        //TODO://webservice暂时不通
        return $this->loadService('client')->webServiceRequest('sendCarrier',$data);
    }
    /**
     * The search page of carrier module.
     *
     */
    public function agree ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        $warehouse = $this->_getWarehouse();
        if(!in_array($fixer->type,[2,3]) || !$fixer->id) return array('code'=>1,'message'=>'操作失败');
        $carrier_id=$this->dao->selectOne('carrier.getCarrierId',array('id'=>$fixer->id));
        $warehouse_id=$this->dao->selectOne('carrier.getAuditorId',array('id'=>$fixer->id));
        if($warehouse->id!=$warehouse_id->auditor_id) return array('code'=>1,'message'=>'无权审核该承运商');
        if($fixer->type==3){
            $this->dao->update('carrier.updateCheckStatus',array('id'=>$carrier_id->carrier_id,'status'=>1));
            $this->push($warehouse_id);
        }else{
            $this->dao->update('carrier.updateCheckStatus',array('id'=>$carrier_id->carrier_id,'status'=>2));
        }
         return array('code'=>0,'message'=>'操作成功');
    }

    /**
     * The G7Set page of carrier module.
     *
     */
    public function G7Set ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!($fixer->g7s_orgcode) || !$fixer->id) return false;
        return  $this->dao->update('carrier.g7s_set',['g7s_orgcode'=>$fixer->g7s_orgcode,'id'=>$fixer->id,'last_update'=>$this->app->user->id]);
    }

    /**
     * The getById page of carrier module.
     *
     */
    public function getById ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!$fixer->id) return [];
        $data =  $this->dao->selectOne('carrier.getById',$fixer);
        if(isset($data->safe) && $data->safe){
            $safe = explode(',',$data->safe);
            $data->safe = [];
            foreach($safe as $v){
                foreach($this->safe as $vv){
                    if($vv['id'] == $v){
                        $data->safe[] = $vv;
                        break;
                    }
                }
            }
        }
        if(isset($data->travelService) && $data->travelService){
            $travelService = explode(',',$data->travelService);
            $data->travelService = [];
            foreach($travelService as $v){
                foreach($this->travelService as $vv){
                    if($vv['id'] == $v){
                        $data->travelService[] = $vv;
                        break;
                    }
                }
            }
        }
        if(isset($data->otherService) && $data->otherService){
            $otherService = explode(',',$data->otherService);
            $data->otherService = [];
            foreach($otherService as $v){
                foreach($this->otherService as $vv){
                    if($vv['id'] == $v){
                        $data->otherService[] = $vv;
                        break;
                    }
                }
            }
        }
        if(isset($data->carrierarea) && $data->carrierarea){
            $carrierarea = explode(',',$data->carrierarea);
            $data->carrierarea = [];
            foreach($carrierarea as $v){
                foreach($this->carrierarea as $vv){
                    if($vv['id'] == $v){
                        $data->carrierarea[] = $vv;
                        break;
                    }
                }
            }
        }
        return $data;
    }


    /**
     * The del page of carrier module.
     *
     */
    public function del ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!$fixer->id) return [];
        $ids = explode(',',$fixer->id);
        foreach($ids as $v){
            $this->dao->update('carrier.del',['id'=>$v,'last_update'=> $this->app->user->id]);
        }
        return true;
    }

    /**
     * Desc:获取所有的承运商
     * @param $res
     * @Author Lvison
     * @return array|null
     */
    public function getAllCarrier($res){
        if(empty($res['carrier'])){
            throwException('请输入承运商');
        }
        $result = $this->dao->selectList('carrier.getAllCarrier',array('carrier'=>$res['carrier']));

        return $result;
    }

    /**
     * Desc:获取承运商信息，用于审核承运商  通过关系表id carrier_warehouse_id
     * @param $res
     * @Author will
     * @return array|null
     */
    public function getAlterInfo($res){
        if(empty($res->id)){
            throwException('数据不完整');
        }
        return  $this->dao->selectOne('carrier.getAlterInfo',array('carrier_warehouse_id'=>$res->id));
    }



    /**
     * Desc:保存关联承运商
     * @param $res
     * @Author Lvison
     * @return array
     */
    public function saveConnection($res){

        $warehouse = $this->_getWarehouse();
        $carrier =  $this->dao->selectOne('carrier.selectPage',['warehouse_id'=>$warehouse->id,'carrier_id'=>$res['carrier_id']]);
        if($carrier){
            return array('code'=>1,'message'=>'该承运商已建立合作关系，不能重复关联');
        }
        $result = $this->dao->insert('carrier.insert_s',[
            'carrier_id'=>$res['carrier_id'],
            'warehouse_id'=>$warehouse->id,
            'warehouse_name'=>$warehouse->name,
            'trans_type'=>$res['trans_type'],
            'cooperate_type'=>$res['bidding'] ? ($res['fixed_price'] ? 3 : 1) : ($res['fixed_price'] ? 2 : 1),
            'phone'=>'',
            'last_update'=>$this->app->user->id,
            'status'=>3,
            'id'=>guid()
        ]);
        if($result){
            return array('code'=>0);
        }else{
            return array('code'=>1,'message'=>'数据库操作失败');
        }
        return array('code'=>0);
    }
    /**
     * Desc:检查基地是否设置了默认承运商
     * @param $res
     * @Author Ivan
     * @return array|null
     */
    public function carrierCheck($res){
        $fixer = fixer::input($res)->getArray();
        $result = $this->dao->selectOne('carrier.carrierCheck',$fixer);
        return $result;
    }
    /**
     * Desc:获取承运商名称
     * @param $res
     * @Author Ivan
     * @return array|null
     */
    public function getCarriers($res){
        $fixer = fixer::input($res)->getArray();
        $result = $this->dao->selectList('carrier.getCarriers',$fixer);
        return $result;
    }
    /**
     * Desc:设置默认承运商
     * @param $res
     * @Author Ivan
     * @return array|null
     */
    public function setDefauleCarrier($res){
        $fixer = fixer::input($res)->getArray();
        $res=$this->carrierCheck($res);
        if($res->id!=''&&$res->id!=null){
            $res->orgcode=$fixer['orgcode'];
            $re = $this->dao->update('carrier.setOldDefauleCarrier',$res);
        }
        $result = $this->dao->update('carrier.setDefauleCarrier',$fixer);
        return $result;
    }
    /**
     * Desc:检查organizing_code是否重复
     * @param $res
     * @Author Ivan
     * @return array|null
     */
    public function checkOrgcode($res){
        $fixer = fixer::input($res)->getArray();
        $result = $this->dao->selectList('carrier.checkOrgcode',$fixer);
        if($result){
            return array('code'=>0,'msg'=>'organizing_code重复');
        }else{
            return array('code'=>1,'msg'=>'organizing_code不重复');
        }
    }
    /**
     * Desc:统计承运商及司机的信用体系定时任务
     * @param $res
     * @Author Ivan
     * @return array|null
     */
    public function creditSystemTiming($res){
        $params = fixer::input($res)->get();
        $pageNo=json_decode(redisCache("pageNo"),true);
        $endtime=json_decode(redisCache("endtime"),true);
        redisCache('flag',array());
        if(!empty($endtime)&&(time()-$endtime>18000)){
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
            $params->pageSize=200;
            //获取所有承运商
            $carrier=$this->dao->selectPage('carrier.getAllCarriers',$params);
            /*$driver = $this->dao->selectPage('carrier.getAllDrivers',$params);*/
            $warehouse=$this->dao->selectPage('carrier.getAllWarehouses',$params);
            //统计基地
            if(!empty($warehouse->result)){
                foreach($warehouse->result AS $key=>$val){
                    //统计装货质量
                    $loadQuality=$this->dao->selectList('carrier.getLoadQuality',array('warehouse_id'=>$val->id));
                    $total_grade=array('1'=>0,'2'=>0,'3'=>0,'4'=>0,'5'=>0);
                    if(empty($loadQuality)){
                        $orderNum=0;
                    }else{
                        $f=0;
                        $orderNum=0;
                        foreach($loadQuality as $k=>$v){
                            if($v->product_abnormal){
                                $pr=json_decode($v->product_abnormal,true);
                                if($pr['more']!='' || $pr['less']!='' || $pr['error']!=''){
                                    $f=1;
                                }
                            }
                            if($f==1){
                                $orderNum++;
                                $f=0;
                            }
                            if($v->grade){
                                $wh_grade=json_decode($v->grade);
                                $total_grade[$wh_grade->jidigoutong]=$total_grade[$wh_grade->jidigoutong]+1;
                            }
                        }
                    }
                    $total_grade=json_encode($total_grade); 
                    $fixer=array(
                            'warehouse_id'=>$val->id,
                            'load_quality'=>$orderNum,
                            'total_grade'=>$total_grade
                        );
                    $result=$this->dao->update('carrier.updateWarehouse',$fixer);
                }
            }
            //统计承运商
            if(!empty($carrier->result)){
                foreach($carrier->result as $key=>$val){
                    $shipmentMsg=$this->dao->selectList('carrier.getShipmentMsg',array('carrier_id'=>$val->id));
                    if($shipmentMsg[0]->delivery_times==0){
                        $shipmentMsg[0]->delivery_times='0';
                        $shipmentMsg[0]->total_weight='0';
                        $shipmentMsg[0]->total_distance='0';
                        $shipmentMsg[0]->total_price='0';
                    }
                    $orderMsg=$this->dao->selectList('carrier.getOrderMsg',array('carrier_id'=>$val->id));
                    $total_grade=array('1'=>0,'2'=>0,'3'=>0,'4'=>0,'5'=>0);
                    if($orderMsg){
                        $f=0;
                        $orderNum=0;
                      foreach($orderMsg as $k=>$v){
                        $grade=json_decode($v->grade);
                        $total_grade[$grade->driver_taidu]=$total_grade[$grade->driver_taidu]+1;
                        //统计运输质量
                        if($v->quality_abnormal){
                                $qu=json_decode($v->quality_abnormal,true);
                                if($qu['product_damage_number']!='' || $qu['package_damage_number']!=''){
                                    $f=1;
                                }
                            }
                            if($v->product_abnormal){
                                $pr=json_decode($v->product_abnormal,true);
                                if($pr['data_loss']!='' || $pr['error_receiver']!=''){
                                    $f=1;
                                }
                            }
                            if($f==1){
                                $orderNum++;
                                $f=0;
                            }
                        } 
                    }else{
                        $orderNum=0;
                    }
                    $total_grade=json_encode($total_grade); 
                    $complain_num=$this->dao->selectList('carrier.getComplainNum',array('carrier_name'=>$val->carrier_name));
                    if(empty($complain_num)){
                        $complain_num[0]->complain_num='0';
                    }
                    $fixer=array(
                            'carrier_id'=>$val->id,
                            'delivery_times'=>$shipmentMsg[0]->delivery_times,
                            'total_weight'=>$shipmentMsg[0]->total_weight,
                            'total_distance'=>$shipmentMsg[0]->total_distance,
                            'complain_num'=>$complain_num[0]->complain_num,
                            'total_grade'=>$total_grade,
                            'total_price'=>$shipmentMsg[0]->total_price,
                            'order_num'=>$orderNum

                        );
                    $result=$this->dao->update('carrier.updateCarrier_a',$fixer);
                    
                }
            }else{
                redisCache("pageNo",array());
                redisCache('flag',1);
                redisCache("endtime",time());
            }
        }
    }
    /**
     * Desc:更新司机及承运商的活跃时间
     * @param $res
     * @Author Ivan
     * @return array|null
     */
    public function updateActiveTime($res){
        $fixer = fixer::input($res)->get();
        if($fixer->user_type==3){
            $fixer->tablename='truck_source AS ts';
            $fixer->getcolunm='ts.id';
            $fixer->oncolunm='ts.driver_phone';
            $fixer->updateTableName='truck_source';
        }elseif($fixer->user_type==4){
           $fixer->tablename='carrier AS c';
           $fixer->getcolunm='c.id';
           $fixer->oncolunm='c.relation_phone'; 
           $fixer->updateTableName='carrier';
        }elseif($fixer->user_type==2){
            if($fixer->openid){
                $this->dao->update('carrier.updateActiveTime_sign',$fixer);
                return false;
            }
        }
        $fixer->now_date=date('Y-m-d H:i:s',time());
        $relation_id=$this->dao->selectOne('carrier.getRelationId',$fixer);
        $fixer->id=$relation_id->id;
        $result = $this->dao->update('carrier.updateActiveTime',$fixer);
    }
    /**
     * Desc:统计承运商司机信用体系定时任务2
     * @param $res
     * @Author Ivan
     * @return array|null
     */
    public function creditSysTiminga($res){
        $params = fixer::input($res)->get();
        $pageNo=json_decode(redisCache("pageNo"),true);
        $endtime=json_decode(redisCache("endtime"),true);
        if(!empty($endtime)&&(time()-$endtime>18000)){
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
            $params->pageSize=200;
            $driver = $this->dao->selectPage('carrier.getAllDrivers',$params);
            //统计司机
            if(empty($driver->result)){
                redisCache("pageNo",array());
                redisCache('flag',1);
                redisCache("endtime",time());
            }else{
                foreach($driver->result as $key=>$val){
                    $shipmentMsg=$this->dao->selectList('carrier.getShipmentMsg',array('driver_phone'=>$val->driver_phone));
                    if($shipmentMsg[0]->delivery_times==0){
                        $shipmentMsg[0]->delivery_times='0';
                        $shipmentMsg[0]->total_weight='0';
                        $shipmentMsg[0]->total_distance='0';
                    }
                    $orderMsg=$this->dao->selectList('carrier.getOrderMsg',array('driver_phone'=>$val->driver_phone));
                    $total_grade=array('1'=>0,'2'=>0,'3'=>0,'4'=>0,'5'=>0);
                    if($orderMsg){
                        $f=0;
                        $orderNum=0;
                      foreach($orderMsg as $k=>$v){
                            $grade=json_decode($v->grade);
                            $total_grade[$grade->driver_taidu]=$total_grade[$grade->driver_taidu]+1;
                            //统计运输质量
                            if($v->quality_abnormal){
                                    $qu=json_decode($v->quality_abnormal,true);
                                    if($qu['product_damage_number']!='' || $qu['package_damage_number']!=''){
                                        $f=1;
                                    }
                                }
                                if($v->product_abnormal){
                                    $pr=json_decode($v->product_abnormal,true);
                                    if($pr['data_loss']!='' || $pr['error_receiver']!=''){
                                        $f=1;
                                    }
                                }
                                if($f==1){
                                    $orderNum++;
                                    $f=0;
                                }
                        } 
                    }else{
                        $orderNum=0;
                    }
                    $total_grade=json_encode($total_grade);
                    //统计运输质量;  
                    $fixer=array(
                            'driver_id'=>$val->id,
                            'delivery_times'=>$shipmentMsg[0]->delivery_times,
                            'total_weight'=>$shipmentMsg[0]->total_weight,
                            'total_distance'=>$shipmentMsg[0]->total_distance,
                            'complain_num'=>'0',
                            'order_num'=>$orderNum,
                            'total_grade'=>$total_grade
                        );
                    $result=$this->dao->update('carrier.updateTruckSource',$fixer);
                }
            }
        }
    }
    /**
     * Desc:统计承运商司机信用体系定时任务3
     * @param $res
     * @Author Ivan
     * @return array|null
     */
    public function creditSysTimingb($res){
        $params = fixer::input($res)->get();
        $pageNo=json_decode(redisCache("pageNo"),true);
        $endtime=json_decode(redisCache("endtime"),true);
        if(!empty($endtime)&&(time()-$endtime>18000)){
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
            $params->pageSize=200;
            //获取所有承运商
            $carrier=$this->dao->selectPage('carrier.getAllCarriers',$params);
            //统计承运商
            if(!empty($carrier->result)){
                foreach($carrier->result as $key=>$val){
                    $CarrierSta=$this->dao->selectList('carrier.getCarrierStatistic',array('relation_id'=>$val->id,'carrier_id'=>$val->id));
                    if($CarrierSta[2]->arriveNum==0){
                        $CarrierSta[2]->arriveNum=1;
                    }
                    if($CarrierSta[4]->arriveNum==0){
                        $CarrierSta[4]->arriveNum=1;
                    }
                    $quote_rate=number_format(($CarrierSta[3]->arriveNum/$CarrierSta[2]->arriveNum),3)*100;
                    $lbs_rate=number_format(($CarrierSta[5]->arriveNum/$CarrierSta[4]->arriveNum),3)*100;
                    $fixer=array(
                            'carrier_id'=>$val->id,
                            'quote_rate'=>$quote_rate,
                            'arraive_num'=>$CarrierSta[0]->arriveNum,
                            'send_car'=>$CarrierSta[1]->arriveNum,
                            'lbs_rate'=>$lbs_rate

                        );
                    $result=$this->dao->update('carrier.updateCarrier_b',$fixer);
                    
                }
            }else{
                redisCache("pageNo",array());
                redisCache('flag',1);
                redisCache("endtime",time());
            }
        }
    }

}
