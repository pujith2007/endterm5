import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/projects/ProjectCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Compass,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'Mobile App',
  'AI / Machine Learning',
  'Data Science',
  'Blockchain / Web3',
  'IoT / Robotics',
  'Game Development',
  'Open Source',
];

const ExploreProjectsPage = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'All');
  const [techFilter, setTechFilter] = useState(searchParams.get('tech') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || (isAuthenticated ? 'compatibility' : 'newest'));

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus && selectedStatus !== 'All') params.status = selectedStatus;
      if (techFilter.trim()) params.tech = techFilter.trim();
      if (sortBy) params.sort = sortBy;

      const res = await projectsAPI.getProjects(params);
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, selectedStatus, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setTechFilter('');
    setSortBy(isAuthenticated ? 'compatibility' : 'newest');
  };

  const isFilteringActive =
    searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All' || techFilter;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider border border-brand-200">
          <Compass className="w-3.5 h-3.5 text-brand-600" />
          Discovery Hub
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Student Projects
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Search open initiatives across universities. Filter by tech stack, category, or sort by
          your profile skill compatibility.
        </p>
      </div>

      {/* Search & Main Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects by title, keywords, or tech stack..."
              className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              placeholder="Filter tech (e.g. Python)"
              className="w-36 sm:w-44 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />

            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1.5"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Status:
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="All">All Statuses</option>
                <option value="Recruiting">Recruiting Only</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {isAuthenticated && (
                  <option value="compatibility">Highest Skill Match</option>
                )}
                <option value="newest">Newest Projects</option>
                <option value="spots">Most Open Spots</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">
              Showing <strong>{projects.length}</strong> {projects.length === 1 ? 'project' : 'projects'}
            </span>
            {isFilteringActive && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-rose-600 font-semibold rounded hover:bg-slate-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Projects */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Searching and scoring projects...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <ProjectCard key={proj._id} project={proj} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No matching projects found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or switching category pills.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreProjectsPage;
