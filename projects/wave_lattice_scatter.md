+++
title = "Quantum Wavepacket Scattering Through a 2D Lattice"
hascode = true
date = Date(2024, 1, 1)
rss = "Interactive simulation of stock prices using Geometric Brownian Motion"
repo_url = "https://github.com/ZZBaron/WF-scatter"
+++

@def tags = ["finance", "simulation", "stochastic-processes"]

# Quantum Wavepacket Scattering Through a 2D Lattice

@@center
![](/assets/wavepacket_scattering.gif)
@@

---

## Overview

This simulation demonstrates the quantum mechanical scattering of a Gaussian wavepacket through a two-dimensional periodic lattice potential. The wavepacket, initially localized with momentum directed toward the lattice, exhibits quantum phenomena such as diffraction, interference, and partial transmission/reflection. The computational domain is truncated using a Perfectly Matched Layer (PML), which absorbs outgoing probability flux without artificial reflections.

## Physical System

### The Schrödinger Equation

The time evolution of the quantum wavefunction $\psi(x, y, t)$ is governed by the time-dependent Schrödinger equation:

$$i\hbar \frac{\partial \psi}{\partial t} = \hat{H} \psi$$

### Hamiltonian

The Hamiltonian consists of kinetic and potential energy terms:

$$\hat{H} = \hat{T}_x + \hat{T}_y + \hat{V}(x, y)$$

$$\hat{T}_x = \frac{\hat{p}_x^2}{2m}, \quad \hat{T}_y = \frac{\hat{p}_y^2}{2m}$$

The lattice potential is a periodic array of Gaussian barriers:

$$V_{\text{lattice}}(x, y) = \sum_{i,j} V_0 \exp\left[-\frac{(x - x_{ij})^2 + (y - y_{ij})^2}{2\sigma_{\text{gauss}}^2}\right]$$

where $x_{ij} = x_{\text{center}} + i \cdot a$ and $y_{ij} = j \cdot a$.

### Initial Wavepacket

The initial state is a separable Gaussian wavepacket:

$$\psi(x, y, 0) = \psi_x(x, 0) \cdot \psi_y(y, 0)$$

$$\psi_x(x, 0) = \left(\frac{1}{2\pi\sigma^2}\right)^{1/4} \exp\left[-\frac{(x-x_0)^2}{4\sigma^2} + i p_{0x} x\right], \quad \psi_y(y, 0) = \left(\frac{1}{2\pi\sigma^2}\right)^{1/4} \exp\left[-\frac{(y-y_0)^2}{4\sigma^2} + i p_{0y} y\right]$$

The Gaussian form saturates the Heisenberg uncertainty bound: $\Delta x \, \Delta p = \hbar/2$.

## Numerical Implementation

### Absorbing Boundary Conditions (Perfectly Matched Layer)

#### Motivation

A finite computational grid truncates what should be an infinite domain. A hard boundary reflects outgoing probability flux back into the simulation, producing unphysical interference. The PML surrounds the physical domain with an absorbing region that removes all outgoing waves without any reflection at the interface, regardless of angle or frequency of incidence.

#### Complex Coordinate Stretching

The PML is derived from analytic continuation of the spatial coordinates into the complex plane. Inside the PML region, spatial derivatives are replaced by:

$$\frac{\partial}{\partial x} \rightarrow \frac{1}{1 + i\sigma(x)/\omega} \frac{\partial}{\partial x}$$

where $\omega$ is the angular frequency and $\sigma(x) \geq 0$ is the absorption profile. A plane wave $e^{ikx}$ propagating in the $+x$ direction transforms as:

