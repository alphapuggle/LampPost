//main.rs
use std::{error::Error, fmt::format, process::exit};
use postgres::{Client, NoTls};
use chrono::NaiveDate;
use dotenv::{self, var};


struct Record  {
    block_number: i32,
    geoid: i64,
    latitude: f64,
    longitude: f64,
    ucr_offense_code: String,
    offense_type: String,
    reported_on: chrono::NaiveDate,
}

fn main() -> Result<(), Box<dyn Error>> {
    dotenv::dotenv().ok();
    let host = var("PG_HOST").unwrap_or("localhost".to_string());
    let user = var("PG_USER").unwrap_or("postgres".to_string());
    let password = var("PG_PASSWORD").unwrap_or(" ".to_string());
    let dbname = var("PG_DBNAME").unwrap_or("postgres".to_string());
    let port = var("PG_PORT").unwrap_or("5432".to_string());
    let connection_str:&str = &format!("host={} user={} password={} dbname={} port={}",host, user, password, dbname, port);
    println!("{}",connection_str);
    let resp: String = reqwest::blocking::get("https://www.ucr.pa.gov/NIBRS.CrimeAnalytics.Service/Silverlight/DataService/GetData/allblocks/Provider/query?f=json&where=%7B%22offense%22%3A%22%2713A%27%2C%2713C%27%2C%2713B%27%2C%2735B%27%2C%2735A%27%2C%2726B%27%2C%2726A%27%2C%2726C%27%2C%2726D%27%2C%2726E%27%2C%2726F%27%2C%2726G%27%2C%2739A%27%2C%2739C%27%2C%2739B%27%2C%2739D%27%2C%2709C%27%2C%2709A%27%2C%2709B%27%2C%2764A%27%2C%2764B%27%2C%2723A%27%2C%2723B%27%2C%2723C%27%2C%2723D%27%2C%2723E%27%2C%2723F%27%2C%2723G%27%2C%2723H%27%2C%2740B%27%2C%2740A%27%2C%2740C%27%2C%2711D%27%2C%2736A%27%2C%2711A%27%2C%2711C%27%2C%2711B%27%2C%2736B%27%2C%27720%27%2C%27200%27%2C%2790A%27%2C%27510%27%2C%27220%27%2C%27250%27%2C%2790B%27%2C%27290%27%2C%2790C%27%2C%2790D%27%2C%2790E%27%2C%27270%27%2C%27210%27%2C%2790F%27%2C%27100%27%2C%2790G%27%2C%27240%27%2C%2790H%27%2C%27370%27%2C%27120%27%2C%2790I%27%2C%27280%27%2C%2790J%27%2C%27520%27%2C%2790Z%27%22%2C%22xmin%22%3A-8647382.90784518%2C%22xmax%22%3A-8611705.924893122%2C%22ymin%22%3A4819625.611582559%2C%22ymax%22%3A4839441.911165465%2C%22fromDate%22%3A%22%5C%227%2F28%2F2024%5C%22%22%2C%22toDate%22%3A%22%5C%221%2F24%2F2025%5C%22%22%7D&spatialRel=esriSpatialRelIntersects&outFields=*")?
    .text()?;
    let json: serde_json::Value = serde_json::from_str(resp.as_str()).expect("JSON was not well-formatted");
    //let connector = native_tls::TlsConnector::new().unwrap();
    //let connector = MakeTlsConnector::new(connector);

    //let mut client = Client::connect(connection_str, connector)?;
    let mut client: Client = Client::connect(connection_str, NoTls)?;
    //- TODO -//
    // This needs to require SSL at some point.
    
    if let serde_json::Value::Array(events) = &json["features"] {
        for x in events {            
            let record: Record = Record {
                //block_number: x["attributes"]["Blocknumber"].as_i64().unwrap() as i32,
                block_number: x["attributes"]["Blocknumber"].as_str().and_then(|s| s.parse::<i32>().ok()).expect("Not a valid i16"),
                geoid: x["attributes"]["GEOID"].as_str().and_then(|s| s.parse::<i64>().ok()).expect("Not a valid i64"),
                latitude: x["attributes"]["Latitude"].as_str().and_then(|s| s.parse::<f64>().ok()).expect("Not a valid f64"),
                longitude: x["attributes"]["Longitude"].as_str().and_then(|s| s.parse::<f64>().ok()).expect("Not a valid f64"),
                ucr_offense_code: x["attributes"]["UCROffenseCode"].to_string(), 
                offense_type: x["attributes"]["OffenseType"].to_string(),
                reported_on: x["attributes"]["ReportedOn"].as_str().and_then(|s| NaiveDate::parse_from_str(s, "%m/%d/%Y").ok()).unwrap()
                //reported_on: x["attributes"]["ReportedOn"].as_str().and_then(|s| Date::try_from_str(s, pgdatetime::DateOrder::MDY).ok()).unwrap()
            };
            client.execute("INSERT INTO ucr_crime_data.ucr_crime_data (\"Blocknumber\", \"GEOID\", \"Latitude\", \"Longitude\", \"UCROffenseCode\", \"OffenseType\", \"ReportedOn\") VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING", &[&record.block_number, &record.geoid, &record.latitude, &record.longitude, &record.ucr_offense_code, &record.offense_type, &record.reported_on]).expect("Something went wrong inserting data into table");
            println!("Block number: {}\nGEOID: {}\nLatitude: {}\nLongitude: {}\nOffenseType: {}\nReportedOn: {:?}",record.block_number,record.geoid,record.latitude,record.longitude,record.offense_type,record.reported_on);
        }
    }
    
    Ok(())
}