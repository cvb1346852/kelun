<?php
/**
 * @author zsq
 * The control file of truck_source module.
 */
class truck_source extends control
{
    /**
     * The search page of truck_source module.
     *
     */
    public function search ()
    {
		$params = fixer::input('request')->get(); 
        $pager = $this->truck_sourceService->search($params); 
        $this->view->pager = $pager;
        $this->display();
    }
    /**
     * The search page of truck_source module.
     *
     */
    public function driverSign ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->driverSign($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The send LBS
     *
     */
    public function sendLbsMsg ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->sendLbsMsg($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The search List of truck_source  carnum by carrier_id.
     *
     */
    public function getCarnumByCarrierid ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->getCarnumByCarrierid($params);
        $this->view->result = $pager;
        $this->display();
    }

    /**
     * The search page of truck_source module.
     *
     */
    public function search_wechat ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->search_wechat($params);
        $this->view->pager = $pager;
        $this->display();
    }
    /**
     * The search truck_source  msg.
     *
     */
    public function getTruckMsg ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->getTruckMsg($params);
        $this->view->pager = $pager;
        $this->display();
    }
    /**
     * The update truck_source  msg.
     *
     */
    public function updateTruckMsg ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->updateTruckMsg($params);
        $this->view->pager = $pager;
        $this->display();
    }
     /*
       The search_carrier_driver page of driver history carrier 
     */
    public function search_carrier_driver(){ 
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->search_carrier_driver($params);
        $this->view->pager = $pager;
        $this->display();
    }   
     /*add carrier*/
     public function confirmcarrier(){ 
        $params = fixer::input('request')->get();  
        $pager = $this->truck_sourceService->confirmcarrier($params);  
        $this->view->pager = $pager;
        $this->display();
     }
    /*get carrier info*/
    public function getCarrierinfo(){
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->getCarrierinfo($params);
        $this->view->pager = $pager;
        $this->display();
     }
    /* get getprovincelist lest*/
    public function getprovincelist(){
        $params = fixer::input('request')->get(); 
        $pager = $this->truck_sourceService->getprovincelist($params); 
        $this->view->pager = $pager;
        $this->display();
    }
    /* get getprovincelist lest*/
    public function quitCarrier(){
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->quitCarrier($params);
        $this->view->pager = $pager;
        $this->display();
    }
    /**
     * The getById page of truck_source module.
     *
     */
    public function getById ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->getById($params);
        $this->view->pager = $pager;
        $this->display();
    }
   /**
     * The getById page of truck_source module.
     *
     */
    public function getHistorytruck ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->getHistorytruck($params);
        $this->view->pager = $pager;
        $this->display();
    }
  /**
     * The pushCarrier page of truck_source join carrier.
     *
     */
    public function pushCarrier ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->pushCarrier($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The agree page of truck_source module.
     *
     */
    public function agree ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->agree($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The save page of truck_source module.
     *
     */
    public function save ()
    {    
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->save($params); 
        $this->view->pager = $pager;
        $this->display();
    }/**
     * The save page of truck_source module.
     *
     */
    public function save_wechat ()
    {    
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->save_wechat($params);
        $this->view->pager = $pager;
        $this->display();
    }

    public function save_wechat_driver ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->save_wechat_driver($params);
        $this->view->pager = $pager;
        $this->display();
    }


    /**
     * The del page of truck_source module.
     *
     */
    public function del ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->del($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The del page of truck_source module.
     *
     */
    public function getCarriageType ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->getCarriageType($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The change page of truck_source module.
     *
     */
    public function change ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->change($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The change page of truck_source_warehouse module.
     *
     */
    public function changeWarehouse ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->changeWarehouse($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * 2016-8-15
     * ZHM
     * 获取车辆信息
     */
    public function getG7sTruck(){
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->getG7sTruck($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * 保存自有车辆
     * 2016-8-16
     * ZHM
     */
    public function saveG7sTruck() {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->saveG7sTruck($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * 搜索条件
     * 2016-8-24
     * ZHM
     */
    public function getSearchCondition() {
        $params = fixer::input('request')->get();
        $data = $this->truck_sourceService->getSearchCondition($params);
        $this->view->data = $data;
        $this->display();
    }
    /**
     * 获取平台线路车源信息
     * 2016-8-26
     * Ivan
     */
    public function getDriverRoute() {
        $params = fixer::input('request')->get();
        $data = $this->truck_sourceService->getDriverRoute($params);
        $this->view->data = $data;
        $this->display();
    }
    /**
     * 获取平台线路车源历史记录
     * 2016-8-29
     * Ivan
     */
    public function getHistory() {
        $params = fixer::input('request')->get();
        $data = $this->truck_sourceService->getHistory($params);
        $this->view->data = $data;
        $this->display();
    }

    public function searchAll()
    {
        $params = fixer::input('request')->get();
        $pager = $this->truck_sourceService->searchAll($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * Desc: 获取车辆位置
     * @Author sunjie
     */
    public function getAddressList(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('truck_source')->getAddressList($fix);
        $this->display();
    }

    /**
     * 获取司机手机号列表
     * Author sunjie
     * 2016-11-22
     */
    public function getDriverPhone() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('truck_source')->getDriverPhone($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 给3万活跃司机发送签到通知
     * Author ivan
     * 2016-11-22
     */
    public function signInTimeing() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('truck_source')->signInTimeing($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 获取车辆信息
     * Author sunjie
     * 2017-3-8
     */
    public function truckCheckByphone() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('truck_source')->truckCheckByphone($params);
        $this->view->result = $data;
        $this->display();
    }

    public function delcar_wechat ()
    {
    	$params = fixer::input('request')->get();
    	$pager = $this->truck_sourceService->delcar_wechat($params);
    	$this->view->pager = $pager;
    	$this->display();
    }

}