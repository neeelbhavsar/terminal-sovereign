"use client";

import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_COUNT = 120;
const IMAGES_DIR = "/sequence/";
const CRITICAL_FRAMES = 30; // Load first 30 frames immediately (25% of animation)
const IMAGE_LOAD_TIMEOUT = 40000; // 40 seconds timeout per image
const MAX_RETRIES = 2; // Retry failed frames

interface ScrollyCanvasProps {
    scrollContainerRef: React.RefObject<HTMLElement>;
}

export default function ScrollyCanvas({ scrollContainerRef }: ScrollyCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [allLoaded, setAllLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const { scrollYProgress } = useScroll({
        target: scrollContainerRef,
        offset: ["start start", "end end"]
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    useEffect(() => {
        let criticalLoadedCount = 0;
        let totalLoadedCount = 0;
        let failedCount = 0;
        const imgArray: HTMLImageElement[] = [];
        const timeouts: NodeJS.Timeout[] = [];
        const retryAttempts: Record<number, number> = {};
        let autoStartTimer: NodeJS.Timeout | null = null;

        const loadImage = (i: number, attempt: number = 0) => {
            const img = new Image();
            img.src = `${IMAGES_DIR}frame_${i.toString().padStart(3, "0")}.png`;

            // Shorter timeout for critical frames, longer for others
            const timeout = i < CRITICAL_FRAMES ? 20000 : IMAGE_LOAD_TIMEOUT;

            // Set timeout for each image
            const timeoutId = setTimeout(() => {
                if (!img.complete && (retryAttempts[i] ?? 0) < MAX_RETRIES) {
                    retryAttempts[i] = (retryAttempts[i] ?? 0) + 1;
                    console.warn(`Frame ${i} timeout, retrying... (attempt ${retryAttempts[i]})`);
                    loadImage(i, retryAttempts[i]);
                } else if (!img.complete) {
                    failedCount++;
                    checkLoadComplete();
                }
            }, timeout);

            const checkLoadComplete = () => {
                const progressPercent = Math.round((totalLoadedCount / FRAME_COUNT) * 100);
                setLoadProgress(progressPercent);

                // Auto-start once critical frames (0-30) are loaded
                if (!autoStartTimer && criticalLoadedCount >= CRITICAL_FRAMES * 0.8) {
                    autoStartTimer = setTimeout(() => {
                        setAllLoaded(true);
                        console.log(`✓ Animation starting with ${criticalLoadedCount}/${CRITICAL_FRAMES} critical frames loaded`);
                    }, 500);
                }

                // Continue loading rest in background
                if (totalLoadedCount + failedCount === FRAME_COUNT) {
                    if (autoStartTimer) clearTimeout(autoStartTimer);
                    if (failedCount > 0) {
                        console.warn(`✓ Animation complete: ${totalLoadedCount} frames loaded, ${failedCount} failed`);
                    }
                }
            };

            img.onload = () => {
                clearTimeout(timeoutId);
                if (attempt === 0 || !imgArray[i]) {
                    imgArray[i] = img;
                }
                if (i < CRITICAL_FRAMES) criticalLoadedCount++;
                totalLoadedCount++;
                checkLoadComplete();
            };

            img.onerror = () => {
                clearTimeout(timeoutId);
                if ((retryAttempts[i] ?? 0) < MAX_RETRIES) {
                    retryAttempts[i] = (retryAttempts[i] ?? 0) + 1;
                    console.warn(`Frame ${i} error, retrying... (attempt ${retryAttempts[i]})`);
                    loadImage(i, retryAttempts[i]);
                } else {
                    failedCount++;
                    console.error(`Frame ${i} failed after ${MAX_RETRIES} retries`);
                    checkLoadComplete();
                }
            };

            if (attempt === 0) {
                imgArray[i] = img;
            }
            timeouts.push(timeoutId);
        };

        // Load critical frames immediately (0-30)
        console.log(`📦 Loading ${CRITICAL_FRAMES} critical frames...`);
        for (let i = 0; i < CRITICAL_FRAMES; i++) {
            loadImage(i);
        }

        // Load remaining frames in background after 1 second
        const backgroundLoadTimer = setTimeout(() => {
            console.log(`📦 Loading remaining ${FRAME_COUNT - CRITICAL_FRAMES} frames...`);
            for (let i = CRITICAL_FRAMES; i < FRAME_COUNT; i++) {
                loadImage(i);
            }
        }, 1000);

        setImages(imgArray);

        // Cleanup timeouts on unmount
        return () => {
            timeouts.forEach(timeout => clearTimeout(timeout));
            clearTimeout(backgroundLoadTimer);
            if (autoStartTimer) clearTimeout(autoStartTimer);
        };
    }, []);

    const lastDimensionsRef = useRef({ width: 0, height: 0 });

    const renderFrame = useCallback((index: number) => {
        if (typeof window === "undefined") return;

        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const clampedIndex = Math.max(0, Math.min(index, FRAME_COUNT - 1));
        let img = images[clampedIndex];

        // If current frame not loaded, find nearest loaded frame
        if (!img) {
            for (let i = clampedIndex; i >= 0; i--) {
                if (images[i]) {
                    img = images[i];
                    break;
                }
            }
        }

        if (!img) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        // Only update canvas size if dimensions changed (reduces reflows)
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            lastDimensionsRef.current = { width, height };
        }

        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }, [images]);

    useMotionValueEvent(frameIndex, "change", (latest) => {
        const index = Math.round(latest);
        renderFrame(index);
    });

    useEffect(() => {
        if (allLoaded) renderFrame(0);
    }, [allLoaded, renderFrame]);

    return (
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#121212]">
            {!allLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-50 bg-black/80 backdrop-blur-sm">
                    <div className="text-center">
                        <p className="font-mono text-sm mb-4 text-cyan-400">$ Loading Sequence...</p>

                        {/* Progress bar */}
                        <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                            <div
                                className="h-full bg-cyan-500 transition-all duration-300"
                                style={{ width: `${loadProgress}%` }}
                            />
                        </div>
                        <p className="font-mono text-xs text-gray-400">{loadProgress}% Complete</p>

                        {/* Error message */}
                        {error && (
                            <div className="mt-4 px-4 py-2 bg-red-900/30 border border-red-500 rounded text-red-300 text-xs max-w-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}
