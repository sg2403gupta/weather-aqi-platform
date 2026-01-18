import React from "react";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-10 fade-in">
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Brand / Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-gray-800 dark:text-white">
              Weather & AQI Platform
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Powered by Open-Meteo • Optimized with modern data structures
            </p>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "React",
              "Tailwind",
              "Recharts",
              "Node.js",
              "Express",
              "MongoDB",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs font-semibold rounded-full 
                           bg-gradient-to-r from-blue-50 to-indigo-50
                           dark:from-gray-700 dark:to-gray-600
                           text-blue-700 dark:text-gray-200"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-4 pt-2">
            {[
              {
                href: "https://github.com/yourusername",
                label: "GitHub",
                icon: Github,
              },
              {
                href: "https://linkedin.com/in/yourprofile",
                label: "LinkedIn",
                icon: Linkedin,
              },
              {
                href: "mailto:your.email@example.com",
                label: "Email",
                icon: Mail,
              },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group p-3 rounded-xl bg-gray-100 dark:bg-gray-700
                           hover:bg-blue-600 dark:hover:bg-blue-600
                           transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <Icon className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-white" />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

          {/* Copyright */}
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by
            Shubham Gupta• {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
