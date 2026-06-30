import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

/**
 * This pipe was created for learning purposes, to demonstrate how custom pipes are created in Nest.
 * Although it works, it shouldn't be used because it doesn't account for all validation scenarios.
 *
 * Instead, use ParseObjectIdPipe from `@nestjs/mongoose`
 */
@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is not a valid Mongo ID.`);
    }

    return value;
  }
}
