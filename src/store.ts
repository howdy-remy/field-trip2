import { configureStore } from "@reduxjs/toolkit";
import type { Action } from "@reduxjs/toolkit";
import { packsApi } from "./api/packs";
import { profileApi } from "./api/profile";
import { itemsApi } from "./api/items";
import { packCategoryItemApi } from "./api/packCategoryItem";

interface CounterState {
  value: number;
}

// An example slice reducer function that shows how a Redux reducer works inside.
// We'll replace this soon with real app logic.
function counterReducer(state: CounterState = { value: 0 }, action: Action) {
  switch (action.type) {
    // Handle actions here
    default: {
      return state;
    }
  }
}

export const store = configureStore({
  reducer: {
    [itemsApi.reducerPath]: itemsApi.reducer,
    [packsApi.reducerPath]: packsApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [packCategoryItemApi.reducerPath]: packCategoryItemApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      itemsApi.middleware,
      packsApi.middleware,
      profileApi.middleware,
      packCategoryItemApi.middleware
    ),
});

// Infer the type of `store`
export type AppStore = typeof store;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch;
// Same for the `RootState` type
export type RootState = ReturnType<typeof store.getState>;
