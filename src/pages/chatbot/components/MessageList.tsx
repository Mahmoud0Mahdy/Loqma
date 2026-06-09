import { Bot } from 'lucide-react';
import { Message } from '../types';
import { MessageItem } from './MessageItem';

interface Props {
  messages: Message[];
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export function MessageList({
  messages,
  isLoading,
  scrollRef,
}: Props) {
  return (
    <div
      ref={scrollRef}
      className="
        h-full
        overflow-y-auto
        bg-[#fafafa]
        px-4
        py-6
      "
    >
      <div className="mx-auto max-w-4xl">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
          />
        ))}

        {isLoading && (
          <div className="mb-6 flex justify-start">
            <div className="flex max-w-[90%] gap-3">

              {/* Avatar */}
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                "
              >
                <Bot
                  size={16}
                  className="text-gray-600"
                />
              </div>

              {/* Bubble */}
              <div
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  shadow-sm
                "
              >
                <div className="flex gap-1">
                  <span
                    className="
                      h-2
                      w-2
                      animate-bounce
                      rounded-full
                      bg-gray-400
                    "
                  />

                  <span
                    className="
                      h-2
                      w-2
                      animate-bounce
                      rounded-full
                      bg-gray-400
                    "
                    style={{
                      animationDelay: '0.15s',
                    }}
                  />

                  <span
                    className="
                      h-2
                      w-2
                      animate-bounce
                      rounded-full
                      bg-gray-400
                    "
                    style={{
                      animationDelay: '0.3s',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}