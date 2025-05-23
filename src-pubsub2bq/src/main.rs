use axum::{Router, routing::get, routing::post};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(|| async { "Hey, have a message to forward to BigQuery?" }))
        .route("/setup", post(|| async { "Setup BigQuery table" }))
        .route("/insert/{bq_emulator_url}/{dataset_id}/{table_id}", post(|| async { "Insert Data in BQ" }));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
