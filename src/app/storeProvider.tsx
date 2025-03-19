"use client"; // ✅ This makes it a Client Component

import { Provider } from "react-redux";
import store from "@/store/store"; // Import the Redux store

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
