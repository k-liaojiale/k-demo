<?php

$key = '3f2f8e6d1845231ff8c4d0be6437da1f';
$con = '402881206e1b94b1016e1b94f9ce0001';

include('Crypt3Des.php');  
  
$threeDes = new Crypt3Des();  
// 设置key
$threeDes->setKey($key);   
// 加密
$encryptMsg = $threeDes->encrypt($con);
//解密
$decryptMsg = $threeDes->decrypt($encryptMsg);

// 输出
echo "Encrypt: " . $encryptMsg . "<br/>";
echo "Decode: " . $decryptMsg; 