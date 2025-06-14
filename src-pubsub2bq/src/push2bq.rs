
pub(crate) async fn insert_data(
    bq_emulator_url: String,
    dataset_id: String,
    table_id: String,
    data: String,
) -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();

    let url = format!("{}/bigquery/v2/projects/{}/datasets/{}/tables/{}/insertAll", 
                      bq_emulator_url, "your_project_id", dataset_id, table_id);

    let _response = client.post(&url)
        .header("Content-Type", "application/json")
        .body(data)
        .send()
        .await?;
    if !_response.status().is_success() {
        return Err(format!(
            "Failed to insert data into BigQuery: status {}",
            _response.status()
        ).into());
    }
    // Return the response content
    let response_text = _response.text().await?;
    println!("Response from BigQuery: {}", response_text);
    Ok(())
}