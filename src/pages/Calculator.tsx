import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '../store';
import { 
  calculateTransportEmission, 
  calculateElectricityEmission, 
  calculateFoodEmission, 
  calculateTotalEmission 
} from '../services/carbon.service';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { 
  Car, 
  Lightbulb, 
  Apple, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle,
  HelpCircle,
  Trash
} from 'lucide-react';

// Strict Zod schema for calculator inputs
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

type CalculatorFormValues = z.infer<typeof calculatorSchema>;

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

  // Initialize form with defaults or Zustand draft if it exists
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

  // Steps definitions
  // 1. Transportation
  // 2. Electricity Usage
  // 3. Food Habits
  // 4. Waste Management
  // 5. Review Summary
  const totalSteps = 5;

  // Handles navigation forward with validation per step
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
      // Save draft state to Zustand on transition
      setCalculatorDraft(getValues());
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    // Save draft state to Zustand
    setCalculatorDraft(getValues());
    setStep((prev) => prev - 1);
  };

  // Perform Calculations using the pure functions of carbon.service.ts
  const values = getValues();
  const transportYearly = calculateTransportEmission(values.weeklyDistance * 52, values.transportMode);
  const electricityYearly = calculateElectricityEmission(values.electricityBill * 12);
  const foodYearly = calculateFoodEmission(3 * 365, values.dietType);
  
  // Waste baseline offset calculations
  const wasteBaseline = 120;
  const paperOffset = values.recyclePaper ? -10 : 0;
  const plasticOffset = values.recyclePlastic ? -15 : 0;
  const glassOffset = values.recycleGlass ? -8 : 0;
  const wasteMonthly = wasteBaseline + paperOffset + plasticOffset + glassOffset;
  const wasteYearly = wasteMonthly * 12;

  // Aggregate total
  const annualTotalCo2e = calculateTotalEmission({
    transport: transportYearly,
    electricity: electricityYearly,
    food: foodYearly,
    waste: wasteYearly
  });

  const handleSave = () => {
    // Clear draft and commit baseline
    setBaseline(annualTotalCo2e, {
      transport: Math.round(transportYearly),
      energy: Math.round(electricityYearly),
      food: Math.round(foodYearly),
      waste: Math.round(wasteYearly),
    });
    setCalculatorDraft(null); // Clear draft
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

            {/* STEP 1: TRANSPORTATION */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/50 pb-4">
                  <Car className="w-6 h-6 text-emerald-500" />
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
                    Step 1: Transportation Habits
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="transportMode" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-left">
                      Primary Transit vehicle
                    </label>
                    <select
                      id="transportMode"
                      {...register('transportMode')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none text-left"
                    >
                      <option value="car_petrol">Petrol Engine Car</option>
                      <option value="car_diesel">Diesel Engine Car</option>
                      <option value="car_ev">Electric Vehicle (EV)</option>
                      <option value="public_transit">Public Bus / Metro Rail</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="walking">Walking</option>
                    </select>
                  </div>

                  <Input
                    label="Weekly Distance Traveled (km)"
                    type="number"
                    min="0"
                    {...register('weeklyDistance', { valueAsNumber: true })}
                    error={errors.weeklyDistance?.message}
                    helperText="Estimate the total distance you commute or travel in a typical week."
                  />
                </div>
              </div>
            )}

            {/* STEP 2: ELECTRICITY USAGE */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/50 pb-4">
                  <Lightbulb className="w-6 h-6 text-emerald-500" />
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
                    Step 2: Electricity & Heating
                  </h2>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Monthly Electricity Bill (kWh)"
                    type="number"
                    min="0"
                    {...register('electricityBill', { valueAsNumber: true })}
                    error={errors.electricityBill?.message}
                    helperText="Check a recent home utility statement for monthly power use in kWh."
                  />

                  <div>
                    <label htmlFor="heatingFuel" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-left">
                      Primary Heating Fuel
                    </label>
                    <select
                      id="heatingFuel"
                      {...register('heatingFuel')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none text-left"
                    >
                      <option value="gas">Natural Gas Furnace</option>
                      <option value="electric">Electric Heater / heat pump</option>
                      <option value="oil">Fuel Oil Burner</option>
                      <option value="none">No active heating</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: FOOD HABITS */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/50 pb-4">
                  <Apple className="w-6 h-6 text-emerald-500" />
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
                    Step 3: Food Consumption
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="dietType" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-left">
                      Which best describes your diet type?
                    </label>
                    <select
                      id="dietType"
                      {...register('dietType')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none text-left"
                    >
                      <option value="vegan">Vegan (Fully plant-based)</option>
                      <option value="vegetarian">Vegetarian (No meat, does eat dairy/eggs)</option>
                      <option value="low_meat">Low Meat (Rare beef/pork, avian/fish focused)</option>
                      <option value="high_meat">High Meat (Regular beef/pork dinners)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: WASTE MANAGEMENT */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/50 pb-4">
                  <Trash className="w-6 h-6 text-emerald-500" />
                  <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
                    Step 4: Household Waste Recycling
                  </h2>
                </div>

                <fieldset className="space-y-4 text-left">
                  <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Check options you sort and recycle regularly:
                  </legend>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register('recyclePaper')}
                      className="w-5 h-5 rounded text-emerald-600 border-slate-300 dark:border-slate-700 focus:ring-emerald-500/20"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-slate-50">
                      Paper & Cardboards
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register('recyclePlastic')}
                      className="w-5 h-5 rounded text-emerald-600 border-slate-300 dark:border-slate-700 focus:ring-emerald-500/20"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-slate-50">
                      Plastics & Bottles
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register('recycleGlass')}
                      className="w-5 h-5 rounded text-emerald-600 border-slate-300 dark:border-slate-700 focus:ring-emerald-500/20"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-slate-50">
                      Glass Bottles & jars
                    </span>
                  </label>
                </fieldset>
              </div>
            )}

            {/* STEP 5: REVIEW SUMMARY */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center py-2">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">
                    Review Summary Results
                  </h2>
                  <div className="my-5 inline-block bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4">
                    <span className="block text-4xl font-extrabold text-emerald-600 dark:text-emerald-450 font-display">
                      {(annualTotalCo2e / 1000).toFixed(1)} <span className="text-lg font-bold">tonnes</span>
                    </span>
                    <span className="text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 block mt-1">
                      Annual CO2e Baseline
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Emissions Breakdown
                  </h3>
                  
                  {/* Transport representation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600 dark:text-slate-300">Transport ({values.weeklyDistance} km/wk via {values.transportMode})</span>
                      <span className="text-slate-900 dark:text-slate-100">{Math.round(transportYearly)} kg</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 animate-slide-in" style={{ width: `${Math.min(100, (transportYearly / annualTotalCo2e) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Electricity representation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600 dark:text-slate-300">Power & Heating ({values.electricityBill} kWh/mo)</span>
                      <span className="text-slate-900 dark:text-slate-100">{Math.round(electricityYearly)} kg</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 animate-slide-in" style={{ width: `${Math.min(100, (electricityYearly / annualTotalCo2e) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Food representation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600 dark:text-slate-300">Dietary Profile ({values.dietType})</span>
                      <span className="text-slate-900 dark:text-slate-100">{Math.round(foodYearly)} kg</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 animate-slide-in" style={{ width: `${Math.min(100, (foodYearly / annualTotalCo2e) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Waste representation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600 dark:text-slate-300">Recycling & Household Waste</span>
                      <span className="text-slate-900 dark:text-slate-100">{Math.round(wasteYearly)} kg</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 animate-slide-in" style={{ width: `${Math.min(100, (wasteYearly / annualTotalCo2e) * 100)}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs text-left text-slate-500 dark:text-slate-400 flex gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>
                    Setting this baseline targets a 30% footprint drop. Your monthly budget threshold will be set to <strong>{Math.round((annualTotalCo2e * 0.7) / 12)} kg CO2e</strong>.
                  </span>
                </div>
              </div>
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
