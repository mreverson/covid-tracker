import React from 'react';
import '../css/infobox.css';
import { Card, CardContent, Typography} from '@material-ui/core';
import { prettyPrintStat } from "../_helpers"


function InfoBox({title,country, cases, active, isRed, total, ...props}) {
    return (
        <Card className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--isRed'}`} onClick={props.onClick}>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">
                    {title} - {country}
                </Typography>

                <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>{prettyPrintStat(cases)} - Today</h2>
                
                <Typography className="infoBox__total" color="textSecondary">
                    {prettyPrintStat(total)} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
