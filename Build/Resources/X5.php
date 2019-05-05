#! /usr/local/bin/php
<?='<?xml version="1.0" encoding="UTF-8" standalone="no"?>'; ?>
<?php
$hs=$argv[1];
?>
<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
	<circle cx="32" cy="32" r="32" fill="hsl(<?=$hs;?>,50%)" stroke="none" />
</svg>
