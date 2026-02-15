"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Custom 404 Page
 * Provides a premium, on-brand interface for missing pages
 */
export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden font-sans">
      {/* Background Decor - Premium soft glows consistent with error page */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 max-w-lg w-full px-6"
      >
        <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-black/5 text-center">
          {/* Icon/Illustration */}
          <div className="mb-10 flex justify-center">
            <motion.div
              initial={{ rotate: 15, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 15,
                delay: 0.1
              }}
              className="w-32 h-32 rounded-[2.5rem] bg-linear-to-br from-primary/10 to-primary/20 flex items-center justify-center relative border border-primary/20 shadow-inner"
            >
              <Compass className="w-16 h-16 text-primary drop-shadow-sm" />
              <motion.div
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 rounded-[2.5rem] border border-dashed border-primary/30"
              />
            </motion.div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-sm font-bold tracking-[0.3em] uppercase text-primary/60 mb-2 block">
                  Error 404
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
              >
                Lost in the void
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-muted-foreground max-w-[320px] mx-auto leading-relaxed"
              >
                The page you&apos;re looking for has vanished or never existed in this dimension.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
            >
              <Button
                asChild
                className="w-full sm:w-auto px-10 h-14 text-base font-bold rounded-2xl shadow-lg shadow-primary/10 transition-all hover:scale-[1.03] active:scale-[0.97]"
              >
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Back Home
                </Link>
              </Button>

              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto px-10 h-14 text-base font-bold rounded-2xl hover:bg-accent transition-all border-border shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-8 border-t border-border/50"
            >
              <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground/40 mb-4">
                Popular Destinations
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Reviews", href: "/dashboard/reviews" },
                  { label: "Settings", href: "/dashboard/settings" },
                ].map((link) => (
                  <Button key={link.href} variant="secondary" size="sm" asChild className="rounded-xl px-4 bg-muted/50 hover:bg-muted text-xs font-semibold tracking-wide">
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
