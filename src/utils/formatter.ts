import chalk from 'chalk';
import { EnergyPlan, EnergyProvider, PlanComparison } from '../types';

export class Formatter {
  static formatProvider(provider: EnergyProvider): string {
    const rating = provider.rating ? `⭐ ${provider.rating}/5` : 'No rating';
    return `
${chalk.bold.cyan(provider.name)}
${chalk.gray('─'.repeat(50))}
Website: ${chalk.blue(provider.website)}
Phone: ${provider.phone}
Rating: ${rating}
`;
  }

  static formatPlan(plan: EnergyPlan): string {
    return `
${chalk.bold.green(plan.planName)} by ${chalk.cyan(plan.providerName)}
${chalk.gray('─'.repeat(50))}
Rate: ${chalk.yellow(plan.rate + '¢/kWh')}
Type: ${plan.planType}
Term: ${plan.termLength} months
Base Charge: $${plan.baseCharge || 0}/month
Renewable: ${plan.renewablePercentage}% ${plan.renewablePercentage === 100 ? '🌱' : ''}
Cancellation Fee: $${plan.cancellationFee || 0}
Features:
${plan.features.map((f) => `  • ${f}`).join('\n')}
Service Area: ${plan.serviceArea.join(', ')}
`;
  }

  static formatComparison(comparison: PlanComparison, rank?: number): string {
    const rankText = rank ? `${chalk.bold(`#${rank}`)} ` : '';
    const savingsText = comparison.savings
      ? chalk.green(`💰 Save $${comparison.savings.toFixed(2)}/month`)
      : chalk.yellow('🏆 Best Price');

    return `
${rankText}${chalk.bold.green(comparison.plan.planName)} by ${chalk.cyan(comparison.plan.providerName)}
${chalk.gray('─'.repeat(50))}
${savingsText}
Estimated Monthly Cost: ${chalk.yellow('$' + comparison.estimatedMonthlyCost.toFixed(2))}
Estimated Annual Cost: ${chalk.yellow('$' + comparison.estimatedAnnualCost.toFixed(2))}
Rate: ${comparison.plan.rate}¢/kWh | Renewable: ${comparison.plan.renewablePercentage}%

${chalk.bold.green('✓ Pros:')}
${comparison.pros.map((pro) => chalk.green(`  • ${pro}`)).join('\n')}

${chalk.bold.red('✗ Cons:')}
${comparison.cons.map((con) => chalk.red(`  • ${con}`)).join('\n')}
`;
  }

  static formatRecommendation(recommendation: string): string {
    return `
${chalk.bold.blue('🎯 AI Recommendation:')}
${chalk.gray('─'.repeat(50))}
${chalk.white(recommendation)}
`;
  }

  static formatError(error: string): string {
    return chalk.red(`❌ Error: ${error}`);
  }

  static formatSuccess(message: string): string {
    return chalk.green(`✓ ${message}`);
  }

  static formatWarning(message: string): string {
    return chalk.yellow(`⚠ ${message}`);
  }

  static formatInfo(message: string): string {
    return chalk.blue(`ℹ ${message}`);
  }
}
