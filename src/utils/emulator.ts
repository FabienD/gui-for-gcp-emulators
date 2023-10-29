import { useContext } from "react";
import EmulatorContext, { EmulatorContextType, EmulatorType } from "../contexts/emulators";

export function isEmuluatorTypeConnected(emulatorType: String) : boolean {
    const { emulators } = useContext(EmulatorContext) as EmulatorContextType;

    let isConnected = false;

    emulators?.map((emulator: EmulatorType) => {
        if (emulator.type == emulatorType && emulator.is_connected) {
            isConnected = true;
            return;
        }
    });

    return isConnected;
}

export function getEmulatorByType(emulatorType: String) : EmulatorType | undefined {
    const { emulators } = useContext(EmulatorContext) as EmulatorContextType;
    
    let emulator: EmulatorType | undefined;

    emulators?.map((emulatorItem: EmulatorType) => {
        if (emulatorItem.type == emulatorType) {
            emulator = emulatorItem;
            return;
        }
    });

    return emulator;
}