<?php
/**
 * @author zsq
 * The control file of contract module.
 */
class contract extends control
{

    /**
     * The search page of contract module.
     *
     */
    public function search ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->contractService->search($params);
        $this->view->pager = $pager;
        $this->display();
    }


    /**
     * The save page of contract module.
     *
     */
    public function save ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->contractService->save($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The getById page of contract module.
     *
     */
    public function getById ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->contractService->getById($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The getById page of contract module.
     *
     */
    public function getByGroup ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->contractService->getByGroup($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The del page of contract module.
     *
     */
    public function del ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->contractService->del($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * 获取合同编号
     * 2016-8-25
     * ZHM
     */
    public function getContractCode(){
        $params = fixer::input('request')->get();
        $data = $this->contractService->getContractCode($params);
        $this->view->data = $data;
        $this->display();
    }

    /**
     * Desc:合同到期提醒
     * @Author Lvison
     */
    public function expireRemind(){
        $data = $this->contractService->expireRemind();
        $this->view->data = $data;
        $this->display();
    }

}