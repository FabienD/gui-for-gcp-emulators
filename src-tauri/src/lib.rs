// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use std::net::TcpStream;

#[tauri::command]
fn check_connection(host: String, port: usize) -> bool {
    let addr = format!("{}:{}", host, port.to_string());
    match TcpStream::connect(addr) {
        Ok(_) => true,
        Err(_) => false,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![check_connection])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
