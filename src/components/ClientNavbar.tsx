"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ClientNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on admin and login pages
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) {
    return null;
  }
  
  return <Navbar />;
}
