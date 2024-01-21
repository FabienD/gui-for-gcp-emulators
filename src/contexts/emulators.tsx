import { createContext, useState } from "react";

export type EmulatorType = {
    type: string
    is_connected?: boolean
    host: string
    port: number
    project_id: string
}

export type EmulatorContextType = {
    emulators: EmulatorType[]|null;
    saveEmulator: (emulator: EmulatorType) => void;
    removeEmulator: (type: string) => void;
    isEmulatorTypeConnected: (type: string) => boolean;
    getEmulatorByType: (type: string) => EmulatorType|undefined;
};

const EmulatorContext = createContext<EmulatorContextType|null>(null);

function EmulatorProvider({ children }: { children: React.ReactNode }): React.ReactElement {
    const [emulators, setEmulator] = useState<EmulatorType[]>([]);
    
    const saveEmulator = (emulator: EmulatorType): void => {
        const otherEmulators: EmulatorType[] = emulators.filter((e: EmulatorType) => {    
            return e.type != emulator.type;
        })

        setEmulator([...otherEmulators, emulator]);
    }

    const removeEmulator = (type: string): void => {
        const otherEmulators: EmulatorType[] = emulators.filter((e: EmulatorType) => {    
            return e.type != type;
        })

        setEmulator([...otherEmulators]);
    }

    const isEmulatorTypeConnected = (type: string): boolean => {
        let isConnected = false;

        emulators?.map((emulator: EmulatorType) => {
            if (emulator.type == type && emulator.is_connected) {
                isConnected = true;
                return;
            }
        });

        return isConnected;
    }

    const getEmulatorByType = (type: string): EmulatorType|undefined => {
        let emulator: EmulatorType | undefined;
        emulators?.map((emulatorItem: EmulatorType) => {
            if (emulatorItem.type == type) {
                emulator = emulatorItem;
                return;
            }
        });

        return emulator;
    }

    const valueToShare = {
        emulators,
        saveEmulator,
        removeEmulator,
        isEmulatorTypeConnected,
        getEmulatorByType,
    };

    return (
        <EmulatorContext.Provider value={valueToShare}>
            {children}
        </EmulatorContext.Provider>
    );
}

export { EmulatorProvider };
export default EmulatorContext;