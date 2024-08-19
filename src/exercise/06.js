// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {useEffect, useState} from "react";

function ErrorBoundary({error, resetKeys, children}) {
    if (error) {
        return (
            <div role="alert">
                There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
                <button onClick={resetKeys}>Try again</button>
            </div>
        )
    }
    return children;
}

function PokemonInfo({pokemonName}) {
    const [state, setState] = useState({status: 'idle', pokemon: null, error: null});
    useEffect(() => {
        if (!pokemonName) {
            return;
        }
        setState({status: 'pending', pokemon: null, error: null});
        fetchPokemon(pokemonName)
            .then(pokemonData => {
                setState({status: 'resolved', pokemon: pokemonData, error: null});
            })
            .catch(error => {
                setState({status: 'rejected', pokemon: null, error: error});
            });
    }, [pokemonName])

    switch (state.status) {
        case 'idle':
            return "Submit a pokemon";
        case 'pending':
            return <PokemonInfoFallback name={pokemonName}/>;
        case 'resolved':
            return <PokemonDataView pokemon={state.pokemon}/>;
        case 'rejected':
            return (
                <div role="alert">
                    There was an error: <pre style={{whiteSpace: 'normal'}}>{state.error.message}</pre>
                </div>
            )
        default:
            throw new Error('This should be impossible');
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
