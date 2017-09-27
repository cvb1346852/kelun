<?php

class biddingService extends service
{
    public function getShipments ($args)
    {

        $fixer = fixer::input($args);
        $params = $fixer->get();

        $params->role_condition = $this->getRoleCondition($params->orgcode);
        //$params->statistic_date = '1982-11-19 00:00 - 2016-11-15 23:59';
        //处理时间参数
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];

        $params->sortColumns = 's.create_time desc';

        $rt = $this->dao->selectPage('bidding.getShipments', $params);

        if ($rt->totalCount > 0) {
            //处理数据
            foreach ($rt->result as $key => $value) {
                if ($value->business_type == 1) {
                    $rt->result[$key]->business_type = '省内';
                } else {
                    $rt->result[$key]->business_type = '省外';
                }

            }
        }
        return $rt;
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
     * Desc: 获取招标的报价列表
     * @Author sunjie
     */
    function tenderQuoteList($res){
        $fixer = fixer::input($res);
        $params = $fixer->getArray();
        $AuditId=$this->dao->selectOne('tender.selectAuditId',array('orgcode'=>$this->app->user->organ->orgcode));
        if($AuditId->tender_type == '1'){
            $result = $this->dao->selectList('bidding.tenderQuoteListFirst',array('id'=>$params['shipmentId'],'tender_id'=>$params['tender_id']));
        }else{
            $result = $this->dao->selectList('bidding.tenderQuoteList',array('id'=>$params['shipmentId'],'tender_id'=>$params['tender_id']));
        }


        if(isset($result[0]->history)){
            $result[0]->history = str_replace('\n','<br>',$result[0]->history);
            $result[0]->history = json_decode($result[0]->history);
        }
        return $result;
    }
}
?>