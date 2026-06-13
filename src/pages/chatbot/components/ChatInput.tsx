import { useState } from "react";
import { Loader2, SendHorizontal, Maximize2, Minimize2 } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
  isFirstMessage?: boolean;
}

export function ChatInput({ onSend, disabled, isFirstMessage = false }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const maxLimit = isFirstMessage ? 500 : 1999;

  const isNearLimit = inputValue.length >= maxLimit * 0.9;

  const handleSend = () => {
    if (!inputValue.trim() || disabled) return;

    if (inputValue.length > maxLimit) return;

    onSend(inputValue.trim());

    setInputValue("");
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Input placeholder text
  const getPlaceholder = () => {
    if (disabled) {
      return "Loqma AI is typing... Please wait.";
    }

    if (isFirstMessage) {
      return "Start a new recipe chat... (Max 500 chars)";
    }

    return "Ask for recipes, ingredients... (Max 1999 chars)";
  };

  return (
    <div className="cb-input-box">
      <textarea
        rows={isExpanded ? 10 : 1}
        value={inputValue}
        disabled={disabled}
        maxLength={maxLimit}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={getPlaceholder()}
        className={`cb-textarea ${isExpanded ? "expanded" : ""} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />

      <div className="cb-input-actions">
        <span className={`cb-char-counter ${isNearLimit ? "near-limit" : ""}`}>
          {inputValue.length} / {maxLimit}
        </span>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="cb-action-btn"
          title={isExpanded ? "Minimize" : "Expand"}
          disabled={disabled}
        >
          {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>

        <button
          onClick={handleSend}
          disabled={
            !inputValue.trim() || disabled || inputValue.length > maxLimit
          }
          className="cb-send-btn"
        >
          {disabled ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <SendHorizontal size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
