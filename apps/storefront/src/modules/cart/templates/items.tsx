import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table } from "@modules/common/components/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div>
      <div className="mb-6 flex flex-col gap-y-2">
        <p className="text-[10px] tracking-[4px] text-[#a18d72]">
          Koleksimu
        </p>
        <h1 className="font-serif text-3xl font-light md:text-4xl">
          Tas Belanja
        </h1>
      </div>
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-[10px] uppercase tracking-[3px] text-[#77746d]">
            <Table.HeaderCell className="!pl-0">Barang</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Jumlah</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Harga
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate