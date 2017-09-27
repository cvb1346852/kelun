<?php
    /**
     * @author zsq
     * The control file of truck_source module.
     */
    class tender extends control
{
        /**
         * 获取招标列表
         * Author sunjie
         * 2016-11-10
         */
        public function getShipments() {
            $params = fixer::input('request')->get();
            $data = $this->loadService('tender')->getShipments($params);
            $this->view->result = $data;
            $this->display();
        }
        /**
         * 微信端获取司机信誉度
         * Author will
         * 2016-12-26
         */
        public function getSignMsg_wechat() {
            $params = fixer::input('request')->get();
            $data = $this->loadService('tender')->getSignMsg_wechat($params);
            $this->view->result = $data;
            $this->display();
        }

        /**
         * 加入缓存，发送成功短信
         * Author will
         * 2016-11-10
         */
        public function addRedis_sendMsg() {
            $params = fixer::input('request')->get();
            $data = $this->loadService('tender')->addRedis_sendMsg($params);
            $this->view->result = $data;
            $this->display();
        }

        /**
         * Desc: 检查运单的招标状态
         * @Author sunjie
         */
        public function checkTenderStatus(){
            $fix = fixer::input('request')->getArray();
            $this->view->result = $this->loadService('tender')->checkTenderStatus($fix);
            $this->display();
        }

        /**
         * Desc: 批量检查运单的招标状态
         * @Author sunjie
         */
        public function checkTenderStatuies(){
            $fix = fixer::input('request')->getArray();
            $this->view->result = $this->loadService('tender')->checkTenderStatuies($fix);
            $this->display();
        }


        /**
         * Desc: 保存招标
         * @Author sunjie
         */
        public function saveTender(){
            $fix = fixer::input('request')->getArray();
            $this->view->result = $this->loadService('tender')->saveTender($fix);
            $this->display();
        }

        /**
         * Desc: 批量保存招标
         * @Author sunjie
         */
        public function saveTenders(){
            $fix = fixer::input('request')->getArray();
            $this->view->result = $this->loadService('tender')->saveTenders($fix);
            $this->display();
        }

        /**
         * Desc: 展示标的信息
         * @Author will
         */
        public function getTenderInfo(){
            $fix = fixer::input('request')->getArray();
            $this->view->result = $this->loadService('tender')->getTenderInfo($fix);
            $this->display();
        }


        /**
         * Desc: 获取运单的投标信息
         * @Author sunjie
         */
        public function tenderQuoteList(){
            $fix = fixer::input('request')->getArray();
            $this->view->result = $this->loadService('tender')->tenderQuoteList($fix);
            $this->display();
        }

        /**
         * Desc: 改变投标状态
         * @Author sunjie
         */
        public function changeTenderQuote(){
            $fix = fixer::input('request')->getArray();
            $this->view->result = $this->loadService('tender')->changeTenderQuote($fix);
            $this->display();
        }

