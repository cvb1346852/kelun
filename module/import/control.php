<?php

/**
 * The control file of blog module.
 */
class import extends control
{
    private $savePath;
    private $rootPath;
    
    public function __construct() 
    {
        parent::__construct();
        $this->rootPath = $this->app->getAppRoot() . 'www/attachments';
        $this->savePath = '/uploads/import/';
    }
    /**
     * 上传文件
     */
    public function upload ()
    {
        $config = array(
                //'maxSize' => 3145728,   // 设置附件上传大小
                'maxSize' => 5120000,   // 设置附件上传大小 限制最大为5M  5*1000*1024
                'exts' => array(
                        'xls',
                        'xlsx',
                        'doc',
                        'docx',
                        'pdf'
                ),                      // 设置附件上传类型
                'rootPath' => $this->rootPath, // 设置附件上传目录
                'savePath' => $this->savePath
                );
        $upload = new Upload($config); // 实例化上传类
                                       
        // 上传单个文件
        $info = $upload->uploadOne($_FILES['file']);
        if (! $info) {
            // 上传错误提示错误信息
            $error = $upload->getError();
            $this->view->result = $error;
            $this->display();
           // $this->render($upload->getError());
        } else {
            // 上传成功
            $this->render($info);
        }
    }
    /**
     * 上传文件
     */
    public function uploadImage() {
        $config = array(
            'exts' => array(
                'jpg',
                'png',
                'gif',
                'bmp',
                'jpeg'
            ),
            'rootPath' => $this->app->getAppRoot() . 'www',
            'savePath' => '/attachment/'
        );
        $upload = new Upload($config, '');
        $info = $upload->uploadOne($_FILES['file']);
        if (!$info) {
            throw new RuntimeException($upload->getError(), 2);
        } else {
//            $uploadConfig = C('upload.typeConfig');
            $savepath = $info['savepath'];
            $savename = $info['savename'];
//            $ossbucket = $uploadConfig->bucket;
//            $osslocation = $uploadConfig->location;
//
//            $fullpath = 'http://'.$ossbucket.'.'.$osslocation.'.aliyuncs.com'.$savepath.$savename;
            $fullpath = $savepath.$savename;//本地 控件不允许加载物理地址
            $this->view->result = $fullpath;
            $this->display();
        }
    }

    public function getTitle ()
    {
        $filepath = fixer::input('request')->get('filepath');
        $filepath = $this->rootPath . $filepath;
        
        $excel = new Excel();
        $data = $excel->xls2array($filepath, 1, 1);
        $this->view->data = $data;
        $this->display();
    }

    public function save ()
    {
        $fixer = fixer::input('request');
        $filepath = $fixer->get('filepath');
        $filepath = $this->rootPath . $filepath;
        //导入挂靠车标识
        $affiliated = 0;
        if ($fixer->get('affiliated')) { 
            $affiliated = $fixer->get('affiliated');
        }
        //是否跳过重复数据标识
        $repeat = 'jump';
        if ($fixer->get('repeat')) { 
            $repeat = $fixer->get('repeat');
        }
        
        $excel = new Excel();
        
        // 导入数据
        $data = $excel->xls2array($filepath, 1);
        $data['affiliated'] = $affiliated;
        $data['repeat'] = $repeat;
        try {
            $this->loadService('truck_source')->create($data);
        } catch (Exception $e) {
            throw new RuntimeException($e->getMessage(), 2);
        }
        // $data = $excel->xls2array($filepath, 1, 1);
        // $total = $data[0];
        // $fields = $data[1];

        // // 开始导入，如果数据太大，建议用分页
        // $data = $excel->xls2array($filepath, 2);
        // $blogService = $this->loadService('blog');
        // foreach ( $data as $idx => $item ) {
        //     if ($idx > 0)
        //         $blogService->create($item);          
        // }
        $this->view->data = 1;
        $this->display();
    }


public function saveTenderRoute ()
    {
        $fixer = fixer::input('request');
        $filepath = $fixer->get('filepath');
        $filepath = $this->rootPath . $filepath;
        //是否跳过重复数据标识
        $repeat = 'jump';
        if ($fixer->get('repeat')) { 
            $repeat = $fixer->get('repeat');
        }
        $excel = new Excel();
        
        // 导入数据
        $data = $excel->xls2array($filepath, 1);
        $data['repeat'] = $repeat;
        try {
            $this->loadService('tender_route')->create($data);
        } catch (Exception $e) {
            throw new RuntimeException($e->getMessage(), 2);
        }
        $this->view->data = 1;
        $this->display();
    }
}