+++
title = "Home"
hascode = true
date = Date(2025, 11, 13)
rss = "Home Page."

tags = ["syntax", "code", "image", "video"]

repo_url = "https://github.com/ZZBaron"
+++

~~~
<style>
.franklin-content {
    max-width: 1400px;
    margin: 0 auto;
}
.portfolio-header {
    text-align: center;
    margin-bottom: 60px;
    padding: 40px 20px;
}
.portfolio-header h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.portfolio-subtitle {
    font-size: 1.2rem;
    color: #666;
}
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
    padding: 0 20px;
}
.project-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #e0e0e0;
}
.project-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}
.project-image {
    width: 100%;
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
}
.project-image * {
    margin: 0 !important;
    padding: 0 !important;
}
.project-image p {
    width: 100%;
    height: 100%;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.project-image img {
    max-width: 98%;
    max-height: 98%;
    width: auto !important;
    height: auto !important;
    object-fit: contain;
    display: block;
}
.project-info {
    padding: 24px;
}
.project-info h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    margin-top: 0;
}
.project-info p {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 16px;
}
.project-link a {
    display: inline-block;
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
}
.project-link a:hover {
    color: #764ba2;
}
.project-link a::after {
    content: ' →';
}
@media (max-width: 768px) {
    .portfolio-header h1 {
        font-size: 2rem;
    }
    .projects-grid {
        grid-template-columns: 1fr;
    }
}
</style>
~~~

@@portfolio-header
# Welcome to My Portfolio

@@portfolio-subtitle
**Explore My Projects**
@@
@@

@@projects-grid

@@project-card
@@project-image
~~~
<video width="70%" autoplay loop muted playsinline>
  <source src="/assets/engine.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
~~~
@@
@@project-info
### Vortex
A WIP 3D ECS physics engine.
@@project-link
[View Project](/vortex/docs/)
@@
@@
@@

@@project-card
@@project-image
~~~
<video width="100%" height="100%" autoplay loop muted playsinline>
  <source src="/assets/BlackHoleSim.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
~~~
@@
@@project-info
### 2D Black Hole Simulation
2D simulation of light paths bending around a massive object according to Einstein's theory of general relativity.
@@project-link
[View Project](/projects/)
@@
@@
@@

@@project-card
@@project-image
![Schelling's Segregation Model](/assets/schelling_spectrum.gif)
@@
@@project-info
### Schelling's Segregation Model
Spatial simulation where agents of binary group membership relocate based on neighborhood similarity thresholds, demonstrating emergent segregation from local preferences. Extended to continuous 2D group membership space using Euclidean distance metrics instead of binary/discrete group membership.
@@project-link
[View Project](/projects/schelling/)
@@
@@
@@

@@project-card
@@project-image
![Lotka-Volterra Model](/assets/lotka_volterra_mod_plot.png)
@@
@@project-info
### Lotka-Volterra Model
Coupled nonlinear ODEs modeling predator-prey population oscillations. Extended with logistic prey growth, Holling Type II functional response, time-delayed dynamics, and seasonal forcing to address unrealistic exponential growth and linear predation assumptions. 
@@project-link
[View Project](/projects/lotka-volterra/)
@@
@@
@@

@@project-card
@@project-image
![GBM Stock Simulation](/assets/stock.png)
@@
@@project-info
### GBM Stock Simulation
GBM stochastic process simulation​ to model asset price paths with log-normal returns. Extended to Merton Jump Diffusion adding Poisson-distributed discontinuities with normally-distributed jump sizes.
@@project-link
[View Project](/projects/stock_sim/)
@@
@@
@@

<!-- @@project-card
@@project-image
![Terrain](/assets/terrain.jpg)
@@
@@project-info
### 3D Terrain Generator
Procedural terrain generation using Perlin noise and fractal algorithms.
@@project-link
[View Project](/projects/terrain/)
@@
@@
@@ -->

@@