"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export const DEFAULT_AVATAR_PLACEHOLDER = "/placeholder-avatar.svg";
export const DEFAULT_IMAGE_PLACEHOLDER = "/placeholder-image.svg";

/**
 * SafeImage Component
 * Handles missing, null, undefined, empty, or corrupted image URLs.
 * Automatically falls back to a placeholder image or custom fallback element.
 */
export default function SafeImage({
  src,
  alt = "image",
  type = "image", // "avatar" | "image"
  fallbackType,
  fallbackSrc,
  fallbackContent,
  className = "",
  style = {},
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  unoptimized = false,
  useNativeImg = false,
  onError,
  ...rest
}) {
  const resolvedType = fallbackType || type || "image";
  const defaultFallback =
    resolvedType === "avatar" ? DEFAULT_AVATAR_PLACEHOLDER : DEFAULT_IMAGE_PLACEHOLDER;
  const effectiveFallback = fallbackSrc || defaultFallback;

  const [imgSrc, setImgSrc] = useState(src || effectiveFallback);
  const [hasError, setHasError] = useState(!src);

  // Sync state when src prop changes
  useEffect(() => {
    if (!src || typeof src !== "string" || src.trim() === "" || src.includes("undefined") || src.includes("null")) {
      setImgSrc(effectiveFallback);
      setHasError(true);
    } else {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src, effectiveFallback]);

  const handleError = (e) => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(effectiveFallback);
      if (onError && typeof onError === "function") {
        onError(e);
      }
    }
  };

  // If custom React element is provided and error occurred
  if (hasError && fallbackContent) {
    return <div className={className} style={style}>{fallbackContent}</div>;
  }

  // If using native <img> tag or width/height are not set and fill is false
  if (useNativeImg || (!width && !height && !fill)) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        style={style}
        onError={handleError}
        {...rest}
      />
    );
  }

  // Next.js Image component
  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      fill={fill}
      priority={priority}
      sizes={sizes}
      unoptimized={unoptimized || typeof imgSrc === "string" && imgSrc.startsWith("http")}
      onError={handleError}
      {...rest}
    />
  );
}
