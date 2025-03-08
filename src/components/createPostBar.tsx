"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Loader2, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface CreatePostProps {
  onSubmit: (content: string, image?: File) => void;
  isSubmitting?: boolean;
}

export function CreatePost({
  onSubmit,
  isSubmitting = false,
}: CreatePostProps) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (content.trim() || image) {
      onSubmit(content, image || undefined);
      setContent("");
      setImage(null);
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's happening?"
                className="min-h-[80px] resize-none border-none p-0 focus-visible:ring-0"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
              />
              <AnimatePresence>
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative mt-2 overflow-hidden rounded-lg"
                  >
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-[300px] w-full object-cover"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-4 py-2">
          <div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
            >
              <ImageIcon className="h-5 w-5 text-primary" />
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={(!content.trim() && !image) || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
