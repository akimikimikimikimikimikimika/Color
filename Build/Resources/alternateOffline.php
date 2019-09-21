#! /usr/bin/env php
<?php
	$list = array();
	for ($n=0;$n<19;$n++) {
        $c=strtoupper(base_convert((string)($n+10),10,36));
		array_push($list,'<link rel="alternate" title="Color '.$c.'" href="https://akimikimikimikimikimikimika.github.io/Color/Color-'.$c.'/" />');
	}
	echo implode("\n",$list);
?>