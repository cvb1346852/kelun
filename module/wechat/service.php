<?php

/**微信服务类
 * Class wechatService
 */
class wechatService extends service{

    public function __construct()
    {
        parent::__construct('wechat');
    }

    /**
     * Desc:将xml转化为数组
     * @param $xml
     * @Author Lvison
     * @return mixed
     */
    public function xml2arr($xml){
        foreach ($xml as $key => $value){
            $listDb[$key]=$this->get_ajax($value);
        }
        return $listDb;
    }

    /**
     * Desc:获取微信access_token凭证
     * @Author Lvison
     * @return mixed
     */
    public function getAccessToken(){ 
        //读取缓存
        //$accessToken = redisCache(WECHAT_TYPE.'_accessToken',array());
        $accessToken = redisCache($this->config->weChatType.'_accessToken');

        if(empty($accessToken)){
            $account = $this->config->wechat->account;
//            $appId = $account[WECHAT_TYPE]['appId'];
            $appId = $account[$this->config->weChatType]['appId'];
//            $appSecret = $account[WECHAT_TYPE]['appSecret'];
            $appSecret = $account[$this->config->weChatType]['appSecret'];
            if(empty($appId)){
                throwException('appid参数为空');
            }
            if(empty($appSecret)){
                throwException('appSecret参数为空');
            }
            $url = sprintf($this->config->wechat->api->accessToken,$appId,$appSecret);

            $result = $this->weChatRequest($url);
            $accessToken = $result['access_token'];
            $expires_in = intval($result['expires_in']) - 120;
            //重新写入缓存
//            redisCache(WECHAT_TYPE.'_accessToken',$accessToken,$expires_in);
            redisCache($this->config->weChatType.'_accessToken',$accessToken,$expires_in);
        }
        return $accessToken;
    }

