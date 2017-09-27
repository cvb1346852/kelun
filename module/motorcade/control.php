<?php
/**
 * @author zsq
 * The control file of motorcade module.
 */
class motorcade extends control
{

    /**
     * The search page of motorcade module.
     *
     */
    public function search ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->motorcadeService->search($params);
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
        $pager = $this->motorcadeService->save($params);
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
        $pager = $this->motorcadeService->getById($params);
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
        $pager = $this->motorcadeService->del($params);
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
        $pager = $this->motorcadeService->getByGroup($params);
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
        $pager = $this->motorcadeService->change($params);
        $this->view->pager = $pager;
        $this->display();
    }

}