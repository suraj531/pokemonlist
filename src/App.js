import React, { useState, useEffect } from "react";
import axios from "axios";

const PokeAPI = "https://pokeapi.co/api/v2/";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${PokeAPI}pokemon?limit=20`).then((response) => {
      setPokemonList(response.data.results);
      setNextUrl(response.data.next);
      setLoading(false);
    });
  }, []);

  const loadMore = () => {
    axios.get(nextUrl).then((response) => {
      setPokemonList([...pokemonList, ...response.data.results]);
      setNextUrl(response.data.next);
    });
  };

  const selectPokemon = (name) => {
    setLoading(true);
    axios.get(`${PokeAPI}pokemon/${name}`).then((response) => {
      setSelectedPokemon(response.data);
      setLoading(false);
    });
  };

  const PokemonCard = ({ name }) => {
    return (
      <div onClick={() => selectPokemon(name)}>
        <p>{name}</p>
      </div>
    );
  };

  const PokemonDetails = ({ pokemon }) => {
    return (
      <div>
        <h2>{pokemon.name}</h2>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        <p>Type: {pokemon.types.map((type) => type.type.name).join(", ")}</p>
        <p>Height: {pokemon.height}</p>
        <p>Weight: {pokemon.weight}</p>
      </div>
    );
  };

  return (
    <div>
      <h1>Pokemon List</h1>
      {loading && <p>Loading...</p>}
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.name} name={pokemon.name} />
      ))}
      {!loading && nextUrl && <button onClick={loadMore}>Load More</button>}
      {selectedPokemon && <PokemonDetails pokemon={selectedPokemon} />}
    </div>
  );
}

export default App;
