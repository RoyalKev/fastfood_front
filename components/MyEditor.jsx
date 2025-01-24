import dynamic from 'next/dynamic';

// Importation dynamique de CKEditor uniquement côté client
const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then((mod) => mod.CKEditor), { ssr: false });
const ClassicEditor = dynamic(() => import('@ckeditor/ckeditor5-build-classic'), { ssr: false });

const MyEditor = ({ data, onChange }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
};

export default MyEditor;