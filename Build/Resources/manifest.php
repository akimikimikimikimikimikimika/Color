#! /usr/local/bin/php
<?php
	$dir=__DIR__;
	$name=$argv[1];
	$hex=$argv[2];
	$desc=$argv[3];
?>
{
	"short_name":"<?=$name;?>",
	"name":"Color <?=$name;?>",
	"icons":[
		{
			"src":"Icon.png",
			"type":"image/png",
			"sizes":"192x192"
		}
	],
	"lang":"ja-JP",
	"description":"<?=$desc;?>",
	"display":"standalone",
	"start_url":"?standalone=yes",
	"background_color":"<?=$hex;?>",
	"theme_color":"<?=$hex;?>"
}