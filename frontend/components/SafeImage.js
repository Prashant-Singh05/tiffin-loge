import React, { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';

/**
 * SafeImage component that gracefully handles image loading errors
 * If image fails to load or is not found, it simply doesn't render anything
 */
const SafeImage = ({ source, style, resizeMode = 'cover', ...props }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If error occurred, don't render anything
  if (hasError) {
    return null;
  }

  // If no source provided, don't render
  if (!source) {
    return null;
  }

  return (
    <Image
      source={source}
      style={style}
      resizeMode={resizeMode}
      onError={() => {
        setHasError(true);
        setIsLoading(false);
      }}
      onLoad={() => {
        setIsLoading(false);
      }}
      {...props}
    />
  );
};

export default SafeImage;

