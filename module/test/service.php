<?php

class testService extends service{

    public function test(){
        $this->dao->delete('shipment.deleteShipment',array('code'=>'123456'));
    }
}