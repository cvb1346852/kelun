<?php
/**
 * @author zsq
 * The control file of warehouse module.
 */
class warehouse extends control
{

    /**
     * The search page of warehouse module.
     *
     */
    public function search ()
    {
        $params = fixer::input('request')->getArray();
        $pager = $this->warehouseService->search($params);
        $this->view->pager = $pager;
        $this->display();
    }


    /**
     * The save page of warehouse module.
     *
     */
    public function save ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->warehouseService->save($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The delete page of warehouse module.
     *
     */
    public function getById ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->warehouseService->getById($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The delete page of warehouse module.
     *
     */
    public function _print ()
    {
        $this->view->pager = $this->warehouseService->_print();
        $this->display();
    }

    /**
     * The getByGroup page of warehouse module.
     *
     */
    public function getByGroup ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->warehouseService->getByGroup($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The getOrgTree page of warehouse module.
     *
     */
    public function getOrgTree ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->warehouseService->getOrgTree($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The getRoute page of warehouse module.
     *
     */
    public function getRoute ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->warehouseService->getRoute($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * Desc:删除基地
     * @Author Lvison
     */
    public function delete(){
        $params = fixer::input('request')->getArray();
        $data = $this->warehouseService->delete($params);
        $this->view->data = $data;
        $this->display();
    }

    /**
     * Desc:设置G7机构编码
     * @Author Lvison
     */
    public function setOrgCode(){
        $params = fixer::input('request')->getArray();
        $data = $this->warehouseService->setOrgCode($params);
        $this->view->data = $data;
        $this->display();
    }

    /**
     * Desc:招标设置
     * @Author Lvison
     */
    public function tenderSet(){
        $params = fixer::input('request')->getArray();
        $data = $this->warehouseService->tenderSet($params);
        $this->view->data = $data;
        $this->display();
    }

    /**
     * 2016-8-29
     * 查询基地关联承运商车辆
     * ZHM
     */
    public function carrierTruck(){
        $params = fixer::input('request')->get();
        $data = $this->warehouseService->carrierTruck($params);
        $this->view->data = $data;
        $this->display();
    }

    /**
     * 2016-8-29
     * 获取搜索条件
     * ZHM
     */
    public function getSearchCondition(){
        $params = fixer::input('request')->get();
        $data = $this->warehouseService->getSearchCondition($params);
        $this->view->data = $data;
        $this->display();
    }

    /**
     * 2016-8-30
     * 添加基地直属车辆
     * ZHM
     */
    public function addImmediate(){
        $params = fixer::input('request')->get();
        $data = $this->warehouseService->addImmediate($params);
        $this->view->data = $data;
        $this->display();
    }

    /**
     * 2016-8-30
     * 查看基地直属车辆
     * ZHM
     */
    public function immediateTruck(){
        $params = fixer::input('request')->get();
        $data = $this->warehouseService->immediateTruck($params);
        $this->view->data = $data;
        $this->display();
    }

    /**
     * 2016-8-30
     * 获取指数车页面搜索条件
     * ZHM
     */
    public function getImmediateSearchCondition(){
        $params = fixer::input('request')->get();
        $data = $this->warehouseService->getImmediateSearchCondition($params);
        $this->view->data = $data;
        $this->display();
    }
    
    /**
     * 2016-8-30
     * 删除基地直属车辆
     * ZHM
     */
    public function immediateTruckDelete(){
        $params = fixer::input('request')->get();
        $data = $this->warehouseService->immediateTruckDelete($params);
        $this->view->data = $data;
        $this->display();
    }
    /**
     * Desc: 获取车队下拉框
     * @Author 
     */
    public function getMotorcade ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->loadService('truck_source')->getMotorcade($params);
        $this->view->pager = $pager;
        $this->display();
    }
    
    public function genOpt ()
    {
    	$params = fixer::input('request')->get();
    	$pager = $this->loadService('warehouse')->genOpt($params);
    	$this->view->pager = $pager;
    	$this->display();
    }
    
    
}