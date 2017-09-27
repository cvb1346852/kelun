<?php
/**
 * @author zsq
 * The service file of truck_source module.
 */
class tenderService extends service
{

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
        $params->role_condition = $this->getRoleCondition($params->orgcode);
        //$params->statistic_date = '1982-11-19 00:00 - 2016-11-15 23:59';
        //处理时间参数
        $params->statistic_date =  ($params->statistic_date == '0') ? '' : $params->statistic_date;

        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        //添加出发地和目的地的筛选
        /*$params->fromlocation = $params->ddlProvince.''.$params->ddlCity;
        $params->tolocation = $params->toloProvince.''.$params->toloCity;*/
        //删选运单状态
        if($params->check_shipStatus){
           if($params->check_shipStatus == 'arrival'){
               unset($params->check_shipStatus);
               $params->arrival = true;
           }elseif($params->check_shipStatus == 'valid'){
               unset($params->check_shipStatus);
               $params->invalid = true;
           }
        }
        //添加招投标筛选条件
        $shipment_id = array();$shipment_param = [];
/*        if($params->bidding_status != '' && $params->over_price != ''){
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
        }*/

        if($params->bidding_status != ''){
            if($params->bidding_status == '0'){
                $shipmentIds  =  $this->dao->selectList('shipment.getShipment',array('field'=>'id','status'=>'1'));
                $shipment_id = array('0');
                foreach($shipmentIds AS $key=>$val){
                    $shipment_id[] =$val->id;
                }
            }
            elseif($params->bidding_status == '1'){
                $shipment_param = ['field' => 't.shipment_id','status' => '1'];
            }
            elseif($params->bidding_status == '2'){
                $shipment_param = ['field' => 't.shipment_id','evaluation' => '1'];
            }
        }
        if($params->over_price != ''){
            $shipment_param = ['field' => 't.shipment_id','over_price' => $params->over_price];
        }
        if(!empty($shipment_param)){
            $shipment_id = array('0');
            $shipment_ids  =  $this->dao->selectList('tender.searchById_tender',$shipment_param);
            if(!empty($shipment_ids)){
                foreach($shipment_ids AS $key=>$val){
                    $shipment_id[] =$val->shipment_id;
                }
            }
        }
        if(!empty($shipment_id)){
            $params->shipment_id = $shipment_id;
        }

        $params->sortColumns = 's.create_time desc';
        $rt = $this->dao->selectPage('tender.getShipments', $params);

