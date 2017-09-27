<?php
/** 
 * 货源操作类
 * Author Ivan
 * 2016-08-23
 */
class source_distribution extends control{
	/**
	 * 获取关系基地货源信息
	 * Author Ivan
	 * 2016-8-24
	 */
	public function search(){
		$params = fixer::input('request')->getArray();
		$orgcode=$this->app->user->organ->orgcode;
		$params['orgcode']=$orgcode;
		if($params['province']==''){
			$provinces=$this->source_distributionService->getProvince(array('orgcode'=>$orgcode));
			$params['province']=$provinces[0]->from_province;
		}
		$pager = $this->source_distributionService->search($params);
		$this->view->pager = $pager;
        $this->display();
		
	}
	/**
	 * 获取承运商关系基地省份
	 * Author Ivan
	 * 2016-8-24
	 */
	public function getProvince(){
		$params = fixer::input('request')->getArray();
		$orgcode=$this->app->user->organ->orgcode;
		$data=$this->source_distributionService->getProvince(array('orgcode'=>$orgcode));
		$this->view->result = $data;
        $this->display();
	}
	
}