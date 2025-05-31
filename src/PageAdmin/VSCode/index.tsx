import React from 'react';
import { useRef, useState } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import {
  CODE_SNIPPETS,
  GETCODE_CODE_SNIPPETS,
} from '../../Common/Feature/constants';
import { Editor } from '@monaco-editor/react';
import Output from '../../Common/Component/Ouput/Ouput';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import LanguageSelector from '../../Common/Component/LanguageSelector/LanguageSelector';
import './index.css';
const style = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});
const VsCode: React.FC<{}> = () => {
  const editorRef = useRef();
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [data, setData] = useState('');

  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language: string) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language as keyof typeof CODE_SNIPPETS]);
  };
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log(params.get('isOpen'));
    if (!params.get('isOpen') || params.get('isOpen') !== 'true') {
      window.location.href = '/';
    }
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      console.log('event.data.myCustomKey', event.data.myCustomKey);
      if (event.data.myCustomKey) {
        console.log('✅ My app data received:', event.data);
        setData(event.data.data);
        setValue(
          GETCODE_CODE_SNIPPETS(
            language as keyof typeof CODE_SNIPPETS,
            event.data.data
          )
        );
      } else {
        // window.close();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  return (
    <ChakraProvider theme={style}>
      <Box
        minH="100vh"
        minW="100vw"
        bg="#0f0a19"
        color="gray.500"
        px={6}
        py={8}
      >
        <HStack wordSpacing={4}>
          <Box w="50%">
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
              options={{
                minimap: {
                  enabled: false,
                },
              }}
              height="75vh"
              theme="vs-dark"
              language={language}
              defaultValue={GETCODE_CODE_SNIPPETS(
                language as keyof typeof CODE_SNIPPETS,
                data
              )}
              onMount={onMount}
              value={value}
              onChange={(value) => {
                if (value !== undefined) {
                  setValue(value);
                }
              }}
            />
          </Box>
          <Output editorRef={editorRef} language={language} />
        </HStack>
      </Box>
    </ChakraProvider>
  );
};

export default VsCode;
