#! /usr/local/bin/php
<?php
	$dir=__DIR__;
	$name=$argv[1];
	$hex=$argv[2];
	$mask=$argv[3];
	$desc=$argv[4];
	$type=$name=="T";
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
<!--<link rel="manifest" type="application/manifest+json" href="manifest.json" />-->
<link rel="icon" href="Icon.png" />
<link rel="shortcut icon" href="Favicon.ico" />
<meta name="theme-color" content="<?=$hex;?>" />
<link rel="apple-touch-icon-precomposed" href="apple-touch-icon.png" />
<link rel="mask-icon" color="<?=$mask;?>" href="../Resources/Black.svg" />
<meta name="msapplication-TileColor" content="<?=$hex;?>" />
<meta name="msapplication-TileImage" content="tileImage.png" />
<meta property="og:url" content="https://akimikimikimikimikimikimika.github.io/Color/Color-<?=$name;?>/" />
<meta property="og:title" content="Color <?=$name;?>" />
<meta property="og:type" content="article" />
<meta property="og:description" content="<?=$desc;?>" />
<meta property="og:site_name" content="Color" />
<meta property="og:image" content="Card.png" />
<meta property="og:locale" content="ja_JP" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="stylesheet" type="text/css" href="../Resources/<?=$type?"T":"X";?>style.css" />
<script type="text/javascript" src="../Resources/<?=$type?"T":"X";?>script.js"></script>
<title>Color <?=$name;?></title>
<?php
	exec('"'.$dir.'/../Build.py" pairs',$pairs);
	$pairs=$pairs[0];

	for ($n=0;$n<strlen($pairs);$n++) {
		$nm=$pairs[$n];
		echo '<link rel="alternate" title="'.$nm.'" href="../Color-'.$nm.'/" />'."\n";
	}
?>
