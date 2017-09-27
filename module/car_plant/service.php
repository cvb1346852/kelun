<?php
/** sunjie
 * @author zsq
 * The service file of carrier module.
 */
class car_plantService extends service
{


    /**
     * The search page of carrier module.
     *
     */
    public function search ($fixer)
    {
        $params = fixer::input($fixer)->get();
        if($params->toloProvince != '' || $params->toloCity != '' || $params->toloProvince2 != '' || $params->toloCity2 != ''  ){
            $routeTruck = $this->dao->selectList('tender.selectRouteTruck', ['from_province'=>$params->toloProvince ,'from_city'=>$params->toloCity,'to_province'=>$params->toloProvince2,'to_city'=>$params->toloCity2 ]);
            $truck_source_id_array = array('0'=>'0');
            foreach($routeTruck AS $key=>$val){
                $truck_source_id_array[]=$val->truck_source_id;
            }
            $params->truck_source_id = $truck_source_id_array;
        }
        $trucksInfo = $this->dao->selectPage('car_plant.warehouse_selectPage', $params);
        $phones = [];
        if($trucksInfo->result){
        	foreach ($trucksInfo->result as $_row){
        		$phones[] = $_row->driver_phone;
        	}
        	$historys = $this->dao->selectList('car_plant.lastPoint',array('phones'=>$phones));
        	$_histroys = [];
        	foreach ($historys as $his){
        		$_histroys[$his->phone] = $his;
        	}
        	foreach ($trucksInfo->result as $_row){
        		$_row->type = $_histroys[$_row->driver_phone]->type;
        		$_row->address = $_histroys[$_row->driver_phone]->address;
        		$_row->time = $_histroys[$_row->driver_phone]->time;
        	}
        }
        
        return $trucksInfo;
    }
    //红黑名单
    function blacklist_change($fixer){
        $params = fixer::input($fixer)->get();
        $warehouse = $this->dao->selectOne('warehouse.getByOrgcode', array('orgcode' => $this->app->user->organ->orgcode));
        $params->warehouse_id = $warehouse->id;

        $this->dao->insert('car_plant.saveblack_list',array('truck_source_id'=>$params->truck_source_id,'type'=>$params->type,'remark'=>$params->remark,'warehouse_id'=>$params->warehouse_id));
        $result = $this->dao->update('car_plant.updatetruck',array('red_black'=>$params->type,'id'=>$params->truck_source_id));
        if($result == '1'){
            return array("code"=>'0',"message"=>'修改成功！');
        }
        else{
            return array("code"=>'1',"message"=>'修改失败！');
        }
    }

    //查看车辆详情
    function truck_source_info($fixer){
        $params = fixer::input($fixer)->get();
        $truck_source_info = $this->dao->selectOne('car_plant.truck_source_info', array('truck_source_id' => $params->truck_source_id));
        if($truck_source_info->total_grade){
            $grade=json_decode($truck_source_info->total_grade,true);
            $div=$grade[5]+$grade[4]+$grade[3]+$grade[2]+$grade[1];
            if($div==0){
                $div=1;
            }
            $truck_source_info->total_grade=($grade[5]*5+$grade[4]*4+$grade[3]*3+$grade[2]*2+$grade[1]*1)/$div;
        }else{
            $truck_source_info->total_grade='0';
        }
        $truck_source_relation = $this->dao->selectList('car_plant.truck_source_relation', array('truck_source_id' => $params->truck_source_id));
        $truck_source_info->relation = $truck_source_relation;
        //历史承运
        $truck_source_info->driveShps = $this->dao->selectList('car_plant.getDriveShpGroup',$truck_source_info);

        return $truck_source_info;
    }


    //定位
    function lbs($fixer){
        $params = fixer::input($fixer)->get();
        //验证定位合法性
        $lastLbs = $this->dao->selectOne('car_plant.lbs_history', array('truck_source_id' => $params->truck_source_id));
        $LbsCount = $this->dao->selectOne('car_plant.lbs_history_count', array('today'=>date('Y-m-d'),'tomorrow'=> date('Y-m-d',strtotime('+1 day')),'orgcode'=>$this->app->user->organ->orgcode,'type'=>'2'));

        if(strtotime($lastLbs->lastLbs)+1800 >= time()){
           return array('code'=>'1','message'=>'每辆车半个小时最多定位一次!');
        }
        if($LbsCount->truck_source_count >= '5'){
            return array('code'=>'1','message'=>'一天最多能定位5辆车!');
        }

        $truck_source_info = $this->dao->selectOne('car_plant.truck_source_info', array('truck_source_id' => $params->truck_source_id));
       // $truck_source_info->driver_phone = '15129315581';
        $data = array('carrier_id'=>'','type'=>'1','truck_source_id'=>$params->truck_source_id,'carnum'=>$truck_source_info->carnum,'phone'=>$truck_source_info->driver_phone);
        $lbs_return = $this->loadService('history')->lbsSendLocation_NoRedis($data);
        if($lbs_return['code'] == '0'){
            //写入定位历史表
            $carrier = $this->dao->selectOne('shipment.checkeCarrier', array('orgcode' => $this->app->user->organ->orgcode));
            $is_carrier = empty($carrier)?'1':'2';
            $this->dao->insert('car_plant.save_lbs_history', array('truck_source_id' => $params->truck_source_id,'type'=>'2','user_type'=>$is_carrier,'orgcode'=>$this->app->user->organ->orgcode,'shipment_id'=>'','address'=>$lbs_return['msg']));

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
                return array('code'=>'1','message'=>'定位失败，请查看是否欠费');
            }
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
        $data =  $this->dao->selectOne('car_plant.getTruckSourceById',$fixer);
        if(isset($data->carriage_type) && $data->carriage_type){
            $carriage_name =  $this->dao->selectOne('truck_source.getCarriageType',['id'=>$data->carriage_type]);
            $data->carriage_type_name = isset($carriage_name->name) ? $carriage_name->name : '其它';
        }
        return $data;
    }

    //修改司机信息
    function change_driver($fixer){
        $params = fixer::input($fixer)->get();
        $restut = $this->dao->update('car_plant.change_driver', array('truck_source_id' => $params->truck_source_id,'driver_name' => $params->driver_name,'id_card' => $params->id_card,'carnum' => $params->carnum,'car_length' => $params->car_length,'carriage_type' => $params->carriage_type,'rated_load' => $params->rated_load));

        return array('code'=>'0','message'=>'修改成功');

    }
}