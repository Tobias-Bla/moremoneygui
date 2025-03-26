// components/layout/ThemeSwitcher.tsx
"use client";

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="text-white"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
