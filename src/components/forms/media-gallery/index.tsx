import { FormGenerator } from "@/components/global/form-generator"
import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMediaGallery } from "@/hooks/groups"
import { BadgePlus } from "@/icons"
import { ErrorMessage } from "@hookform/error-message"

type Props = {
  groupid: string
}

const MediaGalleryForm = ({ groupid }: Props) => {
  const { errors, register, onUpdateGallery, isPending } =
    useMediaGallery(groupid)

  return (
    <form onSubmit={onUpdateGallery} className="flex flex-col gap-y-3">
      <FormGenerator
        register={register}
        errors={errors}
        name="videourl"
        label="Video Link"
        placeholder="Video link..."
        inputType="input"
        type="text"
      />
      <Label className="" htmlFor="media-gallery">
        <p>or Upload and Image</p>
        <span className="border-[1px] border-dashed flex flex-col justify-center items-center py-10 my-2 hover:bg-themeGray/50 cursor-pointer border-themeGray bg-themeBlack rounded-lg gap-y-2">
          <Input
            type="file"
            className="hidden"
            id="media-gallery"
            multiple
            {...register("image")}
          />
          <BadgePlus />
          <p>Drag and drop an image</p>
        </span>
        <ErrorMessage
          errors={errors}
          name={"image"}
          render={({ message }) => (
            <p className="text-red-400 mt-2">
              {message === "Required" ? "" : message}
            </p>
          )}
        />
      </Label>
      <Button className="self-end rounded-xl" disabled={isPending}>
        <Loader loading={isPending}>Upload</Loader>
      </Button>
    </form>
  )
}

export default MediaGalleryForm
