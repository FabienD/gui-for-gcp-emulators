import Emulator from "../components/form/Emulator";
import PageTitle from "../components/ui/PageTitle";

function Pubsub(): React.ReactElement{
    return (
        <>
            <PageTitle>Pubsub</PageTitle>
            <Emulator name="pubsub" />
        </>
    );
}

export default Pubsub;
