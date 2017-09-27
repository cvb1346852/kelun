<?php

class bidding extends control
{


    public function getShipments()
    {
        $params = fixer::input('request')->get();
        $pager = $this->biddingService->getShipments($params);
        $this->view->pager = $pager;
        $this->display();
    }

    /**
     * Desc: 获取运单的投标信息
     * @Author sunjie
     */
    public function tenderQuoteList(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('bidding')->tenderQuoteList($fix);
        $this->display();
    }

}
?>