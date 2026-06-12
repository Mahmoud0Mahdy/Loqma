import { Bot, User } from "lucide-react";
import { Message } from "../types";
import { RecipeSuggestion } from "./RecipeSuggestion";

export function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === "user";

  const recommendations = [
    ...message.content.matchAll(
      /\d+\.\s\*\*(.*?)\*\*:\s(.*?)(?=\d+\.\s\*\*|Which one|Which option|$)/gs,
    ),
  ].map((match) => ({
    title: match[1].trim(),
    description: match[2].trim(),
  }));

  const hasRecommendations = recommendations.length > 0;

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
            {hasRecommendations ? (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-base">
                    🍽️ Recommended Options
                  </p>
                </div>

                {recommendations.map((item, index) => (
                  <div
                    key={index}
                    className="
                        border-l-4
                        border-green-500
                        pl-4
                        py-2
                      "
                  >
                    <h4
                      className="
                          font-semibold
                          text-gray-900
                          mb-1
                        "
                    >
                      {item.title}
                    </h4>

                    <p
                      className="
                          text-sm
                          text-gray-600
                          leading-6
                        "
                    >
                      {item.description}
                    </p>
                  </div>
                ))}

                <div
                  className="
                    pt-2
                    border-t
                    border-gray-200
                  "
                >
                  <p className="font-medium">
                    Which one sounds most appealing?
                  </p>
                </div>
              </div>
            ) : (
              /* التعديل حصل في الجزء ده عشان يقرا الـ HTML بشكل صحيح */
              <div 
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: message.content }} 
              />
            )}
          </div>

          {/* Recipes */}
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
                  <RecipeSuggestion key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}