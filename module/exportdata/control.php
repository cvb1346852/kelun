<?php
/**
 * 到处数据
 *
 * @author Farmer.Li <me@farmerli.com>
 */
class exportdata extends control
{
    private $_secretKey = 'EXPORT-FILE-CACHE-KEY';
    /**
     * 获取总数
     * 
     * @return void
     */
    public function getTotal()
    {
        $params = fixer::input('request')->get();
        if (
            !isset($params->dataModule) || $params->dataModule == '' ||
            !isset($params->dataMethod) || $params->dataMethod == ''
        ) {
            throw new Exception('未指定数据模块或方法', 2);
        }
        $dataService = $this->loadService($params->dataModule);
        $method = $params->dataMethod;
        $pager = $dataService->$method($params);
        $this->view->total = $pager->totalCount;
        $this->display();
    }

    /**
     * 获取进度
     * 
     * @return void
     */
    public function getprogress()
    {
        $cache = fixer::input('post')->get('progresscachekey');
        $this->view->data = S($cache);
        $this->display();
    }

    /**
     * 执行创建下载文件
     * 
     * @return void
     */
    public function exec()
    {
        $cacheKey = fixer::input('post')->get('progresscachekey');
        S($cacheKey, 0, ['expire' => 86400]);
        $params = fixer::input('request')->get();
        if (
            !isset($params->dataModule) || $params->dataModule == '' ||
            !isset($params->dataMethod) || $params->dataMethod == ''
        ) {
            throw new Exception('未指定数据模块或方法', 2);
        }
        $header = $this->_getTableHeader($params);
        $data = $this->_getData($params);
//         exit(json_encode(compact('header', 'data')));
        $file = $this->_createExcel($header, $data->result, $params);
        S($cacheKey, 100, ['expire' => 86400]);
        $file = substr($file, strlen($this->app->getAppRoot() . 'www'));
        $key = md5($this->_secretKey . $file);
        S($key, $file, ['expire' => 86400]);
        $this->view->file = $key;
        $this->display();
    }

    /**
     * 打包
     * 
     * @return void
     */
    public function pack()
    {
        $params = fixer::input('request')->get();
        $str = '';
        foreach ($params->files as $key => $value) {
            $str .= $value;
        }
        $file = $this->_getSavePath() . md5($str) . '.zip';
        if (!file_exists($file)) {
            $this->_doPick($params, $file);
        }
        $file = substr(
            $file, strlen($this->app->getAppRoot() . 'www')
        );
        $key = md5($this->_secretKey . $file);
        S($key, $file, ['expire' => 86400]);
        $this->view->file = $key;
        $this->display();
    }

    /**
     * 下载文件
     * 
     * @return void
     */
    public function download()
    {
        $key = fixer::input('get')->get('file');
        if (!$key) {
            throw new Exception ('请指定下载文件');
        }
        $file = $this->_getFileName($key);
        if ($file == '' || !file_exists($file)) {
            throw new Exception ('指定的文件不存在');
        }
        $fp = fopen($file, 'r');
        //$putname = 'export-' . date('Y-m-d-His') . '.xls';
        header('Content-Type: application/octet-stream');
        header("Accept-Ranges: bytes");
        header("Accept-Length: ".filesize($file));
        header('Content-Disposition: attachment; filename="' .  $this->_getBasename($file) . '"');
        echo fread($fp,filesize($file));
        fclose($fp);exit;
    }

    //下载合同附件
    public function downloadContract(){
        $key = fixer::input('get')->get('file');
        if (!$key) {
            throw new Exception ('请指定下载文件');
        }
        $file = $this->app->getAppRoot() . 'www' . '/attachments'.$key;
        if ($file == '' || !file_exists($file)) {
            throw new Exception ('指定的文件不存在');
        }
        $fp = fopen($file, 'r');
        //$putname = 'export-' . date('Y-m-d-His') . '.xls';
        header('Content-Type: application/octet-stream');
        header("Accept-Ranges: bytes");
        header("Accept-Length: ".filesize($file));
        header('Content-Disposition: attachment; filename="' .  $this->_getBasename($file) . '"');
        echo fread($fp,filesize($file));
        fclose($fp);exit;
    }

    /**
     * 获取文件名
     * 
     * @param string $key 缓存键
     * 
     * @return string
     * @throws Exception If cache data md5 value unbelievably
     */
    private function _getFileName($key)
    {
        $data = S($key);
        if (!$data) {
            return '';
        }
        if (md5($this->_secretKey . $data) != $key) {
            throw new Exception('该缓存[' + $key + ']为不可信的数据！', 2);
        }
        return $this->app->getAppRoot() . 'www' . $data;
    }

