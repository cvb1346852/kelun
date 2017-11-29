<?php
require_once dirname(dirname(dirname( __FILE__ ))).'/config/client.config.php';
require_once 'lib/Util.php';

class Client {

    protected $resultData;
    public  $pack_class=false;
    const SERVICE_TYPE_ALI='ali';//服务类型，默认阿里云
    const SERVICE_TYPE_TX='tx';//服务类型，腾讯云
    private $serviceType=null;

    /**
     * API参数数组
     *
     * @var array
     */
    private $paramArr = array(
            'app_key' => APP_KEY,
            'format' => 'json',
    );

    /**
     * 设置参数
     *
     * @param string $name：参数名
     * @param string $value：参数值
     */
    public function setParameter($name, $value) {
        $this->paramArr[$name] = $value;
    }

    /**
     * 调用相应的api，返回结果
     *
     * @param string $name：方法名
     * @param array $args
     * @return result
     */
    public function __call($name, $args) {

		$this->updateParam($name, $args);
		// if (API_MEMCACHE_USED === true && class_exists('Memcache')) {
		// 	$key = Util::getParams($this->paramArr);
		// 	// 因为php中memcache的key限制250byte
		// 	if (strlen($key) < 200) {
		// 		$memcache = new Memcache;
		// 		$memcache->pconnect(API_MEMCACHE_IP1, 8188) or $memcache->pconnect (API_MEMCACHE_IP2, 8188);
  //       		$this->resultData = $memcache->get($key);
  //       		$memcache->close();
		// 		return $this->resultData;
		// 	}
		// }
		//exit(json_encode($this->paramArr));
        $this->resultData = Util::postResult($this->paramArr);
        return $this->resultData;
    }

    /**
     * Desc:返回GET方式的完整URL
     * User: liuguanghui
     * @param $name
     * @param $args
     * @param bool $apiurl
     * @return string
     */
	public function getUri($name, $args, $apiurl=false) {
		$this->updateParam($name, array($args));
		return Util::getUri($this->paramArr, $apiurl);
	}

    /**
     * Desc: 获取参数
     * User: liuguanghui
     * @param $name
     * @param $args
     * @return string
     */
	public function getParams($name, $args) {
		$this->updateParam($name, array($args));
		return Util::getParams($this->paramArr);
	}

    /**
     * Desc: 初始化参数
     * User: liuguanghui
     * @param $name
     * @param $args
     */
	private function updateParam($name, $args) {
		//多次调用，初始化参数，	
		$this->paramArr = array(
            'app_key' => APP_KEY,
            'format' => 'json',
   	 	);
		//将方法名转为api接口名,例如将helloSay转化为huoyunren.hello.say
        $method= 'huoyunren.';
        $length = strlen($name);
        for($i=0; $i<$length; $i++) {
            $char = substr($name, $i, 1);
            if (64 < Ord($char) && 91 > Ord($char)) {
                $method .= '.'.strtolower($char);
            } else {
                $method .= $char;
            }
        }

        foreach ($args as $arg) {
            foreach ($arg as $k => $v) {
                $this->paramArr[$k] = $v;
            }
        }
        $this->paramArr['method'] = $method;
        $this->paramArr['timestamp'] = date('Y-m-d H:i:s');
	}

    public function setPackClass($class){
        if($class){
            $o= new self();
            $o->pack_class=$class;
            return $o;
        }
        return $this;
    }

    public function setService($stype=self::SERVICE_TYPE_ALI){
        $this->serviceType=$stype;
        return $this;
    }
}
?>