$$e^{ikx} \rightarrow e^{ikx} \cdot \exp\!\left(-\frac{k}{\omega}\int^x \sigma(x')\,dx'\right)$$

The second factor is a real exponential decay for $k > 0$. Since $\sigma = 0$ at the interior boundary, the transformation is continuous at the PML interface and produces no reflection in the exact continuous case.

#### Quantum CAP Form

For the Schrödinger equation the PML reduces to augmenting the potential with a purely imaginary absorbing term:

$$V(x, y) = V_{\text{lattice}}(x, y) - i\,\sigma(x) - i\,\sigma(y)$$

The imaginary terms act as local sinks removing probability amplitude. The norm evolves as:

$$\frac{d}{dt}\|\psi\|^2 = -2\int \sigma(\mathbf{r})\,|\psi(\mathbf{r}, t)|^2\,d^2r \leq 0$$

so probability is strictly removed, never created, by the PML.

#### Absorption Profile

The absorption strength ramps polynomially from zero at the interior PML boundary to $\sigma_{\max}$ at the grid edge:

$$\sigma(x) = \sigma_{\max} \left(\frac{d(x)}{L_{\text{PML}}}\right)^n$$

where $d(x)$ is the distance from the interior PML edge. The gradual turn-on is essential: a sudden jump in $\sigma$ produces discretization-induced reflections even though the continuous PML is exactly reflectionless. The same profile is applied independently in $y$ and symmetrically at both edges in each direction.


### Split-Operator Method

Time evolution uses the split-operator method. The kinetic operators $\hat{T}_x$, $\hat{T}_y$ are diagonal in momentum space; the potential $\hat{V}$ is diagonal in position space. FFT-based lazy evaluation implements:

$$\hat{T}_{\text{FFT}} = \hat{T}_{xp} \cdot \hat{T}_{\text{mom}} \cdot \hat{T}_{px}$$

converting efficiently between representations for accurate long-time integration. In the physical interior the evolution is unitary; norm decay occurs only in the PML region.

### Simulation Parameters

| Parameter | Value |
|---|---|
| Grid points $N_x,\ N_y$ | 180, 150 |
| Domain $x$ | $[-30,\ 50]$ |
| Domain $y$ | $[-30,\ 30]$ |
| Grid spacing $\Delta x,\ \Delta y$ | $0.44,\ 0.40$ |
| Particle mass $m$ | $1.0$ |
| Initial position $(x_0, y_0)$ | $(-8.0,\ 0.0)$ |
| Initial momentum $(p_{0x}, p_{0y})$ | $(2.5,\ 0.0)$ |
| Wavepacket width $\sigma$ | $1.5$ |
| Lattice spacing $a$ | $3.5$ |
| Lattice center $x_{\text{center}}$ | $20.0$ |
| Lattice sites | $13 \times 13$ |
| Potential height $V_0$ | $12.0$ |
| Gaussian site width $\sigma_{\text{gauss}}$ | $0.4$ |
| Simulation time $T$ | $[0,\ 15.0]$ |
| Time step $\Delta t$ | $0.15$ |
| PML thickness $L_{\text{PML}}$ | $12.0$ |
| PML peak absorption $\sigma_{\max}$ | $20.0$ |
| PML ramp exponent $n$ | $2$ |
| Physical region $x$ | $[-18,\ 38]$ |
| Physical region $y$ | $[-18,\ 18]$ |

## Discussion

### Assumptions

1. **Non-relativistic limit:** $v \ll c$, so the Schrödinger equation is valid
2. **Single-particle system:** No particle-particle interactions
3. **Time-independent potential:** The lattice does not change during the simulation
4. **Two-dimensional system:** Dynamics confined to the $xy$-plane
5. **Atomic units:** $\hbar = m = 1$
6. **Born-Oppenheimer approximation:** Lattice sites are assumed fixed

### Applications

This simulation is directly relevant to **ultracold atoms in optical lattices** [1], where laser interference patterns create periodic potentials for neutral atoms and enable quantum simulation of condensed matter phenomena; to **electron diffraction** in crystal lattices [2]; and to **quantum dot arrays** and other engineered semiconductor potential landscapes [3]. Natural extensions include adding lattice disorder to study Anderson localization, incorporating interactions via the Gross-Pitaevskii equation, and investigating Bloch oscillations and band structure effects.

## References

{{references
Many_Body_Physi_Bloch_2007
Diffraction_of_Daviss_1927
Transport_in_Na_Ferry_2010
A_perfectly_mat_Bereng_1994
Modern_quantum_Sakura_2017
Bose_Einstein_C_Pethic_2011
}}

---

*Simulation created using QuantumOptics.jl, a comprehensive framework for quantum mechanical simulations in Julia.*