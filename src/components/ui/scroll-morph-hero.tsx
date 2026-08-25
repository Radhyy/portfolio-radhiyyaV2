"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue, useScroll } from "framer-motion";

import { useLanguage } from "@/context/LanguageContext";

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    total: number;
    phase: AnimationPhase;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

const IMG_WIDTH = 75;
const IMG_HEIGHT = 105;

function FlipCard({
    src,
    index,
    target,
}: FlipCardProps) {
    return (
        <motion.div
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 45,
                damping: 18,
            }}
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            className="cursor-pointer group font-outfit"
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180 }}
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={src}
                        alt={`project-showcase-${index}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 transition-colors group-hover:bg-transparent" />
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-xl bg-slate-900 flex flex-col items-center justify-center p-2.5 border border-slate-700"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="text-center">
                        <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">Project</p>
                        <p className="text-xs font-semibold text-white leading-tight">View Detail</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

const TOTAL_IMAGES = 20;

const IMAGES = Array.from({ length: TOTAL_IMAGES }, (_, i) => `/motion/${i + 1}.png`);

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function ScrollMorphHero() {
    const { t } = useLanguage();
    const targetRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    // Morph progress: 0 -> 1 during initial scroll (0 -> 0.25)
    const morphProgress = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 80, damping: 25 });

    // Rotate arc cards during active scroll (0.25 -> 0.80)
    const scrollRotate = useTransform(scrollYProgress, [0.25, 0.80], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 80, damping: 25 });

    // Mouse parallax
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            mouseX.set(normalizedX * 80);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 400);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 1800);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    const scatterPositions = useMemo(() => {
        return IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 1400,
            y: (Math.random() - 0.5) * 900,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    }, []);

    const [morphValue, setMorphValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
        const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => {
            unsubscribeMorph();
            unsubscribeRotate();
            unsubscribeParallax();
        };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    const contentOpacity = useTransform(smoothMorph, [0.5, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.5, 1], [20, 0]);

    return (
        <div ref={targetRef} className="relative h-[220vh] w-full bg-[#f4f7f6] font-outfit">
            {/* Sticky Container Pins Viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pt-12">
                <div ref={containerRef} className="relative w-full h-full max-w-[1300px] mx-auto flex flex-col items-center justify-center overflow-hidden">
                    
                    {/* Container */}
                    <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

                        {/* Intro Text (Circle Mode) */}
                        <div className="absolute z-10 flex flex-col items-center justify-center text-center pointer-events-none top-[48%] -translate-y-1/2 px-2 max-w-[240px] sm:max-w-[340px] md:max-w-[400px]">
                            <motion.h1
                                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                                transition={{ duration: 0.8 }}
                                className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight font-outfit"
                            >
                                Web & Cloud <br /> Showcase
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.6 - morphValue } : { opacity: 0 }}
                                transition={{ duration: 0.8, delay: 0.15 }}
                                className="mt-3 text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-400 uppercase font-outfit"
                            >
                                {t('morphScrollTip')}
                            </motion.p>
                        </div>

                        {/* Arc Active Content (Bottom Arc Mode) */}
                        <motion.div
                            style={{ opacity: contentOpacity, y: contentY }}
                            className="absolute top-[8%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4 font-outfit"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs mb-2.5">
                                <span>{t('morphBadge')}</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2.5">
                                {t('morphArcHeading')}
                            </h2>
                            <p className="text-sm md:text-base text-slate-600 max-w-lg leading-relaxed font-medium">
                                {t('morphArcSubheading')}
                            </p>
                        </motion.div>

                        {/* Main Cards Morph Container */}
                        <div className="relative flex items-center justify-center w-full h-full">
                            {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                                let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                                if (introPhase === "scatter") {
                                    target = scatterPositions[i];
                                } else if (introPhase === "line") {
                                    const lineSpacing = 75;
                                    const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                                    const lineX = i * lineSpacing - lineTotalWidth / 2;
                                    target = { x: lineX, y: 30, rotation: 0, scale: 1, opacity: 1 };
                                } else {
                                    const isMobile = containerSize.width < 768;
                                    const minDimension = Math.min(containerSize.width, containerSize.height);

                                    // Wide circle radius for mobile so center text is spacious
                                    const circleRadius = isMobile ? 195 : Math.min(minDimension * 0.32, 270);
                                    const circleAngle = (i / TOTAL_IMAGES) * 360;
                                    const circleRad = (circleAngle * Math.PI) / 180;
                                    const circlePos = {
                                        x: Math.cos(circleRad) * circleRadius,
                                        y: Math.sin(circleRad) * circleRadius + (isMobile ? 10 : 20),
                                        rotation: circleAngle + 90,
                                    };

                                    const baseRadius = isMobile 
                                        ? containerSize.width * 0.85 
                                        : Math.min(containerSize.width * 0.65, containerSize.height * 0.65, 520);
                                    const arcRadius = baseRadius;
                                    const arcCenterY = arcRadius + (isMobile ? 40 : 40);

                                    const spreadAngle = isMobile ? 120 : 130;
                                    const startAngle = -90 - (spreadAngle / 2);
                                    const step = spreadAngle / (TOTAL_IMAGES - 1);

                                    const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                                    const maxRotation = spreadAngle * 0.8;
                                    const boundedRotation = -scrollProgress * maxRotation;

                                    const currentArcAngle = startAngle + (i * step) + boundedRotation;
                                    const arcRad = (currentArcAngle * Math.PI) / 180;

                                    const arcPos = {
                                        x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                        y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                        rotation: currentArcAngle + 90,
                                        scale: isMobile ? 1.2 : 1.4,
                                    };

                                    target = {
                                        x: lerp(circlePos.x, arcPos.x, morphValue),
                                        y: lerp(circlePos.y, arcPos.y, morphValue),
                                        rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                                        scale: lerp(1, arcPos.scale, morphValue),
                                        opacity: 1,
                                    };
                                }

                                return (
                                    <FlipCard
                                        key={i}
                                        src={src}
                                        index={i}
                                        total={TOTAL_IMAGES}
                                        phase={introPhase}
                                        target={target}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
