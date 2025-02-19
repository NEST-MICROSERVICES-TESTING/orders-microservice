import { IsNumber, IsPositive } from "class-validator";

export class OrderItemDto {

    @IsNumber()
    @IsPositive()
    nIdProduct  : number;

    @IsNumber()
    @IsPositive()
    nQuantity   : number;

    @IsNumber()
    @IsPositive()
    nPrice      : number;
}