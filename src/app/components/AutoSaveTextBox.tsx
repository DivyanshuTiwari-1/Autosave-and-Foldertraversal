"use client";

import { useEffect, useState, useCallback } from "react";
import { useTextStore } from "../store/useTextStore";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface SaveTextResponse {
  success: boolean;
  savedText?: string;
  message?: string;
}

const AutoSaveTextBox = () => {
  const { text, setText, saveText } = useTextStore();
  const [typing, setTyping] = useState(false);
  const [savedText, setSavedText] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const memoizedSaveText = useCallback(() => saveText(), [saveText]);

  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
    
    const timeout = setTimeout(() => {
      if (typing) {
        setTyping(false);
        setEndTime(new Date());
        
        memoizedSaveText()?.then((response: SaveTextResponse) => {
          if (response?.success) {
            handleSaveSuccess(response.savedText || "");
          } else {
            toast.error(response?.message || "Failed to save text");
          }
        }).catch((error: Error) => {
          console.error("Error saving text:", error);
          toast.error("Failed to save text");
        });
      }
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [text, typing, startTime, memoizedSaveText]);  // ✅ Dependency added

  const handleSaveSuccess = (savedText: string) => {
    setSavedText(savedText);
    toast.success("Successfully saved!");
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 1500);
  };

  return (
    <motion.div
      className="max-w-xl mx-auto mt-6 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome to AutoSaving App</h1>
      
      <Card className="shadow-xl border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Auto-Saving Text Box</CardTitle>
          <CardDescription>Your content saves automatically as you type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Textarea
              value={text}
              onChange={(e) => {
                setTyping(true);
                setText(e.target.value);
              }}
              placeholder="Type something here..."
              className="min-h-[150px] text-base resize-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <AnimatePresence>
              {typing && (
                <motion.div
                  className="absolute top-2 right-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </motion.div>
              )}
              {showSaveSuccess && !typing && (
                <motion.div
                  className="absolute top-2 right-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {savedText && startTime && endTime && (
          <motion.div 
            className="mt-4 p-4 bg-muted rounded-lg text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold mb-2">Information saved:</h3>
            <div className="space-y-1.5">
              <p><span className="font-medium">Text:</span> {savedText}</p>
              <p><span className="font-medium">Start Time:</span> {startTime.toLocaleString()}</p>
              <p><span className="font-medium">End Time:</span> {endTime.toLocaleString()}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AutoSaveTextBox;
