<?php
/** sunjie
 * The service file of carrier module.
 */
class driver_mapService extends service
{

    public function search ($fixer)
    {
        $params = fixer::input($fixer)->get();

        //处理时间参数
        $params->statistic_date =  ($params->statistic_date == '0') ? '' : $params->statistic_date;
        $date = explode(' - ', $params->statistic_date);
        $params->start = $date[0];
        $params->end = $date[1];

        //经纬度
        if($params->path || $params->lat1){

            $path0 = $this->bdTOgcj($params->path['0']['lng'],$params->path['0']['lat']);
            $path2 = $this->bdTOgcj($params->path['2']['lng'],$params->path['2']['lat']);

            $params->lat1 = $params->lat1 == '' ? $path2['bd_lat'] :  $params->lat1;
            $params->lat2 = $params->lat2 == '' ? $path0['bd_lat'] :  $params->lat2;
            $params->lng1 = $params->lng1 == '' ? $path0['bd_lng'] :  $params->lng1;
            $params->lng2 = $params->lng2 == '' ? $path2['bd_lng'] :  $params->lng2;

        }

        $trucksInfo = $this->dao->selectPage('driver_map.driver_selectPage', $params);
        foreach($trucksInfo->result AS $key=>$val){
            $val->gps =  $this->bd_encrypt($val->lng,$val->lat);
        }
        $trucksInfo->lat1 = $params->lat1;
        $trucksInfo->lat2 = $params->lat2;
        $trucksInfo->lng1 = $params->lng1;
        $trucksInfo->lng2 = $params->lng2;
        return $trucksInfo;
    }

    //火星坐标转化为百度坐标
    public function bd_encrypt($gg_lon,$gg_lat)
    {
        $x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        $x = $gg_lon;
        $y = $gg_lat;
        $z = sqrt($x * $x + $y * $y) - 0.00002 * sin($y * $x_pi);
        $theta = atan2($y, $x) - 0.000003 * cos($x * $x_pi);
        $data['bd_lng'] = $z * cos($theta) + 0.0065;
        $data['bd_lat'] = $z * sin($theta) + 0.006;
        return $data;
    }

    //百度坐标BD-09到火星坐标
    public  function bdTOgcj($gg_lon,$gg_lat){
        $x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        $x = $gg_lon;
        $y = $gg_lat;
        $z = sqrt($x * $x + $y * $y) - 0.00002 * sin($y * $x_pi);
        $theta = atan2($y, $x) - 0.000003 * cos($x * $x_pi);
        $data['bd_lng'] = $z * cos($theta) - 0.0065;
        $data['bd_lat'] = $z * sin($theta) - 0.006;
        return $data;
    }
}