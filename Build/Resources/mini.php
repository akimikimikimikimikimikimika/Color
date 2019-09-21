#! /usr/bin/env php
<?php

$un=19;

if (count($argv)>1) $un=(int)$argv[1];
if (($un<0)||($un>19)) $un=19;

if ($un<19) $hsl="hsl(".(string)($un*20%360).",".($un==18?"0":"80")."%,50%)";
else $hsl="#333333";

?>
<?='<?xml version="1.0" encoding="UTF-8" standalone="no"?>' ?>
<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1">
	<rect x="0" y="0" width="1" height="1" fill="<?=$hsl;?>" />
</svg>