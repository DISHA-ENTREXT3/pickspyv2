import modal

def check_log(spider_name="amazon_bestsellers"):
    f = modal.Function.from_name("pickspy-scrapers", "run_spider_on_modal")
    result = f.remote(spider_name)
    print(f"Success: {result.get('success')}")
    if result.get("success"):
        print("--- LOG START ---")
        print(result.get("log"))
        print("--- LOG END ---")
    else:
        print(f"Error: {result.get('error')}")

if __name__ == "__main__":
    import sys
    spider = sys.argv[1] if len(sys.argv) > 1 else "amazon_bestsellers"
    check_log(spider)
