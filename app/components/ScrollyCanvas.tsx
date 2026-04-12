"use client";

import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_COUNT = 120;
const IMAGES_DIR = "/sequence/";
const IMAGE_LOAD_TIMEOUT = 60000; // 60 seconds timeout per image (increased for Vercel)
const MAX_RETRIES = 3; // Retry failed frames

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
        let loadedCount = 0;
        let failedCount = 0;
        const imgArray: HTMLImageElement[] = [];
        const timeouts: NodeJS.Timeout[] = [];
        const retryAttempts: Record<number, number> = {};

        const loadImage = (i: number, attempt: number = 0) => {
            const img = new Image();
            img.src = `${IMAGES_DIR}frame_${i.toString().padStart(3, "0")}.png?t=${Date.now()}`;

            // Set timeout for each image
            const timeout = setTimeout(() => {
                if (!img.complete && (retryAttempts[i] ?? 0) < MAX_RETRIES) {
                    retryAttempts[i] = (retryAttempts[i] ?? 0) + 1;
                    console.warn(`Image ${i} timeout, retrying... (attempt ${retryAttempts[i]})`);
                    loadImage(i, retryAttempts[i]);
                } else if (!img.complete) {
                    failedCount++;
                    checkLoadComplete();
                }
            }, IMAGE_LOAD_TIMEOUT);

            const checkLoadComplete = () => {
                const totalProcessed = loadedCount + failedCount;
                setLoadProgress(Math.round((totalProcessed / FRAME_COUNT) * 100));

                if (totalProcessed === FRAME_COUNT) {
                    if (failedCount > 0) {
                        setError(`${failedCount} frame(s) failed to load. Canvas may not animate smoothly.`);
                        setAllLoaded(true); // Allow viewing despite errors
                    } else {
                        setAllLoaded(true);
                        setError(null);
                    }
                }
            };

            img.onload = () => {
                clearTimeout(timeout);
                if (attempt === 0 || !imgArray[i]) {
                    imgArray[i] = img;
                }
                loadedCount++;
                checkLoadComplete();
            };

            img.onerror = () => {
                clearTimeout(timeout);
                if ((retryAttempts[i] ?? 0) < MAX_RETRIES) {
                    retryAttempts[i] = (retryAttempts[i] ?? 0) + 1;
                    console.warn(`Image ${i} error, retrying... (attempt ${retryAttempts[i]})`);
                    loadImage(i, retryAttempts[i]);
                } else {
                    failedCount++;
                    console.error(`Image ${i} failed after ${MAX_RETRIES} retries`);
                    checkLoadComplete();
                }
            };

            if (attempt === 0) {
                imgArray[i] = img;
            }
            timeouts.push(timeout);
        };

        for (let i = 0; i < FRAME_COUNT; i++) {
            loadImage(i);
        }

        setImages(imgArray);

        // Cleanup timeouts on unmount
        return () => {
            timeouts.forEach(timeout => clearTimeout(timeout));
        };
    }, []);

    const lastDimensionsRef = useRef({ width: 0, height: 0 });

    const renderFrame = useCallback((index: number) => {
        if (typeof window === "undefined") return;

        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = images[index];
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
        if (!allLoaded) return;
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
