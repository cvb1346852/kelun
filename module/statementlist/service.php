<?php
/**
 * @author Ivan
 * The service file of source_distribution module.
 */
class statementlistService extends service
{
    /**
     * 获取运输质量明细报表
     * Author ivan
     * 2017-1-3
     */

    public function getOrderTrans($args)
    {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        $roleName=$this->checkRole();
        if($roleName['roleName']=='warehouse'){
            $params->warehouse_id=$roleName['warehouse_id'];
        }
        if(isset($params->sortColumns)) $params->sortColumns='s.'.$params->sortColumns;
        $rt = $this->dao->selectPage('statementlist.getOrderTrans', $params);
        if($rt){
            foreach($rt->result as $key=>$val){
                $sum=0;
                $div=0;
                $grade=array();
                $order=$this->dao->selectList('statementlist.getOrderList',array('shipment_id'=>$val->id));
                if($order){
                    foreach($order as $k=>$v){
                        if(!empty($v->grade)){
                            $grade=json_decode($v->grade,true);
                        }else{
                            $grade['driver_taidu']=0;
                        }
                        $sum+=$grade['driver_taidu'];
                        $div++;
                    }
                    $rt->result[$key]->grade=number_format($sum/$div,2);
                }else{
                    $rt->result[$key]->grade='暂无评分';
                }
            }
        }
        return $rt;
    }
    public function getCarrierName($args){
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $rt = $this->dao->selectList('statementlist.getCarrierName', $params);
        return $rt;
    }

