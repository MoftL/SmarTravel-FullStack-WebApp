// Function to fetch current fuel price from API
export const fetchCurrentFuelPrice = async () => {
  try {
    // Using a mock API that simulates fetching Romanian/German diesel prices
    const mockApiResponse = await new Promise((resolve) => {
      setTimeout(() => {
        // Simulate current European diesel prices (EUR/L converted to RON/L)
        // Romanian diesel: ~6.5-7.2 RON/L
        // German diesel: ~1.4-1.6 EUR/L (≈ 7.0-8.0 RON/L)
        const basePrice = Math.random() > 0.5 ? 6.7 : 7.3; // Romanian vs German prices
        const currentPrice = (basePrice + Math.random() * 0.4 - 0.2).toFixed(2);
        resolve({
          success: true,
          price: currentPrice,
          currency: 'RON',
          country: Math.random() > 0.5 ? 'Romania' : 'Germany',
          lastUpdated: new Date().toISOString()
        });
      }, 1500);
    });
    
    return mockApiResponse;
  } catch (error) {
    console.error('Failed to fetch fuel price:', error);
    throw new Error('Failed to update fuel price. Using current value.');
  }
};