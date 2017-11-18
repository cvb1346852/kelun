<?php
class order extends control
{
    /**
     * 获取订单详情
     */
    public function detail()
    { 
        $param = fixer::input('request')->get();
        $data = $this->loadService('order')->getOrderDetail($param);
        $this->view->result = $data;
        $this->display();
    }
   
    public function orderList()
    {
        $param = fixer::input('request')->get();
        $data = $this->loadService('order')->orderList($param);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 验证手机号码与订单to_phone匹配
     * Author will
     * 2016-7-13
     */
    public function verifyPhoneOrorder()
    {
        $param = fixer::input('request')->get();
        $data = $this->loadService('order')->verifyPhoneOrorder($param);
        $this->view->result = $data;
        $this->display();
    }
    public function dispatchOrderList()
    {
        $param = fixer::input('request')->get();
        $data = $this->loadService('order')->dispatchOrderList($param);
        $this->view->result = $data;
        $this->display();
    }
    /*show abnormal_images by order_code */
    public function showCheckImg()
    {
        $param = fixer::input('request')->get();
        $data = $this->loadService('order')->showCheckImg($param);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 获取订单详细列表
     * Author ZHM
     * 2016-7-13
     */
    public function getOrderinfoprint() {
        $params = fixer::input('request')->get();  
        $data = $this->loadService('order')->getOrderinfoprint($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 获取司机列表
     * Author ZHM
     * 2016-7-13
     */
    public function getCodetruckinfo() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('order')->getCodetruckinfo($params); 
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 获取车牌列表
     * Author ZHM
     * 2016-7-13
     */
    public function getCarnums() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('order')->getCarnums($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 获取司机手机号列表
     * Author ZHM
     * 2016-7-13
     */
    public function getDriver_phone() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('order')->getDriver_phone($params); 
        $this->view->result = $data;
        $this->display();
    }
   /*pt端对 订单管理的显示列表 */
    public function manageOrderList()
    { 
        $param = fixer::input('request')->get();
        $data = $this->loadService('order')->manageOrderList($param);
        $this->view->result = $data;
        $this->display();
    }
    //将签收状态改为确认签收
    public function signOk(){
       $param = fixer::input('request')->get();
       $data = $this->loadService('order')->signOk($param);  
       $this->view->result = $data;
       $this->display(); 
    }
    //通过carrier_id获取承运商信息
    public function getBycarrierId(){
       $param = fixer::input('request')->get();  
       $data = $this->loadService('order')->getBycarrierId($param);  
       $this->view->result = $data;
       $this->display(); 
    }
    public function checkoutimage()
    {
        $param = fixer::input('request')->get();
        $data = $this->loadService('order')->checkoutimage($param);
        $this->view->result = $data;
        $this->display();
    }
    public function checkout()
    {
        $param = fixer::input('request')->get();
        $data = $this->loadService('order')->checkout($param);
        $this->view->result = $data;
        $this->display();
    }
    public function checkoutDetail()
    {
        $param = fixer::input('request')->get();
        $data = $this->loadService('order')->checkoutDetail($param);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 获取销售查看的订单列表
     * 2016-7-19
     * Author ZHM
     */
    public function getOrders() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('order')->getOrders($params);

        $this->view->result = $data;
        $this->display();
    }  
     /**/
    /**
     * 2016-7-20
     * 手动授权订单
     * Author ZHM
     */
    public function orderAuth() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('order')->orderAuth($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 2016-7-20
     * 获取订单详情
     * Author ZHM
     */
    public function getOrderDetail(){
        $params = fixer::input('request')->get();
        $data = $this->loadService('order')->getOrderDetail($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 2016-7-25
     * 同步订单数据
     * ZHM
     */
    public function syncOrder() {
        $params = fixer::input('request')->getArray();
        $data = $this->loadService('order')->syncOrder($params['param']);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 2016-7-25
     * 更新订单数据
     * ZHM
     */
    public function updateOrderDetail() {
        $params = fixer::input('request')->getArray();
        $data = $this->loadService('order')->updateOrderDetail($params['param']);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 2016-7-29
     * Author ZHM
     * 接收ERP推送订单接口
     */
    public function syncOrderErp() {
        $params = fixer::input('request')->getArray();
        $data = $this->loadService('order')->syncOrderErp($_POST);
        $this->view->result = $data;
        $this->display();
    }

    public function test(){
        $param = array('code'=>'123','desc'=>'this is a test','type'=>'NC_5','user_code'=>'user_code12','status'=>'已审批');
        $return = $this->loadService('client')->init_post('http://dev.industry.project.g7s.chinawayltd.com/rest/service.php?method=industry.order.syncOrderErp',$param);
        $this->view->result = $return;
        $this->display();
    }

    /**
     * Desc:转包上报
     * @Author Lvison
     */
    public function subcontract(){
        $params = fixer::input('request')->get();
        $data = $this->loadService('order')->subcontract($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * Desc:上传异常签收处理凭据
     * @Author Ivan
     */
    public function updataAbnormalImage(){
        $params = fixer::input('request')->get();
        $data = $this->loadService('order')->updataAbnormalImage($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * Desc:获取该销售订单列表
     * @Author Ivan
     */
    public function getAuthOrders(){
        $params = fixer::input('request')->get();
        $data = $this->loadService('order')->getAuthOrders($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * Desc:获取该销售订单详情
     * @Author Ivan
     */
    public function getAuthOrderDetail(){
        $params = fixer::input('request')->get();
        $data = $this->loadService('order')->getAuthOrderDetail($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * Desc:通过随机码获取订单信息
     * @Author Lvison
     */
    public function getOrderByGuid(){
        $params = fixer::input('request')->getArray();
        $data = $this->orderService->getOrderByGuid($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * Desc:微信要货计划订单列表
     * 2017-10-17
     */
    public function erpOrderList(){
        $params = fixer::input('request')->getArray();
        $data = $this->orderService->erpOrderList($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 获取要货订单列表
     * Author ZHM
     * 2017-10-18
     */
    public function getErpGoodsCodes() {
        $params = fixer::input('request')->get();
        $data = $this->orderService->getErpGoodsCodes($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 获取要货基地列表
     * Author ZHM
     * 2017-10-18
     */
    public function getFromNames() {
        $params = fixer::input('request')->get();
        $data = $this->orderService->getFromNames($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 订单跟踪详情
     * Author ZHM
     * 2017-10-19
     */
    public function getOrderTrace() {
        $params = fixer::input('request')->get();
        $data = $this->orderService->getOrderTrace($params);
        $this->view->result = $data;
        $this->display();
    }
}
