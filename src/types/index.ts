export interface EnergyProvider {
  id: string;
  name: string;
  website: string;
  phone: string;
  servesTexas: boolean;
  rating?: number;
}

export interface EnergyPlan {
  id: string;
  providerId: string;
  providerName: string;
  planName: string;
  planType: 'fixed' | 'variable' | 'indexed';
  termLength: number; // in months
  rate: number; // cents per kWh
  baseCharge?: number; // monthly base charge in dollars
  cancellationFee?: number;
  renewablePercentage: number; // percentage of renewable energy
  features: string[];
  minimumUsage?: number; // kWh
  serviceArea: string[];
}

export interface UserPreferences {
  monthlyUsage: number; // in kWh
  zipCode: string;
  preferRenewable: boolean;
  maxTermLength?: number;
  maxRate?: number;
}

export interface PlanComparison {
  plan: EnergyPlan;
  estimatedMonthlyCost: number;
  estimatedAnnualCost: number;
  savings?: number; // compared to current plan
  pros: string[];
  cons: string[];
}
