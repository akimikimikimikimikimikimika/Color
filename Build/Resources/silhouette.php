#! /usr/bin/env php
<?='<?xml version="1.0" encoding="UTF-8" standalone="no"?>'; ?>
<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="-384 -384 768 768">
	<defs>
		<radialGradient id="pistilColor">
			<stop offset="0%" stop-color="hsl(0,0%,85%)" stop-opacity="1" />
			<stop offset="100%" stop-color="hsl(0,0%,100%)" stop-opacity="1" />
		</radialGradient>
		<radialGradient id="petalColor" cx="0%" cy="50%" r="100%">
			<stop offset="25%" stop-color="hsl(0,0%,85%)" stop-opacity="1" />
			<stop offset="100%" stop-color="hsl(0,0%,100%)" stop-opacity="1" />
		</radialGradient>
		<circle r="96" stroke="none" id="pistil" />
		<path d="M 0,0 C 300,52.898094212539492 354,36 374,18 Q 394,0 374,-18 C 354,-36 300,-52.898094212539492 0,0 Z" stroke="none" id="petal" />
	</defs>
<?php
	$list = array();
	for ($n=0;$n<19;$n++) {
		if ($n<18) array_push($list,"\t".'<use xlink:href="#petal" transform="rotate('.(string)($n*20).',0,0)" />');
		else array_push($list,"\t".'<use xlink:href="#pistil" />');
	}
	echo implode("\n",$list)."\n";
?>
</svg>