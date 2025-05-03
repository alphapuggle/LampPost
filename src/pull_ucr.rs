//main.rs
use std::error::Error;
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

pub fn pull() -> Result<(), Box<dyn Error>> {
    dotenv::dotenv().ok();
    let host = var("PG_HOST").unwrap_or("localhost".to_string());
    let user = var("PG_USER").unwrap_or("postgres".to_string());
    let password = var("PG_PASSWORD").unwrap_or(" ".to_string());
    let dbname = var("PG_DBNAME").unwrap_or("postgres".to_string());
    let port = var("PG_PORT").unwrap_or("5432".to_string());
    let connection_str:&str = &format!("host={} user={} password={} dbname={} port={}",host, user, password, dbname, port);
    println!("{}",connection_str);
    // Erie xmin -8962981.544423854 xmax -8945171.716833433 ymin 5148944.545448468 ymax 5158843.140611385
    // Philly xmin -8368091.56111984 xmax -8366978.446895285 ymin 4858536.836293898 ymax 4859155.498491666
    // ~1000 difference between windows
    let mut ymin = 4824358.735693379;
    let youter = 5176291.534518198;
    let xouter = -8368091.56111984;
    let from_date = "01/24/2025";
    let to_date = "05/02/2025";
    let mut requests_needed = 0; 
    let mut requests_made = 0; 
    while ymin <=  youter {
        let mut xmin = -9024216.262961842;
        while xmin <= xouter {
            requests_needed += 1;
            xmin += 2000.0;
        }
        ymin += 2000.0;
    }

    // Resume at a specific index if throttled & crashed
    // This is error handling rn :3
    let resume = 6685;
    let mut ymin = 4824358.735693379;
    while ymin <=  youter {
        let mut xmin = -9024216.262961842;
        while xmin <= xouter {
            if requests_made > resume {
                
                let xmax = xmin + 2000.0;
                let ymax = ymin + 2000.0;
    
                println!("xmin: {}, xmax: {}, ymin: {}, ymax: {}",xmin,xmax,ymin,ymax);
                let resp: String = reqwest::blocking::get(format!("https://www.ucr.pa.gov/NIBRS.CrimeAnalytics.Service/Silverlight/DataService/GetData/allblocks/Provider/query?f=json&where={{\"offense\":\"'13A','13C','13B','35B','35A','26B','26A','26C','26D','26E','26F','26G','39A','39C','39B','39D','09C','09A','09B','64A','64B','23A','23B','23C','23D','23E','23F','23G','23H','40B','40A','40C','11D','36A','11A','11C','11B','36B','720','200','90A','510','220','250','90B','290','90C','90D','90E','270','210','90F','100','90G','240','90H','370','120','90I','280','90J','520','90Z'\",\"xmin\":{},\"xmax\":{},\"ymin\":{},\"ymax\":{},\"fromDate\":\"\\\"{}\\\"\",\"toDate\":\"\\\"{}\\\"\"}}&spatialRel=esriSpatialRelIntersects&outFields=*",xmin,xmax,ymin,ymax,from_date,to_date))?
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
                            block_number: x["attributes"]["Blocknumber"].as_str().and_then(|s| s.parse::<i32>().ok()).expect("Not a valid i32"),
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
            }

            xmin += 2000.0;
            requests_made += 1;
            println!("{}/{} ({:.2}%)",requests_made,requests_needed,((requests_made as f32)/(requests_needed as f32)) * 100 as f32);
        }
        ymin += 2000.0;
    }
    println!("{}",requests_needed);
    
    Ok(())
}