import {Chip} from "@heroui/react";

export default function App({tag}:{tag:string}) {
  return (
    <div className="flex gap-4">
      <span className="inline-flex gap-1 items-center rounded-md px-2 py-1 text-xs font-medium text-black ring-1 ring-gray-600/20 ring-inset">
        <span className="h-[5px] w-[5px] rounded-full bg-yellow-300"></span>
        {tag}
      </span>
   </div>
  );
}
