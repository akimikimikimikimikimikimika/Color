#! /usr/local/bin/php
<?='<?xml version="1.0" encoding="UTF-8" standalone="no"?>'; ?>
<?php
	exec(__DIR__."/../Build.py pairs",$pairs);
	$pairs=$pairs[0];
	$bg=preg_match("/[wc]/i",$argv[1]);
	$card=preg_match("/c/i",$argv[1]);
	$small=preg_match("/s/i",$argv[1]);
	$i = function($v){return $v;};
?>

<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="<?=$card?1200:1024; ?>" height="<?=$card?630:1024; ?>" viewBox="0 0 <?=$card?"1200 630":($small?"768 768":"1024 1024"); ?>">
	<defs>
<?php
	function grad($v,$t) {
		global $i,$pairs;
		if ($v==18 && $t) {return "";}
		else {
			$x=$t?$pairs[($v)%18].$pairs[($v+1)%18]:$pairs[$v];
			$h=($v%18)*20+($t?10:0);
			$hs="hsl($h,{$i($x=="S"?0:80)}%";
			return <<<"Gradient"
		<radialGradient id="$x"{$i($x=="S"?"":' cx="0%" cy="50%" r="100%"')}>
			<stop offset="{$i($x=="S"?0:25)}%" stop-color="$hs,{$i($t?100:85)}%)" stop-opacity="{$i($t?0.1:1)}" />
			<stop offset="100%" stop-color="$hs,50%)" stop-opacity="{$i($t?0.1:1)}" />
		</radialGradient>

Gradient;
		}
	}
	$petal="";
	$sepal="";
	for ($n=0;$n<19;$n++) {
		$petal.=grad($n,FALSE);
		$sepal.=grad($n,TRUE);
	}
	print $petal;
	print $sepal;
?>
		<polygon points="0,0 240,36 304,0 240,-36" transform="translate(512,512)" stroke="none" id="sepal" />
		<path d="M 0,0 C 300,52.898094212539492 354,36 374,18 Q 394,0 374,-18 C 354,-36 300,-52.898094212539492 0,0 Z" transform="translate(512,512)" stroke="none" id="petal" />
		<circle r="96" transform="translate(512,512)" stroke="none" id="pistil" />
	</defs>
<?php
	function using($v,$t) {
		global $i,$card,$pairs;
		if ($v==18 && $t) {return "";}
		else {
			$x=$t?$pairs[($v)%18].$pairs[($v+1)%18]:$pairs[$v];
			$h=($v%18)*20+($t?10:0);
			if ($x=="S") {$o="pistil";}
			elseif (strlen($x)==1) {$o="petal";}
			else {$o="sepal";}
			return "{$i($card?"\t":"")}\t<use xlink:href=\"#$o\"{$i($x=="S"?"":" transform=\"rotate(-$h,512,512)\"")} fill=\"url(#$x)\" />\n";
		}
	}
	if ($bg) {
		if ($card) {print "\t".'<rect x="0" y="0" width="1200" height="630" fill="#ffffff" />'."\n";}
		else {print "\t".'<rect x="0" y="0" width="1024" height="1024" fill="#ffffff" />'."\n";}
	}
	if ($card) {print "\t".'<g transform="matrix(0.615234375 0 0 0.615234375 285 0)">'."\n";}
	elseif ($small) {print "\t".'<g transform="matrix(1 0 0 1 -128 -128)">'."\n";}
	$sepal="";
	$petal="";
	for ($n=0;$n<19;$n++) {
		$sepal.=using($n,TRUE);
		$petal.=using($n,FALSE);
	}
	print $sepal;
	print $petal;
	if ($card||$small) {print "\t".'</g>'."\n";}
?>
</svg>