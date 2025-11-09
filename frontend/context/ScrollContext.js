import React, { createContext, useContext, useState } from 'react';

const ScrollContext = createContext({ direction: 'up', setDirection: () => {} });

export const useScrollDirection = () => useContext(ScrollContext);

export const ScrollProvider = ({ children }) => {
  const [direction, setDirection] = useState('up'); // 'up' | 'down'
  return (
    <ScrollContext.Provider value={{ direction, setDirection }}>
      {children}
    </ScrollContext.Provider>
  );
};

export default ScrollContext;
