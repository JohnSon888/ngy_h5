<?php
// error_reporting(0);
//上传图片
$file = $_FILES['file'];//图片附件
$tname = $file["tmp_name"];
$fname = $file["name"];
$file_type = explode(".", $fname);
$file_type = end($file_type);//文件类型
	
$path_relative = '/api/upload_images/'.date("Y-m");//图片相对地址
$path = realpath(dirname(__FILE__).'/../').$path_relative;//api上传图片地址

$domain = 'http';
if ($_SERVER["HTTPS"] == "on")
{
	$domain .= "s";
}
$domain .= "://".$_SERVER['HTTP_HOST'];//域名

if (! is_dir($path)) {
	mkdir($path, 0777, true);
	chmod($path, 0777);
}
$file_name=uniqid() . '.' . $file_type;
$destination = $path . '/' . $file_name;//api图片路径
if(move_uploaded_file($tname, $destination)){
	echo $domain.$path_relative.'/'.$file_name;
}
