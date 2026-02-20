"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BubbleNav from "./BubbleNav";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let lastChangeTime = 0;

    const handleScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      const now = Date.now();

      if (y <= 50) {
        setScrolled(false);
        lastChangeTime = now;
      } else if (delta > 8) {
        setScrolled(true);
        lastChangeTime = now;
      } else if (delta < -30 && now - lastChangeTime > 300) {
        setScrolled(false);
        lastChangeTime = now;
      }

      lastY = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
    {/* test */}
      <nav
        className="fixed top-5 left-0 right-0 z-1000 max-md:top-0 max-md:bg-bg/50 max-md:backdrop-blur-xl max-md:border-b max-md:border-white/5"
        style={{ padding: "20px 0" }}
      >
        <div className="max-w-350 mx-auto px-12 max-md:px-6 flex items-center relative">
          {/* Logo — left (fades out + slides toward center on scroll, stays visible on mobile) */}
          <div
            className="shrink-0"
            style={{
              opacity: scrolled && !isMobile ? 0 : 1,
              transform: scrolled && !isMobile ? "translateX(60px) scale(0.95)" : "translateX(0) scale(1)",
              transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              pointerEvents: scrolled && !isMobile ? "none" : "auto",
            }}
          >
            <Link
              href="/"
              className="text-[22px] font-bold text-text no-underline tracking-[-0.4px] flex items-center gap-2.5"
            >
              <span className="logo-dot" />
              klema creative
            </Link>
          </div>

          {/* Bubble Nav — absolutely centered on the bar */}
          <div className="absolute left-1/2 -translate-x-1/2 max-md:hidden">
            <BubbleNav collapsed={scrolled} />
          </div>

          {/* Book a Call CTA — right (fades out + slides toward center on scroll) */}
          <div
            className="ml-auto max-md:hidden shrink-0"
            style={{
              opacity: scrolled ? 0 : 1,
              transform: scrolled ? "translateX(-60px) scale(0.95)" : "translateX(0) scale(1)",
              transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              pointerEvents: scrolled ? "none" : "auto",
            }}
          >
            <Link
              href="/contact"
              className="bg-text text-bg px-6 py-2.5 rounded-full font-semibold text-[13px] tracking-[0.02em] transition-all duration-300 hover:bg-accent hover:text-black hover:shadow-[0_0_20px_rgba(74,222,128,0.2)] hover:-translate-y-px no-underline"
            >
              Book a Call
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="hidden max-md:block ml-auto bg-transparent border-none p-2 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-[1.5px] bg-text my-1" />
            <span className="block w-5 h-[1.5px] bg-text my-1" />
            <span className="block w-5 h-[1.5px] bg-text my-1" />
          </button>
        </div>
      </nav>

      {/* Mobile Nav - outside nav to avoid backdrop-filter stacking context */}
      {menuOpen && (
        <div className="fixed inset-0 z-[1001] bg-bg flex flex-col md:hidden">
          {/* Close button */}
          <div className="flex justify-end p-6">
            <button
              onClick={closeMenu}
              className="bg-transparent border-none p-2 cursor-pointer text-text"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu links */}
          <ul className="list-none flex-1 flex flex-col items-center justify-center gap-8 m-0 p-0">
            <li>
              <Link href="/" onClick={closeMenu} className="text-text text-2xl font-medium no-underline transition-colors duration-300 hover:text-accent">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" onClick={closeMenu} className="text-text text-2xl font-medium no-underline transition-colors duration-300 hover:text-accent">
                Services
              </Link>
            </li>
            <li>
              <Link href="/packages" onClick={closeMenu} className="text-text text-2xl font-medium no-underline transition-colors duration-300 hover:text-accent">
                Packages
              </Link>
            </li>
            <li className="mt-4">
              <Link href="/contact" onClick={closeMenu} className="bg-text text-bg px-8 py-3 rounded-full font-semibold text-base tracking-[0.02em] transition-all duration-300 hover:bg-accent hover:text-black no-underline">
                Book a Call
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
