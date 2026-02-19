import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import {
  Heart,
  Building,
  Droplets,
  Moon,
  BookOpen,
  HandMetal,
} from "lucide-react";
import type { LearningModule } from "@/types/content";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  building: Building,
  droplets: Droplets,
  moon: Moon,
  "book-open": BookOpen,
  hands: HandMetal,
};

interface LessonCardProps {
  module: LearningModule;
  completedLessons: number;
  totalLessons: number;
}

export function LessonCard({
  module,
  completedLessons,
  totalLessons,
}: LessonCardProps) {
  const Icon = iconMap[module.icon] || BookOpen;
  const percent =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);
  const variant =
    percent === 100
      ? "completed"
      : completedLessons > 0
        ? "in-progress"
        : "locked";

  return (
    <Card href={`/learn/${module.id}`} className="group">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 group-hover:bg-primary-100 transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-heading font-semibold text-ink truncate">
              {module.title_en}
            </h3>
            <Badge variant={variant}>
              {percent === 100
                ? "Complete"
                : completedLessons > 0
                  ? "In Progress"
                  : "Not Started"}
            </Badge>
          </div>
          <p className="font-arabic text-sm text-muted mb-2">{module.title_ar}</p>
          <p className="text-sm text-muted mb-3 line-clamp-2">
            {module.description_en}
          </p>
          <div className="flex items-center gap-3">
            <ProgressBar value={percent} className="flex-1" />
            <span className="text-xs text-muted whitespace-nowrap">
              {module.estimatedMinutes} min
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
