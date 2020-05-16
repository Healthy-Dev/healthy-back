import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCardDto {
   @IsNotEmpty()
   title: string;

   @IsNotEmpty()
   description: string;

   @IsOptional()
   photo: string;

   @IsOptional()
   externalUrl: string;
}