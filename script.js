const canvas = document.querySelector("#circ")
const pathCanvas = document.querySelector("#path")
const ctx = canvas.getContext("2d")
const onresize = () => {
	canvas.setAttribute('width',window.innerWidth) 
canvas.setAttribute('height',window.innerHeight) 
ctx.font = "20px Arial"

}
window.onresize = onresize
let momentum = false

let w = 1
let dev = false

// Math.round = t => t.toFixed(2)

function drawArrow(x1, y1, x2, y2,def) {
    // a = 1
    const headLength = 10; // Okun başının uzunluğu
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    ctx.strokeStyle = def
    ctx.fillStyle = def
    
    // Çizgi
    ctx.beginPath();  
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Ok başı
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(x2, y2);
    ctx.fill();
}


let r = 100

let x = 0
let y = 0
let vx = 0
let vy = 0
let time = 0
let path = []
let mass = 1

const expandFactor = 40
let speedFactor = 100

let vxVector = null
let vyVector = null
let axVector = null
let ayVector = null
let wVector
const loop = () => {

	const prevX = x
	const prevY = y

	const prevVxVector = vxVector 
	const prevVyVector = vyVector 

	x=r*Math.cos(w*time*0.016)
	y=r*Math.sin(w*time*0.016)



	vxVector = (x-prevX) *expandFactor
	vyVector = (y-prevY) *expandFactor

	wVector = Math.acos((x-prevX)**2 + (y-prevY)**2)*expandFactor

	axVector = (vxVector - prevVxVector)*expandFactor
	ayVector = (vyVector - prevVyVector)*expandFactor

	// path .push( [x,y])
	time++

	ctx.clearRect(0,0,canvas.width,canvas.height)
	ctx.fillStyle = "white"
	ctx.fillRect(0,0,canvas.width,canvas.height)
	ctx.fillStyle = "black"

	ctx.save()
	ctx.translate(canvas.width/2,canvas.height/2)

	ctx.beginPath();
	ctx.arc(x, y, 10, 0, 2 * Math.PI);
	// ctx2.fillRect(x,y,1,1)
	ctx.fill();
	ctx.beginPath()
	ctx.arc(0,0,r,0,2*Math.PI)
	ctx.stroke()

	drawArrow(x,y,x+vxVector,y+vyVector, "blue")
	drawArrow(x,y,x+axVector*mass,y+ayVector*mass , "red")
	drawArrow(x,y,x+axVector,y+ayVector, "green")


	ctx.restore()
	ctx.fillText('Merkezcil Kuvvet : ' + Math.round(Math.sqrt(axVector**2 + ayVector**2)*mass) + " N", 20,40)
	ctx.fillText('Merkezcil İvme : ' + Math.round(Math.sqrt(axVector**2 + ayVector**2)) + " m/s²", 20,70)
	ctx.fillText('Kütle : ' + mass + " kg", 20,100)
	ctx.fillText('Yarıçap : ' + r + " m", 20,130)
	ctx.fillText('Çizgisel Hız : ' +Math.round( (vxVector**2 + vyVector**2)**0.5) + " m/s", 20,160)
	ctx.fillText('Açısal Hız : ' + w + " rad/s", 20,190)
	ctx.fillText('Frekans : ' + w / (2*Math.PI)+ " Hz", 20,220)
	ctx.fillText('Periyot : ' + (2*Math.PI)/w+ " s", 20,250)
	if(dev){

	ctx.fillText('Açısal Hız : ' + wVector*expandFactor + " rad/s", 20,200)
	ctx.fillText("F: " + mass * wVector**2  * r, 20 , 180)
	// if(p) ctx.fillText((mass * get(vxVector,vyVector)**2) / r, 20 , 180)
	}


	// requestöAnimationFrame(loop)
}

const get = (i,j) => Math.sqrt(i**2 + j**2)

setInterval(loop,1000/60)
// loop()

const vRange = document.querySelector('#velocity')
const rRange = document.querySelector('#radius')
const mRange = document.querySelector('#mass')

vRange.addEventListener('change' , e => w = (vRange.value))
mRange.addEventListener('input' , e => {
if(momentum) w = w * (mass/e.target.value)**2
mass = (e.target.value)
})
rRange.addEventListener('change' , e =>  {
	vxVector = null
	vyVector = null
	axVector = null
	ayVector = null

	if(momentum) w = w * (r/e.target.value)**2
	r = e.target.value
})



vRange.value = 1
rRange.value = r
mRange.value = mass
