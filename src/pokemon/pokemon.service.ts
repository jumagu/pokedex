import {
  Injectable,
  HttpException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { isValidObjectId, Model } from 'mongoose';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto, UpdatePokemonDto } from './dto';

@Injectable()
export class PokemonService {
  constructor(@InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleMongooseError(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null;

    if (!isNaN(+term)) {
      // Search by number
      pokemon = await this.pokemonModel.findOne({ idNumber: +term });
    } else if (isValidObjectId(term)) {
      // Search by Mongo ID
      pokemon = await this.pokemonModel.findById(term);
    } else {
      // Search by name
      pokemon = await this.pokemonModel.findOne({ name: term });
    }

    if (pokemon === null) {
      throw new NotFoundException(`Pokemon with id, name or number '${term}' not found.`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const updatedPokemon = await this.pokemonModel.findOneAndUpdate(
        {
          $or: [
            { idNumber: !isNaN(+term) ? +term : undefined },
            { _id: isValidObjectId(term) ? term : undefined },
            { name: term },
          ],
        },
        updatePokemonDto,
        { returnDocument: 'after' },
      );

      if (updatedPokemon === null) {
        throw new NotFoundException(`Pokemon with id, name or number '${term}' not found.`);
      }

      return updatedPokemon;
    } catch (error) {
      this.handleMongooseError(error);
    }
  }

  async remove(term: string) {
    try {
      const pokemon = await this.pokemonModel.findOneAndDelete({
        $or: [
          { idNumber: !isNaN(+term) ? +term : undefined },
          { _id: isValidObjectId(term) ? term : undefined },
          { name: term },
        ],
      });

      if (pokemon === null) {
        throw new NotFoundException(`Pokemon with id, name or number '${term}' not found.`);
      }

      return {
        ok: true,
        message: 'Pokemon successfully deleted.',
      };
    } catch (error) {
      this.handleMongooseError(error);
    }
  }

  private handleMongooseError(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(`A pokemon with ${JSON.stringify(error.keyValue)} already exists.`);
    }

    if (error instanceof HttpException) throw error;

    throw new InternalServerErrorException('The record could not be created. Please contact the administrator.');
  }
}
