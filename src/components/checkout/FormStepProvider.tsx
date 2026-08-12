'use client'

import { createContext, useContext, useState } from 'react'

export enum FORM_STEP {
  PERSONAL_DATA = 'personal_data',
  SHIPPING = 'shipping',
  PAYMENT = 'platnosc',
  SUMMARY = 'summary',
}

type FormStepContext = {
  currentStep: FORM_STEP
  setCurrentStep: (step: FORM_STEP) => void
}

const Context = createContext({} as FormStepContext)

export const FormStepProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<FORM_STEP>(FORM_STEP.PERSONAL_DATA)

  return <Context.Provider value={{ currentStep, setCurrentStep }}>{children}</Context.Provider>
}

type UseFormStep = () => FormStepContext // eslint-disable-line no-unused-vars

export const useFormStep: UseFormStep = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('useFormStep must be called within FormStepProvider')
  return ctx
}
