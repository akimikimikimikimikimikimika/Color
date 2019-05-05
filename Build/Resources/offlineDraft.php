#! /usr/local/bin/php
<?php
$dir=__DIR__;
$name=$argv[1];
$hex=$argv[2];
$type=$name=="T";
if (!$type) {
	$hs=$argv[3];
}
?>
<!doctype html>
<html class="<?=$type?"light flower hide":"vivid hide";?>">
	<head>
<?php

exec('"'.$dir.'/offlineHeader.php" "'.$name.'" "'.$hex.'"',$data);
foreach ($data as $e) {
	echo "\t\t".$e."\n";
}
unset($data);

echo "\t\t".'<style type="text/css">'."\n";

$fp=fopen($dir."/".($type?"T":"X")."style.css","r");
while (!feof($fp)) {
	echo "\t\t\t".fgets($fp);
}
fclose($fp);

if (!$type) {
	exec('"'.$dir.'/XspecificStyle.php" "'.$hs.'"',$data);
	foreach ($data as $e) {
		echo "\n\t\t\t".$e;
	}
}
unset($data);

echo "\n\t\t".'</style>'."\n";

echo "\t\t".'<script type="text/javascript">'."\n";
$fp=fopen($dir."/".($type?"T":"X")."script.js","r");
while (!feof($fp)) {
	echo "\t\t\t".fgets($fp);
}
fclose($fp);
echo "\n\t\t".'</script>'."\n";

?>
	</head>
	<body>
		<div id="flowerContainer">
<?php
	$svg=$dir."/.tmp/".($type?"T":"X")."flower.svg";
	if (is_file($svg)) {
		$fp=fopen($svg,"r");
		while (!feof($fp)) {
			echo "\t\t\t".fgets($fp);
		}
		fclose($fp);
	}
	else {
		exec('"'.$dir.'/'.($type?"T":"X").'flower.php"',$data);
		foreach ($data as $e) {
			echo "\t\t\t".$e."\n";
		}
		unset($data);
	}
?>
		</div>
	</body>
</html>