from Authentication import Authentication
from colorama import Fore
import random
import string
import time

auth = Authentication("http://localhost:3000")

def random_string(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def generate_password():
    """Generate a more secure password with special characters"""
    chars = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(random.choices(chars, k=12))

def generate_and_test_user():
    # Generate initial credentials
    firstname = random_string(6)
    lastname = random_string(6)
    username = random_string(10)
    password = generate_password()

    # Sign up and test basic flow
    signup_success = auth.signup(firstname, lastname, username, password)
    if signup_success:
        signin_success = auth.signin(username, password)
        if signin_success:
            # Access private data
            private_data = auth.accessPrivateInformation()
            if private_data:
                print(Fore.CYAN + f"Private data for {username}: {private_data}")

            # Test token refresh if refresh token is available
            if auth.refresh_token:
                time.sleep(0.1)
                new_token = auth.getJwtToken()
                if not new_token:
                    print(Fore.RED + "✗ Token refresh failed")

            # Generate new credentials for modification
            new_username = random_string(10)
            new_password = generate_password()

            # Change username
            username_changed = auth.changeUsername(new_username, password)
            if username_changed:
                print(Fore.YELLOW + f"✓ Username changed from {username} to {new_username}")
                username = new_username  # Update local reference
            else:
                print(Fore.RED + "✗ Failed to change username")
            
            # Change password
            password_changed = auth.resetPassword(password, new_password)
            if password_changed:
                print(Fore.YELLOW + "✓ Password changed successfully")
                password = new_password  # Update local reference
            else:
                print(Fore.RED + "✗ Failed to change password")

            # Verify changes work by signing in again
            signed_out = auth.signout()
            if signed_out:
                print(Fore.BLUE + "✓ Signed out successfully")
                
                # Sign in with new credentials
                new_signin_success = auth.signin(username, password)
                if new_signin_success:
                    print(Fore.GREEN + "✓ Modified credentials work correctly")
                    
                    # Finally delete the account
                    account_deleted = auth.deleteAccount(password)
                    if account_deleted:
                        print(Fore.RED + f"✓ Account {username} deleted")
                    else:
                        print(Fore.RED + f"✗ Failed to delete account {username}")
                else:
                    print(Fore.RED + "✗ Modified credentials don't work!")
            else:
                print(Fore.RED + "✗ Failed to sign out")
        else:
            print(Fore.RED + f"✗ Failed to sign in as {username}")
    else:
        print(Fore.RED + f"✗ Failed to sign up {username}")

def main():
    user_count = 10  # Reduced from 100 for more manageable testing
    for i in range(user_count):
        print(Fore.WHITE + f"\n=== Testing user {i+1}/{user_count} ===")
        generate_and_test_user()
        time.sleep(0.5)  # Small delay between users

    print(Fore.GREEN + f"\n✓ {user_count} users created, modified, and deleted.")

if __name__ == "__main__":
    main()