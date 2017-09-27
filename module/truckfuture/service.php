<?php
/** 
 * 运单服务类
 * Author Zhm
 * 2016-07-12
 */

class truckfutureService extends service{
    
     	/**
	 * 获取运单id列表
	 * Author ZHM
	 * 2016-7-13
	 */
	public function getTruckfutrue ($args) {
		$fixer = fixer::input($args);  
		$params = $fixer->get();
		if($params->userrole == "warehouse"){
			/*获取基地所在市*/
			$warehouse_p_c = $this->dao->selectOne('truckfuture.getWarehousecity', array("id"=>$params->warehouse_id));
			$params->to_province = $warehouse_p_c->province;
			$params->to_city = $warehouse_p_c->city;
			if($params->to_province && $params->to_city){
				$params->startTime = date("Y-m-d H:i:s",strtotime("-3 day"));
				$params->endTime = "2038-1-1 00:00:00";
				$params->group = true;
				$rt = $this->dao->selectPage('truckfuture.getTruckfutrue',$params);
				return $rt;
			}else{
				return array(
						'result'=>[],
						'totalCount'=>"0");
			}
		}else{
			throwException('身份验证失败');
		}
	}
	/**
	 * Desc:获取基地名称列表
	 * @param $res
	 * @param $control
	 * @Author will
	 * @return bool
	 */
	 public function getWarehouseNameList($args){
		$fixer = fixer::input($args);
		$params = $fixer->get();
		$res = $this->dao->selectList('truckfuture.getWarehouseNameList',$params);
		 return $res;
	}

}