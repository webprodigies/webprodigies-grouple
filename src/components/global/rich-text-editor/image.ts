import { Node, mergeAttributes } from "@tiptap/core"

export const Image = Node.create({
  name: "image",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,
  parseHTML() {
    return [
      {
        tag: "img",
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
    return ["img", mergeAttributes(HTMLAttributes)]
  },
  addNodeView() {
    return ({ editor, node }) => {
      const div = document.createElement("div")
      div.className = "w-full" + (editor.isEditable ? " cursor-pointer" : "")
      const img = document.createElement("img")
      img.className = "aspect-video w-full"
      img.src = node.attrs.src
      div.append(img)
      return {
        dom: div,
      }
    }
  },
})
