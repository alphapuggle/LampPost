use postgres::{Client, NoTls};
use csv::Reader;
use chrono::NaiveDate;
use std::error::Error;
use std::fs::File;
use dotenv::{self, var};


fn main() -> Result<(), Box<dyn Error>> {
    dotenv::dotenv().ok();
    let host = var("PG_HOST").unwrap_or("localhost".to_string());
    let user = var("PG_USER").unwrap_or("postgres".to_string());
    let password = var("PG_PASSWORD").unwrap_or(" ".to_string());
    let dbname = var("PG_DBNAME").unwrap_or("postgres".to_string());
    let port = var("PG_PORT").unwrap_or("5432".to_string());
    let connection_str:&str = &format!("host={} user={} password={} dbname={} port={}",host, user, password, dbname, port);
    // Connect to PostgreSQL
    let mut client: Client = Client::connect(connection_str, NoTls)?;

    // Drop existing table and create new one
    client.batch_execute(
        "
        DROP TABLE IF EXISTS ucr_crime_data.lamppost_data;
        CREATE TABLE ucr_crime_data.lamppost_data (
            geoid TEXT PRIMARY KEY,
            county TEXT,
            latitude DOUBLE PRECISION,
            longitude DOUBLE PRECISION
        );
        ",
    )?;

    // Read CSV
    let file = File::open(r"C:\Users\alecc\Desktop\VulnerabilityScanner\GEOID\ucr_final.csv")?;
    let mut rdr = Reader::from_reader(file);

    for result in rdr.records() {
        let record = result?;
        let geoid = record.get(0).unwrap_or("").to_string();
        let county = record.get(1).unwrap_or("").to_string();

        let latitude = match record.get(2).unwrap_or("N/A") {
            "N/A" => None,
            val => Some(val.parse::<f64>()?),
        };

        let longitude = match record.get(3).unwrap_or("N/A") {
            "N/A" => None,
            val => Some(val.parse::<f64>()?),
        };

        // Insert row
        client.execute(
            "
            INSERT INTO ucr_crime_data.lamppost_data 
            (geoid, county, latitude, longitude)
            VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;",
            &[&geoid, &county, &latitude, &longitude],
        )?;
    }

    println!("Data imported into 'lamppost_data' table.");

    Ok(())
}
