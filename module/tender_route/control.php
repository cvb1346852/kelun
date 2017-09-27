<?php
/** 
 * 货源操作类
 * Author Ivan
 * 2016-09-22
 */
class tender_route extends control{
	/**
	 * 获取评标线路列表
	 * Author Ivan
	 * 2016-9-22
	 */
	public function search(){
        $params = fixer::input('request')->get();
        $pager = $this->tender_routeService->search($params);
        $this->view->pager = $pager;
        $this->display();
		
	}
	/**
	 * 获取导入模板
	 * Author Ivan
	 * 2016-9-22
	 */
	public function gettemp(){
		$params = fixer::input('request')->getArray();
		$data=$this->loadService('tender_route')->gettemp($params);
		$this->view->result = $data;
        $this->display();
	}
	/**
	 * 设置超额标准
	 * Author Ivan
	 * 2016-9-22
	 */
	public function setRate(){
		$params = fixer::input('request')->getArray();
		$data=$this->loadService('tender_route')->setRate($params);
		$this->view->result = $data;
        $this->display();
	}
	/**
	 * 删除线路
	 * Author Ivan
	 * 2016-9-22
	 */
	public function del(){
		$params = fixer::input('request')->getArray();
		$data=$this->loadService('tender_route')->del($params);
		$this->view->result = $data;
        $this->display();
	}

}