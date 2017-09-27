<?php
/**
 * @author sunjie
 * The control file of carrier module.
 */
class car_plant extends control
{
    /**
     * The search page of carrier module.
     *
     */
    public function search ()
    {
        $params = fixer::input('request')->get();
        $data = $this->car_plantService->search($params);
        $this->view->pager = $data;
        $this->display();
    }

    //红黑名单
    public function blacklist_change ()
    {
        $params = fixer::input('request')->get();
        $data = $this->car_plantService->blacklist_change($params);
        $this->view->pager = $data;
        $this->display();
    }

    //查看车辆详情
    public function truck_source_info()
    {
        $params = fixer::input('request')->get();
        $data = $this->car_plantService->truck_source_info($params);
        $this->view->pager = $data;
        $this->display();
    }


    //lbs定位
    public function lbs()
    {
        $params = fixer::input('request')->get();
        $data = $this->car_plantService->lbs($params);
        $this->view->pager = $data;
        $this->display();
    }

    /**
     * The getById page of truck_source module.
     *
     */
    public function getById ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->car_plantService->getById($params);
        $this->view->pager = $pager;
        $this->display();
    }

    //修改司机信息
    public function change_driver()
    {
        $params = fixer::input('request')->get();
        $data = $this->car_plantService->change_driver($params);
        $this->view->pager = $data;
        $this->display();
    }

}