# Hurricane Heat Engine

An interactive 3D explainer that opens up a hurricane so you can see every part of it and what powers it.

Open `index.html` in a browser. It needs an internet connection to load Three.js and the fonts from their CDNs. There is no build step.

## What you can do

- **Orbit and zoom** a raymarched, sunlit volumetric storm. It casts its shadow on a wind-roughened sea with whitecaps under the eyewall.
- **Whole / Sliced / Exploded**: see it as a satellite would, slice a wedge out of it (the slice follows your view and its angle is adjustable), or pull it apart into layers.
- **Fly to any part**: selecting a part flies the camera to it. Pick the eye to drop inside it and look up at the stadium of eyewall cloud.
- **Probe the sea**: hover anywhere on the ocean to read the local wind, pressure and wind class.
- **Visible / Infrared**: switch to a satellite-style infrared view coloured by cloud-top temperature.
- **Airflow**: glowing streamlines show the secondary circulation. Air flows in along the sea, rises in the eyewall, flows out at the top and sinks in the eye.
- **Compare categories**: a Saffir–Simpson strip (TD, TS, 1–5) reshapes the storm into each category and colours the sea by wind strength. **Grow it** animates a depression into a Category 5. The category page lists NHC-style damage, real example storms, a wind-power chart (power ∝ wind³) and a table comparing pressure, eye size, hurricane-wind reach and cloud tops.
- **Set the conditions**: change sea surface temperature, outflow temperature and wind shear, and watch the category, wind, pressure, Carnot efficiency, heat released, wind power and surge change. The storm reshapes as you go: the eye clears, the tops rise and shear tilts it.

It needs WebGL2. HD mode (the default) renders at up to 2× pixel density with 4× MSAA, 128³ GPU-generated cloud noise, temporally accumulated clouds and bloom. Fast mode trades that for frame rate on weaker machines. In both modes the cloud resolution adapts to keep the frame rate smooth.

## The model

Intensity comes from Emanuel's potential-intensity theory, which treats a hurricane as a Carnot heat engine. The wind speed is scaled down by an illustrative sea-temperature threshold and a shear penalty. Pressure uses the Atkinson–Holliday wind–pressure relation. Heat release scales NOAA HRD's ~6 × 10¹⁴ W estimate, and wind power integrates ρ·C_d·V³ over a Holland wind profile. The in-page "How the numbers work" section has the details and sources. This is a teaching model, not a forecast.
