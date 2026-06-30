"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";

import {
  Bold,
  Italic,
  Underline as UIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Maximize,
} from "lucide-react";



export default function RichEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Heading.configure({ levels: [1, 2, 3] }),
    ],

    content: value || '<p style="color: gray;">พิมพ์ข้อความที่นี่...</p>',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="border border-gray-300 overflow-hidden shadow-xs w-full rounded-md">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-300 p-2 bg-gray-50">
        {/* Heading dropdown */}
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val === "paragraph") {
              editor.chain().focus().setParagraph().run();
            } else {
              editor
                .chain()
                .focus()
                .toggleHeading({ level})
                .run();
            }
          }}
          value={
            editor.isActive("heading", { level: 1 })
              ? "1"
              : editor.isActive("heading", { level: 2 })
                ? "2"
                : editor.isActive("heading", { level: 3 })
                  ? "3"
                  : "paragraph"
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>

        {/* Basic formatting */}
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold
            className={`h-4 w-4 ${
              editor.isActive("bold") ? "text-blue-600" : ""
            }`}
          />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic
            className={`h-4 w-4 ${
              editor.isActive("italic") ? "text-blue-600" : ""
            }`}
          />
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UIcon
            className={`h-4 w-4 ${
              editor.isActive("underline") ? "text-blue-600" : ""
            }`}
          />
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough
            className={`h-4 w-4 ${
              editor.isActive("strike") ? "text-blue-600" : ""
            }`}
          />
        </button>

        {/* Lists */}
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List
            className={`h-4 w-4 ${
              editor.isActive("bulletList") ? "text-blue-600" : ""
            }`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered
            className={`h-4 w-4 ${
              editor.isActive("orderedList") ? "text-blue-600" : ""
            }`}
          />
        </button>

        {/* Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </button>

        {/* Quote & Code */}
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote
            className={`h-4 w-4 ${
              editor.isActive("blockquote") ? "text-blue-600" : ""
            }`}
          />
        </button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code
            className={`h-4 w-4 ${
              editor.isActive("codeBlock") ? "text-blue-600" : ""
            }`}
          />
        </button>

        {/* Link */}
        <button
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <LinkIcon
            className={`h-4 w-4 ${
              editor.isActive("link") ? "text-blue-600" : ""
            }`}
          />
        </button>

        {/* Image */}
        <button onClick={addImage}>
          <ImageIcon className="h-4 w-4" />
        </button>

        {/* Undo / Redo */}
        <button onClick={() => editor.chain().focus().undo().run()}>
          <Undo className="h-4 w-4" />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          <Redo className="h-4 w-4" />
        </button>

        {/* Fullscreen mock */}
        <button onClick={() => alert("TODO: fullscreen mode")}>
          <Maximize className="h-4 w-4" />
        </button>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="min-h-[200px] p-3 prose max-w-none focus:outline-none"
      />
    </div>
  );
}
