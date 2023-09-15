interface EmulatorProps {
    name: string;
}

function Emulator({ name }: EmulatorProps): React.ReactElement {
    return (
        <form id={name}>
            <div>
                <label htmlFor="host">Host:</label>
                <input type="text" id="host" name="host" placeholder="host" />
            </div>
            <div>
                <label htmlFor="port">Port:</label>
                <input type="text" id="port" name="port" placeholder="port" />
            </div>
            <button type="submit">Connect</button>            
        </form>
    )
}

export default Emulator;
