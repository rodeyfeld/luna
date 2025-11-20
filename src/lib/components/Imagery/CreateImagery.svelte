<div class="space-y-4 animate-fadeIn">
    <label class="label">
        <span class="font-semibold">Imagery Name</span>
        <input class="input transition-smooth hover:ring-2 hover:ring-primary-500 focus:ring-2 focus:ring-primary-500" name="imageryName" title="Imagery Name" type="text" placeholder="My Image" />
    </label>
    
    <label class="label">
        <span class="font-semibold">Coordinates</span>
        <textarea class="input transition-smooth hover:ring-2 hover:ring-primary-500 focus:ring-2 focus:ring-primary-500" name="imageryGEOJSON"  title="Coordinates" rows="10" placeholder={JSON.stringify(
        {
            "type": "FeatureCollection",
            "features": [
                {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "coordinates": [
                    32.12890625000006,
                    31.578535426473053
                    ],
                    "type": "Point"
                }
                }
            ]
        }
        )}
        ></textarea>
    </label>
    
    <button class="btn variant-filled-primary w-full transition-smooth hover:scale-105 hover:shadow-xl" type="submit">
        <i class="fa-solid fa-plus mr-2"></i>
        Create Imagery
    </button>
</div>