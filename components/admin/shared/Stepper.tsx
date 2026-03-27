"use client";

import { Check } from "lucide-react";

interface Step {
  id: number;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className = "" }: StepperProps) {
  return (
    <div className={`relative flex justify-between w-full max-w-2xl mx-auto mb-12 ${className}`}>
      {/* Background Line */}
      <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 dark:bg-white/5 z-0" />
      
      {/* Active Progress Line */}
      <div 
        className="absolute top-5 left-0 h-[2px] bg-[#C9A84C] z-10 transition-all duration-500 ease-in-out" 
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((step) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <div key={step.id} className="relative z-20 flex flex-col items-center">
            <div 
              className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                ${isCompleted 
                  ? "bg-[#C9A84C] border-[#C9A84C] text-[#0C0C0A]" 
                  : isActive 
                    ? "bg-white dark:bg-slate-900 border-[#C9A84C] text-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.3)]" 
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-400"
                }
              `}
            >
              {isCompleted ? (
                <Check size={18} strokeWidth={3} />
              ) : (
                <span className="text-[10px] font-black">{step.id}</span>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <p className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                {step.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
