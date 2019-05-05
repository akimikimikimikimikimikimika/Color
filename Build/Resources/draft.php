#! /usr/local/bin/php
<?php
	$dir=__DIR__;
	$name=$argv[1];
	$hex=$argv[2];
	$mask=$argv[3];
	$desc=$argv[4];
	$type=$name=="T";
	if (!$type) {
		$hs=$argv[5];
	}
?>
<!doctype html>
<html prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# video: http://ogp.me/ns/article#" class="<?=$type?"light flower hide":"vivid hide";?>">
	<head>
<?php
	exec('"'.$dir.'/header.php" "'.$name.'" "'.$hex.'" "'.$mask.'" "'.$desc.'"',$data);
	foreach ($data as $e) {
		echo "\t\t".$e."\n";
	}
	unset($data);

	if (!$type) {
		echo "\t\t".'<style type="text/css">'."\n";
		exec('"'.$dir.'/XspecificStyle.php" "'.$hs.'"',$data);
		foreach ($data as $e) {
			echo "\n\t\t\t".$e;
		}
		unset($data);
		echo "\n\t\t".'</style>'."\n";
	}
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
