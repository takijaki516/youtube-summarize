import { useState } from "react";

import { AlignLeftIcon, PaperclipIcon, ArrowRightIcon } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { Button } from "@/components/ui/button";

export default function Component() {
  const [value, setValue] = useState("");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-white">
      <h1 className="mb-8 text-4xl font-bold md:text-6xl">
        Where knowledge begins
      </h1>
      <div className="w-full max-w-3xl">
        <div className="relative rounded-md border border-gray-700 bg-gray-900">
          <TextareaAutosize
            className="w-full resize-none rounded-md bg-transparent px-4 py-3 pr-32 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ask anything..."
            minRows={1}
            maxRows={5}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="absolute bottom-2 right-2 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <AlignLeftIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <PaperclipIcon className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              className="rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
