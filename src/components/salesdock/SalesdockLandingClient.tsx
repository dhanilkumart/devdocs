"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getSalesdockDocs, SalesdockDoc } from "@/data/salesdock-docs";

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  doc?: SalesdockDoc;
  children: TreeNode[];
}

export function SalesdockLandingClient() {
  const allDocs = useMemo(() => getSalesdockDocs(), []);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    root: true,
    api: true,
    components: true,
    "components/admin": true,
    "components/discounts": true,
    types: true,
    utils: true,
  });

  const toggleFolder = (folderPath: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  // Build full hierarchy tree from docs
  const tree = useMemo(() => {
    const root: TreeNode = { name: "Salesdock Project", path: "root", isFolder: true, children: [] };

    const getOrCreateFolderNode = (folderPath: string): TreeNode => {
      if (!folderPath || folderPath === ".") return root;
      const parts = folderPath.split("/");
      let current = root;
      let currentPath = "";

      for (const part of parts) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        let found = current.children.find((child) => child.isFolder && child.name === part);
        if (!found) {
          found = { name: part, path: currentPath, isFolder: true, children: [] };
          current.children.push(found);
        }
        current = found;
      }
      return current;
    };

    allDocs.forEach((doc) => {
      const parentFolderNode = getOrCreateFolderNode(doc.folder);
      parentFolderNode.children.push({
        name: doc.filename,
        path: doc.path,
        isFolder: false,
        doc,
        children: [],
      });
    });

    // Sort folders first, then files alphabetically
    const sortTree = (node: TreeNode) => {
      node.children.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1;
        if (!a.isFolder && b.isFolder) return 1;
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortTree);
    };

    sortTree(root);
    return root;
  }, [allDocs]);


  const renderTreeNodes = (node: TreeNode, depth = 0): React.ReactNode => {
    if (node.isFolder) {
      if (node.path !== "root") {
        const isOpen = openFolders[node.path] ?? true;
        return (
          <div key={node.path} className="select-none">
            <button
              onClick={() => toggleFolder(node.path)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm font-semibold text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800/60 transition"
              style={{ paddingLeft: `${depth * 14 + 10}px` }}
            >
              <svg
                className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <svg className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H2V6z" />
                <path d="M2 9h16v6a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
              </svg>
              <span>{node.name}</span>
              <span className="ml-auto text-xs font-normal text-zinc-400 dark:text-zinc-500">
                {node.children.length} {node.children.length === 1 ? "item" : "items"}
              </span>
            </button>

            {isOpen && (
              <div className="border-l border-zinc-200/80 dark:border-zinc-800/80 ml-4">
                {node.children.map((child) => renderTreeNodes(child, depth + 1))}
              </div>
            )}
          </div>
        );
      } else {
        return node.children.map((child) => renderTreeNodes(child, depth));
      }
    } else if (node.doc) {
      const doc = node.doc;
      const isTest = doc.filename.includes(".test.");
      const isConfig = doc.filename.includes("config") || doc.filename.endsWith(".json.md") || doc.filename.startsWith("tsconfig");

      return (
        <div key={doc.id} className="my-0.5">
          <Link
            href={`/salesdock-assignment/${encodeURIComponent(doc.routeSlug)}`}
            className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm text-zinc-700 hover:bg-sky-50 hover:text-sky-700 dark:text-zinc-300 dark:hover:bg-sky-950/40 dark:hover:text-sky-300 transition"
            style={{ paddingLeft: `${depth * 14 + 10}px` }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <svg className="h-4 w-4 shrink-0 text-sky-500 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-mono text-xs font-medium truncate group-hover:underline">
                {doc.filename}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              {isTest && (
                <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                  TEST
                </span>
              )}
              {isConfig && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  CONFIG
                </span>
              )}
              <svg className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-sky-500 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      );
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Box: Salesdock Interview Q&A Entry */}
      <div className="rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-sky-500/10 via-violet-500/5 to-transparent p-4 sm:p-6 dark:border-zinc-800 dark:from-sky-500/15 dark:via-violet-500/10">
        <Link
          href="/salesdock-assignment/interview-qa"
          className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-sky-500/30 bg-white/90 p-4 shadow-sm transition hover:border-sky-500 hover:bg-sky-50/50 hover:shadow-md dark:border-sky-900/50 dark:bg-zinc-900/90 dark:hover:border-sky-500/60 dark:hover:bg-zinc-900"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Salesdock Interview Q&amp;A
                </span>
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  Interview Prep
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Comprehensive questions and detailed answers covering system architecture, type design, calculations, and checkout state.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform">
            <span>Explore Q&amp;A</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Main Grid Layout: Interactive Tree + File Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Interactive Visual Tree View */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <h2 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                  Folder & File Hierarchy
                </h2>
              </div>
              <button
                onClick={() => {
                  const allOpen = Object.values(openFolders).every(Boolean);
                  const nextState: Record<string, boolean> = {};
                  Object.keys(openFolders).forEach((k) => (nextState[k] = !allOpen));
                  setOpenFolders(nextState);
                }}
                className="text-xs font-medium text-sky-600 hover:underline dark:text-sky-400"
              >
                {Object.values(openFolders).every(Boolean) ? "Collapse All" : "Expand All"}
              </button>
            </div>

            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {renderTreeNodes(tree)}
            </div>
          </div>
        </div>

        {/* Right Side: File Cards View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>All Documentation Files</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {allDocs.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allDocs.map((doc) => {
              const isTest = doc.filename.includes(".test.");

              return (
                <Link
                  key={doc.id}
                  href={`/salesdock-assignment/${encodeURIComponent(doc.routeSlug)}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-500/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-sky-500/50"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        <svg className="h-3 w-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H2V6z" />
                          <path d="M2 9h16v6a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
                        </svg>
                        {doc.folder}
                      </span>
                      {isTest && (
                        <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                          TEST
                        </span>
                      )}
                    </div>

                    <h3 className="font-mono text-sm font-bold text-zinc-900 group-hover:text-sky-600 dark:text-zinc-100 dark:group-hover:text-sky-400 transition">
                      {doc.filename}
                    </h3>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {doc.title}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-3 text-xs text-zinc-400">
                    <span className="font-mono text-[11px]">Markdown Spec</span>
                    <span className="flex items-center gap-1 font-semibold text-sky-600 group-hover:translate-x-1 dark:text-sky-400 transition-transform">
                      Read doc
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
