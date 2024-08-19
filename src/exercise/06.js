// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {useEffect, useState} from "react";
import {ErrorBoundary} from "react-error-boundary";

function ErrorHandle({error, resetErrorBoundary}) {
    return (
        <div role="alert">
            There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    )
}

function PokemonInfo({pokemonName}) {
    const [state, setState] = useState(
        {
            status: pokemonName ? 'pending' : 'idle',
            pokemon: null,
            error: null
        });
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
            throw state.error;
        default:
            throw new Error('This should be impossible');
    }
}

function App() {
    const [pokemonName, setPokemonName] = React.useState('')

    function handleSubmit(newPokemonName) {
        setPokemonName(newPokemonName)
    }

    function handleOnReset() {
        setPokemonName('');
    }

    return (
        <div className="pokemon-info-app">
            <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit}/>
            <hr/>
            <div className="pokemon-info">
                <ErrorBoundary key={pokemonName} FallbackComponent={ErrorHandle} onReset={handleOnReset}>
                    <PokemonInfo pokemonName={pokemonName}/>
                </ErrorBoundary>
            </div>
        </div>
    )
}

export default App
