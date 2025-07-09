import requests as rq

# It's a good practice to use environment variables for URLs
BASE_URL = "http://localhost:5000/api"

def login():
    """
    Logs in the user and returns the auth token and user ID.
    """
    url = f"{BASE_URL}/auth/login"
    # Dummy data for demonstration
    data = {
        "phone": "0712345678",
        "password": "173803"
    }
    try:
        response = rq.post(url, json=data)
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx or 5xx)
        
        print("Login successful.")
        login_data = response.json()
        token = login_data.get("token")
        user_id = login_data.get("user", {}).get("_id")
        
        if not token or not user_id:
            print("Login failed: Token or User ID not in response.")
            return None, None
            
        return token, user_id

    except rq.exceptions.RequestException as e:
        print(f"Login failed: {e}")
        if e.response:
            print(f"Response body: {e.response.text}")
        return None, None

def get_buyer_orders(token, user_id):
    """
    Fetches orders for a specific buyer using their user ID and auth token.
    """
    url = f"{BASE_URL}/orders/buyer/{user_id}"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    try:
        response = rq.get(url, headers=headers)
        response.raise_for_status()
        
        orders = response.json()
        print("\n--- Buyer Orders ---")
        print(orders)
        print("--------------------")
        
    except rq.exceptions.RequestException as e:
        print(f"\nFailed to get orders: {e}")
        if e.response:
            print(f"Response body: {e.response.text}")

if __name__ == "__main__":
    print("Attempting to log in and fetch orders...")
    auth_token, buyer_id = login()
    
    if auth_token and buyer_id:
        get_buyer_orders(auth_token, buyer_id)
    else:
        print("\nCould not proceed to fetch orders due to login failure.")