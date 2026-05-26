import { useEffect, useRef } from "react";

export default function BalloonBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

   const context = canvas.getContext("2d");

if (!context) return;

const ctx: CanvasRenderingContext2D = context;

    let balloons: Balloon[] = [];
    let particles: Particle[] = [];

    const mouse = {
      x: -9999,
      y: -9999,
    };

    const balloonCount = 30;

    const colors = [
      { base: "#ff0055", light: "#ff5c93", dark: "#8f002f" },
      { base: "#00cfff", light: "#76ecff", dark: "#00627a" },
      { base: "#ffd000", light: "#fff27a", dark: "#8f7300" },
      { base: "#00e676", light: "#82ffc0", dark: "#007d43" },
      { base: "#ff9db5", light: "#ffd2de", dark: "#b95c73" },
      { base: "#a855f7", light: "#d8a4ff", dark: "#5b21b6" },
    ];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity = 1;
      color: string;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 4 + 1;
        this.speedX = (Math.random() - 0.5) * 10;
        this.speedY = (Math.random() - 0.5) * 10;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.03;
      }

      draw() {
        ctx.save();

        ctx.globalAlpha = this.opacity;

        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    class Balloon {
      x = 0;
      y = 0;
      r = 0;
      speed = 0;
      angle = 0;
      wobbleSpeed = 0;
      colorSet = colors[0];
      popped = false;

      constructor(first = true) {
        this.init(first);
      }

      init(firstLoad: boolean) {
        this.r = Math.random() * 20 + 30;

        this.x = Math.random() * (canvas?.width || 800);

        this.y = firstLoad
          ? Math.random() * (canvas?.height || 600)
          : (canvas?.height || 600) + 300;

        this.colorSet =
          colors[Math.floor(Math.random() * colors.length)];

        this.speed = Math.random() * 1 + 0.4;

        this.angle = Math.random() * Math.PI * 2;

        this.wobbleSpeed = Math.random() * 0.02 + 0.01;

        this.popped = false;
      }

      pop() {
        if (this.popped) return;

        this.popped = true;

        for (let i = 0; i < 20; i++) {
          particles.push(
            new Particle(
              this.x,
              this.y,
              this.colorSet.base
            )
          );
        }

        setTimeout(() => {
          this.init(false);
        }, 1200);
      }

      drawString() {
        ctx.beginPath();

        ctx.moveTo(this.x, this.y + this.r);

        ctx.quadraticCurveTo(
          this.x + Math.sin(this.angle) * 20,
          this.y + this.r + 50,
          this.x,
          this.y + this.r + 130
        );

        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 1.2;

        ctx.stroke();
      }

      drawBalloon() {
        ctx.save();

        ctx.translate(this.x, this.y);

        ctx.rotate(Math.sin(this.angle) * 0.05);

        const gradient = ctx.createRadialGradient(
          -this.r * 0.3,
          -this.r * 0.5,
          this.r * 0.2,
          0,
          0,
          this.r * 1.4
        );

        gradient.addColorStop(0, this.colorSet.light);
        gradient.addColorStop(0.5, this.colorSet.base);
        gradient.addColorStop(1, this.colorSet.dark);

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.moveTo(0, this.r);

        ctx.bezierCurveTo(
          -this.r * 1.1,
          this.r * 0.8,
          -this.r * 1.2,
          -this.r * 1.2,
          0,
          -this.r * 1.2
        );

        ctx.bezierCurveTo(
          this.r * 1.2,
          -this.r * 1.2,
          this.r * 1.1,
          this.r * 0.8,
          0,
          this.r
        );

        ctx.closePath();

        ctx.fill();

        // glossy highlight
        ctx.beginPath();

        ctx.fillStyle = "rgba(255,255,255,0.25)";

        ctx.arc(
          -this.r * 0.3,
          -this.r * 0.5,
          this.r * 0.25,
          0,
          Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
      }

      update() {
        if (this.popped) return;

        this.y -= this.speed;

        this.angle += this.wobbleSpeed;

        this.x += Math.sin(this.angle) * 0.7;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;

        if (Math.sqrt(dx * dx + dy * dy) < this.r) {
          this.pop();
        }

        if (this.y < -200) {
          this.init(false);
        }

        this.drawString();
        this.drawBalloon();
      }
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      balloons = [];

      for (let i = 0; i < balloonCount; i++) {
        balloons.push(new Balloon(true));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter(
        (particle) => particle.opacity > 0
      );

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      balloons.forEach((balloon) => {
        balloon.update();
      });

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
      />
    </div>
  );
}