import { cn } from '@/utilities/cn'
import { useMemo } from 'react'
import { FORM_STEP, useFormStep } from '../FormStepProvider'

type StepProps = {
  label: string
  stepKey: FORM_STEP
  index: number
}

export const Step = ({ label, stepKey, index }: StepProps) => {
  const { currentStep, setCurrentStep } = useFormStep()

  const isActive = useMemo(() => {
    return currentStep === stepKey
  }, [currentStep, stepKey])

  return (
    <li
      className={cn(
        'flex items-center flex-1 gap-2 cursor-pointer after:content-[""] after:grow after:h-[4px] after:bg-muted last:after:content-none last:flex-0',
        isActive ? ' ' : ' ',
      )}
      onClick={() => setCurrentStep(stepKey)}
    >
      <div
        className={cn('rounded-full shrink-0 size-8 relative', isActive ? 'border' : 'bg-muted')}
      >
        <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-sm">
          {index + 1}
        </span>
      </div>
      <p className="text-sm font-semibold tracking-[0.7]">{label}</p>
    </li>
  )
}
