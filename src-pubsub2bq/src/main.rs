use axum::{Router, routing::post, routing::any};

// Import the insert_data function from the insert module
mod push2bq;
use push2bq::insert_data;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", any(|| async { "PubSub Proxy" }))
        .route("/pushtobq/{bq_emulator_url}/{dataset_id}/{table_id}", post(
            |axum::extract::Path((bq_emulator_url, dataset_id, table_id)), 
            axum::extract::Json(data): axum::extract::Json<String>| async move {
                // Call the insert_data function here
                match insert_data(bq_emulator_url, dataset_id, table_id, data).await {
                    Ok(_) => "Data inserted successfully".to_string(),
                    Err(e) => format!("Error inserting data: {}", e),
                }
            }
        ));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
