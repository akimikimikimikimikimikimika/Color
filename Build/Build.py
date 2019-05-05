#! /usr/local/bin/python3.7
# -*- coding: utf-8 -*-

import sys
import os
import subprocess
import shutil
import threading
import datetime as dt

dto=dt.datetime
start=dto.now()

os.chdir(os.path.dirname(os.path.join(os.getcwd(),__file__))+"/Resources")
arg=sys.argv[1]

pairs="ABCDEFGHIJKLMNOPQRST"

# execute external command
def execute(*cmd):
	p=subprocess.Popen(list(cmd),stdout=subprocess.PIPE)
	stdout,_=p.communicate()
	return stdout.decode().strip()

# execute and write
def exw(at,*cmd):
	fh=open(at,"w")
	fh.write(execute(*cmd))
	fh.close()

# thread
def quickThread(func,args,wait=True):
	threads=[]
	for a in args: threads.append(threading.Thread(target=func,args=a))
	for t in threads: t.start()
	if wait:
		for t in threads: t.join()
	return threads

# make directory
def mkdir(at):
	if not os.path.isdir(at):
		if os.path.exists(at): shutil.rmtree(at)
		os.makedirs(at)

# convert svg to png
def svg2png(svg,png,w,h):
	execute("inkscape","--without-gui","-w",str(w),"-h",str(h),"-f",os.getcwd()+"/"+svg,"-e",os.getcwd()+"/"+png)

# get seconds
def timediff(st,en):
	d=en-st
	return "{:.6f}".format(d.seconds+d.microseconds/1000000)

# check current status
def check(type):
	result=[True]
	def ifFile(path):
		if not os.path.isfile(path): result[0]=False
	def ifDir(path):
		if not os.path.isdir(path): result[0]=False
	if type:
		b=check(False)
		if not b: return False
		args=[]
		for n in range(0,len(pairs)):
			x=pairs[n]
			args.append((f"../../Color-{x}/Icon.png",))
		quickThread(ifFile,args)
		return result[0]
	else:
		args=[("../../Resources",)]
		for n in range(0,len(pairs)):
			x=pairs[n]
			args.append((f"../../Color-{x}",))
		quickThread(ifDir,args)
		return result[0]

# build folders
def mkdirs():
	args=[("../../Resources",)]
	for n in range(0,len(pairs)):
		x=pairs[n]
		args.append((f"../../Color-{x}",))
	quickThread(os.mkdir,args)

# clean
def rmdirs():
	args=[("../../Resources",)]
	for n in range(0,len(pairs)):
		x=pairs[n]
		args.append((f"../../Color-{x}",))
	quickThread(shutil.rmtree,args)

