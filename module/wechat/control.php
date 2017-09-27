<?php

/** 微信操作类，与微信公众平台交互
 * Class wechat
 * create by Lvison
 * 2016-07-11
 */
class wechat extends control{

    /**
     * Desc:路由方法
     * @Author Lvison
     * @throws Exception
     */
    public function route(){
        if ($GLOBALS["HTTP_RAW_POST_DATA"]) {//若有POST过来数据，则依据如下逻辑处理
            //验证微信公众号版本 物流版、货主版
            if(!in_array($this->config->weChatType,$this->config->wechat->type)){
                throwException('非系统支持的微信公众号');
            }
            /*if(!in_array(WECHAT_TYPE,$this->config->wechat->type)){
                throwException('非系统支持的微信公众号');
            }*/
            $postArr = $this->wechatService->xml2arr(simplexml_load_string($GLOBALS["HTTP_RAW_POST_DATA"], 'SimpleXMLElement', LIBXML_NOCDATA));//接收数据
            if ($postArr[MsgType] == "text") {//文本消息或关注事件
            } elseif ($postArr[MsgType] == "image") {//图片消息
            } elseif ($postArr[MsgType] == "location") {//地理位置消息
            } elseif ($postArr[MsgType] == "link") {//链接消息
            } elseif ($postArr[MsgType] == "event") {//事件推送
                $this->wechatService->do_event($postArr);
            }
        } else {//否则就认为是在初次验证URL
            define("TOKEN", "kelun_industry_group");
            //验证接口
            $fixer = fixer::input('request')->getArray();
            tools::datalog('参数'.var_export($fixer,true),'wechatParam_');
            if(!$fixer['echostr'])
                throwException('无法完成效验，缺少必要的参数：echostr');
            elseif(!$this->checkSignature())
                throwException('签名验证失败');
            else
                exit($fixer['echostr']);
        }
    }

    /**
     * Desc:验证签名
     * @Author Lvison
     * @return bool
     * @throws Exception
     */
    private function checkSignature(){
        if (!defined("TOKEN")) {
            throwException('TOKEN is not defined!');
        }

        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];

        $token = TOKEN;
        $tmpArr = array($token, $timestamp, $nonce);
        sort($tmpArr, SORT_STRING);
        $tmpStr = implode( $tmpArr );
        $tmpStr = sha1( $tmpStr );

        if( $tmpStr == $signature ){
            return true;
        }else{
            return false;
        }
    }

    /**
     * Desc:创建菜单
     * @Author Lvison
     */
    public function createMenu(){
        $data = $this->wechatService->createMenu();
        $this->view->result = $data;
        $this->display();
    }

    /**
     * Desc:通过授权的code获取openid
     * @Author Lvison
     */
    public function getOpenIdByCode(){
        $fixer = fixer::input('request')->getArray(); 
        $data = $this->wechatService->getOpenIdByCode($fixer);
        $this->view->result = $data;
        $this->display();
    } 
    /**
     * Desc:获取js-sdk权限签名
     * @Author Lvison
     */
    public function getJsSignature(){
        $fixer = fixer::input('request')->getArray();
        $data = $this->wechatService->getJsSignature($fixer);
        $this->view->result = $data;
        $this->display();
    }


    public function sendTempMessageTest(){
        $fixer = array(
            'openid'=>'ovVHmt-uDFImDcDXdkf8QeNvjHdc',
            'url'=>'',
            'first'=>array('value'=>'您有一个订单签收','color'=>'#000000'),
            'keyword1'=>array('value'=>'ORDER1234','color'=>'#000000'),
            'keyword2'=>array('value'=>'15002844993','color'=>'#000000'),
            'keyword3'=>array('value'=>'2016-08-06 15:00:00','color'=>'#000000'),
            'keyword4'=>array('value'=>'长虹科技大厦','color'=>'#000000'),
        );
        $data = $this->wechatService->sendTempMessage('sign_notice',$fixer,'shipment');
        $this->view->result = $data;
        $this->display();
    }
    /**
     * Desc:根据经纬度获取地址
     * @Author Lvison
     */
    public function getAddressByLngLat(){
        $fix = fixer::input('request')->getArray();
        $this->view->result = $this->loadService('api')->getAddressByLngLat($fix);
        $this->display();
    }
}