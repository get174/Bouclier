import * as SecureStore from 'expo-secure-store';

export async function debugTokenStorage() {
  try {
    const tokens = await SecureStore.getItemAsync('authTokens');
    console.log('DEBUG: Stored authTokens:', tokens);
    const userData = await SecureStore.getItemAsync('userData');
    console.log('DEBUG: Stored userData:', userData);
  } catch (error) {
    console.error('DEBUG: Error reading tokens/userData from SecureStore:', error);
  }
}

// Run debug on module load
debugTokenStorage();
