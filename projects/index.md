+++
title = "Black Hole Light Ray Simulation"
hascode = true
date = Date(2025, 11, 13)
rss = "2d black hole sim."

tags = ["syntax", "code", "image", "video"]

repo_url = "https://github.com/ZZBaron/2D-Black-Hole-Sim"
+++

# Black Hole Light Ray Simulation

\toc

@@row
@@container
@@left ![](/assets/BlackHoleSim.mp4) @@
@@
~~~
<video width="70%" autoplay loop muted playsinline>
  <source src="/assets/BlackHoleSim.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
~~~
@@

## About
2D Simulation of light paths bending around a massive object according to Einstein's theory of general relativity, creating visual phenomena such as gravitational lensing and photon spheres.

## Schwarzschild Metric
The Schwarzschild metric describes the geometry of spacetime around a non-rotating, chargeless, and spherically symmetric mass:
$$
ds^2 = -\left(1-\frac{r_s}{r}\right)c^2dt^2 + \left(1-\frac{r_s}{r}\right)^{-1}dr^2 + r^2d\Omega^2
$$
where $r_s = \frac{2GM}{c^2}$ is the Schwarzschild radius, $M$ is the mass of the black hole, $G$ is the gravitational constant, and $c$ is the speed of light.

## Schwarzschild Radius
The Schwarzschild radius defines the event horizon of a black hole:
$$
r_s = \frac{2GM}{c^2}
$$
In the simulation, normalized units in which $G = c = 1$ are used, so the Schwarzschild radius becomes $r_s = 2M$.

## Geodesic Equations
Light rays follow null geodesics, which are paths where the spacetime interval is zero ($ds^2 = 0$).
For motion in the equatorial plane ($\theta = \pi/2$), the geodesic equations reduce to
$$\frac{dr}{d\lambda} = f(r) \cdot p_r $$
$$\frac{d\phi}{d\lambda} = \frac{L}{r^2} $$
$$\frac{dp_r}{d\lambda} = \frac{L^2}{r^3}f(r) - \frac{r_s}{2r^2}f(r) $$
$$\frac{dL}{d\lambda} = 0 $$
where $f(r) = 1 - \frac{r_s}{r}$, $p_r$ is the radial momentum component, and $L$ is the angular momentum (conserved).

## Effective Potential
The motion of light rays can be understood through an effective potential:
$$
V_{eff}(r) = \frac{L^2}{2r^2}\left(1 - \frac{r_s}{r}\right)
$$
The closest approach of a light ray to the black hole is determined by the impact parameter $b = \frac{L}{E}$, where $E$ is the energy of the photon.        

## Critical Radius
The photon sphere occurs at $r = \frac{3r_s}{2}$, where light rays can orbit the black hole in unstable circular orbits.
Light rays with impact parameters less than the critical value $b_{crit} = \frac{3\sqrt{3}r_s}{2}$ will be captured by the black hole.

    