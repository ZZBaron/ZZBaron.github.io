// Global variable for the Merton Jump Diffusion chart
let mertonChart;

/**
 * Simulates stock price paths using Merton Jump Diffusion Model
 * 
 * The Merton Jump Diffusion model extends GBM by adding a jump component:
 * dS_t = (μ - λk)S_t dt + σS_t dW_t + S_t dJ_t
 * 
 * Where:
 * - S_t is the stock price at time t
 * - μ is the drift coefficient (expected return)
 * - σ is the volatility coefficient
 * - dW_t is the increment of a Wiener process
 * - λ is the jump intensity (average number of jumps per year)
 * - k is the expected jump size (E[Y-1] where Y is the jump size)
 * - dJ_t is the jump process (compound Poisson process)
 */
function runMertonSimulation() {
    // Get GBM parameters from inputs
    const S0 = parseFloat(document.getElementById('merton_S0').value);
    const mu = parseFloat(document.getElementById('merton_mu').value);
    const sigma = parseFloat(document.getElementById('merton_sigma').value);
    const T = parseFloat(document.getElementById('merton_T').value);
    const M = parseInt(document.getElementById('merton_M').value);
    const N = parseInt(document.getElementById('merton_N').value);
    
    // Get Jump Diffusion specific parameters
    const lambda = parseFloat(document.getElementById('merton_lambda').value);  // Jump intensity
    const muJ = parseFloat(document.getElementById('merton_muJ').value);        // Mean jump size
    const sigmaJ = parseFloat(document.getElementById('merton_sigmaJ').value);  // Jump size volatility
    
    // Calculate the time step and expected jump size adjustment
    const dt = T/N;
    const k = Math.exp(muJ + 0.5 * sigmaJ * sigmaJ) - 1;  // Expected jump size E[Y-1]
    
    // Create arrays for time and stock paths
    const timePoints = Array.from({length: N}, (_, i) => i * dt);
    const stockPaths = Array(M).fill().map(() => Array(N).fill(0));
    
    // Set initial stock prices
    for (let m = 0; m < M; m++) {
        stockPaths[m][0] = S0;
    }
    
    // Simulate stock paths using the Merton Jump Diffusion model
    for (let i = 1; i < N; i++) {
        for (let m = 0; m < M; m++) {
            // Diffusion component (GBM) with drift adjustment for jump compensation
            const Z = normalRandom();
            const diffusion = stockPaths[m][i-1] * ((mu - lambda * k) * dt + sigma * Math.sqrt(dt) * Z);
            
            // Jump component (Poisson process)
            // Generate number of jumps in this time interval (Poisson distributed)
            const jumpCount = poissonRandom(lambda * dt);
            
            // Calculate the total jump effect
            let jumpEffect = 0;
            if (jumpCount > 0) {
                // For each jump, generate a log-normal jump size
                for (let j = 0; j < jumpCount; j++) {
                    // Log-normal jump size: Y ~ ln(N(μJ, σJ²))
                    const jumpSize = Math.exp(muJ + sigmaJ * normalRandom());
                    jumpEffect += (jumpSize - 1) * stockPaths[m][i-1];
                }
            }
            
            // Combine diffusion and jump components for the new price
            stockPaths[m][i] = stockPaths[m][i-1] + diffusion + jumpEffect;
            
            // Ensure price stays positive (numerical stability)
            if (stockPaths[m][i] <= 0) {
                stockPaths[m][i] = 0.01; // Small positive value
            }
        }
    }
    
    // Prepare data for Chart.js
    const datasets = stockPaths.map((path, index) => {
        // Generate different colors for each simulation path
        const color = `hsl(${(index * 360 / M) % 360}, 70%, 60%)`;
        return {
            label: `Simulation ${index + 1}`,
            data: path,
            borderColor: color,
            backgroundColor: 'transparent',
            borderWidth: 1,
            pointRadius: 0
        };
    });
    
    // Destroy previous chart if it exists
    if (mertonChart) {
        mertonChart.destroy();
    }
    
    // Create the chart
    const ctx = document.getElementById('mertonChart').getContext('2d');
    mertonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timePoints,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Simulated Stock Price Paths Using Merton Jump Diffusion Model',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    // only show the tooltip of number of simulations is small
                    enabled: M <= 10,
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (Years)'
                    },
                    type: 'linear',
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2);
                        },
                        stepSize: null,
                        values: function(context) {
                            const max = context.chart.data.labels[context.chart.data.labels.length - 1];
                            const min = context.chart.data.labels[0];
                            const step = (max - min) / 9; // 10 ticks = 9 intervals
                            return Array.from({ length: 10 }, (_, i) => parseFloat((min + i * step).toFixed(10)));
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Stock Price'
                    }
                }
            }
        }
    });
}

/**
 * Generates a Poisson random variable with parameter lambda
 * @param {number} lambda The rate parameter of the Poisson distribution
 * @returns {number} A random number from the Poisson distribution
 */
function poissonRandom(lambda) {
    if (lambda <= 0) return 0;
    
    // For small lambda, use direct method
    if (lambda < 30) {
        const L = Math.exp(-lambda);
        let k = 0;
        let p = 1;
        
        do {
            k++;
            p *= Math.random();
        } while (p > L);
        
        return k - 1;
    } 
    // For large lambda, use normal approximation
    else {
        const k = Math.floor(Math.random() * 2 * lambda); // Simple approximation
        return k;
    }
}

// Run both simulations on page load
document.addEventListener('DOMContentLoaded', function() {
    runMertonSimulation();
});