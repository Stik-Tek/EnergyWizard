import { EnergyPlan, EnergyProvider, UserPreferences } from '../types';
import { texasPlans } from '../data/plans';
import { texasProviders } from '../data/providers';

export class PlanService {
  getProviders(): EnergyProvider[] {
    return texasProviders;
  }

  getPlans(): EnergyPlan[] {
    return texasPlans;
  }

  getPlansByProvider(providerId: string): EnergyPlan[] {
    return texasPlans.filter((plan) => plan.providerId === providerId);
  }

  searchPlans(preferences: UserPreferences): EnergyPlan[] {
    let filteredPlans = texasPlans;

    if (preferences.maxRate) {
      filteredPlans = filteredPlans.filter((plan) => plan.rate <= preferences.maxRate!);
    }

    if (preferences.maxTermLength) {
      filteredPlans = filteredPlans.filter(
        (plan) => plan.termLength <= preferences.maxTermLength!
      );
    }

    if (preferences.preferRenewable) {
      filteredPlans = filteredPlans.sort(
        (a, b) => b.renewablePercentage - a.renewablePercentage
      );
    } else {
      filteredPlans = filteredPlans.sort((a, b) => a.rate - b.rate);
    }

    return filteredPlans;
  }

  getPlanById(planId: string): EnergyPlan | undefined {
    return texasPlans.find((plan) => plan.id === planId);
  }

  getProviderById(providerId: string): EnergyProvider | undefined {
    return texasProviders.find((provider) => provider.id === providerId);
  }
}
