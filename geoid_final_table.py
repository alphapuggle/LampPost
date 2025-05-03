import geopandas as gpd
import pandas as pd
import psycopg2
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()

postgres_url = 'postgresql+psycopg2://{}:{}@{}:{}/{}'.format(os.getenv("PG_USER",'postgres'),os.getenv("PG_PASSWORD",''),os.getenv("PG_HOST",'localhost'),os.getenv("PG_PORT","5432"),os.getenv("PG_DBNAME","postgres"))
print(postgres_url)
engine = create_engine(postgres_url)
connection = engine.connect()
# === Load shapefiles ===
blocks = gpd.read_file(r'./tl_2024_42_tabblock20/tl_2024_42_tabblock20.shp')
counties = gpd.read_file(r'./tl_2024_us_county/tl_2024_us_county.shp')

# === Load CSV with GEOID, OffenseType, ReportedOn ===
input_df = pd.read_sql_query("SELECT * FROM ucr_crime_data.ucr_crime_data;",con=connection)
input_df['GEOID'] = input_df['GEOID'].astype(str)  # Ensure GEOID is string

# === Prepare results ===
results = []

for _, row in input_df.iterrows():
    geoid = str(row['GEOID']).zfill(15)
    offense_type = row['OffenseType']
    reported_on = row['ReportedOn']

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
output_df = pd.DataFrame(results).to_sql('lamppost_data',engine,schema="ucr_crime_data",index=False,if_exists="replace")

print("Data stored in ucr_crime_data.lamppost_data")
