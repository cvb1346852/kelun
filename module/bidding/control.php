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
     * Desc: ��ȡ�˵���Ͷ����Ϣ
     * @Author sunjie
     */
    public function tenderQuoteList(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('bidding')->tenderQuoteList($fix);
        $this->display();
    }

}
?>