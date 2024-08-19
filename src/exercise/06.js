// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {useEffect, useState} from "react";

function PokemonInfo({pokemonName}) {
    // 🐨 Have state for the pokemon (null)
    console.log(pokemonName);
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!pokemonName) {
            return;
        }
        setPokemon(null);
        setError(null);
        fetchPokemon(pokemonName)
            .then(pokemonData => {
                setPokemon(pokemonData === "" ? null : pokemonData);
                console.log(pokemonData);
            })
            .catch(error => {
                setError(error);
                console.log(error);
            });
    }, [pokemonName])

    if (pokemonName === "") {
        return "Submit a pokemon"
    } else if (error !== null) {
        return (
            <div role="alert">
                There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
            </div>
        )
    }
    else if (pokemon) {
        return (<PokemonDataView pokemon={pokemon}/>)
    } else {
        return (<PokemonInfoFallback name={pokemonName}/>)
    }
}

function App() {
    const [pokemonName, setPokemonName] = React.useState('')

    function handleSubmit(newPokemonName) {
        setPokemonName(newPokemonName)
    }

    return (
        <div className="pokemon-info-app">
            <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit}/>
            <hr/>
            <div className="pokemon-info">
                <PokemonInfo pokemonName={pokemonName}/>
            </div>
        </div>
    )
}

export default App
