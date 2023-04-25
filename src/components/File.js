import React, { useEffect, useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
//import FileViewer from 'react-file-viewer'

export default function File({ file }) {
  const [selectedDocs, setSelectedDocs] = useState([]);
  useEffect(() => {
    setSelectedDocs(Array.from([file]));
  }, []);

  return (
    <div>
      <DocViewer
        pluginRenderers={DocViewerRenderers}
        documents={selectedDocs.map((f) => ({
          uri: window.URL.createObjectURL(f),
        }))}
        config={{
          header: {
            disableHeader: true,
            disableFileName: true,
            retainURLParams: true,
          },
        }}
      />
    </div>
  );
}