    /**
     * 执行打包
     * 
     * @param  object $params params
     * @param  string $file   zip file name
     * 
     * @return void
     */
    private function _doPick($params, $file)
    {
        $z = new ZipArchive();
        $z->open($file, ZIPARCHIVE::CREATE);
        foreach ($params->files as $f) {
            $fileName = $this->_getFileName($f);
            if ($fileName == '' && !file_exists($fileName)) {
                continue;
            }
            //$f = $this->app->getAppRoot() . 'www' . $fileName;
            $z->addFile($fileName, '/' . basename($fileName));
        }
        $z->close();
    }

    /**
     * 获取表头, 键值对
     * <pre>
     * [
     *     'field_1' => '字段1',....
     * ]
     * </pre>
     * 
     * @param object $params params
     * 
     * @return Array
     */
    private function _getTableHeader($params)
    {
        $tableHeaderConfig = include $this->app->getAppRoot() . 'config/exportdata.config.php';
        if(empty($tableHeaderConfig[$params->dataModule.'-'.$params->dataMethod])) {
            throw new Exception('模块名称不存在', 2);
        }else{
            return $tableHeaderConfig[$params->dataModule.'-'.$params->dataMethod];
        }

    }

    /**
     * 获取数据
     * 
     * @param object $params params
     * 
     * @return void
     */
    private function _getData($params)
    {
        $dataService = $this->loadService($params->dataModule);
        $method = $params->dataMethod;
        $pager = $dataService->$method($params);
        return $pager;
    }

    /**
     * 创建Excel
     *
     * @param array  $header header
     * @param array  $data   data
     * @param object $params params
     * 
     * @return string
     */
    private function _createExcel($header, $data, $params)
    {
        include_once $this->app->getCoreLibRoot() . 'Excel/PHPExcel.php';
        $excel = new PHPExcel();
        $name = $params->dataModule . date(' Y-m-d');
        $excel->getProperties()->setTitle($name);
        $excel->getProperties()->setSubject($name);
        $excel->getProperties()->setDescription($name);
        
        $excel->setActiveSheetIndex(0);
        $sheet = $excel->getActiveSheet();
        
        $sheet = $this->_renderHeader($header, $sheet);
        S($params->progresscachekey, 20, ['expire' => 86400]);
        $sheet = $this->_renderBody($header, $data, $sheet, $params);
        $filename = '';
        if (!property_exists($params, 'filename') || trim($params->filename) == '') {
            $filename = sprintf(
                '%s-%s-%s.xls',
                $params->dataModule,
                $this->app->user->organ->orgroot,
                date('Y-m-d')
            );
            $filename = $this->_getNewFileName($filename, '.xls');
        } else {
            $filename = $params->filename.'.xls';
            // $filename = mb_convert_encoding($filename, 'utf-8', 'gbk');
        }
        $writer = new PHPExcel_Writer_Excel5($excel);
        $path = $this->_getSavePath();
        if (!is_dir($path)) {
            if (!mkdir($path, 0777, true)) {
                throw new Exception ('创建文件夹时失败');
            }
        }
        $writer->save($path . $filename);
        return $path . $filename;
    }

    /**
     * 渲染表头
     *
     * @param array  $header header
     * @param object $sheet  sheet
     *
     * @return object
     */
    private function _renderHeader($header, $sheet)
    {
        $lastCell = 'A';
        // 输出表头
        $index = 0;
        foreach ($header as $name) {
            // @todo 未支持超过26列
            $cellPos = sprintf('%s1', chr(ord('A') + $index++));
            $sheet->setCellValue($cellPos, $name);
        }
        return $sheet;
    }

    /**
     * 渲染内容
     * 
     * @param array  $header header
     * @param array  $data   data
     * @param object $sheet  sheet
     * 
     * @return object
     */
    private function _renderBody($header, $data, $sheet, $params)
    {
        $startLine = 1;
        $count = count($data);
        $step = 10;
        foreach ($data as $row) {
            $index = 0;
            $startLine++;
            // 缓存进度
            if ($count / $startLine == $step / 100) {
                S($params->progresscachekey, $step / 100 * 0.75, ['expire' => 86400]);
                $step += 10;
            }

            foreach ($header as $key => $name) {
                // @todo 未支持超过26列
                $cellPos = sprintf('%s%s', chr(ord('A') + $index++), $startLine);
                $sheet->setCellValue($cellPos, $row->$key);
                
            }
        }
        S($params->progresscachekey, 95, ['expire' => 86400]);
    }

