#! /usr/local/bin/php
<?php
	$dir=__DIR__;
	$name=$argv[1];
	$hex=$argv[2];
?>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no,viewport-fit=cover" />
<meta name="format-detection" content="telephone=no,email=no,address=no" />
<meta name="referrer" content="never" />
<meta name="referrer" content="no-referrer" />
<meta name="application-name" content="<?=$name;?>" />
<meta name="apple-mobile-web-app-title" content="<?=$name;?>" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="icon" href="<?php
	exec('"'.$dir.'/Parser.py" b "'.$dir.'/../../Color-'.$name.'/Icon.png"',$data);
	echo $data[0];
	unset($data);
?>" />
<meta name="theme-color" content="<?=$hex;?>" />
<link rel="apple-touch-icon-precomposed" href="<?php
	if (!is_dir($dir."/.tmp")) mkdir($dir."/.tmp");
	exec('"'.$dir.'/mini.php" "'.$hex.'"',$data);
	$io=fopen($dir."/.tmp/".$name."mini.svg","w");
	fwrite($io,implode("\n",$data));
	fclose($io);
	unset($data);
	exec('inkscape --without-gui -w 1 -h 1 -f "'.$dir.'/.tmp/'.$name.'mini.svg" -e "'.$dir.'/.tmp/'.$name.'mini.png"');
	unlink($dir."/.tmp/".$name."mini.svg");
	exec('"'.$dir.'/Parser.py" b "'.$dir.'/.tmp/'.$name.'mini.png"',$data);
	echo $data[0];
	unlink($dir."/.tmp/".$name."mini.png");
	unset($data);
?>" />
<title>Color <?=$name;?></title>