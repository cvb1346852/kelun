<?php
/**
 * @author sunjie
 * The control file of motorcade module.
 */
class motorcade_warehouse extends control
{
    /**
     * The search page of motorcade module.
     *
     */
    public function search ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->motorcade_warehouseService->search($params);
        $this->view->pager = $pager;
        $this->display();
    }


    /**
     * The save page of motorcade module.
     *
     */
    public function save ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->motorcade_warehouseService->save($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The getById page of motorcade module.
     *
     */
    public function getById ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->motorcade_warehouseService->getById($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The del page of motorcade module.
     *
     */
    public function del ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->motorcade_warehouseService->del($params);
        $this->view->pager = $pager;
        $this->display();
    }
    /**
     * The getByGroup page of motorcade module.
     *
     */
    public function getByGroup ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->motorcade_warehouseService->getByGroup($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * The change page of motorcade module.
     *
     */
    public function change ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->motorcade_warehouseService->change($params);
        $this->view->pager = $pager;
        $this->display();
    }
}