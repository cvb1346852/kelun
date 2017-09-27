<?php
/**
 * @author zsq
 * The service file of warehouse module.
 */
class warehouseService extends service
{
    public function __construct()
    {
        parent::__construct();
        $this->group =['name','phone'];
    }

    /**
     * Desc 基地管理列表页面
     * @param $fixer
     * @Author Lvison
     * @return Pager
     */
    public function search ($fixer){
        $fixer = fixer::input($fixer)->getArray();
        $param = array(
            'pageSize' => $fixer['pageSize'] ? $fixer['pageSize'] :10,
            'pageNo' => $fixer['pageNo'] ? $fixer['pageNo'] :1,
            'sortColumns' => 'w.create_time desc'
        );
        $result =  $this->dao->selectPage('warehouse.selectPage',$param);
        $audits = array();
        foreach($result->result as $key=> $value){
            array_push($audits,$value->first_audit_id);
            array_push($audits,$value->second_audit_id);
            $value->tender_type  = $value->tender_type ?($value->tender_type == 1 ? '显示最低报价' : '显示所有报价') : '';
        }

        $audit_user = $this->dao->selectList('warehouse.getWarehouseUser',array('ids'=>$audits));
        $users = array();
        foreach($audit_user as $key=>$value){
            $users[$value->id] = $value;
        }

        foreach ($result->result as $key=>&$item) {
            $item->first_audit = $users[$item->first_audit_id] ? $users[$item->first_audit_id]: '';
            $item->second_audit = $users[$item->second_audit_id] ? $users[$item->second_audit_id] : '';
            $item->first_audit_phone = $users[$item->first_audit_id] ? $users[$item->first_audit_id]->name .'('.$users[$item->first_audit_id]->phone.')':'';
            $item->second_audit_phone = $users[$item->second_audit_id] ? $users[$item->second_audit_id]->name.'('.$users[$item->second_audit_id]->phone.')' : '';
        }

        return $result;
    }


    /**
     * The save page of warehouse module.
     *
     */
    public function save ($fixer)
    {
        $fixer = fixer::input($fixer)->getArray();
        if(empty($fixer['name']) || empty($fixer['platform_code']) || empty($fixer['ddlProvince']) || empty($fixer['ddlCity']) || empty($fixer['address']) || empty($fixer['person']) || empty($fixer['phone'])  ){
            throw new RuntimeException('请完成必填项填写', 2);
        }

        $valid = $this->dao->selectList('warehouse.valid',array('name'=>$fixer['name'],'platform_code'=>$fixer['platform_code']));
        if(count($valid) >= 1 && empty($fixer['id'])){
            throw new RuntimeException('该基地已存在，请检查基地名称和编码',2);
        }
        if(count($valid) > 1 && !empty($fixer['id'])){
            throw new RuntimeException('该基地已存在，请检查基地名称和编码',2);
        }
        $innerArr = array_merge([
            'id'=>guid(),
            'name'=>'',
            'type'=>1,
            'phone'=>$fixer['phone'],
            'province'=>$fixer['ddlProvince'],
            'city'=>$fixer['ddlCity'],
            'address'=>'',
            'lng'=>'',
            'lat'=>'',
            'create_time'=>'',
            'update_time'=>'',
            'last_update'=>$this->app->user->id,
            'platform_code'=>$fixer['platform_code'],
            'qrcode_url'=>'',
            'qrcode_result'=>''
        ],$fixer);
        if($fixer['id']) return  $this->dao->update('warehouse.update',$innerArr);
        return  $this->dao->insert('warehouse.insert',$innerArr);
    }

