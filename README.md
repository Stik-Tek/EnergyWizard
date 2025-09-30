# EnergyWizard 🧙‍♂️⚡

An AI-powered tool for tracking and managing your electricity providers and plans in one place! Built with TypeScript and OpenAI, currently focused on Texas energy providers.

## Features

- 🔍 **Smart Plan Comparison**: Compare energy plans based on your actual usage
- 🤖 **AI-Powered Analysis**: Get intelligent recommendations using OpenAI GPT
- 🌱 **Renewable Energy Focus**: Filter and sort by renewable energy percentage
- 💰 **Cost Estimation**: See estimated monthly and annual costs
- 📊 **Provider Database**: Comprehensive list of Texas energy providers
- 🎯 **Personalized Recommendations**: AI analyzes plans based on your preferences

## Installation

```bash
npm install
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

5. Build the project:
   ```bash
   npm run build
   ```

## Usage

### List All Providers

```bash
npm run dev -- providers
```

Shows all available Texas energy providers with contact information and ratings.

### View Available Plans

```bash
# View all plans
npm run dev -- plans

# View plans from a specific provider
npm run dev -- plans --provider reliant
```

### Compare Plans (Basic - No API Key Required)

```bash
npm run dev -- compare --usage 1000 --zip 75001
```

Options:
- `-u, --usage <kWh>`: Your monthly usage in kWh (required)
- `-z, --zip <zipCode>`: Your ZIP code (required)
- `-r, --renewable`: Prefer renewable energy plans
- `--max-rate <cents>`: Maximum acceptable rate in cents per kWh
- `--max-term <months>`: Maximum term length in months
- `-l, --limit <number>`: Limit number of results (default: 5)

### AI-Powered Comparison (Requires OpenAI API Key)

```bash
npm run dev -- compare --usage 1000 --zip 75001 --renewable --limit 5
```

With an OpenAI API key configured, you'll get:
- Detailed pros and cons for each plan
- AI-generated recommendations
- Personalized analysis based on your preferences

### Analyze a Specific Plan

```bash
npm run dev -- analyze --plan reliant-solar-advantage-12 --usage 1000 --zip 75001 --renewable
```

## Example Commands

```bash
# Find the cheapest plans for 1500 kWh usage
npm run dev -- compare --usage 1500 --zip 77001

# Find renewable energy plans under 12¢/kWh
npm run dev -- compare --usage 1000 --zip 75001 --renewable --max-rate 12

# Compare short-term plans (12 months or less)
npm run dev -- compare --usage 800 --zip 78701 --max-term 12 --limit 3

# Analyze a specific plan with AI
npm run dev -- analyze --plan greenmountain-pollution-free-12 --usage 1200 --zip 75001 --renewable
```

## Project Structure

```
src/
├── cli.ts                 # CLI application entry point
├── index.ts               # Main library exports
├── types/
│   └── index.ts          # TypeScript type definitions
├── data/
│   ├── providers.ts      # Texas energy provider data
│   └── plans.ts          # Energy plan data
├── services/
│   ├── ai.ts            # OpenAI integration for AI analysis
│   └── planService.ts   # Plan search and filtering
└── utils/
    └── formatter.ts     # Output formatting utilities
```

## Available Providers

The MVP currently includes data for these Texas energy providers:
- Reliant Energy
- TXU Energy
- Gexa Energy
- Direct Energy
- Green Mountain Energy

## Development

```bash
# Run in development mode
npm run dev -- <command>

# Build the project
npm run build

# Run built version
npm start -- <command>
```

## Tech Stack

- **TypeScript**: Type-safe development
- **OpenAI GPT-3.5**: AI-powered plan analysis and recommendations
- **Commander**: CLI framework
- **Chalk**: Terminal styling
- **dotenv**: Environment variable management

## Future Enhancements

- [ ] Add more Texas providers and plans
- [ ] Support for other states
- [ ] Web interface
- [ ] User accounts and plan tracking
- [ ] Price alerts and notifications
- [ ] Historical rate comparison
- [ ] Integration with actual provider APIs
- [ ] Contract expiration reminders

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Disclaimer

This tool provides information and recommendations based on publicly available data and AI analysis. Always verify plan details directly with energy providers before making decisions. Rates and availability may change.
 
