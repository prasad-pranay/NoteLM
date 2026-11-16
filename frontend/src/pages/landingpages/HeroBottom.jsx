
import { motion, useReducedMotion } from "framer-motion";

import {
    FileText,
    CircleCheck,
    MessageSquare,
    ChartNoAxesCombined,
    Users,
    Clock3,
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
const features = [
    {
        icon: FileText,
        title: "Document chat",
        description:
            "Ask nuanced questions and get source-cited answers from any PDF, DOCX, or TXT you upload.",
    },
    {
        icon: CircleCheck,
        title: "Auto-generate quizzes",
        description:
            "Turn any document into MCQs, true/false, or short-answer questions with a single click.",
    },
    {
        icon: MessageSquare,
        title: "AI summaries",
        description:
            "Get structured outlines and key concepts extracted from any length of content — instantly.",
    },
    {
        icon: ChartNoAxesCombined,
        title: "Progress tracking",
        description:
            "Monitor quiz scores over time, surface weak areas, and build lasting retention with spaced repetition.",
    },
    {
        icon: Users,
        title: "Share with anyone",
        description:
            "Publish quizzes publicly or share private links with classmates. Real-time leaderboards included.",
    },
    {
        icon: Clock3,
        title: "Works instantly",
        description:
            "Upload and start chatting in seconds. No setup, no configuration — just your documents.",
    },
];

const EASE = [0.16, 1, 0.3, 1];

export default function FeaturesGrid() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section
            className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12"
        >
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.1,
                        },
                    },
                }}
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-px
                    overflow-hidden
                    rounded-xl
                    border
                "
                style={{
                    backgroundColor: C.border,
                    borderColor: C.border,
                }}
            >
                {features.map((feature, index) => {
                    const Icon = feature.icon;

                    return (
                        <motion.div
                            key={feature.title}
                            variants={{
                                hidden: shouldReduceMotion
                                    ? {}
                                    : {
                                        opacity: 0,
                                        y: 18,
                                    },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.65,
                                        ease: EASE,
                                    },
                                },
                            }}
                            whileHover={
                                shouldReduceMotion
                                    ? {}
                                    : {
                                        backgroundColor: "#151C1E",
                                    }
                            }
                            className="
                                group
                                relative
                                flex flex-col
                                min-h-[190px]
                                p-7 sm:p-8
                                transition-colors
                                duration-300
                            "
                            style={{
                                backgroundColor: C.surface,
                            }}
                        >
                            {/* Icon */}

                            <div
                                className="
                                    mb-6
                                    flex items-center
                                    justify-center
                                    w-9 h-9
                                    rounded-lg
                                    transition-colors
                                    duration-300
                                    group-hover:bg-[#C6A44E]/10
                                "
                                style={{
                                    color: C.accent,
                                }}
                            >
                                <Icon
                                    size={19}
                                    strokeWidth={1.5}
                                    className="
                                        transition-transform
                                        duration-300
                                        group-hover:scale-110
                                    "
                                />
                            </div>

                            {/* Title */}

                            <h3
                                className="
                                    text-sm
                                    font-medium
                                    mb-2
                                    tracking-tight
                                "
                                style={{
                                    color: C.text,
                                }}
                            >
                                {feature.title}
                            </h3>

                            {/* Description */}

                            <p
                                className="
                                    text-[13px]
                                    leading-[1.8]
                                    font-normal
                                    max-w-sm
                                "
                                style={{
                                    color: C.secondary,
                                }}
                            >
                                {feature.description}
                            </p>

                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
