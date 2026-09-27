# Hurricane Heat Engine

An interactive 3D explainer that opens up a hurricane so you can see every part of it and what powers it.

Open `index.html` in a browser. It needs an internet connection to load Three.js and the fonts from their CDNs. There is no build step.

## What you can do

- **Orbit and zoom** the storm. Heights are exaggerated 8× and range rings mark every 100 km.
- **Whole / Cutaway / Exploded**: see it as a satellite would, sliced in half, or pulled apart into layers.
- **Visible / Infrared**: switch to a satellite-style infrared view coloured by cloud-top temperature.
- **Airflow**: tracers show the secondary circulation. Moist air flows in along the sea surface, rises in the eyewall, flows out at the top and sinks in the eye.
- **Every part**: heat engine, warm ocean, surface inflow, eyewall, eye, spiral rainbands, outflow canopy, wind field, storm surge and Coriolis spin. Selecting a part highlights it in 3D and explains it, with figures that update live.
- **Set the conditions**: change sea surface temperature, outflow temperature and wind shear. The panel then shows the storm's category, wind, pressure, Carnot efficiency, heat released, wind power and typical surge.

## The model

Intensity comes from Emanuel's potential-intensity theory, which treats a hurricane as a Carnot heat engine. The wind speed is scaled down by an illustrative sea-temperature threshold and a shear penalty. Pressure uses the Atkinson–Holliday wind–pressure relation. Heat release scales NOAA HRD's ~6 × 10¹⁴ W estimate, and wind power integrates ρ·C_d·V³ over a Holland wind profile. The in-page "How the numbers work" section has the details and sources. This is a teaching model, not a forecast.
