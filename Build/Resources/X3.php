#! /usr/local/bin/php
<?='<?xml version="1.0" encoding="UTF-8" standalone="no"?>'; ?>
<?php
$hs=$argv[1];
?>
<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" width="1024" height="1024" viewBox="0 0 1024 1024">
	<defs>
		<linearGradient id="gradient" x1="90%" y1="0%" x2="10%" y2="100%">
			<stop offset="0%" stop-color="hsl(<?=$hs;?>,74%)" />
			<stop offset="50%" stop-color="hsl(<?=$hs;?>,50%)" />
			<stop offset="100%" stop-color="hsl(<?=$hs;?>,26%)" />
		</linearGradient>
	</defs>
	<circle cx="512" cy="512" r="384" fill="url(#gradient)" />
</svg>
