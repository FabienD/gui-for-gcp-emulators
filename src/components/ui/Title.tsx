import { Typography } from "@mui/material";

interface TitleProps {
    title: string;
}

function Title({title}: TitleProps): React.ReactElement {
    return (
        <Typography variant="h1" className="text-2xl text-blue-900 font-bold" gutterBottom>
            {title}
        </Typography>
    );
}

export default Title;