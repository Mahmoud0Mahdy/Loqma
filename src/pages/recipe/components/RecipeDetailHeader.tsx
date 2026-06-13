import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';
import { Clock, Users, ChefHat } from 'lucide-react';
import { Recipe } from '../types';

export function RecipeDetailHeader({ recipe }: { recipe: Recipe }) {
  return (
    <div className="space-y-6">
      
      <Card className="overflow-hidden border-0 shadow-sm rounded-2xl p-0">
        
        <div 
          className="relative w-full overflow-hidden" 
          style={{ height: "420px" }} 
        >
          <ImageWithFallback
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover block"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-green-600 text-white px-3 py-1 shadow-md">
              {recipe.difficulty}
            </Badge>
          </div>
        </div>

      </Card>

      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-6 md:p-8">
          <Badge variant="outline" className="mb-4 capitalize text-green-700 border-green-200 bg-green-50">
            {recipe.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
            {recipe.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-600 font-medium">
            <div className="flex items-center"><Clock size={20} className="mr-2 text-gray-400" />{recipe.time}</div>
            <div className="flex items-center"><Users size={20} className="mr-2 text-gray-400" />{recipe.servings}</div>
            <div className="flex items-center"><ChefHat size={20} className="mr-2 text-gray-400" />{recipe.difficulty}</div>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}