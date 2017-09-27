<?php
/**
 * LBS记录历史轨迹类
 * Author sunjie
 * 2016-09-19
 */

class history extends control{

    //定时任务获取LBS定位
    public function lbsTiming(){
        $data = $this->historyService->lbsTiming();
        $this->view->result = $data;
        $this->display();

    }
    //获取lbs定位列表
    public function getHistoryMsg(){
    	$params = fixer::input('request')->get();
    	$data=$this->loadService('history')->getHistoryMsg($params);
        $this->view->result = $data;
        $this->display();

    }
    //导出功能
    public function getHistoryList(){
        $params = fixer::input('request')->get();
        $data=$this->loadService('history')->getHistoryList($params);
        $this->view->result = $data;
        $this->display();

    }

    /**
     * Desc:地图lbs展示
     * @Author Lvison
     */
    public function getByShipmentId(){
        $params = fixer::input('request')->getArray();
        $data=$this->historyService->getByShipmentId($params);
        $this->view->result = $data;
        $this->display();
    }

}