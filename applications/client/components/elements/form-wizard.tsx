"use client"

import * as React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"

type WizardStep = {
  id: string
  title: string
  description?: string
  disabled?: boolean
}

type FormWizardContextType = {
  currentStep: string
  setCurrentStep: (step: string) => void
  steps: WizardStep[]
  setSteps: (steps: WizardStep[]) => void
  completedSteps: string[]
  setCompletedSteps: (steps: string[]) => void
  validateStep?: (stepId: string) => boolean
  onNext?: () => void
  onPrev?: () => void
  onSubmit?: () => void
}

const FormWizardContext = React.createContext<FormWizardContextType | undefined>(undefined)

function useFormWizard() {
  const context = React.useContext(FormWizardContext)
  if (!context) {
    throw new Error("useFormWizard must be used within a FormWizard")
  }
  return context
}

interface FormWizardProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

function FormWizard({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
  ...props
}: FormWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(defaultValue || "")
  const [steps, setSteps] = React.useState<WizardStep[]>([])
  const [completedSteps, setCompletedSteps] = React.useState<string[]>([])

  const handleValueChange = React.useCallback((newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      setCurrentStep(newValue)
    }
  }, [onValueChange])

  const contextValue = React.useMemo(() => ({
    currentStep: value || currentStep,
    setCurrentStep: handleValueChange,
    steps,
    setSteps,
    completedSteps,
    setCompletedSteps,
  }), [currentStep, value, handleValueChange, steps, completedSteps])

  return (
    <FormWizardContext.Provider value={contextValue}>
      <Card className={cn("", className)} {...props}>
        {children}
      </Card>
    </FormWizardContext.Provider>
  )
}

interface FormWizardListProps {
  className?: string
  children: React.ReactNode
}

function FormWizardList({ className, children, ...props }: FormWizardListProps) {
  return (
    <CardHeader>
      <div className={cn("grid gap-4", className)} {...props}>
        {children}
      </div>
    </CardHeader>
  )
}

interface FormWizardTriggerProps {
  stepId: string
  title: string
  description?: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

function FormWizardTrigger({
  stepId,
  title,
  description,
  disabled = false,
  className,
  children,
  ...props
}: FormWizardTriggerProps) {
  const { currentStep, setCurrentStep, steps, setSteps, completedSteps } = useFormWizard()
  
  React.useEffect(() => {
    const step: WizardStep = { id: stepId, title, description, disabled }
    setSteps(prev => {
      const existing = prev.find(s => s.id === stepId)
      if (existing) {
        return prev.map(s => s.id === stepId ? step : s)
      }
      return [...prev, step]
    })
  }, [stepId, title, description, disabled, setSteps])

  const isActive = currentStep === stepId
  const isCompleted = completedSteps.includes(stepId)
  const stepNumber = steps.findIndex(s => s.id === stepId) + 1

  return (
    <div
      className={cn(
        "flex items-start gap-3 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={() => !disabled && setCurrentStep(stepId)}
      {...props}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
          isCompleted 
            ? "bg-primary text-primary-foreground" 
            : isActive 
            ? "bg-primary/20 text-primary" 
            : "bg-muted text-foreground"
        )}
      >
        {stepNumber}
      </div>
      <div>
        <div className={cn(
          "text-sm font-medium transition-colors",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}>
          {title}
        </div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </div>
      {children}
    </div>
  )
}

interface FormWizardContentProps {
  stepId: string
  className?: string
  children: React.ReactNode
}

function FormWizardContent({
  stepId,
  className,
  children,
  ...props
}: FormWizardContentProps) {
  const { currentStep } = useFormWizard()
  
  if (currentStep !== stepId) {
    return null
  }

  return (
    <CardContent className={cn("space-y-6", className)} {...props}>
      {children}
    </CardContent>
  )
}

interface FormWizardFooterProps {
  className?: string
  children?: React.ReactNode
}

function FormWizardFooter({ className, children, ...props }: FormWizardFooterProps) {
  const { currentStep, steps, completedSteps, setCurrentStep, setCompletedSteps } = useFormWizard()
  
  const currentIndex = steps.findIndex(s => s.id === currentStep)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === steps.length - 1
  
  const goNext = () => {
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1]
      if (!nextStep.disabled) {
        setCurrentStep(nextStep.id)
      }
    }
  }
  
  const goPrev = () => {
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1]
      setCurrentStep(prevStep.id)
    }
  }
  
  const markCurrentCompleted = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep])
    }
  }

  return (
    <CardFooter className={cn("flex items-center justify-between", className)} {...props}>
      {children || (
        <>
          <Button 
            variant="outline" 
            onClick={goPrev} 
            disabled={isFirst}
          >
            Previous
          </Button>
          {isLast ? (
            <Button onClick={markCurrentCompleted}>
              Submit
            </Button>
          ) : (
            <Button onClick={goNext}>
              Next
            </Button>
          )}
        </>
      )}
    </CardFooter>
  )
}

export { 
  FormWizard, 
  FormWizardList, 
  FormWizardTrigger, 
  FormWizardContent, 
  FormWizardFooter,
  useFormWizard 
}