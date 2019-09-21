#! /usr/bin/env ruby

require "FileUtils"

Dir.chdir(__dir__+"/Resources")

$option={
	image:false,
	favicon:true,
	icns:true,
	online:true,
	offline:true,
	compress:true
}

def switcher
	$receiver=""
	for n in 0..(ARGV.length-1) do
		case ARGV[n]
			when "-image" then
				$option[:image]=true
			when "-no-favicon" then
				$option[:favicon]=false
			when "-no-icns" then
				$option[:icns]=false
			when "-no-online" then
				$option[:online]=false
			when "-no-offline" then
				$option[:offline]=false
			when "-no-compress" then
				$option[:compress]=false
		end
	end
	if $option[:image] then
		image
	else
		main
	end
end

def assign(target,var,text)
	re=/(\t*)replacement-#{var}/
	lines=text.split("\n")
	mt=target.scan(re)
	mt.each do |m|
		rt=lines.map{|l| m[0]+l}.join("\n")
		target=target.sub(re,rt)
	end
	target
end

def check(n)
	(n==0&&$option[:online])||(n==1&&$option[:offline])||(n==2)
end

def hslToHex(t)
	hsl=t.scan(/^hsl\(([0-9]+),([0-9]+)%,([0-9]+)%\)$/)[0]
	h=hsl[0].to_i
	s=hsl[1].to_i/100
	l=hsl[2].to_i/100
	min=l*(1-s)+[0,l*2-1].max*s
	max=l*(1-s)+[1,l*2].min*s
	if h<60 then
		rgb=[1,h/60,0]
	elsif h<120 then
		rgb=[(120-h)/60,1,0]
	elsif h<180 then
		rgb=[0,1,(h-120)/60]
	elsif h<240 then
		rgb=[0,(240-h)/60,1]
	elsif h<300 then
		rgb=[(h-240)/60,0,1]
	elsif h<360 then
		rgb=[1,0,(360-h)/60]
	end
	3.times do |n|
		rgb[n]=rgb[n]*(max-min)+min
	end
	"#"+rgb.map{|v| sprintf("%.2X",(v*255).round)}.join("")
end

def cname(n)
	(n+10).to_s(36).upcase
end

def hue(n)
	if n<19 then
		"#{n*20%360},#{n<18 ? 80 : 0}%"
	else
		""
	end
end

def load(path)
	io=File.open(path,"r")
	data=io.read
	io.close
	data
end

def save(path,data)
	io=File.open(path,"w")
	io.write(data)
	io.close
end

def run(procs)
	procs.map{|proc| Thread.new{proc.call}}.each{|t| t.join}
	procs.clear
end

