# Modal Scraping Setup Instructions

We have set up the infrastructure to run Scrapy spiders on Modal.com's serverless infrastructure.

## Prerequisites

1. **Install Modal Client** (Already added to requirements.txt)

   ```bash
   pip install modal
   ```

2. **Authenticate with Modal**
   Run the following command and follow the browser prompts to log in:

   ```bash
   modal setup
   ```

3. **Configure Secrets**
   We need to provide your environment variables (like SUPABASE_URL and SUPABASE_KEY) to the cloud workers.

   Create a secret named `pickspy-secrets` in Modal:

   ```bash
   # Replace the values with your actual secrets from your .env file
   modal secret create pickspy-secrets SUPABASE_URL=your_supabase_url SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
   ```

## Running Spiders

You can now run any spider on the cloud using the following command:

```bash
# Run Amazon Bestsellers spider
modal run backend/modal_scraper.py --spider-name amazon_bestsellers

# Run Flipkart spider
modal run backend/modal_scraper.py --spider-name flipkart_trending
```

## How it works

1. The `modal_scraper.py` script defines a cloud function tailored for scraping.
2. It mounts your local `backend/` directory to the cloud instance, so your spiders and settings are preserved.
3. It installs `scrapy` and `supabase` in the cloud environment.
4. When you run the command, it spins up a container, executes the spider, and streams the logs back to your terminal.
