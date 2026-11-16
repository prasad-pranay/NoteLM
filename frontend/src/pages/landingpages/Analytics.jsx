
import { useRef } from "react";
import {
    motion,
    useInView,
    useReducedMotion,
} from "framer-motion";
import {
    Flame,
    Check,
    ArrowUpRight,
    BookOpen,
    BrainCircuit,
    Target,
} from "lucide-react";

// Design tokens
const C = {
    bg: "#0C0F10",
    surface: "#111618",
    elevated: "#161D1F",
    border: "#1E2628",
    borderSoft: "#252E30",
    accent: "#C6A44E",
    accentMuted: "#9A7B38",
    text: "#E8ECE4",
    secondary: "#94A09A",
    muted: "#5A6864",
};

// Shared reveal animation
function Reveal({
    children,
    delay = 0,
    className = "",
    amount = 0.15,
}) {
    const ref = useRef(null);
    const inView = useInView(ref, {
        once: true,
        amount,
    });
    const shouldReduce = useReducedMotion();

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: shouldReduce ? 1 : 0,
                y: shouldReduce ? 0 : 22,
            }}
            animate={
                inView
                    ? { opacity: 1, y: 0 }
                    : {}
            }
            transition={{
                duration: 0.7,
                delay: shouldReduce ? 0 : delay,
                ease: [0.16, 1, 0.3, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Analytics preview
function AnalyticsMock() {
    const bars = [
        { topic: "Mitosis", score: 45 },
        { topic: "Genetics", score: 60 },
        { topic: "Ecology", score: 72 },
        { topic: "Evolution", score: 38 },
        { topic: "Cell Resp.", score: 85 },
    ];

    const days = [
        { day: "M", active: true },
        { day: "T", active: true },
        { day: "W", active: true },
        { day: "T", active: false },
        { day: "F", active: true },
        { day: "S", active: true },
        { day: "S", active: false },
    ];

    const stats = [
        { label: "Documents", value: "12", icon: BookOpen },
        { label: "Quizzes", value: "47", icon: BrainCircuit },
        { label: "Avg. score", value: "74%", icon: Target },
    ];

    const shouldReduce = useReducedMotion();

    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
                fontFamily: "Inter, sans-serif",
            }}
        >
            {/* Preview header */}
            <div
                className="flex items-center justify-between border-b px-5 py-4 sm:px-6"
                style={{ borderColor: C.border }}
            >
                <div>
                    <div
                        className="text-[13px] font-medium"
                        style={{ color: C.text }}
                    >
                        Learning overview
                    </div>
                    <div
                        className="mt-1 text-[10px]"
                        style={{ color: C.muted }}
                    >
                        Your progress at a glance
                    </div>
                </div>

                <div
                    className="rounded-md px-2.5 py-1.5 text-[10px]"
                    style={{
                        background: C.elevated,
                        color: C.secondary,
                        border: `1px solid ${C.border}`,
                    }}
                >
                    This week
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.label}
                            className="relative px-3 py-5 sm:px-5 sm:py-6"
                            style={{
                                borderRight:
                                    index !== 2
                                        ? `1px solid ${C.border}`
                                        : "none",
                            }}
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <Icon
                                    size={13}
                                    strokeWidth={1.6}
                                    style={{ color: C.muted }}
                                />
                                <span
                                    className="hidden text-[10px] sm:inline"
                                    style={{ color: C.muted }}
                                >
                                    {stat.label}
                                </span>
                            </div>

                            <div
                                className="text-2xl font-semibold tracking-[-0.05em] sm:text-[28px]"
                                style={{ color: C.text }}
                            >
                                {stat.value}
                            </div>

                            <div
                                className="mt-1 text-[9px] sm:hidden"
                                style={{ color: C.muted }}
                            >
                                {stat.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Topic performance */}
            <div
                className="border-t px-5 py-6 sm:px-6"
                style={{ borderColor: C.border }}
            >
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                        <div
                            className="text-[12px] font-medium"
                            style={{ color: C.text }}
                        >
                            Topic performance
                        </div>
                        <div
                            className="mt-1 text-[10px]"
                            style={{ color: C.muted }}
                        >
                            Identify topics that need more attention
                        </div>
                    </div>

                    <span
                        className="shrink-0 text-[10px]"
                        style={{ color: C.muted }}
                    >
                        Accuracy
                    </span>
                </div>

                <div className="space-y-5">
                    {bars.map((bar, index) => {
                        const barColor =
                            bar.score < 50
                                ? "#C16B61"
                                : bar.score < 70
                                    ? C.accentMuted
                                    : C.accent;

                        return (
                            <div
                                key={bar.topic}
                                className="grid grid-cols-[76px_minmax(0,1fr)_30px] items-center gap-3 sm:grid-cols-[90px_minmax(0,1fr)_34px]"
                            >
                                <span
                                    className="text-[10px] sm:text-[11px]"
                                    style={{ color: C.secondary }}
                                >
                                    {bar.topic}
                                </span>

                                <div
                                    className="h-[5px] overflow-hidden rounded-full"
                                    style={{ background: C.elevated }}
                                >
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{
                                            width: `${bar.score}%`,
                                        }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: shouldReduce ? 0 : 1,
                                            delay: shouldReduce ? 0 : index * 0.1,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="h-full rounded-full"
                                        style={{ background: barColor }}
                                    />
                                </div>

                                <span
                                    className="text-right font-mono text-[10px]"
                                    style={{ color: C.secondary }}
                                >
                                    {bar.score}%
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div
                    className="mt-6 flex items-center gap-4 border-t pt-4"
                    style={{ borderColor: C.border }}
                >
                    <div className="flex items-center gap-1.5">
                        <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: "#C16B61" }}
                        />
                        <span
                            className="text-[9px]"
                            style={{ color: C.muted }}
                        >
                            Needs attention
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: C.accent }}
                        />
                        <span
                            className="text-[9px]"
                            style={{ color: C.muted }}
                        >
                            On track
                        </span>
                    </div>
                </div>
            </div>

            {/* Streak */}
            <div
                className="flex flex-wrap items-center justify-between gap-4 border-t px-5 py-5 sm:px-6"
                style={{ borderColor: C.border }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{
                            background: "rgba(198,164,78,0.09)",
                            color: C.accent,
                        }}
                    >
                        <Flame size={17} strokeWidth={1.7} />
                    </div>

                    <div>
                        <div
                            className="text-[12px] font-medium"
                            style={{ color: C.text }}
                        >
                            5 day streak
                        </div>
                        <div
                            className="mt-0.5 text-[10px]"
                            style={{ color: C.muted }}
                        >
                            Keep your momentum going
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center gap-1.5"
                        >
                            <div
                                className="flex h-6 w-6 items-center justify-center rounded-full"
                                style={{
                                    background: day.active
                                        ? C.accent
                                        : C.elevated,
                                    border: `1px solid ${
                                        day.active
                                            ? C.accent
                                            : C.border
                                    }`,
                                }}
                            >
                                {day.active && (
                                    <Check
                                        size={11}
                                        strokeWidth={2.5}
                                        color={C.bg}
                                    />
                                )}
                            </div>

                            <span
                                className="text-[8px]"
                                style={{ color: C.muted }}
                            >
                                {day.day}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Main section
export default function AnalyticsSection() {
    const stats = [
        { value: "12+", label: "Documents organized" },
        { value: "47", label: "Quizzes attempted" },
        { value: "74%", label: "Average score" },
        { value: "5 days", label: "Current streak" },
    ];

    return (
        <section
            id="analytics"
            className="relative overflow-hidden bg-gradient-to-b from-[#111618] to-[#0C0F10]"
        >
            <div className="px-6 py-24 sm:px-8 md:py-32 lg:px-10">

                <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

                    {/* Left content */}
                    <div>
                        <Reveal>
                            <div
                                className="mb-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em]"
                                style={{ color: C.accent }}
                            >
                                <span
                                    className="h-px w-7"
                                    style={{ background: C.accent }}
                                />
                                Your progress
                            </div>
                        </Reveal>

                        <Reveal delay={0.08}>
                            <h2
                                className="max-w-[520px] text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-[1.12] tracking-[-0.045em]"
                                style={{ color: C.text }}
                            >
                                See how far
                                <br className="hidden sm:block" />
                                you've come.
                                <span
                                    className="block"
                                    style={{ color: C.accent }}
                                >
                                    Know what to work on.
                                </span>
                            </h2>
                        </Reveal>

                        {/* Supporting stats */}
                        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-x-8">
                            {stats.map((stat, index) => (
                                <Reveal
                                    key={stat.label}
                                    delay={0.22 + index * 0.07}
                                >
                                    <div
                                        className="border-t pt-4"
                                        style={{ borderColor: C.border }}
                                    >
                                        <div
                                            className="text-[25px] font-medium tracking-[-0.05em] sm:text-[29px]"
                                            style={{ color: C.text }}
                                        >
                                            {stat.value}
                                        </div>

                                        <div
                                            className="mt-1.5 text-[11px]"
                                            style={{ color: C.muted }}
                                        >
                                            {stat.label}
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>

                    </div>

                    {/* Right analytics preview */}
                    <Reveal
                        delay={0.18}
                        className="relative w-full min-w-0"
                    >
                        <div
                            className="relative"
                            style={{
                                transform: "translateZ(0)",
                            }}
                        >
                            <AnalyticsMock />
                        </div>

                    </Reveal>
                </div>
            </div>
        </section>
    );
}

// import { useRef } from 'react';
// import {
//     motion,
//     useInView,
//     useReducedMotion,
// } from 'framer-motion';
// import {
//     Flame,
//     CheckCircle,
// } from 'lucide-react';


// // ─── Design Tokens ─────────────────────────────────────────────────────────────
// const C = {
//     bg: '#0C0F10',
//     surface: '#111618',
//     elevated: '#161D1F',
//     border: '#1E2628',
//     borderSoft: '#252E30',
//     accent: '#C6A44E',
//     accentMuted: '#9A7B38',
//     text: '#E8ECE4',
//     secondary: '#94A09A',
//     muted: '#5A6864',
// };


// // ─── Analytics Mock ────────────────────────────────────────────────────────────
// function AnalyticsMock() {
//     const bars = [
//         { topic: 'Mitosis', score: 45 },
//         { topic: 'Genetics', score: 60 },
//         { topic: 'Ecology', score: 72 },
//         { topic: 'Evolution', score: 38 },
//         { topic: 'Cell Resp.', score: 85 },
//     ];

//     const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
//     const streakDays = [true, true, true, false, true, true, false];

//     return (
//         <div
//             className="w-full rounded-xl overflow-hidden"
//             style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, fontFamily: 'Inter, sans-serif' }}
//         >
//             {/* Stats row */}
//             <div className="grid grid-cols-3 border-b" style={{ borderColor: C.border }}>
//                 {[
//                     { label: 'Docs', value: '12' },
//                     { label: 'Quizzes', value: '47' },
//                     { label: 'Avg Score', value: '74%' },
//                 ].map((s, i) => (
//                     <div
//                         key={s.label}
//                         className="py-4 text-center"
//                         style={{
//                             borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
//                         }}
//                     >
//                         <div className="text-xl font-bold" style={{ color: C.text, letterSpacing: '-0.04em' }}>
//                             {s.value}
//                         </div>
//                         <div className="text-[10px] mt-0.5" style={{ color: C.muted }}>
//                             {s.label}
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Weak topics */}
//             <div className="p-4 border-b" style={{ borderColor: C.border }}>
//                 <div className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: C.muted }}>
//                     Weak Topics
//                 </div>
//                 <div className="space-y-2">
//                     {bars.map((b) => (
//                         <div key={b.topic} className="flex items-center gap-2">
//                             <div className="text-[10px] w-14 text-right" style={{ color: C.secondary }}>
//                                 {b.topic}
//                             </div>
//                             <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: C.border }}>
//                                 <motion.div
//                                     className="h-1.5 rounded-full"
//                                     initial={{ width: 0 }}
//                                     whileInView={{ width: `${b.score}%` }}
//                                     viewport={{ once: true }}
//                                     transition={{ duration: 0.8, ease: 'easeOut' }}
//                                     style={{
//                                         backgroundColor: b.score < 50 ? '#E05C5C' : b.score < 70 ? C.accentMuted : C.accent,
//                                     }}
//                                 />
//                             </div>
//                             <div className="text-[10px] w-6" style={{ color: C.muted }}>
//                                 {b.score}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Streak */}
//             <div className="px-4 py-3 flex items-center gap-4">
//                 <div className="flex items-center gap-1.5">
//                     <Flame size={13} style={{ color: C.accent }} />
//                     <span className="text-xs font-bold" style={{ color: C.accent }}>
//                         5 day streak
//                     </span>
//                 </div>
//                 <div className="flex gap-1.5">
//                     {weekDays.map((d, i) => (
//                         <div key={i} className="flex flex-col items-center gap-1">
//                             <div
//                                 className="w-5 h-5 rounded-full flex items-center justify-center"
//                                 style={{
//                                     backgroundColor: streakDays[i] ? C.accent : C.elevated,
//                                     border: `1px solid ${streakDays[i] ? C.accent : C.border}`,
//                                 }}
//                             >
//                                 {streakDays[i] && <CheckCircle size={10} color="#0C0F10" />}
//                             </div>
//                             <span className="text-[8px]" style={{ color: C.muted }}>
//                                 {d}
//                             </span>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ─── Shared animation variants ─────────────────────────────────────────────────
// const fadeUp = {
//     hidden: { opacity: 0, y: 24 },
//     visible: (i = 0) => ({
//         opacity: 1,
//         y: 0,
//         transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
//     }),
// };


// // ─── Scroll-aware reveal wrapper ───────────────────────────────────────────────
// function Reveal({ children, delay = 0, className = '', once = true, amount = 0.15 }) {
//     const ref = useRef(null);
//     const inView = useInView(ref, { once, amount });
//     const shouldReduce = useReducedMotion();

//     return (
//         <motion.div
//             ref={ref}
//             variants={fadeUp}
//             initial={shouldReduce ? 'visible' : 'hidden'}
//             animate={inView ? 'visible' : 'hidden'}
//             custom={delay}
//             className={className}
//         >
//             {children}
//         </motion.div>
//     );
// }
// // ─── Analytics & Streaks Section ──────────────────────────────────────────────
// export default function AnalyticsSection() {
//     const stats = [
//         { value: '12+', label: 'Documents' },
//         { value: '47', label: 'Quizzes' },
//         { value: '74%', label: 'Average score' },
//         { value: '5🔥', label: 'Day streak' },
//     ];

//     return (
//         <section
//             id='analytics'
//             className="py-24 md:py-36 px-6 md:px-10"
//             style={{ backgroundColor: C.bg }}
//         >
//             <div className="max-w-7xl mx-auto">
//                 {/* Headline */}
//                 <div className="grid md:grid-cols-2 gap-16 items-center">
//                     <div>
//                         <Reveal>
//                             <div className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: C.accent }}>
//                                 Analytics
//                             </div>
//                         </Reveal>
//                         <Reveal delay={0.5}>
//                             <h2
//                                 className="font-bold mb-6 leading-tight"
//                                 style={{
//                                     fontSize: 'clamp(2rem, 4vw, 3.25rem)',
//                                     letterSpacing: '-0.04em',
//                                     color: C.text,
//                                 }}
//                             >
//                                 Know exactly what you've mastered
//                             </h2>
//                         </Reveal>
//                         <Reveal delay={1}>
//                             <p className="text-sm font-light leading-relaxed mb-10" style={{ color: C.secondary }}>
//                                 Your dashboard tracks documents, quizzes attempted, average scores, and highlights the topics you keep getting wrong. Combined with streaks, badges, and XP — studying becomes a habit.
//                             </p>
//                         </Reveal>

//                         {/* Big stat numbers */}
//                         <div className="grid grid-cols-2 gap-6">
//                             {stats.map((s, i) => (
//                                 <Reveal key={s.label} delay={i * 0.3}>
//                                     <div
//                                         className="p-5 rounded-xl"
//                                         style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
//                                     >
//                                         <div
//                                             className="text-3xl font-bold mb-1"
//                                             style={{ color: C.text, letterSpacing: '-0.04em' }}
//                                         >
//                                             {s.value}
//                                         </div>
//                                         <div className="text-sm" style={{ color: C.muted }}>
//                                             {s.label}
//                                         </div>
//                                     </div>
//                                 </Reveal>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Visual */}
//                     <Reveal delay={1} className="w-full">
//                         <AnalyticsMock />
//                     </Reveal>
//                 </div>
//             </div>
//         </section>
//     );
// }