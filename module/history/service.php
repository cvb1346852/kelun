<?php
/**
 * LBS记录历史轨迹类
 * Author sunjie
 * 2016-09-19
 */
require_once dirname(dirname(dirname( __FILE__ ))).'/config/client.config.php';

class historyService extends service{

    //获取LBS定位
    public function lbsSendLocation($mobile,$type){
    	
    	//return array('code' => 1, 'msg' => '查询失败');

        $lbsCarToken = json_decode(redisCache("lbs_car"),true);
        $lbsAddress = $lbsCarToken[$mobile];

        //调度获取位置判断次数
        if($type == '1'){
            if($lbsAddress['times'] >= 2 ){
                return array('code' => 2, 'msg' => '查询次数已用完');
                return false;
            }
        }
        $post_url = LBS_SENDLOCATION;
        $params = 'companyid='.LBS_ID.'&companypwd='.LBS_PWD.'&mobile='.$mobile.'&opertype=1';

        $result = $this->loadService('client')->init_post($post_url,$params);
        $decodeResult = htmlspecialchars_decode($result);
        $xml = simplexml_load_string($decodeResult);
        tools::datalog('lbs定位结果'.var_export($xml,true),'lbsLocation_');

        $address = array();
        foreach($xml->children() as $a){
            foreach($a as $key=>$val){
                if($val['name'] == 'address'){
                    $address['address'] =   (string) $val['value'];
                }
                elseif($val['name'] == 'X'){
                    $address['lng'] = (string) $val['value'];
                }
                elseif($val['name'] == 'Y'){
                    $address['lat'] =  (string) $val['value'];
                }
                elseif($val['name'] == 'result'){
                    $result =  (string) $val['value'];
                }

            }
        }
        if($result == '1'){
            $lbsAddress['address'] = $address['address'] ;
            $lbsAddress['lng'] =   $address['lng'];
            $lbsAddress['lat'] =  $address['lat'];
            $lbsAddress['time'] = date('Y-m-d H:i:s');
            if($type == '1') {
                $lbsAddress['times'] = $lbsAddress['times'] + 1;
            }
            if($type == '2') {
                $lbsAddress['timingTimes'] = $lbsAddress['timingTimes'] + 1;
                $lbsAddress['lastTiming'] = time();
            }
            tools::datalog('入库参数'.var_export($lbsAddress,true),'lbsLocation_');
            //写入history_point表
            if ($rt =$this->dao->insert("history.insertLbs", $lbsAddress)) {
                $this->dao->insert('car_plant.save_lbs_history', array('truck_source_id' => $lbsAddress['truck_source_id'],'type'=>'4','user_type'=>'2','orgcode'=>$lbsAddress['orgcode'],'shipment_id'=>$lbsAddress['shipment_id'],'address'=>$address['address']));

                //更新缓存
                $lbsCarToken[''.$mobile.''] = $lbsAddress;
                redisCache("lbs_car",$lbsCarToken);
                return array('code' => 0, 'msg' => $address['address']);
            }
            else{
                return array('code' => 1, 'msg' => 'LBS写入失败！');
            }
        }
        else{
            if($type == '2') {
                $lbsAddress['timingTimes'] = $lbsAddress['timingTimes'] + 1;
                $lbsAddress['lastTiming'] = time();
                //更新缓存
                $lbsCarToken[''.$mobile.''] = $lbsAddress;
                redisCache("lbs_car",$lbsCarToken);
            }

            return array('code' => 1, 'msg' => '查询失败');
        }


    }
/*
    //LBS定位自动任务
    public function lbsTiming(){
        $now = time();
        $lbsCarToken = json_decode(redisCache("lbs_car"),true);
        tools::datalog('lsbLocation'.var_export($lbsCarToken,true),'lbsLocation_');
        if(!empty($lbsCarToken)){
            $lbsCount = 0;
            foreach($lbsCarToken AS $key=>$val){
                    if($val['timingTimes']<2){
                        //$val['plan_leave_time']+$val['timingValue']*$val['timingTimes'] < $now;
                        if(($val['plan_leave_time']+$val['timingValue']*$val['timingTimes'] < $now) && ($now <= $val['plan_leave_time']+$val['timingValue']*($val['timingTimes']+1) )){
                            $lbsCount += 1;
                            if($lbsCount <= 100){
                                $this->loadService('history')->lbsSendLocation($val['phone'],'2');
                            }
                            else{
                                break;
                            }
                        }
                    }

            }
        }
    }*/

