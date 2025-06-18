import requests
import random
import string
import time
from colorama import Fore, Style, init

# Initialize colorama
init(autoreset=True)

class Authentication:
    def __init__(self, backendurl):
        self.backendurl = backendurl
        self.access_token = None
        self.refresh_token = None

    def signup(self, firstname, lastname, username, password):
        """Register a new user account"""
        try:
            response = requests.post(
                f"{self.backendurl}/signup",
                json={
                    "firstname": firstname,
                    "lastname": lastname,
                    "username": username,
                    "password": password
                }
            )
            response.raise_for_status()
            data = response.json()
            if data.get('success'):
                print(Fore.GREEN + "✓ Signup successful")
                return True
            else:
                print(Fore.RED + f"✗ Signup failed: {data.get('message', 'Unknown error')}")
                return False
        except requests.exceptions.RequestException as e:
            print(Fore.RED + f"✗ Signup failed: {str(e)}")
            return False

    def signin(self, username, password):
        """Authenticate and get refresh token"""
        try:
            response = requests.post(
                f"{self.backendurl}/signin",
                json={"username": username, "password": password}
            )
            response.raise_for_status()
            data = response.json()
            if data.get('success'):
                self.refresh_token = data.get('tokens', {}).get('refreshtoken')
                self.access_token = data.get('tokens', {}).get('accesstoken')
                print(Fore.GREEN + "✓ Login successful")
                return True
            else:
                print(Fore.RED + f"✗ Login failed: {data.get('message', 'Unknown error')}")
                return False
        except requests.exceptions.RequestException as e:
            print(Fore.RED + f"✗ Login failed: {str(e)}")
            return False

    def getJwtToken(self):
        """Refresh access token using refresh token"""
        if not self.refresh_token:
            print(Fore.RED + "✗ No refresh token available")
            return None
            
        try:
            response = requests.post(
                f"{self.backendurl}/refresh",
                headers={"Authorization": f"Bearer {self.refresh_token}"}
            )
            response.raise_for_status()
            data = response.json()
            if data.get('success'):
                self.access_token = data.get('tokens', {}).get('accesstoken')
                print(Fore.GREEN + "✓ Token refreshed")
                return self.access_token
            else:
                print(Fore.RED + f"✗ Token refresh failed: {data.get('message', 'Unknown error')}")
                return None
        except requests.exceptions.RequestException as e:
            print(Fore.RED + f"✗ Token refresh failed: {str(e)}")
            return None

    def accessPrivateInformation(self):
        """Access protected endpoint using JWT"""
        if not self.access_token:
            print(Fore.YELLOW + "⚠ No access token, attempting refresh...")
            if not self.getJwtToken():
                return None

        try:
            response = requests.get(
                f"{self.backendurl}/private",
                headers={"Authorization": f"Bearer {self.access_token}"}
            )
            response.raise_for_status()
            data = response.json()
            if 'user' in data:
                return data['user']
            return data
        except requests.exceptions.RequestException as e:
            print(Fore.RED + f"✗ Access denied: {str(e)}")
            return None

    def resetPassword(self, old_password, new_password):
        """Change user password"""
        if not self.access_token:
            print(Fore.RED + "✗ Authentication required")
            return False

        try:
            response = requests.post(
                f"{self.backendurl}/reset-password",
                headers={"Authorization": f"Bearer {self.access_token}"},
                json={
                    "oldPassword": old_password,
                    "newPassword": new_password
                }
            )
            response.raise_for_status()
            data = response.json()
            if data.get('success'):
                print(Fore.GREEN + "✓ Password changed successfully")
                return True
            else:
                print(Fore.RED + f"✗ Password change failed: {data.get('message', 'Unknown error')}")
                return False
        except requests.exceptions.RequestException as e:
            print(Fore.RED + f"✗ Password change failed: {str(e)}")
            return False

    def changeUsername(self, new_username, password):
        """Change user username"""
        if not self.access_token:
            print(Fore.RED + "✗ Authentication required")
            return False

        try:
            response = requests.post(
                f"{self.backendurl}/change-username",
                headers={"Authorization": f"Bearer {self.access_token}"},
                json={
                    "newUsername": new_username,
                    "password": password
                }
            )
            response.raise_for_status()
            data = response.json()
            if data.get('success'):
                print(Fore.GREEN + "✓ Username changed successfully")
                return True
            else:
                print(Fore.RED + f"✗ Username change failed: {data.get('message', 'Unknown error')}")
                return False
        except requests.exceptions.RequestException as e:
            print(Fore.RED + f"✗ Username change failed: {str(e)}")
            return False

    def deleteAccount(self, password):
        """Delete user account"""
        if not self.access_token:
            print(Fore.RED + "✗ Authentication required")
            return False

        try:
            response = requests.post(
                f"{self.backendurl}/delete-account",
                headers={"Authorization": f"Bearer {self.access_token}"},
                json={"password": password}
            )
            response.raise_for_status()
            data = response.json()
            if data.get('success'):
                print(Fore.GREEN + "✓ Account deleted successfully")
                self.refresh_token = None
                self.access_token = None
                return True
            else:
                print(Fore.RED + f"✗ Account deletion failed: {data.get('message', 'Unknown error')}")
                return False
        except requests.exceptions.RequestException as e:
            print(Fore.RED + f"✗ Account deletion failed: {str(e)}")
            return False

    def signout(self):
        """Invalidate refresh token"""
        if not self.refresh_token:
            print(Fore.RED + "✗ No refresh token to invalidate")
            return False

        try:
            response = requests.post(
                f"{self.backendurl}/signout",
                headers={"Authorization": f"Bearer {self.refresh_token}"}
            )
            response.raise_for_status()
            data = response.json()
            if data.get('success'):
                print(Fore.GREEN + "✓ Signed out successfully")
                self.refresh_token = None
                self.access_token = None
                return True
            else:
                print(Fore.RED + f"✗ Sign out failed: {data.get('message', 'Unknown error')}")
                return False
        except requests.exceptions.RequestException as e:
            print(Fore.RED + f"✗ Sign out failed: {str(e)}")
            return False


# Example Usage
if __name__ == "__main__":
    auth = Authentication("http://localhost:3000")
    
    # Test signup
    auth.signup("John", "Doe", "johndoe", "Secure123!")
    
    # Test signin
    if auth.signin("johndoe", "Secure123!"):
        # Access protected data
        private_data = auth.accessPrivateInformation()
        if private_data:
            print(Fore.CYAN + "Private data:", private_data)
        
        # Refresh token example
        time.sleep(2)  # Simulate token expiration
        new_token = auth.getJwtToken()
        
        # Password reset
        auth.resetPassword("Secure123!", "NewSecure456!")
        
        # Change username
        auth.changeUsername("john.doe", "NewSecure456!")
        
        # Delete account (commented out for safety)
        # auth.deleteAccount("NewSecure456!")
        
        auth.signout()