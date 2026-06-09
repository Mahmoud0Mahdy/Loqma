import { useNavigate } from 'react-router-dom';
import { Clock, Users, ArrowUpRight } from 'lucide-react';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';
import { useChatbotContext } from '../../../contexts/ChatbotContext';

interface RecipeSuggestionProps {
  recipe: {
    id: number;
    title: string;
    imageUrl: string;
    difficultyLevel: string;
    prepTime: number;
    isSaved: boolean;
    servings: number;
    categoryName: string;
  };
}

export function RecipeSuggestion({
  recipe,
}: RecipeSuggestionProps) {
  const navigate = useNavigate();
  const { setFloatingOpen } = useChatbotContext();

  const handleClick = () => {
    navigate(`/recipe/${recipe.id}`);
    setFloatingOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-3
        text-left
        transition-all
        hover:border-green-300
        hover:shadow-sm
      "
    >
      {/* Image */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        <ImageWithFallback
          src={recipe.imageUrl}
          alt={recipe.title}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h4
          className="
            truncate
            text-sm
            font-semibold
            text-gray-900
          "
        >
          {recipe.title}
        </h4>

        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {recipe.prepTime} min
          </span>

          <span className="flex items-center gap-1">
            <Users size={11} />
            {recipe.servings}
          </span>

          <span className="text-green-600 font-medium">
            {recipe.categoryName}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <ArrowUpRight
        size={16}
        className="
          shrink-0
          text-gray-400
          transition-transform
          group-hover:translate-x-0.5
          group-hover:-translate-y-0.5
        "
      />
    </button>
  );
}