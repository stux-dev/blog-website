
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import BlogRenderer from "./BlogRenderer";

export default function MyEditor() {
  // Create a new editor instance
  const editor = useCreateBlockNote();
 

  useEditorChange((editor)=>{
    const savedBlokcs = JSON.stringify(editor.document);
   
    console.log(savedBlokcs);
  }, editor)

  // Render the editor within a styled container
  return (
    <div className="max-w-7xl mx-auto mt-8 border-2 border-[#3C3C3C] rounded-xl shadow-sm">
      <BlockNoteView className="m-2" editor={editor} />
     
    </div>
  );
}