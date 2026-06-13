import { Bot, User } from "lucide-react";
import { Message } from "../types";
import { RecipeSuggestion } from "./RecipeSuggestion";

export function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          flex
          gap-3
          max-w-[90%]
          ${isUser ? "flex-row-reverse" : ""}
        `}
      >
        {/* Avatar */}
        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            ${
              isUser
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-200 text-gray-600"
            }
          `}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Message */}
        <div className="flex flex-col">
          <div
            className={`
              rounded-2xl
              px-4
              py-3
              text-sm
              leading-7
              shadow-sm
              ${
                isUser
                  ? "bg-green-600 text-white"
                  : "border border-gray-200 bg-white text-gray-800"
              }
            `}
          >
            <div className="space-y-3">
              {message.content.split("\n").map((line, index) => {
                const trimmed = line.trim();

                if (!trimmed) return null;

                const formattedLine = trimmed.replace(
                  /\*\*(.*?)\*\*/g,
                  "<strong>$1</strong>"
                );

                const isNumberedItem = /^\d+\./.test(trimmed);

                return (
                  <div
                    key={index}
                    className={
                      isNumberedItem
                        ? "border-l-4 border-green-500 pl-4 py-1"
                        : ""
                    }
                  >
                    <p
                      className="leading-7"
                      dangerouslySetInnerHTML={{
                        __html: formattedLine,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recipe Cards */}
          {message.recipes && message.recipes.length > 0 && (
            <div className="mt-4">
              <div className="mb-3">
                <span
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  Recommended Recipes
                </span>
              </div>

              <div className="space-y-3">
                {message.recipes.map((recipe) => (
                  <RecipeSuggestion
                    key={recipe.id}
                    recipe={recipe}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}