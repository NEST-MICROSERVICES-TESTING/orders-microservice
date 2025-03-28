import { Type } from "class-transformer";
import { IsOptional, IsPositive, IsString } from "class-validator";

export class ErrorDataDto {
    
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    statusCode: number;      // Código de estado (ej. 400, 404, 500)

    @IsString()
    @IsOptional()
    sMessage: string;   // Mensaje descriptivo del error
}