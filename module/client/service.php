<?php

/**
 * 数据获取API接口(dsp/gsp/g7s/sms)
 */
require_once 'Client.php';

class clientService extends Client
{


    public function __construct()
    {
    }

    /**
     * 获取gsp接口数据示例
     */
    public function getGpsPartsChangeByApi($data)
    {
        $post_url = GSPADMIN_URL;
        $app_key = GSPADMIN_KEY;
        $secret = GSPADMIN_SECRET;

        $data = urlencode(json_encode($data));
        $paramArr = array(
            'method' => 'gsp.api.synGpsFunPartsByTime',
            'data' => $data,
            'timestamp' => date("Y-m-d H:i:s"),
            'format' => 'json',
            'app_key' => $app_key
        );
        $sign = Util::createSign($paramArr, $secret); //生成签名
        $paramArr['sign'] = $sign;
        $result = $this->init_post($post_url, $paramArr);
        return $result;
    }

    /**
     * 发送post请求
     * @param unknown $post_url
     * @param unknown $data
     * @param string $header
     * @return unknown
     * @Author: LVison
     * <liuguanghui@huoyunren.com>
     * @Since: 2015年8月6日
     */
    public function init_post($post_url, $data, $header = '')
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $post_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 'application/x-www-form-urlencoded');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        if ($header)
            curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        $output = curl_exec($ch);
        curl_close($ch);
        return $output;
    }

    /**
     * Desc:发送get请求-仅用于生成新浪短地址，需要发送http-header
     * @param $url
     * @Author Lvison
     * @return mixed
     */
    public function init_get($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Encoding:gzip, deflate, sdch",
            "Accept-Language:zh-CN,zh;q=0.8",
            "Cache-Control:no-cache",
            "Connection:keep-alive",
            "Cookie:__cfduid=dde683f8098aceab134d2376f8e7de2811475219401; PHPSESSID=gnn9lcrh61u0ncvvp9stc31hp1; td_cookie=18446744072607465887; Hm_lvt_fd97a926d52ef868e2d6a33de0a25470=1475219426,1475221699; Hm_lpvt_fd97a926d52ef868e2d6a33de0a25470=1475221699",
            "Host:dwz.wailian.work",
            "Pragma:no-cache",
            "Upgrade-Insecure-Requests:1",
            "User-Agent:Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36"
        ));

        curl_setopt($ch, CURLOPT_ENCODING, "gzip, deflate, sdch");
        curl_setopt($ch, CURLOPT_USERAGENT,'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $output = curl_exec($ch);
        curl_close($ch);
        return $output;
    }

    /**
     * Desc:调用g7s接口获取数据
     * @param $method
     * @param $data
     * @param string $app_key
     * @param string $app_secret
     * @Author Lvison
     * @return mixed
     */
    public function g7sRequest($method, $data, $app_key = '', $app_secret = '')
    {
        $post_url = G7SINTERFACE_URL;
        $app_key = $app_key ? $app_key : G7SINTERFACE_KEY;
        $app_secret = $app_secret ? $app_secret : G7SINTERFACE_SECRET;

        $data = json_encode($data);
        $paramArr = array(
            'app_key' => $app_key,
            'data' => $data,
            'method' => $method,
            'timestamp' => date("Y-m-d H:i:s")
        );
        $sign = Util::createSign($paramArr, $app_secret); //生成签名
        $paramArr['sign'] = $sign;
        tools::datalog('g7sRequest'.var_export($paramArr,true),'g7srequest_');
        $result = $this->init_post($post_url, $paramArr);
        tools::datalog('g7sRequest'.$result,'g7srequest_');
        return json_decode($result, true);
    }

    /**
     * Desc:发送短信
     * @param $content
     * @param $mobiles
     * @Author Lvison
     * @return mixed
     */
    public function sendSms($content, $mobiles)
    {
        tools::datalog('sendSms参数' . var_export(array('content' => $content, 'mobiles' => $mobiles), true), 'sendSms_');
        if (empty($content) || empty($mobiles)) {
            return array('code' => 1, 'message' => 'content和mobiles参数不能为空');
        }
//        return array('code'=>0,'message'=>'');
        $param = array('phone' => $mobiles, 'content' => $content);
        $result = $this->webServiceRequest('sendSMS', $param);
        tools::datalog('sendSms结果' . var_export($result, true), 'sendSms_');
        if ($result['code'] == 0) {
            return array('code' => 0, 'message' => '');
        } else {
            return array('code' => 1, 'message' => $result['message']);
        }
        return $result;
    }

    /**
     * webservice客户端访问
     * Desc:
     * @param $fun
     * @param string $params
     * @param string $id
     * @Author Lvison
     * @return array|mixed
     */
    public function webServiceRequest($fun, $params = '',$id = '')
    {
    	//调用webservice获取结果
    	tools::datalog('webServiceRequest参数' . var_export(array($fun, $params), true), 'webServiceRequest_');
    	
        //参数统一为json，可传入数组自动转换
        if(is_object($params)){
            $params = object2array($params);
        }
        try {
            //实例化soap客户端
//            $client = new SoapClient(WSDL_URL);
            $opts = array(
                'http'=>array(
                    'user_agent' => 'PHPSoapClient'
                )
            );
            $params = json_encode($params,JSON_UNESCAPED_UNICODE);
            //记录发送的请求
            if(!$id){
                require_once '../webservice/service.php';
                $webservice = new webserviceService();
                $id = $webservice->controlWebservice('insert','',array('function'=>$fun,'params'=>$params));
            }
            $context = stream_context_create($opts);
            $client = new SoapClient(WSDL_URL, array('stream_context' => $context, 'cache_wsdl' => WSDL_CACHE_NONE));

            $result = $client->$fun($params);
            tools::datalog('webServiceRequest结果' . var_export($result, true), 'webServiceRequest_');
            $result = json_decode($result, true);
            //更新请求结果
            if(isset($result['code']) && $id){
                require_once '../webservice/service.php';
                $webservice = $webservice ? $webservice : new webserviceService();
                $webservice->controlWebservice('succeed',$id,array('response'=>$result));
            }
            return $result;
        } catch (Exception $e) {
            //请求异常更新请求结果
            if($id){
                require_once '../webservice/service.php';
                $webservice = $webservice ? $webservice : new webserviceService();
                $webservice->controlWebservice('update',$id,array('response'=>array($e)));
            }
            return array('code' => 0, 'messgae' => '接口调用失败');
        }
    }


    /**
     * Desc:注册LBS账号
     * author:sunjie
     * 2016-8-29
     */
    public function lbsSendList($data)
    {
        $post_url = LBS_SENDLIST;
        $params = 'companyid=' . LBS_ID . '&companypwd=' . LBS_PWD . '&mobile=' . $data[mobile] . '&username=' . $data[username] . '&usertype=' . $data[usertype] . '&opertype=' . $data[opertype] . '';
        $result = $this->init_post($post_url, $params);
        return $result;
    }

    /**
     * Desc:验证手机号码是否注册LBS
     * author:sunjie
     * 2016-12-13
     */
    public function checkLbsRegister($moble)
    {
        $post_url = LBS_CHECKREGISTER;
        $params = 'companyid=' . LBS_ID . '&companypwd=' . LBS_PWD . '&mobile=' . $moble . '';
        $result = $this->init_post($post_url, $params);
        $decodeResult = htmlspecialchars_decode($result);
        $xml = simplexml_load_string($decodeResult);
        if($xml){
            foreach($xml->children() as $a){
                foreach($a as $key=>$val){
                    if($val['name'] == 'result'){
                        $result =  (string) $val['value'];
                    }
                }
            }
        }

        return $result;
    }


    /**
     * Desc:GPS获取当前位置
     * author:sunjie
     * 2016-9-14
     */
    public function gpsSendLocation($params)
    {
        /*$app_key ='cdtest';
        $app_secret = '51f9c98dfaf8b3eb9274933b611a4708';
        $carnum= '闽AB7720';*/
        $carnum=$params["carnum"];
        $app_key=$params["key_secret"]->app_key;
        $app_secret=$params["key_secret"]->app_secret;
        $res = $this->g7sRequest('truck.device.getTruckAddress', $carnum, $app_key, $app_secret);
        if ($res['code'] == '0') {
            return array('code' => 0, 'msg' => $res['data']['0']['address']);
        } else {
            return array('code' => 1, 'msg' => '定位失败');
        }

    }


    /**
     * Desc:erp账号绑定
     * @param $param
     * @Author Lvison
     * @return unknown
     */
    public function erpBind($param)
    {
        if (empty($param['username'])) {
            throwException('erp账号用户名为空');
        }
        if (empty($param['password'])) {
            throwException('erp账号密码为空');
        }
        if (empty($param['type'])) {
            throwException('无效的erp账号类型');
        }

        $url = $param['type'] == 'base' ? ERP_API_URL_NC6 : ERP_API_URL_NC5;
        $url .= '?username=' . $param['username'] . '&password=' . $param['password'];
        tools::datalog('erpBind参数：' . var_export($url, true), 'erpBind_');
        $result = $this->init_post($url, array());
        tools::datalog('erpBind结果：' . var_export($result, true), 'erpBind_');
        return $result;
    }

    /** 调用百度api生成短地址
     * Desc:
     * @param $url
     * @Author Lvison
     * @return mixed
     */
    public function createTinyUrl($url){
        $data = array('url'=>$url);
        $tinyUrlCreate = TINY_URL_CREATE ? TINY_URL_CREATE :'http://dwz.cn/create.php';
        $result = $this->init_post($tinyUrlCreate,$data);
        $arrResponse=json_decode($result,true);
        tools::datalog('createTinyUrl'.var_export($arrResponse,true),'createTinyUrl_');
        if($arrResponse['status'] !=0){
            return array('code'=>0,'message'=>$arrResponse['err_msg']);
        }else{
            return array('code'=>1,'tinyUrl'=>$arrResponse['tinyurl'],'message'=>$arrResponse['err_msg']);
        }
    }

    /**
     * Desc:新浪api生成短网址
     * @param $url
     * @Author Lvison
     * @return array
     */
    public function createTinyUrlSina($url){
        $apiUrl = 'http://dwz.wailian.work/api.php?url=%s&site=sina';
        $url = base64_encode($url);
        $apiUrl = sprintf($apiUrl,$url);
        $result = $this->init_get($apiUrl);
        $response = json_decode($result,true);
        tools::datalog('createTinyUrlSina结果'.var_export($response,true),'createTinyUrlSina_');
        if($response['result'] == 'ok'){
            $return = array('code'=>1,'tinyUrl'=>$response['data']['short_url']);
        }else{
            $return = array('code'=>0,'message'=>$response['data']);
        }
        return $return;
    }

    /**
     * Desc:构造webAPI 调用地址
     * @param $data
     * @Author Lvison
     * @return array
     */
    public function getWebApiUrl($data){
        $webApi_url = G7S_WEBAPI_URL;

        if(!empty($data['app_key'])){
            $app_key = $data['app_key'];
            unset($data['app_key']);
        }else{
            return array('code'=>1,'message'=>'无法获取app_key');
        }

        if(!empty($data['app_secret'])){
            $app_secret = $data['app_secret'];
            unset($data['app_secret']);
        }else{
            return array('code'=>1,'message'=>'无法获取app_secret');
        }

        if(!empty($data['method'])){
            $method = $data['method'];
            unset($data['method']);
        }else{
            return array('code'=>1,'message'=>'无法获取method');
        }

        $data = json_encode($data);
        $paramArr = array(
            'app_key' => $app_key,
            'data' => $data,
            'method' => $method,
            'timestamp' => date("Y-m-d H:i:s")
        );
        $sign = Util::createSign($paramArr, $app_secret); //生成签名
        $paramArr['sign'] = $sign;
        $webApi_url = $webApi_url.'?data='.$data.'&app_key='.$app_key.'&sign='.$sign.'&timestamp='.$paramArr['timestamp'].'&method='.$method;
        return array('code'=>0,'url'=>$webApi_url);
    }

    //天眼轨迹点
    public function playBackByOrder($shipment_code){
        return $this->g7sRequest('order.order.playBackByOrder',['orderno'=>$shipment_code]);
    }

    //天眼解绑/修改
    public function updateOrders($shipment_code){
        $data=[];
        $data['unification'] = 0;
        $data['orgcode'] = '20015Q';
        $orders = [];
        $orders['orderno'] = $shipment_code;
        $orders['isunbind'] = 'true';
        $data['orders']['0'] = $orders;
        return $this->g7sRequest('order.order.updateOrders',$data);
    }

    //smart轨迹点
    public function getTruckTrajectory($args){
        $args['starttime'] = date('2017-10-31 00:00:00');
        $args['endtime'] = date('2017-11-04 00:00:00');
        return $this->g7sRequest('truck.truck.getTruckTrajectory',['carnum'=>$args['carnum'],'starttime'=>$args['starttime'],'endtime'=>$args['endtime']]);
    }

}


?>