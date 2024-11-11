import { IPackage } from "../app/modules/package/package.interface";
import stripe from "../config/stripe";

export const createSubscriptionProduct = async ( payload: Partial<IPackage>): Promise<{ productId: string; paymentLink: string } | null> => {

    // Create Product in Stripe
    const product = await stripe.products.create({
        name: payload.title as string,
        description: payload.description as string,
    });

    // Validate interval for Stripe Price API
    const duration: 'month' | 'year' =
        payload.duration === 'month' ||
            payload.duration === 'year' ? payload.duration : 'month'; // Default to 'month' if not provided

    // Create Price for the Product
    const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Number(payload.price) * 100, // in cents
        currency: 'usd', // or your chosen currency
        recurring: { interval: duration }, // e.g., 'month', 'year'
    });

    // Create a Payment Link
    const paymentLink = await stripe.paymentLinks.create({
        line_items: [
            {
                price: price.id,
                quantity: 1,
            },
        ],
    });

    return { productId: product.id, paymentLink: paymentLink.url };
};