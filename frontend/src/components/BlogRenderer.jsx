import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react'
import React from 'react'

const BlogRenderer = ({content}) => {
    const editor = useCreateBlockNote({
        initialContent : content ? JSON.parse(content) : [],
    });

    if(!editor){
        return null;
    }
  return (
    <div>
      <BlockNoteView editor={editor} editable={false}/>
    </div>
  )
}

export default BlogRenderer
