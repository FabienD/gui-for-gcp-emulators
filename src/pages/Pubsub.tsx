import Emulator from "../components/form/Emulator";
import Title from "../components/ui/Title";

function Pubsub(): React.ReactElement{
    return (
        <>
            <Title title="Pubsub" />
            <Emulator name="pubsub" />
        </>
    );
}

export default Pubsub;
