"use client";

import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  primaryLabel: string;
  onPrimary: () => void;
  onClose?: () => void;
  children?: ReactNode;
}

export function Modal({
  open,
  title,
  description,
  primaryLabel,
  onPrimary,
  onClose,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onPrimary}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
