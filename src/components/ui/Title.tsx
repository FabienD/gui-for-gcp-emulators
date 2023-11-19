import React from "react";

import { Typography } from "@mui/material";

type TitleProps = {
    title: string,
    icon: string,
}

function Title({title, icon}: TitleProps): React.ReactElement {
    return (
        <Typography variant="h1" gutterBottom>
            <img src={icon} className="w-5 h-5 inline mb-1" alt={title} /> {title}
        </Typography>
    )
}

export default Title;