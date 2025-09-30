# EnergyWizard Examples

This document provides practical examples of using EnergyWizard to find and compare Texas energy plans.

## Basic Usage Examples

### 1. List All Available Providers

```bash
npm run dev -- providers
```

**Output:** Shows all Texas energy providers with ratings and contact information

### 2. Browse All Plans

```bash
npm run dev -- plans
```

**Output:** Displays all 8 available energy plans with complete details

### 3. View Plans from a Specific Provider

```bash
npm run dev -- plans --provider reliant
```

**Output:** Shows only Reliant Energy plans

## Comparison Examples

### Example 1: Basic Comparison (No AI)

Find the best plans for a household using 1000 kWh per month in Dallas:

```bash
npm run dev -- compare --usage 1000 --zip 75001 --limit 5
```

**Expected Result:**
- Lists top 5 cheapest plans
- Shows estimated monthly costs
- Displays rates, terms, and cancellation fees

### Example 2: Focus on Renewable Energy

Find 100% renewable energy plans for Austin home using 1200 kWh/month:

```bash
npm run dev -- compare --usage 1200 --zip 78701 --renewable --limit 3
```

**Expected Result:**
- Prioritizes plans with 100% renewable energy
- Shows only green energy options
- Compares costs for your specific usage

### Example 3: Budget-Conscious Search

Find plans under 11¢/kWh for a Houston apartment using 800 kWh/month:

```bash
npm run dev -- compare --usage 800 --zip 77001 --max-rate 11 --limit 5
```

**Expected Result:**
- Only shows plans with rates at or below 11¢/kWh
- Sorted by estimated monthly cost
- Ideal for budget optimization

### Example 4: Short-Term Commitment

Find flexible plans with maximum 12-month terms:

```bash
npm run dev -- compare --usage 1000 --zip 75001 --max-term 12 --limit 5
```

**Expected Result:**
- Only 12-month plans (no longer commitments)
- Great for renters or uncertain situations

### Example 5: Combined Filters

Find affordable renewable plans with flexible terms for 1500 kWh usage:

```bash
npm run dev -- compare --usage 1500 --zip 78701 --renewable --max-rate 12 --max-term 12 --limit 3
```

**Expected Result:**
- 100% renewable energy
- Rate at or below 12¢/kWh
- 12-month terms only
- Optimized for your usage

## AI-Powered Analysis (Requires OpenAI API Key)

### Setup for AI Features

1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Add your key to `.env`:
   ```
   OPENAI_API_KEY=sk-...your-key-here
   ```

### Example 6: AI Plan Comparison

With OpenAI API key configured, get intelligent analysis:

```bash
npm run dev -- compare --usage 1000 --zip 75001 --renewable --limit 3
```

**AI-Enhanced Output Includes:**
- Detailed pros and cons for each plan
- Personalized recommendations based on your preferences
- Smart insights about rate competitiveness
- Analysis of renewable energy impact
- Term length considerations
- Cost-benefit analysis

### Example 7: Deep Dive on a Specific Plan

Analyze a specific plan in detail:

```bash
npm run dev -- analyze --plan reliant-solar-advantage-12 --usage 1000 --zip 75001 --renewable
```

**AI Analysis Provides:**
- Comprehensive pros (3 specific benefits)
- Comprehensive cons (3 specific drawbacks)
- Cost estimates for your usage
- Recommendation on whether it fits your needs

### Example 8: Get AI Recommendation

Let AI recommend the best plan for your specific situation:

```bash
npm run dev -- compare --usage 1200 --zip 78701 --renewable --max-rate 12 --limit 5
```

**AI Recommendation Includes:**
- Analysis of top matching plans
- Personalized suggestion based on all your criteria
- Reasoning behind the recommendation
- Trade-offs to consider

## Real-World Scenarios

### Scenario 1: Moving to Austin
**Situation:** Just moved to Austin, using ~1000 kWh/month, care about environment

```bash
npm run dev -- compare --usage 1000 --zip 78701 --renewable --limit 5
```

### Scenario 2: Dallas Apartment
**Situation:** Small apartment in Dallas, ~600 kWh/month, tight budget

```bash
npm run dev -- compare --usage 600 --zip 75201 --max-rate 10 --limit 5
```

### Scenario 3: Houston Family Home
**Situation:** Large house in Houston, ~2000 kWh/month (AC!), want stability

```bash
npm run dev -- compare --usage 2000 --zip 77001 --max-term 12 --limit 5
```

### Scenario 4: San Antonio Rental
**Situation:** Renting in San Antonio, ~800 kWh/month, want flexibility

```bash
npm run dev -- compare --usage 800 --zip 78201 --max-term 12 --limit 3
```

### Scenario 5: Fort Worth Green Living
**Situation:** Fort Worth, ~1100 kWh/month, committed to renewable energy

```bash
npm run dev -- compare --usage 1100 --zip 76101 --renewable --limit 5
```

## Understanding the Results

### Reading Cost Estimates

- **Monthly Cost** = (Rate × Usage) + Base Charge
- **Annual Cost** = Monthly Cost × 12
- Consider cancellation fees if you might move

### Evaluating Renewable Percentage

- **100%** = All energy from renewable sources (wind/solar)
- **0%** = Traditional power sources
- **20-50%** = Partial renewable energy

### Understanding Plan Types

- **Fixed Rate** = Rate locked for term duration (most common)
- **Variable Rate** = Rate changes monthly based on market
- **Indexed** = Rate tied to market index

## Tips for Best Results

1. **Know Your Usage**: Check past bills for accurate kWh numbers
2. **Consider Seasonal Variation**: Texas summers use more AC (higher usage)
3. **Read the Fine Print**: Check the actual provider's terms before signing
4. **Plan Ahead**: Start comparing 60-90 days before current plan expires
5. **Use AI Analysis**: Get deeper insights with OpenAI integration
6. **Factor in Cancellation Fees**: Important if you might move
7. **Renewable Energy**: Often slightly higher rates but better for environment

## Available Plan IDs for Analysis

Use these IDs with the `analyze` command:

- `reliant-solar-advantage-12` - Reliant 100% renewable
- `reliant-basic-12` - Reliant basic fixed rate
- `txu-energy-secure-12` - TXU standard plan
- `txu-solar-buyback-12` - TXU 100% renewable
- `gexa-saver-supreme-12` - Gexa lowest rate
- `directenergy-live-brighter-12` - Direct Energy
- `greenmountain-pollution-free-12` - Green Mountain 100% wind
- `greenmountain-value-12` - Green Mountain value plan

## Need Help?

Run any command with `--help` to see available options:

```bash
npm run dev -- --help
npm run dev -- compare --help
npm run dev -- analyze --help
```
