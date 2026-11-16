
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

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

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

const revealUp = {
    hidden: {
        opacity: 0,
        y: 24,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

export default function CTASection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section
            id="get-started"
            className="relative bg-gradient-to-b to-[#111618] from-[#0C0F10] isolate overflow-hidden px-6 py-28 sm:px-8 md:py-36 lg:py-40"
        >


            <motion.div
                className="relative mx-auto flex max-w-[850px] flex-col items-center text-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {/* Eyebrow */}
                <motion.div
                    variants={revealUp}
                    className="mb-8 flex items-center gap-3"
                >
                    <span
                        className="h-px w-6"
                        style={{ background: C.accent }}
                    />

                    <span
                        className="text-[10px] font-medium uppercase tracking-[0.2em]"
                        style={{ color: C.accent }}
                    >
                        Your next chapter starts here
                    </span>

                    <span
                        className="h-px w-6"
                        style={{ background: C.accent }}
                    />
                </motion.div>

                {/* Heading */}
                <motion.h2
                    variants={revealUp}
                    className="text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[1.04] tracking-[-0.065em]"
                    style={{ color: C.text }}
                >
                    Stop rereading.
                    <span
                        className="mt-2 block"
                        style={{ color: C.accent }}
                    >
                        Start remembering.
                    </span>
                </motion.h2>

                {/* Description */}
                <motion.p
                    variants={revealUp}
                    className="mt-7 max-w-[470px] text-[13px] leading-7 sm:text-[15px]"
                    style={{ color: C.secondary }}
                >
                    Turn your notes and study material into something
                    you can understand, recall, and put to use.
                </motion.p>

                {/* Actions */}
                <motion.div
                    variants={revealUp}
                    className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
                >
                    <Link
                        to="/register"
                        className="group inline-flex w-full items-center justify-center gap-3 rounded-lg px-7 py-3.5 text-[13px] font-medium transition-colors duration-300 sm:w-auto"
                        style={{
                            background: C.accent,
                            color: C.bg,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#D4B568";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = C.accent;
                        }}
                    >
                        Get started free

                        <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>

                    <Link
                        to="/login"
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-lg border px-7 py-3.5 text-[13px] font-medium transition-all duration-300 sm:w-auto"
                        style={{
                            borderColor: C.borderSoft,
                            color: C.secondary,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = C.elevated;
                            e.currentTarget.style.color = C.text;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = C.secondary;
                        }}
                    >
                        Sign in

                        <ArrowUpRight
                            size={14}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </Link>
                </motion.div>

            </motion.div>
        </section>
    );
}


// import { motion } from "framer-motion";
// import { ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";

// const containerVariants = {
//     hidden: {},
//     visible: {
//         transition: {
//             staggerChildren: 0.18,
//             delayChildren: 0.15,
//         },
//     },
// };

// const revealUp = {
//     hidden: {
//         opacity: 0,
//         y: 35,
//         filter: "blur(8px)",
//     },
//     visible: {
//         opacity: 1,
//         y: 0,
//         filter: "blur(0px)",
//         transition: {
//             duration: 0.85,
//             ease: [0.22, 1, 0.36, 1],
//         },
//     },
// };

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

// export default function CTASection() {

//     return (<section
//         className="py-24 md:py-40 px-6 md:px-10 relative overflow-hidden bg-gradient-to-b from-[#111618] to-[#0C0F10]"
//     >


//         <motion.div
//             className="relative z-10 max-w-4xl mx-auto text-center"
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.35 }}
//         >
//             {/* Heading */}
//             <motion.h2
//                 variants={revealUp}
//                 className="font-bold mb-6 leading-tight"
//                 style={{
//                     fontSize: "clamp(3rem, 6vw, 4.5rem)",
//                     letterSpacing: "-0.04em",
//                     color: C.text,
//                 }}
//             >
//                 <span className="block overflow-hidden pb-1">
//                     <motion.span
//                         className="inline-block"
//                         variants={revealUp}
//                     >
//                         Stop rereading.
//                     </motion.span>
//                 </span>

//                 <span className="block overflow-hidden pb-2">
//                     <motion.span
//                         className="inline-block"
//                         variants={revealUp}
//                         style={{ color: C.accent }}
//                     >
//                         Start remembering.
//                     </motion.span>
//                 </span>
//             </motion.h2>

//             {/* Description */}
//             <motion.p
//                 variants={revealUp}
//                 className="text-sm font-light md:text-xl leading-relaxed mb-12"
//                 style={{
//                     color: C.secondary,
//                     maxWidth: "560px",
//                     margin: "0 auto 3rem",
//                 }}
//             >
//                 Join thousands of students who study smarter with NoteLM.
//             </motion.p>

//             {/* CTA buttons */}
//             <motion.div
//                 variants={containerVariants}
//                 className="flex flex-col sm:flex-row gap-4 justify-center items-center"
//             >
//                 <motion.div variants={revealUp}>
//                     <Link
//                         to="/register"
//                         className="no-underline px-8 py-4 rounded-xl text-lg font-bold inline-flex items-center gap-2"
//                         style={{
//                             backgroundColor: C.accent,
//                             color: "#0C0F10",
//                             letterSpacing: "-0.01em",
//                             boxShadow: `0 0 0px ${C.accent}00`,
//                         }}
//                         onMouseEnter={(e) => {
//                             e.currentTarget.style.backgroundColor = "#D4B568";
//                             e.currentTarget.style.boxShadow = `0 12px 32px ${C.accent}35`;
//                         }}
//                         onMouseLeave={(e) => {
//                             e.currentTarget.style.backgroundColor = C.accent;
//                             e.currentTarget.style.boxShadow = "none";
//                         }}
//                     >
//                         Get started free
//                         <motion.span
//                             className="inline-flex"
//                             whileHover={{ x: 4 }}
//                             transition={{ duration: 0.2 }}
//                         >
//                             <ChevronRight size={18} />
//                         </motion.span>
//                     </Link>
//                 </motion.div>

//                 <motion.div variants={revealUp} >
//                     <Link
//                         to="/login"
//                         className="no-underline px-8 py-4 rounded-xl text-lg font-medium inline-flex items-center gap-2 transition-all duration-300"
//                         style={{
//                             color: C.secondary,
//                             border: `1px solid ${C.border}`,
//                         }}
//                         onMouseEnter={(e) => {
//                             e.currentTarget.style.borderColor = C.borderSoft;
//                             e.currentTarget.style.color = C.text;
//                             e.currentTarget.style.backgroundColor = C.surface;
//                         }}
//                         onMouseLeave={(e) => {
//                             e.currentTarget.style.borderColor = C.border;
//                             e.currentTarget.style.color = C.secondary;
//                             e.currentTarget.style.backgroundColor = "transparent";
//                         }}
//                     >
//                         Sign in
//                     </Link>
//                 </motion.div>
//             </motion.div>
//         </motion.div>
//     </section>);
// }

