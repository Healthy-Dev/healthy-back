import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCardDto {
   @IsNotEmpty({message: "Healthy Dev te pide que no dejes el título vacío"})
   title: string;

   @IsNotEmpty({message: "Healthy Dev te pide que no dejes la descripción vacía."})
   description: string;

   @IsOptional()
   photo: string;

   @IsOptional()
   externalUrl: string;
}