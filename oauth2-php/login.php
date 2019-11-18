<?php
//echo json_encode($_GET);die;
$data = json_decode(file_get_contents('php://input'), true);

$query = array(
    //授权类别
    'grant_type' => 'password',
    'username' => $data['username'],
    'password' => $data['password'],
    'client_id' => 'testclient',
    'client_secret' => 'testpass',
);
//模拟Post请求 请求access_token
$url = "http://oa-tp5.cc/token.php";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($query));
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$output = curl_exec($ch);
curl_close($ch);
$res = json_decode($output, true);
echo json_encode($res);