    public function getShipmentReport ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        /*角色权限管理*/
        $roleName = $this->checkRole();
        if($roleName['roleName'] == 'warehouse'){
            $params->warehouse_id = $roleName['warehouse_id'];
            $params->role_condition = " LEFT JOIN `warehouse` AS  w  on s.warehouse_id = w.id";
        }
        $rt = $this->dao->selectPage('statementlist.getShipmentReport', $params);
        $rt->user_type = $roleName['roleName'];
        return $rt;
    }
    /*基地被投诉报表*/
    public function getAppealWU ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        $params->responsible_type_w = true;
        return $rt = $this->dao->selectPage('statementlist.getAppealList', $params);
    }
    /*承运商被投诉报表*/
    public function getAppealCarrier ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        /*角色权限管理*/
        $roleName = $this->checkRole();
        if($roleName['roleName'] == 'warehouse'){
            $params->warehouse_id = $roleName['warehouse_id'];
            $params->role_condition = "LEFT JOIN `carrier` AS  c  on complain.responsible_name = c.carrier_name LEFT JOIN `carrier_warehouse` AS  cw  on c.id = cw.carrier_id";
        }
        $params->responsible_type_carrier = true;
        $rt = $this->dao->selectPage('statementlist.getAppealList', $params);
        $rt->roleName = $roleName['roleName'];
        return $rt;
    }
    /*获取基地/承运商名称*/
    public function getResultName($fixer)
    {
        $params = fixer::input($fixer)->get();
        if($params->result_type){
            if($params->result_type){
                $params->chart_name = $params->result_type == 1 ? 'carrier' : 'warehouse'; //查找的表
                $params->filed = $params->result_type == 1 ? 'carrier.carrier_name,carrier.id,carrier.g7s_orgcode' :  'warehouse.name,warehouse.id,warehouse.orgcode'; //查找的字段
                $params->type_warehouse = $params->result_type == 2 ? 'ok' : ''; //类型为2的是基地
                if( $params->result_type == 1 ){
                    $params->carrier_name = $params->responsible_name;
                    $params->carrier_status = true;
                }else if( $params->result_type == 2 ){
                    $params->name = $params->responsible_name;
                }
                /*角色权限管理*/
                $roleName = $this->checkRole();
                if($roleName['roleName'] == 'warehouse' AND $params->result_type == 1){
                    $params->warehouse_id = $roleName['warehouse_id'];
                    $params->role_condition = " LEFT JOIN `carrier_warehouse` AS  cw  on carrier.id = cw.carrier_id";
                }
                $result = $this->dao->selectList('statementlist.getResultName',$params);
            }
            return $result;
        }else{
            return false;
        }

    }
    /*获取全量司机名称*/
    public function getDriverNameList($fixer)
    {
        $params = fixer::input($fixer)->get();
        /*角色权限管理*/
        $roleName = $this->checkRole();
        if($roleName['roleName'] == 'warehouse'){
            $params->warehouse_id = $roleName['warehouse_id'];
            $params->role_condition = "LEFT JOIN `truck_source_carrier` AS  tsc  on ts.id = tsc.truck_source_id LEFT JOIN `carrier_warehouse` AS  cw  on tsc.carrier_id = cw.carrier_id";
        }
        $result = $this->dao->selectList('statementlist.getDriverNameList',$params);
        return $result;
    }

    /**
     * 获取废标报表
     * Author ivan
     * 2017-1-3
     */
    public function getAbandTenderList ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        $roleName=$this->checkRole();
        if($roleName['roleName']=='warehouse'){
            $params->warehouse_id=$roleName['warehouse_id'];
        }
        $rt = $this->dao->selectPage('statementlist.getAbandTenderList', $params);
        if($rt->result){
            foreach($rt->result as $key=>$val){
                $remark=explode(',',$val->aband_remark);
                $rt->result[$key]->aband_remark=$remark[1];
            }
        }
        $rt->roleName=$roleName['roleName'];
        return $rt;
    }
    /**
     * 取消中标报表
     * Author ivan
     * 2017-1-3
     */
    public function getAbandWinBidList ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        $roleName=$this->checkRole();
        if($roleName['roleName']=='warehouse'){
            $params->warehouse_id=$roleName['warehouse_id'];
        }
        $rt = $this->dao->selectPage('statementlist.getAbandWinBidList', $params);
        if($rt->result){
            foreach($rt->result as $key=>$val){
                if($val->quote_type==1){
                    $name=$this->dao->selectOne('statementlist.getCarrier',array('id'=>$val->relation_id));
                }else if($val->quote_type==2){
                    $name=$this->dao->selectOne('statementlist.getDriverName',array('id'=>$val->relation_id));
                }
                $rt->result[$key]->relation_name=$name->relation_name;
                if($val->responsible_party==1){
                    $rt->result[$key]->responsible_party='基地';
                }else{
                    $rt->result[$key]->responsible_party='承运商';
                }
            }
        }
        $rt->roleName=$roleName['roleName'];
        return $rt;
    }

    /*分级运价审批明细报表*/
    public function getRetifyList ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        /*角色权限管理*/
        $roleName = $this->checkRole();
        if($roleName['roleName'] == 'warehouse'){
            $params->warehouse_id = $roleName['warehouse_id'];
            $params->role_condition = " LEFT JOIN `warehouse` AS  w  on s.warehouse_id = w.id";
        }
        $rt = $this->dao->selectPage('statementlist.getRetifyList', $params);
        $rt->user_type = $roleName['roleName'];
        if($rt->result){
            foreach($rt->result AS $i=>$item){
                /*查询线路底价*/
                $paramArr = [];
                $paramArr["from_location"]=$item->fromlocation;
                $paramArr['to_location']=$item->tolocation;
                $paramArr['shipment_method']=$item->shipment_method;
                $paramArr['density']=$item->density;
                if(empty($item->carriage_type)){
                    $paramArr['carriage_type_no']= '无要求' ;
                }else{
                    $paramArr['carriage_type']=$item->carriage_type;
                }
                $routePrice=$this->dao->selectOne('tender.getRoutePrice',$paramArr);
                if($routePrice){
                    $item->maxprice=$routePrice->price;
                    $item->over_rate=$routePrice->over_rate;
                }else{
                    $item->maxprice='';
                    $item->over_rate='';
                }
                $item->price_type_str = ($item->price_type == 1) ? '整车' : '按吨';
                if($item->maxprice == null){
                    $item->first_audit = '未设置' ;
                    $item->second_audit = '未设置' ;
                }else{
                    $maxprice = intval($item->maxprice); //线路最高价
                    $exceeding = intval($maxprice * ($item->over_rate * 0.01)) + $maxprice; //超标价格
                    $item->first_audit = $maxprice == null ? '0' : $maxprice;
                    $item->second_audit = $exceeding == null ? '0' : $exceeding;
                }
                /*说明是 整车 换算成每吨*/
                if($item->price_type == 1){
                    $item->unitprice = number_format($item->tender_price / $item->weight,2);
                }else{
                    $item->unitprice = $item->ta_price;
                }
                /*tender_price  含税总价   maxprice线路低价*/
                if(intval($item->unitprice) >= intval($item->first_audit)){
                    if($item->first_audit != 0){
                        $item->push_price_num =  ($item->unitprice - $item->first_audit)/($item->first_audit) * 100;
                        $item->push_price = number_format($item->push_price_num,2).' %';
                    }else{
                        $item->push_price =  '无法计算超额率';
                    }

                }else{
                    $item->push_price =  '未超额';
                }
            }

        }
        return $rt;
    }
    /*到站中标价分析报表 */
    public function getArriveList ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        /*角色权限管理*/
        $roleName = $this->checkRole();
        if($roleName['roleName'] == 'warehouse'){
            $params->warehouse_id = $roleName['warehouse_id'];
            $params->role_condition = " LEFT JOIN `warehouse` AS  w  on s.warehouse_id = w.id";
        }
        $rt = $this->dao->selectPage('statementlist.getArriveList', $params);
        $rt->user_type = $roleName['roleName'];
        return $rt;
    }
    /*调度单定位明细报表 */
    public function getLbsDetailList ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        /*角色权限管理*/
        $roleName = $this->checkRole();
        if($roleName['roleName'] == 'warehouse'){
            $params->warehouse_orgcode = $this->app->user->organ->orgcode;
        }
        $rt = $this->dao->selectPage('statementlist.getLbsDetailList', $params);
        if($rt->result){
            foreach($rt->result as  $key=>$value){
                $value->lbs_type = "lbs定位";
            }
        }

        $rt->user_type = $roleName['roleName'];
        return $rt;
    }
    /*固定运价合同提醒报表 */
    public function getReportList ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        /*角色权限管理*/
        $roleName = $this->checkRole();
        if($roleName['roleName'] == 'warehouse'){
            $params->warehouse_id = $roleName['warehouse_id'];
        }
        $rt = $this->dao->selectPage('statementlist.getReportList', $params);
        $rt->user_type = $roleName['roleName'];
        return $rt;
    }
    /*回单明细报表 */
    public function getReceiptList ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        if($params->is_checkout){
            $params->is_checkout = true;
        }
        /*角色权限管理*/
        $roleName = $this->checkRole();
        if($roleName['roleName'] == 'warehouse'){
            $params->plat_form_code = $this->app->user->organ->orgcode;
        }
        $rt = $this->dao->selectPage('statementlist.getReceiptList', $params);
        if($rt->result){
            foreach ($rt->result as $key=>$value){
                $value->is_receipt = $value->checkout_status == 0 ? '否' : '是';
                $value->is_sign = $value->checkout > 3 ? '已回单' : '未回单';

                $value->is_error_checkout = $value->checkout == 2 ||  $value->checkout == 5? '正常签收' : '异常签收';

                /*if($value->checkout > 3){
                 $value->is_sign = '已回单';
                }else{
                 $value->is_sign = '未回单';
                }*/
            }
        }
        $rt->user_type = $roleName['roleName'];
        return $rt;
    }

    /**
     * 中标统计报表
     * Author ivan
     * 2017-1-3
     */
    public function getWinBidList ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0].':00';
        $params->end = $date[1].':59';
        $roleName=$this->checkRole();
        if($roleName['roleName']=='warehouse'){
            $params->warehouse_id=$roleName['warehouse_id'];
        }
        $rt = $this->dao->selectPage('statementlist.getWinBidList', $params);
