import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

const NavAnimationContext = createContext({
  translateY: new Animated.Value(0),
  opacity: new Animated.Value(1),
  handleScroll: () => {},
  show: () => {},
  hide: () => {},
});

export const useNavAnimation = () => useContext(NavAnimationContext);

export const NavAnimationProvider = ({ children }) => {
  const translateY = useRef(new Animated.Value(0)).current; // 0 visible, 80 hidden
  const opacity = useRef(new Animated.Value(1)).current; // 1 visible, 0 hidden
  const lastScrollY = useRef(0);
  const isVisibleRef = useRef(true);
  const idleTimerRef = useRef(null);

  const animateTo = (toValue) => {
    const goingDown = toValue > 0;
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: goingDown ? 80 : 0, // clamp around navbar height
        duration: goingDown ? 200 : 220,
        easing: goingDown ? Easing.in(Easing.cubic) : Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: goingDown ? 0 : 1,
        duration: goingDown ? 160 : 180,
        delay: 50, // small overlap for natural motion
        useNativeDriver: true,
      }),
    ]).start();
  };

  // --- refined motion: Swiggy-style ---
  const show = () => {
    if (isVisibleRef.current) return;
    isVisibleRef.current = true;

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        stiffness: 180,
        damping: 16,
        mass: 0.8,
        overshootClamping: false,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        delay: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hide = () => {
    if (!isVisibleRef.current) return;
    isVisibleRef.current = false;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 80,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleScroll = (e) => {
    const currentY = e?.nativeEvent?.contentOffset?.y ?? 0;
    const deltaY = currentY - lastScrollY.current;
    lastScrollY.current = currentY;

    // ignore micro jitter
    if (Math.abs(deltaY) < 8) return;

    if (deltaY > 0) {
      // scrolling down
      hide();
    } else if (deltaY < 0) {
      // scrolling up
      show();
    }

    // keep visible a bit after idle
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (isVisibleRef.current) {
        show();
      }
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <NavAnimationContext.Provider value={{ translateY, opacity, handleScroll, show, hide }}>
      {children}
    </NavAnimationContext.Provider>
  );
};
