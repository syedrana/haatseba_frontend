// components/AsyncProductSelect.jsx
"use client";
import axios from "axios";
import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function AsyncProductSelect({ value, onChange, token, placeholder = "Search product..." }) {
  const [q, setQ] = useState(value?.label || "");
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapper = useRef();
  const debounce = useRef();

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapper.current && !wrapper.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const fetchOptions = async (text) => {
    if (!text || !token) return setOptions([]);
    try {
      const res = await axios.get(`${API_BASE}/searchproduct`, {
        params: { query: text },
        headers: { Authorization: `Bearer ${token}` },
      });
      setOptions((res.data.products || []).map(p => ({
        value: p._id, label: p.name, image: p.image, extra: p.price
      })));
      setHighlight(0);
      setOpen(true);
    } catch (err) {
      setOptions([]);
    }
  };

  const onInput = (v) => {
    setQ(v);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(()=> fetchOptions(v.trim()), 220);
    setOpen(true);
  };

  const handleKey = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight(h => Math.min(h+1, options.length-1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHighlight(h => Math.max(h-1, 0)); }
    if (e.key === "Enter") {
      e.preventDefault();
      if (options[highlight]) selectOption(options[highlight]);
    }
    if (e.key === "Escape") { setOpen(false); }
  };

  const selectOption = (opt) => {
    onChange(opt);
    setQ(opt.label);
    setOpen(false);
  };

  useEffect(() => {
    if (value?.label) setQ(value.label);
  }, [value]);

  const highlightMatch = (text) => {
    if (!q) return text;
    const regex = new RegExp(`(${escapeRegExp(q)})`, "ig");
    return text.replace(regex, "<mark class='bg-yellow-200 dark:bg-yellow-600/30 rounded px-0.5'>$1</mark>");
  };

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  return (
    <div ref={wrapper} className="relative w-full">
        <div
        className="w-full"
        role="combobox"
        aria-expanded={open}
        aria-controls="options-list"
        aria-haspopup="listbox"
        >
        <input
            type="text"
            value={q}
            placeholder={placeholder}
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => q && fetchOptions(q)}
            className="w-full border rounded p-2"
            aria-autocomplete="list"
        />
        </div>

        <ul
        id="options-list"
        role="listbox"
        className={`${open ? "block" : "hidden"} border rounded mt-1`}
        >
        {options.map((opt, idx) => (
            <li
            key={opt.value}
            role="option"
            aria-selected={idx === highlight}   // 🔥 REQUIRED FIX
            className="p-2 hover:bg-gray-100 cursor-pointer"
            >
            {opt.label}
            </li>
        ))}
        </ul>




      {open && options.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border rounded shadow max-h-60 overflow-auto">
          {options.map((opt, idx) => (
            <div
              key={opt.value}
              onMouseEnter={()=> setHighlight(idx)}
              onClick={()=> selectOption(opt)}
              className={clsx("flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
                idx === highlight ? "bg-indigo-50 dark:bg-indigo-900/30" : ""
              )}
            >
              <div className="w-10 h-10 relative flex-shrink-0 rounded overflow-hidden bg-gray-100">
                {opt.image ? (
                    <Image
                    src={opt.image}
                    alt={opt.label}
                    fill
                    className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    No image
                    </div>
                )}
              </div>

              <div className="flex-1 text-sm">
                <div dangerouslySetInnerHTML={{ __html: highlightMatch(opt.label) }} />
                <div className="text-xs text-gray-500 dark:text-gray-300">৳{opt.extra}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
