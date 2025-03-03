use postgres::{Client, NoTls, Error};
use std::io::{self, Write};

fn main() -> Result<(), Error> {
    // Database connection string
    let connection_str = "host=localhost user=rust_user password=password dbname=crime_db";
    let mut client = Client::connect(connection_str, NoTls)?;

    // Ask user for input
    let year = read_integer("Enter the year: ");
    let crime = read_string("Enter the crime: ");
    let county = read_string("Enter the county: ");

    // Insert data into the table
    client.execute(
        "INSERT INTO crime_data (year, crime, county) VALUES ($1, $2, $3)",
        &[&year, &crime, &county],
    )?;

    println!("\nData inserted successfully!");
    println!("Year: {}, Crime: {}, County: {}", year, crime, county);

    Ok(())
}

// Function to read an integer from user input
fn read_integer(prompt: &str) -> i32 {
    loop {
        print!("{}", prompt);
        io::stdout().flush().unwrap();
        
        let mut input = String::new();
        io::stdin().read_line(&mut input).expect("Failed to read input");
        
        match input.trim().parse::<i32>() {
            Ok(num) => return num,
            Err(_) => println!("Invalid input. Please enter a valid year."),
        }
    }
}

// Function to read a string from user input
fn read_string(prompt: &str) -> String {
    print!("{}", prompt);
    io::stdout().flush().unwrap();
    
    let mut input = String::new();
    io::stdin().read_line(&mut input).expect("Failed to read input");

    input.trim().to_string() // Remove newline and return the string
}
