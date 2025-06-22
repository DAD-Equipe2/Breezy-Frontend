export default function EditButton({ onClick, title = "Modifier", className = "", ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 text-white text-lg shadow transition group ${className}`}
      title={title}
      aria-label={title}
      {...props}
    >
      <span className="group-hover:scale-110 transition-transform">✏️</span>
    </button>
  );
}
