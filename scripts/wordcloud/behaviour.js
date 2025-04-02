// // wordcloud/behaviour.js

// // initialize canvas
// const canvas = document.querySelector("#scene"),
//     ctx = canvas.getContext("2d"),
//     particles = [],
//     amount = 0,
//     mouse = {x:0, y:0};
//     radius = 1;

// const colors = ["#468966","#FFF0A5", "#FFB03B","#B64926", "#8E2800"];

// const ww = canvas.width = window.innerWidth;
// const wh = canvas.height = window.innerHeight;

// let target = {x: ww/2, y: wh/2};

// // particle constructor 
// function Particle(x, y, text) {
//     this.x =  Math.random()*ww;
//     this.y =  Math.random()*wh;

//     this.dest = {
//       x : target.x,
//       y: target.y
//     };

//     this.r =  Math.random()*5 + 2;
//     this.vx = (Math.random()-0.5)*20;
//     this.vy = (Math.random()-0.5)*20;
//     this.accX = 0;
//     this.accY = 0;
//     this.friction = 0.9 + Math.random() * 0.03;
  
//     this.color = colors[Math.floor(Math.random()*6)];
//     this.text = text || "";
// }

// Particle.prototype.render = function () {
//     for (let j=0; j < particles.length; j++) {
//         let pTemp = particles[j];
//         if (pTemp === this) continue;

//         // Movement vector components
//         let dx = this.x - pTemp.x;
//         let dy = this.y - pTemp.y;

//         // Vector distance
//         let dist = Math.sqrt(dx*dx + dy*dy);    
//         let minDist = (this.r + pTemp.r) *3;    // Minimum distance of particles next to e/o

//         if (dist < minDist && dist > 0) {
//             let force = (minDist - dist) / dist;    // strength of repulsive force
//             this.vx += dx * force * 0.05;
//             this.vy += dy * force * 0.05;
//         }
//     }

//     // applying movement to particles
//     this.accX = (this.dest.x - this.x)/1000;
//     this.accY = (this.dest.y - this.y)/1000;
//     this.vx += this.accX;
//     this.vy += this.accY;
//     this.vx *= this.friction;
//     this.vy *= this.friction;
  
//     this.x += this.vx;
//     this.y +=  this.vy;

//     // Rendering text
//     ctx.fillStyle = this.color;
//     ctx.font = `${this.r * 4}px sans-serif`;
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillText(this.text, this.x, this.y);

//     var a = this.x - mouse.x;
//     var b = this.y - mouse.y;

//     var distance = Math.sqrt( a*a + b*b );
//     if(distance<(radius*10)){
//       this.accX = (this.x - mouse.x)/5;
//       this.accY = (this.y - mouse.y)/5;
//       this.vx += this.accX;
//       this.vy += this.accY;
//     }  
// }

// function onMouseMove(e){
//     mouse.x = e.clientX;
//     mouse.y = e.clientY;
//   }
  
// function onTouchMove(e){
//     if(e.touches.length > 0 ){
//         mouse.x = e.touches[0].clientX;
//         mouse.y = e.touches[0].clientY;
//     }
// }

// function onTouchEnd(e){
//     mouse.x = -9999;
//     mouse.y = -9999;
// }

// const wordList = [
//     "JavaScript", "Canvas", "Particles", "Repel", "Cluster",
//     "Motion", "React", "HTML", "CSS", "Node.js", "WebGL"
// ];

// function initScene() {
//     ww = canvas.width = window.innerWidth;
//     wh = canvas.height = window.innerHeight;

//     particles = [];
//     for (let i = 0; i < wordList.length; i++) {
//         let p = new Particle(
//         Math.random() * ww,
//         Math.random() * wh,
//         wordList[i]
//         );
//         p.dest = { x: target.x, y: target.y }; // All particles go here
//         particles.push(p);
//     }
//     amount = particles.length;
// }
  
// function onMouseClick(){
//     radius++;
//     if(radius ===5){
//         radius = 0;
//     }
// }

// function render(a) {
//     requestAnimationFrame(render);
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     for (var i = 0; i < amount; i++) {
//         particles[i].render();
//     }
// };

// copy.addEventListener("keyup", initScene);
// window.addEventListener("resize", initScene);
// window.addEventListener("mousemove", onMouseMove);
// window.addEventListener("touchmove", onTouchMove);
// window.addEventListener("click", onMouseClick);
// window.addEventListener("touchend", onTouchEnd);

// export function startScene() {
//     initScene();
//     requestAnimationFrame(render);
// }