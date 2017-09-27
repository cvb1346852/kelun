<?php
/**
 * @author zsq
 * The service file of contractService module.
 */
class contractService extends service
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * The search page of contractService module.
     *
     */

    public function search ($fixer)
    {
        $params = fixer::input($fixer)->get();
        $warehouse = $this->loadService('carrier')->_getWarehouse();
        if(!isset($warehouse->id) || !$warehouse->id) return['totalCount' => 0, 'result' => []];
        $params->warehouse_id = $warehouse->id;
        $data =  $this->dao->selectPage('contract.selectPage',$params);
        if($data->result){
            $warehouse_id = $carrier_id = $W = $C = [];
            foreach ($data -> result as $v){
                $warehouse_id[] = $v->warehouse_id;
                $carrier_id[] = $v->carrier_id;
            }
            $warehouse = $this->dao->selectList('contract.selectWarehouse',['idIN'=>$warehouse_id]);
            $carrier   = $this->dao->selectList('contract.selectCarrier',['idIN'=>$carrier_id]);
            foreach($warehouse as $v){
                $W[$v->id] = $v->name;
            }
            foreach($carrier as $v){
                $C[$v->id] = $v->carrier_name;
            }
            foreach ($data -> result as $v){
                $v->warehouse_name = isset($W[$v->warehouse_id]) ? $W[$v->warehouse_id] : '';
                $v->carrier_name = isset($C[$v->carrier_id]) ? $C[$v->carrier_id] : '';
            }
        }
        return $data;
    }


    /**
     * The save page of contract module.
     *
     */
    public function save ($fixer)
    {
        $fixer = fixer::input($fixer)->getArray();
        //检测参数
        $must = ['code','phone','start_time','end_time','carrier_id','file'];
        foreach($must as $v){
            if(!isset($fixer[$v]) || !$fixer[$v])
                throw new RuntimeException('请将表单填写完整', 2);
        }
        // array_map(function($i){if($i==='')throw new RuntimeException('请将表单填写完整', 2); },$fixer);
        $warehouse = $this->loadService('carrier')->_getWarehouse();
        if(!isset($warehouse->id) || !$warehouse->id)  throw new RuntimeException('基地信息异常', 2);
        $fixer['warehouse_id'] = $warehouse->id;
        if(isset($fixer['id'])) return  $this->dao->update('contract.update',$fixer);
        $fixer['id'] =  guid();
        $fixer['last_update'] = $this->app->user->id;
        return  $this->dao->insert('contract.insert',$fixer);
    }

    /**
     * The getById page of contract module.
     *
     */
    public function getById ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!$fixer->id) return [];
        $data =  $this->dao->selectOne('contract.getById',$fixer);
        if(isset($data->carrier_id) && $data->carrier_id){
            $carrier   = $this->dao->selectOne('contract.selectCarrier',['idIN'=>[$data->carrier_id]]);
            $data->carrier_name = isset($carrier->carrier_name) ? $carrier->carrier_name : '';
        }
        return $data;
    }

    /**
     * The getById page of contract module.
     *
     */
    public function getByGroup ($fixer)
    {
        $params = fixer::input($fixer)->get();
        $warehouse = $this->loadService('carrier')->_getWarehouse();
        if(!isset($warehouse->id) || !$warehouse->id) return[];
        $params->warehouse_id = $warehouse->id;
        $params->limit = 1;
        return  $this->dao->selectList('contract.getByGroup',$params);
    }

    /**
     * The del page of contract module.
     *
     */
    public function del ($fixer)
    {
        $fixer = fixer::input($fixer)->get();
        if(!$fixer->id) return [];
        $ids = explode(',',$fixer->id);
        foreach($ids as $v){
             $this->dao->update('contract.del',['id'=>$v,'last_update'=> $this->app->user->id]);
        }
        return true;
    }

    /**
     * 获取合同编号
     * 2016-8-25
     * ZHM
     */
    public function getContractCode($args){
        $params = fixer::input($args)->get();
        if (!property_exists($params, 'code') || trim($params->code) == '') {
            return [];
        }
        $warehouse = $this->loadService('carrier')->_getWarehouse();
        if (!isset($warehouse->id) || !$warehouse->id) {
            return [];
        }
        $params->warehouse_id = $warehouse->id;
        return $this->dao->selectList('contract.getContractCode', $params);
    }

    /**
     * Desc:合同到期提醒
     * @Author Lvison
     */
    public function expireRemind(){
        $params = array('date' => date('Y-m-d',strtotime('+20day')));//提前20天发送到期提醒
        $contract = $this->dao->selectList('contract.getContract',$params);
        foreach ($contract as $key => $item) {
            $msg_content = sprintf($this->config->messageModel->smsContract, $item->code,$item->end_time);
            $this->loadService('client')->sendSms($msg_content, $item->phone);
        }
    }

}