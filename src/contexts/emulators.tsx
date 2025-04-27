import { createContext, useState } from 'react';

export type EmulatorType = 'bigquery' | 'bigtable' | 'datastore' | 'firestore' | 'pubsub' | 'spanner';

const EmulatorConnectionCheckPath = {
  bigquery: '/bigquery/v2/projects',
  bigtable: '',
  datastore: '',
  firestore: '',
  pubsub: '',
  spanner: '',
};

export async function checkEmulatorConnection(
  type: EmulatorType,
  host: string,
  port: number,
): Promise<boolean> {
  try {
    const path: string = EmulatorConnectionCheckPath[type];
    const url: string = path ? `http://${host}:${port}${path}` : `http://${host}:${port}/`;
    
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Check if the response status is OK (200-299)
    return response.ok;
  } catch (error) {
    console.error('Error connecting to the emulator:', error);
    return false;
  }
}

export type Emulator = {
  type: EmulatorType;
  host: string;
  port: number;
  project_id: string;
  is_connected: boolean;
};

export type Emulators = Emulator[];

export type EmulatorsContextType = {
  emulators: Emulators | undefined;
  upsertEmulator: (emulator: Emulator) => void;
  isConnected: (type: EmulatorType) => boolean;
  getEmulator: (type: EmulatorType) => Emulator | undefined;
  getEmulators: () => Emulators | undefined;
};

const EmulatorsContext = createContext<EmulatorsContextType | null>(null);

function EmulatorsProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [emulators, setEmulators] = useState<Emulators>();

  const upsertEmulator = (
    emulator: Emulator,
  ): void => {
    
    const existingEmulatorIndex = emulators?.findIndex(
      item => item.type === emulator.type,
    );
    // Update the emulator if it already exists
    if (existingEmulatorIndex !== undefined && existingEmulatorIndex >= 0) {    
      const updatedEmulator = {
        ...emulators[existingEmulatorIndex],
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
        is_connected: emulator.is_connected
      };
      const updatedEmulators = [...(emulators || [])];
      updatedEmulators[existingEmulatorIndex] = updatedEmulator;
      setEmulators(updatedEmulators);
    } else {
      // Add a new emulator if it doesn't exist
      const newEmulator: Emulator = {
        type: emulator.type,
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
        is_connected: true
      };
      setEmulators([...(emulators || []), newEmulator]);
    }  
  };

  const isConnected = (type: EmulatorType): boolean => {
    emulators?.forEach(emulator => {
      if (emulator.type === type) {
        if (emulator.is_connected) {
          return true;
        }
      }
    });

    return false;
  };

  const getEmulator = (type: EmulatorType): Emulator | undefined => {
    return emulators?.find(emulator => emulator.type === type);
  };

  const getEmulators = (): Emulators | undefined => {
    return emulators;
  };

  const valueToShare = {
    emulators,
    upsertEmulator,
    isConnected,
    getEmulator,
    getEmulators,
  };

  return (
    <EmulatorsContext.Provider value={valueToShare}>
      {children}
    </EmulatorsContext.Provider>
  );
}

export { EmulatorsProvider };
export default EmulatorsContext;
