import { CodeCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Gamepad2, Sparkles, MousePointer2, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarterPromptsProps {
  categories: Record<string, CodeCategory>;
  onSelectPrompt: (prompt: string) => void;
}

const icons = {
  Gamepad2,
  Sparkles,
  MousePointer2,
  Palette,
};

export function StarterPrompts({ categories, onSelectPrompt }: StarterPromptsProps) {
  const getRandomPrompt = (category: CodeCategory) => {
    const availableIndices = Array.from(
      { length: category.recipes.length },
      (_, i) => i
    ).filter((i) => !category.usedIndices.includes(i));

    if (availableIndices.length === 0) {
      category.usedIndices = [];
      return getRandomPrompt(category);
    }

    const randomIndex =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];
    category.usedIndices.push(randomIndex);
    return category.recipes[randomIndex].text;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Object.values(categories).map((category) => {
        const Icon = icons[category.icon as keyof typeof icons];
        return (
          <Button
            key={category.id}
            variant="outline"
            className={cn(
              "h-auto p-4 justify-start bg-black/20 border-red-900/20 neuro-shadow",
              "hover:bg-red-950/30 hover:border-red-800/30",
              "active:neuro-pressed",
              "flex flex-col items-start gap-2"
            )}
            onClick={() => onSelectPrompt(getRandomPrompt(category))}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-red-400" />
              <span className="font-semibold text-red-400">{category.title}</span>
            </div>
            <p className="text-sm text-red-300/70 text-left">
              {category.description}
            </p>
          </Button>
        );
      })}
    </div>
  );
}