    /**
     * Desc:发送微信请求
     * @param string $url
     * @param string $type
     * @param array $data
     * @Author Lvison
     * @return mixed
     * @throws
     */
    private function weChatRequest($url = '',$type='get',$data=array()){
        $url = $this->config->wechat->domain.$url;
        $ch = curl_init();
        $timeout = 5;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); //不验证证书下同，https请求
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        if($type == 'post'){
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data,JSON_UNESCAPED_UNICODE));
        }
        $file_contents = curl_exec($ch);
        if($file_contents === false) {
        	tools::datalog(var_export(curl_error($ch),true),'wechatErr_');
        	//增加一次重试
        	$file_contents = curl_exec($ch);
        	if($file_contents === false) {
        		tools::datalog(var_export(curl_error($ch),true),'wechatErr_');
        	}
        }
        
        curl_close($ch);
        $result = json_decode($file_contents,true);

        if(isset($result['errcode']) && $result['errcode'] !=0){
            tools::datalog('微信请求错误参数'.var_export($data,true),'wechatRequest_');
            tools::datalog('微信请求错误地址'.var_export($url,true),'wechatRequest_');
            tools::datalog('微信请求错误结果'.var_export($result,true),'wechatRequest_');
        }else{
            return $result;
        }
    }

    /**
     * Desc:创建菜单
     * @Author Lvison
     * @return mixed
     * @throws
     */
    public function createMenu(){
        if(!in_array($this->config->weChatType,$this->config->wechatType)){
            throwException('非系统支持的微信公众号');
        }
        /*if(!in_array(WECHAT_TYPE,$this->config->wechatType)){
            throwException('非系统支持的微信公众号');
        }*/
        $accessToken = $this->getAccessToken();
//        $menu = $this->config->wechat->menu[WECHAT_TYPE];
        $menu = $this->config->wechat->menu[$this->config->weChatType];
        $menu['button'] = $this->buildMenu($menu['button']);
        $url = sprintf($this->config->wechat->api->createMenu,$accessToken);
        $result = $this->weChatRequest($url,'post',$menu);
        return $result;
    }

    /**
     * Desc:构建菜单
     * @param $menu
     * @Author Lvison
     * @return mixed
     */
    private function buildMenu($menu){
        foreach ($menu as &$item) {
            if (!empty($item['type']) && $item['type'] == 'view') {
                $account = $this->config->wechat->account;
//                $appId = $account[WECHAT_TYPE]['appId'];
                $appId = $account[$this->config->weChatType]['appId'];
                $redirect_uri = urlencode($item['url']);
                $scope = 'snsapi_base';
                $url = sprintf($this->config->wechat->auth2->url, $appId, $redirect_uri, $scope);
                $item['url'] = $url;
            }
            if (!empty($item['sub_button'])) {
                $item['sub_button'] = $this->buildMenu($item['sub_button']);
            }
        }
        return $menu;
    }

    /**
     * Desc:auth2授权获取access_token
     * @param $code
     * @Author Lvison
     * @return mixed
     */
    public function auth2GetAccessToken($code){
        if(empty($code)){
            throwException('回调code参数为空');
        }
        $account = $this->config->wechat->account;
        /*$appId = $account[WECHAT_TYPE]['appId'];
        $appSecret = $account[WECHAT_TYPE]['appSecret'];*/

        $appId = $account[$this->config->weChatType]['appId'];
        $appSecret = $account[$this->config->weChatType]['appSecret'];
        if(empty($appId)){
            throwException('appid参数为空');
        }
        if(empty($appSecret)){
            throwException('appSecret参数为空');
        }
        $getAccessTokenUrl = sprintf($this->config->wechat->auth2->accessToken,$appId,$appSecret,$code);
        $result = $this->weChatRequest($getAccessTokenUrl);
        return $result;
    } 
    /**
     * Desc:通过授权的code获取openid
     * @param $res
     * @Author Lvison
     * @return array
     */
    public function getOpenIdByCode($res){
        $auth2AccessToken = $this->auth2GetAccessToken($res['code']);
        if(empty($auth2AccessToken['openid'])){
            array('openid'=>'');
        }
        return array('openid'=>$auth2AccessToken['openid']);
    }

    /**
     * Desc:获取二维码路径
     * @param string $weChatType
     * @param array $data
     * @Author Lvison
     * @return string
     */
    public function getQrCode($weChatType='shipment',$data=array()){
        //生成二维码
        if(!in_array($weChatType,$this->config->wechatType)){
            throwException('非系统支持的微信公众号');
        }
//        define(WECHAT_TYPE,$weChatType);
        $this->config->weChatType = $weChatType;
        $accessToken = $this->getAccessToken();
        $ticketArr = $this->createQrCode($accessToken,$data);
        //获取二维码文件地址
        $qrCodeUrl = $this->showQrCode($ticketArr['ticket']);
        $ticketArr['qrCodeUrl'] = $qrCodeUrl;

        return $ticketArr;
    }

    /**
     * Desc:生成二维码
     * @param $accessToken
     * @param array $data 参数action_name;expire_seconds;scene_id;scene_str
     * @Author LvisoncheckLogin
     * @return mixed
     */
    private function createQrCode($accessToken,$data=array()){
        if(empty($accessToken)){
            throwException('缺少参数accessToken');
        }
        //微信支持的二维码类型
        $action_names = array('QR_SCENE','QR_LIMIT_SCENE','QR_LIMIT_STR_SCENE');

        $param = array();
        //二维码有效时间
        if(isset($data['expire_seconds'])){
            //二维码有效时间，最大259200-30天 临时二维码有效
            $param['expire_seconds'] = intval($data['expire_seconds']) > 259200 ? 259200 :intval($data['expire_seconds']);
        }
        //二维码类型
        if(empty($data['action_name'])){
            $param['action_name'] = 'QR_LIMIT_STR_SCENE';
        }else if(!in_array($data['action_name'],$action_names)){
            throwException('非微信支持的二维码类型');
        }else{
            $param['action_name'] = $data['action_name'];
        }
        //二维码参数
        $param['action_info'] = array('scene'=>array());
        if(!empty($data['scene_id'])){
            if($param['action_name'] != 'QR_SCENE' && iteval($data['scene_id'] >100000)){
                throwException('永久二维码最大支持scenen_id：100000');
            }
            $param['action_info']['scene']['scene_id'] = $data['scene_id'];
        }
        //仅永久二维码支持scene_str,最大长度64位的字符串
        if($param['action_name'] != 'QR_SCENE' && !empty($data['scene_str'])){
            $param['action_info']['scene']['scene_str'] = substr($data['scene_str'],0,64);
        }

        $url = sprintf($this->config->wechat->api->createQrcode,$accessToken);
        $result = $this->weChatRequest($url,'post',$param);
        return $result;
    }

    /**
     * Desc:通过ticket获取二维码图片
     * @param $ticket
     * @Author Lvison
     * @return string
     */
    private function showQrCode($ticket){
        if(!empty($ticket)){
            $ticket = urlencode($ticket);
        }else{
            throwException('无效的二维码ticket');
        }
        $url = sprintf($this->config->wechat->api->showQrcode,$ticket);
        return $url;
    }

    /**
     * Desc:获取js-sdk权限签名
     * @param $res
     * @Author Lvison
     * @return array
     */
    public function getJsSignature($res){
        if(!empty($res['url'])){
            //去掉url#后面的部分
            $urlArr = explode('#',$res['url']);

            $url = $urlArr[0];
            $jsApiTicket = $this->jsApiTicket();
            $signPackage = $this->createSignature($jsApiTicket,$url);
            $account = $this->config->wechat->account;
//            $signPackage['appId'] = $account[WECHAT_TYPE]['appId'];
            $signPackage['appId'] = $account[$this->config->weChatType]['appId'];
            return $signPackage;
        }else{
            throwException('无效的网页url地址');
        }
    }

    /**
     * Desc:获取jsapi_ticket
     * @Author Lvison
     * @return mixed|string
     */
    private function jsApiTicket(){
        //读取缓存
//        $jsApiTicket = redisCache(WECHAT_TYPE.'_jsApiTicket');
        $jsApiTicket = redisCache($this->config->weChatType.'_jsApiTicket');
        if(empty($jsApiTicket)) {
            $accessToken = $this->getAccessToken();
            if (!empty($accessToken)) {
                $url = sprintf($this->config->wechat->api->getTicket, $accessToken);
                $result = $this->weChatRequest($url);
                //重新写入缓存
//                redisCache(WECHAT_TYPE . '_jsApiTicket', $result['ticket'], intval($result['expires_in']));
                redisCache($this->config->weChatType . '_jsApiTicket', $result['ticket'], intval($result['expires_in']));
                return $result['ticket'];
            } else {
                throwException('无法取得access_token');
            }
        }else{
            return $jsApiTicket;
        }
    }

    /**
     * Desc:生成js-sdk权限签名
     * @param $jsapiTicket
     * @param $url
     * @Author Lvison
     * @return array
     */
    private function createSignature($jsapiTicket,$url){
        if(!empty($jsapiTicket) && !empty($url)){
            $nonceStr = $this->createNonceStr();
            $timestamp = time();
            // 这里参数的顺序要按照 key 值 ASCII 码升序排序
            //$string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";
            $string = "jsapi_ticket=".$jsapiTicket."&noncestr=".$nonceStr."&timestamp=".$timestamp."&url=".$url;;
            $signature = sha1($string);

            $signPackage = array(
                "nonceStr"  => $nonceStr,
                "timestamp" => $timestamp,
                "url"       => $url,
                "signature" => $signature,
                "rawString" => $string
            );

            return $signPackage;

        }else{
            throwException('缺少生成js-sdk权限签名的参数');
        }
    }

    /**
     * Desc:生成随机字符串
     * @param int $length
     * @Author Lvison
     * @return string
     */
    public function createNonceStr($length = 16, $type = "mix") {
        $chars = "";
        switch ($type) {
            case 'mix':
                $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                break;
            case 'letters':
                $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                break;
            case 'num':
                $chars = "0123456789";
                break;
            default:
                $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                break;
        }
        $str = "";
        for ($i = 0; $i < $length; $i++) {
            $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }
        return $str;
    }


    /**
     * Desc:设置微信公众号所属行业
     * @param string $wechatType
     * @param string $industry
     * @Author Lvison
     * 行业代码查询 http://mp.weixin.qq.com/wiki/5/6dde9eaa909f83354e0094dc3ad99e05.html
     */
    public function setIndustry($wechatType='shipment',$industry=''){
//        define(WECHAT_TYPE,$wechatType);
        $this->config->weChatType = $wechatType;
        $token = $this->getAccessToken();
        $url = sprintf($this->config->wechat->api->template->setIndustry,$token);
        $industry = $this->config->wechat->tempIndustry[$wechatType];
        if(!empty($industry)){
            $result = $this->weChatRequest($url,'post',$industry);
        }else{
            throwException('行业设置不能为空');
        }
    }

    /**
     * Desc:获取账号设置的行业信息
     * @param string $wechatType
     * @Author Lvison
     * @return mixed
     */
    public function getIndustry($wechatType='shipment'){
//        define(WECHAT_TYPE,$wechatType);
        $this->config->weChatType = $wechatType;
        $token = $this->getAccessToken();
        $url = sprintf($this->config->wechat->api->template->getIndustry,$token);
        $result = $this->weChatRequest($url);
        return $result;

    }

    /**
     * Desc:获取模板id
     * @param string $wechatType
     * @Author Lvison
     */
    public function addTemplate($wechatType='shipment'){

    }

    /**
     * Desc:获取账号下所有的模板信息
     * @param $wechatType
     * @Author Lvison
     */
    public function getAllPrivateTemplate($wechatType='shipment'){

    }

    /**
     * Desc:发送模板消息
     * @param string $wechatType
     * @param $data
     * @Author Lvison
     */
    public function sendTemplateMessage($type,$data,$wechatType='shipment'){

    }

    /**
     * Desc:微信测试账号发送模板消息
     * @param $type 消息模板key //详见 wechat/config.php  $config->wechat->allTempMessage
     * @param $data = array('openid'=>'','url'=>'模板消息跳转的连接','keyword1'=>array('value'=>'恭喜购买成功','color'=>'#000000'),'keyword2'=>array('value'=>'','color'=>'').........)
     * @param string $wechatType
     * @Author Lvison
     * @return mixed
     */

    public function sendTempMessage($type,$data,$wechatType='shipment'){
//        define(WECHAT_TYPE,$wechatType);
        $this->config->weChatType = $wechatType;
        $temp = $this->config->wechat->allTempMessage[$type];
        if(empty($temp)){
            return array('errcode'=>1,'message'=>'未定义的消息类型');
        }
        $keyword = array();
        foreach ($temp['data'] as $key=>$item) {
            if(isset($data[$key])){
                $keyword[$key] = array('value'=>$data[$key]['value'],'color'=>$data[$key]['color'] ? $data[$key]['color'] : '#000000');
            }else{
                $keyword[$key] = array('value'=>$item['value'],'color'=>$item['color']);
            }
        }
        if(empty($keyword)){
            return array('errcode'=>1,'message'=>'消息模板配置错误');
        }
        $result = $this->sendweChatTemplateMessage($data['openid'],$temp['template_id'],$data['url'],$keyword);
        
        if($type == 'tenderAudit'){
        	tools::datalog(var_export($data['openid'],true).var_export($keyword,true),'sendweChatTemplateMessage_tenderAudit_');
        	tools::datalog(var_export($data['openid'],true).var_export($result,true),'sendweChatTemplateMessage_tenderAudit_');
        }
        
        return $result;
    } 
    /**
     * Desc:发送微信模板消息
     * @param $openid
     * @param $template_id
     * @param $url
     * @param $data
     * @Author Lvison
     * @return array|mixed
     */
    private function sendweChatTemplateMessage($openid,$template_id,$url,$data){
        if(empty($openid)){
            return array('errcode'=>1,'message'=>'openid不能为空');
        }
        if(empty($template_id)){
            return array('errcode'=>1,'message'=>'template_id不能为空');
        }
        if(empty($data)){
            return array('errcode'=>1,'message'=>'data不能为空');
        }

        $param = array('touser'=>$openid,
            'template_id' =>$template_id,
            'url' => $url ? $url :'',
            'data' =>$data
        );
        //获取token
        $token = $this->getAccessToken();
        $url = sprintf($this->config->wechat->api->template->sendTemplateMessage,$token);
        //发送请求
        $result = $this->weChatRequest($url,'post',$param);
        //
        //tools::datalog(var_export($param,true),'sendweChatTemplateMessage_');
        return $result;
    }
}