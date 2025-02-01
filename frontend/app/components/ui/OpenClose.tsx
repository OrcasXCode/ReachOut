"use client"

const tagStyles: Record<"Open" | "Closed", string> = {
    Open: "bg-green-100 text-green-800 ring-green-600/20",
    Closed: "bg-red-100 text-red-800 ring-red-600/20",
  };
  
  type TagType = keyof typeof tagStyles; // Ensures `tag` is a valid key
  
  export default function App({ tag }: { tag: TagType }) {
    return (
      <div className="flex gap-4">
        <span
          className={`inline-flex items-center rounded-md text-gray-400 px-2 py-1 text-[12px] font-medium ring-1 ring-inset ${
            tagStyles[tag] // No error because `tag` is now a valid key
          }`}
        >
          {tag}
        </span>
      </div>
    );
  }
  