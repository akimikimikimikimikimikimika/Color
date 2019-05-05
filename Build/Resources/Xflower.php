#! /usr/local/bin/php
<svg id="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024">
	<defs id="defs">
		<radialGradient id="pistilColor">
			<stop offset="0%" class="pistilColor000" />
			<stop offset="100%" class="pistilColor100" />
		</radialGradient>
		<radialGradient id="petalColor" cx="0%" cy="50%" r="100%">
			<stop offset="25%" class="petalColor025" />
			<stop offset="100%" class="petalColor100" />
		</radialGradient>
		<radialGradient id="sepalColor" cx="0%" cy="50%" r="100%">
			<stop offset="0%" id="sepalColor000" />
			<stop offset="100%" id="sepalColor100" />
		</radialGradient>
		<radialGradient id="focusColor">
			<stop offset="25%" />
			<stop offset="100%" />
		</radialGradient>
		<circle r="96" transform="translate(512,512)" fill="url(#pistilColor)" stroke="none" id="pistil" />
		<path d="M 0,0 C 300,52.898094212539492 354,36 374,18 Q 394,0 374,-18 C 354,-36 300,-52.898094212539492 0,0 Z" transform="translate(512,512)" fill="url(#petalColor)" stroke="none" id="petal" />
		<polygon points="0,0 240,36 304,0 240,-36" transform="translate(512,512)" fill="url(#sepalColor)" stroke="none" id="sepal" />
	</defs>
<?php
	$dir = __DIR__;

	exec('"'.$dir.'/../Build.py" pairs',$pairs);
	$pairs=$pairs[0];
	$count=strlen($pairs)-1;
	for ($n=0;$n<$count-1;$n++) {
		echo "\t".'<use xlink:href="#sepal" transform="rotate('.($n*20+10).',512,512)" />'."\n";
	}
	for ($n=0;$n<$count;$n++) {
		$nm=$pairs[$n];
		echo "\t".'<use xlink:href="#'.($n==($count-1)?"pistil":"petal").'"'.($n==($count-1)?"":' transform="rotate(-'.($n*20).',512,512)"').' id="use'.$nm.'" />'."\n";
	}
?>
</svg>