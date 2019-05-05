#! /usr/local/bin/bash

cd "$(cd $(dirname $0); pwd)"

if [ ! -L inkscape ]; then
	echo "Inkscapeを探しています"
	find /Applications -name Inkscape.app | while read ; do
		if [ -L Resources/inkscape ]; then
			break
		else
			path="$REPLY"
			if [ -L "$path" ]; then
				path="`readlink -n "$path"`"
			fi
			echo "$path"
			ln -s "$path""/Contents/Resources/bin/inkscape" inkscape
		fi
	done
fi
if [ ! -L inkscape ]; then
	find "$HOME"/Applications -name Inkscape.app | while read ; do
		if [ -L inkscape ]; then
			break
		else
			path="$REPLY"
			if [ -L "$path" ]; then
				path="`readlink -n "$path"`"
			fi
			echo "$path"
			ln -s "$path""/Contents/Resources/bin/inkscape" inkscape
		fi
	done
fi
if [ ! -L inkscape ]; then
	echo """

利用可能なInkscapeが検出されませんでした
Inkscapeがアプリケーションフォルダにインストールされていることを確認してしてください

"""
fi
if [ -z `which png2ico` ]; then
	echo """

利用可能なpng2icoが検出されませんでした

"""
fi