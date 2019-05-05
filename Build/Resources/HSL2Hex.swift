#! /usr/bin/swift

import Foundation
import AppKit

let args = CommandLine.arguments

var H:Double=0,S:Double=0,L:Double=0
switch args.count {
	case 4:
		L=Double(args[3]) ?? 0
		fallthrough
	case 3:
		S=Double(args[2]) ?? 0
		fallthrough
	case 2:
		H=Double(args[1]) ?? 0
	default:Void()
}

let h=H/360
let m=S*(1-abs(2*L-1))
let v=m/2+L
let s=m/v
let c=NSColor(hue: CGFloat(h), saturation: CGFloat(s), brightness: CGFloat(v), alpha: 1)

func RGBtoHex(_ c:CGFloat) -> String {
	let s=String(Int(round(Double(c)*255)), radix:16)
	return s.count==1 ? ("0"+s) : s
}

let hex=("#"+RGBtoHex(c.redComponent)+RGBtoHex(c.greenComponent)+RGBtoHex(c.blueComponent)).uppercased()
print(hex)