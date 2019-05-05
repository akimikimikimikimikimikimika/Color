#! /usr/local/bin/php
<?php
	$dir=__DIR__;
	$name=$argv[1];
	$hex=$argv[2];
	$mask=$argv[3];
	$type=$name=="T";
	if (!$type) {
		$hs=$argv[4];
	}
	else {
		$hs="";
	}
?>
<!doctype html>
<html>
	<head>
		<title>Color <?=$name;?></title>
		<style type="text/css">
			html{
<?php
	echo "\t\t\t\t"."background-color:$mask;"."\n";
	if (!$type) {
		echo "\t\t\t\t"."background-image:linear-gradient(30deg, hsl($hs,74%), hsl($hs,50%), hsl($hs,26%));"."\n";
		echo "\t\t\t\t"."width:100%;"."\n";
		echo "\t\t\t\t"."height:100%;"."\n";
	}
?>
			}
		</style>
		<script type="text/javascript">
			location.replace("<?php

	if (!is_dir($dir."/.tmp")) mkdir($dir."/.tmp");
	exec('"'.$dir.'/offlineDraft.php" "'.$name.'" "'.$hex.'" "'.$hs.'"',$data);
	$io=fopen($dir."/.tmp/".$name."offlineDraft.html","w");
	fwrite($io,implode("\n",$data));
	fclose($io);
	unset($data);
	exec('"'.$dir.'/Parser.py" bc "'.$dir.'/.tmp/'.$name.'offlineDraft.html"',$data);
	echo $data[0];
	unlink($dir."/.tmp/".$name."offlineDraft.html");
	unset($data);

?>");
		</script>
	</head>
</html>