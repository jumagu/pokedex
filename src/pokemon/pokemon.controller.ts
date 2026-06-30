import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { PokemonService } from './pokemon.service';
import { CreatePokemonDto, UpdatePokemonDto } from './dto';

@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  // @HttpCode(HttpStatus.CREATED) // ? Custom HTTP status code
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(term, updatePokemonDto);
  }

  @Delete(':term')
  remove(@Param('term') term: string) {
    return this.pokemonService.remove(term);
  }
}
