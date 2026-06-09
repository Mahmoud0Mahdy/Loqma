import { Sparkles } from 'lucide-react';

const PROMPTS = [
  'I have chicken, rice, and vegetables',
  'Quick lunch ideas under 20 minutes',
  'Healthy breakfast recipes',
  'Vegetarian dinner options',
];

interface Props {
  onSelect: (prompt: string) => void;
  disabled: boolean;
}

export function SuggestedPrompts({
  onSelect,
  disabled,
}: Props) {
  return (
    <div className="chatbot-prompts-wrapper mx-auto max-w-4xl">
      <div className="mb-3 flex items-center justify-center gap-2">
        <Sparkles
          size={14}
          className="text-green-600"
        />

        <span className="text-xs font-medium text-gray-500">
          Try one of these prompts
        </span>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {PROMPTS.map((prompt, index) => (
          <button
            key={index}
            disabled={disabled}
            onClick={() => onSelect(prompt)}
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              text-left
              transition-all
              duration-200
              hover:border-green-300
              hover:bg-green-50
              hover:shadow-sm
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <div
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-green-100
              "
            >
              <Sparkles
                size={12}
                className="text-green-600"
              />
            </div>

            <span
              className="
                truncate
                text-xs
                font-medium
                text-gray-700
              "
            >
              {prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}