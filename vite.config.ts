import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',      // <-- Add this line right here
    plugins: [react()],
  })plugins: [react()],
});
