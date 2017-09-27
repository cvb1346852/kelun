<?php

/** 接口调用类
 * Class webservice
 */

class webservice extends control{

    /**
     * Desc:webservice 重试请求
     * @Author Lvison
     */
    public function tryWebservice(){
        $result = $this->webserviceService->tryWebservice();
        $this->view->data  = $result;
        $this->display();
    }

}