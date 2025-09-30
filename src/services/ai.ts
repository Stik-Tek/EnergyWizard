import OpenAI from 'openai';
import { EnergyPlan, UserPreferences, PlanComparison } from '../types';

export class AIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async analyzePlan(plan: EnergyPlan, preferences: UserPreferences): Promise<PlanComparison> {
    const estimatedMonthlyCost = this.calculateMonthlyCost(plan, preferences.monthlyUsage);
    const estimatedAnnualCost = estimatedMonthlyCost * 12;

    const prompt = `Analyze this energy plan and provide pros and cons based on user preferences:
    
Plan: ${plan.providerName} - ${plan.planName}
Rate: ${plan.rate} cents/kWh
Base Charge: $${plan.baseCharge || 0}/month
Term: ${plan.termLength} months
Renewable: ${plan.renewablePercentage}%
Cancellation Fee: $${plan.cancellationFee || 0}

User Preferences:
Monthly Usage: ${preferences.monthlyUsage} kWh
Prefer Renewable: ${preferences.preferRenewable ? 'Yes' : 'No'}
Max Term Length: ${preferences.maxTermLength || 'No preference'} months
Max Rate: ${preferences.maxRate || 'No preference'} cents/kWh

Please provide:
1. Three specific pros (benefits) of this plan
2. Three specific cons (drawbacks) of this plan

Format your response as JSON with this structure:
{
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["con1", "con2", "con3"]
}`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert energy consultant specializing in Texas electricity plans. Provide clear, concise analysis.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content || '{}';
      const analysis = JSON.parse(content);

      return {
        plan,
        estimatedMonthlyCost,
        estimatedAnnualCost,
        pros: analysis.pros || ['Competitive pricing', 'Reliable service', 'Good features'],
        cons: analysis.cons || ['Standard cancellation fee', 'Fixed term commitment', 'May not suit all users'],
      };
    } catch (error) {
      console.warn('AI analysis failed, using fallback analysis:', error);
      return this.getFallbackAnalysis(plan, preferences, estimatedMonthlyCost, estimatedAnnualCost);
    }
  }

  async compareMultiplePlans(
    plans: EnergyPlan[],
    preferences: UserPreferences
  ): Promise<PlanComparison[]> {
    const analyses = await Promise.all(
      plans.map((plan) => this.analyzePlan(plan, preferences))
    );

    const sortedAnalyses = analyses.sort((a, b) => a.estimatedMonthlyCost - b.estimatedMonthlyCost);

    const lowestCost = sortedAnalyses[0]?.estimatedMonthlyCost || 0;
    return sortedAnalyses.map((analysis) => ({
      ...analysis,
      savings: analysis.estimatedMonthlyCost > lowestCost 
        ? analysis.estimatedMonthlyCost - lowestCost 
        : 0,
    }));
  }

  async getRecommendation(
    plans: EnergyPlan[],
    preferences: UserPreferences
  ): Promise<string> {
    const comparisons = await this.compareMultiplePlans(plans, preferences);
    
    const prompt = `Based on the following energy plan comparisons and user preferences, provide a recommendation:

User Preferences:
- Monthly Usage: ${preferences.monthlyUsage} kWh
- Prefer Renewable: ${preferences.preferRenewable ? 'Yes' : 'No'}
- Max Term: ${preferences.maxTermLength || 'No preference'} months
- Max Rate: ${preferences.maxRate || 'No preference'} cents/kWh

Plans (sorted by estimated monthly cost):
${comparisons.map((c, i) => `
${i + 1}. ${c.plan.providerName} - ${c.plan.planName}
   Monthly Cost: $${c.estimatedMonthlyCost.toFixed(2)}
   Rate: ${c.plan.rate} ¢/kWh
   Renewable: ${c.plan.renewablePercentage}%
   Term: ${c.plan.termLength} months
`).join('\n')}

Provide a concise recommendation (2-3 sentences) on which plan best matches the user's needs and why.`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert energy consultant. Provide clear, actionable recommendations.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      return response.choices[0]?.message?.content || 'Unable to generate recommendation.';
    } catch (error) {
      console.warn('AI recommendation failed:', error);
      return this.getFallbackRecommendation(comparisons, preferences);
    }
  }

  private calculateMonthlyCost(plan: EnergyPlan, monthlyUsage: number): number {
    const energyCost = (plan.rate / 100) * monthlyUsage;
    const baseCharge = plan.baseCharge || 0;
    return energyCost + baseCharge;
  }

  private getFallbackAnalysis(
    plan: EnergyPlan,
    preferences: UserPreferences,
    estimatedMonthlyCost: number,
    estimatedAnnualCost: number
  ): PlanComparison {
    const pros: string[] = [];
    const cons: string[] = [];

    if (plan.rate < 11) {
      pros.push('Competitive rate below 11¢/kWh');
    }
    if (plan.renewablePercentage === 100) {
      pros.push('100% renewable energy');
    }
    if (plan.baseCharge && plan.baseCharge < 10) {
      pros.push('Low monthly base charge');
    }
    if (plan.termLength === 12) {
      pros.push('Standard 12-month term provides good rate lock');
    }

    if (plan.cancellationFee && plan.cancellationFee > 150) {
      cons.push('High cancellation fee');
    }
    if (plan.renewablePercentage === 0 && preferences.preferRenewable) {
      cons.push('No renewable energy options');
    }
    if (preferences.maxRate && plan.rate > preferences.maxRate) {
      cons.push('Rate exceeds your preferred maximum');
    }

    while (pros.length < 3) {
      pros.push('Reliable service provider');
    }
    while (cons.length < 3) {
      cons.push('Requires term commitment');
    }

    return {
      plan,
      estimatedMonthlyCost,
      estimatedAnnualCost,
      pros: pros.slice(0, 3),
      cons: cons.slice(0, 3),
    };
  }

  private getFallbackRecommendation(
    comparisons: PlanComparison[],
    preferences: UserPreferences
  ): string {
    if (comparisons.length === 0) {
      return 'No plans available for comparison.';
    }

    const cheapest = comparisons[0];
    
    if (preferences.preferRenewable) {
      const greenPlan = comparisons.find((c) => c.plan.renewablePercentage === 100);
      if (greenPlan) {
        return `For renewable energy preference, I recommend ${greenPlan.plan.providerName}'s ${greenPlan.plan.planName} at $${greenPlan.estimatedMonthlyCost.toFixed(2)}/month with 100% renewable energy.`;
      }
    }

    return `Based on your usage of ${preferences.monthlyUsage} kWh/month, I recommend ${cheapest.plan.providerName}'s ${cheapest.plan.planName} at $${cheapest.estimatedMonthlyCost.toFixed(2)}/month, which offers the best value.`;
  }
}
