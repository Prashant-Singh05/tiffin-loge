import { createSlice } from '@reduxjs/toolkit';

const initialState = { items: [], total: 0, providerId: null, providerName: null };

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload; // {id, name, price, image, providerId, providerName}
      if (state.providerId && state.providerId !== item.providerId) {
        state.items = [];
        state.total = 0;
      }
      state.providerId = item.providerId;
      state.providerName = item.providerName;
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) existing.qty += 1;
      else state.items.push({ ...item, qty: 1 });
      state.total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    },
    removeItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      state.total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
      if (state.items.length === 0) {
        state.providerId = null;
        state.providerName = null;
      }
    },
    incrementQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.qty += 1;
      state.total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    },
    decrementQty: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        if (item.qty > 1) item.qty -= 1;
        else state.items = state.items.filter((i) => i.id !== id);
      }
      state.total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
      if (state.items.length === 0) {
        state.providerId = null;
        state.providerName = null;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.providerId = null;
      state.providerName = null;
    },
    hydrateCart: (state, action) => {
      const data = action.payload;
      if (!data) return;
      state.items = data.items || [];
      state.total = data.total || 0;
      state.providerId = data.providerId || null;
      state.providerName = data.providerName || null;
    },
  },
});

export const { addItem, removeItem, incrementQty, decrementQty, clearCart, hydrateCart } = slice.actions;
export default slice.reducer;
