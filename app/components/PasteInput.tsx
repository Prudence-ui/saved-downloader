'use client';

type PasteInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function PasteInput({
  value,
  onChange,
  placeholder,
  disabled = false,
}: PasteInputProps) {
  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onChange(text);
    } catch (err) {
      console.error('Erreur collage', err);
    }
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 pr-14 rounded-xl
        border border-gray-700 bg-black/40
        text-white placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-pink-500"
      />

      <button
        type="button"
        onClick={handlePaste}
        className="absolute right-2 top-1/2 -translate-y-1/2
        px-3 py-1 text-sm rounded-lg
        bg-white/10 text-white
        hover:bg-white/20 transition"
      >
        Coller
      </button>
    </div>
  );
}
