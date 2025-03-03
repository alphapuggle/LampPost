use postgres::{Client, NoTls, Error};
use std::collections::HashMap;

struct CrimeRecord {
    year: i32,
    crime: String,
    county: String,
}

fn main() -> Result<(), Error> {
    let connection_str = "host=localhost user=rust_user password=password dbname=crime_db";
    let mut client = Client::connect(connection_str, NoTls)?;

    // Simulated scraped data stored in a HashMap
    let mut crime_data = HashMap::new();
    crime_data.insert("Burglary", ("Indiana", 2023));
    crime_data.insert("Robbery", ("Cambria", 2022));
    crime_data.insert("Assault", ("IUP", 2021));

    // Insert data into the database
    for (crime, (county, year)) in &crime_data {
        let record = CrimeRecord {
            year: *year,
            crime: crime.to_string(),
            county: county.to_string(),
        };

        client.execute(
            "INSERT INTO crime_data (year, crime, county) VALUES ($1, $2, $3)",
            &[&record.year, &record.crime, &record.county],
        )?;
    }

    println!("Crime data inserted successfully.");

    // Display the table
    println!("Fetching stored crime records...");
    for row in client.query("SELECT year, crime, county FROM crime_data", &[])? {
        let record = CrimeRecord {
            year: row.get(0),
            crime: row.get(1),
            county: row.get(2),
        };
        println!("{} - {} in {}", record.year, record.crime, record.county);
    }

    Ok(())
}
