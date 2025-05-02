// Global variable for the chart
let stockChart;

/**
 * Box-Muller transform to generate normally distributed random values
 * This transforms uniform random variables to standard normal distribution
 * @returns {number} A random number from the standard normal distribution
 */
function normalRandom() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Avoid log(0)
    while (v === 0) v = Math.random(); // Avoid log(0)
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Simulates stock price paths using Geometric Brownian Motion
 * 
 * The GBM model follows the stochastic differential equation:
 * dS_t = μS_t dt + σS_t dW_t
 * 
 * Where:
 * - S_t is the stock price at time t
 * - μ is the drift coefficient (expected return)
 * - σ is the volatility coefficient
 * - dW_t is the increment of a Wiener process
 */
function runSimulation() {
    // Get parameters from inputs
    const S0 = parseFloat(document.getElementById('S0').value);
    const mu = parseFloat(document.getElementById('mu').value);
    const sigma = parseFloat(document.getElementById('sigma').value);
    const T = parseFloat(document.getElementById('T').value);
    const M = parseInt(document.getElementById('M').value);
    
    // Get the number of time steps
    const N = parseInt(document.getElementById('N').value);
    // Calculate the time step based on the time period and number of steps
    const dt = T/N;
    
    // Create arrays for time and stock prices
    const timePoints = Array.from({length: N}, (_, i) => i * dt);
    
    // Initialize stock price array
    const stockPaths = Array(M).fill().map(() => Array(N).fill(0));
    
    // Set initial stock prices
    for (let m = 0; m < M; m++) {
        stockPaths[m][0] = S0;
    }
    
    // Simulate stock paths using the discretized GBM equation
    for (let i = 1; i < N; i++) {
        for (let m = 0; m < M; m++) {
            const Z = normalRandom();
            // Discretized GBM equation: S_{t+dt} = S_t * (1 + μ*dt + σ*sqrt(dt)*Z)
            stockPaths[m][i] = stockPaths[m][i-1] * (1 + mu * dt + sigma * Math.sqrt(dt) * Z);
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
    
    // Destroy previous chart if it exists to prevent memory leaks
    if (stockChart) {
        stockChart.destroy();
    }
    
    // Create the chart
    const ctx = document.getElementById('stockChart').getContext('2d');
    stockChart = new Chart(ctx, {
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
                    text: 'Simulated Stock Price Paths Using Geometric Brownian Motion',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                // Plot 10 ticks on the x-axis, with the first and last labels being the start and end times, rounded to 2 decimal places
                x: {
                    title: {
                        display: true,
                        text: 'Time (Years)'
                    },
                    type: 'linear', // Ensure the scale is treated numerically
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2);
                        },
                        stepSize: null, // We will define values directly
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

// Run simulation on page load
document.addEventListener('DOMContentLoaded', runSimulation);