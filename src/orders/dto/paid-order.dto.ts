import { IsString, IsUrl, IsUUID } from "class-validator";

export class PaidOrderDto {
   
    @IsString()
    stripePaymentId : string;

    @IsString()
    @IsUUID()
    nIdOrder        : string;

    @IsString()
    @IsUrl()
    receipUrl       : string;
}