import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ErrorDataDto } from 'src/common/dto/errorData.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('OrdersService');

    constructor(
        @Inject('NATS_SERVICE') private readonly client: ClientProxy // 🔹 Inyecta el microservicio
    ) {
        super();
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Database Connected');
    }

    async create(createOrderDto: CreateOrderDto) {
        try {

            // 1. CONFIRMAR LOS IDS DE LOS PRODUCTOS
            const nIdProducts = createOrderDto.items.map( item => item.nIdProduct );
            const products = await firstValueFrom(
                this.client.send( { cmd: 'validate_products' }, nIdProducts )
            );

            // 2. CÁLCULOS DE LOS VALORES
            const totalAmount = createOrderDto.items.reduce( (acc, orderItem) => {

                const nPrice = products.find( 
                    (product) => product.nIdProduct === orderItem.nIdProduct
                ).nPrice;

                return acc + (nPrice * orderItem.nQuantity);
            }, 0);

            const totalItems = createOrderDto.items.reduce( (acc, orderItem) => {
                return acc + orderItem.nQuantity;
            }, 0);

            //3. CREAR UNA TRANSACCIÓN DE BASE DE DATOS
            const order = await this.order.create({
                data: {
                    nTotalAmount: totalAmount
                    ,nTotalItems: totalItems
                    ,OrderItem: {
                        createMany: {
                            data: createOrderDto.items.map( (orderItem) => ({
                                nPrice      : products.find( product => product.nIdProduct === orderItem.nIdProduct).nPrice
                                ,nIdProduct : orderItem.nIdProduct
                                ,nQuantity  : orderItem.nQuantity
                            }))
                        }
                    }
                }
                ,include: {
                    OrderItem: {
                        select: {
                            nPrice      : true
                            ,nQuantity  : true
                            ,nIdProduct : true
                        }
                    }
                }
            });

            return {
                ...order
                ,OrderItem: order.OrderItem.map( (orderItem) => ({
                    ...orderItem
                    ,name: products.find( (product) => product.nIdProduct === orderItem.nIdProduct ).sProduct
                })),
            };

        } catch (error) {
            throw new RpcException({
                status  : HttpStatus.BAD_REQUEST
                ,message: 'Check Logs'
            })
        }        
    }

    async findAll( orderPaginationDto: OrderPaginationDto ) {
        const { nPage, nLimit, sStatus } = orderPaginationDto;
        
        const nTotalPages = await this.order.count({ where: { sStatus: sStatus }});
        const nLastPage = Math.ceil( nTotalPages / nLimit );
        
        let  errorData : ErrorDataDto | null = null;
        if ( nPage > nLastPage ){
            errorData = {
                statusCode  : 400
                ,sMessage   : 'El número de página solicitado excede el límite permitido.'
            }
        }

        return {
            data: await this.order.findMany({
                skip    : ( nPage - 1 ) * nLimit
                ,take   : nLimit
                ,where  : { sStatus: sStatus }
            })
            ,metaData: {
                nTotal      : nTotalPages
                ,nPage      : nPage
                ,nLastPage  : nLastPage
            },
            ...(errorData && { errorData })
        }
    }

    async findOne(id: string) {
        const order = await this.order.findFirst({
            where: { nIdOrder: id }
            ,include: {
                OrderItem: {
                    select: {
                        nPrice      : true
                        ,nQuantity  : true
                        ,nIdProduct : true
                    }
                }
            }
        });

        if ( !order ) {
            throw new RpcException({
                status: HttpStatus.NOT_FOUND
                ,message: `Order with id #${ id } not found`
            });
        }

        const nIdProducts = order.OrderItem.map( item => item.nIdProduct );
        const products: any[] = await firstValueFrom(
            this.client.send( { cmd: 'validate_products' }, nIdProducts )
        );

        return {
            ...order
            ,OrderItem: order.OrderItem.map(  (orderItem) => ({
                ...orderItem
                ,name: products.find( (product) => product.nIdProduct === orderItem.nIdProduct ).sProduct
            }))
        };
    }

    async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto){
        const { nIdOrder, sStatus } = changeOrderStatusDto;

        const order = await this.findOne( nIdOrder );

        if ( order.sStatus === sStatus){
            return order;
        }

        return this.order.update({
            where: { nIdOrder }
            ,data: { sStatus: sStatus }
        });
    }
}
