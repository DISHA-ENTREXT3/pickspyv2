import modal

def get_url():
    try:
        app = modal.App.lookup("pickspy-scrapers")
        # In newer Modal, we access the function details
        # The web_url is typically on the function handle
        # But we can also use the app's metadata
        print(f"WEB_URL: {app.api.web_url}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_url()
