"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, Home, RefreshCcw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Global Error Page
 * Provides a premium, user-friendly interface when the application crashes
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application Crash Observed:", error);
    }, [error]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden font-sans">
            {/* Background Decor - Premium soft glows for a modern feel */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-destructive/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                className="relative z-10 max-w-lg w-full px-6"
            >
                <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-black/5 text-center">
                    {/* Error Illustration/Icon */}
                    <div className="mb-10 flex justify-center">
                        <motion.div
                            initial={{ rotate: -15, scale: 0.5, opacity: 0 }}
                            animate={{ rotate: 0, scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 15,
                                delay: 0.1
                            }}
                            className="w-32 h-32 rounded-[2.5rem] bg-linear-to-br from-destructive/10 to-destructive/20 flex items-center justify-center relative border border-destructive/20 shadow-inner"
                        >
                            <AlertCircle className="w-16 h-16 text-destructive drop-shadow-sm" />
                            <motion.div
                                animate={{
                                    scale: [1, 1.15, 1],
                                    opacity: [0.2, 0.4, 0.2]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 rounded-[2.5rem] bg-destructive/10"
                            />
                        </motion.div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
                            >
                                Snapshot of trouble
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg text-muted-foreground max-w-[320px] mx-auto leading-relaxed"
                            >
                                {error.message.toLowerCase().includes("digest")
                                    ? "Something went wrong on our end. We're looking into it right now."
                                    : (error.message || "An unexpected error occurred. Please try again or refresh the page.")}
                            </motion.p>
                        </div>

                        {error.digest && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/40 bg-muted/30 py-2 px-4 rounded-full border border-border/30 inline-block shadow-sm">
                                    Error Ref: {error.digest}
                                </span>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
                        >
                            <Button
                                onClick={() => reset()}
                                className="w-full sm:w-auto px-10 h-14 text-base font-bold rounded-2xl shadow-lg shadow-primary/10 transition-all hover:scale-[1.03] active:scale-[0.97]"
                            >
                                <RefreshCcw className="w-5 h-5 mr-2" />
                                Try again
                            </Button>

                            <Button
                                variant="outline"
                                asChild
                                className="w-full sm:w-auto px-10 h-14 text-base font-bold rounded-2xl hover:bg-accent transition-all border-border shadow-sm"
                            >
                                <Link href="/">
                                    <Home className="w-5 h-5 mr-2" />
                                    Back Home
                                </Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="pt-6"
                        >
                            <div className="inline-flex items-center gap-3 group cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                                <div className="h-px w-8 bg-border/50 group-hover:w-12 transition-all" />
                                <Link
                                    href="mailto:support@taptify.com"
                                    className="text-sm font-medium flex items-center gap-2"
                                >
                                    <Mail className="w-4 h-4" />
                                    Still stuck? Contact us
                                </Link>
                                <div className="h-px w-8 bg-border/50 group-hover:w-12 transition-all" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
