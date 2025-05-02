use serde::{Deserialize, Serialize};
use warp::Filter;

#[tokio::main]
pub async fn start() {
    let test = "{'test':'true'}";
    let ucr_points = warp::get()
    .and(warp::path("api"))
    .and(warp::path("v1"))
    .and(warp::path("points"))
    .and(warp::path::end())
    .and_then(Ok(warp::reply::json(&test)));

    warp::serve(hello)
        .run(([127,0,0,1],3030))
        .await;
}