#! /usr/bin/env php
<?php
/*
	Usage: ./image.php [hue] [options]...

	[hue] : hue
		can be 0~19
	[options]...
		* white
			create image of white flower instead of vivid color one
		* no-margin
		* card
		* background
			enable background image
		* embed
			for embedding, add title and class attributes to use elements
*/

$i = function($v){return $v;};

$un=19;
$white=false;
$noMargin=false;
$card=false;
$background=false;
$embed=false;

if (count($argv)>1) $un=(int)$argv[1];
if (($un<0)||($un>19)) $un=19;
if (count($argv)>2) for ($n=1;$n<count($argv);$n++) switch ($argv[$n]) {
	case "white":
		$white=true;break;
	case "no-margin":
		$noMargin=true;break;
	case "card":
		$card=true;break;
	case "background":
		$background=true;break;
	case "embed":
		$embed=true;break;
}

function pistil($id,$hue) {
	global $i,$white,$embed,$un;
	$rgh=$embed&&($un==19) ? ' style="--hue:'.$hue.';"' : "";
	$sc1=$embed ? ' class="pistilColor000"' : ' stop-color="hsl('.$hue.',85%)"';
	$sc2=$embed ? ' class="pistilColor100"' : ' stop-color="hsl('.$hue.','.($white?100:50).'%)"';
	$source = <<< source
			<radialGradient id="$id"$rgh>
				<stop offset="0%"$sc1 />
				<stop offset="100%"$sc2 />
			</radialGradient>
	source;
	return $source;
}

function petal($id,$hue) {
	global $i,$white,$embed,$un;
	$rgh=$embed&&($un==19) ? ' style="--hue:'.$hue.';"' : "";
	$sc1=$embed ? ' class="petalColor025"' : ' stop-color="hsl('.$hue.',85%)"';
	$sc2=$embed ? ' class="petalColor100"' : ' stop-color="hsl('.$hue.','.($white?100:50).'%)"';
	$source = <<< source
			<radialGradient id="$id" cx="0%" cy="50%" r="100%"$rgh>
				<stop offset="25%"$sc1 />
				<stop offset="100%"$sc2 />
			</radialGradient>
	source;
	return $source;
}

function sepal($id,$hue) {
	global $i,$white,$embed,$un;
	$rgh=$embed&&($un==19) ? ' style="--hue:'.$hue.';"' : "";
	$sc1=$embed ? ' class="sepalColor000"' : ' stop-color="hsl('.$hue.','.($white?95:74).'%)" stop-opacity="0.3"';
	$sc2=$embed ? ' class="sepalColor100"' : ' stop-color="hsl('.$hue.','.($white?100:26).'%)" stop-opacity="0.3"';
	$source = <<< source
			<radialGradient id="$id" cx="0%" cy="50%" r="100%"$rgh>
				<stop offset="0%"$sc1 />
				<stop offset="100%"$sc2 />
			</radialGradient>
	source;
	return $source;
}

function using($use,$fill,$rotate,$n) {
	global $embed;
	$title="";$class="";
	if ($embed) {
		if ($n>=0) $title=' title="'.c($n).'"';
		$class=' class="'.$use.'"';
	}
	if (strlen($fill)>0) $fill=' fill="url(#'.$fill.')"';
	if (strlen($rotate)>0) $rotate=' transform="rotate('.$rotate.')"';
	$source = "\t\t".'<use'.$title.$fill.$rotate.$class.' xlink:href="#'.$use.'" />';
	return $source;
}

function c($n) {
	return strtoupper(base_convert((string)($n+10),10,36));
}

function hue($n) {
	return (string)($n*20%360).",".($n==18?"0":"80")."%";
}

?>
<?php
	$vb=$card?'-975.2380952381 -512 1950.4761904762 1024':($noMargin?'-384 -384 768 768':'-512 -512 1024 1024');
	echo ($embed?<<< source
	<svg viewBox="$vb">
	source:<<< source
	<?xml version="1.0" encoding="UTF-8" standalone="no"?>
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{$i($card?1200:1024)}" height="{$i($card?630:1024)}" viewBox="$vb">
	source)."\n";
?>
	<defs<?=$embed?' id="defs"':''; ?>>
<?php
	$list = array();
	if ($un<19) {
		$h=hue($un);
		array_push($list,petal("petalColor",$h));
		array_push($list,pistil("pistilColor",$h));
		array_push($list,sepal("sepalColor",$h));
	}
	else {
		for ($n=0;$n<18;$n++) array_push($list,petal(c($n),hue($n)));
		array_push($list,pistil(c(18),hue(18)));
		for ($n=0;$n<18;$n++) array_push($list,sepal(c($n).c(($n+1)%18),hue($n+0.5)));
	}
	echo implode("\n",$list)."\n";
?>
		<circle id="pistil" r="96" stroke="none"<?=$un<19?' fill="url(#pistilColor)" ':''; ?> />
		<path id="petal" d="M 0,0 C 300,52.898094212539492 354,36 374,18 Q 394,0 374,-18 C 354,-36 300,-52.898094212539492 0,0 Z" stroke="none"<?=$un<19?' fill="url(#petalColor)" ':''; ?> /><?=$embed?'<circle r="48" cx="672" stroke="none" id="petalDrop" />':'' ?>
		<polygon id="sepal" points="0,0 240,36 304,0 240,-36" stroke="none"<?=$un<19?' fill="url(#sepalColor)" ':''; ?> />
	</defs>
	<g<?=$embed?' id="graphic"':''; ?>>
<?php
	$list = array();
	if ($background) {
		$rect=$card?'x="-975.2380952381" y="-512" width="1950.4761904762" height="1024"':'x="-512" y="-512" width="1024" height="1024"';
		array_push($list,"\t\t".'<rect '.$rect.' fill="'.($un<19?("hsl(".hue($un).",50%)"):"#FFFFFF").'" />');
	}
	for ($n=0;$n<18;$n++) {
		$t="";
		if ($un==19) $t=c($n).c(($n+1)%18);
		array_push($list,using("sepal",$t,"-".(string)(($n+0.5)*20),-1));
	}
	for ($n=0;$n<19;$n++) {
		$t="";
		if ($un==19) $t=c($n);
		array_push($list,using($n<18?"petal":"pistil",$t,$n<18?("-".(string)($n*20)):"",$n));
	}
	echo implode("\n",$list)."\n";
?>
	</g>
<?="</svg>"; ?>