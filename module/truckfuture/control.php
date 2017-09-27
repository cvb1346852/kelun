<?php
/** 
 * 运单操作类
 * Author Zhm
 * 2016-07-12
 */

class truckfuture extends control{

	/**
	 * 获取运单列表
	 * Author ZHM
	 * 2016-7-12
	 */
	public function getTruckfutrue() {
		$params = fixer::input('request')->get();
        $data = $this->loadService('truckfuture')->getTruckfutrue($params);
        $this->view->result = $data;
        $this->display();
	}  
	/**
	 * 获取出发地列表
	 * Author ZHM
	 * 2016-8-10
	 */
	public function getFromlocation() {
		$params = fixer::input('request')->get();
        $data = $this->loadService('truckfuture')->getFromlocation($params); 
        $this->view->result = $data;
        $this->display();
	}

	/**
	 * 获取出发地列表
	 * Author ZHM
	 * 2016-8-10
	 */
	public function getWarehouseNameList() {
		$params = fixer::input('request')->get();
		$data = $this->loadService('truckfuture')->getWarehouseNameList($params);
		$this->view->result = $data;
		$this->display();
	}



}
