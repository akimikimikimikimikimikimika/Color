#! /usr/local/bin/bash


main(){
	cd `dirname "$0"`
	local pairs=`./Pairs.sh`
	local count=${#pairs}
	mkdir -p /tmp/Color
	echo "`./Xdraft.php`" > /tmp/Color/Xdraft
	echo "`./XofflineDraft.php`" > /tmp/Color/XofflineDraft
	echo "`./Tdraft.php`" > /tmp/Color/Tdraft
	echo "`./TofflineDraft.php`" > /tmp/Color/TofflineDraft
	local n ; local x ; local t ; local hex ; local mask ; local H ; local h ; local S ; local sOpr ; local s ; local L=0.5 ; local icon ; local appleTouchIcon ; local offline
	# Build text
	for n in `seq 0 $((count-1))` ; do
		x=${pairs:n:1}
		if [ $x = T ]; then
			t="T"
			H=0 ; S=0 ; s=0 ; hex="#FFFFFF" ; mask="#000000"
		else
			t="X"
			H=$((n%18*20))
			if [ $n -eq 18 ]; then
				S=0 ; sOpr="=" ; h="?"
			else
				S=0.8 ; sOpr=">" ; h=$H"°"
			fi
			s=`echo "scale=0; $S * 100" | bc`
			hex=`./HSL2Hex.swift $H $S $L`
			mask="$hex"
		fi
		icon="`./Parser b ../Color-$x/Icon.png | sed "s/\//\\\\\\\\\//g" | sed "s/\+/\\\\\+/g"`"
		appleTouchIcon="`./Parser b ../Color-$x/mini.png | sed "s/\//\\\\\\\\\//g" | sed "s/\+/\\\\\+/g"`"
		tileImage="`./Parser b ../Color-$x/tileImage.png | sed "s/\//\\\\\\\\\//g" | sed "s/\+/\\\\\+/g"`"
		cat /tmp/Color/"$t"draft | sed "s/\\\$name/$x/g" | sed "s/\\\$type/$t/g" | sed "s/\\\$hex/$hex/g" | sed "s/\\\$mask/$mask/g" | sed "s/\/\*\$HS\*\/hsl(0,0/hsl($H,$s%/g" > /tmp/Color/"$x"draft.html
		./Parser c /tmp/Color/"$x"draft.html /tmp/Color/"$x"draft.html
		cat /tmp/Color/"$t"offlineDraft | sed "s/\\\$name/$x/g" | sed "s/\\\$hex/$hex/g" | sed "s/\/\*\$HS\*\/hsl(0,0/hsl($H,$s%/g" | sed "s/\\\$icon/$icon/g" | sed "s/\\\$appleTouchIcon/$appleTouchIcon/g" | sed "s/\\\$tileImage/$tileImage/g" > /tmp/Color/"$x"offlineDraft.html
		offline="`./Parser bc /tmp/Color/"$x"offlineDraft.html | sed "s/\//\\\\\\\\\//g" | sed "s/\+/\\\\\+/g"`"
		./"$t"offline.php | sed "s/\\\$name/$x/g" | sed "s/\/\*\$HS\*\/hsl(0,0/hsl($H,$s%/g" | sed "s/\\\$offlineURI/$offline/g" > /tmp/Color/"$x"offline
		./"$t"manifest.php | sed "s/\\\$name/$x/g" | sed "s/\\\$hex/$hex/g" | sed "s/\\\$hue/$h/g" | sed "s/\\\$sOpr/$sOpr/g" > /tmp/Color/"$x"manifest
		./Parser c /tmp/Color/"$x"offline /tmp/Color/"$x"offline
	done
	# Position documents
	./Parser c Black.svg ../Resources/Black.svg
	./Parser c Xstyle.css ../Resources/Xstyle.css
	./Parser c Xscript.js ../Resources/Xscript.js
	./Parser c Tstyle.css ../Resources/Tstyle.css
	./Parser c Tscript.js ../Resources/Tscript.js
	if [ "$1" = S ]; then
		mkdir -p "$HOME"/Documents/Color
	fi
	for n in `seq 0 $((count-1))` ; do
		x=${pairs:n:1}
		mv /tmp/Color/"$x"draft.html ../Color-"$x"/index.html
		mv /tmp/Color/"$x"offline ../Color-"$x"/offline.html
		mv /tmp/Color/"$x"manifest ../Color-"$x"/manifest.json
		if [ "$1" = S ]; then
			mv /tmp/Color/"$x"offlineDraft.html "$HOME"/Documents/Color/"$x".html
		fi
	done
	rm -fr /tmp/Color
}


main $1
exit