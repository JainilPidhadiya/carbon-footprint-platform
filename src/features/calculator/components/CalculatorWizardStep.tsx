import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Car, Lightbulb, Apple, Trash } from 'lucide-react';
import type { CalculatorAnswers } from '../../../types';
import { Input } from '../../../components/ui';

export type CalculatorFormValues = CalculatorAnswers;

interface CalculatorWizardStepProps {
  step: number;
  register: UseFormRegister<CalculatorFormValues>;
  errors: FieldErrors<CalculatorFormValues>;
}

export const CalculatorWizardStep: React.FC<CalculatorWizardStepProps> = ({
  step,
  register,
  errors,
}) => {
  return (
    <>
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
    </>
  );
};
export default CalculatorWizardStep;
