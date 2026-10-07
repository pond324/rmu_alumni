"use client";
import React from "react";

// ==========================================
// Base Skeleton Primitive
// ==========================================
export const Skeleton = ({
  className = "",
  style = {},
  rounded = "rounded-lg",
  ...props
}) => {
  return (
    <div
      className={`skeleton-shimmer animate-pulse ${rounded} ${className}`}
      style={style}
      {...props}
    />
  );
};

// ==========================================
// 1. Work History / Experience Skeletons
// ==========================================
export const WorkCardSkeleton = () => {
  return (
    <div className="w-full flex flex-col mt-5 p-5 rounded-xl border border-gray-200 bg-white shadow-sm space-y-4">
      {/* Header: Title & Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 w-3/4">
          <Skeleton className="w-9 h-9 rounded-lg shrink-0 bg-blue-100" />
          <div className="space-y-1.5 w-full">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-7 h-7 rounded-md" />
          <Skeleton className="w-7 h-7 rounded-md" />
        </div>
      </div>

      {/* Meta tags: Company, Location, Salary, Dates */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded shrink-0" />
          <Skeleton className="h-4 w-3/5" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded shrink-0" />
          <Skeleton className="h-4 w-2/5" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded shrink-0" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded shrink-0" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Detail description */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
      </div>

      {/* Responsibilities & Skills */}
      <div className="space-y-2 pt-2">
        <Skeleton className="h-3.5 w-1/4" />
        <Skeleton className="h-3 w-4/5 ml-2" />
        <Skeleton className="h-3.5 w-1/5 mt-2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
};

export const WorkListSkeleton = () => {
  return (
    <div className="w-full flex flex-col p-5 animate-fadeIn">
      {/* Top Banner & Stats Overview */}
      <div className="w-full flex flex-col p-4 bg-gradient-to-r from-gray-50 via-sky-50 to-green-50 mb-5 rounded-2xl border border-gray-200/60 shadow-xs">
        <div className="w-full mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        {/* 5 Stats Cards Grid */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-gray-200/70 shadow-xs"
            >
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="space-y-1.5 w-full">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white mt-5 p-4 w-full flex flex-col border border-gray-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="mt-2 flex items-center justify-between flex-col gap-4 lg:flex-row">
            <Skeleton className="h-10 w-full lg:w-1/2 rounded-lg" />
            <Skeleton className="h-10 w-full lg:w-1/4 rounded-lg" />
            <Skeleton className="h-10 w-full lg:w-1/4 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="w-full grid lg:grid-cols-3 gap-5 gap-y-1 grid-cols-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <WorkCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 2. Dashboard Skeletons
// ==========================================
export const DashboardSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-10 rounded-lg" />
        ))}
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          "from-blue-500/10 to-sky-400/10",
          "from-emerald-500/10 to-teal-400/10",
          "from-amber-500/10 to-orange-400/10",
          "from-purple-500/10 to-indigo-400/10",
        ].map((gradient, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl bg-gradient-to-br ${gradient} bg-white border border-slate-200/80 shadow-xs flex items-center justify-between`}
          >
            <div className="space-y-2 w-3/4">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Big Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3.5 w-64" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          {/* Simulated Bars */}
          <div className="h-72 w-full flex items-end justify-between gap-4 pt-6 px-4">
            {[55, 80, 45, 90, 65, 40, 75, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <Skeleton
                  className="w-full rounded-t-md"
                  style={{ height: `${h}%` }}
                />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Pie Chart (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1.5 pb-3 border-b border-slate-100">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-52" />
          </div>
          <div className="flex items-center justify-center py-6">
            <Skeleton className="w-48 h-48 rounded-full" />
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <Skeleton className="h-5 w-48" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3.5 flex-1 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <Skeleton className="h-5 w-48" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3.5 flex-1 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. Alumni Search & Table Skeletons
// ==========================================
export const AlumniSearchCardSkeleton = () => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-14 rounded-full shrink-0" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-4.5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
      <Skeleton className="h-9 w-full rounded-xl mt-2" />
    </div>
  );
};

export const TableSkeleton = ({ rows = 7, cols = 5 }) => {
  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="bg-slate-50/80 p-4 border-b border-slate-200 flex items-center justify-between gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Table Rows */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton
                key={c}
                className={`h-4 flex-1 ${c === 0 ? "max-w-[40px]" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. User Profile Skeletons
// ==========================================
export const ProfileSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-6 p-5 lg:p-8 lg:px-10 bg-slate-50/50 min-h-screen">
      {/* Header Profile Hero Card */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col lg:flex-row items-center gap-6">
        <Skeleton className="w-28 h-28 lg:w-32 lg:h-32 rounded-full shrink-0" />
        <div className="flex-1 space-y-3 text-center lg:text-left w-full">
          <Skeleton className="h-7 w-56 mx-auto lg:mx-0" />
          <Skeleton className="h-4 w-72 mx-auto lg:mx-0" />
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 rounded-xl shrink-0" />
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Form Fields Grid */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <Skeleton className="h-6 w-44" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. News & Activity Skeletons
// ==========================================
export const NewsCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs space-y-4 flex flex-col">
      {/* Thumbnail */}
      <Skeleton className="w-full aspect-video rounded-none" />
      {/* Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3.5 w-full mt-2" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

export const NewsListSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Tabs */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Featured Banner Skeleton */}
      <div className="w-full aspect-[21/9] max-h-96 rounded-3xl overflow-hidden shadow-sm">
        <Skeleton className="w-full h-full rounded-3xl" />
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const NewsDetailSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-9 w-28 rounded-xl" />
      <Skeleton className="w-full aspect-video rounded-3xl shadow-sm" />
      <div className="space-y-3 pt-2">
        <Skeleton className="h-8 w-4/5" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};

// ==========================================
// 6. Privacy & Settings Skeletons
// ==========================================
export const PrivacySkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <Skeleton className="h-5 w-44" />
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="py-4 flex items-center justify-between gap-4">
              <div className="space-y-1.5 w-3/4">
                <Skeleton className="h-4.5 w-1/3" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
              <Skeleton className="w-12 h-6 rounded-full shrink-0" />
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
