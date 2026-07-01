import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import axios from 'axios';
import { Model } from 'mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeapiResponse } from './interfaces/pokeapi-response.interface';

@Injectable()
export class SeedService {
  constructor(@InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>) {}

  async execute() {
    await this.pokemonModel.deleteMany();

    const response = await axios.get<PokeapiResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemons = response.data.results.map((pokemon) => {
      const idNumber = Number(pokemon.url.split('/').at(-2));

      return {
        idNumber,
        name: pokemon.name,
      };
    });

    await this.pokemonModel.insertMany(pokemons);

    return 'SEED EXECUTED';
  }
}
