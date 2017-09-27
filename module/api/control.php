<?php

/**对外接口服务
 * Class api
 */

class api extends control{

    /**
     * Desc:根据经纬度获取地址
     * @Author Lvison
     */
    public function getAddressByLngLat(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->apiService->getAddressByLngLat($fix);
        $this->display();
    }

    /**
     * 2016-8-1
     * Author ZHM
     * 根据经纬度获取里程
     */
    public function getDistanceByLngLat() {
    	$param = fixer::input('request')->getArray();
        $data = $this->loadService('api')->getDistanceByLngLat($param['param']);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 2016-10-20
     * Author fly
     * 根据经纬度获取里程
     */
    public function getDistanceByLngLatResult() {
        $param = fixer::input('request')->getArray();
        $data = $this->loadService('api')->getDistanceByLngLatResult($param['param']);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 2016-8-1
     * Author ZHM
     * 根据地址获取经纬度
     */
    public function getLngLatByAddress(){
        $param = fixer::input('request')->getArray();
        $data = $this->loadService('api')->getLngLatByAddress($param['param']);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 2016-8-1
     * Author fly
     * 根据地址获取经纬度
     */
    public function getLngLatByAddressResult(){
        $param = fixer::input('request')->getArray();
        $data = $this->loadService('api')->getLngLatByAddressResult($param['param']);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 2016-8-3
     * ZHM
     * 测试方法1
     */
    public function testWebservice () {
        $param = fixer::input('request')->get();
        $data = $this->loadService('api')->testWebservice($param);
        $this->view->result = $data;
        $this->display();
    }
}