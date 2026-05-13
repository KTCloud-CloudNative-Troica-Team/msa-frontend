import InventoryService from "@services/rest-api/inventory-service"
import OrderCreate from "../OrderCreate"
import { useCallback, useMemo, useState } from "react"
import OrderService from "@services/rest-api/order-service"
import type { Inventory } from "@typedef/InventoryType"
import ProductService from "@services/rest-api/product-service"
import type { Product } from "@typedef/ProductType"

const OrderCreateContainer = () => {
  const { data: inventoryResponseData } = InventoryService.useFetchAllInventories()
  const { data: productResponseData } = ProductService.useFetchAllProducts()
  const { mutate } = OrderService.createOrder()

  const inventories = useMemo(
    () => inventoryResponseData ? inventoryResponseData.inventories : [],
    [inventoryResponseData]
  )

  const products = useMemo(
    () => productResponseData ? productResponseData.products : [],
    [productResponseData]
  )

  const productInventoriesInfo = useMemo<[Product, Inventory[]][]>(
    () => products.map(product => [
      product, inventories.filter((inventory) => inventory.productId === product.id)
    ]),
    [products, inventories]
  )

  const [selectedOrderItem, setSelectedOrderItem] = useState<[Product, Inventory, number][]>([])

  const orderListRequest = useMemo(() =>
    selectedOrderItem.map(([p, i, q]) => ({
      inventoryId: i.id,
      productId: p.id,
      skuCode: i.skuCode,
      price: p.price,
      quantity: q,
    })),
    [selectedOrderItem]
  );

  const onCreateButtonClicked = useCallback(() => {
    mutate({ items: orderListRequest })
  }, [orderListRequest])

  const addProductInventoryItem = useCallback((product: Product, inventory: Inventory) => {
    setSelectedOrderItem(prev => {
      const index = prev.findIndex(([p, i]) => i.id === inventory.id && p.id === product.id)

      if (index !== -1) return prev

      return [...prev, [product, inventory, 0]]
    })
  }, [])

  const removeProductInventoryItem = useCallback((product: Product, inventory: Inventory) => {
    setSelectedOrderItem(prev => {
      const index = prev.findIndex(([p, i]) => i.id === inventory.id && p.id === product.id)

      return prev.splice(index, 1)
    })
  }, [])

  const updateProductInventoryItemQuantity = useCallback((product: Product, inventory: Inventory, updateQuantity: number) => {
    setSelectedOrderItem(prev => {
      const index = prev.findIndex(([p, i]) => i.id === inventory.id && p.id === product.id)

      prev[index][2] += updateQuantity

      return [...prev]
    })
  }, [])

  return <OrderCreate
    productInventoriesInfo={productInventoriesInfo}
    selectedOrderItem={selectedOrderItem}
    onCreateButtonClicked={onCreateButtonClicked}
    addProductInventoryItem={addProductInventoryItem}
    removeProductInventoryItem={removeProductInventoryItem}
    updateProductInventoryItemQuantity={updateProductInventoryItemQuantity}
  />
}

export default OrderCreateContainer