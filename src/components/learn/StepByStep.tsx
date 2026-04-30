"use client";

import { useState } from "react";
import { ArabicText } from "@/components/ui/ArabicText";
import { SourceReference } from "@/components/ui/SourceReference";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Button } from "@/components/ui/Button";
import { RecitationBlockquote } from "@/components/ui/RecitationBlockquote";
import { Info } from "lucide-react";

interface StepData {
  id: string;
  title: string;
  instruction: string;
  arabicContent?: {
    arabic: string;
    transliteration: string;
    translation: string;
  };
  notes?: string;
  source?: {
    type: "quran" | "hadith" | "scholarly_consensus";
    reference: string;
  };
}

interface StepByStepProps {
  steps: StepData[];
  moduleId: string;
}

export function StepByStep({ steps, moduleId }: StepByStepProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const step = steps[currentStep];

  const goNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-6">
      <StepIndicator
        steps={steps.map((s) => ({ label: s.title }))}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h3 className="font-heading text-xl font-semibold text-ink">
          Step {currentStep + 1}: {step.title}
        </h3>

        <p className="text-ink leading-relaxed">{step.instruction}</p>

        {step.arabicContent && (
          <RecitationBlockquote>
            <ArabicText
              arabic={step.arabicContent.arabic}
              transliteration={step.arabicContent.transliteration}
              translation={step.arabicContent.translation}
            />
          </RecitationBlockquote>
        )}

        {step.notes && (
          <div className="flex gap-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg p-4 text-sm">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{step.notes}</p>
          </div>
        )}

        {step.source && (
          <SourceReference
            type={step.source.type}
            reference={step.source.reference}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goPrev}
          className={currentStep === 0 ? "invisible" : ""}
        >
          Previous Step
        </Button>
        <span className="text-sm text-muted">
          {currentStep + 1} of {steps.length}
        </span>
        <Button
          variant={currentStep === steps.length - 1 ? "secondary" : "primary"}
          onClick={goNext}
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next Step"}
        </Button>
      </div>
    </div>
  );
}
