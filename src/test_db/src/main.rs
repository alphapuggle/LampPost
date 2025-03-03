use postgres::{Client, NoTls};

fn main() {
    let connection_str = "host=localhost user=rust_user password=password dbname=crime_db";
    
    let mut client = Client::connect(connection_str, NoTls).expect("Failed to connect to database");

    let year: i32 = 2023;
    let crime = String::from("Burglary");
    let county = String::from("New York");

    client.execute(
        "INSERT INTO crime_data (year, crime, county) VALUES ($1, $2, $3)",
        &[&year, &crime, &county],
    ).expect("Failed to insert data");

    println!("Data inserted successfully");
}