      public function search_wechat()
      {
          $params = fixer::input('request')->get();
          $pager = $this->tenderService->search_wechat($params);
          $this->view->pager = $pager;
          $this->display();
     }
        public function searchEchart_count()
    {
        $params = fixer::input('request')->get();
        $pager = $this->tenderService->searchEchart_count($params);
        $this->view->pager = $pager;
        $this->display();
    }
        //get tenderinfo by tender_id
        public function getTenderById()
    {
        $params = fixer::input('request')->get();
        $pager = $this->tenderService->getTenderById($params);
        $this->view->data = $pager;
        $this->display();
    }
        //get confirm by tender_id
        public function confirmOk()
    {
        $params = fixer::input('request')->get();
        $pager = $this->tenderService->confirmOk($params);
        $this->view->pager = $pager;
        $this->display();
    }
        //get validateOpneid 是否存在
        public function validateOpneid()
    {
        $params = fixer::input('request')->get();
        $pager = $this->tenderService->validateOpneid($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
   * 获取竞标列表
   * Author Ivan
   * 2016-9-22
   */
       public function getBidList()
    {
        $params = fixer::input('request')->get();
        $data = $this->tenderService->getBidList($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
   * 获取竞标页面信息
   * Author Ivan
   * 2016-9-26
   */
       public function bidquote()
    {
        $params = fixer::input('request')->get();
        $data = $this->tenderService->bidquote($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
   * 获取一口价页面信息
   * Author Ivan
   * 2016-9-26
   */
       public function fixedquote()
    {
        $params = fixer::input('request')->get();
        $data = $this->tenderService->fixedquote($params);
        $this->view->result = $data;
        $this->display();
    }
    
      /**
   * 获取历史同期中标信息
   * Author Ivan
   * 2016-9-26
   */
       public function historyTender()
    {
        $params = fixer::input('request')->get();
        $data = $this->tenderService->historyTender($params);
        $this->view->result = $data;
        $this->display();
    }
    
       /**
   * 判断是否已经报过价
   * Author Ivan
   * 2016-9-26
   */
       public function checkTenderQuote()
    {
        $params = fixer::input('request')->get();
        $data = $this->tenderService->checkTenderQuote($params);
        $this->view->result = $data;
        $this->display();
    }

        //get approve  list by openid
        public function getApproveList()
    {
        $params = fixer::input('request')->get();
        $pager = $this->tenderService->getApproveList($params);
        $this->view->pager = $pager;
        $this->display();
    }
      //get retify info
        public function getRetifyinfo()
    {
        $params = fixer::input('request')->get();
        $pager = $this->tenderService->getRetifyinfo($params);
        $this->view->pager = $pager;
        $this->display();
    }

      /**
   * 添加报价
   * Author Ivan
   * 2016-9-26
   */
       public function addQoute()
    {
        $params = fixer::input('request')->get();
        $data = $this->tenderService->addQoute($params);
        $this->view->result = $data;
        $this->display();
    }


     /**
   * push表更改阅读字段
   * Author Ivan
   * 2016-9-27
   */
       public function updatePush()
    {
        $params = fixer::input('request')->get();
        $data = $this->tenderService->updatePush($params);
        $this->view->result = $data;
        $this->display();
    }
    /*
     *判断报价表状态
     * Author will
     * 2016-9-27
     */
        public function getAuditStatus()
    {
        $params = fixer::input('request')->get();
        $data = $this->tenderService->getAuditStatus($params);
        $this->view->result = $data;
        $this->display();
    }
     /**
   * 发标通知
   * Author Ivan getQuoteStatus
   * 2016-9-28
   */
       public function tenderMsg()
    {
        $params = fixer::input('request')->get();
        $data = $this->tenderService->tenderMsg($params);
        $this->view->result = $data;
        $this->display();
    }
     /**
   * 废标
   * Author Ivan
   * 2016-9-29
   */
       public function abandTender()
    {
        $params = fixer::input('request')->get();
        $data = $this->tenderService->abandTender($params);
        $this->view->result = $data;
        $this->display();
    }
        //retify  OK
        public function retifyOk()
    {
        $params = fixer::input('request')->get();
        $pager = $this->tenderService->retifyOk($params);
        $this->view->pager = $pager;
        $this->display();
    }

    //定时任务：推送tenderpush表中的数据
    public function SendTenderPush(){
        $params = fixer::input('request')->get();
        $data = $this->tenderService->SendTenderPush($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 获取废标列表
     * Author Ivan getQuoteStatus
     * 2016-10-14
     */
    public function getAbandTender()
    {
        $params = fixer::input('request')->get();
        $data = $this->tenderService->getAbandTender($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 获取废标列表
     * Author Ivan getQuoteStatus
     * 2016-10-14
     */
    public function abandTenderQuoteList()
    {
        $params = fixer::input('request')->get();
        $data = $this->tenderService->abandTenderQuoteList($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 获取废标列表
     * Author Ivan getQuoteStatus
     * 2016-10-14
     */
    public function getShipmentCodes()
    {
        $params = fixer::input('request')->get();
        $data = $this->tenderService->getShipmentCodes($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 获取发标的对应承运商信息
     * Author sunjie
     * 2016-11-17
     */
    public function searchTenderCarrier ()
    {
        $params = fixer::input('request')->get();
        $pager = $this->tenderService->searchTenderCarrier($params);
        $this->view->pager = $pager;
        $this->display();
    }

        /**
         * Desc:获取审批结果列表
         * @Author Lvison
         */
        public function getAuditResult(){
            $params = fixer::input('request')->getArray();
            $pager = $this->tenderService->getAuditResult($params);
            $this->view->pager = $pager;
            $this->display();
        }
         /**
         * Desc: web端获取竞标列表
         * @Author ivan
         */
        public function getBidTenderList(){
            $fix = fixer::input('request')->getArray();
            $this->view->result = $this->loadService('tender')->getBidTenderList($fix);
            $this->display();
        }
        /**
         * Desc:获取竞标订单信息
         * @Author ivan
         */
        public function getTenderMsg(){
            $fix = fixer::input('request')->get();
            $this->view->result = $this->loadService('tender')->getTenderMsg($fix);
            $this->display();
        }
        
        /**
         * Desc:添加承运商报价
         * @Author ivan
         */
        public function addCarrierQuote(){
            $fix = fixer::input('request')->get();
            $this->view->result = $this->loadService('tender')->addCarrierQuote($fix);
            $this->display();
        }
        /**
         * Desc:查看是否报过价
         * @Author ivan
         */
        public function checkQoute(){
            $fix = fixer::input('request')->get();
            $this->view->result = $this->loadService('tender')->checkQoute($fix);
            $this->display();
        }
        /**
         * Desc:web获取我的投标列表页面
         * @Author ivan
         */
        public function getMyTenderList(){
            $fix = fixer::input('request')->get();
            $this->view->result = $this->loadService('tender')->getMyTenderList($fix);
            $this->display();
        }

        /**
         * Desc:检查运单是否发标，中标，预中标，发标，废标等状态
         * @Author ivan
         */
        public function checkShipment(){
            $fix = fixer::input('request')->get();
            $this->view->result = $this->loadService('tender')->checkShipment($fix);
            $this->display();
        }


        /**
         * Desc:指定承运商
         * @Author sunjie
         */
        public function cpecify_carrier(){
            $fix = fixer::input('request')->getArray();
            $this->view->result = $this->tenderService->cpecify_carrier($fix);
            $this->display();
        }


        /**
         * Desc:维护一口价保存
         * @Author sunjie
         */
        public function maintain_price(){
            $fix = fixer::input('request')->getArray();
            $this->view->result = $this->tenderService->maintain_price($fix);
            $this->display();
        }
        
        /**
         * Desc:获取运单定价模式
         * @Author ivan
         */
        public function getShipType(){
            $fix = fixer::input('request')->get();
            $this->view->result = $this->loadService('tender')->getShipType($fix);
            $this->display();
        }
        
        /**
         * Desc:获取相关角色的信用度
         * @Author ivan 
         */
        public function getSignMsg(){
            $fix = fixer::input('request')->get();
            $this->view->result = $this->loadService('tender')->getSignMsg($fix);
            $this->display();
        }
        /**
         * Desc:获取承运商相关基地
         * @Author ivan 
         */
        public function getWareHouse(){
            $fix = fixer::input('request')->get();
            $this->view->result = $this->loadService('tender')->getWareHouse($fix);
            $this->display();
        }


}