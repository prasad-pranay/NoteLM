
import { motion, useReducedMotion } from "framer-motion";
import {
    Upload,
    BrainCircuit,
    MessageSquareText,
    ChartNoAxesCombined,
    ArrowUpRight,
} from "lucide-react";
const C = {
    bg: "#0C0F10",
    surface: "#111618",
    elevated: "#161D1F",
    border: "#1E2628",
    borderSoft: "#252E30",
    accent: "#C6A44E",
    text: "#E8ECE4",
    secondary: "#94A09A",
    muted: "#5A6864",
};
const steps = [
    {
        n: "01",
        title: "Upload your material",
        desc: "Add PDFs, documents, text, or video links. Bring all your learning material into one place.",
        icon: Upload,
        detail: "PDF · DOCX · TXT · URLs",
    },
    {
        n: "02",
        title: "Let NoteLM process it",
        desc: "Your content is organized and indexed so answers stay connected to your actual sources.",
        icon: BrainCircuit,
        detail: "Content processing",
    },
    {
        n: "03",
        title: "Explore and interact",
        desc: "Ask questions, clarify difficult topics, or generate quizzes to test your understanding.",
        icon: MessageSquareText,
        detail: "Chat · Quizzes · Flashcards",
    },
    {
        n: "04",
        title: "Build lasting knowledge",
        desc: "Review your results, identify gaps, and revisit important concepts at your own pace.",
        icon: ChartNoAxesCombined,
        detail: "Progress · Revision",
    },
];

function HowItWorks() {
    const shouldReduceMotion = useReducedMotion();

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.12,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 22,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <section
            id="how-it-works"
            className="relative pt-30 overflow-hidden bg-gradient-to-b from-[#0B0B0B] via-[#0A0C10] to-[#000]"
        >
            <div className="px-6 py-24 sm:px-8 lg:px-20 lg:py-28">

                {/* Section heading */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={itemVariants}
                    className="mb-16 flex flex-col justify-between gap-6 sm:mb-20 md:flex-row md:items-end"
                >
                    <div>
                        <div
                            className="mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em]"
                            style={{ color: C.accent }}
                        >
                            <span
                                className="h-px w-7"
                                style={{ background: C.accent }}
                            />
                            How it works
                        </div>

                        <h2
                            className="lg:text-8xl font-bold leading-[1.12] tracking-[-0.045em]"
                            style={{ color: C.text }}
                        >
                            From information
                            <br className="hidden sm:block" />
                            to <span style={{ color: C.accent }}>understanding.</span>
                        </h2>
                    </div>
                </motion.div>

                {/* Steps */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <motion.div
                                key={step.n}
                                variants={itemVariants}
                                className="group relative flex flex-col border-t py-8 sm:px-6 lg:border-t-0 lg:border-l lg:py-3 first:lg:border-l-0 first:sm:pl-0 last:sm:pr-0"
                                style={{
                                    borderColor: C.border,
                                }}
                            >
                                {/* Step number and icon */}
                                <div className="mb-9 flex items-center justify-between">
                                    <span
                                        className="font-mono text-[13px] tracking-wider"
                                        style={{ color: C.accent }}
                                    >
                                        / {step.n}
                                    </span>

                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 group-hover:border-[var(--step-accent)]"
                                        style={{
                                            borderColor: C.border,
                                            color: C.secondary,
                                            "--step-accent": C.accent,
                                        }}
                                    >
                                        <Icon size={17} strokeWidth={1.5} />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3
                                    className="mb-3 text-[17px] font-medium tracking-[-0.02em]"
                                    style={{ color: C.text }}
                                >
                                    {step.title}
                                </h3>

                                <p
                                    className="max-w-[260px] text-[13px] leading-[1.85]"
                                    style={{ color: C.secondary }}
                                >
                                    {step.desc}
                                </p>

                                {/* Supporting detail */}
                                <div
                                    className="mt-7 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em]"
                                    style={{ color: C.muted }}
                                >
                                    <span
                                        className="h-1 w-1 rounded-full"
                                        style={{ background: C.accent }}
                                    />
                                    {step.detail}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}

export default HowItWorks;