    /**
     * The getById page of warehouse module.
     *
     */
    public function getById ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!$fixer->id) return [];
        return $this->dao->selectOne('warehouse.getById',$fixer);
    }


    /**
     * The getByGroup page of warehouse module.
     *
     */
    public function getByGroup ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!in_array($fixer->group,$this->group)) return [];
        return  $this->dao->selectList('warehouse.getByGroup',$fixer);
    }

    /**
     * 树状
     * @return unknown
     */
    public function getOrgTree(){
        $organ = $this->app->user->organ;
        $args = array(
            'pageSize'=>1000,
            'orgcode'=>$organ->orgcode,
            'free'=>0
        );
        $result = $this->loadService('ucenter.org')->findOrgans($args);
        $user = Ucenter::init()->getUserInfo();
        $orgroot = $user->organ->orgcode;
        $result = $result->result;
        $data = array();
        if ($result) {
            foreach ($result as $value) {
                $id2value[$value->id] = $value->orgcode;
            }
            foreach ($result as $value) {
                $orgcode = $value->orgcode;
                $name = $value->name;
                $parentid = $value->parentid;
                $porgcode = 0;
                $isopen = 1;
                $ischecked = 0;
                if ($value->orgcode != $orgroot && $parentid) {
                    $porgcode =  isset($id2value[$value->parentid]) ? $id2value[$value->parentid] : 0;
                    $isopen = 0; //关闭
                }
                $data[] = array(
                    'id' => $orgcode,
                    'name' => $name,
                    'pId' => $porgcode,
                    'open' => $isopen,
                    'checked' => $ischecked
                );
            }
        }
        $result = array('data' => $data,'res'=>array());
        return $result;
    }

    /**
     * getRoute 微信页面查询
     */
    public function getRoute($fixer){
        $fixer = fixer::input($fixer)->get();
        if(!$fixer->from || !$fixer->to) return [];
        $pageNo = $fixer->pageNo ? $fixer->pageNo : 1;
        $pageSize = $fixer->pageSize ? $fixer->pageSize : 10;
        $route =  $this->dao->selectOne('warehouse.getRoute',$fixer);
        $return = new Pager();
        $return->result = $Car = [];
        if(isset($route->id) && $route->id){
            $carnums = $this->dao->selectList('warehouse.getRouteTruck',['route_id'=>$route->id]);
            if($carnums){
                foreach($carnums as $v){
                    $Car[] = $v->carnum;
                }
                $return =  $this->dao->selectPage('warehouse.getRouteTruckById',['carIN'=>array_unique($Car),'pageNo'=>$pageNo,'pageSize'=>$pageSize]);
                if($return->result){
                    $AllCity =  $this->dao->selectList('truck_source.selectCity',['time'=>date('Y-m-d H:i:s',strtotime('-7 days')),'carnum'=>array_unique($Car),'order'=>1]);
                    foreach($AllCity as $v){
                        $Car[$v->carnum] = $v->city;
                    }
                    foreach($return->result as $v){
                        $v->city = isset($Car[$v->carnum]) ? $Car[$v->carnum] : '';
                    }
                }
            }
        }
        return $return;
    }

    /**
     * Desc:删除基地
     * @param $res
     * @Author Lvison
     * @return array
     */
    public function delete($res){
        if(!empty($res['ids'])){
            $ids = explode(',',$res['ids']);
            $this->dao->update('warehouse.deleteWarehouse',array('ids'=>$ids));
            return array('code'=>0);
        }else{
            return array('code'=>1,'message'=>'请选择删除项');
        }
    }

    /**
     * Desc:设置G7机构编码
     * @param $res
     * @Author Lvison
     * @return array
     */
    public function setOrgCode($res){
        if(empty($res['id']) || empty($res['orgcode'])){
            return array('code'=>1,'message'=>'缺少参数');
        }
        $result = $this->dao->update('warehouse.setOrgCode',array('id'=>$res['id'],'orgcode'=>$res['orgcode']));
        if($result){
            return array('code'=>0);
        }else{
            return array('code'=>1,'message'=>'数据更新失败');
        }
    }

    /**
     * Desc:招标设置
     * @param $res
     * @Author Lvison
     * @return array
     */
    public function tenderSet($res){
        if(empty($res['id'])){
            return array('code'=>1,'message'=>'缺少参数id');
        }

        //第一审批人
        $first_audit = array(
            'name' => $res['first_audit_name'],
            'phone' => $res['first_audit_phone'],
            'position' => $res['first_audit_position'],
            'type' => 2,
            'warehouse_id' => $res['id'],
            'update_user' => $this->app->user->id,
            'update_time' => date('Y-m-d H:i:s'),
            'id'=>$res['first_audit_id'] ? $res['first_audit_id'] : guid()
        );
        if($res['first_audit_id']){
            if($this->validPhone($res,'update')) {
                $this->dao->update('warehouse.updateTenderUser', $first_audit);
            }else{
                return array('code'=>1,'message'=>'第一审批人手机已存在!');
            }
        }else{
            if($this->validPhone($res,'insert')) {
                $this->dao->insert('warehouse.insertTenderUser', $first_audit);
            }else{
                return array('code'=>1,'message'=>'第一审批人手机已存在!');
            }
        }

        //第二审批人
        $second_audit = array(
            'name' => $res['second_audit_name'],
            'phone' => $res['second_audit_phone'],
            'position' => $res['second_audit_position'],
            'type' => 2,
            'warehouse_id' => $res['id'],
            'update_user' => $this->app->user->id,
            'update_time' => date('Y-m-d H:i:s'),
            'id' => $res['second_audit_id'] ? $res['second_audit_id'] : guid()
        );

        if( $res['second_audit_id']){
            if($this->validPhone($res,'update')){
                $this->dao->update('warehouse.updateTenderUser',$second_audit);
            }else{
                return array('code'=>1,'message'=>'第二审批人手机已存在!');
            }
        }else{
            if($this->validPhone($res,'insert')){
                $this->dao->insert('warehouse.insertTenderUser', $second_audit);
            }else{
                return array('code'=>1,'message'=>'第二审批人手机已存在!');
            }
        }

        //招标设置
        $param = array('warehouse_id'=>$res['id'],
            'tender_type' => !empty($res['tender_type']) ? $res['tender_type'] : 1,
            'first_audit_id' => $first_audit['id'] ,
            'second_audit_id' => $second_audit['id'] ,
            'create_time' => date('Y-m-d H:i:s'),
            'update_time' => date('Y-m-d H:i:s'),
            'deleted' => 0,
            'id' => guid()
        );
        $result = $this->dao->insert('warehouse.tenderSet',$param);
        if($result){
            return array('code'=>0);
        }else{
            return array('code'=>1,'message'=>'数据更新失败');
        }
    }

    /**
     * Desc:调度电话唯一性判断
     * @param $res
     * @param $control
     * @Author Lvison
     * @return bool
     */
    private function validPhone($res,$control){
        $userList = $this->dao->selectList('warehouse.countPhone',array('phone'=>$res['first_audit_phone'],'warehouseId'=>$res['id'],'type'=>$res['type']));
        if(count($userList) < 1){
            return true;
        }else{
            if($control == 'update'){
                return true;
            }else{
                return false;
            }
        }
        return false;
    }

    /**
     * 2016-8-29
     * 查询基地关联承运商车辆
     * ZHM
     */
    public function carrierTruck($args){
        $params = fixer::input($args)->get();
        $truck_source_service = $this->loadService('truck_source');
        //获取当前基地关联的承运商id
        $carrierids = $truck_source_service->_getCarriers();
        if (!$carrierids || count($carrierids) == 0) {
            return array('result' => [], 'totalCount' => 0);
        }
        //处理承运商id数据
        $ids = array();
        foreach ($carrierids as $key => $value) {
            $ids[] = $value->id;
        }
        $params->carrier_idIN = $ids;
        $params->status = 3;
        //根据承运商id获取车辆信息-审核通过的车辆
        $trucksInfo = $this->dao->selectPage('truck_source.warehouse_selectPage', $params);
        if (count($trucksInfo->result) > 0) {
            $data = $trucksInfo->result;
            //处理厢型和位置信息数据
            //获取所有车辆厢型
            $AllCarriageType =  $this->dao->selectList('truck_source.getCarriageType',[]);
            $type = array();
            foreach ($AllCarriageType as $key => $value) {
                //处理厢型数据
                $type[$value->id] = $value->name;
            }
            //获取所有车辆车牌号
            $carnums = array();
            foreach($data as $value){
                $carnums[] = $value->carnum;
            }
            //获取所有车辆7天内位置信息
            $AllCity =  $this->dao->selectList('truck_source.selectCity',['time'=>date('Y-m-d H:i:s',strtotime('-7 days')),'carnum'=>array_unique($carnums),'order'=>1]);
            //处理位置信息数据
            $positions = array();
            foreach ($AllCity as $key => $value) {
                $positions[$value->carnum] = $value->city;
            }
            foreach ($data as $key => $value) {
                //厢型数据
                $data[$key]->carriage_type = !empty($type[$value->carriage_type]) ? $type[$value->carriage_type] : '其他';
                //位置数据
                $data[$key]->city = !empty($positions[$value->carnum]) ? $positions[$value->carnum] : '无';
            }
            $trucksInfo->result = $data;
        }
        return $trucksInfo;
    }

    /**
     * 2016-8-29
     * 获取搜索条件
     * ZHM
     */
    public function getSearchCondition($args){
        $params = fixer::input($args)->get();
        $data = array();
        $truck_source_service = $this->loadService('truck_source');
        if (!property_exists($params, 'name') || $params->name == '') {
            return array();
        } else if ($params->name == 'carriage_type') {
            //查询箱型
            $rt = $this->dao->selectList('truck_source.getCarriageType', array('name' => $params->value));
            if (count($rt) > 0) {
                foreach ($rt as $key => $value) {
                    $data[$value->id] = $value->name;
                }
            }
        } else if ($params->name == 'carrier_id') {
            //查询承运商
            $rt = $this->dao->selectList('truck_source.selectCarriers', array('orgcode' => $this->app->user->organ->orgcode, 'carrier_name' => $params->value));
            if (count($rt) > 0) {
                foreach ($rt as $key => $value) {
                    $data[$value->id] = $value->name;
                }
            }
        } else {
            //获取当前基地关联的承运商id
            $carrierids = $truck_source_service->_getCarriers();
            if (!$carrierids || count($carrierids) == 0) {
                return array('result' => [], 'totalCount' => 0);
            }
            //处理承运商id数据
            $ids = array();
            foreach ($carrierids as $key => $value) {
                $ids[] = $value->id;
            }
            $params->carrier_idIN = $ids;
            $data = $this->dao->selectList('truck_source.getSearchCondition', $params);
        }
        return $data;
    }
    /**
     * 2016-8-30
     * 添加基地直属车辆
     * ZHM
     */
    public function addImmediate($args){
        $params = fixer::input($args)->get();
        //获取基地id
        $warehouse = $this->dao->selectOne('warehouse.getByOrgcode', array('orgcode' => $this->app->user->organ->orgcode));
        if (empty($warehouse)) {
            throw new RuntimeException("获取基地信息失败", 2);
        }
        if (property_exists($params, 'id') && $params != '') {
            //获取车辆id
            $ids = explode(',', $params->id);
            if (count($ids) > 0) {
                //拼装插入数据
                $time = date('Y-m-d H:i:s');
                $data = array();
                foreach ($ids as $id) {
                    $row = array(
                        'warehouse_id'    => '"'.$warehouse->id.'"',
                        'truck_source_id' => '"'.$id.'"',
                        'create_time'     => '"'.$time.'"',
                        'update_time'     => '"'.$time.'"',
                        'last_update'     => '"'.$this->app->user->id.'"'
                    );
                    $data[] = '('.implode(',', $row).')';
                }
                $data = implode(',', $data);
                try {
                    $rt = $this->dao->insert('warehouse.addImmediate', array('data' => $data));
                } catch (Exception $e) {
                    throw new RuntimeException($e->getMessage(), 2);
                }
                return true;
            }
        }
        throw new RuntimeException('请选择添加项', 2);
    }

    /**
     * 2016-8-30
     * 查看基地直属车辆
     * ZHM
     */
    public function immediateTruck($args) {
        $params = fixer::input($args)->get();
        //获取当前基地id
        $warehouse = $this->dao->selectOne('warehouse.getByOrgcode', array('orgcode' => $this->app->user->organ->orgcode));
        $params->warehouse_id = $warehouse->id;

        $trucksInfo = $this->dao->selectPage('warehouse.immediateTruck', $params);

        if (count($trucksInfo->result) > 0) {
            $data = $trucksInfo->result;
            //处理厢型和位置信息数据
            //获取所有车辆厢型
            $AllCarriageType =  $this->dao->selectList('truck_source.getCarriageType',[]);
            $type = array();
            foreach ($AllCarriageType as $key => $value) {
                //处理厢型数据
                $type[$value->id] = $value->name;
            }
            //获取所有车辆车牌号
            $carnums = array();
            foreach($data as $value){
                $carnums[] = $value->carnum;
            }
            //获取所有车辆7天内位置信息
            $AllCity =  $this->dao->selectList('truck_source.selectCity',['time'=>date('Y-m-d H:i:s',strtotime('-7 days')),'carnum'=>array_unique($carnums),'order'=>1]);
            //处理位置信息数据
            $positions = array();
            foreach ($AllCity as $key => $value) {
                $positions[$value->carnum] = $value->city;
            }
            foreach ($data as $key => $value) {
                //厢型数据
                $data[$key]->carriage_type = !empty($type[$value->carriage_type]) ? $type[$value->carriage_type] : '其他';
                //位置数据
                $data[$key]->city = !empty($positions[$value->carnum]) ? $positions[$value->carnum] : '无';
            }
            $trucksInfo->result = $data;
        }
        return $trucksInfo;
    }

    /**
     * 2016-8-29
     * 获取搜索条件
     * ZHM
     */
    public function getImmediateSearchCondition($args){
        $params = fixer::input($args)->get();
        $data = [];
        //获取当前基地id
        $warehouse = $this->dao->selectOne('warehouse.getByOrgcode', array('orgcode' => $this->app->user->organ->orgcode));
        $params->warehouse_id = $warehouse->id;
        if (!property_exists($params, 'name') || $params->name == '') {
            return array();
        } else {
            $data = $this->dao->selectList('warehouse.getImmediateSearchCondition', $params);
        }
        return $data;
    }

    /**
     * 2016-8-30
     * 删除基地直属车辆
     * ZHM
     */
    public function immediateTruckDelete($args){
        $params = fixer::input($args)->get();
        //判断参数
        if (property_exists($params, 'id') && $params->id != '') {
            $ids = explode(',', $params->id);
            if (count($ids) > 0) {
                unset($params->id);
                //删除操作
                $params->idIN = $ids;
                $params->deleted = 1;
                $params->update_time = date('Y-m-d H:i:s');
                $params->last_update = $this->app->user->id;
                try {
                    $this->dao->update('warehouse.updateImmediate', $params);
                } catch (Exception $e) {
                    throw new RuntimeException($e->getMessage(), 2);
                }
                return true;
            }
        }
        throw new RuntimeException('请选择删除项', 2);
    }

    /**
     * Desc:打印基地二维码
     * @Author Lvison
     * @return mixed
     */
    public function _print ()
    {
        $warehouse = $this->loadService('carrier')->_getWarehouse();
        if(!isset($warehouse->id))  throw new RuntimeException('无查询到对应的基地/片区信息', 2);
        if(isset($warehouse->qrcode_url) && $warehouse->qrcode_url)  return $warehouse->qrcode_url;
        $data =  $this->loadService('wechat')->getQrCode('shipment',['scene_str'=>$warehouse->id]);
        if($data && isset($data['qrCodeUrl']) && isset($data['url'])){
            $this->dao->update('warehouse.update',['id'=>$warehouse->id,'qrcode_url'=>$data['qrCodeUrl'],'qrcode_result'=>$data['url']]);
            return $data['qrCodeUrl'];
        }
        throw new RuntimeException('获取二维码信息失败，请稍后再试', 2);
    }
    
    public function genOpt($args){
    	return $this->dao->selectList('warehouse.genOpt',$args);
    }
}