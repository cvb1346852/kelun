<?php

/**接口服务类
 * Class apiService
 */

class apiService extends service{

	/**
	 * Desc:根据经纬度获取详细地址
	 * @param $res
	 * @Author Lvison
	 * @return array
	 */
	public function getAddressByLngLat($res){
		//参数验证
		if(empty($res['lng'])){
			throwException('经度为空');
		}
		if(empty($res['lat'])){
			throwException('纬度为空');
		}
		$param = array('lat'=>$res['lat'],
			'lng'=>$res['lng'],
			'code'=>0
		);
		$result = $this->loadService('client')->g7sRequest('map.api.geoCode',$param);
		tools::datalog('getAddressByLngLat-result'.var_export($result,true),'getAddressByLngLat_');
		if($result['code'] == 0)
			return array('address'=>$result['data']['result']['fullAddress'],'time'=>date('Y-m-d H:i:s'));
		else
			return array('address'=>'未知地址','time'=>date('Y-m-d H:i:s'));
	}

	/**
	 * @param string $json
	 */
	public function getDistance($params) {
		if (empty($params)) {
			throwException('参数无法解析');
		}
		//若为数组统一转换为对象
		if (is_array($params)) {
			$params = array2object($params);
		}
		//判断参数v
		if (!property_exists($params, 'lng1') || $params->lng1 == '') {
			throwException('缺少经度1');
		}
		if (!property_exists($params, 'lat1') || $params->lat1 == '') {
			throwException('缺少纬度1');
		}
		if (!property_exists($params, 'lng2') || $params->lng2 == '') {
			throwException('缺少经度2');
		}
		if (!property_exists($params, 'lat2') || $params->lat2 == '') {
			throwException('缺少纬度2');
		}
		try {
			//调用接口
			$rt = $this->loadService('Client')->g7sRequest("map.api.distanceMeasure", array('longitude_A' => $params->lng1, 'latitude_A' => $params->lat1, 'longitude_B' => $params->lng2, 'latitude_B' => $params->lat2));
			if ($rt['code'] == 0) {
				//返回数据
				return array( 'distance' => $rt['data']['distance'], 'fromId' => $params->fromId, 'toId' => $params->toId,);
			} else {
				throwException($rt['message']);
			}
		} catch (Exception $e) {
			throwException('接口调用失败');
		}
	}

