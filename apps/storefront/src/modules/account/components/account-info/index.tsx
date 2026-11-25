"use client"

import { useEffect, useState } from "react"
import { Badge, Button, clx } from "@modules/common/components/ui"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  "data-testid"?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    setIsOpen((previous) => !previous)
  }

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false)
    }
  }, [isSuccess])

  return (
    <div className="text-small-regular" data-testid={dataTestid}>
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="uppercase text-ui-fg-base">{label}</span>

          <div className="flex items-center flex-1 basis-0 justify-end gap-x-4">
            {typeof currentInfo === "string" ? (
              <span className="font-semibold" data-testid="current-info">
                {currentInfo}
              </span>
            ) : (
              currentInfo
            )}
          </div>
        </div>

        <div>
          <Button
            variant="secondary"
            className="w-[100px] min-h-[25px] py-1"
            onClick={handleToggle}
            type="button"
            data-testid="edit-button"
            data-active={isOpen}
          >
            {isOpen ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Success message */}
      {isSuccess && (
        <div data-testid="success-message">
          <Badge className="p-2 my-4" color="green">
            <span>{label} updated successfully</span>
          </Badge>
        </div>
      )}

      {/* Error message */}
      {isError && (
        <div data-testid="error-message">
          <Badge className="p-2 my-4" color="red">
            <span>{errorMessage}</span>
          </Badge>
        </div>
      )}

      {/* Edit form */}
      {isOpen && (
        <div className="flex flex-col gap-y-2 py-4">
          <div>{children}</div>

          <div className="flex items-center justify-end mt-2">
            <Button
              isLoading={pending}
              className="w-full small:max-w-[140px]"
              type="submit"
              data-testid="save-button"
            >
              Save changes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountInfo
