import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../store';
import { calculateBaseline } from '../services/carbon.service';
import { Button, Card, CardBody, CardFooter } from '../components/ui';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// Subcomponents
import { CalculatorWizardStep, type CalculatorFormValues } from '../features/calculator/components/CalculatorWizardStep';
import { BaselineResultSummary } from '../features/calculator/components/BaselineResultSummary';

const calculatorSchema = z.object({
  transportMode: z.enum(['car_petrol', 'car_diesel', 'car_ev', 'public_transit', 'bicycle', 'walking']),
  weeklyDistance: z.number()
    .nonnegative('Distance must be zero or positive')
    .max(5000, 'Distance seems excessively high'),
  electricityBill: z.number()
    .nonnegative('Usage must be zero or positive')
    .max(10000, 'Usage seems excessively high'),
  heatingFuel: z.enum(['gas', 'electric', 'oil', 'none']),
  dietType: z.enum(['vegan', 'vegetarian', 'low_meat', 'high_meat']),
  recyclePaper: z.boolean(),
  recyclePlastic: z.boolean(),
  recycleGlass: z.boolean(),
});

const DEFAULT_FORM_VALUES: CalculatorFormValues = {
  transportMode: 'car_petrol',
  weeklyDistance: 50,
  electricityBill: 120,
  heatingFuel: 'gas',
  dietType: 'low_meat',
  recyclePaper: true,
  recyclePlastic: true,
  recycleGlass: false,
};

export const CalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { calculatorDraft, setCalculatorDraft, setBaseline } = useAppStore();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const { 
    register, 
    getValues, 
    trigger,
    formState: { errors } 
  } = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: calculatorDraft || DEFAULT_FORM_VALUES,
    mode: 'onBlur',
  });

  const handleNext = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(['transportMode', 'weeklyDistance']);
    } else if (step === 2) {
      isValid = await trigger(['electricityBill', 'heatingFuel']);
    } else if (step === 3) {
      isValid = await trigger(['dietType']);
    } else if (step === 4) {
      isValid = await trigger(['recyclePaper', 'recyclePlastic', 'recycleGlass']);
    }

    if (isValid) {
      setCalculatorDraft(getValues());
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCalculatorDraft(getValues());
    setStep((prev) => prev - 1);
  };

  const values = getValues();
  const baseline = calculateBaseline(values);

  const handleSave = () => {
    setBaseline(baseline.total, {
      transport: baseline.breakdown.transport,
      energy: baseline.breakdown.energy,
      food: baseline.breakdown.food,
      waste: baseline.breakdown.waste,
    });
    setCalculatorDraft(null);
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto py-2">
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-3xl tracking-tight text-slate-900 dark:text-slate-50 mb-2">
          Calculate Your Carbon Baseline
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Complete the five sections below. Your answers will generate a customized carbon budget target.
        </p>
      </div>

      {/* Accessible Progress Indicator */}
      <div className="mb-8" aria-label="Progress Tracker">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-450">
            Step {step} of {totalSteps}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {Math.round(((step - 1) / (totalSteps - 1)) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-450 to-teal-500 h-full transition-all duration-300"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      <Card className="shadow-lg border-slate-200/60 dark:border-slate-800/80">
        <CardBody className="p-6 sm:p-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {step < 5 ? (
              <CalculatorWizardStep 
                step={step}
                register={register}
                errors={errors}
              />
            ) : (
              <BaselineResultSummary 
                annualTotalCo2e={baseline.total}
                transportYearly={baseline.breakdown.transport}
                electricityYearly={baseline.breakdown.energy}
                foodYearly={baseline.breakdown.food}
                wasteYearly={baseline.breakdown.waste}
                values={values}
              />
            )}
          </form>
        </CardBody>
        <CardFooter className="flex justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/10">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={handlePrev}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              className="cursor-pointer"
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <Button
              variant="primary"
              onClick={handleNext}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="cursor-pointer"
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSave}
              className="cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500"
            >
              Commit Baseline
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
export default CalculatorPage;
