import { Node, mergeAttributes } from "@tiptap/core"

export const Video = Node.create({
  name: "video",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,
  parseHTML() {
    return [
      {
        tag: "iframe",
      },
    ]
  },
  addAttributes() {
    return {
      src: {
        default: null,
      },
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ["iframe", mergeAttributes(HTMLAttributes)]
  },
  addNodeView() {
    return ({ editor, node }) => {
      const div = document.createElement("div")
      div.className =
        "aspect-video" + (editor.isEditable ? " cursor-pointer" : "")
      const iframe = document.createElement("iframe")
      iframe.width = "100%"
      iframe.height = "100%"
      iframe.allowFullscreen = true
      iframe.src = node.attrs.src
      div.append(iframe)
      return {
        dom: div,
      }
    }
  },
})
