#! /usr/local/bin/php
<?php $hs=$argv[1]; ?>
.pistilColor000,.petalColor025{stop-color:hsl(<?=$hs;?>,85%);}
@media screen {
	html{background-color:hsl(<?=$hs;?>,50%);}
	.vivid>body{background-image:linear-gradient(30deg, hsl(<?=$hs;?>,74%), hsl(<?=$hs;?>,50%), hsl(<?=$hs;?>,26%));}
	.light>body{background-image:linear-gradient(hsl(<?=$hs;?>,95%), hsl(<?=$hs;?>,95%));}
	.light #statusbar{background-color:hsl(<?=$hs;?>,40%);}
	.dark>body{background-image:linear-gradient(hsl(<?=$hs;?>,15%), hsl(<?=$hs;?>,15%));}
	.vivid .button>div{background-color:hsl(<?=$hs;?>,100%);}
	.light .button>div,.dark .button>div{background-color:hsl(<?=$hs;?>,50%);}
	.vivid .pistilColor100,.vivid .petalColor100{stop-color:hsl(<?=$hs;?>,100%);}
	.light .pistilColor100,.dark .pistilColor100,.light .petalColor100,.dark .petalColor100{stop-color:hsl(<?=$hs;?>,50%);}
	.vivid #sepalColor000{stop-color:hsl(<?=$hs;?>,95%);}
	.vivid #sepalColor100{stop-color:hsl(<?=$hs;?>,100%);}
	.light #sepalColor000,.dark #sepalColor000{stop-color:hsl(<?=$hs;?>,74%);}
	.light #sepalColor100,.dark #sepalColor100{stop-color:hsl(<?=$hs;?>,26%);}
	.vivid #ownColorZero{stop-color:hsl(<?=$hs;?>,85%);}
	.vivid #ownColorFull{stop-color:hsl(<?=$hs;?>,50%);}
	.light #ownColorZero,.dark #ownColorZero{stop-color:hsl(<?=$hs;?>,91%);}
	.light #ownColorFull,.dark #ownColorFull{stop-color:hsl(<?=$hs;?>,70%);}
}
@media print {
	.pistilColor100,.petalColor100{stop-color:hsl(<?=$hs;?>,50%);}
	#sepalColor000{stop-color:hsl(<?=$hs;?>,97.4%);}
	#sepalColor100{stop-color:hsl(<?=$hs;?>,92.6%);}
}
