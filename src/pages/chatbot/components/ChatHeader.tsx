import { Bot } from 'lucide-react';

export function ChatHeader() {
  return (
    <header className="relative border-b border-gray-200 bg-white px-8 py-4">

      {/* Center Content */}
      <div className="flex items-center justify-center gap-4">
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            bg-green-600
            text-white
            shadow-sm
          "
        >
          <Bot size={22} />
        </div>

        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            AI Recipe Assistant
          </h1>

          <p className="text-sm text-gray-500">
            Powered by FreshMart AI
          </p>
        </div>
      </div>

    </header>
  );
}