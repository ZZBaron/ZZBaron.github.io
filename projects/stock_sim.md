+++
title = "Geometric Brownian Motion Stock Price Simulation"
hascode = true
date = Date(2024, 1, 1)
rss = "Interactive simulation of stock prices using Geometric Brownian Motion"
repo_url = "https://github.com/ZZBaron/ZZBaron.github.io/blob/main/js/GBM.js"
+++

@def tags = ["finance", "simulation", "stochastic-processes"]

# Geometric Brownian Motion Stock Price Simulation

## Project Overview

This project models and visualizes stock price movements using Geometric Brownian Motion (GBM), one of the most fundamental stochastic processes in financial mathematics. GBM serves as the foundation for the Black-Scholes option pricing model and is widely used for simulating asset price paths in finance.

## Geometric Brownian Motion Simulation

Adjust the parameters below to see how they affect the stock price simulations:

~~~
<div class="sim-container">
    <div class="sim-controls-container">
        <div class="sim-controls">
            <div class="sim-control-group">
                <label for="S0">Initial Stock Price (S₀):</label>
                <input type="number" id="S0" value="100">
            </div>
            <div class="sim-control-group">
                <label for="mu">Expected Return/Drift (μ):</label>
                <input type="number" id="mu" value="0.05" step="0.01">
            </div>
            <div class="sim-control-group">
                <label for="sigma">Volatility (σ):</label>
                <input type="number" id="sigma" value="0.2" step="0.01">
            </div>
            <div class="sim-control-group">
                <label for="T">Time Period T (years):</label>
                <input type="number" id="T" value="1" step="0.1">
            </div>
            <div class="sim-control-group">
                <label for="M">Number of Simulations:</label>
                <input type="number" id="M" value="10" min="1" max="50">
            </div>
            <div class="sim-control-group">
                <label for="N">Number of Time Steps:</label>
                <input type="number" id="N" value="252" min="10" max="1000">
                <p class="sim-note">There are 252 trading days in a year.</p>
            </div>
        </div>
        
        <div class="sim-button-container">
            <button class="sim-button" onclick="runSimulation()">Run Simulation</button>
        </div>
    </div>
    
    <div class="sim-chart-container">
        <canvas id="stockChart"></canvas>
    </div>
</div>
~~~

## Geometric Brownian Motion Model

Geometric Brownian Motion (GBM) is a continuous-time stochastic process where the logarithm of the randomly varying quantity follows a Brownian motion with drift (Hull, 2017). The stochastic differential equation (SDE) for GBM is:

$$ dS_t = \mu S_t dt + \sigma S_t dW_t $$

Where:

* $S_t$ = Stock price at time $t$
* $\mu$ = Drift coefficient (expected return)
* $\sigma$ = Volatility coefficient
* $dW_t$ = Increment of a Wiener process (standard Brownian motion)

The solution to this SDE can be expressed in closed form (Hull, 2017) as:

$$ S_t = S_0 \exp\left(\left(\mu - \frac{\sigma^2}{2}\right)t + \sigma W_t\right) $$

### Discretization for Simulation

For computational purposes, we discretize the GBM equation. Using the continuous-time closed form solution:

$$ S_{t + \Delta t} = S_t \exp \left( \left(\mu - \frac{\sigma^2}{2}\right) \Delta t + \sigma \sqrt{\Delta t} Z \right) $$

Where $Z \sim \mathcal{N}(0,1)$.

### Properties of GBM

* **Log-normality:** The future stock price $S_t$ has a log-normal distribution.
* **Multiplicative nature:** Percentage changes rather than absolute changes are modeled.
* **No negative values:** Stock prices remain positive, consistent with limited liability.
* **Markov property:** Future price movements depend only on the current price, not the past trajectory.
* **Independent increments:** Price changes over non-overlapping time intervals are independent.

## Model Limitations

Despite its widespread use, GBM has several limitations as discussed by various researchers (Cont, 2001; Mandelbrot, 1963):

* **Constant Parameters:** Assumes constant drift and volatility, though these may vary over time.
* **Normal Distribution of Returns:** Real market returns often exhibit "fat tails" with more extreme events than predicted by normal distributions.
* **Continuous Price Paths:** Real markets can have gaps and jumps, especially overnight or during news events.
* **No Mean Reversion:** Some assets show tendencies to revert to long-term averages.
* **No Volatility Clustering:** Real markets often show periods of high volatility followed by periods of calm.
* **Perfect Liquidity:** Assumes assets can be traded continuously with no impact on price.

## Extensions and Alternatives

To address the limitations of the basic GBM model, several extensions have been proposed:

* **Jump-Diffusion Models:** Incorporate discrete jumps to account for sudden price movements (Merton, 1976). This model is discussed and simulated below.
* **Stochastic Volatility Models:** Allow volatility to evolve stochastically (Heston, 1993).
* **Regime-Switching Models:** Allow parameters to change based on market regimes (Hamilton, 1989).
* **GARCH Models:** Capture volatility clustering in discrete time (Bollerslev, 1986).
* **Fractional Brownian Motion:** Incorporate long-memory dependencies (Mandelbrot & van Ness, 1968).

## Merton Jump Diffusion Model Simulation

Below is an interactive simulation using the Merton Jump Diffusion model, which extends the GBM by adding random jumps to better capture sudden market movements:

