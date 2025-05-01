import { createContext, useState } from 'react';
import { SettingsType } from '../components/emulator/Settings';

export type EmulatorType = 'bigquery' | 'bigtable' | 'datastore' | 'firestore' | 'pubsub' | 'spanner';

const EmulatorsConnectionCheckPath = {
  bigquery: '/bigquery/v2/projects/${project_id}/datasets', // Use the project_id used in the emulator start command. -> see it by calling this path /bigquery/v2/projects
  bigtable: '',
  datastore: '',
  firestore: '',
  pubsub: '',
  spanner: '',
};

export async function checkEmulatorConnection(settings: SettingsType): Promise<boolean> {
  const { type, host, port, project_id } = settings;
  try {
    const path: string = EmulatorsConnectionCheckPath[type];
    // Path can content the project_id, replace it with the project_id
    const finalPath = path.replace('${project_id}', project_id);

    const url: string = path ? `http://${host}:${port}${finalPath}` : `http://${host}:${port}/`;
    
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
    if (existingEmulatorIndex !== undefined && existingEmulatorIndex >= 0 && emulators) {    
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
    const emulator = emulators?.find(emulator => emulator.type === type);
    if (emulator) {
      return emulator.is_connected
    }
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
