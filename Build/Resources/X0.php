#! /usr/local/bin/php
<?='<?xml version="1.0" encoding="UTF-8" standalone="no"?>'; ?>
<?php
$hs=$argv[1];
?>
<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
	<defs>
		<radialGradient id="pistilColor">
			<stop offset="0%" stop-color="hsl(<?=$hs;?>,85%)" stop-opacity="1" />
			<stop offset="100%" stop-color="hsl(<?=$hs;?>,50%)" stop-opacity="1" />
		</radialGradient>
		<radialGradient id="petalColor" cx="0%" cy="50%" r="100%">
			<stop offset="25%" stop-color="hsl(<?=$hs;?>,85%)" stop-opacity="1" />
			<stop offset="100%" stop-color="hsl(<?=$hs;?>,50%)" stop-opacity="1" />
		</radialGradient>
		<radialGradient id="sepalColor" cx="0%" cy="50%" r="100%">
			<stop offset="0%" stop-color="hsl(<?=$hs;?>,74%)" stop-opacity="0.1" />
			<stop offset="100%" stop-color="hsl(<?=$hs;?>,26%)" stop-opacity="0.1" />
		</radialGradient>
		<circle r="96" transform="translate(512,512)" fill="url(#pistilColor)" stroke="none" id="pistil" />
		<path d="M 0,0 C 300,52.898094212539492 354,36 374,18 Q 394,0 374,-18 C 354,-36 300,-52.898094212539492 0,0 Z" transform="translate(512,512)" fill="url(#petalColor)" stroke="none" id="petal" />
		<polygon points="0,0 240,36 304,0 240,-36" transform="translate(512,512)" fill="url(#sepalColor)" stroke="none" id="sepal" />
	</defs>
<?php
	$sepal="";
	$petal="";
	for ($n=0;$n<18;$n++) {
		$p=$n*20;
		$s=$p+10;
		$sepal.="\t<use xlink:href=\"#sepal\" transform=\"rotate($s,512,512)\" />\n";
		$petal.="\t<use xlink:href=\"#petal\" transform=\"rotate($p,512,512)\" />\n";
	}
	print $sepal;
	print $petal;
?>
	<use xlink:href="#pistil" />
</svg>
