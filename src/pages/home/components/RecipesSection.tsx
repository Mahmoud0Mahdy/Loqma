import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';
import { Clock, Users } from 'lucide-react';
import { useEffect } from 'react';
import { useApp } from '../../../contexts/AppContext';

export function RecipesSection() {
  const navigate = useNavigate();
  const { state, fetchRecipes } = useApp();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const recipes = state.recipes.slice(0, 3);

  return (
    <section className="py-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover New Recipes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get inspired with our collection of delicious recipes curated by our AI chef
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {recipes.map((recipe: any) => (
            <Card
              key={recipe.id}
              className="group cursor-pointer hover:shadow-xl transition-shadow bg-white border-0 shadow-md"
            >
              <CardContent className="p-0">
                <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={recipe.image || recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {recipe.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      <span>{recipe.time || `${recipe.prepTime} min`}</span>
                    </div>

                    <div className="flex items-center">
                      <Users size={16} className="mr-1" />
                      <span>{recipe.servings || "1 person"}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/recipe/${recipe.id}`);
                    }}
                  >
                    View Recipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            onClick={() => navigate('/recipes')}
          >
            Browse Recipes
          </Button>
        </div>
      </div>
    </section>
  );
}