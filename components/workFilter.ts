import { useSyncExternalStore } from "react";

let value = "All";
const subs = new Set<() => void>();

export function getWorkFilter(): string {
  return value;
}

export function setWorkFilter(f: string) {
  if (value === f) return;
  value = f;
  subs.forEach(s => s());
}

function subscribe(fn: () => void): () => void {
  subs.add(fn);
  return () => { subs.delete(fn); };
}

export function useWorkFilter(): string {
  return useSyncExternalStore(subscribe, getWorkFilter, () => "All");
}