def main
	Dir.mkdir("/tmp/Color")

	# create variables
	source=[nil,nil]
	offline=[nil,nil,nil]
	manifest=nil
	cursor=[nil,nil]
	style=[nil,nil,nil,nil]
	script=[nil,nil,nil]
	flower=[nil,nil]

	# save resources to the destinations
	$pr4=[]
	def add(src,dst,cp,compress)
		if $option[:compress]&&compress then
			$pr4.push(Proc.new{`./Parser c #{src} #{dst}`})
		elsif cp then
			$pr4.push(Proc.new{FileUtils.cp(src,dst)})
		else
			$pr4.push(Proc.new{FileUtils.mv(src,dst)})
		end
	end

	# load resources
	pr1=[
		Proc.new{
			w=["Online","Offline"]
			draft=nil
			vc=nil

			pr1=[
				Proc.new{draft=load("draft.html")},
				Proc.new{vc=load("viewController.html")}
			]

			pr2=[]
			2.times {|n| pr2.push(Proc.new{
				if check(n) then
					d=w[n]
					text=draft
					text=assign(text,"header",load("header#{d}.html"))
					text=assign(text,"alternate",`./alternate#{d}.php`)
					text=assign(text,"embeds",load("embeds#{d}.html"))
					text=assign(text,"viewController",vc)
					source[n]=text
				end
			})}

			run(pr1)
			run(pr2)
		},
		Proc.new{manifest=load("manifest.json")},
		Proc.new{cursor[0]=load("cursorDefault.svg")},
		Proc.new{cursor[1]=load("cursorPointer.svg")},
		Proc.new{style[3]=load("styleXSpecific.css")},
		Proc.new{flower[0]=`./image.php 18 embed`},
		Proc.new{flower[1]=`./image.php 19 embed`},
		Proc.new{
			`./silhouette.php > /tmp/Color/silhouette.svg`
			if $option[:compress] then
				`./Parser c /tmp/Color/silhouette.svg /tmp/Color/silhouette.svg`
			end
		}
	]
	if $option[:online] then
		[
			"style.css","styleX.css","styleT.css",
			"script.js","scriptX.js","scriptT.js"
		].each do |f|
			add(f,"../../Resources/#{f}",true,true)
		end
		add("/tmp/Color/silhouette.svg","../../Resources/silhouette.svg",false,true)
	end
	if $option[:offline] then
		pr1.push(
			Proc.new{offline[0]=load("offline.html")},
			Proc.new{offline[1]=load("offlineX.css")},
			Proc.new{offline[2]=load("offlineT.css")},
			Proc.new{style[0]=load("style.css")},
			Proc.new{style[1]=load("styleX.css")},
			Proc.new{style[2]=load("styleT.css")},
			Proc.new{script[0]=load("script.js")},
			Proc.new{script[1]=load("scriptX.js")},
			Proc.new{script[2]=load("scriptT.js")}
		)
	end

	# assemble
	pr2=[]
	pr3=[]
	fn=["index.html","offline.html","manifest.json"]
	20.times do |un|
		pr2.push(Proc.new{
			c=cname(un)
			h=hue(un)
			if un<19 then
				x=hslToHex("hsl(#{h},50%)")
				desc="S#{un<18 ? ">" : "="}0"
				if un<18 then
					desc="H=#{un*20}°"+desc
				end
			else
				x="#333333"
				desc="A~S全色混交"
			end
			desc="Color #{c} (#{desc}) のサンプルです"
			src=[source[0],source[1],manifest]
			ss=""
			if un<19 then
				save("/tmp/Color/#{c}cd.svg",cursor[0].gsub("$hue",h))
				save("/tmp/Color/#{c}cp.svg",cursor[1].gsub("$hue",h))
				ss=style[3].sub("$hue",h).sub("$default",`./Parser bc /tmp/Color/#{c}cd.svg`).sub("$pointer",`./Parser bc /tmp/Color/#{c}cp.svg`)
			end
			3.times do |n|
				if check(n) then
					pr3.push(Proc.new{
						s=src[n].gsub("$name","Color #{c}").gsub("$shortName",c).gsub("$color",x).gsub("$description",desc).gsub("$canonical","https://akimikimikimikimikimikimika.github.io/Color/Color-#{c}/")
						if n<2 then
							s=assign(s,"flower",flower[un<19?0:1])
						end
						if n==0 then
							m=un<19 ? "X" : "T"
							s=assign(s,"styleSpecific","../Resources/style#{m}.css")
							s=assign(s,"scriptSpecific","../Resources/script#{m}.js")
							s=assign(s,"styleXSpecific",un<19 ? '<link rel="stylesheet" type="text/css" href="specific.css" />' : "")
							if un<19 then
								save("/tmp/Color/#{c}ss.css",ss)
								add("/tmp/Color/#{c}ss.css","../../Color-#{c}/specific.css",false,true)
							end
						elsif n==1 then
							s=assign(s,"styleEmbedded",style[0]+"\n"+style[un<19?1:2]+"\n"+ss)
							s=assign(s,"scriptEmbedded",script[0]+"\n"+script[un<19?1:2])
							s=s.sub("$icon",`./Parser b ../../Color-#{c}/Icon.png`).sub("$apple-touch-icon",`./Parser b ../../Color-#{c}/mini.png`)
							save("/tmp/Color/#{c}offline.html",s)
							s=assign(offline[0],"offlineStyle",offline[un<19 ? 1 : 2]).gsub("$name","Color #{c}").gsub("$color",x).gsub("$hue",h).sub("$url",`./Parser #{$option[:compress] ? "bc" : "b"} /tmp/Color/#{c}offline.html`)
						end
						save("/tmp/Color/"+c+fn[n],s)
						add("/tmp/Color/"+c+fn[n],"../../Color-#{c}/"+fn[n],false,true)
					})
				end
			end
		})
	end

	run(pr1)
	run(pr2)
	run(pr3)
	run($pr4)

	FileUtils.rm_rf("/tmp/Color")
