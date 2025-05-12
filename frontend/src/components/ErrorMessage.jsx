export function ErrorMessage({ message }) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm mt-1">
        ⚠️ {message}
      </div>
    );
  }
  