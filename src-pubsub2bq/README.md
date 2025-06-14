# PubSub Emulator Extended

This application extends the features of the Google Cloud Pub/Sub emulator by adding two main components:

## 1. Pub/Sub Proxy

This proxy intercepts communications with the Pub/Sub emulator and:

- **Fills a major gap** in the standard emulator: handling BigQuery subscriptions
- **Automates the process** when creating a BigQuery subscription:
  - Detects if the Pub/Sub topic has a schema or if the table exists in the (unofficial) BigQuery emulator.
    - If the topic has a schema and the table does not exist,
      - Automatically creates a corresponding BigQuery table with the appropriate structure.
  - Converts the subscription to Push mode towards the dedicated endpoint
- **Full transparency** for all other Pub/Sub requests, ensuring compatibility

## 2. Pub/Sub to BigQuery Endpoint

This component:

- Provides a **dedicated HTTP endpoint** for BigQuery subscriptions converted to push mode.
- **Processes and inserts** messages into BigQuery via the BigQuery API.

## How it works

```mermaid
flowchart TD
    %% Zones
    subgraph Client[Client]
        A[Client application]
    end
    subgraph Extension[PubSub Emulator Extended]
        B[Pub/Sub Proxy]
        C[Endpoint PubSub → BigQuery]
    end
    subgraph Emulators[GCP Emulators]
        D[PubSub Emulator]
        E[BigQuery Emulator]
    end

    %% Flow 1: Standard requests (blue)
    A -- "1. Standard Pub/Sub request" --> B
    B -- "2. Forwards to PubSub Emulator" --> D
    D -- "3. Standard response" --> B
    B -- "4. Response" --> A

    %% Flow 2: BigQuery subscription creation (green)
    A -- "5. Create BigQuery subscription" --> B
    B -- "6. Checks schema" --> D
    B -- "7. Creates table if needed" --> E
    B -- "8. Converts to Push subscription" --> D

    %% Flow 3: Message publishing (orange)
    A -- "9. Publish message" --> B
    B -- "10. Forwards to PubSub Emulator" --> D
    D -- "11. Push message" --> C
    C -- "12. Insert into BigQuery" --> E

    %% Legend
    classDef flow1 stroke:#2986cc,stroke-width:2px;
    classDef flow2 stroke:#3cb371,stroke-width:2px;
    classDef flow3 stroke:#ff9900,stroke-width:2px;
    class A,B,D flow1;
    class A,B,E,D flow2;
    class A,B,D,C,E flow3;
```
