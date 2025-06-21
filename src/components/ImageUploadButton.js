import React from "react";

export default function ImageUploadButton({ onChange, id = "media-upload" }) {
  return (
    <label htmlFor={id} className="cursor-pointer flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V5.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17.25l5.25-5.25a2.25 2.25 0 013.18 0l7.32 7.32" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9.75a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z" />
      </svg>
      <input
        id={id}
        type="file"
        accept="image/*,video/*"
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}