    /**
     * 生成一个新的文件名称
     * 
     * @param string $ext 扩展名
     * 
     * @return string
     */
    private function _getNewFileName($name, $ext)
    {
        return explode('.', $name)[0] . '-' . guid() . $ext;
    }

    private function _getSavePath()
    {
        return $this->app->getAppRoot() . 'www/attachments/exportfile/' . date('Ymd') . '/';
    }

    /**
     * 获取文件名
     * 
     * @param string $path 文件路径
     * 
     * @return string 文件名
     */
    private function _getBasename($path){
        return preg_replace('/^.+[\\\\\\/]/', '', $path);
    }

    /**
     * Desc:下载导入模板
     * @Author Lvison
     * @throws Exception
     */
    public function downloadTemplate() {
        // parameters check
        $params = fixer::input('request')->get();
        $params->dataModule = $params->modeltype;
        $params->dataMethod = '';
        if (
            !isset($params->dataModule) || $params->dataModule == ''
        ) {
            throw new Exception('未指定数据模块或方法', 2);
        }
        $originalHeaders = $this->_getOriginalTableHeader($params);

        // create excel template
        $excel = $this->createExcelTemplate($params->dataModule, $originalHeaders);
        // render excel to php://output
        $filenameMapping = array(
            'tender_route'=>'评标线路管理导入',
            'affiliated' => '挂靠车导入'
        );
        $filename = isset($filenameMapping[$params->dataModule])?$filenameMapping[$params->dataModule]:'模板';
        $this->renderExcel($filename.'.xlsx', $excel);
    }

    /**
     * @param string $filename
     * @param PHPExcel $excel
     */
    public function renderExcel($filename='template', PHPExcel $excel) {
        // Redirect output to a client’s web browser (Excel2007)
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $ua = $_SERVER['HTTP_USER_AGENT'];
        $encodedFilename = urlencode($filename);
        if (preg_match("/Firefox/", $ua)) {
            header('Content-Disposition: attachment; filename*="utf8\'\'' . $filename . '"');
        } else {
            header('Content-Disposition: attachment; filename="' . $encodedFilename . '"');
        }
        header('Cache-Control: max-age=0');
        // If you're serving to IE 9, then the following may be needed
        header('Cache-Control: max-age=1');
        // If you're serving to IE over SSL, then the following may be needed
        header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
        header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
        header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
        header ('Pragma: public'); // HTTP/1.0

        $objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
        $objWriter->save('php://output');
    }

    /**
     * Desc:获取导出模板表头
     * @param $params
     * @Author Lvison
     * @return array
     */
    private function _getOriginalTableHeader($params) {
        $setkey = $params->modeltype;

        $headerConfig = include_once ('fieldConfig.php');
        $header = $headerConfig[$setkey];
        foreach ($header as $key=>&$item) {
            $item['nickname'] = $item['text'];
        }
        return $header;
    }

    /**
     * Desc:创建模板临时文件
     * @param $title
     * @param array $originalHeaders
     * @Author Lvison
     * @return PHPExcel
     * @throws PHPExcel_Exception
     */
    public function createExcelTemplate($title, array $originalHeaders) {
        if(is_array($originalHeaders)){
            $originalHeaders = array2object($originalHeaders);
        }
        require_once $this->app->getCoreLibRoot() . 'Excel/PHPExcel.php';
        $excel = new PHPExcel();
        $excel->getProperties()->setTitle($title);
        $excel->getProperties()->setSubject($title);
        $excel->getProperties()->setDescription($title);
        $excel->setActiveSheetIndex(0);
        $sheet = $excel->getActiveSheet();

        // build header
        $index = 0;
        foreach ($originalHeaders as $originalHeader) {
            $columnDimension = PHPExcel_Cell::stringFromColumnIndex($index++);
            $cellPos = sprintf('%s1', $columnDimension);

            $sheet->getColumnDimension($columnDimension)->setWidth(15);
            $sheet->setCellValue($cellPos, $originalHeader->nickname);
            // default cell style
            $cellStyle = array(
                'borders' => array(
                    'allborders' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN
                    )
                )
            );
            // require field cell style
            if(isset($originalHeader->isrequired) && $originalHeader->isrequired) {
                $cellStyle = array(
                    'fill' => array(
                        'type' => PHPExcel_Style_Fill::FILL_SOLID,
                        'color' => array('rgb' => 'FF6666')
                    ),
                    'font' => array('bold' => true),
                    'borders' => array(
                        'allborders' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN
                        )
                    )
                );
            }
            // set cell style
            $sheet->getStyle($cellPos)->applyFromArray($cellStyle);
        }
        return $excel;
    }
}