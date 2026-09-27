# Hurricane Heat Engine

An interactive 3D explainer that opens up a hurricane so you can see every part of it and what powers it.

Open `index.html` in a browser. It needs an internet connection to load Three.js and the fonts from their CDNs. There is no build step.

## What you can do

- **Watch it grow.** On load, a scattered cluster of thunderstorms organises into a major hurricane over the open ocean. Drag the intensity bar from TD to Category 5, or press **Grow it**, and the storm spins up, expands, clears its eye and flashes with eyewall lightning.
- **Take the tour.** A guided lesson card walks through eleven parts: heat engine, warm ocean, surface inflow, eyewall, eye, rainbands, outflow canopy, wind field, storm surge, Coriolis spin and the Saffir–Simpson categories. Each step flies the camera to the part and highlights it.
- **Explore.** Orbit and zoom, slice the storm open, pull it apart into layers, switch to satellite-style infrared, show the airflow, or hover the sea to probe the local wind and pressure.
- **Compare categories.** The category lesson has damage descriptions, real example storms, a wind-power chart (power ∝ wind³) and a table comparing pressure, eye size, hurricane-wind reach and cloud tops.
- **Change the ocean and atmosphere.** Sea temperature, outflow temperature and wind shear drive the physics model directly.

## Rendering

The storm is a raymarched volume with spiral-aligned cirrus streaks, clustered convective towers, rain shafts and lightning. It is lit by a low sun with self-shadowing and multiple-scattering approximation, and fades into aerial haze over an ocean that runs to the horizon. HD mode (the default) adds 4× MSAA, 128³ GPU-generated noise, temporal accumulation, bloom and ACES tone mapping. Fast mode is for weaker GPUs. It needs WebGL2.

## The model

Intensity comes from Emanuel's potential-intensity theory, which treats a hurricane as a Carnot heat engine. The wind speed is scaled down by an illustrative sea-temperature threshold and a shear penalty. Pressure uses the Atkinson–Holliday wind–pressure relation. Heat release scales NOAA HRD's ~6 × 10¹⁴ W estimate, and wind power integrates ρ·C_d·V³ over a Holland wind profile. The in-page "How the numbers work" section has the details and sources. This is a teaching model, not a forecast.