~~~
<div class="sim-container">
    <div class="sim-controls-container">
        <div class="sim-controls">
            <div class="sim-control-group">
                <label for="merton_S0">Initial stock price \( S_{0} \):</label>
                <input type="number" id="merton_S0" value="100">
            </div>
            <div class="sim-control-group">
                <label for="merton_mu">Expected return/drift \( \mu \):</label>
                <input type="number" id="merton_mu" value="0.05" step="0.01">
            </div>
            <div class="sim-control-group">
                <label for="merton_sigma">Volatility \( \sigma \):</label>
                <input type="number" id="merton_sigma" value="0.2" step="0.01">
            </div>
            <div class="sim-control-group">
                <label for="merton_T">Time period \( T \) [years]:</label>
                <input type="number" id="merton_T" value="1" step="0.1">
            </div>
            <div class="sim-control-group">
                <label for="merton_M">Number of simulations:</label>
                <input type="number" id="merton_M" value="10" min="1" max="50">
            </div>
            <div class="sim-control-group">
                <label for="merton_N">Number of time steps:</label>
                <input type="number" id="merton_N" value="252" min="10" max="1000">
            </div>
            <div class="sim-control-group">
                <label for="merton_lambda">Jump intensity \( \lambda \):</label>
                <input type="number" id="merton_lambda" value="1" min="0" step="0.1">
                <p class="sim-note">Average number of jumps per year.</p>
            </div>
            <div class="sim-control-group">
                <label for="merton_muJ">Mean jump size \( \mu_J \):</label>
                <input type="number" id="merton_muJ" value="-0.1" step="0.01">
                <p class="sim-note">Negative for downward jumps.</p>
            </div>
            <div class="sim-control-group">
                <label for="merton_sigmaJ">Jump volatility \( \sigma_J \):</label>
                <input type="number" id="merton_sigmaJ" value="0.1" min="0.01" step="0.01">
            </div>
        </div>
        <div class="sim-button-container">
            <button class="sim-button" onclick="runMertonSimulation()">Run Simulation</button>
        </div>
    </div>
    
    <div class="sim-chart-container">
        <canvas id="mertonChart"></canvas>
    </div>
</div>
~~~

## Merton Jump Diffusion Model

The Merton Jump Diffusion model (Merton, 1976) extends the Geometric Brownian Motion by adding a jump component to account for sudden, discontinuous changes in asset prices often observed during market shocks or news events. The stochastic differential equation for this model is:

$$ dS_t = (\mu - \lambda k)S_t dt + \sigma S_t dW_t + S_t \left(J_t - 1 \right) dN_t $$

Where:

* $S_t$ = Stock price at time $t$
* $\mu$ = Drift coefficient (expected return)
* $\sigma$ = Diffusion volatility coefficient
* $W_t$ = Wiener process
* $\lambda$ = Jump intensity (average number of jumps per year)
* $J_t$ = Jump size satisfying $\ln{J_t} \sim \mathcal{N}(\mu_J, \sigma_J^2)$
* $k = E[J_t-1] = e^{\mu_J + \frac{\sigma_J^2}{2}} - 1$ = Expected jump size
* $N_t$ = Poisson process representing the number of jumps in time interval $[0, t]$

There is also a closed form solution to this SDE can be expressed in closed form (Merton, 1976) as:

$$
\begin{align*} 
S_t &= S_0 \exp\left(\left(\mu - \frac{\sigma^2}{2} - \lambda k\right)t + \sigma W_t \right) \prod_{i = 1}^{N_t}{Y_i} \\
    &= S_0 \exp\left(\left(\mu - \frac{\sigma^2}{2} - \lambda k\right)t + \sigma W_t + \sum_{i = 1}^{N_t}{y_i} \right)
\end{align*}
$$

Where $Y_i$ are the jump sizes, with $y_i = \ln(Y_i) \sim N(\mu_J, \sigma_J^2)$. Notice that $\ln{J_t} = \sum_{i=1}^{N_t}{y_i}$ is a compound poisson process.

### Discretization for Simulation

For computational implementation, we discretize the Merton Jump Diffusion equation:

$$ S_{t+\Delta t} = S_t \exp \left( \left(\mu - \frac{1}{2} \sigma^2 - \lambda k \right)\Delta t + \sigma\sqrt{\Delta t} Z + Y N \right) $$

Where:

* $Z \sim N(0, 1)$ is a standard normal random variable
* $N \sim \text{Pois}(\lambda \Delta t)$
* $Y \sim \mathcal{N}(\mu_J, \sigma_J^2)$

## References

* Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. *Journal of Political Economy, 81*(3), 637-654.
* Bollerslev, T. (1986). Generalized autoregressive conditional heteroskedasticity. *Journal of Econometrics, 31*(3), 307-327.
* Cont, R. (2001). Empirical properties of asset returns: stylized facts and statistical issues. *Quantitative Finance, 1*, 223-236.
* Hamilton, J. D. (1989). A new approach to the economic analysis of nonstationary time series and the business cycle. *Econometrica, 57*(2), 357-384.
* Heston, S. L. (1993). A closed-form solution for options with stochastic volatility with applications to bond and currency options. *The Review of Financial Studies, 6*(2), 327-343.
* Hull, J. C. (2017). *Options, futures, and other derivatives* (10th ed.). Pearson.
* Mandelbrot, B. (1963). The variation of certain speculative prices. *The Journal of Business, 36*(4), 394-419.
* Mandelbrot, B., & van Ness, J. W. (1968). Fractional Brownian motions, fractional noises and applications. *SIAM Review, 10*(4), 422-437.
* Merton, R. C. (1976). Option pricing when underlying stock returns are discontinuous. *Journal of Financial Economics, 3*(1-2), 125-144.