        if ($rt->totalCount > 0) {
            //处理数据
            foreach ($rt->result as $key => $value) {
                if ($value->business_type == 1) {
                    $rt->result[$key]->business_type = '省内';
                } else {
                    $rt->result[$key]->business_type = '省外';
                }
                if(strtotime($value->tender_limit) < time() && intval($value->tender_status) == 1){
                    $value->tender_limit_color = true;
                }
            }
        }
        return $rt;
    }


    /**
     * Desc: 获取运单状态
     * @Author sunjie
     */
    function checkTenderStatus($res){
        $fixer = fixer::input($res);
        $params = $fixer->getArray();
        $result=$this->dao->selectOne('tender.checkTenderStatus',array('id'=>$params['shipmentId']));
        if(isset($result->bidder_select) && $result->bidder_select!=""){
            $result->bidder_select = json_decode($result->bidder_select,true);
        }else{
            $result->bidder_select ="";
        }
        return $result;
    }

    /**
     * Desc: 批量获取运单状态
     * @Author sunjie
     */
    function checkTenderStatuies($res){
        $fixer = fixer::input($res);
        $params = $fixer->getArray();
        $result=$this->dao->selectList('tender.checkTenderStatus',array('shipment_ids'=>$params['shipmentId']));
        return $result;
    }

    /**
     * Desc: 保存招标信息
     * @Author sunjie
     */
    public function saveTender($res)
    {
        $fixer = fixer::input($res)->getArray();
        $bidder_select =array('carrier'=>0,"warehouse"=>0,"route"=>0,"history"=>0,"motorcade"=>0);
        if($fixer['tender_act']=='edit') {
            $result = $this->dao->selectOne('tender.checkTenderStatus', array('id' => $fixer['shipment_id']));
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
            $hasTender = $this->dao->selectOne('tender.searchById_tender', array('field' => 's.id','isSendTender'=>1,'shipment_id'=>$fixer['shipment_id']));
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
                $fixer['temperature_from'] = null;
                $fixer['temperature_to'] = null;
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

        if(strtotime($fixer['tender_limit']) - strtotime(date("Y-m-d H:i:s")) < 600){
            throw new RuntimeException('竞标截止时间应晚于当前时间至少十分钟', 2);
        }
        if(strtotime($fixer['package_time'])< strtotime($fixer['tender_limit'])){
            throw new RuntimeException('要求到场时间不能小于竞标截止时间', 2);
        }
        if($fixer['car_length1']< $fixer['car_length']){
            throw new RuntimeException('车长不符合要求', 2);
        }

        $not_in_openid = array();

        $bidder_select =array('carrier'=>$bidder_select['carrier']==1?1:intval($fixer['tender_push']['carrier']),"warehouse"=>$bidder_select['warehouse']==1?1:intval($fixer['tender_push']['warehouse']),
            "route"=>$bidder_select['route']==1?1:intval($fixer['tender_push']['route']),"history"=>$bidder_select['history']==1?1:intval($fixer['tender_push']['history']),"motorcade"=>!empty($fixer['tender_push']['motorcade'])?$fixer['tender_push']['motorcade']:'');
        if($fixer['tender_act']=='edit'){
            //写入改标记录
            $this->dao->insert('tender.insertTenderChangeHistory', [ 'shipment_id' => $fixer['shipment_id'],'tender_id' => $result->tender_id,'old_creat_time'=>$result->create_time,'old_tender_limit'=>$result->tender_limit, 'tender_limit' => $fixer['tender_limit']]);

            $this->dao->update('tender.updateTender', ['id' => $result->tender_id, 'status' => $result->tender_status, 'tender_limit' => $fixer['tender_limit'],'car_length' => $fixer['car_length'].','.$fixer['car_length1'],'carriage_type'=>$fixer['carriage_type'], 'package_time' => $fixer['package_time'], 'temperature_from'=>$fixer['temperature_from'], 'temperature_to'=>$fixer['temperature_to'], 'remark'=>$fixer['remark'], 'update_time' => date("Y-m-d H:i:s"), 'bidder_select' => json_encode($bidder_select)]);

            $tenderPushContent_old = $fixer['shipment_code'].'('.$fixer['fromlocation'].'-'.$fixer['tolocation'].')标的，已开标，因各位报价与市场价不相适应，请各位重新报价。';
            $tenderPushContent_new = '你收到一条车车招标信息，请尽快查看！';
            //查询已发送用户的数据
            $sendTenderResult = $this->dao->selectOne('tender.getSendTenderOpenid',array('id'=>$result->tender_id));
            if(isset($sendTenderResult->stringphone) && $sendTenderResult->stringphone!=""){
                $not_in_phone = explode(",",$sendTenderResult->stringphone);
            }
            //$this->dao->update('tender.updateAllTenderPush',['tender_id'=>$result->tender_id,'status'=>1,'push_time'=>'','push_lengh'=>0,'push_error'=>'','is_read'=>0,'read_time'=>"",'content'=>$tenderPushContent]);
            $tenderResult['id'] = $result->tender_id;

        }else{
            //写入tender
            $tenderResult =$this->dao->insert('tender.saveTender',[
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
        $this->dao->update('tender.updateStatus',['id'=>$fixer['shipment_id'],'status'=>'2','dispatch_count'=>'0']);
        //获取基地信息
        $warehouse = $this->dao->selectOne('warehouse.getByOrgcode', array('orgcode' => $this->app->user->organ->orgcode));
        //承运商
        $truck_source_id_array = array();
        $tenderPushCarrier = array();
        $tenderPushTruck = array();

        if($fixer['tender_push']['carrier'] ==1){
            $relation_phone_array = array();
            $carrier = $this->dao->selectList('carrier.selectPage',['warehouse_id'=>$warehouse->id,'trans_type'=>$fixer['trans_type'],'cooperate_type_tender'=>'1','check_status'=>'1']);
            foreach($carrier AS $key=>$val){
                $relation_phone_array[]=$val->relation_phone;
            }
          //  $relation_phone_array = array_unique($relation_phone_array);
            if(!empty($relation_phone_array)){
                $tenderPushCarrier = $this->dao->selectList('tender.selectTenderCarrier',['relation_phone'=>$relation_phone_array]);
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
            $routeTruck = $this->dao->selectList('tender.selectRouteTruck', ['from_province'=>$fixer['from_province'] ,'from_city'=>$fixer['from_city'],'to_province'=>$fixer['to_province'],'to_city'=>$fixer['to_city'] ]);
            foreach($routeTruck AS $key=>$val){
                $truck_source_id_array[]=$val->truck_source_id;
            }
        }
        //历史承运车辆
        if($fixer['tender_push']['history'] ==1){
            $historyTruck = $this->dao->selectList('tender.selectHistoryTruck', ['from_province'=>$fixer['from_province'] ,'from_city'=>$fixer['from_city'],'to_province'=>$fixer['to_province'],'to_city'=>$fixer['to_city'] ]);
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
            $tenderPushTruck = $this->dao->selectList('tender.selectTenderTruck',['truck_source_id'=>$truck_source_id_array ,'carriage_type'=>$fixer['carriage_type'],'car_length'=>$fixer['car_length'],'car_length1'=>$fixer['car_length1'] ]);
            foreach($tenderPushTruck AS $key=>$val){
                $val->to_type = 2;
            }
        }


        //推送消息入库
        $tenderPush =array_merge($tenderPushCarrier,$tenderPushTruck);
        if(!empty($tenderPush)){
            $content = '你收到一条车车招标信息，请尽快查看！';
            foreach($tenderPush AS $key=>$val){
                if(!empty($not_in_phone)){
                    if(in_array($val->user_phone,$not_in_phone)){
                        $content =$tenderPushContent_old;
                    }
                    else{
                        $content =$tenderPushContent_new;
                    }
                }
                if(empty($val->openid)){
                    $status = '2';
                }
                else{
                    $status = '1';
                }
                $this->dao->insert('tender.saveTenderPush', [
                    'tender_id' => $tenderResult['id'],
                    'from_user' => $warehouse->name,
                    'to_type' => $val->to_type,
                    'relation_id' => $val->user_id,
                    'phone' => $val->user_phone,
                    'to_name' => $val->to_name,
                    'openid' => $val->openid,
                    'status' => $status,
                    'type' => '1',
                    'content'=>$content,
                    'create_time' => date("Y-m-d H:i:s")
                ]);
            }
        }
        return  array('status'=>'0','message'=>$fixer['tender_act']=='edit'?'改标成功':'发标成功');
    }



    /**
     * Desc: 批量保存招标信息
     * @Author sunjie
     */
    public function saveTenders($res)
    {
        $fixer = fixer::input($res)->getArray();
        $bidder_select =array('carrier'=>0,"warehouse"=>0,"route"=>0,"history"=>0,"motorcade"=>0);
        $shipment_ids = explode(',',$fixer['shipment_ids']);
        $shipment_codes = explode(',',$fixer['shipment_codes']);
        $trans_types = explode(',',$fixer['trans_types']);

        $hasTender = $this->dao->selectList('tender.searchById_tender', array('field' => 's.id','isSendTender'=>1,'shipment_ids'=>$shipment_ids));
        if(!empty($hasTender)){
            throw new RuntimeException('此运单已发标', 2);
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

        if(strtotime($fixer['tender_limit']) - strtotime(date("Y-m-d H:i:s")) < 600){
            throw new RuntimeException('竞标截止时间应晚于当前时间至少十分钟', 2);
        }
        if(strtotime($fixer['package_time'])< strtotime($fixer['tender_limit'])){
            throw new RuntimeException('要求到场时间不能小于竞标截止时间', 2);
        }
        if($fixer['car_length1']< $fixer['car_length']){
            throw new RuntimeException('车长不符合要求', 2);
        }

        $bidder_select =array('carrier'=>$bidder_select['carrier']==1?1:intval($fixer['tender_push']['carrier']),"warehouse"=>$bidder_select['warehouse']==1?1:intval($fixer['tender_push']['warehouse']),
            "route"=>$bidder_select['route']==1?1:intval($fixer['tender_push']['route']),"history"=>$bidder_select['history']==1?1:intval($fixer['tender_push']['history']),"motorcade"=>!empty($fixer['tender_push']['motorcade'])?$fixer['tender_push']['motorcade']:'');

            foreach($shipment_ids AS $key=>$val){
            //写入tender
            $tenderResult[] =$this->dao->insert('tender.saveTender',[
                'shipment_id'=>$shipment_ids[$key],
                'shipment_code'=>$shipment_codes[$key],
                'trans_type'=>$trans_types[$key],
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

        foreach($shipment_ids AS $key=>$val) {
            //修改运单状态为竞标中
            $this->dao->update('tender.updateStatus', ['id' => $shipment_ids[$key], 'status' => '2','dispatch_count'=>'0']);
        }
        //获取基地信息
        $warehouse = $this->dao->selectOne('warehouse.getByOrgcode', array('orgcode' => $this->app->user->organ->orgcode));
        //承运商
        $truck_source_id_array = array();
        $tenderPushCarrier = array();
        $tenderPushTruck = array();
        foreach($tenderResult AS $key1=>$val1){
            if($fixer['tender_push']['carrier'] ==1){
                $relation_phone_array = array();
                $carrier = $this->dao->selectList('carrier.selectPage',['warehouse_id'=>$warehouse->id,'trans_type_cw'=>$trans_types[$key1],'cooperate_type_tender_cw'=>'1','check_status'=>'1']);
                foreach($carrier AS $key=>$val){
                    $relation_phone_array[]=$val->relation_phone;
                }
                if(!empty($relation_phone_array)){
                    $tenderPushCarrier = $this->dao->selectList('tender.selectTenderCarrier',['relation_phone'=>$relation_phone_array]);
                    foreach($tenderPushCarrier AS $key=>$val){
                        $val->to_type = 1;
                    }
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
                $tenderPushTruck = $this->dao->selectList('tender.selectTenderTruck',['truck_source_id'=>$truck_source_id_array ,'carriage_type'=>$fixer['carriage_type'],'car_length'=>$fixer['car_length'],'car_length1'=>$fixer['car_length1'] ]);
                foreach($tenderPushTruck AS $key=>$val){
                    $val->to_type = 2;
                }
            }

            //推送消息入库
            $tenderPush =array_merge($tenderPushCarrier,$tenderPushTruck);
            if(!empty($tenderPush)){
                    foreach($tenderPush AS $key=>$val){
                        if(empty($val->openid)){
                            $status = '2';
                        }
                        else{
                            $status = '1';
                        }
                        $this->dao->insert('tender.saveTenderPush', [
                            'tender_id' => $tenderResult[$key1]['id'],
                            'from_user' => $warehouse->name,
                            'to_type' => $val->to_type,
                            'relation_id' => $val->user_id,
                            'phone' => $val->user_phone,
                            'to_name' => $val->to_name,
                            'openid' => $val->openid,
                            'status' => $status,
                            'type' => '1',
                            'content'=>'你收到一条车车招标信息，请尽快查看！',
                            'create_time' => date("Y-m-d H:i:s")
                        ]);
                    }
            }
        }
        return  array('status'=>'0','message'=>$fixer['tender_act']=='edit'?'改标成功':'发标成功');
    }

    /**
     * 获取发标的对应承运商信息
     * Author sunjie
     * 2016-11-17
     */
    function  searchTenderCarrier($res){
        $fixer = fixer::input($res)->getArray();
        //获取基地信息
        $warehouse = $this->dao->selectOne('warehouse.getByOrgcode', array('orgcode' => $this->app->user->organ->orgcode));
        $relation_phone_array = array();
        $carrier = $this->dao->selectList('carrier.selectPage',['warehouse_id'=>$warehouse->id,'trans_type_cw'=>$fixer['trans_type'],'cooperate_type_tender_cw'=>'1','check_status'=>'1']);
        return $carrier;
        foreach($carrier AS $key=>$val){
            $relation_phone_array[]=$val->relation_phone;
        }
        if(!empty($relation_phone_array)){
            $tenderPushCarrier = $this->dao->selectList('tender.selectTenderCarrier',['relation_phone'=>$relation_phone_array]);
            return $carrier;
        }
    }

    /**
     * Desc: 获取招标的报价列表 评标列表
     * @Author sunjie
     */
    function tenderQuoteList($res){
        $fixer = fixer::input($res);
        $params = $fixer->getArray();
        $price = '';
        $AuditId=$this->dao->selectOne('tender.selectAuditId',array('orgcode'=>$this->app->user->organ->orgcode));
        if($AuditId->tender_type == '1'){
            $result = $this->dao->selectList('tender.tenderQuoteListFirst',array('id'=>$params['shipmentId'],'tender_id'=>$params['tender_id']));
        }else{
            $result = $this->dao->selectList('tender.tenderQuoteList',array('id'=>$params['shipmentId'],'tender_id'=>$params['tender_id']));
        }
        if(!empty($result)){
            $paramArr = [];
            $paramArr["from_location"]=$result[0]->from_location;
            $paramArr['to_location']=$result[0]->to_location;
            $paramArr['shipment_method']=$result[0]->shipment_method;
            $paramArr['density']=$result[0]->density;
//            $paramArr['carriage_type']=$result[0]->carriage_type;
            if(empty($result[0]->carriage_type)){
                $paramArr['carriage_type_no']= '无要求' ;
            }else{
                $paramArr['carriage_type']=$result[0]->carriage_type;
            }
            //$routePrice=$this->dao->selectOne('tender.getRoutePrice',array('from_location'=>$from_location,'to_location'=>$to_location));
            $routePrice=$this->dao->selectOne('tender.getRoutePrice',$paramArr);
            if($routePrice){
                $result[0]->routePrice=$routePrice->price;
            }else{
               $result[0]->routePrice='';
            }
            $result[0]->tender_limit = strtotime($result[0]->tender_limit);
            $from_location = $result[0]->from_location;
            $to_location= $result[0]->to_location;
            $lastMonth=date('Y-m',strtotime('-1 month'));
            $lastYear=date('Y-m',strtotime('-1 year'));
            $lastQuote=$this->dao->selectOne('tender.getLastQuote',array('fromlocation'=>$from_location,'tolocation'=>$to_location,'lastdate'=>$lastMonth));
            $lastYearQuote=$this->dao->selectOne('tender.getLastQuote',array('fromlocation'=>$from_location,'tolocation'=>$to_location,'lastyear'=>$lastYear));
            if($lastQuote){
                $result[0]->lastQuote=$lastQuote->quote_price;
            }else{
               $result[0]->lastQuote='';
            }
            if($lastYearQuote){
                $result[0]->lastYearQuote=$lastYearQuote->quote_price;
            }else{
               $result[0]->lastYearQuote='';
            }
            $result[0]->now = time();

        }
        if(isset($result[0]->history)){
            $result[0]->history = str_replace('\n','<br>',$result[0]->history);
            $result[0]->history = json_decode($result[0]->history);
        }
        /*在后面拼接 发送审批人名称*/
        if($result){
            $AuditId=$this->dao->selectOne('tender.selectAuditId',array('orgcode'=>$this->app->user->organ->orgcode));
            $second_audit_id = $this->dao->selectOne('tender.getauditName',array('id'=>$AuditId->second_audit_id));
            $first_audit_id = $this->dao->selectOne('tender.getauditName',array('id'=>$AuditId->first_audit_id));
            foreach ($result as $ket=>$value){
                $value->price = $routePrice->price;
                $value->over_rate = $routePrice->over_rate;
               $operating_type = 1;
                //超标价格
               $exceeding = ($value->price)*(1+($value->over_rate)*0.01);
                if($value->s_weight){
                    if($value->price_type == '1'){
                        $value->quote_price_per = $value->quote_price / $value->s_weight;
                    }else{
                        $value->quote_price_per = $value->quote_price;
                    }
                }else{
                    throw new RuntimeException('运单重量数据不完整', 2);
                }
                if(floatval($value->quote_price_per) > $exceeding && $value->price){
                    $value->auditUser =$first_audit_id->name.'->'.$second_audit_id->name;

                }else{
                   $value->auditUser =$first_audit_id->name;
                }
            }
        }
        return $result;
    }


    /**
     * Desc: 改变投标状态 评标
     * @Author sunjie
     */
    function changeTenderQuote($res){
        $fixer = fixer::input($res);
        $params = $fixer->getArray();
        //var_dump($params);exit;

        $tenderQuote =$this->dao->selectOne('tender.selectTenderQuote',array('id'=>$params['quote_id']));
        $history =  $this->dao->selectOne('tender.searchById_tender',['field'=>'t.history','id'=>$params['tender_id']]);
        $history = json_decode($history->history,true);

        if($tenderQuote->status == '1'){
            $status = array('2','3','4');
            //判断所有的出价合法条件
            $result=$this->dao->selectOne('tender.selectTenderQuote',array('tender_id'=>$params['tender_id'],'status'=>$status));
            if(!empty($result)){
                return array('code'=>'1','message'=>'请先取消中标的报价！');
            }
        }

        //中标
        if($tenderQuote->status == '2'){
            return array('code'=>'1','message'=>'审批人正在审核！');
        }

        //取消中标
        if($tenderQuote->status== '3' && $params['responsible_party'] != ''){
            $changeStatus = '1';
            $history[] = ['time'=>date('Y-m-d H:i:s',time()),"retify_name"=>$this->app->user->realname,'action'=>'取消'.$params['quote_type_name'].'中标'];
            $this->dao->update('tender.updateTender',['id'=>$params['tender_id'],'status'=>$changeStatus,'quote_id'=>$params['quote_id'],'over_price'=>$params['operating_type'],'update_time'=> date('Y-m-d H:i:s',time()),'history'=>json_encode($history),'audit_level'=>'0']);
            $this->dao->update('tender.updateShipment',['id'=>$params['shipment_id'],'carrier_id'=>'','dispatch_count_clear'=>'1','status'=>'2']);
            $this->cancelShipmentCarriage($params['shipment_id']);
            //删除逾期提醒
            $redis = redisCache("sendwechatoverdue");
            $redis = json_decode($redis,true);
            unset($redis[$params['shipment_code']]);
            redisCache("sendwechatoverdue",$redis);

            //写入取消中标记录表
            $Tender_cancel_history = $this->dao->insert('tender.insertTender_cancel_history',['shipment_id'=>$params['shipment_id'],'tender_quote_id'=>$params['quote_id'],'tender_id'=>$params['tender_id'],'responsible_party'=>$params['responsible_party'],'remark'=> $params['cancel_remark'],'create_time'=> date('Y-m-d H:i:s',time())]);

            //发送模板消息
            $getQuote = $this->dao->selectOne('tender.getQuoteByIdList',array("tender_id"=>$params['tender_id'],'quote_id'=>$params['quote_id']));
            $openidOrname =  $this->getOpenidById(array("quote_type"=>$getQuote->quote_type,"relation_id"=>$getQuote->relation_id));

            if($getQuote->quote_type == 2){ //司机
                $carrier = $this->dao->selectOne('carrier.carrierCheck',array("orgcode"=>$this->app->user->organ->orgcode));
                $openidOrname =    $this->dao->selectOne('tender.searchByOpenId',array('left_where'=>'where phone='.$carrier->relation_phone));
                $sendName = $carrier->carrier_name;
            }elseif($getQuote->quote_type == 1){ //承运商
                $sendName = $openidOrname->carrier_name;
            }

            $warehouse=$this->dao->selectOne('warehouse.selectPage',array('orgcode'=>$this->app->user->organ->orgcode));
            $Tender_cancel_history_info = $this->dao->selectOne('tender.getTender_cancel_history',array("id"=>$Tender_cancel_history['id']));

            if($Tender_cancel_history_info->responsible_party == '1'){
                $content = $params['from_location'].'-'.$params['to_location'].'标的，因我方原因，致使该标的不能履约，将按双方合同约定处理。若有疑问请拔打：'. $warehouse->phone;;
            }
            else{
                $content = $params['from_location'].'-'.$params['to_location'].'标的，因你方原因，致使该标的不能履约，将按双方合同约定处理，同时系统将记录你方违约信息1次。若有疑问请拔打：'. $warehouse->phone;
            }

            $wechatMessage = array(
               // 'url' => $_SERVER['HTTP_HOST'].'/wechat/tenderConfirm.html?openid='.$openidOrname->openid.'&tender_id='.$params['tender_id'].'&tender_quote_id='.$params['quote_id'],
                'openid'=>$openidOrname->openid,
                'first'=>array('value'=>$content,'color'=>'#000000'),
                'keyword1'=>array('value'=>$params['from_location'].'-'.$params['to_location'],'color'=>'#000000'),
                'keyword2'=>array('value'=>$sendName,'color'=>'#000000'),
                'keyword3'=>array('value'=>$Tender_cancel_history_info->remark,'color'=>'#000000'),
                'remark'=>array('value'=>'详情','color'=>'#000000')//备注
            );
              $this->loadService('wechat')->sendTempMessage('approve_notice', $wechatMessage, 'shipment');
            if($params['operating_type'] == '1'){
                $result = array('code'=>'0','operating_type'=>'1','message'=>array('quote_id'=>$params['quote_id'],'operating'=>'预中标上报','status'=>'','history'=>end($history)));
            }
            else{
                $result = array('code'=>'0','message'=>array('quote_id'=>$params['quote_id'],'operating'=>'置为中标','status'=>'','history'=>end($history)));
            }
        }
        //预中标
        if($params['operating_type'] == '1' && $tenderQuote->status == '1'){
            $changeStatus = '2';
            $history_action = '设置'.$params['quote_type_name'].'预中标'."\n".$params['plan_remark'];
            $history[] = ['time'=>date('Y-m-d H:i:s',time()),"retify_name"=>$this->app->user->realname,'action'=>$history_action];

            //判断审批级别
            $AuditId=$this->dao->selectOne('tender.selectAuditId',array('orgcode'=>$this->app->user->organ->orgcode));
            $second_audit_id = $this->dao->selectOne('tender.getauditName',array('id'=>$AuditId->second_audit_id));
            $first_audit_id = $this->dao->selectOne('tender.getauditName',array('id'=>$AuditId->first_audit_id));

            if($params['auditType'] == '1' || $params['auditType'] == '3'){
               // $warehouse_user_id = $AuditId->first_audit_id;
                $audit_level = '1';
                $operating =  '上报中('.$first_audit_id->name.')';
            }else{
             //  $warehouse_user_id = $AuditId->second_audit_id;
                $audit_level = '2';
                $operating ='上报中('.$first_audit_id->name.'->'.$second_audit_id->name.')';

            }
            //预中标全部先给一级审批人通知
            $warehouse_user_id = $AuditId->first_audit_id;
            $this->dao->update('tender.updateTender',['id'=>$params['tender_id'],'status'=>$changeStatus,'quote_id'=>$params['quote_id'],'over_price'=>$params['operating_type'],'update_time'=> date('Y-m-d H:i:s',time()),'history'=>json_encode($history),'audit_level'=>$audit_level]);


            if(empty($warehouse_user_id)){
                $result = array('code'=>'1','message'=>'暂无审批人，请联系总部添加');
                return $result;
            }
            $auditPush = $this->dao->selectOne('tender.getAuditUser',array('id'=>$warehouse_user_id));
            if(empty($auditPush)){
               $result = array('code'=>'1','message'=>'无法获得审批人微信信息，请提醒审批人登录微信公众号');
                return $result;
            }
            //写入审批表
            $tenderAuditResult=$this->dao->insert('tender.insertTenderAudit',array('tender_id'=>$params['tender_id'],'quote_id'=>$params['quote_id'],'quote_price'=>$params['quote_price'],'warehouse_user_id'=>$warehouse_user_id,'submitter'=>$this->app->user->realname,'plan_remark'=>$params['plan_remark'],'create_time'=> date('Y-m-d H:i:s',time())));
            //给审核人推送消息
//			$auditPush=$this->dao->selectOne('warehouse.getWarehouseUser',array('id'=>$warehouse_user_id));
            $fix = array(
                'openid'=>$auditPush->openid,
                'url'=>$_SERVER['HTTP_HOST'].'/wechat/retify.html?tender_id='.$params[tender_id].'&quote_id='.$params[quote_id].'&openid='.$auditPush->openid.'&tender_audit_id='.$tenderAuditResult[id].'&realname='.$this->app->user->realname.'&show=yes',
                'keyword1'=>array('value'=>$this->app->user->realname,'color'=>'#000000'),
                'keyword2'=>array('value'=>date('Y-m-d H:i:s',time()),'color'=>'#000000'),
                'keyword3'=>array('value'=>$params['from_location'].'-'.$params['to_location'],'color'=>'#000000'),
                'remark'=>array('value'=>$params['plan_remark'],'color'=>'#000000'),
            );
            $this->loadService('wechat')->sendTempMessage('tenderAudit',$fix,'consign');

            $result = array('code'=>'0','message'=>array('quote_id'=>$params['quote_id'],'operating'=>$operating,'status'=>'上报中','history'=>end($history)));
        }
        //中标
        if($params['operating_type'] == '0' && $tenderQuote->status == '1'){
            $changeStatus = '3';
            $history_action = '设置'.$params['quote_type_name'].'中标'."\n".$params['bidding_remark'];
            $history[] = ['time'=>date('Y-m-d H:i:s',time()),"retify_name"=>$this->app->user->realname,'action'=>$history_action];
            $this->dao->update('tender.updateTender',['id'=>$params['tender_id'],'status'=>$changeStatus,'quote_id'=>$params['quote_id'],'over_price'=>$params['operating_type'],'update_time'=> date('Y-m-d H:i:s',time()),'bid_time'=> date('Y-m-d H:i:s',time()),'history'=>json_encode($history),'audit_level'=>'0']);

            $this->dao->update('tender.updateShipment',['id'=>$params['shipment_id'],'status'=>$changeStatus,'ship_type'=>'1','price'=>$tenderQuote->tallage_price,'carrier_id'=>$tenderQuote->quote_carrier]);
            $this->dao->update('tender.update_tender_quote',['id'=>$params['quote_id'],'status'=>$changeStatus]);
            //发送模板消息
            $this->loadService('tender')->SendTenderAgree(array('tender_id'=>$params['tender_id'],'tender_name'=>$params['from_location'].'-'.$params['to_location']));
            //逾期提醒缓存写入
            $this->loadService('tender')->addRedisByPackage(["shipment_code"=>$params['shipment_code'],"tender_id"=>$params['tender_id']]);
            $result = array('code'=>'0','message'=>array('quote_id'=>$params['quote_id'],'operating'=>'取消中标','status'=>'中标','history'=>end($history)));
        }

        if(!empty($changeStatus)){
            //修改出价状态
            $this->dao->update('tender.updateTenderQuote',['id'=>$params['quote_id'],'status'=>$changeStatus]);
        }


        return $result;

    }

    /**
     * Desc:取消运单的承运信息
     * @param $shipmentId
     * @Author Lvison
     */
    public function cancelShipmentCarriage($shipmentId){
        if(!empty($shipmentId))
            $this->dao->update('shipment.cancelShipmentCarriage',array('shipment_id'=>$shipmentId));
    }

    //查找我的投标列表页面
    public function search_wechat ($fixer)
    {
        $params = fixer::input($fixer)->get();
        $res = $this->dao->selectPage('tender.search_wechat',$params);
        foreach ($res->result as $key=>$value){
           $value->tender_name = $value->fromlocation.'-'.$value->tolocation;
            $value->create_time  = date("m-d H:i",strtotime($value->create_time));
        }
        return $res;
    }

    public function searchEchart_count($fixer)
    {
        $params = fixer::input($fixer)->get();
        //查询联系人的用openid转换为id
        if($params->openid && $params->openid){
            if($params->user_type == 3){
            $params->carnum = $this->getIdByopenid_driver_carrier($params)->carnum;
            $params->relation_id = $this->getIdByopenid_driver_carrier($params)->id;
            }elseif($params->user_type == 4){
            $params->relation_id = $this->getIdByopenid_driver_carrier($params);
            }
            $res = array();
            $params->field = "*";
            $params->form_name = "tender_push as tp ";
            $params->condition = "tp.openid= #openid# AND tp.status = 3";
            $result1= $this->dao->selectOne('tender.searchEchart_count',$params);
            if($result1->count >= 0){
                $res["tender_all"] = $result1->count;
            }
            //总共推过来的标
            $result2= $this->dao->selectOne('tender.searchEchart_count_quote',array("relation_id"=>$params->relation_id));
            if($result2->count >= 0){
                $res["tender"] = $result2->tender;
                $res["tenderOk"] = $result2->tenderOk;
                $res["relation_id"] = $params->relation_id;
            }
        }
        return $res;
    }
   //获取司机或承运商id  params  user_type,phone
    public function getIdByopenid_driver_carrier($fixer)
    {
        $params = fixer::input($fixer)->get();
        $form_name = ($params->user_type == 3 )? "truck_source" : "carrier";
        $condition = ($params->user_type == 3 )? " driver_phone = #phone# " : "relation_phone = #phone#";
        $params->field = $params->user_type == 3?"id,carnum":"id";
        $params->form_name = $form_name;
        $params->condition = $condition;
         if($params->user_type == 3)
        {
           $res =  $params->relation_id = $this->dao->selectOne('tender.selectById',$params);
            return $res;
        }elseif($params->user_type == 4){
             return  $params->relation_id = $this->dao->selectOne('tender.selectById',$params)->id;
         }
    }

    /**
     * Desc:投标详细列表 by tender_id
     * @param $fixer
     * @Author Lvison
     * @return null
     */
    public function getTenderById($fixer)
    {
        $params = fixer::input($fixer)->get();
        $res = $this->dao->selectOne('tender.getTenderById', $params);
        $res->tender_name = $res->from_city . '-' . $res->to_city;
        $res->temperature = ($res->temperature_from && $res->temperature_to) ? $res->temperature_from . '-' . $res->temperature_to : '';
        $res->car_length = str_replace(",", "-", $res->car_length);
        if ($params->user_type == 3) {
            $carnum_id = $this->getIdByopenid_driver_carrier($params);
            $res->truck_id = $carnum_id->id;
            $res->carnum = $carnum_id->carnum;
            //查出司机车牌号和默认结算承运商
        } elseif ($params->user_type == 4) {
            $res->carrier_id = $this->getIdByopenid_driver_carrier($params);
        }
        if ($res->carriage_type) {
            $carType = $this->dao->selectOne('truck_source.getBycarriageType', array("carriage_type" => $res->carriage_type));
            $res->carriage_type = $carType->name;
            if ($res->carrige_type != '冷藏' && $res->carrige != '冷冻') {
                $res->temperature = '';
            }
      }
      //查看订单详情
      $order_detail = $this->dao->selectList('shipment.getOrderDetail',array("field"=>"od.product_name,od.unit_name,od.quality,od.specification,od.serial","shipment_id"=>$res->shipment_id));
      $res->order_detail = $order_detail;
      /*查询订单详情*/

      $orderRoute=$this->dao->selectList('tender.getOrderRoute',array('shipment_id'=>$res->shipment_id));
      if($orderRoute){
          $i=1;
          foreach($orderRoute as $key=>$val){
              $orderRoute[$key]->num=$i++;
              $orderRoute[$key]->weight=($val->weight);
              $orderRoute[$key]->volume=($val->volume);
          }
          $res->orderRoute=$orderRoute;
      }else{
          $res->orderRoute=array();
      }

        if ($res->package_time) {
            $res->package_time = date('m-d H:i', strtotime($res->package_time));
        }
        return $res;
    }

    /**
     * Desc:中标定车
     * @param $args
     * @Author Lvison
     * @return array
     */
    public function confirmOk($args)
    {
        $params = fixer::input($args)->get();
        $params->status = 4;
        //判断重复派车5次
        $shipment_info = $this->dao->selectOne('shipment.getShipmentId',array('shipment_id'=>$params->shipmentid));
        $truck_id= $this->dao->selectOne('tender.driverId',array('phone'=>$params->driver_phone));
        $carrier_code= $this->dao->selectOne('tender.getCarrierCode',array('openid'=>$params->openid));
        if($shipment_info->dispatch_count >= '10' ){
            return array('code'=>1,'message'=>'已超过订车次数');
            return false;
        }
        if($shipment_info->status==6){
            $this->dao->update('shipment.updateShipment',array('id'=>$params->shipmentid,'driver_name'=>$params->driver_name,'driver_phone'=>$params->driver_phone,'carnum'=>$params->carnum,'dispatch_count'=>$shipment_info->dispatch_count));
            return array('code'=>'0','message'=>'指定成功');
        }
        //判断参数 获取默认承运商ID
        if ($params->tender_quote_id) {
            $default_carrier_id = $this->dao->selectOne('tender.getQuoteById', array("filed" => "quote_carrier", "tender_quote_id" => $params->tender_quote_id));
            $params->carrier_id = $default_carrier_id->quote_carrier;
        };
        if (empty($params->shipmentid)) {
            return array('code' => 1, 'message' => '运单不能为空');
        } else if (empty($params->tender_quote_id)) {
            return array('code' => 1, 'message' => '报价id不能为空');
        } else if (empty($params->openid)) {
            return array('code' => 1, 'message' => '承运商openid不能为空');
        } else {
            if(intval($params->userType) == 3){
                $driver = $this->dao->selectOne('tender.getDriverBuQuote',array('tender_quote_id'=>$params->tender_quote_id));
                $params->truck_source_id = $driver->id;
                $params->driver_name = $driver->driver_name;
                $params->driver_phone = $driver->driver_phone;
                $params->id_card = $driver->id_card;
            }else if(intval($params->userType) == 4){
                $this->dao->update('tender.updateTruckSource',$params);
                $driverId = $this->dao->selectOne('tender.driverId',array('phone'=>$params->driver_phone));
                $params->truck_source_id = $driverId->id;
            }
            $params->dispatch_count = $shipment_info->dispatch_count;
            //保存数据
            $params->dispatch_time = date('Y-m-d H:i:s');
            $params->id=$params->shipmentid;
             $this->dao->update('shipment.updateShipment', $params);
            //验证定位合法性
            $lastLbs = $this->dao->selectOne('car_plant.lbs_history', array('truck_source_id' =>$truck_id->id));
            //lbs定位
            if($shipment_info->shipment_method == '整车' || $shipment_info->shipment_method == '整车运输'){
                $data = array('carrier_id'=>$shipment_info->carrier_id,'type'=>'1','truck_source_id'=>$truck_id->id,'carnum'=>$params->carnum,'phone'=>$params->driver_phone);
                $lbs_return =  $this->loadService('history')->lbsSendLocation_NoRedis($data);
                if($lbs_return['code'] == '0'){
                    //写入定位历史表
                    $is_carrier = empty($carrier_code)?'1':'2';
                    $this->dao->insert('car_plant.save_lbs_history', array('truck_source_id' => $truck_id->id,'type'=>'3','user_type'=>'2','orgcode'=>$carrier_code->g7s_orgcode,'shipment_id'=>$params->shipmentid,'address'=>$lbs_return['msg']));

                    return array('code'=>'0','message'=>'定位成功，当前位置：'.$lbs_return['msg']);
                }
                else{
                    //验证司机手机号是否注册LBS
                    $lbs_res = $this->loadService('client')->checkLbsRegister($params->driver_phone);
                    $this->dao->update('tender.updateTruckSource',array('driver_phone'=>$params->driver_phone,'carnum'=>$params->carnum,'lbs_register'=>$lbs_res));
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



    }
    /**
     * 加入缓存，发送成功短信
     * Author will
     * 2016-9-22
     */
    public  function addRedis_sendMsg($args){
        $params = fixer::input($args)->get();
        $this->addRedisByPackage(array("shipment_code"=>$params->shipment_code,"tender_id"=>$params->tender_id));
        $this->sendTempMessageLoading(array('shipment_id' => $params->shipmentid, 'plat_form_code' => $params->plat_form_code, 'tender_quote_id' => $params->tender_quote_id, 'tender_id' => $params->tender_id, 'driver_phone' => $params->driver_phone));
    }
    /**
     * 获取竞标列表
     * Author Ivan
     * 2016-9-22
     */
    public  function validateOpneid($fixer){
        $params = fixer::input($fixer)->get();
        return $this->dao->selectOne('tender.searchByOpenId',array('left_where'=>'where openid=#openid#','openid'=>$params->openid));
    }

    /**
     * Desc:装货提醒
     * @param $args
     * @Author ivan
     * @return array
     */
    public function sendTempMessageLoading($args)
    {
        /*通过车牌号查询openid*/
        $params = fixer::input($args)->get();
        $getLoadingInfo = $this->dao->selectOne('tender.getLoadingInfo', $params);
        $getOpenidByPhone = $this->dao->selectOne('tender.getOpenidByPhone', array('driver_phone' => $params->driver_phone));
        /*获取基地信息*/
        $getWarehouseinfo =  $this->dao->selectOne('order.getWarehouseinfo', array("plat_form_code"=>$params->plat_form_code));
        $fixer = array(
            'openid' => $getOpenidByPhone->openid,
            'url'=>$this->config->webHost.'/wechat/pickUpInfo.html?shipment_code='.$getLoadingInfo->shipment_code.'&openid='.$getOpenidByPhone->openid,
            'first'=>array('value'=>'您有一条提货单('.$getLoadingInfo->shipment_code.'),请注意查看','color'=>'#000000'),
            'keyword1'=>array('value'=>$getLoadingInfo->fromlocation."-".$getLoadingInfo->tolocation,'color'=>'#000000'), //货运线路
            'keyword2'=>array('value'=>$getLoadingInfo->package_time,'color'=>'#000000'),//提货点
            'remark'=>array('value'=>"\n装车地址：".$getWarehouseinfo->address."\n有疑问请致电  ".$getLoadingInfo->carrier_name."(".$getLoadingInfo->relation_phone."),或者联系".$getWarehouseinfo->name."(".$getWarehouseinfo->phone.")",'color'=>'#000000')//备注
        );
        /*推送短信消息 给司机*/
        $packageTime = empty($getLoadingInfo->package_time) ? date('Y-m-d') : date('m-d H:i', strtotime($getLoadingInfo->package_time));
        $msg_content = sprintf($this->config->messageModel->smsConfirm, $getLoadingInfo->carrier_name_s,$packageTime ,$getWarehouseinfo->name );
        $sendSms = $this->loadService('client')->sendSms($msg_content, $getOpenidByPhone->phone);
        if ($sendSms['code'] != 1) {
            return array('code' => 1, 'message' => $sendSms['message']);
        }
        if (!empty($fixer['openid'])) {
            $data = $this->loadService('weChat')->sendTempMessage('shipment_overdue', $fixer, 'shipment');
        }
        return $data["errmsg"];
    }



    /**
     * Desc:承运商订车装货提醒-非中标订车
     * @param $args
     * @Author sunjie
     * @return array
     */
    public function carrierAssignCarWechatMessage($args)
    {
        /*通过车牌号查询openid*/
        $params = fixer::input($args)->get();
        $shipmentInfo = $this->dao->selectOne('shipment.getShipmentId', array('shipment_id' => $params->shipment_id));
        $carrier_info = $this->dao->selectOne('order.getBycarrierId', array('id' => $shipmentInfo->carrier_id));
        $getOpenidByPhone = $this->dao->selectOne('tender.getOpenidByPhone', array('driver_phone' => $params->driver_phone));
        /*获取基地信息*/
        $getWarehouseinfo =  $this->dao->selectOne('order.getWarehouseinfo', array("plat_form_code"=>$shipmentInfo->plat_form_code));
        $fixer = array(
            'openid' => $getOpenidByPhone->openid,
            'url'=>$this->config->webHost.'/wechat/pickUpInfo.html?shipment_code='.$shipmentInfo->shipment_code.'&openid='.$getOpenidByPhone->openid,
            'first'=>array('value'=>'您有一条提货单('.$shipmentInfo->shipment_code.'),请注意查看','color'=>'#000000'),
            'keyword1'=>array('value'=>"$shipmentInfo->fromlocation-$shipmentInfo->tolocation",'color'=>'#000000'), //货运线路
            'keyword2'=>array('value'=>date('Y-m-d',time()),'color'=>'#000000'),//提货点
            'remark'=>array('value'=>"\n装车地址：".$getWarehouseinfo->address."\n有疑问请致电  ".$carrier_info->carrier_name."(".$carrier_info->relation_phone."),或者联系".$getWarehouseinfo->name."(".$getWarehouseinfo->phone.")",'color'=>'#000000')//备注
        );
        /*推送短信消息 给司机*/
        $packageTime = date('Y-m-d');
        $_order = $this->dao->selectOne('order.getOrderByShpID', $params);
        $msg_content = sprintf($this->config->messageModel->smsConfirm, $carrier_info->carrier_name_s,$packageTime ,$_order->from_name );
        $sendSms = $this->loadService('client')->sendSms($msg_content, $getOpenidByPhone->phone);
        if ($sendSms['code'] != 1) {
            return array('code' => 1, 'message' => $sendSms['message']);
        }
        if (!empty($fixer['openid'])) {
            $data = $this->loadService('weChat')->sendTempMessage('shipment_overdue', $fixer, 'shipment');
        }
        return $data["errmsg"];
    }



    /**
     * 获取竞标列表
     * Author Ivan
     * 2016-9-22
     */
    public function getBidList($fixer)
    {
        $params = fixer::input($fixer)->get();
        $type = $this->dao->selectOne('tender.getWchetUsertype', $params);
        $params->user_type = $type->user_type;
        $params->phone = $type->phone;
        $result = $this->dao->selectList('tender.getBidList', $params);
        if($result){
                foreach ($result as $key => $val) {
                if ($result[$key]->cooperate_type == 1) {
                    $result[$key]->type = '竞价';
                } else {
                    $result[$key]->type = '一口价';
                }

                $result[$key]->tendertime = date('m-d H:i', strtotime($val->tender_limit));
            }
        }

        return $result;
    }

    /**
     * 获取竞标页面信息
     * Author Ivan
     * 2016-9-22
     */
    public function bidquote($fixer)
    {
        $params = fixer::input($fixer)->get();
        $result=$this->getTenderById($params);
        if(empty($result->remark)){
            $result->remark=$result->ship_remark;
        }
        $result->tenderNow=strtotime($result->tender_limit);
        $result->wareName=$this->dao->selectOne('tender.getWareName',array('warehouse_id'=>$result->warehouse_id))->name;
        $orderRoute=$this->dao->selectList('tender.getOrderRoute',array('shipment_id'=>$result->shipment_id));
        if($params->user_type==3){
          $res=$this->getIdByopenid_driver_carrier($params);
          $params->relation_id=$res->id;
        }
        if($params->user_type==4){
          $res=$this->getIdByopenid_driver_carrier($params);
          $params->relation_id=$res;
        }
        $params->tender_id=$result->id;
        $histroyQuote=$this->dao->selectList('tender.getHistoryQuote',$params);
        $result->historyQuote=$histroyQuote;
        //获取相同路线上个月的中标价的最低价
        $lastMonth=date('Y-m',strtotime('-1 month'));
        $lastYear=date('Y-m',strtotime('-1 year'));
        $lastQuote=$this->dao->selectOne('tender.getLastQuote',array('fromlocation'=>$result->fromlocation,'tolocation'=>$result->tolocation,'lastdate'=>$lastMonth));
        $lastYearQuote=$this->dao->selectOne('tender.getLastQuote',array('fromlocation'=>$result->fromlocation,'tolocation'=>$result->tolocation,'lastyear'=>$lastYear));
        $result->lastQuote=$lastQuote;
        $result->lastYear=$lastYearQuote;
        if($orderRoute){
            $i=1;
            foreach($orderRoute as $key=>$val){
                $orderRoute[$key]->num=$i++;
            }
            $result->orderRoute=$orderRoute;
        }else{
            $result->orderRoute=array();
        }
        return $result;
  }
   /**
   * 获取一口价页面信息
   * Author Ivan
   * 2016-9-22
   */
    public  function fixedquote($fixer){
        $params = fixer::input($fixer)->get();
        $result=$this->getTenderById($params);
        $result->tenderNow=strtotime($result->tender_limit);
        $result->wareName=$this->dao->selectOne('tender.getWareName',array('warehouse_id'=>$result->warehouse_id))->name;
        $orderRoute=$this->dao->selectList('tender.getOrderRoute',array('shipment_id'=>$result->shipment_id));
        if($orderRoute){
            $i=1;
            foreach($orderRoute as $key=>$val){
                $orderRoute[$key]->num=$i++;
                $orderRoute[$key]->weight=ceil($val->weight);
                $orderRoute[$key]->volume=ceil($val->volume);
            }
            $result->orderRoute=$orderRoute;
        }else{
            $result->orderRoute=array();
        }
        return $result;
  }
   /**
   * 获取历史中标信息
   * Author Ivan
   * 2016-9-22
   */
    public  function historyTender($fixer){
        $params = fixer::input($fixer)->get();
        $result=$this->dao->selectList('tender.historyTender',$params);
        return $result;
  }
   /**
   * 检查是否报价过
   * Author Ivan
   * 2016-9-27
   */
    public  function checkTenderQuote($fixer){
        $params = fixer::input($fixer)->get();
        $type=$this->dao->selectOne('tender.getWchetUsertype',$params);
        $params->user_type=$type->user_type;
        $params->phone=$type->phone;
        if($params->user_type==3){
          $res=$this->getIdByopenid_driver_carrier($params);
          $params->relation_id=$res->id;
        }
        if($params->user_type==4){
          $res=$this->getIdByopenid_driver_carrier($params);
          $params->relation_id=$res;
        }
        $result=$this->dao->selectOne('tender.checkTenderQuote',$params);
        return $result;
  }
   /**
   * 添加报价
   * Author Ivan
   * 2016-9-27
   */
    public  function addQoute($fixer){
        $params = fixer::input($fixer)->get();
        $type=$this->dao->selectOne('tender.getWchetUsertype',$params);
        $tender = $this->dao->selectOne('tender.getTenderById',$params);
        if(empty($tender)){
            return array('code'=>3,'msg'=>'标的获取失败，请检查');
        }
        $tender_limit=strtotime($tender->tender_limit);
        $params->tender_weight=$tender->weight;
        $params->user_type=$type->user_type;
        $params->phone=$type->phone;
        $params->price_type=$tender->price_type;
        $params->create_time=date('Y-m-d H:i:s',time());
        if($type->user_type==3){
            $params->relation_id=$this->getIdByopenid_driver_carrier($params)->id;
        }
        if($type->user_type==4){
            $params->relation_id=$this->getIdByopenid_driver_carrier($params);
        }
        
          if(time()<=$tender_limit){
          	
          	//检查重复报价
          	$re=$this->dao->selectOne('tender.checkTenderQuote',$params);
            if($re){
                //$this->dao->update('tender.updateQuote',array('id'=>$re->id));
                $this->dao->update('tender.updateQuote2',$params);
            }
            if($params->user_type==3){
              $res=$this->getIdByopenid_driver_carrier($params);
              $params->relation_id=$res->id;
              $params->carnum=$res->carnum;
              $params->quote_type=2;
              //查找司机在当前省是否有绑定承运商
              /*$re=$this->dao->selectOne('tender.getBandCarrier',array('id'=>$params->tender_id,'truck_source_id'=>$res->id));
              //如没有绑定承运商则获取默认承运商
              if(!$re){
                $re=$this->dao->selectOne('tender.getCarrier',array('id'=>$params->tender_id));
              }*/
              //获取默认承运商
              $re=$this->dao->selectOne('tender.getCarrier',array('id'=>$params->tender_id));
              $params->quote_carrier=$re->id;
              $params->invoice_rate=$re->invoice_rate;
              if($tender->cooperate_type=1){
                if($tender->price_type ==1){
                  $params->total_price=$params->quote_price;
                  $params->quote_price=$params->quote_price * (1+$re->invoice_rate/100);
                  $params->tallage_price=$params->quote_price;
                }else{
                  $params->total_price=$params->quote_price*$tender->weight;
                  $params->quote_price=$params->quote_price * (1+$re->invoice_rate/100);
                  $params->tallage_price=$params->quote_price * $tender->weight;
                }
              }else{
                $params->total_price=$params->quote_price;
                $params->quote_price=$params->quote_price * (1+$re->invoice_rate/100);
                $params->tallage_price=$params->quote_price;
              }

            }
            if($params->user_type==4){
              $res=$this->getIdByopenid_driver_carrier($params);
              $params->relation_id=$res;
              $params->quote_carrier=$res;
              $params->quote_type=1;
              $re=$this->dao->selectOne('tender.getRate',array('id'=>$res));
              $params->invoice_rate=$re->invoice_rate;
              if($tender->cooperate_type==1){
                  if($tender->price_type ==1){
                    $params->total_price=$params->quote_price;
                    $params->tallage_price=$params->quote_price;
                  }else{
                    $params->total_price=$params->quote_price*$tender->weight;
                    $params->tallage_price=$params->quote_price * $tender->weight;
                  }
                }else{
                  $params->total_price=$params->quote_price;
                  $params->tallage_price=$params->quote_price;
                }
              $params->carnum='';
            }
            if(empty($params->relation_id) || empty($params->quote_carrier)){
                return array('code'=>3,'msg'=>'信息不完整,请检查');
            }
            $result=$this->dao->insert('tender.addQoute',$params);
            if($result){
              return array('code'=>0,'msg'=>'报价成功');
            }else{
              return array('code'=>2,'msg'=>'报价失败');
            }

          }else{
            return array('code'=>1,'msg'=>'报价时间已过');
          }

    }
    /**
   * push表更改阅读字段
   * Author Ivan
   * 2016-9-27
   */
    public  function updatePush($fixer){
        $params = fixer::input($fixer)->get();
        $time=$this->dao->selectOne('tender.getReadTime',$params);
        if($time->is_read==1){
            $result=array('code'=>1,'msg'=>'已阅读');
        }else{
            $params->read_time=date('Y-m-d H:i:s',time());
            $result=$this->dao->update('tender.updatePush',$params);
        }

        return $result;
  }

    /**
     * 展示标的信息
     * Author will
     * 2017-3-15
     */
    public  function getTenderInfo($fixer){
        $params = fixer::input($fixer)->get();
        if($params->shipmentId){
            $data = $this->dao->selectOne('tender.getTenderInfo',$params);
            return $data;
        }
    }

  /**
   * 发标通知
   * Author Ivan
   * 2016-9-27
   */
    public  function tenderMsg($fixer){
        $params = fixer::input($fixer)->get();
        $result=$this->dao->selectList('tender.tenderMsg',$params);
        if($result){
            foreach($result as $key=>$val){
              if($val->to_type==2){
                $relation_id=$this->dao->selectOne('tender.driverId',array('phone'=>$val->phone));
              }elseif($val->to_type==1){
                $relation_id=$this->dao->selectOne('tender.carrierId',array('phone'=>$val->phone));
              }else{
                $relation_id='';
              }
              $res=$this->dao->selectOne('tender.getQuoteTime',array('tender_id'=>$val->id,'relation_id'=>$relation_id->id));
              if($res){
                $result[$key]->is_apply='已报价';
                $result[$key]->create_time=$res->create_time;
              }else{
                $result[$key]->is_apply='未报价';
                $result[$key]->create_time='--';
              }
          }
        }

        return $result;
    }
    /**
   * 废标
   * Author Ivan
   * 2016-9-29
   */
    public  function abandTender($fixer)
    {
        $params = fixer::input($fixer)->get();
        $res = $this->dao->selectOne('tender.checkTender', $params);
        $username=$this->app->user->realname;
        $params->aband_time=date('Y-m-d H:i:s',time());
        $params->aband_remark=$username.','.$params->aband_remark;
        if ($res) {
            $result = array('code' => 1, 'msg' => '已有中标人，如要废标请取消中标人');
        } else {
            $r=$this->dao->selectOne('tender.getAbandMsg', $params);
            if($r){
                $re = $this->dao->update('tender.abandTender', $params);
                if($re>0){
                    $re = $this->dao->update('tender.updateShipmentStatus', $params);
                    $this->cancelShipmentCarriage($params->shipmentid);
                    if($re>0){
                        $result = array('code' => 0, 'msg' => '废标成功');
                    }else{
                        $result = array('code' => 2, 'msg' => '该标已经废除');
                    }
                }else{
                    $result = array('code' => 2, 'msg' => '该标已经废除');
                }
            }else{
                $result=array('code'=>3,'msg'=>'运单未发标，无法废标');
            }


        }
        return $result;
    }
    //审批人列表页面
    public function getApproveList ($args)
    {
        $params = fixer::input($args)->get();
        //获取 warehouse_user_id
        $params->field = "id";
        $params->form_name = "warehouse_user";
        $params->condition = "phone = #phone#";
        $warehouse_user_ids =  $this->dao->selectList('tender.selectById',$params);
        foreach ($warehouse_user_ids as $_row){
        	$params->warehouse_user_ids[] = $_row->id;
        }
        if($params->warehouse_user_ids){
            //获取审批人审批页面 list
            $checkoutIn = [];
            if($params->checkout == 1){

                $checkoutIn[] = 3;
            }else if($params->checkout == 2){
                $params->endcheckout=ture;
                $checkoutIn[] = 1;
                $checkoutIn[] = 2;

            }else{
                throwException('用户数据不完整，无法获取数据');
                return false;
            }
            $params->checkoutIn = $checkoutIn;
            $params->create_time=date('Y-m',strtotime('-3 month'));
            $res =  $this->dao->selectPage('tender.getApproveList', $params);
            foreach ($res->result AS $key=>$value){
                $paramArr["from_location"]=$value->fromlocation;
                $paramArr['to_location']=$value->tolocation;
                $paramArr['shipment_method']=$value->shipment_method;
                $paramArr['density']=$value->density;
                if(empty($value->carriage_type)){
                    $paramArr['carriage_type_no']= '无要求';
                }else{
                    $paramArr['carriage_type']=$value->carriage_type;
                }
                $routePrice=$this->dao->selectOne('tender.getRoutePrice',$paramArr);
                if($routePrice){
                    $value->maxprice=$routePrice->price;
                }else{
                    $value->maxprice='';
                }
            }
            return $res;

        }else{
            throwException('用户数据不完整，无法获取数据');
            return false;
        }
    }

    //价格审核
    public function getRetifyinfo ($args)
    {
        $params = fixer::input($args)->get();
        /*通过openid 获取warehouseId*/
        $warehouse_id = $this->dao->selectOne('tender.getWuIdByOpenid', $params);
        
        $params->warehouse_id = $warehouse_id->id;
        //获取审批人审批页面 list
        $res = $this->dao->selectOne('tender.getRetifyinfo', $params);
        if($res->id){
            $res->tender_name = $res->fromlocation.'-'.$res->tolocation;
            /*查询线路底价*/
            $paramArr["from_location"]=$res->fromlocation;
            $paramArr['to_location']=$res->tolocation;
            $paramArr['shipment_method']=$res->shipment_method;
            $paramArr['density']=$res->density;
            $paramArr['carriage_type']=$res->carriage_type;
            if(empty($res->carriage_type)){
                $paramArr['carriage_type_no']= '无要求' ;
            }else{
                $paramArr['carriage_type']=$res->carriage_type;
            }
            $routePrice=$this->dao->selectOne('tender.getRoutePrice',$paramArr);
            if($routePrice){
                $res->maxprice=$routePrice->price;
                $res->over_rate=$routePrice->over_rate;
            }else{
                $res->maxprice='';
                $res->over_rate='';
            }
        }
        if($res->carriage_type){
            $carType = $this->dao->selectOne('truck_source.getBycarriageType',array("carriage_type"=>$res->carriage_type));
            $res->carriage_type =$carType->name;
        }
        if($res->quote_type == 2){
            $res->quote_carrier_id = $res->quote_carrier;
            $params->id = $res->quote_carrier;
            $driverInfo =  $this->dao->selectOne('truck_source.selectById',array("field"=>"driver_name,carnum","id"=>$res->relation_id));
            $res->driver_name =$driverInfo->driver_name;
            $res->carnum = $driverInfo->carnum;

        }elseif($res->quote_type == 1){
            $res->quote_carrier_id = $res->relation_id;
            $params->id = $res->relation_id;
        }
        $history = empty($res->history) ? '' : json_decode($res->history,true);
        $lastHistory = $history ? $history[count($history)-1] : '';
        $res->remark = $lastHistory ? $lastHistory['action'] : '';
        $res->retify_name = $lastHistory ? $lastHistory['retify_name'] : '';
        $res->quote_carrier =  $this->dao->selectOne('tender.getCarrierRate',array('id'=>$res->quote_carrier_id))->carrier_name;
        $warehouse_user_name = $this->dao->selectOne('tender.getWu_name',array("tender_audit_id"=>$params->tender_audit_id));
        //获取相同路线上个月的中标价的最低价
       /* $lastMonth=date('Y',time()).'-'.(date('m',time())-1);
        $lastYear=(date('Y',time())-1).'-'.date('m',time());*/
        $lastMonth=date('Y-m',strtotime('-1 month'));
        $lastYear=date('Y-m',strtotime('-1 year'));
        $lastQuote=$this->dao->selectOne('tender.getLastQuote',array('fromlocation'=>$res->fromlocation,'tolocation'=>$res->tolocation,'lastdate'=>$lastMonth));
        $lastYearQuote=$this->dao->selectOne('tender.getLastQuote',array('fromlocation'=>$res->fromlocation,'tolocation'=>$res->tolocation,'lastyear'=>$lastYear));
        $res->lastQuote=$lastQuote;
        $res->lastYear=$lastYearQuote;
        return $res;
    }
    //审核批准操作
    public function retifyOk ($fixer)
    {
        $params = fixer::input($fixer)->get();
        //找历史数据添加进tender warehouse_user
        $params->field = "name";
        $params->form_name = "warehouse_user";
        $params->condition = "phone = #phone#";
        $params->openid = $params->openid;
        $warehouse_userInfo =  $this->dao->selectOne('tender.getAuditUser',['id'=>$params->warehouse_user_id]); //审批人姓名
        $retify_name = $warehouse_userInfo->name;
        $history =  $this->dao->selectOne('tender.searchById_tender',['field'=>'t.history','id'=>$params->tender_id]);
        $status=  $this->dao->selectOne('tender.getTenderLimit',['tender_id'=>$params->tender_id]);
        $AuditId=$this->dao->selectOne('tender.selectAuditId',array('warehouse_user_id'=>$params->warehouse_user_id));
        $warehouse_type = $this->dao->selectOne('tender.getWu_type',array("openid"=>$params->openid));
       if($status->status == 4){
           return array('code' => "ok",  'data' => false,'msg' => '审批操作失败,该标已经作废');
        }
        $res = array();
        if($params->retify == "ok"){
            //标的基本信息
            if(empty($params->audit_remark)){
                $retify_remark = $retify_name."审核中标(通过)";
            }else{
                $retify_remark = $retify_name."审核中标(通过)"."\n".$params->audit_remark;
            }
            $auditPush = $this->dao->selectOne('tender.getAuditUser',array('id'=>$AuditId->second_audit_id));
            if(!empty($warehouse_type)){
                if($status->audit_level == 2){
                    //写入审批表
                    $addAuditId = $this->dao->insert('tender.insertTenderAudit',array('tender_id'=>$params->tender_id,'quote_id'=>$params->quote_id,'quote_price'=>$params->quote_price,'warehouse_user_id'=>$AuditId->second_audit_id,'submitter'=>$retify_name,'plan_remark'=>$params->audit_remark,'create_time'=> date('Y-m-d H:i:s',time())));
                    $fix = array(
                        'openid'=>$auditPush->openid,
                        //'first'=>array('value'=>'有一条分级运价审批已超出你的审批权限，已提交到上一级审批。','color'=>'#000000'),
                        'url'=>$_SERVER['HTTP_HOST'].'/wechat/retify.html?tender_id='.$params->tender_id.'&quote_id='.$params->quote_id.'&openid='.$auditPush->openid.'&tender_audit_id='.$addAuditId["id"],
                        'keyword1'=>array('value'=>$retify_name,'color'=>'#000000'),
                        'keyword2'=>array('value'=>date('Y-m-d H:i:s',time()),'color'=>'#000000'),
                        'keyword3'=>array('value'=>$params->tender_name,'color'=>'#000000'),
                        'remark'=>array('value'=>$params->audit_remark,'color'=>'#000000'),
                    );
                    $this->loadService('wechat')->sendTempMessage('tenderAudit',$fix,'consign');
                    $res_tender_audit= $this->dao->update('tender.update_tender_audit',array("warehouse_user_id"=>$params->warehouse_user_id,"tender_audit_id"=>$params->tender_audit_id,"status"=>2,"update_time"=>date("Y-m-d H-i-s")));

                    /*加入历史形成事件*/
                    if(isset($history->history)){
                        $history = json_decode($history->history,true);
                        $history[] = ['time'=>date('Y-m-d H:i:s',time()),"retify_name"=>$retify_name,'action'=>$retify_remark];
                    }
                    $this->dao->update('tender.update_tender',array("id"=>$params->tender_id,"quote_id"=>$params->quote_id,'history'=>json_encode($history)));
                    return array('code' => "ok", 'data' => true);
                }
            }
            if($params->quote_type == "2" || $params->quote_type == "1"){
                //说明是司机  报价表
                $res_quote = $this->dao->update('tender.update_tender_quote',array("id"=>$params->quote_id,"status"=>3));
                $res[] = $res_quote;
                //审批表
                $res_tender_audit= $this->dao->update('tender.update_tender_audit',array("warehouse_user_id"=>$params->warehouse_user_id,"tender_audit_id"=>$params->tender_audit_id,"status"=>2,"update_time"=>date("Y-m-d H-i-s")));
                $res[] = $res_tender_audit;
                if(isset($history->history)){
                    $history = json_decode($history->history,true);
                    $history[] = ['time'=>date('Y-m-d H:i:s',time()),"retify_name"=>$retify_name,'action'=>$retify_remark];
                }
                $res_tender = $this->dao->update('tender.update_tender',array("id"=>$params->tender_id,"status"=>3,"quote_id"=>$params->quote_id,"valid"=>1,"bid_time"=>true,'history'=>json_encode($history)));
                $res[] = $res_tender;
                //运单表
                $res_shipment = $this->dao->update('shipment.updateShipment_tender',array("id"=>$params->shipment_id,"carrier_id"=>$params->quote_carrier_id,"status"=>3,"carnum"=>$params->carnum,'ship_type'=>'1','tallage_price'=>$params->tallage_price));
                $res[] = $res_shipment;
            }
            if(in_array("0",$res) || empty($res)){
                return array('code' => "ok", 'data' => false,'msg' => '审批操作失败');
            }else{
                //根据角色的id找出 报价人的openid
                $paramsArr = array(
                    "retify_name"=>$retify_name,
                    "tender_id"=>$params->tender_id,
                    "tender_name"=>$params->tender_name
                );
                $this->SendTenderAgree($paramsArr);
                return array('code' => "ok", 'data' => true);
            }
        }elseif($params->retify == "no"){
             //标的基本信息
            if(empty($params->audit_remark)){
                $retify_remark = $retify_name."审核中标(不通过)";
            }else{
                $retify_remark = $retify_name."审核中标(不通过)"."\n".$params->audit_remark;
            }
            if(isset($history->history)){
                $history = json_decode($history->history,true);
                $history[] = ['time'=>date('Y-m-d H:i:s',time()),"retify_name"=>$retify_name,'action'=>$retify_remark];
            }
            $res_tender = $this->dao->update('tender.update_tender',array("id"=>$params->tender_id,"status"=>1,'history'=>json_encode($history),"audit_level"=>0));
            $res[] = $res_tender;
            //说明是司机  报价表
            $res_quote = $this->dao->update('tender.update_tender_quote',array("id"=>$params->quote_id,"status"=>1));
            $res[] = $res_quote;
            //审批表
            $res_tender_audit= $this->dao->update('tender.update_tender_audit',array("warehouse_user_id"=>$params->warehouse_user_id,"tender_audit_id"=>$params->tender_audit_id,"status"=>1,"update_time"=>date("Y-m-d H-i-s")));
            $res[] = $res_tender_audit;
            //说明是司机  报价表
            if(in_array("0",$res)){
                return array('code' => "no", 'msg' => false);
            }else{
                return array('code' => "no", 'msg' => true);
            }

        }
    }
    //逾期提醒写入缓存
    public function addRedisByPackage($fixer){
        $params = fixer::input($fixer)->get();
        $shipmentInfo = $this->dao->selectOne('shipment.getShipmentId',array("shipment_code"=>$params->shipment_code,"shipment_id"=>$params->shipment_id));
        $tenderInfo = $this->dao->selectOne('tender.searchById_tender',array("id"=>$params->tender_id,"field"=>"t.package_time"));
        //逾期提醒 加入缓存   判断缓存中是否有值
        $redis = redisCache("sendwechatoverdue");
        $redis = json_decode($redis,true);
        if($redis){
            $param = $redis;
        } else{
            $param = array();
        }

        /*写入数据库里面时加入写入缓存*/
        if($params->shipment_code != null || $params->shipment_id != null){
            $param_arr = array();
            $shipment_code = $shipmentInfo->shipment_code;
            $param_arr["shipment_code"] = $shipmentInfo->shipment_code ;
            if(!empty($params->tender_id)){
                $param_arr["plan_leave_time"] = $tenderInfo->package_time;
            }else{
                $param_arr["plan_leave_time"] = $shipmentInfo->plan_leave_time;
            }

            $param_arr["fromlocation"] =  $shipmentInfo->fromlocation;
            $param_arr["driver_phone"] =  $shipmentInfo->driver_phone;
            $param_arr["carnum"] =  $shipmentInfo->carnum;
            $param_arr["tender_route"] =  $shipmentInfo->from_city.'-'.$shipmentInfo->to_city;
            $param[$shipment_code] = $param_arr;
            redisCache("sendwechatoverdue",$param);
        }

    }
    //通过quote_id select openid
    public function  getOpenidById($fixer){
           $params = fixer::input($fixer)->get();
          //司机
          if($params->quote_type == 2){
              $left_where = "LEFT JOIN truck_source AS ts on ts.driver_phone = wc.phone WHERE ts.id = #relation_id#";
              $res = $this->dao->selectOne('tender.searchByOpenId',array("filed"=>",driver_name","relation_id"=>$params->relation_id,"left_where"=>$left_where));
              return $res;
          }elseif($params->quote_type == 1){
              $left_where = "LEFT JOIN carrier AS c on wc.phone = c.relation_phone WHERE c.id = #relation_id#";
              $res = $this->dao->selectOne('tender.searchByOpenId',array("filed"=>",carrier_name","relation_id"=>$params->relation_id,"left_where"=>$left_where));
              return $res;
        }
    }
    //通过quote_id select status
    public function  getAuditStatus($fixer){
        $params = fixer::input($fixer)->get();
        $res = $this->dao->selectOne('tender.getAuditStatus',array("filed"=>"status,tender_id,quote_id","id"=>$params->tender_audit_id));
        if($res->status){
            return $res;
        }else{
            return false;
        }
    }

    //推送中标信息
    public  function SendTenderAgree($fixer){
        $params = fixer::input($fixer)->get();
        $getQuoteAll = $this->dao->selectList('tender.getQuoteByIdList',array("tender_id"=>$params->tender_id));
        //get  openid all
        $sendOpenid = array();
        foreach($getQuoteAll as $key=>$value){
            //回去openid和name
            $openidOrname =  $this->getOpenidById(array("quote_type"=>$value->quote_type,"relation_id"=>$value->relation_id));
            if($value->quote_type == 2){ //司机
                $sendName = $openidOrname->driver_name;
            }elseif($value->quote_type == 1){ //承运商
                $sendName = $openidOrname->carrier_name;
            }
        //发送微信消息
           $res = array();
            if (!empty($openidOrname->openid) && !empty($value->status)) {
                //TODO 评标通知
                if($value->status == 3){
                    $content = '您有一条中标通知,请尽快定车';
                    $remark = '点击详情进入派车';
                    $result = '中标';
                }else{
                    $content = '感谢参与竞标,遗憾您未中标,请再接再厉';
                    //$remark = '您的报价含税价格为'.$value->quote_price.',含税总价为'.$value->tallage_price;
                    $remark = '您的报价含税价格为'.$value->quote_price.'';		//不显示总价
                    $result = '未中标';
                }

                $wechatMessage = array(
                    'openid'=>$openidOrname->openid,
                    'first'=>array('value'=>$content,'color'=>'#000000'),
                    'keyword1'=>array('value'=>$params->tender_name,'color'=>'#000000'),
                    'keyword2'=>array('value'=>$sendName,'color'=>'#000000'),
                    'keyword3'=>array('value'=>$result,'color'=>'#000000'),
                    'remark'=>array('value'=>$remark,'color'=>'#000000')//备注
                );
                if($value->status == 3){
                    $wechatMessage["url"] = $_SERVER['HTTP_HOST'].'/wechat/tenderConfirm.html?openid='.$openidOrname->openid.'&tender_id='.$params->tender_id.'&tender_quote_id='.$value->id;
                }
                try {
                    $re =  $this->loadService('wechat')->sendTempMessage('approve_notice', $wechatMessage, 'shipment');
                    //$res[$key][] = $re;
                }catch (Exception $e){
                    $return = ['code' => 3, 'msg' => $e->getMessage()];
                }
            }
        }
                  // var_dump($res);exit;
    }

    //定时任务：推送tenderpush表中的数据
    public  function SendTenderPush(){
        $warehouseTruck = $this->dao->selectList('tender.sendTenderPush');
        $pushTime=date('Y-m-d H:i:s',time());
        //发送微信消息
        foreach($warehouseTruck as $key=>$val){
            $car_length = explode(',',$val->car_length);
            $remark = $val->remark;
            if(empty($val->remark)){
                $remark = $val->sremark;
            }
            //微信模板推送
            $fix = array(
                'openid'=>$val->openid,
                'url'=>$_SERVER['HTTP_HOST'].'/wechat/quote.html?id='.$val->tender_id.'&cooperate_type='.$val->cooperate_type.'&openid='.$val->openid.'&from=pt',
                'first'=>array('value'=>$val->content,'color'=>'#000000'),
                'keyword1'=>array('value'=>$val->plat_form_name,'color'=>'#000000'),
                'keyword2'=>array('value'=>$val->to_province,'color'=>'#000000'),
                'keyword3'=>array('value'=>$val->tolocation,'color'=>'#000000'),
                'keyword4'=>array('value'=>$val->weight.'吨,'.$val->volume.'方','color'=>'#000000'),
                'keyword5'=>array('value'=>$val->plan_arrive_time,'color'=>'#000000'),
                'keyword6'=>array('value'=>$remark,'color'=>'#000000'),
                'keyword7'=>array('value'=>$val->tender_limit,'color'=>'#000000'),
                'keyword8'=>array('value'=>$val->package_time,'color'=>'#000000'),
            );
            $sendmsg =$this->loadService('wechat')->sendTempMessage('SenTenderPush',$fix,'shipment');
            if($sendmsg['errcode'] == '0'){
                $status = '3';
            }
            else{
                $status = '2';
            }
            $this->dao->update('shipment.updateTenderPush',['id'=>$val->tender_push_id,'status'=>$status,'push_time'=>$pushTime,'push_lengh'=>$val->push_lengh,'push_error'=>$sendmsg['errmsg']]);
        }
    }
    /**
     * 获取废标列表
     * Author Ivan
     * 2016-9-27
     */
    public  function getAbandTender($fixer){
        $params = fixer::input($fixer)->get();
        $params->orgcode=$this->app->user->organ->orgcode;
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        $result=$this->dao->selectPage('tender.getAbandTender',$params);
        foreach($result->result as $key=>$val){
            $aband_remark=explode(',',$val->aband_remark);
            $result->result[$key]->aband_user=$aband_remark[0];
            $result->result[$key]->aband_remark=$aband_remark[1];
            if ($val->business_type == 1) {
                $result->result[$key]->business_type = '省内';
            } else {
                $result->result[$key]->business_type = '省外';
            }
        }
        return $result;
    }
    /**
     * 获取评标弹框信息
     * Author Ivan
     * 2016-9-27
     */
    public  function abandTenderQuoteList($fixer){
        $params = fixer::input($fixer)->get();
        $result=$this->dao->selectList('tender.abandTenderQuoteList',$params);
        if($result) {
            foreach ($result as $key => $val) {
                if ($val->quote_type == 2) {
                    $result[$key]->quote_type_name = $this->dao->selectOne('tender.selectDriver', array('relation_id' => $val->relation_id))->driver_name;
                } elseif ($val->quote_type == 1) {
                    $result[$key]->quote_type_name = $val->carrier_name;
                }
            }
            $result[0]->history=$this->dao->selectOne('tender.selectHistory',array('tender_id'=>$result[0]->tender_id))->history;
            $result[0]->history=json_decode($result[0]->history);
            return $result;
        }else{
            return false;
        }


    }
    /**
     * 获取运单号
     * Author Ivan
     * 2016-9-27
     */
    public function  getShipmentCodes($fixer){
        $params = fixer::input($fixer)->get();
        $params->orgcode=$this->app->user->organ->orgcode;
        $res = $this->dao->selectList('tender.getShipmentCodes',$params);
        return $res;
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
     * Desc:获取登录用户所在机构的审批结果列表-已审批
     * @param $res
     * @Author Lvison
     * @return Pager
     */
    public function getAuditResult($res){
        $orgcode = $res['orgcode'] ? $res['orgcode'] : $this->app->user->organ->orgcode;
        $update_time = $res['begin_time'] ? $res['begin_time'] : date('Y-m-d H:i:s',time()-3600);
        $warehose = $this->dao->selectOne('tender.getWarehouseByUser',array('orgcode'=>$orgcode));
        if(empty($warehose)){
            return [];
        }else{
            $result = $this->dao->selectList('tender.getAuditList',array('warehouse_id'=>$warehose->id,'update_time'=>$update_time));
            return $result;
        }
    }
    /**
     * Desc:获取web端承运商竞标列表
     * @param $res
     * @Author ivan
     * @return Pager
     */
    public function getBidTenderList($res){
        $params = fixer::input($res)->get();
        //处理时间参数
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        $orgcode = $this->app->user->organ->orgcode;
        if($params->status){
            $params->status='t.status in ('.$params->status.')';
        }else{

           $params->status='t.status in (1,2,3,4,5)';
        }
        $carrier_phone = $this->dao->selectOne('tender.getCarrierPhone',array('orgcode'=>$orgcode));
        $params->phone=$carrier_phone->relation_phone;
        $params->pageNo = $params->pageNo ? $params->pageNo : 1;
        $params->pageSize = $params->pageSize ? $params->pageSize : 10;
        if(empty($carrier_phone)){
            $pager = new Pager();
            return $pager;
        }else{
            $result = $this->dao->selectPage('tender.getBidTenderList',$params);
            foreach($result->result as $key=>$val){
                $quote=$this->dao->selectOne('tender.getQuoteMsg',array('phone'=>$carrier_phone->relation_phone,'tender_id'=>$val->id));
                $carType = $this->dao->selectOne('truck_source.getBycarriageType',array("carriage_type"=>$val->carriage_type));
                $result->result[$key]->carriage_type =$carType->name;
                $result->result[$key]->quote_price=$quote->quote_price;
                $result->result[$key]->create_time=$quote->create_time;
                $result->result[$key]->relation_id=$quote->relation_id;
                $result->result[$key]->car_length=str_replace(',','-',$val->car_length);
            }
            return $result;
        }
    }
    /**
     * 获取竞标订单信息
     * Author Ivan
     * 2016-9-27
     */
    public function  getTenderMsg($fixer){
        $params = fixer::input($fixer)->get();
        $orgcode = $this->app->user->organ->orgcode;
        $msg=explode('_',$params->id);
        $tender_id=$msg[0];
        $shipment_id=$msg[1];
        $carrier_phone = $this->dao->selectOne('tender.getCarrierPhone',array('orgcode'=>$orgcode));
        $relation_id=$carrier_phone->id;
        $res = $this->dao->selectOne('tender.getTenderMsg',array('tender_id'=>$tender_id));
        $orderMsg=$this->dao->selectList('tender.getorderMsg',array('shipment_id'=>$shipment_id));
        $history_qoute=$this->dao->selectList('tender.getHistoryQuote',array('tender_id'=>$tender_id,'relation_id'=>$relation_id));
        if($history_qoute){
            $res->history_qoute=$history_qoute;
        }
        if($orderMsg){
            $res->orderMsg=$orderMsg;
        }
        return $res;
    }
    /**
     * 添加承运商报价
     * Author Ivan
     * 2016-9-27
     */
    public function  addCarrierQuote($fixer){
        $params = fixer::input($fixer)->get();
        $msg=explode('_',$params->id);
        $orgcode = $this->app->user->organ->orgcode;
        $tender_id=$msg[0];
        $shipment_id=$msg[1];
        $carrierMsg=$this->dao->selectOne('tender.getCarrierPhone',array('orgcode'=>$orgcode));
        if(!$carrierMsg) return array('code'=>2,'msg'=>'信息不全，请查看');
        $relation_id=$carrierMsg->id;
       
        //获取标的信息
        $res = $this->dao->selectOne('tender.getTenderMsg',array('tender_id'=>$tender_id));
        if(time()<=strtotime($res->tender_limit)){
        	
        	//获取报价信息
        	$quoteMsg=$this->dao->selectOne('tender.checkTenderQuote',array('tender_id'=>$tender_id,'relation_id'=>$relation_id));
        	
            if($quoteMsg){
                $this->dao->update('tender.updateQuote2',array('tender_id'=>$tender_id,'relation_id'=>$relation_id));
            }
            //获取承运商票点
            $invoice_rate=$this->dao->selectOne('tender.getCarrierRate',array('id'=>$relation_id));
            $params->invoice_rate=$invoice_rate->invoice_rate;
            $params->relation_id=$relation_id;

            $params->quote_type=1;
            $params->tender_id=$tender_id;
            $params->quote_carrier=$relation_id;
            $params->price_type=$res->price_type;
            $params->tender_weight=$res->weight;
            if($res->price_type==1){
                $params->tallage_price=$params->quote_price;
                $params->total_price=$params->quote_price;
            }else{
                $params->tallage_price=$params->quote_price*$res->weight;
                $params->total_price=$params->quote_price*$res->weight;
            }
            $params->create_time=date('Y-m-d H:i:s',time());
            $params->carnum='';
            $result=$this->dao->insert('tender.addQoute',$params);
            if($result){
              return array('code'=>0,'msg'=>'报价成功');
            }else{
              return array('code'=>2,'msg'=>'报价失败');
            }
        }else{
            return array('code'=>1,'msg'=>'报价时间已过');
        }
    }
    /**
     * web验证qoute
     * Author Ivan
     * 2016-9-27
     */
    public function  checkQoute($fixer){
        $params = fixer::input($fixer)->get();
        $orgcode=$this->app->user->organ->orgcode;
        $msg=explode('_',$params->id);
        $tender_id=$msg[0];
        $shipment_id=$msg[1];
        $carrierMsg=$this->dao->selectOne('tender.getCarrierPhone',array('orgcode'=>$orgcode));
        $relation_id=$carrierMsg->id;
        //获取报价信息
        $result=$this->dao->selectOne('tender.checkTenderQuote',array('tender_id'=>$tender_id,'relation_id'=>$relation_id));
        return $result;
    }
    /**
     * web获取我的报价列表
     * Author Ivan
     * 2016-9-27
     */
    public function  getMyTenderList($fixer){
        $params = fixer::input($fixer)->get();
        $orgcode=$this->app->user->organ->orgcode;
       //处理时间参数
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        if($params->status){
            $params->status='t.status in ('.$params->status.')';
        }else{

           $params->status='t.status in (1,2,3,4,5)';
        }
        $carrierMsg=$this->dao->selectOne('tender.getCarrierPhone',array('orgcode'=>$orgcode));
        $params->relation_id=$carrierMsg->id;
        $result = $this->dao->selectPage('tender.getMyTenderList',$params);
        foreach($result->result as $key=>$val){
            $carType = $this->dao->selectOne('truck_source.getBycarriageType',array("carriage_type"=>$val->carriage_type));
                $result->result[$key]->carriage_type =$carType->name;
                $result->result[$key]->car_length=str_replace(',','-',$val->car_length);
        }
        return $result;
    }

    /**
     * Desc:检查运单是否发标，中标，预中标，发标，废标等状态
     * @Author ivan
     *
     */
    public function checkShipment($res){
       $params = fixer::input($res)->get();
       $relation_id=$this->dao->selectOne('tender.getCarrierId',$params);
       $ship_type=$this->dao->selectOne('tender.getShipmentMsg',$params);
       if($relation_id){
            $params->relation_id=$relation_id->id;
       }
       $tenderMsg=$this->dao->selectOne('tender.getTenderMessage',array('shipment_id'=>$params->shipment_id));
       if($ship_type->ship_type==0){
            return array('code'=>2,'ship_type'=>0);
       }else{
            if($tenderMsg){
              $qouteMsg=$this->dao->selectOne('tender.checkTenderQuote',array('tender_id'=>$tenderMsg->id,'relation_id'=>$relation_id->id));
              if($qouteMsg){
                return array('code'=>0,'data'=>$qouteMsg);
              }else{
                return array('code'=>1,'msg'=>'未中标不能订车');
              }
              $result=$this->dao->selectOne('tender.checkShipment',$params);
           }else{
                return array('code'=>1,'msg'=>'未发标不能订车');
           }
       }

    }



    /**
     * Desc:指定承运商
     * @param $res
     * @Author sunjie
     * @return array
     */
    function cpecify_carrier($res){
        $this->dao->update('shipment.updateShipmentAssignRemark',array('id'=>$res['shipmentid'],'carrier_id'=>$res['carrier_id'],'ship_type'=>'0','assign_remark'=>$res['assign_remark']));
        $carrier = $this->dao->selectList('tender.getCarrierById',array('carrier_id'=>$res['carrier_id']));
        $shipmentWithWarehouse = $this->dao->selectOne('tender.getShipmentWithWarehouse',array('id'=>$res['shipmentid']));
        foreach($carrier AS $key=>$val){
            $fixer = array(
                'openid' => $carrier[$key]->openid,
                'url'=>$this->config->webHost.'/wechat/pickUpInfo.html?shipment_code='.$shipmentWithWarehouse->shipment_code.'&openid='.$carrier[$key]->openid.'&from=wx',
                'first'=>array('value'=>'您有一条提货单('.$shipmentWithWarehouse->shipment_code.'),请尽快派车到厂提货','color'=>'#000000'),
                'keyword1'=>array('value'=>$shipmentWithWarehouse->fromlocation."-".$shipmentWithWarehouse->tolocation,'color'=>'#000000'), //货运线路
                'keyword2'=>array('value'=>date('Y-m-d'),'color'=>'#000000'),//提货点
                'remark'=>array('value'=>"\n装车地址：".$shipmentWithWarehouse->address."\n备注：".$res['assign_remark']."\n有疑问请致电  ".$shipmentWithWarehouse->name."(".$shipmentWithWarehouse->phone.")",'color'=>'#000000')//备注
            );
            //发送提货提醒给承运商
            if (!empty($carrier[$key]->openid)) {
                $this->loadService('weChat')->sendTempMessage('shipment_overdue', $fixer, 'shipment');
            }
        }

        return array('code'=>0,'message'=>'指定成功');
    }

    /**
     * Desc:维护一口价
     * @param $res
     * @Author sunjie
     */
    function maintain_price($res){
        if($res['check_radio']==1){
            $res['total_price']=$res['price'];
            $res['unit_price']=$res['calculate_price'];
        }else{
            $res['total_price']=$res['calculate_price'];
            $res['unit_price']=$res['price'];
        }
         $this->dao->update('tender.updateShipment',array('id'=>$res['shipmentid'],'ship_type'=>'0','price'=>$res['total_price'],'price_type'=>$res['check_radio']));
         $result = $this->dao->insert('shipment.saveMaintain_price',array('shipment_id'=>$res['shipmentid'],'remark'=>$res['remark'],'carrier_id'=>$res['carrier_id'],'price'=>$res['total_price'],'old_price'=>$res['old_price'],'create_time'=>date("Y-m-d H:i:s"),'price_type'=>$res['check_radio'],'unit_price'=>$res['unit_price']));
         //发送最终运输信息给tms
        $this->loadService('shipment')->sendBindConfirm($res['shipmentid']);
        if($result['code'] == 0){
            return array('code'=>0,'message'=>'设置成功');
        }else{
            return array('code'=>1,'message'=>'设置失败');
        }
    }
    /**
     * 获取运单运价模式
     * Author Ivan
     * 2016-9-27
     */
    public function  getShipType($fixer){
        $params = fixer::input($fixer)->get();
        $res = $this->dao->selectOne('tender.getShipType',$params);
        return $res;
    }
    /**
     * 获取相关角色的信用度
     * Author Ivan
     * 2016-9-27
     */
    public function  getSignMsg($fixer){
        $params = fixer::input($fixer)->get();
        $data=explode('_',$params->data);
        $params->id=$data[0];
        $params->type=$data[1];
        if($params->type==1){
            $params->tablename='carrier';
            $params->getColumn='delivery_times,total_weight,total_distance,complain_num,total_grade,total_price,create_time';
        }elseif($params->type==2){
            $params->tablename='truck_source';
            $params->getColumn='delivery_times,total_weight,total_distance,complain_num,total_grade,sign_num,create_time';
        }
        $res = $this->dao->selectOne('tender.getSignMsg',$params);
        if($res){
          $res->create_time = date('Y.m.d',strtotime($res->create_time));
          $res->type=$params->type;
          if($res->total_grade){
            $grade=json_decode($res->total_grade,true);
            $res->gradeArr = $grade;
              $div=$grade[5]+$grade[4]+$grade[3]+$grade[2]+$grade[1];
              if($div==0){
                $div=1;
              }
            $res->total_grade=number_format(($grade[5]*5+$grade[4]*4+$grade[3]*3+$grade[2]*2+$grade[1]*1)/$div,1);
          }else{
            $res->total_grade='0';
          }
          return array('code'=>0,'data'=>$res);
        }else{
            return array('code'=>1,'msg'=>'暂无相关数据');
        }
    }

    /**
     * 获取司机信誉度信息
     * Author will
     * 2016-9-27
     */
    public function  getSignMsg_wechat($fixer){
        $params = fixer::input($fixer)->get();
        if ($params->user_type == 3) {
            $carnum_id = $this->getIdByopenid_driver_carrier($params);
            $type = $params->user_type - 1;
            $params->data = $carnum_id->id.'_'.$type;
            //查出司机车牌号和默认结算承运商
        } elseif ($params->user_type == 4) {
            $type = $params->user_type - 3;
            $carrier_id = $this->getIdByopenid_driver_carrier($params);
            $params->data = $carrier_id.'_'.$type;
        }
        return $this->getSignMsg($params);
    }



    /**
     * 获取运单运价模式
     * Author Ivan
     * 2016-9-27
     */
    public function  getWareHouse($fixer){
        $params = fixer::input($fixer)->get();
        $params->orgcode=$this->app->user->organ->orgcode;
        $res = $this->dao->selectList('tender.getWareHouse',$params);
        return $res;
    }
    /**
     * Desc:派车管理导出
     * @param $res
     * @Author Ivan
     */
    public function getShipmentsForM($fixer){
        $fixer = fixer::input($fixer);
        $params = $fixer->get();
        $params->role_condition = $this->getRoleCondition($params->orgcode);
        //处理时间参数
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        //删选运单状态
        if($params->check_shipStatus){
           if($params->check_shipStatus == 'arrival'){
               unset($params->check_shipStatus);
               $params->arrival = true;
           }elseif($params->check_shipStatus == 'valid'){
               unset($params->check_shipStatus);
               $params->invalid = true;
           }
        }
        //添加招投标筛选条件
        $shipment_id = array();$shipment_param = [];

        if($params->bidding_status != ''){
            if($params->bidding_status == '0'){
                $shipmentIds  =  $this->dao->selectList('shipment.getShipment',array('field'=>'id','status'=>'1'));
                $shipment_id = array('0');
                foreach($shipmentIds AS $key=>$val){
                    $shipment_id[] =$val->id;
                }
            }
            elseif($params->bidding_status == '1'){
                $shipment_param = ['field' => 't.shipment_id','status' => '1'];
            }
            elseif($params->bidding_status == '2'){
                $shipment_param = ['field' => 't.shipment_id','evaluation' => '1'];
            }
        }
        if($params->over_price != ''){
            $shipment_param = ['field' => 't.shipment_id','over_price' => $params->over_price];
        }
        if(!empty($shipment_param)){
            $shipment_id = array('0');
            $shipment_ids  =  $this->dao->selectList('tender.searchById_tender',$shipment_param);
            if(!empty($shipment_ids)){
                foreach($shipment_ids AS $key=>$val){
                    $shipment_id[] =$val->shipment_id;
                }
            }
        }
        if(!empty($shipment_id)){
            $params->shipment_id = $shipment_id;
        }

        $params->sortColumns = 's.create_time desc';
        $rt = $this->dao->selectPage('tender.getShipments', $params);

        if ($rt->totalCount > 0) {
            //处理数据
            foreach ($rt->result as $key => $value) {
                if ($value->business_type == 1) {
                    $rt->result[$key]->business_type = '省内';
                } else {
                    $rt->result[$key]->business_type = '省外';
                }
                if($value->tender_limit != null && $value->tender_limit != '' && $value->tender_limit !== undefined ){
                    if($value->tender_status == '1'){
                        $value->tender_status_view = '竞标中';
                    }
                    if($value->tender_status == '2' || $value->tender_status == '3' ){
                        $value->tender_status_view = '已评标';
                    }
                }
                else{
                    $value->tender_status_view = '未发标';
                }
            }
        }
        return $rt;
    }
}