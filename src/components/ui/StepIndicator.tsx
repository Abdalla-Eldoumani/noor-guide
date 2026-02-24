import { Check } from "lucide-react";

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  className?: string;
}

export function StepIndicator({
  steps,
  currentStep,
  completedSteps,
  className = "",
}: StepIndicatorProps) {
  return (
    <div className={`flex items-start overflow-x-auto pb-2 scrollbar-hide ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isActive = index === currentStep;

        const circleClass = isCompleted
          ? "step-circle step-circle-complete"
          : isActive
            ? "step-circle step-circle-active"
            : "step-circle step-circle-pending";

        return (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={circleClass} aria-current={isActive ? "step" : undefined}>
                {isCompleted ? (
                  <Check size={18} aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="mt-1.5 text-xs text-center text-muted max-w-[5rem]">
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-6 sm:w-12 mt-5 mx-0.5 sm:mx-1 ${
                  isCompleted ? "bg-primary-500" : "bg-gray-200"
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;