# build images of colors
def images(full):
	if full: start=dto.now()

	if not check(False): full()
	else:

		cti=[]
		mv=[]

		def color2image(n):
			st=dto.now()

			x=pairs[n]
			t=x=="T"
			if not t:
				H=n%18*20
				S=(80,0)[n==18]
			pp=[]
			im=[]
			ic=[]
			for m in range(0,6):
				if t: pp.append((x,t,m,0,0))
				else: pp.append((x,t,m,H,S))
			for m in range(1,5):
				im.append((x,t,m))
			for m in range(0,10):
				ic.append((x,t,m))
			quickThread(composeSVG,pp)
			if os.path.exists(f".tmp/{x}.iconset"): shutil.rmtree(f".tmp/{x}.iconset")
			os.mkdir(f".tmp/{x}.iconset")
			quickThread(composeImage,im)
			quickThread(composeIconset,ic)
			quickThread(composeIcon,[(x,t,True),(x,t,False)])

			for m in range(0,5):
				mv.append((f".tmp/{x}{m}.svg",f"../../Color-{x}/{m}.svg"))
				if m>0: mv.append((f".tmp/{x}{m}.png",f"../../Color-{x}/{['','tileImage','apple-touch-icon','Icon','Card'][m]}.png"))
			mv.append((f".tmp/{x}.icns",f"../../Color-{x}/Icon.icns"))
			mv.append((f".tmp/{x}.ico",f"../../Color-{x}/Favicon.ico"))

			en=dto.now()
			print(f"{x} done: {timediff(st,en)} sec")
		def composeSVG(x,t,m,H,S):
			if t:
				p=(
					(0,""),
					(1,""),
					(0,"w"),
					(3,""),
					(0,"c"),
					(0,"s")
				)[m]
				exw(f".tmp/{x}{m}.svg",f"./T{p[0]}.php",p[1])
			else:
				exw(f".tmp/{x}{m}.svg",f"./X{m}.php",f"{H},{S}%")
			execute("./Parser.py","c",f".tmp/{x}{m}.svg",f".tmp/{x}{m}.svg")
		def composeImage(x,t,m):
			svg2png(f".tmp/{x}{0 if t and m%2 else m}.svg",f".tmp/{x}{m}.png",
				[0,144,180,192,1200][m],
				[0,144,180,192,630][m])
		def composeIconset(x,t,m):
			if m//2>1: i=0
			elif m//2==1 and not t: i=3
			else: i=5
			s=2**((m+(9,11)[m>3])//2)
			svg2png(f".tmp/{x}{i}.svg",f".tmp/{x}.iconset/icon_{s}x{s}{('','@2x')[m%2]}.png",s,s)
		def composeIcon(x,t,w):
			if w: execute("iconutil","-c","icns","-o",f".tmp/{x}.icns",f".tmp/{x}.iconset")
			else: execute(*(["png2ico",f".tmp/{x}.ico",f".tmp/{x}.iconset/icon_128x128.png",f".tmp/{x}.iconset/icon_32x32@2x.png",f".tmp/{x}.iconset/icon_32x32.png"]+([] if t else [f".tmp/{x}.iconset/icon_16x16.png"])))

		print("Building images")
		mkdir(".tmp")
		for n in range(0,len(pairs)): cti.append((n,))
		quickThread(color2image,cti)
		quickThread(shutil.move,mv)
		shutil.rmtree(".tmp")

		if full:
			end=dto.now()
			print(f"done: {timediff(start,end)} sec")

# build pages of colors
def pages(full):
	if full: start=dto.now()

	if not check(True): full()
	else:

		p=[]
		cp=[]
		mv=[]

		def makeFlower(t):
			exw(f".tmp/{t}flower.svg",f"./{t}flower.php")
		def color2page(n):
			st=dto.now()

			x=pairs[n]
			t=x=="T"
			if t:
				H=0
				S=0
				s=0
				hs=""
				hex="#FFFFFF"
				mask="#000000"
				desc="A~Sの全色混交"
			else:
				H=n%18*20
				S=(0.8,0)[n==18]
				s="{:.0f}".format(S*100)
				hs=f"{H},{s}%"
				L=0.5
				hex=execute(f"./HSL2Hex.swift",str(H),str(S),str(L))
				mask=hex
				desc=("",f"H={H}°, ")[S>0]+f"S{('=','>')[S>0]}0"
			desc=f"Color {x} ({desc}) のサンプルです"
			quickThread(exw,[
				(f".tmp/{x}.html","./draft.php",x,hex,mask,desc,hs),
				(f".tmp/{x}offline.html","./offline.php",x,hex,mask,hs),
				(f".tmp/{x}manifest.json","./manifest.php",x,hex,desc)
			])
			quickThread(execute,[
				("./Parser.py","c",f".tmp/{x}.html",f".tmp/{x}.html"),
				("./Parser.py","c",f".tmp/{x}offline.html",f".tmp/{x}offline.html"),
			])
			mv.append((f".tmp/{x}.html",f"../../Color-{x}/index.html"))
			mv.append((f".tmp/{x}offline.html",f"../../Color-{x}/offline.html"))
			mv.append((f".tmp/{x}manifest.json",f"../../Color-{x}/manifest.json"))

			en=dto.now()
			print(f"{x} done: {timediff(st,en)} sec")
		def copyRes(f):
			execute("./Parser.py","c",f,f".tmp/{f}")
			mv.append((f".tmp/{f}",f"../../Resources/{f}"))

		print("Building pages")
		mkdir(".tmp")

		for n in range(0,len(pairs)): p+=[(n,)]
		for f in ["Black.svg","Xstyle.css","Xscript.js","Tstyle.css","Tscript.js"]: cp+=[(f,)]

		print("building...")
		for t in quickThread(makeFlower,[("X",),("T",)])+quickThread(copyRes,cp): t.join()
		quickThread(color2page,p)
		quickThread(shutil.move,mv)
		shutil.rmtree(".tmp")

		if full:
			end=dto.now()
			print(f"done: {timediff(start,end)} sec")

# clean and build whole resource
def full():
	print("Clean up")
	rmdirs()
	print("Create build folders")
	mkdirs()
	images(True)
	pages(True)

if not os.path.islink("inkscape"):
	execute("./Preparation.sh")
	if not os.path.islink("inkscape"):
		exit(1)

checktime=True

if arg=="pairs":
	checktime=False
	print(pairs)
elif arg=="images": images(False)
elif arg=="pages": pages(False)
elif arg=="full": full()
else:
	checktime=False
	print("Unknown argument: "+arg)

if checktime:
	end=dto.now()
	print(f"All done: {timediff(start,end)} sec")
