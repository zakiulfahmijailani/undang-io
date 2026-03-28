/**
 * Skeleton loading state untuk /preview/[slug]
 */
export default function PreviewLoading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "#fdfaf6" }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
          style={{ borderColor: "#bf9b73", borderTopColor: "transparent" }}
        />
        <p
          className="text-sm tracking-widest opacity-60"
          style={{ color: "#8b6c42", fontFamily: "'Didact Gothic', sans-serif" }}
        >
          Memuat pratinjau...
        </p>
      </div>
    </div>
  );
}