    //LBS定位自动任务
    public function lbsTiming(){
        $now = time();
        $lbsCarToken = json_decode(redisCache("lbs_car"),true);
        //tools::datalog('lsbLocation'.var_export($lbsCarToken,true),'lbsLocation_');

        if(!empty($lbsCarToken)){
            $lbsCount = 0;
            foreach($lbsCarToken AS $key=>$val){
                $lbsCount += 1;
                if($lbsCount <= 100){
                    //省内
                    if($val['province'] == '1'){
                        //首次定位
                        if($val['timingTimes'] == '0'){
                            if(($now >= $val['plan_leave_time'] + 3600)){
                                $this->loadService('history')->lbsSendLocation($val['phone'],'2');
                            }
                        }
                        elseif($val['timingTimes'] > '0' && $val['timingTimes'] < '6'){
                            if(($now < $val['plan_leave_time']+3600*($val['timingTimes']+2)) && ($now >= $val['plan_leave_time']+3600*($val['timingTimes']+1))){
                                $this->loadService('history')->lbsSendLocation($val['phone'],'2');
                            }
                        }
                    }
                    //省外
                    elseif($val['province'] == '2'){
                        //首次定位
                        if($val['timingTimes'] == '0'){
                            if(($now >= $val['plan_leave_time'] + 14400)){
                                $this->loadService('history')->lbsSendLocation($val['phone'],'2');
                            }
                        }
                        elseif($val['timingTimes'] > '0' && $val['timingTimes'] < '11'){
                            if(($now < $val['plan_leave_time']+14400*($val['timingTimes']+2)) && ($now >= $val['plan_leave_time']+14400*($val['timingTimes']+1))){
                                $this->loadService('history')->lbsSendLocation($val['phone'],'2');
                            }
                        }
                    }
                }
                else{
                    break;
                }
            }
        }
    }
     //获取lbs定位列表
    public function getHistoryMsg($fixer){
        $params = fixer::input($fixer)->get();
        $rt = $this->dao->selectPage('history.getHistoryMsg', $params);
        $count=$this->dao->selectList('history.getcount', array('statistic_date'=>$params->statistic_date));
        $rt->totalCount=count($count);
        return $rt;
    }
       //导出功能
    public function getHistoryList($fixer){
        $params = fixer::input($fixer)->get();
        $rt = $this->dao->selectPage('history.getHistoryList', $params);
        return $rt;
    }

    /**
     * Desc:地图lbs展示
     * @param $res
     * @Author Lvison
     * @return array
     */
    public function getByShipmentId($res){
        if(empty($res['shipmentId'])){
            return array('history'=>array(),'event'=>array());
        }
        $shipment = $this->dao->selectOne('shipment.getShipmentsByIds',array('id'=>array($res['shipmentId'])));

        $param = array('from_time'=>$shipment->create_time,
            'to_time'=>$shipment->arrival_date ? $shipment->arrival_date : date('Y-m-d H:i:s'),
            'carnum' => $shipment->carnum
        );
        $historyPoint = $this->dao->selectList('history.getHistoryPoint',$param);
        $event = $this->dao->selectList('history.getReport',$res);
        return array('historyPoint'=>$historyPoint,'event'=>$event);
    }


    //手动获取LBS定位（无缓存）
    public function lbsSendLocation_NoRedis($data){
    	
    	//return array('code' => 1, 'msg' => '查询失败');

        $post_url = LBS_SENDLOCATION;
        $params = 'companyid='.LBS_ID.'&companypwd='.LBS_PWD.'&mobile='.$data['phone'].'&opertype=1';

        $result = $this->loadService('client')->init_post($post_url,$params);
        $decodeResult = htmlspecialchars_decode($result);
        $xml = simplexml_load_string($decodeResult);
        tools::datalog('lbs定位结果'.var_export($xml,true),'lbsLocation_');

        $address = array();
        $lbsAddress = array();
        foreach($xml->children() as $a){
            foreach($a as $key=>$val){
                if($val['name'] == 'address'){
                    $address['address'] =   (string) $val['value'];
                }
                elseif($val['name'] == 'X'){
                    $address['lng'] = (string) $val['value'];
                }
                elseif($val['name'] == 'Y'){
                    $address['lat'] =  (string) $val['value'];
                }
                elseif($val['name'] == 'result'){
                    $result =  (string) $val['value'];
                }

            }
        }
        if($result == '1'){
            $lbsAddress['address'] = $address['address'] ;
            $lbsAddress['lng'] =   $address['lng'];
            $lbsAddress['lat'] =  $address['lat'];
            $lbsAddress['time'] = date('Y-m-d H:i:s');
            $lbsAddress['carrier_id'] = $data['carrier_id'];
            $lbsAddress['type'] = $data['type'];
            $lbsAddress['truck_source_id'] = $data['truck_source_id'];
            $lbsAddress['carnum'] = $data['carnum'];
            $lbsAddress['phone'] = $data['phone'];
            tools::datalog('入库参数'.var_export($lbsAddress,true),'lbsLocation_');
            //写入history_point表
            if ($rt =$this->dao->insert("history.insertLbs", $lbsAddress)) {
                return array('code' => 0, 'msg' => $address['address']);
            }
            else{
                return array('code' => 1, 'msg' => 'LBS写入失败！');
            }
        }
        else{

            return array('code' => 1, 'msg' => '查询失败');
        }


    }

}