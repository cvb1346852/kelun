<?php
/**
 * @author Ivan
 * The service file of source_distribution module.
 */
 class source_distributionService extends service
 {
 	public  function search($fixer){
 		$params = fixer::input($fixer)->getArray();
        $result=$this->dao->selectPage('source_distribution.selectPage',$params);
        if($result->result){
               foreach($result->result as $key=>$val){
                $result->result[$key]->weight=$val->weight.'吨';
                $res=$this->dao->selectOne('source_distribution.getCreateTime',array('shipment_id'=>$val->id));
                if($res){
                    $result->result[$key]->tender_time=$res->create_time;
                }else{
                    $result->result[$key]->tender_time='--';
                }
            } 
        }
        
        
        return $result;
 	}
 	public function getProvince($fixer){
 		$params = fixer::input($fixer)->getArray();
 		$result=$this->dao->selectList('source_distribution.getProvince',$params);
 		return $result;
 	}
 }