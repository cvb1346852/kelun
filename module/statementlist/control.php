<?php
/**
 * @author zsq
 * The control file of truck_source module.
 */
    class statementlist extends control
{
	/**
     * 运输明细报表
     * Author will
     * 2017-1-3
     */
    public function getShipmentReport() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('statementlist')->getShipmentReport($params);

        $this->view->result = $data;
        $this->display();
    }
    /**
     * 获取运输质量明细报表
     * Author ivan
     * 2017-1-3
     */
    public function getOrderTrans()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getOrderTrans($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 获取选择框所有承运商
     * Author ivan
     * 2017-1-3
     */
    public function getCarrierName()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getCarrierName($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 获取废标报表
     * Author ivan
     * 2017-1-3
     */
    public function getAbandTenderList()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getAbandTenderList($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     *  分级运价审批明细报表
     * Author will
     * 2017-1-3
     */
    public function getRetifyList()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getRetifyList($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 取消中标报表
     * Author ivan
     * 2017-1-3
     */
    public function getAbandWinBidList()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getAbandWinBidList($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 到站中标价分析报表
     * Author will
     * 2017-1-3
     */
    public function getArriveList()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getArriveList($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 查询司机全量名称
     * Author will
     * 2017-1-3
     */
    public function getDriverNameList()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getDriverNameList($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 调度单定位明细报表
     * Author will
     * 2017-1-3
     */
    public function getLbsDetailList()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getLbsDetailList($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 统计运营面板上方总数
     * Author will
     * 2017-1-3
     */
    public function getStatementCount()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getStatementCount($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 司机LBS明细报表
     * Author will
     * 2017-1-3
     */
    public function getLbsCost()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getLbsCost($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 回单明细报表
     * Author will
     * 2017-1-3
     */
    public function getReceiptList()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getReceiptList($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     *固定运价合同提醒报表
     * Author will
     * 2017-1-3
     */
    public function getReportList()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getReportList($params);
        $this->view->result = $data;
        $this->display();
    }
     /* 基地被投诉列表
     * Author will
     * 2017-1-4
     */
    public function getAppealWU()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getAppealWU($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 承运商被投诉列表
     * Author will
     * 2017-1-4
     */
    public function getAppealCarrier()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getAppealCarrier($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * The search page of carrier module.
     *
     */
    public function getResultName ()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getResultName($params);
        $this->view->pager = $data;
        $this->display();
    }
    
    /**
     * 中标统计报表
     * Author ivan
     * 2017-1-3
     */
    public function getWinBidList()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getWinBidList($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 承运商竞标关注明细
     * Author ivan
     * 2017-1-3
     */
    public function getCarrierAttentionDetail()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getCarrierAttentionDetail($params);
        $this->view->result = $data;
        $this->display();
    }


    /**
     * 一口价设置明细报表
     * Author sunjie
     * 2017-1-9
     */
    public function oneprice_report()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->oneprice_report($params);
        $this->view->result = $data;
        $this->display();
    }

    
    /**
     * 承运商竞标关注明细
     * Author ivan
     * 2017-1-3
     */
    public function getCarrierBidDetail()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getCarrierBidDetail($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 承运商考核报表
     * Author ivan
     * 2017-1-3
     */
    public function getCarrierEvaluationList()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getCarrierEvaluationList($params);
        $this->view->result = $data;
        $this->display();
    }
    
    /**
     * 基地考核报表
     * Author ivan
     * 2017-1-3
     */
    public function getWareEvaluationList ()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getWareEvaluationList($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 承运商排名报表
     * Author ivan
     * 2017-1-3
     */
    public function getCarrierRankingList ()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getCarrierRankingList($params);
        $this->view->result = $data;
        $this->display();
    }
    /**
     * 承运商排名报表
     * Author ivan
     * 2017-1-3
     */
    public function getDriverRankingList ()
    {
        $params = fixer::input('request')->get();
        $data=$this->loadService('statementlist')->getDriverRankingList($params);
        $this->view->result = $data;
        $this->display();
    }


        /**
         * 发标、中标时间明细报表
         * Author SUNJIE
         * 2017-1-16
         */
        public function tenderlist() {
            $params = fixer::input('request')->get();
            $data = $this->loadService('statementlist')->tenderlist($params);
            $this->view->result = $data;
            $this->display();
        }

        /**
         * lbs费用统计报表
         * Author SUNJIE
         * 2017-1-17
         */
        public function lbsConstStatistical() {
            $params = fixer::input('request')->get();
            $data = $this->loadService('statementlist')->lbsConstStatistical($params);
            $this->view->result = $data;
            $this->display();
        }


        /**
         * lbs费用明细报表（调度单）
         * Author SUNJIE
         * 2017-1-17
         */
        public function lbsCostShipment() {
            $params = fixer::input('request')->get();
            $data = $this->loadService('statementlist')->lbsCostShipment($params);
            $this->view->result = $data;
            $this->display();
        }


    /**
     * 获取各种类型的统计
     * Author SUNJIE
     * 2017-1-12
     */
    public function getTypeNum() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('statementlist')->getTypeNum($params);
        $this->view->result = $data;
        $this->display();
    }

    /**
     * 改标明细
     * Author SUNJIE
     * 2017-1-18
     */
    public function changeTender() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('statementlist')->changeTender($params);
        $this->view->result = $data;
        $this->display();
    }
     /*基地发货报表*/
    public function getGoods() {
        $params = fixer::input('request')->get();
        $data = $this->loadService('statementlist')->getGoods($params);
        $this->view->result = $data;
        $this->display();
    }
    
    public function getLineTender_x1(){
    	$params = fixer::input('request')->get();
    	$data = $this->loadService('statementlist')->getLineTender_x1($params);
    	$this->view->result = $data;
    	$this->display();
    }
    public function getLineTender_x2(){
    	$params = fixer::input('request')->get();
    	$data = $this->loadService('statementlist')->getLineTender_x2($params);
    	$this->view->result = $data;
    	$this->display();
    }
    public function getLineTender_x3(){
    	$params = fixer::input('request')->get();
    	$data = $this->loadService('statementlist')->getLineTender_x3($params);
    	$this->view->result = $data;
    	$this->display();
    }
    public function getLineTender(){
    	$params = fixer::input('request')->get();
    	$data = $this->loadService('statementlist')->getLineTender($params);
    	$this->view->result = $data;
    	$this->display();
    }
    
    public function getLineTenderTrend_y1(){
    	$params = fixer::input('request')->get();
    	$data = $this->loadService('statementlist')->getLineTenderTrend_y1($params);
    	$this->view->result = $data;
    	$this->display();
    }
    public function getLineTenderTrend_y2(){
    	$params = fixer::input('request')->get();
    	$data = $this->loadService('statementlist')->getLineTenderTrend_y2($params);
    	$this->view->result = $data;
    	$this->display();
    }
    public function getLineTenderTrend(){
    	$params = fixer::input('request')->get();
    	$data = $this->loadService('statementlist')->getLineTenderTrend($params);
    	$this->view->result = $data;
    	$this->display();
    }

}