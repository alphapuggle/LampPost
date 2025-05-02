import geopandas as gpd
import pandas as pd

# === Load shapefiles ===
blocks = gpd.read_file(r'C:\Users\alecc\Downloads\tl_2024_42_tabblock20\tl_2024_42_tabblock20.shp')
counties = gpd.read_file(r'C:\Users\alecc\Downloads\tl_2024_us_county\tl_2024_us_county.shp')

# === Load CSV with GEOID, OffenseType, ReportedOn ===
input_df = pd.read_csv(r'C:\Users\alecc\Desktop\Rust\db_to_csv\ucr_crimes.csv')
input_df['GEOID'] = input_df['GEOID'].astype(str)  # Ensure GEOID is string

# === Prepare results ===
results = []

for _, row in input_df.iterrows():
    geoid = str(row['GEOID']).zfill(15)
    offense_type = row['Offense Type']
    reported_on = row['Reported On']

    block = blocks[blocks['GEOID20'] == geoid]

    if not block.empty:
        block_row = block.iloc[0]
        centroid = block_row.geometry.centroid
        lat, lon = centroid.y, centroid.x

        county_fips = block_row['COUNTYFP20']
        state_fips = block_row['STATEFP20']
        county_geoid = state_fips + county_fips

        county = counties[counties['GEOID'] == county_geoid]
        county_name = county.iloc[0]['NAME'] if not county.empty else 'Unknown'
    else:
        print(f"Missing GEOID match for: {geoid}")
        lat = lon = 'N/A'
        county_name = 'Not Found'

    results.append({
        'GEOID': geoid,
        'County': county_name,
        'Latitude': lat,
        'Longitude': lon,
        'OffenseType': offense_type,
        'ReportedOn': reported_on
    })

# === Save final output ===
output_df = pd.DataFrame(results)
output_df.to_csv('ucr_final.csv', index=False)

print("CSV saved as ucr_final.csv")