	/**
     * 2016-8-1
     * Author ZHM
     * 根据经纬度获取里程
     */
    public function getDistanceByLngLat($json = '') {
        tools::datalog('根据经纬度获取里程参数'.var_export($json,true),'api_getDistanceByLngLat_');
        if ($json == '') {
            throwException('获取json数据失败');
        }
        $params = json_decode($json);
        if (empty($params)) {
            throwException('json数据无法解析');
        }
		//若为数组统一转换为对象
		if (is_array($params)) {
			$params = array2object($params);
		}
    	//判断参数
    	if (!property_exists($params, 'lng1') || $params->lng1 == '') {
    		throwException('缺少经度1');
    	}
    	if (!property_exists($params, 'lat1') || $params->lat1 == '') {
    		throwException('缺少纬度1');
    	}
    	if (!property_exists($params, 'lng2') || $params->lng2 == '') {
    		throwException('缺少经度2');
    	}
    	if (!property_exists($params, 'lat2') || $params->lat2 == '') {
    		throwException('缺少纬度2');
    	}
    	try {
    		//调用接口
    		$rt = $this->loadService('Client')->g7sRequest("map.api.distanceMeasure", array('longitude_A' => $params->lng1, 'latitude_A' => $params->lat1, 'longitude_B' => $params->lng2, 'latitude_B' => $params->lat2));
			if ($rt['code'] == 0) {
				//返回数据
    			echo json_encode(array('code' => 0, 'distance' => $rt['data']['distance'], 'fromId' => $params->fromId, 'toId' => $params->toId, 'message' => ''));
                exit();
			} else {
				throwException($rt['message']);
			}
    	} catch (Exception $e) {
    		throwException('接口调用失败');
    	}
    }
	/**
	 * 2016-10-20
	 * Author fly
	 * 根据经纬度获取里程
	 */
	public function getDistanceByLngLatResult($json = '') {
		tools::datalog('根据经纬度获取里程参数'.var_export($json,true),'api_getDistanceByLngLat_');
		if ($json == '') {
			return array('code'=>2,'message'=>'获取json数据失败');
		}
		$params = json_decode($json);
		if (empty($params)) {
			return array('code'=>2,'message'=>'json数据无法解析');
		}
		//若为数组统一转换为对象
		if (is_array($params)) {
			$params = array2object($params);
		}
		//判断参数
		if (!property_exists($params, 'lng1') || $params->lng1 == '') {
			return array('code'=>2,'message'=>'缺少经度');
		}
		if (!property_exists($params, 'lat1') || $params->lat1 == '') {
			return array('code'=>2,'message'=>'缺少纬度');
		}
		if (!property_exists($params, 'lng2') || $params->lng2 == '') {
			return array('code'=>2,'message'=>'缺少经度');
		}
		if (!property_exists($params, 'lat2') || $params->lat2 == '') {
			return array('code'=>2,'message'=>'缺少纬度');
		}
		try {
			//调用接口
			$rt = $this->loadService('Client')->g7sRequest("map.api.distanceMeasure", array('longitude_A' => $params->lng1, 'latitude_A' => $params->lat1, 'longitude_B' => $params->lng2, 'latitude_B' => $params->lat2));
			if ($rt['code'] == 0) {
				//返回数据
				return array('code' => 0, 'distance' => $rt['data']['distance'], 'fromId' => $params->fromId, 'toId' => $params->toId, 'message' => '');
			} else {
				return array('code'=>2,'message'=>$rt['message']);
			}
		} catch (Exception $e) {
			return array('code'=>2,'message'=>'接口调用失败');
		}
	}
	/**
	 * 2016-8-1
	 * Author
	 * 根据地址获取经纬度
	 */
	public function getLngLat_Address($json = ''){
		tools::datalog('根据地址获取经纬度参数'.var_export($json,true),'api_etLngLatByAddress_');
		if ($json == '') {
			throwException('获取json数据失败');
		}
		$params = json_decode($json,true);
		if (empty($params)) {
			throwException('json数据无法解析');
		}
		//判断参数
		if (empty($params['address'])) {
			throwException('缺少地址');
		}
		if(empty($params['id'])) {
			throwException('缺少id');
		}
		//调用接口
		$rt = $this->loadService('Client')->g7sRequest("map.api.geoSearch", array('address' => $params['address']));
		if ($rt['code'] == 0) {
			//判断地址详细程度至少为市级
			if ($rt['data']['result']['ilevel'] >= 3) {
				//获取经纬度
				$lat = $rt['data']['result']['lat'];
				$lng = $rt['data']['result']['lng'];
				return json_encode(array('code' => 0, 'id' => $params['id'], 'lng' => $lng, 'lat' => $lat, 'message' => ''));
			} else {
				$lat = '';
				$lng = '';
				return json_encode(array('code' => 1, 'id' => $params['id'], 'lng' => $lng, 'lat' => $lat, 'message' => '无法解析该地址'));
			}
		} else {
			return json_encode(array('code' => 1, 'id' => $params['id'], 'lng' => '', 'lat' => '', 'message' => '无法解析该地址'));
		}
	}
    /**
     * 2016-8-1
     * Author ZHM
     * 根据地址获取经纬度
     */
    public function getLngLatByAddress($json = ''){
        tools::datalog('根据地址获取经纬度参数'.var_export($json,true),'api_etLngLatByAddress_');
        if ($json == '') {
            throwException('获取json数据失败');
        }
        $params = json_decode($json,true);
        if (empty($params)) {
            throwException('json数据无法解析');
        }
    	//判断参数
    	if (empty($params['address'])) {
    		throwException('缺少地址');
    	}
    	if(empty($params['id'])) {
    		throwException('缺少id');
    	}
    	//调用接口
    	$rt = $this->loadService('Client')->g7sRequest("map.api.geoSearch", array('address' => $params['address']));
		if ($rt['code'] == 0) {
			//判断地址详细程度至少为市级
			if ($rt['data']['result']['ilevel'] >= 3) {
				//获取经纬度
				$lat = $rt['data']['result']['lat'];
				$lng = $rt['data']['result']['lng'];
				echo json_encode(array('code' => 0, 'id' => $params['id'], 'lng' => $lng, 'lat' => $lat, 'message' => ''));
                exit();
			} else {
				throwException('请正确填写详细地址');
			}
		} else {
			throwException($rt['message']);
		}
    }
	/**
	 * 2016-10-20
	 * Author fly
	 * 根据地址获取经纬度
	 */
	public function getLngLatByAddressResult($json = ''){
		tools::datalog('根据地址获取经纬度参数'.var_export($json,true),'api_etLngLatByAddress_');
		if ($json == '') {
			return array('code'=>2,'message'=>'获取json数据失败');
		}
		$params = json_decode($json,true);
		if (empty($params)) {
			return array('code'=>2,'message'=>'json数据无法解析');
		}
		//判断参数
		if (empty($params['address'])) {
			return array('code'=>2,'message'=>'缺少地址');
		}
		if(empty($params['id'])) {
			return array('code'=>2,'message'=>'缺少id');
		}
		//调用接口
		$rt = $this->loadService('Client')->g7sRequest("map.api.geoSearch", array('address' => $params['address']));
		if ($rt['code'] == 0) {
			//判断地址详细程度至少为市级
			if ($rt['data']['result']['ilevel'] >= 3) {
				//获取经纬度
				$lat = $rt['data']['result']['lat'];
				$lng = $rt['data']['result']['lng'];
				return array('code' => 0, 'id' => $params['id'], 'lng' => $lng, 'lat' => $lat, 'message' => '');
			} else {
				return array('code'=>2,'message'=>'请正确填写详细地址');
			}
		} else {
			return array('code'=>2,'message'=>$rt['message']);
		}
	}
    /**
     * 2016-8-3
     * ZHM
     * 测试方法1
     */
    public function testWebservice ($args) {
        $params = fixer::input($args)->get();
        $result = $this->loadService('client')->webServiceRequest($params->fun, '{"key": "value"}');
        return $result;
    }
}