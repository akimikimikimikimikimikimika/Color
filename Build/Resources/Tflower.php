#! /usr/local/bin/php
<svg id="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024">
<?php
	$dir = __DIR__;

	exec('"'.$dir.'/../Build.py" pairs',$pairs);
	$pairs=$pairs[0];
	$count=strlen($pairs)-1;
	$one=array();
	$two=array();
	for ($n=0;$n<$count;$n++) {
		$one[$n]=$pairs[$n];
	}
	for ($n=0;$n<($count-1);$n++) {
		$two[$n]=$one[$n].$one[($n+1)%($count-1)];
	}
?>
	<defs>
<?php
	$n=0;
	foreach ($one as $x) {
		$p=$x=="S"?50:0;
		$h=$n%18*20;
		$s=$x=="S"?0:80;
		echo "\t\t".'<radialGradient id="'.$x.'" class="one" cx="'.$p.'%" cy="50%" r="'.(100-$p).'%">'."\n";
		echo "\t\t\t".'<stop offset="'.(25-$p/2).'%" stop-color="hsl('.$h.','.$s.'%,85%)" />'."\n";
		echo "\t\t\t".'<stop offset="100%" stop-color="hsl('.$h.','.$s.'%,50%)" />'."\n";
		echo "\t\t</radialGradient>\n";
		$n++;
	}
	$n=0;
	foreach ($two as $y) {
		$h=$n*20+10;
		echo "\t\t".'<radialGradient id="'.$y.'" class="two" cx="0%" cy="50%" r="100%">'."\n";
		echo "\t\t\t".'<stop offset="25%" stop-color="hsl('.$h.',80%,100%)" />'."\n";
		echo "\t\t\t".'<stop offset="100%" stop-color="hsl('.$h.',80%,50%)" />'."\n";
		echo "\t\t</radialGradient>\n";
		$n++;
	}
?>
		<polygon points="0,0 240,36 304,0 240,-36" transform="translate(512,512)" stroke="none" id="sepal" />
		<path d="M 0,0 C 300,52.898094212539492 354,36 374,18 Q 394,0 374,-18 C 354,-36 300,-52.898094212539492 0,0 Z" transform="translate(512,512)" stroke="none" id="petal" />
		<circle r="96" transform="translate(512,512)" stroke="none" id="pistil" />
	</defs>
<?php
	$n=0;
	foreach ($two as $y) {
		echo "\t".'<use xlink:href="#sepal" transform="rotate(-'.($n*20+10).',512,512)" fill="url(#'.$y.')" />'."\n";
		$n++;
	}
	$n=0;
	foreach ($one as $x) {
		$p=$x=="S"?"pistil":"petal";
		if ($x=="S") {$t="";}
		else {$t=' transform="rotate(-'.($n*20).',512,512)"';}
		echo "\t".'<use xlink:href="#'.$p.'"'.$t.' fill="url(#'.$x.')" id="use'.$x.'" />'."\n";
		$n++;
	}
?>
</svg>