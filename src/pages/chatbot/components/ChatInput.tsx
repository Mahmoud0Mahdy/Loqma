import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Loader2, SendHorizontal } from 'lucide-react';

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({
  onSend,
  disabled,
}: Props) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim() || disabled) return;

    onSend(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div
        className="
          mx-auto
          flex
          max-w-4xl
          items-end
          gap-3
          rounded-3xl
          border
          border-gray-200
          bg-white
          px-4
          py-3
          shadow-sm
          transition-all
          focus-within:border-green-500
          focus-within:shadow-md
        "
      >
        <textarea
          rows={1}
          value={inputValue}
          disabled={disabled}
          onChange={(e) =>
            setInputValue(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask for recipes, ingredients, or meal ideas..."
          className="
            max-h-40
            min-h-[28px]
            flex-1
            resize-none
            border-none
            bg-transparent
            text-sm
            outline-none
            placeholder:text-gray-400
          "
        />

        <Button
          onClick={handleSend}
          disabled={!inputValue.trim() || disabled}
          size="icon"
          className="
            h-10
            w-10
            rounded-full
            bg-green-600
            text-white
            hover:bg-green-700
            disabled:bg-gray-300
          "
        >
          {disabled ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <SendHorizontal size={18} />
          )}
        </Button>
      </div>
    </div>
  );
}