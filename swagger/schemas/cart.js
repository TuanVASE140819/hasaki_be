/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the cart item
 *         productId:
 *           type: string
 *           description: ID of the product
 *         quantity:
 *           type: integer
 *           description: Quantity of the product in the cart
 *           minimum: 1
 *         name:
 *           type: string
 *           description: Product name
 *         price:
 *           type: number
 *           description: Product unit price
 *         image:
 *           type: string
 *           description: Product image URL
 *         subtotal:
 *           type: number
 *           description: Subtotal for this item (price * quantity)
 *
 *     CartResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         id:
 *           type: string
 *           description: Cart ID
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         total:
 *           type: number
 *           description: Total cart value
 *
 *     AddToCartRequest:
 *       type: object
 *       required:
 *         - productId
 *       properties:
 *         productId:
 *           type: string
 *           description: ID of the product to add to cart
 *         quantity:
 *           type: integer
 *           description: Quantity to add (defaults to 1)
 *           minimum: 1
 *           default: 1
 *       example:
 *         productId: "xyz789"
 *         quantity: 2
 *
 *     UpdateCartRequest:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 *           description: New quantity for the cart item
 *           minimum: 1
 *       example:
 *         quantity: 3
 *
 *     CartItemResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Product added to cart"
 *         item:
 *           $ref: '#/components/schemas/CartItem'
 *
 *     RemoveCartItemResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Item removed from cart"
 *         itemId:
 *           type: string
 *           description: ID of the removed cart item
 *         productId:
 *           type: string
 *           description: ID of the product that was removed
 */

module.exports = {};
