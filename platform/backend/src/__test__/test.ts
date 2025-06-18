import { AuthService } from './AuthService';

// Add the missing logResponse function
const logResponse = (operation: string, response: any) => {
  console.log(`--- ${operation} ---`);
  console.log(response);
  console.log('------------------');
};

// Create an instance of AuthService
const authService = new AuthService();

const runAuthExample = async () => {
  try {
    // Create first user
    const user1Credentials = {
      firstname: 'John',
      lastname: 'Doe',
      username: 'johndoe',
      password: 'password123',
      birthdate: '1990-01-01',
      agreedTermsOfService: true
    };

    // Create second user
    const user2Credentials = {
      firstname: 'Jane',
      lastname: 'Smith',
      username: 'janesmith',
      password: 'securepass456',
      birthdate: '1992-05-15',
      agreedTermsOfService: true
    };

    // Sign up both users
    const signUpUser1 = await authService.signUp(user1Credentials);
    logResponse('User 1 Sign Up', signUpUser1);

    const signUpUser2 = await authService.signUp(user2Credentials);
    logResponse('User 2 Sign Up', signUpUser2);

    // Sign in user 1
    const signInUser1 = await authService.signIn('johndoe', 'password123');
    logResponse('User 1 Sign In', signInUser1);

    // Get private data for user 1 (should show John's data)
    const privateDataUser1 = await authService.getPrivateData();
    logResponse('User 1 Private Data', privateDataUser1);

    // Change username for user 1
    const changeUsername = await authService.changeUsername('johnny', 'password123');
    logResponse('User 1 Change Username', changeUsername);

    // Sign out user 1
    const signOutUser1 = await authService.signOut();
    logResponse('User 1 Sign Out', signOutUser1);

    // Sign in user 2
    const signInUser2 = await authService.signIn('janesmith', 'securepass456');
    logResponse('User 2 Sign In', signInUser2);

    // Reset password for user 2
    const resetPassword = await authService.resetPassword('securepass456', 'newsecurepass789');
    logResponse('User 2 Reset Password', resetPassword);

    // Delete account for user 2
    const deleteAccount = await authService.deleteAccount('newsecurepass789');
    logResponse('User 2 Delete Account', deleteAccount);

  } catch (error) {
    console.error('Error in auth example:', error);
  }
};

// Actually run the example
runAuthExample();