end

def image
	Dir.mkdir("/tmp/Color")

	pr1=[]
	pr2=[]
	pr3=[]
	ml=[
		["0.svg","0.svg"],["1.svg","1.svg"],
		["icon.png","Icon.png"],["touch-icon.png","apple-touch-icon.png"],
		["tileImage.png","tileImage.png"],["card.png","Card.png"],["mini.png","mini.png"]
	]
	if $option[:icns] then
		ml.push(["0.icns","0.icns"],["1.icns","1.icns"])
	end
	if $option[:favicon] then
		ml.push(["favicon.png","Favicon.png"])
	end
	20.times do |un|
		c=cname(un)
		pr1.push(Proc.new{
			`./image.php #{un} > /tmp/Color/#{c}0.svg`
			FileUtils.cp("/tmp/Color/#{c}0.svg","/tmp/Color/#{c}icon.svg")
		})
		pr1.push(Proc.new{`./image.php #{un} white > /tmp/Color/#{c}1.svg`})
		if $option[:favicon] then
			pr1.push(Proc.new{`./image.php #{un} no-margin > /tmp/Color/#{c}favicon.svg`})
		end
		pr1.push(Proc.new{`./image.php #{un} no-margin white > /tmp/Color/#{c}tileImage.svg`})
		pr1.push(Proc.new{`./mini.php #{un} > /tmp/Color/#{c}mini.svg`})
		if un<19 then
			pr1.push(Proc.new{`./image.php #{un} background white > /tmp/Color/#{c}touch-icon.svg`})
			pr1.push(Proc.new{`./image.php #{un} background white card > /tmp/Color/#{c}card.svg`})
		end
		pr2.push(Proc.new{
			if $option[:compress] then
				`./Parser c /tmp/Color/#{c}0.svg /tmp/Color/#{c}0.svg`
				`./Parser c /tmp/Color/#{c}1.svg /tmp/Color/#{c}1.svg`
			end
			if $option[:icns] then
				`svg2icns /tmp/Color/#{c}0.svg -o /tmp/Color/#{c}0.icns`
				`svg2icns /tmp/Color/#{c}1.svg -o /tmp/Color/#{c}1.icns`
			end
			`svg2png /tmp/Color/#{c}icon.svg -o /tmp/Color/#{c}icon.png -w 192 -h 192`
			if $option[:favicon] then
				`svg2png /tmp/Color/#{c}favicon.svg -o /tmp/Color/#{c}favicon.png -w 64 -h 64`
			end
			`svg2png #{un<19 ? "/tmp/Color/#{c}touch-icon" : "vividSquare"}.svg -o /tmp/Color/#{c}touch-icon.png -w 216 -h 216`
			`svg2png #{un<19 ? "/tmp/Color/#{c}card" : "vividCard"}.svg -o /tmp/Color/#{c}card.png -w 1200 -h 630`
			`svg2png /tmp/Color/#{c}tileImage.svg -o /tmp/Color/#{c}tileImage.png -w 144 -h 144`
			`svg2png /tmp/Color/#{c}mini.svg -o /tmp/Color/#{c}mini.png -w 1 -h 1`
		})
		ml.each do |p|
			pr3.push(Proc.new{FileUtils.mv("/tmp/Color/#{c}#{p[0]}","../../Color-#{c}/#{p[1]}")})
		end
	end

	run(pr1)
	run(pr2)
	run(pr3)

	FileUtils.rm_rf("/tmp/Color")
end

switcher