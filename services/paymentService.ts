import apiService from './apiService';

interface Payment {
  _id: string;
  amount: number;
  description: string;
  status: 'En attente' | 'Payé' | 'En retard';
  dueDate: string;
}

/**
 * Fetches all payments for the logged-in user.
 * @returns {Promise<Payment[]>} A promise that resolves to an array of payments.
 */
export const getPayments = async (): Promise<Payment[]> => {
  try {
    const response = await apiService.get('/payments');
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

/**
 * Updates the status of a specific payment.
 * @param {string} paymentId - The ID of the payment to update.
 * @param {'En attente' | 'Payé' | 'En retard'} status - The new status.
 * @returns {Promise<Payment>} A promise that resolves to the updated payment object.
 */
export const updatePaymentStatus = async (
  paymentId: string,
  status: 'En attente' | 'Payé' | 'En retard'
): Promise<Payment> => {
  try {
    const response = await apiService.put(`/payments/${paymentId}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating payment ${paymentId}:`, error);
    throw error;
  }
};