//         if($rt->result){
//             foreach($rt->result as $key=>$val){
//                 $countQuote=$this->dao->selectList('statementlist.getCountQoute',array('relation_id'=>$val->relation_id));
//                 $countWin=$this->dao->selectList('statementlist.getCountWin',array('relation_id'=>$val->relation_id));
//                 $rt->result[$key]->countQuote=$countQuote[0]->countQuote;
//                 $rt->result[$key]->countWin=$countWin[0]->countWin;
//             }
//         }
        $rt->roleName=$roleName['roleName'];
        return $rt;
    }
    /**
     * 司机LBS统计报表
     * Author ivan
     * 2017-1-3
     */
    public function getLbsCost ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        /*角色权限管理*/
        $roleName = $this->checkRole();
        if($roleName['roleName'] == 'warehouse'){
            $params->warehouse_id = $roleName['warehouse_id'];
            $params->role_condition = "LEFT JOIN `truck_source_carrier` AS  tsc  on ts.id = tsc.truck_source_id LEFT JOIN `carrier_warehouse` AS  cw  on tsc.carrier_id = cw.carrier_id";
        }
        $rt = $this->dao->selectPage('statementlist.getLbsCost', $params);
        if($rt->result){
            foreach($rt->result as $key=>$val){
                if($val->user_type == 1){
                    $val->user_type_str = $this->dao->selectOne('statementlist.getWarehouseName',array('filed'=>'name','chart_name'=>'warehouse','orgcode'=>$val->orgcode))->name;
                }else{
                    $val->user_type_str = $this->dao->selectOne('statementlist.getWarehouseName',array('filed'=>'carrier_name','chart_name'=>'carrier','g7s_orgcode'=>$val->orgcode))->carrier_name;
                }
            }
        }
        return $rt;
    }

    /**
     * 承运商竞标关注明细
     * Author ivan
     * 2017-1-3
     */
    public function getCarrierAttentionDetail ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        $roleName=$this->checkRole();
        if($roleName['roleName']=='warehouse'){
            $params->warehouse_id=$roleName['warehouse_id'];
        }
        $rt = $this->dao->selectPage('statementlist.getCarrierAttentionDetail', $params);
        if($rt->result){
            foreach($rt->result as $key=>$val){
                $quote=$this->dao->selectOne('statementlist.getQouteTime',array('relation_id'=>$val->relation_id,'tender_id'=>$val->tender_id));
                if($quote){
                    $rt->result[$key]->tender_quote_time=$quote->create_time;
                    $rt->result[$key]->quote='已投标';
                }else{
                    $rt->result[$key]->tender_quote_time='--';
                    $rt->result[$key]->quote='未投标';
                }
                if($val->is_read=='0'){
                    $rt->result[$key]->is_read='未阅读';
                    $rt->result[$key]->read_time='--';
                }else{
                    $rt->result[$key]->is_read='已阅读';
                    $rt->result[$key]->read_time=$val->read_time;
                }
            }
        }
        $rt->roleName=$roleName['roleName'];
        return $rt;
    }
    /**
     * 获取角色身份
     * Author ivan
     * 2017-1-3
     */
    public function checkRole () {
        $orgcode=$this->app->user->organ->orgcode;
        $rt = $this->dao->selectOne('statementlist.checkRole',array('orgcode'=>$orgcode));
        if($rt){
            return array('roleName'=>'warehouse','warehouse_id'=>$rt->id);
        }else{
            return array('roleName'=>'kelun_admin');
        }
    }


     /**
      * 一口价设置明细报表
      * Author sunjie
      * 2017-1-9
      */
     public function oneprice_report ($args) {
         $fixer = fixer::input($args);
         $params = $fixer->get();
         $date = explode(' - ', $params->statistic_date);
         $params->start = $date[0];
         $params->end = $date[1];

         //判断总部和基地角色
         $roleName=$this->checkRole();
         if($roleName['roleName']=='warehouse'){
             $params->warehouse_id=$roleName['warehouse_id'];
         }

         $rt = $this->dao->selectPage('statementlist.oneprice_report', $params);
         $rt->user_type = $roleName['roleName'];
         return $rt;

     }


    /**
     * 发标、中标时间明细报表
     * Author sunjie
     * 2017-1-16
     */
    public function tenderlist ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];

        //判断总部和基地角色
        $roleName=$this->checkRole();
        if($roleName['roleName']=='warehouse'){
            $params->warehouse_id=$roleName['warehouse_id'];
        }

        $rt = $this->dao->selectPage('statementlist.tenderlist', $params);
        foreach($rt->result AS $key=>$val){
                 $val->kaibiao = strtotime($val->tender_limit) - strtotime($val->create_time).' 秒';
            if($val->bid_time !='0000-00-00 00:00:00'){
                $val->pingbiao = strtotime($val->bid_time) - strtotime($val->tender_limit).' 秒';
            }
            else{
                $val->pingbiao = '未评标';
            }

        }

        $rt->user_type = $roleName['roleName'];
        return $rt;

    }
    /**
     * 承运商竞标关注明细
     * Author ivan
     * 2017-1-3
     */
     public function getCarrierBidDetail($args) {
         $fixer = fixer::input($args);
         $params = $fixer->get();
         $date = explode(' - ', $params->statistic_date);
         $params->start = $date[0];
         $params->end = $date[1];
//          $roleName=$this->checkRole();
//          if($roleName['roleName']=='warehouse'){
//             $params->warehouse_id=$roleName['warehouse_id'];
//          }
         $rt = $this->dao->selectPage('statementlist.getCarrierBidDetail', $params);
//          if($rt->result){
//             foreach($rt->result as $key=>$val){
//                 if($val->status==3){
//                     $rt->result[$key]->status='已中标';
//                 }else{
//                    $rt->result[$key]->status='未中标'; 
//                 }
//             }
//          }
         $rt->roleName=$roleName['roleName'];
         return $rt;
     }
     /**
     * 承运商考核报表
     * Author ivan
     * 2017-1-3
     */
    public function getCarrierEvaluationList ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $roleName=$this->checkRole();
        if($roleName['roleName']=='warehouse'){
            $params->warehouse_id=$roleName['warehouse_id'];
        }
        if(isset($params->sortColumns)) $params->sortColumns='c.'.$params->sortColumns;
        $rt = $this->dao->selectPage('statementlist.getCarrierEvaluationList', $params);
        if($rt){
            foreach($rt->result as $key=>$val){
                if($val->total_grade){
                    $grade=json_decode($val->total_grade,true);
                      $div=$grade[5]+$grade[4]+$grade[3]+$grade[2]+$grade[1];
                      if($div==0){
                        $div=1;
                      }
                    $rt->result[$key]->total_grade=number_format(($grade[5]*5+$grade[4]*4+$grade[3]*3+$grade[2]*2+$grade[1]*1)/$div,1);
                  }else{
                    $rt->result[$key]->total_grade='0';
                }
                $rt->result[$key]->lbs_rate=$val->lbs_rate.'%';
                $rt->result[$key]->quote_rate=$val->quote_rate.'%';

            }
        }
        $rt->roleName=$roleName['roleName'];
        return $rt;
    }
    /**
     * 基地考核报表
     * Author ivan
     * 2017-1-3
     */
    public function getWareEvaluationList ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $roleName=$this->checkRole();
        if($roleName['roleName']=='warehouse'){
            $params->warehouse_id=$roleName['warehouse_id'];
        }
        $rt = $this->dao->selectPage('statementlist.getWareEvaluationList', $params);
        if($rt){
            foreach($rt->result as $key=>$val){
                if($val->total_grade){
                    $grade=json_decode($val->total_grade,true);
                      $div=$grade[5]+$grade[4]+$grade[3]+$grade[2]+$grade[1];
                      if($div==0){
                        $div=1;
                      }
                    $rt->result[$key]->total_grade=number_format(($grade[5]*5+$grade[4]*4+$grade[3]*3+$grade[2]*2+$grade[1]*1)/$div,1);
                  }else{
                    $rt->result[$key]->total_grade='0';
                }
            }
        }
        $rt->roleName=$roleName['roleName'];
        return $rt;
    }
    /**
     * 承运商排名报表
     * Author ivan
     * 2017-1-3
     */
    public function getCarrierRankingList ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $roleName=$this->checkRole();
        if($roleName['roleName']=='warehouse'){
            $params->warehouse_id=$roleName['warehouse_id'];
        }
        if(isset($params->sortColumns)) $params->sortColumns='c.'.$params->sortColumns;
        $rt = $this->dao->selectPage('statementlist.getCarrierEvaluationList', $params);
        if($rt){
            foreach($rt->result as $key=>$val){
                if($val->total_grade){
                    $grade=json_decode($val->total_grade,true);
                      $div=$grade[5]+$grade[4]+$grade[3]+$grade[2]+$grade[1];
                      if($div==0){
                        $div=1;
                      }
                    $rt->result[$key]->total_grade=number_format(($grade[5]*5+$grade[4]*4+$grade[3]*3+$grade[2]*2+$grade[1]*1)/$div,1);
                  }else{
                    $rt->result[$key]->total_grade='0';
                }
            }
        }
        $rt->roleName=$roleName['roleName'];
        return $rt;
    }
    /**
     * 司机排名报表
     * Author ivan
     * 2017-1-3
     */
    public function getDriverRankingList ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $roleName=$this->checkRole();
        if($roleName['roleName']=='warehouse'){
            $params->warehouse_id=$roleName['warehouse_id'];
        }
        if(isset($params->sortColumns)) $params->sortColumns='ts.'.$params->sortColumns;
        if(isset($params->warehouse_id)&&$params->warehouse_id){
            $rt = $this->dao->selectPage('statementlist.getDriverRankingListW', $params);
        }else{
           $rt = $this->dao->selectPage('statementlist.getDriverRankingList', $params); 
        }  
        if($rt){
            foreach($rt->result as $key=>$val){
                if($val->total_grade){
                    $grade=json_decode($val->total_grade,true);
                      $div=$grade[5]+$grade[4]+$grade[3]+$grade[2]+$grade[1];
                      if($div==0){
                        $div=1;
                      }
                    $rt->result[$key]->total_grade=number_format(($grade[5]*5+$grade[4]*4+$grade[3]*3+$grade[2]*2+$grade[1]*1)/$div,1);
                  }else{
                    $rt->result[$key]->total_grade='0';
                }
            }
        }
        $rt->roleName=$roleName['roleName'];
        return $rt;
    }




    /**
     *  lbs费用统计报表
     * Author sunjie
     * 2017-1-17
     */
    public function lbsConstStatistical ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];

        //判断总部和基地角色
        $roleName=$this->checkRole();
        if($roleName['roleName']=='warehouse'){
            $params->orgcode = $this->app->user->organ->orgcode;;
        }

        $rt = $this->dao->selectPage('statementlist.lbsConstStatistical', $params);
        foreach($rt->result AS $key=>$val){
            if($val->user_type == '1'){
                $val->company = $val->name;
                $val->company_type = '基地';
            }
            else{
                $val->company = $val->carrier_name;
                $val->company_type = '承运商';
            }
            $val->total_price = $val->total * 0.1.'元';
        }

        $rt->user_type = $roleName['roleName'];
        return $rt;

    }

    /**
     * lbs费用明细报表（调度单）
     * Author SUNJIE
     * 2017-1-17
     */
    public function  lbsCostShipment($args){
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];

        //判断总部和基地角色
        $roleName=$this->checkRole();
        if($roleName['roleName']=='warehouse'){
            $params->orgcode = $this->app->user->organ->orgcode;;
        }

        $rt = $this->dao->selectPage('statementlist.lbsCostShipment', $params);
        $rt->user_type = $roleName['roleName'];
        return $rt;
    }

    /*运营报表上方统计 */
    public function getStatementCount ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $data = [];
        /*查询三个带有活跃的字段*/
        $rt = $this->dao->selectList('statementlist.getStatementCount_active', $params);
        $data['carrier_count'] = $rt['0']->carrier_count;
        $data['carrier_active']  = $rt['0']->active_time;
        $data['driver_count']  = $rt['1']->carrier_count;
        $data['driver_active'] = $rt['1']->active_time;
        $data['sign_count'] = $rt['2']->carrier_count;
        $data['sign_active']  = $rt['2']->active_time;
        $data['shipment_count']  = $rt['3']->carrier_count;
        $data['tenderPush_count']  = $rt['4']->carrier_count;
        $data['driverSign_count']  = $rt['5']->carrier_count;
        $data['lbs_count']  = $rt['6']->carrier_count;
        $data['truckLBS_count']  = $rt['7']->carrier_count;
        /*查询转运单和活跃数*/
        $res = $this->dao->selectList('statementlist.getShipmentCount_active', $params);
        $data['order_count'] = $res['0']->count;
        $data['order_active']  = $res['1']->count;
        $data['driverTask_count']  = $res['2']->count;
        return $data;
    }
    /**
     * 获取各种类型的统计
     * Author ivan
     * 2017-1-3
     */
    public function getTypeNum ($args) {
        $fixer = fixer::input($args);
        $params = $fixer->get();
        if($params->type=='driver'){
            $rt = $this->dao->selectList('statementlist.getNewDrivers', $params);
        }elseif($params->type=='receipter'){
            $rt = $this->dao->selectList('statementlist.getNewReceipters', $params);
        }elseif($params->type=='breakbulk'){
            $rt = $this->dao->selectList('statementlist.getNewBreakbulks', $params);
        }elseif($params->type=='GPSnum'){
            $rt = $this->dao->selectList('statementlist.getGPSnum', $params);
        }elseif($params->type=='LBSnum'){
            $rt = $this->dao->selectList('statementlist.getLBSnum', $params);
        }elseif($params->type=='signnum'){
            $rt = $this->dao->selectList('statementlist.getSignnum', $params);
        }elseif($params->type=='tenderpush'){
            $rt = $this->dao->selectList('statementlist.getTenderPushNum', $params);
        }
        if($rt){
            $month=array();
            $num=array();
            foreach($rt as $key=>$val){
               $month[]=$val->month;
               $num[]=$val->newNum;
            }

            $rt[0]->months=$month;
            $rt[0]->num=$num;
        }
        return $rt;
    }

    /**
     * 改标明细
     * Author SUNJIE
     * 2017-1-17
     */
    public function  changeTender($args){
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];

        //判断总部和基地角色
        $roleName=$this->checkRole();
        if($roleName['roleName']=='warehouse'){
            $params->orgcode = $this->app->user->organ->orgcode;;
        }

        $rt = $this->dao->selectPage('statementlist.changeTender', $params);
        $rt->user_type = $roleName['roleName'];
        return $rt;
    }
    /*基地发货报表*/
    public function  getGoods($args){
        $fixer = fixer::input($args);
        $params = $fixer->get();
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];
        $rt = $this->dao->selectList('statementlist.getGoods', $params);
        $allCity = [];
        $To_city = [];
        $arr = [];
        $to_cityArr = [];
        $name_cityArr = [];
        $dataName = [];
        if($rt){
            /*获取所有城市的坐标*/
            foreach ($rt as $key=>$value){
                /*将 基地名称和经纬度联系起来 写进去*/
                if(!array_key_exists($value->name, $allCity)){
                   $from_lnglat = explode(',',$value->from_lnglat);
                    if(floatval($from_lnglat['1']) != 0.0){
                        $allCity[$value->name]=array(floatval($from_lnglat['0']),floatval($from_lnglat['1']));
                    }
                }
                 /*再将目的地城市的to_city写进去,保证数据的完整*/
                 if(!array_key_exists($value->to_city, $allCity)){
                     $to_lnglat = explode(',',$value->to_lnglat);
                     if($to_lnglat['0'] != '0.0' && $value->to_lnglat){
                         $allCity[$value->to_city]=array(floatval($to_lnglat['0']),floatval($to_lnglat['1']));
                     }
                 }
                /*拼接基地->目的地数组*/
                if(explode(',',$value->to_lnglat)['0'] != '0.0' && $value->to_lnglat){
                    $to_cityArr[$value->name][] = array("name"=>$value->to_city,"value"=>50);
                }
            };
            foreach ($to_cityArr AS $key=>$value){
                $dataName[] = $key;
                $name = [];
                foreach($value AS $k=>$v){
                    $name[] = array("0"=>array("name"=>$key),"1"=>$v);
                }
                $name_cityArr[] = array($key,$name);
            }
            $data['allcity'] = $allCity;
            $data['dataName'] = $dataName;
            $data['name_cityArr'] = $name_cityArr;
        }
        //var_dump($data);exit;
        return $data;
    }

    
    public function getLineTender_x1($args){
    	$fixer = fixer::input($args);
    	$params = $fixer->get();
    	$date = explode(' - ', $params->statistic_date);
    	$params->start = $date[0];
    	$params->end = $date[1];
    	return $this->dao->selectList('statementlist.getLineTender_x1', $params);
    }
    public function getLineTender_x2($args){
    	$fixer = fixer::input($args);
    	$params = $fixer->get();
    	$date = explode(' - ', $params->statistic_date);
    	$params->start = $date[0];
    	$params->end = $date[1];
    	return $this->dao->selectList('statementlist.getLineTender_x2', $params);
    	 
    }
    public function getLineTender_x3($args){
    	$fixer = fixer::input($args);
    	$params = $fixer->get();
    	$date = explode(' - ', $params->statistic_date);
    	$params->start = $date[0];
    	$params->end = $date[1];
    	return $this->dao->selectList('statementlist.getLineTender_x3', $params);
    
    }
    public function getLineTender($args){
    	$fixer = fixer::input($args);
    	$params = $fixer->get();
    	$date = explode(' - ', $params->statistic_date);
    	$params->start = $date[0];
    	$params->end = $date[1];
    	$params->offset  = 0;
    	$params->pageSize = 100;
    	
    	$carriers = $this->dao->selectList('statementlist.getLineTender_x3', $params);
    	$_ca_sql = [];
    	foreach ($carriers as $carrier){
    		$_ca_sql[] = "convert( avg(if(tq.relation_id = \"".$carrier->relation_id."\",if(tq.price_type = 1, tq.quote_price /s.weight, tq.quote_price) ,null)),DECIMAL) as \"".$carrier->relation_id."\"";
    	}
//     	$_ca_sql[] = "format( avg(if(tq.relation_id = \"xxx\",if(tq.price_type = 1, tq.quote_price /s.weight, tq.quote_price) ,null)),0) as xx";
    	$params->ca_sql = join(',', $_ca_sql);
//     	die($params->ca_sql);exit;
    	
    	return $this->dao->selectPage('statementlist.getLineTender', $params);
    	 
    }
    
    
    public function getLineTenderTrend_y1($args){
    	$fixer = fixer::input($args);
    	$params = $fixer->get();
    	$date = explode(' - ', $params->statistic_date);
    	$params->start = $date[0];
    	$params->end = $date[1];
    	return $this->dao->selectList('statementlist.getLineTenderTrend_y1', $params);
    }
    public function getLineTenderTrend_y2($args){
    	$fixer = fixer::input($args);
    	$params = $fixer->get();
    	$date = explode(' - ', $params->statistic_date);
    	$params->start = $date[0];
    	$params->end = $date[1];
    	return $this->dao->selectList('statementlist.getLineTenderTrend_y2', $params);
    }
  
    public function getLineTenderTrend($args){
    	$fixer = fixer::input($args);
    	$params = $fixer->get();
    	$date = explode(' - ', $params->statistic_date);
    	$params->start = $date[0];
    	$params->end = $date[1];
    	$params->offset  = 0;
    	$params->pageSize = 100;
    	 
    	return $this->dao->selectPage('statementlist.getLineTenderTrend', $params);
    
    }
 }