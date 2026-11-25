"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"

import { Fragment, useMemo } from "react"
import ReactCountryFlag from "react-country-flag"

import { StateType } from "@lib/hooks/use-toggle-state"
import { useParams, usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({
  toggleState,
  regions,
}: CountrySelectProps) => {
  const params = useParams()
  const pathname = usePathname()

  const countryCode = (
    params.countryCode as string | undefined
  )?.toLowerCase()

  const { state, close } = toggleState

  // Menghapus kode negara dari URL saat ini
  const currentPath = countryCode
    ? pathname.replace(
        new RegExp(`^/${countryCode}(?=/|$)`),
        ""
      )
    : pathname

  // Mengambil daftar negara dari semua region
  const options = useMemo<CountryOption[]>(() => {
    return regions
      .flatMap((region) =>
        (region.countries ?? []).map((country) => ({
          country: country.iso_2?.toLowerCase() ?? "",
          region: region.id,
          label: country.display_name ?? "",
        }))
      )
      .filter(
        (option) => option.country !== "" && option.region !== ""
      )
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [regions])

  // Negara yang sedang dipilih
  const current = useMemo<CountryOption | undefined>(() => {
    return options.find(
      (option) => option.country === countryCode
    )
  }, [options, countryCode])

  // Mengubah negara
  const handleChange = async (option: CountryOption) => {
    if (!option?.country) return

    close()

    await updateRegion(option.country, currentPath)
  }

  return (
    <div>
      <Listbox
        value={current}
        onChange={handleChange}
        by="country"
      >
        

        <div className="flex relative w-full min-w-[320px]">
          <Transition
            show={state}
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute -bottom-[calc(100%-36px)] left-0 xsmall:left-auto xsmall:right-0 max-h-[442px] overflow-y-scroll z-[900] bg-white drop-shadow-md text-small-regular uppercase text-black no-scrollbar rounded-rounded w-full">
              {options.map((option) => (
                <ListboxOption
                  key={`${option.region}-${option.country}`}
                  value={option}
                  className="py-2 hover:bg-gray-200 px-3 cursor-pointer flex items-center gap-x-2"
                >
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "16px",
                      height: "16px",
                    }}
                    countryCode={option.country}
                  />

                  {option.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CountrySelect