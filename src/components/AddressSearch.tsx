import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AutocompleteChangeReason } from '@material-ui/lab/useAutocomplete/useAutocomplete';

interface Response {
    results: Address[];
    status: string;
}

interface Address {
    kind: string;
    city: string;
    zipcode: string;
    street: string;
    fulltext: string;
    classification: number;
    country: string;
    x: number;
    y: number;
}

interface AddressSearchProps {
    onAddressSelected: (address: Address) => any;
}

export default function AddressSearch(props: AddressSearchProps) {
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<Address[]>([]);

    React.useEffect(() => {
        let active = true;

        (async () => {
            const url = `https://wxs.ign.fr/an7nvfzojv5wa96dsga5nk8w/ols/apis/completion?gp-access-lib=2.1.6&text=${inputValue}&type=PositionOfInterest,StreetAddress&terr&maximumResponses=5`;
            const jsonResponse = await fetch(encodeURI(url));
            const response: Response = await jsonResponse.json();
            if (active) {
                setOptions(response.results);
            }
        })();

        return () => {
            active = false;
        };
    }, [inputValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <Autocomplete
            id="asynchronous-demo"
            style={{ width: '100%' }}
            filterOptions={(x) => x}
            getOptionLabel={(option) => option.fulltext}
            options={options}
            noOptionsText="Adresse non trouvée"
            autoComplete
            onChange={(event: React.ChangeEvent<{}>, value: Address | null, reason: AutocompleteChangeReason) => {
                if (reason === 'select-option' && value) {
                    props.onAddressSelected(value);
                }
            }}
            includeInputInList
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Tapez votre adresse ici"
                    variant="outlined"
                    onChange={handleChange}
                />
            )}
        />
    );
}
