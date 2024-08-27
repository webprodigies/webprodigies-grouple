"use client"
import { HtmlParser } from "@/components/global/html-parser"
import { Loader } from "@/components/global/loader"
import BlockTextEditor from "@/components/global/rich-text-editor"
import { NoResult } from "@/components/global/search/no-results"
import { Button } from "@/components/ui/button"
import { useGroupAbout, useGroupInfo } from "@/hooks/groups"
import MediaGallery from "./gallery"

type Props = { userid: string; groupid: string }

const AboutGroup = ({ groupid, userid }: Props) => {
  const { group } = useGroupInfo()
  const {
    setJsonDescription,
    setOnDescription,
    onDescription,
    onJsonDescription,
    errors,
    onEditDescription,
    editor,
    activeMedia,
    onSetActiveMedia,
    onUpdateDescription,
    isPending,
    setOnHtmlDescription,
  } = useGroupAbout(
    group.description,
    group.jsonDescription,
    group.htmlDescription,
    group.gallery[0],
    groupid,
  )

  if (!group)
    return (
      <div>
        <NoResult />
      </div>
    )

  return (
    <div className="flex flex-col gap-y-10">
      <div>
        <h2 className="font-bold text-[56px] leading-none md:leading-normal">
          {group.name}
        </h2>
      </div>
      {group.gallery.length > 0 && (
        <div className="relative rounded-xl">
          <div className="img--overlay absolute h-2/6 bottom-0 w-full z-50" />
          {activeMedia?.type === "IMAGE" ? (
            <img
              src={`https://ucarecdn.com/${activeMedia.url}/`}
              alt="group-img"
              className="w-full aspect-video z-20 rounded-t-xl"
            />
          ) : activeMedia?.type === "LOOM" ? (
            <div className="w-full aspect-video">
              <iframe
                src={activeMedia.url}
                allowFullScreen
                className="absolute outline-none border-0 top-0 left-0 w-full h-full rounded-t-xl"
              ></iframe>
            </div>
          ) : (
            activeMedia?.type === "YOUTUBE" && (
              <div className="w-full aspect-video relative">
                <iframe
                  className="w-full absolute top-0 left-0 h-full rounded-xl"
                  src={activeMedia.url}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            )
          )}
        </div>
      )}
      <MediaGallery
        groupid={groupid}
        gallery={group.gallery}
        onActive={onSetActiveMedia}
        userid={userid}
        groupUserid={group.userId}
      />
      {userid !== group.userId ? (
        <HtmlParser html={group.htmlDescription || "<></>"} />
      ) : (
        <form
          ref={editor}
          onSubmit={onUpdateDescription}
          className="mt-5 flex flex-col"
        >
          <BlockTextEditor
            onEdit={onEditDescription}
            max={10000}
            inline
            min={100}
            disabled={userid === group.userId ? false : true}
            name="jsondescription"
            errors={errors}
            setContent={setJsonDescription}
            content={onJsonDescription}
            htmlContent={group.htmlDescription as string | undefined}
            setHtmlContent={setOnHtmlDescription}
            textContent={onDescription}
            setTextContent={setOnDescription}
          />
          {onEditDescription && (
            <Button
              className="self-end bg-themeBlack border-themeGray px-10"
              variant={"outline"}
              disabled={isPending}
              type="submit"
            >
              <Loader loading={isPending}>Update</Loader>
            </Button>
          )}
        </form>
      )}
    </div>
  )
}

export default AboutGroup
