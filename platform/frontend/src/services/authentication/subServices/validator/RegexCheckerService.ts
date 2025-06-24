type myResponse = {
    valid: boolean;
    message: string;
};

/**
 * Utility class for validating common input patterns using regular expressions.
 * Provides methods to check if strings match expected formats for names, usernames, emails, etc.
 */
class RegexChecker {
    /**
     * Validates a first name format.
     * Typically checks for:
     * - Letters only (possibly with accents)
     * - Optional hyphen or apostrophe
     * - Length between 2-50 characters
     * @param name - The first name to validate
     * @returns Response object with validation status and message
     */
    public firstName(name: string): myResponse {
        const isValid = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(name);
        
        if (!isValid) {
            return { valid: false, message: 'Contains invalid characters' };
        }
        if (name.length < 2) {
            return { valid: false, message: 'First name too short (min 2 characters)' };
        }
        if (name.length > 50) {
            return { valid: false, message: 'First name too long (max 50 characters)' };
        }
        
        return { valid: true, message: 'Valid first name' };
    }

    /**
     * Validates a last name format.
     * Typically checks for:
     * - Letters (possibly with accents)
     * - Optional hyphen, space, or apostrophe
     * - Length between 2-50 characters
     * @param name - The last name to validate
     * @returns Response object with validation status and message
     */
    public lastName(name: string): myResponse {
        const isValid = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(name);
        
        if (!isValid) {
            return { valid: false, message: 'Contains invalid characters' };
        }
        if (name.length < 2) {
            return { valid: false, message: 'Last name too short (min 2 characters)' };
        }
        if (name.length > 50) {
            return { valid: false, message: 'Last name too long (max 50 characters)' };
        }
        
        return { valid: true, message: 'Valid last name' };
    }

    /**
     * Validates a username format.
     * Typically checks for:
     * - Alphanumeric characters
     * - Optional underscores or hyphens
     * - Length between 3-20 characters
     * @param username - The username to validate
     * @returns Response object with validation status and message
     */
    public username(username: string): myResponse {
        const isValid = /^[a-zA-Z0-9_-]{3,20}$/.test(username);
        
        if (!isValid) {
            if (username.length < 3) {
                return { valid: false, message: 'Username too short (min 3 characters)' };
            }
            if (username.length > 20) {
                return { valid: false, message: 'Username too long (max 20 characters)' };
            }
            return { valid: false, message: 'Only letters, numbers, underscores and hyphens allowed' };
        }
        
        return { valid: true, message: 'Valid username' };
    }

    /**
     * Validates an email address format.
     * Checks for standard email pattern (user@domain.tld)
     * @param email - The email address to validate
     * @returns Response object with validation status and message
     */
    public email(email: string): myResponse {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        if (!isValid) {
            return { valid: false, message: 'Invalid email format' };
        }
        
        return { valid: true, message: 'Valid email' };
    }

    /**
     * Validates a password strength.
     * Typically checks for:
     * - Minimum length (8+ characters)
     * - At least one uppercase letter
     * - At least one lowercase letter
     * - At least one number
     * @param password - The password to validate
     * @returns Response object with validation status and message
     */
    public password(password: string): myResponse {
        if (password.length < 8) {
            return { valid: false, message: 'Password too short (min 8 characters)' };
        }
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'Password requires at least one uppercase letter' };
        }
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: 'Password requires at least one lowercase letter' };
        }
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: 'Password requires at least one number' };
        }
        
        return { valid: true, message: 'Valid password' };
    }
}

export default RegexChecker;