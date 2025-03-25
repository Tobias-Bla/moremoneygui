// components/layout.tsx
import React from 'react';
import Sidebar from "@/components/layout/Sidebar"; // Import your Sidebar component

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
