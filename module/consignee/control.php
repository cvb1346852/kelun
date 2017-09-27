<?php
/**
 * @author Ivan
 * The control file of consignee module.
 */
class consignee extends control{
	//从wechat_connect表中查询获取收货人信息
	public function search ()
    {
        $params = fixer::input('request')->getArray();
        $pager = $this->consigneeService->search($params);
        $this->view->pager = $pager;
        $this->display();
    }

    //解绑销售人员erp
    public function unbind(){
        $params = fixer::input('request')->get();
        $pager = $this->consigneeService->unbind($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * 获取收货人电话号
     * Author Ivan
     * 2016-8-10
     */
    public function getPhone() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('consignee')->getPhone($params); 
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 删除收货人
     * Author Ivan
     * 2016-8-10
     */
    public function del() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('consignee')->del($params); 
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 获得erp账号信息
     * Author Ivan
     * 2016-8-10
     */
    public function geterp() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('consignee')->geterp($params); 
        $this->view->result = $data;
        $this->display();
    }
}