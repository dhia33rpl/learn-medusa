import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"

export const dynamic = "force-dynamic" // halaman cart tidak boleh di-cache

export const metadata: Metadata = {
  title: "Keranjang",
  description: "Lihat isi keranjang belanjamu",
}

export default async function Cart() {
  const cart = await retrieveCart().catch((error) => {
    console.error("[cart] gagal mengambil keranjang:", error)
    return null
  })

  const customer = await retrieveCustomer().catch(() => null)

  return <CartTemplate cart={cart} customer={customer} />
}
