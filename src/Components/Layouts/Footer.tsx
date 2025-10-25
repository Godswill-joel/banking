
"use client";

import Image from "next/image";
import Link from "next/link";
import { footer } from "@/data/data";
import   Icon   from "@/Components/Pages/Icon";

export default function Footer() {
  return (
    <footer role="contentinfo" className="bg-[#0b0b0b] text-gray-300">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 py-12 lg:py-18">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {/* Decorative logo — use Image if you have an SVG/PNG */}
              {footer.brand.logo ? (
                <Image
                  src={footer.brand.logo}
                  alt={`${footer.brand.name} logo`}
                  width={120}
                  height={36}
                  className="object-contain"
                />
              ) : (
                <span className="text-lg font-bold">{footer.brand.name}</span>
              )}
            </div>

            <div className="text-2xl text-gray-400 space-y-1">
              {footer.brand.legalLines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>

            {/* <div className="flex flex-col gap-3 mt-2">
              {footer.brand.appButtons.map((b) => (
                <a
                  key={b.id}
                  href={b.href}
                  target={b.external ? "_blank" : undefined}
                  rel={b.external ? "noopener noreferrer" : undefined}
                  aria-label={b.alt}
                  className="inline-flex items-center gap-3 w-max rounded-lg border border-gray-700 px-3 py-2 bg-transparent hover:bg-white/5 transition focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                >
                  {b.img ? (
                    <Image
                      src={b.img}
                      alt={b.alt}
                      width={140}
                      height={48}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-2xl font-medium text-gray-200">{b.label}</span>
                  )}
                </a>
              ))}
            </div> */}
          </div>

          {footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="space-y-3">
              <h3 className="text-2xl font-semibold text-gray-200">{col.title}</h3>

              <ul className="space-y-2">
                {col.links.map((link) => {
                  const isExternal = !!link.external;
                  return (
                    <li key={link.label}>
                      {link.icon ? (
                        <a
                          href={link.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition focus:outline-none focus:ring-2 focus:ring-yellow-500/30 rounded-sm px-1 py-0.5"
                          aria-label={link.label}
                        >
                          <Icon name={link.icon} className="w-4 h-4" aria-hidden="true" />
                          <span className="text-2xl">{link.label}</span>
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-2xl text-gray-400 hover:text-gray-200 transition focus:outline-none focus:ring-2 focus:ring-yellow-500/30 rounded-sm px-1 py-0.5 inline-block"
                          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Bottom copyright band */}
      <div className="bg-[#070707]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 py-4 text-sm text-gray-500">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div>NMLS ID#1906809 • © 2025 River Financial Inc. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a
                href="/licenses"
                className="text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 rounded-sm px-1 py-0.5"
              >
                Licenses
              </a>
              <a
                href="/privacy"
                className="text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 rounded-sm px-1 py-0.5"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 rounded-sm px-1 py-0.5"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
