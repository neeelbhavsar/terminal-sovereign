"use client";

import { useEffect, useRef, useState } from "react";

const CODE_LINES = [
    "const express = require('express');",
    "import { Injectable } from '@nestjs/common';",
    "async function connectDB(): Promise<void> {",
    "  await mongoose.connect(process.env.MONGO_URI);",
    "}",
    "router.get('/api/users', auth, async (req, res) => {",
    "  const users = await User.find().lean();",
    "  res.json({ success: true, data: users });",
    "});",
    "const redis = new Redis({ host: 'localhost', port: 6379 });",
    "await redis.set('session:' + id, token, 'EX', 3600);",
    "const payload = jwt.verify(token, process.env.JWT_SECRET);",
    "io.on('connection', (socket) => {",
    "  socket.join(`room:${roomId}`);",
    "  socket.emit('connected', { userId });",
    "});",
    "const { rows } = await pool.query(",
    "  'SELECT * FROM orders WHERE user_id = $1', [id]",
    ");",
    "@Controller('auth')",
    "export class AuthController {",
    "  @Post('login')",
    "  async login(@Body() dto: LoginDto) {",
    "    return this.authService.login(dto);",
    "  }",
    "}",
    "await stripe.paymentIntents.create({",
    "  amount: total * 100, currency: 'usd',",
    "});",
    "const s3 = new AWS.S3({ region: 'us-east-1' });",
    "await s3.upload({ Bucket, Key, Body }).promise();",
    "SELECT u.name, COUNT(o.id) as orders",
    "FROM users u LEFT JOIN orders o ON u.id = o.user_id",
    "GROUP BY u.id HAVING COUNT(o.id) > 5;",
    "const hash = await bcrypt.hash(password, 12);",
    "if (!await bcrypt.compare(pass, user.hash)) {",
    "  throw new UnauthorizedException();",
    "}",
    "MATCH (u:User)-[:FOLLOWS]->(f:User)",
    "WHERE u.id = $id RETURN f.name, f.email;",
    "const limiter = rateLimit({ windowMs: 900000, max: 100 });",
    "app.use('/api/', limiter);",
];

export default function CodeRainBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;

        // Column state
        interface Col {
            x: number;
            y: number;
            lineIdx: number;
            charIdx: number;
            speed: number;
            alpha: number;
            size: number;
        }

        let cols: Col[] = [];

        const setup = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            cols = [];
            const count = Math.max(6, Math.floor(canvas.width / 180));
            for (let i = 0; i < count; i++) {
                cols.push({
                    x: (canvas.width / count) * i + Math.random() * 60 - 30,
                    y: Math.random() * -canvas.height * 1.5,
                    lineIdx: Math.floor(Math.random() * CODE_LINES.length),
                    charIdx: 0,
                    speed: 0.25 + Math.random() * 0.5,
                    alpha: 0.12 + Math.random() * 0.18,  // much more visible: 12-30%
                    size: 11 + Math.floor(Math.random() * 2),
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const col of cols) {
                const line = CODE_LINES[col.lineIdx];
                ctx.font = `${col.size}px 'JetBrains Mono', 'Courier New', monospace`;

                let xOff = 0;
                for (let ci = 0; ci < line.length; ci++) {
                    if (ci > col.charIdx) break;
                    const isCurrent = ci === Math.floor(col.charIdx);
                    // Current char is brightest, rest fade slightly
                    const a = isCurrent ? Math.min(col.alpha * 2.2, 0.65) : col.alpha;
                    ctx.fillStyle = `rgba(167,139,250,${a})`;
                    ctx.fillText(line[ci], col.x + xOff, col.y);
                    xOff += ctx.measureText(line[ci]).width;
                }

                col.charIdx += col.speed;

                if (col.charIdx >= line.length) {
                    col.charIdx = 0;
                    col.y += col.size * 1.6;
                    col.lineIdx = (col.lineIdx + 1) % CODE_LINES.length;
                }

                if (col.y > canvas.height + 60) {
                    col.y = -40 - Math.random() * 300;
                    col.charIdx = 0;
                    col.lineIdx = Math.floor(Math.random() * CODE_LINES.length);
                    col.alpha = 0.12 + Math.random() * 0.18;
                }
            }

            animId = requestAnimationFrame(draw);
        };

        setup();
        draw();

        const onResize = () => setup();
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", onResize);
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
            style={{ zIndex: 1 }}
        />
    );
}
