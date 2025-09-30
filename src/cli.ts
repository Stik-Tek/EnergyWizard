#!/usr/bin/env node
import { Command } from 'commander';
import dotenv from 'dotenv';
import { AIService } from './services/ai';
import { PlanService } from './services/planService';
import { Formatter } from './utils/formatter';
import { UserPreferences } from './types';

dotenv.config();

const program = new Command();

program
  .name('energywizard')
  .description('AI-powered Texas energy plan comparison tool')
  .version('1.0.0');

program
  .command('providers')
  .description('List all Texas energy providers')
  .action(() => {
    const planService = new PlanService();
    const providers = planService.getProviders();

    console.log('\n📋 Texas Energy Providers:\n');
    providers.forEach((provider) => {
      console.log(Formatter.formatProvider(provider));
    });
  });

program
  .command('plans')
  .description('List all available energy plans')
  .option('-p, --provider <providerId>', 'Filter by provider ID')
  .action((options) => {
    const planService = new PlanService();
    const plans = options.provider
      ? planService.getPlansByProvider(options.provider)
      : planService.getPlans();

    if (plans.length === 0) {
      console.log(Formatter.formatWarning('No plans found.'));
      return;
    }

    console.log(`\n📋 Energy Plans (${plans.length} found):\n`);
    plans.forEach((plan) => {
      console.log(Formatter.formatPlan(plan));
    });
  });

program
  .command('compare')
  .description('Compare energy plans based on your usage')
  .requiredOption('-u, --usage <kWh>', 'Monthly usage in kWh', parseFloat)
  .requiredOption('-z, --zip <zipCode>', 'ZIP code')
  .option('-r, --renewable', 'Prefer renewable energy plans', false)
  .option('--max-rate <cents>', 'Maximum rate in cents per kWh', parseFloat)
  .option('--max-term <months>', 'Maximum term length in months', parseInt)
  .option('-l, --limit <number>', 'Limit number of results', parseInt, 5)
  .action(async (options) => {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.log(Formatter.formatError('OPENAI_API_KEY not found in environment variables.'));
      console.log(Formatter.formatInfo('Create a .env file with: OPENAI_API_KEY=your_key_here'));
      console.log(Formatter.formatWarning('Continuing without AI analysis (basic comparison only)...'));
    }

    const preferences: UserPreferences = {
      monthlyUsage: options.usage,
      zipCode: options.zip,
      preferRenewable: options.renewable,
      maxRate: options.maxRate,
      maxTermLength: options.maxTerm,
    };

    const planService = new PlanService();
    const plans = planService.searchPlans(preferences).slice(0, options.limit);

    if (plans.length === 0) {
      console.log(Formatter.formatWarning('No plans match your criteria.'));
      return;
    }

    console.log(Formatter.formatInfo(`Analyzing ${plans.length} plans for ${options.usage} kWh/month usage...`));
    console.log('');

    if (apiKey) {
      const aiService = new AIService(apiKey);
      const comparisons = await aiService.compareMultiplePlans(plans, preferences);

      console.log('\n🔍 Plan Comparison Results:\n');
      comparisons.forEach((comparison, index) => {
        console.log(Formatter.formatComparison(comparison, index + 1));
      });

      const recommendation = await aiService.getRecommendation(plans, preferences);
      console.log(Formatter.formatRecommendation(recommendation));
    } else {
      console.log('\n🔍 Basic Plan Comparison (without AI analysis):\n');
      plans.forEach((plan, index) => {
        const monthlyCost = (plan.rate / 100) * options.usage + (plan.baseCharge || 0);
        console.log(`
${index + 1}. ${plan.providerName} - ${plan.planName}
   Rate: ${plan.rate}¢/kWh | Renewable: ${plan.renewablePercentage}%
   Estimated Monthly Cost: $${monthlyCost.toFixed(2)}
   Term: ${plan.termLength} months | Cancellation: $${plan.cancellationFee || 0}
        `);
      });
    }
  });

program
  .command('analyze')
  .description('Get AI analysis of a specific plan')
  .requiredOption('-p, --plan <planId>', 'Plan ID to analyze')
  .requiredOption('-u, --usage <kWh>', 'Monthly usage in kWh', parseFloat)
  .requiredOption('-z, --zip <zipCode>', 'ZIP code')
  .option('-r, --renewable', 'Prefer renewable energy plans', false)
  .action(async (options) => {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.log(Formatter.formatError('OPENAI_API_KEY is required for AI analysis.'));
      console.log(Formatter.formatInfo('Create a .env file with: OPENAI_API_KEY=your_key_here'));
      process.exit(1);
    }

    const planService = new PlanService();
    const plan = planService.getPlanById(options.plan);

    if (!plan) {
      console.log(Formatter.formatError(`Plan '${options.plan}' not found.`));
      process.exit(1);
    }

    const preferences: UserPreferences = {
      monthlyUsage: options.usage,
      zipCode: options.zip,
      preferRenewable: options.renewable,
    };

    console.log(Formatter.formatInfo('Analyzing plan with AI...'));
    console.log('');

    const aiService = new AIService(apiKey);
    const comparison = await aiService.analyzePlan(plan, preferences);

    console.log(Formatter.formatComparison(comparison));
  });

program.parse();
