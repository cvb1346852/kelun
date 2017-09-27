<?php
/**
 * @author zsq
 * The control file of carrier module.
 */
class appeal extends control
{

    /**
     * The search page of carrier module.
     *
     */
    public function searchList ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->appealService->searchList($params);
        $this->view->pager = $pager;
        $this->display();
    }
    /**
     * The search page of carrier module.
     *
     */
    public function getResultName ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->appealService->getResultName($params);
        $this->view->pager = $pager;
        $this->display();
    }
    /**
     * The search page of carrier module.
     /**
     * 微信端获取当前角色投诉列表
     *
     */
    public function getAppeallList ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->appealService->getAppeallList($params);
        $this->view->pager = $pager;
        $this->display();
    }
     /**
     * 添加投诉信息
     *
     */
    public function saveAppeal ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->appealService->saveAppeal($params);
        $this->view->pager = $pager;
        $this->display();
    }
    /**
     * 逻辑删除投诉信息
     *
     */
    public function deletedAppeal ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->appealService->deletedAppeal($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * 更新投诉信息
     *
     */
    public function updateAppeal ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->appealService->updateAppeal($params);
        $this->view->pager = $pager;
        $this->display();
    }
}