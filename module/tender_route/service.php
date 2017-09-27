<?php
/**
 * @author Ivan
 * The service file of tender_route module.
 */
 class tender_routeService extends service
 {
 	/**
	 * 获取评标线路列表
	 * Author Ivan
	 * 2016-9-22
	 */
 	public  function search($fixer){
 		$params = fixer::input($fixer)->get();
        $result=$this->dao->selectPage('tender_route.selectPage',$params);
        return $result;
 	}
 	/**
	 * 
	 * Author Ivan
	 * 2016-9-22
	 */
 	public function gettemp($fixer){
 		$params = fixer::input($fixer)->getArray();
        $params['pageNo']=1;
        $params['pageSize']=1;
 		$result=$this->dao->selectPage('tender_route.gettemp',$params);
 		return $result;
 	}

 	 /**
     * 2016-9-22
     * Ivan
     * 处理导入车辆数据
     */
    public function create($args) {
        $params = fixer::input($args)->getArray();
        $table_title = $params[1];
        $repeat = $params['repeat'];
        unset($params['repeat']);
        $title = array();
        include_once 'validater.php';
        //处理表头
        foreach ($table_title as $key => $value) {
            switch ($value) {
                case '起始站点':
                    $title[$key] = 'from_location';
                    break;
                case '到达站点':
                    $title[$key] = 'to_location';
                    break;
                case '最高限额(元/吨)':
                    $title[$key] = 'price';
                    break;
                case '超额标准(%)-请填整数':
                    $title[$key] = 'over_rate';
                    break;
                case '月份-请填数字':
                    $title[$key] = 'months';
                    break;
                case '运输方式':
                    $title[$key] = 'ship_method';
                    break;
                case '箱型':
                    $title[$key] = 'carriage_type';
                    break;
                case '重泡货':
                    $title[$key] = 'density';
                    break;
            }
        }
        $titleArr = [
            'from_location'=>'起始站点',
            'to_location'=>'到达站点',
            'price'=>'最高限额(元/吨)',
            'over_rate'=>'超额标准(%)-请填整数',
            'months'=>'月份-请填数字',
            'ship_method'=>'运输方式',
            'carriage_type'=>'箱型',
            'density'=>'重泡货'
        ];
        $months  = [1,2,3,4,5,6,7,8,9,10,11,12];
        // 验证并插入数据
        foreach ($params as $key => $content) {
            $error = array();
            //验证数据
            if ($key > 1  && !empty($content['0'])) {
                $row = array();
                foreach ($content as $no => $value) {
                    $row[$title[$no]] = $value;
                }
                $fixer = fixer::input($row);
                //验证常规参数
                if(!in_array($content['4'],$months)){
                    throw new RuntimeException('月份输入格式不合法,请输入1~12的数字');
                }
                //验证参数
                $fixer->check($tenderRouteValidater, 'from_location,to_location,price,over_rate,months,ship_method,carriage_type,density');
                if (fixer::isError()) {
                    foreach (fixer::getError() as $key => $value) {
                        array_push($error, $titleArr[$key].': '.$value);
                    }
                    $error = implode(', ', $error);
                    throw new RuntimeException($error, 555);
                } else {
                    //处理厢型数据
                    $row['repeat'] = $repeat;
                    $this->save($row);
                }
            }
        }
        return true;
    }

    /**
     * The save page of truck_source module.  
     *
     */
    public function save ($fixer)
    {
        $fixer = fixer::input($fixer)->getArray();
        //检测参数 
        /*if($fixer["searchParams"][1]["name"] != "wechat"){
          $base = ['from_province','from_city','to_province','to_city','price','over_rate']; 
          foreach($base as $v){
            if(!isset($fixer[$v]) || !$fixer[$v])
                throw new RuntimeException('红色部分为必填', 2);
         }
        }*/
        //$fixer['last_update'] = $this->app->user->id; 
        if(!isset($fixer['id']) || !$fixer['id']){
            //系统中若存在该车辆且为自有车无法继续添加
            $id = '';
            //是否重复标识
            $exist = false;
            $repeat = isset($fixer['repeat']) ? $fixer['repeat'] : 'cover';
            if ($rt = $this->dao->selectOne('tender_route.routeCheck',$fixer)) {
                $id = $rt->id;
                $exist = true;
            } else {
                $id = guid();
            }
            $fixer['id'] = $id;
            $fixer['create_time']=date('Y-m-d H:i:s',time());
            //检查系统中是否存在该车辆
            if ($exist) {
                //判断重复时的操作
                if ($repeat == 'cover') {
                    return $this->dao->update('tender_route.update',$fixer);
                } else {
                    return true;
                }
            } else {

                $data =  $this->dao->insert('tender_route.insert',$fixer); 
                return  $data;
            }
        }
    } 


    /**
     * 
     * Author Ivan
     * 2016-9-23
     */
    public function setRate($fixer){
        $params = fixer::input($fixer)->getArray();
        $ids = explode(',',$params['id']);
        foreach($ids as $v){
            $params['id'] = $v;
            $result=$this->dao->update('tender_route.setRate',$params);
        }
        return $result;
    }
     /**
     * 
     * Author Ivan
     * 2016-9-23
     */
    public function del($fixer){
        $params = fixer::input($fixer)->getArray();
        $ids = explode(',',$params['id']);
        foreach($ids as $v){
            $params['id'] = $v;
            $result=$this->dao->delete('tender_route.del',$params);
        }
        return $result;
    }
 }