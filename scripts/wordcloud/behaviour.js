// // wordcloud/behaviour.js

// // initialize canvas
// let canvas = document.querySelector("#scene"),
//     ctx = canvas.getContext("2d"),
//     particles = [],
//     amount = 0,
//     mouse = {x:0, y:0},
//     radius = 1;

// let colors = ["#468966","#FFF0A5", "#FFB03B","#B64926", "#8E2800"];

// const rect = canvas.getBoundingClientRect();
// let ww = canvas.width = rect.width;
// let wh = canvas.height = rect.height;

// let target = { x: ww / 2, y: wh / 2 };

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
//     const rect = canvas.getBoundingClientRect();
//     ww = canvas.width = rect.width;
//     wh = canvas.height = rect.height;

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


// window.addEventListener("resize", initScene);
// window.addEventListener("mousemove", onMouseMove);
// window.addEventListener("touchmove", onTouchMove);
// window.addEventListener("click", onMouseClick);
// window.addEventListener("touchend", onTouchEnd);

// export function startScene() {
//     initScene();
//     requestAnimationFrame(render);
// }


const mouse = {x:0, y:0};
const particles = [];
let physicsEnabled = true;

// capture mouse position
export function trackMouse() {
    const container = document.querySelector(".wordcloud");
  
    window.addEventListener("mousemove", e => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
  }
  

// Particle animation loop
export function animateParticles() {
    particles.forEach(p => {
        const rect = p.el.getBoundingClientRect();

        const dx = p.x + p.el.offsetWidth / 2 - mouse.x;
        const dy = p.y + p.el.offsetHeight / 2 - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let repelRadius = Math.max(rect.width, rect.height) * 3;
        if (!physicsEnabled) {
            repelRadius = Math.max(rect.width, rect.height) * 0.1;
        }

        if (dist < repelRadius) {
        const angle = Math.atan2(dy, dx);
        const repelStrength = 1 - dist / repelRadius;
        const repelForce = repelStrength * 8;

        // Push directly away from the mouse
        const repelX = Math.cos(angle) * repelForce;
        const repelY = Math.sin(angle) * repelForce;

        // Predict new position
        const nextX = p.x + repelX;
        const nextY = p.y + repelY;
        const mouseDistNext = Math.sqrt((nextX - mouse.x) ** 2 + (nextY - mouse.y) ** 2);

        // Only apply repel if it moves away from the mouse
        if (mouseDistNext > dist) {
            p.vx += repelX;
            p.vy += repelY;
        } else {
            // otherwise gently hold it where it is (prevents jittering)
            p.vx *= 0.95;
            p.vy *= 0.95;
        }
        }

        // Attract back to original position
        const ax = (p.targetX - p.x) * 0.05;
        const ay = (p.targetY - p.y) * 0.05;
        p.vx += ax;
        p.vy += ay;

        p.vx *= 0.9;
        p.vy *= 0.9;

        p.x += p.vx;
        p.y += p.vy;

        p.el.style.left = `${p.x}px`;
        p.el.style.top = `${p.y}px`;
    });
  
    requestAnimationFrame(animateParticles);
  }

  // Call this after drawToDOM populates the particles list
export function registerParticle(el, startX, startY) {
    particles.push({
      el,
      x: startX,
      y: startY,
      vx: 0,
      vy: 0,
      targetX: startX,
      targetY: startY
    });
  } 
  
  export function clearParticles() {
    particles.length = 0;
  }
  
  export function togglePhysics(state) {
    physicsEnabled = state;
  }