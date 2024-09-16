
<label class="label">
    <span>Imagery Name</span>
    <input class="input" name="imageryName" title="Imagery Name" type="text" placeholder="My Image" />
</label>
<label class="label">
    <span>Coordinates</span>
    <textarea class="input" name="imageryGEOJSON"  title="Coordinates" rows="10" placeholder={JSON.stringify(
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
    />
</label>
<button class="btn variant-filled-primary" type="submit">Create Imagery</button>