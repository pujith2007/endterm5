import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center text-white shadow-sm">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Crew<span className="text-brand-600">Up</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              The premier student team finder and collaboration ecosystem. Match complementary
              technical skills, pitch ambitious hackathon ideas, and organize agile sprints.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Full MERN Stack Active
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">MongoDB + Express + React + Node</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/explore" className="hover:text-brand-600 transition-colors">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-600 transition-colors">
                  Personal Dashboard
                </Link>
              </li>
              <li>
                <Link to="/projects/create" className="hover:text-brand-600 transition-colors">
                  Start a Project
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="hover:text-brand-600 transition-colors">
                  Application Alerts
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Tech */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Features
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="text-brand-600">✓</span> Smart Skill Matching
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-brand-600">✓</span> In-App Application Flow
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-brand-600">✓</span> Kanban Task Board
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-brand-600">✓</span> Secure JWT Auth
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CrewUp Platform. Designed for university innovators.</p>
          <div className="flex items-center gap-1">
            <span>Built with passion and</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for student engineering success</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
