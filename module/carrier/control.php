<?php
/**
 * @author zsq
 * The control file of carrier module.
 */
class carrier extends control
{

    /**
     * The search page of carrier module.
     *
     */
    public function search ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->carrierService->search($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The search page of carrier module.
     *
     */
    public function getByGroup ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->carrierService->getByGroup($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The search page of carrier module.
     *
     */
    public function save ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->carrierService->save($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The carrier   alter  info
     *
     */
    public function getAlterInfo ()
    {
        $params = fixer::input('request')->get();
        $data = $this->carrierService->getAlterInfo($params);
        $this->view->data = $data;
        $this->display();
    }

    /**
     * The agree page of carrier module.
     *
     */
    public function agree ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->carrierService->agree($params);
        $this->view->pager = $pager;
        $this->display();
    }
    /**
     * The getSet page of carrier module.
     * @获取配置
     */
    public function getSet ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->carrierService->getSet($params);
        $this->view->pager = $pager;
        $this->display();
    }
    /**
     * The getById page of carrier module.
     *
     */
    public function getById ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->carrierService->getById($params);
        $this->view->pager = $pager;
        $this->display();
    }
    /**
     * The getById page of carrier module.
     *
     */
    public function del ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->carrierService->del($params);
        $this->view->pager = $pager;
        $this->display();
    }
    /**
     * The G7Set page of carrier module.
     *
     */
    public function G7Set ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->carrierService->G7Set($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * Desc:获取所有承运商
     * @Author Lvison
     */
    public function getAllCarrier(){
        $params = fixer::input('request')->getArray();
        $data = $this->carrierService->getAllCarrier($params);
        $this->view->data = $data;
        $this->display();
    }

    /**
     * Desc:保存管理承运商
     * @Author Lvison
     */
    public function saveConnection(){
        $params = fixer::input('request')->getArray();
        $data = $this->carrierService->saveConnection($params);
        $this->view->data = $data;
        $this->display();
    }
    /**
     * Desc:检查基地是否设置了默认承运商
     * @Author Lvison
     */
    public function carrierCheck(){
        $params = fixer::input('request')->getArray();
        $params['orgcode']=$this->app->user->organ->orgcode;
        $data = $this->loadService('carrier')->carrierCheck($params);
        $this->view->data = $data;
        $this->display();
    }
     /**
     * Desc:获取承运商名称
     * @Author Lvison
     */
    public function getCarriers(){
        $params = fixer::input('request')->getArray();
        $params['orgcode']=$this->app->user->organ->orgcode;
        $data = $this->loadService('carrier')->getCarriers($params);
        $this->view->data = $data;
        $this->display();
    }
    /**
     * Desc:设置默认承运商
     * @Author Lvison
     */
    public function setDefauleCarrier(){
        $params = fixer::input('request')->getArray();
        $params['orgcode']=$this->app->user->organ->orgcode;
        $data = $this->loadService('carrier')->setDefauleCarrier($params);
        $this->view->data = $data;
        $this->display();
    }
    /**
     * Desc:检查organizing_code是否重复
     * @Author ivan
     */
    public function checkOrgcode(){
        $params = fixer::input('request')->getArray();
        $data = $this->carrierService->checkOrgcode($params);
        $this->view->data = $data;
        $this->display();
    }
    /**
     * Desc:统计承运商及司机的信用体系定时任务
     * @Author ivan
     */
    public function creditSystemTiming(){
        $params = fixer::input('request')->get();
        $data = $this->carrierService->creditSystemTiming($params);
        $this->view->data = $data;
        $this->display();
    }
    /**
     * Desc:更新司机及承运商的活跃时间
     * @Author ivan
     */
    public function updateActiveTime(){
        $params = fixer::input('request')->get();
        $data = $this->carrierService->updateActiveTime($params);
        $this->view->data = $data;
        $this->display();
    }
    /**
     * Desc:统计承运商司机信用体系定时任务2
     * @Author ivan
     */
    public function creditSysTiminga(){
        $params = fixer::input('request')->get();
        $data = $this->carrierService->creditSysTiminga($params);
        $this->view->data = $data;
        $this->display();
    }
    /**
     * Desc:统计承运商司机信用体系定时任务3
     * @Author ivan
     */
    public function creditSysTimingb(){
        $params = fixer::input('request')->get();
        $data = $this->carrierService->creditSysTimingb($params);
        $this->view->data = $data;
        $this->display();
    }

}