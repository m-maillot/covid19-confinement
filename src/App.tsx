import React from 'react';
import { Circle, Map, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';
import { default as Leaflet, LatLngLiteral } from 'leaflet';

import { FormControl, Paper, Typography } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { blueGrey, green } from '@material-ui/core/colors';

import './App.css';
import AddressSearch from './components/AddressSearch';
import Legends from './components/Legends';

interface Response {
    status: string;
    wktGeometry: string; // "POLYGON ((4.852567 45.735057, 4.851924 45.735057, 4.851924 45.735496, 4.851924 45.735934, 4.851924 45.736373, 4.851924 45.736812, 4.851282 45.735496, 4.85064 45.735057, 4.849998 45.735057, 4.849998 45.735496, 4.849998 45.735934, 4.848071 45.736373, 4.847428 45.736812, 4.847428 45.73725, 4.848071 45.73725, 4.848713 45.73725, 4.849355 45.73725, 4.849355 45.739004, 4.848713 45.739443, 4.848071 45.74032, 4.847428 45.741636, 4.845501 45.742952, 4.844217 45.74339, 4.842932 45.744267, 4.84229 45.74339, 4.841648 45.74339, 4.841005 45.74339, 4.840363 45.74339, 4.840363 45.743829, 4.840363 45.744267, 4.839721 45.745145, 4.839721 45.746022, 4.840363 45.746022, 4.841005 45.748215, 4.843575 45.749969, 4.846786 45.750846, 4.847428 45.750846, 4.848071 45.750846, 4.848713 45.750846, 4.848713 45.750408, 4.849355 45.750846, 4.849998 45.750846, 4.85064 45.750846, 4.851924 45.750846, 4.852567 45.750846, 4.853209 45.750408, 4.853851 45.750408, 4.854494 45.750408, 4.855778 45.74953, 4.855778 45.749092, 4.857063 45.747776, 4.857705 45.747776, 4.858348 45.747338, 4.858348 45.746899, 4.857705 45.74646, 4.85899 45.746022, 4.859632 45.745583, 4.859632 45.745145, 4.859632 45.744706, 4.859632 45.744267, 4.859632 45.743829, 4.859632 45.74339, 4.859632 45.742952, 4.860275 45.742952, 4.860917 45.742952, 4.862201 45.741636, 4.862201 45.741197, 4.862201 45.740759, 4.861559 45.740759, 4.860917 45.740759, 4.860917 45.739443, 4.861559 45.739443, 4.861559 45.739004, 4.860917 45.738127, 4.860275 45.738127, 4.85899 45.737689, 4.856421 45.73725, 4.856421 45.736373, 4.856421 45.735934, 4.856421 45.735496, 4.855778 45.735496, 4.853851 45.734619, 4.853209 45.734619, 4.852567 45.735057))"
}

function App() {
    const parisLocation: LatLngLiteral = {
        lat: 48.866667,
        lng: 2.333333,
    };

    const [location, setLocation] = React.useState<LatLngLiteral | null>(null);
    const [polygon, setPolygon] = React.useState<Leaflet.LatLngLiteral[]>([]);

    React.useEffect(() => {
        let active = true;

        if (location) {
            (async () => {
                const url = `https://wxs.ign.fr/an7nvfzojv5wa96dsga5nk8w/isochrone/isochrone.json?gp-access-lib=2.1.6&location=${location.lng},${location.lat}&smoothing=true&holes=false&reverse=false&method=distance&distance=1000&graphName=Pieton&exclusions&srs=EPSG:4326`;
                const jsonResponse = await fetch(encodeURI(url));
                if (jsonResponse.ok) {
                    const response: Response = await jsonResponse.json();
                    const lngLatArray = response.wktGeometry
                        .split('((')[1]
                        .split(')')[0]
                        .split(',')
                        .map((lngLat) => {
                            return lngLat.trim().split(' ');
                        });
                    if (active) {
                        setPolygon(
                            lngLatArray.map((lngLat) => {
                                return { lng: Number(lngLat[0]), lat: Number(lngLat[1]) };
                            }),
                        );
                    }
                }
            })();
        }

        return () => {
            active = false;
        };
    }, [location]);

    return (
        <div className="App">
            <div className="locationInput">
                <FormControl style={{ backgroundColor: 'white', width: '50%' }}>
                    <AddressSearch
                        onAddressSelected={(address) => {
                            setLocation({
                                lat: address.y,
                                lng: address.x,
                            });
                        }}
                    />
                </FormControl>
            </div>
            <Map center={location ? location : parisLocation} zoom={13} animate={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                {location && (
                    <React.Fragment>
                        <Marker position={location}>
                            <Popup>Vous êtes ici !</Popup>
                        </Marker>
                        {polygon.length > 0 && (
                            <React.Fragment>
                                <Circle
                                    center={location}
                                    color={blueGrey[500]}
                                    fillColor={blueGrey[500]}
                                    radius={1000}
                                />
                                <Polygon color={green[500]} positions={polygon} />
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </Map>
            <div className="legend">
                <Legends />
            </div>
        </div>
    );
}

export default App;
