"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type EditableValues = Record<string, string | null>;

type Ctx = {
  initial: EditableValues;
  values: EditableValues;
  get: (key: string) => string | null;
  set: (key: string, value: string | null) => void;
  reset: () => void;
  dirty: boolean;
  diff: EditableValues; // kun de nøklene som er endret
};

const EditableContextInternal = createContext<Ctx | null>(null);

export function EditableProvider({
  initial,
  children,
}: {
  initial: EditableValues;
  children: ReactNode;
}) {
  const [values, setValues] = useState<EditableValues>(initial);

  const get = useCallback((key: string) => values[key] ?? null, [values]);

  const set = useCallback((key: string, value: string | null) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => setValues(initial), [initial]);

  const diff = useMemo<EditableValues>(() => {
    const changed: EditableValues = {};
    for (const key of Object.keys(values)) {
      if ((values[key] ?? null) !== (initial[key] ?? null)) {
        changed[key] = values[key] ?? null;
      }
    }
    return changed;
  }, [values, initial]);

  const dirty = Object.keys(diff).length > 0;

  const value = useMemo<Ctx>(
    () => ({ initial, values, get, set, reset, dirty, diff }),
    [initial, values, get, set, reset, dirty, diff],
  );

  return <EditableContextInternal.Provider value={value}>{children}</EditableContextInternal.Provider>;
}

export function useEditable() {
  const ctx = useContext(EditableContextInternal);
  if (!ctx) throw new Error("useEditable må brukes inne i <EditableProvider>");
  return ctx;
}
