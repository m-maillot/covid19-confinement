import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { blueGrey, green } from '@material-ui/core/colors';

export default function Legends() {
    return (
        <Paper elevation={3} style={{ padding: '10px' }}>
            <Typography variant="caption" display="block" gutterBottom style={{ textAlign: 'left' }}>
                <FiberManualRecordIcon style={{ color: green[500], verticalAlign: 'middle' }} />
                Zone piétonne fournie par IGN
            </Typography>
            <Typography variant="caption" display="block" gutterBottom style={{ textAlign: 'left' }}>
                <FiberManualRecordIcon style={{ color: blueGrey[500], verticalAlign: 'middle' }} />
                Rayon d'un kilomètre autour de l'adresse
            </Typography>
        </Paper>
    );
}
