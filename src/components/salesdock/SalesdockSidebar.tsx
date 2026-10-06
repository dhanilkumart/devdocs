"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSalesdockDocs, SalesdockDoc } from "@/data/salesdock-docs";

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  doc?: SalesdockDoc;
  children: TreeNode[];
}

export function SalesdockSidebar() {
  const pathname = usePathname();
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

  // Build tree hierarchy identical to landing page
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

  // Helper to check if a doc file is currently open
  const isDocActive = (doc: SalesdockDoc): boolean => {
    if (!pathname) return false;
    const currentSlug = pathname.replace(/^\/salesdock-assignment\/?/, "");
    const decodedSlug = decodeURIComponent(currentSlug).toLowerCase();

    return (
      doc.filename.toLowerCase() === decodedSlug ||
      doc.slugWithoutExt.toLowerCase() === decodedSlug ||
      doc.path.toLowerCase() === decodedSlug ||
      doc.id.toLowerCase() === decodedSlug
    );
  };

  const renderTreeNodes = (node: TreeNode, depth = 0): React.ReactNode => {
    if (node.isFolder) {
      if (node.path !== "root") {
        const isOpen = openFolders[node.path] ?? true;
        return (
          <div key={node.path} className="select-none my-1">
            <button
              onClick={() => toggleFolder(node.path)}
              className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/60 transition"
              style={{ paddingLeft: `${depth * 10 + 6}px` }}
            >
              <svg
                className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <svg className="h-3.5 w-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H2V6z" />
                <path d="M2 9h16v6a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
              </svg>
              <span className="truncate">{node.name}</span>
            </button>

            {isOpen && (
              <div className="border-l border-zinc-200/80 dark:border-zinc-800/80 ml-3.5">
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
      const active = isDocActive(doc);

      return (
        <div key={doc.id} className="my-0.5">
          <Link
            href={`/salesdock-assignment/${encodeURIComponent(doc.filename)}`}
            className={`group flex items-center justify-between rounded-md px-2 py-1 text-xs transition border-l-2 -ml-px ${
              active
                ? "border-sky-500 bg-sky-50 font-semibold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-400"
                : "border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
            }`}
            style={{ paddingLeft: `${depth * 10 + 8}px` }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <svg
                className={`h-3.5 w-3.5 shrink-0 ${
                  active ? "text-sky-500 dark:text-sky-400" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-mono text-[11px] truncate">{doc.filename}</span>
            </div>
          </Link>
        </div>
      );
    }
  };

  return (
    <nav className="space-y-4 text-xs" aria-label="Salesdock Folder Hierarchy">
      {/* Top Header Card */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-2.5">
        <Link
          href="/salesdock-assignment"
          className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 hover:text-sky-600 dark:hover:text-sky-400 transition"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </span>
          <span className="text-xs tracking-tight">Salesdock Files</span>
        </Link>
        <Link
          href="/salesdock-assignment"
          className="text-[10px] font-semibold text-sky-600 hover:underline dark:text-sky-400"
        >
          Landing
        </Link>
      </div>

      {/* Tree structure */}
      <div className="space-y-1">
        {renderTreeNodes(tree)}
      </div>
    </nav>
  );
}
