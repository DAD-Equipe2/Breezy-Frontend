import { useState, useRef, useEffect } from "react";

export default function ProfileMenuBurger({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-blue-900 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-blue-800 shadow transition focus:outline-none"
        aria-label="Ouvrir le menu profil"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-blue-950 border border-gray-200 dark:border-blue-900 rounded-xl shadow-lg z-50 animate-fade-in">
          <button
            className="w-full text-left px-4 py-3 hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-900 dark:text-white rounded-t-xl transition"
            onClick={() => { setOpen(false); onEdit(); }}
            type="button"
          >
            Modifier le profil
          </button>
          <button
            className="w-full text-left px-4 py-3 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded-b-xl transition"
            onClick={() => { setOpen(false); onDelete(); }}
            type="button"
          >
            Supprimer le profil
          </button>
        </div>
      )}
    </div>
  );
}
