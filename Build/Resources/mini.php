#! /usr/local/bin/php
<?='<?xml version="1.0" encoding="UTF-8" standalone="no"?>'; ?>
<?php
$hex=$argv[1];
?>
<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1">
	<rect x="0" y="0" width="1" height="1" fill="<?=$hex; ?>" />
</svg>
