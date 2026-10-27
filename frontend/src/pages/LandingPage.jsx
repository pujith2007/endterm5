import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Sparkles,
  Compass,
  CheckCircle2,
  ArrowRight,
  Kanban,
  Cpu,
  Layers,
  ShieldCheck,
  Code2,
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, login } = useAuth();

  const handleQuickDemo = async (email) => {
    try {
      await login(email, 'password123');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Glow backdrop blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/20 via-purple-500/20 to-blue-500/20 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
            The Future of Student Project Collaboration
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Find your ideal project team. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Matched by technical skills.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            Stop struggling to find teammates for your semester projects, hackathons, and open-source ideas.
            CrewUp calculates real skill compatibility, connects student developers, and provides built-in Kanban workspaces.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 transition-all flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 transition-all flex items-center justify-center gap-2"
                >
                  Create Student Account
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/explore"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4 text-brand-600" />
                  Explore Projects
                </Link>
              </>
            )}
          </div>

          {/* Quick Demo Login Bar for Testing */}
          {!isAuthenticated && (
            <div className="pt-6">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                ⚡ Quick Demo Login (One-Click)
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handleQuickDemo('alex@student.edu')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 border border-slate-200 text-slate-700 transition-colors"
                >
                  👤 Alex (Full-Stack Dev)
                </button>
                <button
                  onClick={() => handleQuickDemo('sarah@student.edu')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 border border-slate-200 text-slate-700 transition-colors"
                >
                  👤 Sarah (AI / ML)
                </button>
                <button
                  onClick={() => handleQuickDemo('marcus@student.edu')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 border border-slate-200 text-slate-700 transition-colors"
                >
                  👤 Marcus (Mobile & Cloud)
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Live Platform Stats */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
          <div>
            <p className="text-3xl font-extrabold text-brand-600">75%+</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Avg Skill Fit
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">100%</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Real Backend Logic
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-indigo-600">5+</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Project Categories
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-600">Kanban</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Built-in Workspaces
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Engineered For Student Teams
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900">
            Everything you need to turn student ideas into real software.
          </h3>
          <p className="text-sm text-slate-600">
            From smart algorithmic matching to private team collaboration boards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Smart Skill Matching</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our algorithm compares your profile skills against project requirements,
              calculating exact percentage compatibility and highlighting matching vs. missing skills.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Team Applications & Reviews</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Apply to open projects with custom pitches. Project owners review applicant profiles,
              compare skill compatibility, and accept members with automatic team roster updates.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <Kanban className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Private Collaboration Workspace</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Approved teammates unlock a private Kanban board. Create tasks, assign them to team members,
              transition states (To Do → In Progress → Done), and track sprint progress.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Workflow */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
              Simple 4-Step Process
            </span>
            <h3 className="text-3xl font-extrabold">How CrewUp Connects Students</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <span className="w-8 h-8 rounded-full bg-brand-500 text-white font-black text-sm flex items-center justify-center">
                1
              </span>
              <h5 className="font-bold text-base">Setup Profile</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add your technical skills, university, interests, and GitHub repository portfolio.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <span className="w-8 h-8 rounded-full bg-indigo-500 text-white font-black text-sm flex items-center justify-center">
                2
              </span>
              <h5 className="font-bold text-base">Explore & Match</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse projects filtered by stack or category. See your real-time compatibility score.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <span className="w-8 h-8 rounded-full bg-violet-500 text-white font-black text-sm flex items-center justify-center">
                3
              </span>
              <h5 className="font-bold text-base">Apply & Approve</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Send an application note. Project owners accept qualified applicants with one click.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center">
                4
              </span>
              <h5 className="font-bold text-base">Sprint in Workspace</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Collaborate inside your private Kanban board, assign tasks, and build your capstone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 text-white text-center space-y-6 shadow-xl shadow-brand-500/20">
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to find your dream project crew?
          </h3>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-brand-100">
            Join students from top universities building web apps, AI algorithms, mobile tools, and decentralized networks.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-white text-brand-700 font-bold text-base shadow hover:bg-brand-50 transition-colors"
            >
              Get Started Now — It's Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
