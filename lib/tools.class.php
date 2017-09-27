<?php
/**
 * 工具类
 * User liuguanghui
 * @2015-11-04
 */
class tools {
	
	public function __construct(){
		
	}
	
	/**
	 * 去除系统ID获得原始数据ID
	 * @param string $id
	 * @return boolean|string
	 */
	static public function cutsysid($id=null)
	{
		if(!$id){
			return false;
		}
		global $app;
		$sysid = $app->config->sysid;
		return substr($id,strlen($sysid));
	}

    /**
     * Desc:获取当前时间的微妙数值
     * User: liuguanghui
     * @return float
     */
	static public function microtime()
	{
		list($usec, $sec) = explode(" ",microtime());
    	return ((float)$usec + (float)$sec)*1000;
	}

    /**
     * Desc:记录日志
     * User: liuguanghui
     * @param $content
     * @param string $type
     * @param string $format
     * @param bool $params
     */
	static public function datalog($content,$type='log_',$format = 'N',$params = false)
	{
		global $app,$timeStart;
		$logstr = '';
		//文件名称 1--7
		$basePath = $app->getTmpRoot().'log'.DIRECTORY_SEPARATOR.date('Y-m-d').DIRECTORY_SEPARATOR;
		if(!is_dir($basePath))
		{
			@mkdir($basePath,0777,true);
     		@chmod($basePath,0777);
		}

		$logfile  = $basePath.$type.date($format,time()).'.php';
		if(is_file($logfile))
		{
			if(@filesize($logfile) >= 2048000) {
				//2M 分文件
				$logfilebak = $logfile.'_'.date('His').'_bak.php';
				@rename($logfile, $logfilebak);
			}
		}
		$logstr.=' IP:'.self::getIP();
		$logstr.= ' '.$content;
		$mtime = explode(' ', microtime());
		$totaltime = @number_format(($mtime[1] + $mtime[0] - $timeStart), 4);
		$url = '';
		if ($params)
			$url= '浏览器:'.$_SERVER["HTTP_USER_AGENT"].',参数:'.var_export(self::filterParams(),true);
		$url.=' '.$_SERVER['SCRIPT_NAME'].'?'.$_SERVER['QUERY_STRING'];
	    $newlog = date('Y-m-d H:i:s',time()).' '.$totaltime.' '.$logstr.' '.$url;

		if($fp = @fopen($logfile, 'a')) {
			@flock($fp, 2);
			fwrite($fp, "<?PHP exit;?>\t".str_replace(array('<?', '?>', "\r", "\n",), '', $newlog)."\t\n");
			fclose($fp);
		}
		unset($content,$logstr,$newlog);
	}

    /**
     * Desc:获取IP
     * User: liuguanghui
     * @return string
     */
	static public function getIP()
	{
		if (getenv("HTTP_CLIENT_IP"))
			$ip = getenv("HTTP_CLIENT_IP");
		else if(getenv("HTTP_X_FORWARDED_FOR"))
			$ip = getenv("HTTP_X_FORWARDED_FOR");
		else if(getenv("REMOTE_ADDR"))
			$ip = getenv("REMOTE_ADDR");
		else
			$ip = "UNKNOWN";
		return $ip;
	}

    /**
     * Desc:过滤参数(需要更好的方式)
     * User: liuguanghui
     * @param null $p, $p=*, 表示过滤所有为空的$pararms
     * @return array
     */
    static public function filterParams( $p=null ) {
        //$pararms = $_REQUEST;
        $pararms = array_merge($_POST, $_GET);
        unset($pararms['m']);
        unset($pararms['f']);
        unset($pararms['t']);
        unset($pararms['page_no']);;
        unset($pararms['page_size']);
        unset($pararms['sortname']);
        unset($pararms['sortorder']);
        unset($pararms['query']);
        unset($pararms['qtype']);
        unset($pararms['qop']);
        unset($pararms['XDEBUG_SESSION_START']);
        unset($pararms['KEY']);
        foreach ($pararms as $key=>&$value){
            // 过滤html/script/css
            // $value = preg_replace('/<([^>]*)>/i', '&lt;${1}&gt;', $value);
            // // 防sql注入
            // $value = preg_replace("/([';]+|(--)+)/i", '', $value);

            //部标测试去sql关键词    liyonghua 2013-05-24
            $value = str_replace(array('select','SELECT','delete','DELETE','INSERT','insert','UPDATE','FROM','from','iframe','replace','REPLACE',
            'group','GROUP','http://','HTTP://','https://','HTTPS://','<script>','<>','VBScript','src','href','SRC','HREF','drop','DROP',''), array(), $value);
            if($p){
                if(!is_array($value)) $value = trim($value);
        		if($value===null||$value===""||$value=="undefined"){
        			unset($pararms[$key]);
        		}
        		elseif(strpos($key,"confilter_")>-1){
        			$array_key =  explode("_",$key) ;
        			$newkey = $array_key[1].' '.$array_key[2].' '.$array_key[3] ;
        			$pararms[$newkey] = $value;
        			unset($pararms[$key]);
        		}
        	}
        }

        return $pararms;
    }

    /**
     * Desc: 格式化时间戳
     * User: liuguanghui
     * @param $time
     * @param string $type
     * @return string
     */
    static public function timeFormate($time,$type=''){
    	$time = intval($time);
    	$formate = '';
    	if($time){
    		//秒数
    		$second = $time%60;
    		$time = intval($time/60);
    		//分钟
    		$minute = $time%60;
    		//小时
    		$hour = intval($time/60);

    		if($type == 'time'){
    			$minute = sprintf('%02d',$minute);
    			$second = sprintf('%02d',$second);
    			$formate = $hour.':'.$minute.':'.$second;
    		}else{
    			$formate = $time.'分钟'.$second.'秒';
    		}
    	}

    	return $formate;
    }

    /**
     * 系统ID + 原始数据ID
     * @param string $id
     * @return boolean|string
     */
    static public function addsysid($id=null)
    {
        if(!$id){
            return false;
        }
        global $app;
        $sysid = $app->config->sysid;
        return (string)$sysid.$id;
    }

    /**
     * Desc:解析参数
     * User: liuguanghui
     * @param $params
     * @return array|void
     */
    public static function parseParameter($params)
    {
        if(is_object($params))
        {
            $params = object2array($params);
        }
//		$params = XssFilter::getInstance()->execute($params);
        return $params;
    }

    public static function notifyOrderFail($params)
    {
        $client = new RestClient();
        $client->setMethod('GET')->setUrl('http://gw.ali-vpc01.chinawayltd.com/sms_alert/sms.php');
        $client->addParam('cell_num', $params['cellnum']);
        $client->addParam('content', $params['content']);
        $res = $client->execute();
    }

    /**
     * Desc:判断是否是时间/日期
     * User: liuguanghui
     * @param $time
     * @param string $type
     * @return bool
     */
    static function isTime($time,$type='time'){
        if($type == 'time'){
            if(preg_match("/^\d{4}[\-](0?[1-9]|1[012])[\-](0?[1-9]|[12][0-9]|3[01])(\s+(0?[0-9]|1[0-9]|2[0-3])\:(0?[0-9]|[1-5][0-9])\:(0?[0-9]|[1-5][0-9]))?$/",$time)){
                return true;
            }else{
                return false;
            }
        }elseif($type == 'date'){
            $k = explode('-',$time);
            if( checkdate($k[1],$k[2],$k[0])){
                return true;
            }
            else{
                return false;
            }
        }
    }

}
