"use client";

import { useState, useRef } from "react";
import { Mic, Copy, ExternalLink, Check, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { readStreamableValue } from "@ai-sdk/rsc";
import { motion, AnimatePresence } from "framer-motion";
import { usePublicReviews } from "@/hooks/use-review-link-queries";
import { streamAIReviewDraftAction } from "@/lib/actions/review-editor";
import { transcribeVoiceAction } from "@/lib/actions";

interface SmartEditorStepProps {
  config: {
    primaryColor: string;
    businessName?: string;
    smartKeywords?: string[];
  };
  isDarkTheme: boolean;
  rating: number;
  googleReviewUrl?: string;
  slug?: string;
  onComplete: () => void;
}

export function SmartEditorStep({
  config,
  isDarkTheme,
  rating,
  googleReviewUrl,
  slug,
  onComplete,
}: SmartEditorStepProps) {
  const [reviewText, setReviewText] = useState("");
  const [isAiActive, setIsAiActive] = useState(false);
  const dynamicKeywords = config.smartKeywords || [];
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { data: recentReviews = [] } = usePublicReviews(slug || "", {
    enabled: !!slug,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword],
    );
  };

  const handleDraftWithAi = async () => {
    if (selectedKeywords.length === 0) {
      toast.error("Please select at least one keyword");
      return;
    }

    setIsGenerating(true);
    setReviewText("");

    try {
      const streamableValue = await streamAIReviewDraftAction({
        keywords: selectedKeywords,
        businessName: config.businessName,
        recentReviews: recentReviews, // Pass reviews for uniqueness
      });

      for await (const partial of readStreamableValue(streamableValue)) {
        if (partial?.draft) {
          setReviewText(partial.draft);
        }
      }
      setIsAiActive(false);
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error("Failed to generate draft. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const startRecording = async () => {
    setIsAiActive(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await handleTranscription(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      toast.error("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const result = await transcribeVoiceAction(base64Audio.split(",")[1]);
        if (result.success && result.data?.text) {
          setReviewText((prev) =>
            prev ? `${prev} ${result.data.text}` : result.data.text,
          );
        } else {
          toast.error(
            (!result.success && result.error) || "Transcription failed",
          );
        }
        setIsTranscribing(false);
      };
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Failed to transcribe audio.");
      setIsTranscribing(false);
    }
  };

  const handleCopyAndPlaceReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Please write or generate a review first");
      return;
    }

    try {
      await navigator.clipboard.writeText(reviewText);
      setIsCopied(true);
      toast.success("Review copied to clipboard!");

      setTimeout(() => {
        if (googleReviewUrl) {
          window.open(googleReviewUrl, "_blank");
        }
        onComplete();
      }, 1000);
    } catch {
      toast.error("Failed to copy review.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-center gap-1.5 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-6 h-6 transition-all duration-500",
              i < rating
                ? "fill-yellow-400 text-yellow-400 scale-110"
                : "text-zinc-200 fill-zinc-200",
            )}
          />
        ))}
      </div>

      <div className="text-center space-y-2 mb-12">
        <h2
          className={cn(
            "text-2xl font-bold tracking-tight",
            isDarkTheme ? "text-white" : "text-zinc-900",
          )}
        >
          Smart Review Editor
        </h2>
        <p
          className={cn(
            "text-sm",
            isDarkTheme ? "text-zinc-400" : "text-zinc-500",
          )}
        >
          Draft your perfect review in seconds
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={() => setIsAiActive(!isAiActive)}
          variant="outline"
          className={cn(
            "flex-1 h-12 gap-2 relative overflow-hidden transition-all duration-500 hover:text-white cursor-pointer dark:hover:text-black! bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600",
            isAiActive
              ? "text-white border-transparent shadow-xl shadow-purple-500/30 font-extrabold"
              : "border-zinc-200 text-zinc-200 hover:border-purple-300 hover:bg-purple-50",
          )}
        >
          {isAiActive && (
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse opacity-20" />
          )}
          <span className="relative z-10">Draft with AI</span>
        </Button>
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={"outline"}
          className={cn(
            "flex-1 h-12 gap-2 border-red-500/20! transition-all duration-300 cursor-pointer dark:hover:text-black!",
            isRecording &&
              "bg-red-500 text-white border-red-500 animate-pulse shadow-lg shadow-red-500/40",
            !isRecording &&
              "hover:bg-red-50 hover:border-red-200 text-zinc-600",
          )}
        >
          <Mic
            className={cn(
              "w-4 h-4",
              isRecording ? "text-white" : "text-red-500",
            )}
          />
          {isRecording ? "Stop Recording" : "Voice Record"}
        </Button>
      </div>

      <AnimatePresence>
        {isAiActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-4"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {dynamicKeywords.length > 0 ? (
                dynamicKeywords.map((keyword) => (
                  <Button
                    size={"sm"}
                    key={keyword}
                    onClick={() => toggleKeyword(keyword)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                      selectedKeywords.includes(keyword)
                        ? "bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-primary/20 text-white"
                        : isDarkTheme
                          ? "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
                    )}
                  >
                    {keyword}
                  </Button>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No keywords generated. Try typing your review.
                </p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleDraftWithAi}
              disabled={isGenerating || selectedKeywords.length === 0}
              className={cn(
                "w-full h-12 gap-2 border-transparent relative overflow-hidden group transition-all duration-500",
                "bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-500/20",
                (isGenerating || selectedKeywords.length === 0) &&
                  "opacity-50 grayscale cursor-not-allowed",
              )}
            >
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin relative z-10" />
              ) : null}
              <span className="relative z-10">
                {isGenerating ? "AI is writing..." : "Generate AI Draft"}
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        <Textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Your review will appear here..."
          className={cn(
            "min-h-[160px] p-4 text-base resize-none rounded-2xl border-2 transition-all duration-300",
            isDarkTheme
              ? "bg-zinc-900/50 border-zinc-800 focus:border-primary/50 text-zinc-100"
              : "bg-white border-zinc-100 focus:border-primary/50 text-zinc-900",
            (isGenerating || isTranscribing) && "animate-pulse",
          )}
        />
        {(isTranscribing || isGenerating) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-2xl backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-medium text-primary">
                {isTranscribing ? "Transcribing voice..." : "AI is drafting..."}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 flex flex-col items-center">
        <Button
          onClick={handleCopyAndPlaceReview}
          disabled={
            !reviewText.trim() || isGenerating || isTranscribing || isCopied
          }
          style={{ backgroundColor: config.primaryColor }}
          variant={"outline"}
          className="w-fit text-white"
        >
          {isCopied ? (
            <>
              <Check className="w-6 h-6" />
              Copied & Opening Google...
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy Review & Place Google Review
              <ExternalLink className="w-4 h-4 opacity-50" />
            </>
          )}
        </Button>

        <p
          className={cn(
            "text-[10px] text-center uppercase tracking-widest font-extrabold",
            "bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent opacity-80",
          )}
        >
          Taptify AI
        </p>
      </div>
    </div>
  );
}
