import { OrderStatus } from "@prisma/client";

export interface OrderWithProducts {
    OrderItem: {
        sName: any;
        nIdProduct: number;
        nQuantity: number;
        nPrice: number;
    }[];
    nIdOrder: string;
    nTotalAmount: number;
    nTotalItems: number;
    sStatus: OrderStatus;
    bPaid: boolean;
    dPaidAt: Date | null;
    dCreatedAt: Date;
    dUpdatedAt: Date;
}