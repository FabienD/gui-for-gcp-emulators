import { createContext, useState } from "react";

export type EmulatorType = {
    type: string;
    is_connected?: boolean;
    host: string;
    port: number;
}

export type EmulatorContextType = {
    emulators: EmulatorType[]|null;
    saveEmulator: (emulator: EmulatorType) => void;
    removeEmulator: (type: string) => void;
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

    const valueToShare = {
        emulators,
        saveEmulator,
        removeEmulator,
    };

    return (
        <EmulatorContext.Provider value={valueToShare}>
            {children}
        </EmulatorContext.Provider>
    );
}

export { EmulatorProvider };
export default EmulatorContext;