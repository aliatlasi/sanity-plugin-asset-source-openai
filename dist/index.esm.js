import { definePlugin } from 'sanity';
import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { SiOpenai } from 'react-icons/si';
import { Dialog, Stack, Flex, Label, TextInput, Spinner, Button } from '@sanity/ui';
import { useState } from 'react';
async function fetchImage(prompt, API_KEY) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer ".concat(API_KEY));
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    prompt,
    model: "dall-e-3",
    n: 1,
    size: "1024x1024",
    // eslint-disable-next-line camelcase
    response_format: "b64_json"
  });
  const response = await (await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  })).json();
  return response.data;
}
function ImagePlugin(props) {
  const [prompt, setPrompt] = useState("");
  const API_KEY = props.API_KEY;
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState("");
  async function generateImage() {
    setLoading(true);
    const image = await fetchImage(prompt, API_KEY);
    const newImageValue = "data:image/png;base64,".concat(image[0].b64_json);
    setImg(newImageValue);
    setLoading(false);
  }
  function oonfirmImage() {
    const asset = {
      kind: "url",
      value: img,
      assetDocumentProps: {
        _type: "sanity.imageAsset",
        description: prompt
      }
    };
    props.onSelect([asset]);
  }
  function handleClose() {
    props.onClose();
  }
  function handlePromptChange(event) {
    setPrompt(event.target.value);
  }
  return /* @__PURE__ */jsx(Fragment, {
    children: /* @__PURE__ */jsx(Dialog, {
      id: "openai-asset-source",
      header: "Select image from Open AI",
      onClose: handleClose,
      open: true,
      width: 4,
      children: /* @__PURE__ */jsxs(Stack, {
        padding: 4,
        children: [/* @__PURE__ */jsxs(Flex, {
          direction: "column",
          gap: 2,
          children: [/* @__PURE__ */jsx(Label, {
            children: "Enter Prompt Text"
          }), /* @__PURE__ */jsx(TextInput, {
            placeholder: "Cats Driving Boat",
            value: prompt,
            onChange: handlePromptChange,
            onResize: void 0,
            onResizeCapture: void 0
          })]
        }), /* @__PURE__ */jsx(Stack, {
          padding: 2
        }), loading && /* @__PURE__ */jsx(Flex, {
          justify: "center",
          children: /* @__PURE__ */jsx(Spinner, {
            size: 3,
            muted: true
          })
        }), img && /* @__PURE__ */jsx("img", {
          src: img,
          alt: prompt,
          width: 512,
          height: 512
        }), /* @__PURE__ */jsx(Stack, {
          padding: 2
        }), /* @__PURE__ */jsxs(Flex, {
          gap: 4,
          children: [!loading && /* @__PURE__ */jsx(Button, {
            onClick: generateImage,
            children: "Generate"
          }), img && /* @__PURE__ */jsx(Button, {
            onClick: oonfirmImage,
            children: "Confirm"
          })]
        })]
      })
    })
  });
}
function getPlugin(API_KEY) {
  const HOC = args => /* @__PURE__ */jsx(ImagePlugin, {
    ...args,
    API_KEY
  });
  const OpenAIImagePlugin = {
    name: "openAI",
    title: "Open AI Image",
    component: HOC,
    icon: SiOpenai
  };
  return OpenAIImagePlugin;
}
const openaiImageAsset = definePlugin(_ref => {
  let {
    API_KEY
  } = _ref;
  return {
    name: "Open AI Image",
    form: {
      image: {
        assetSources: prev => {
          const OpenAIImagePlugin = getPlugin(API_KEY);
          return [...prev, OpenAIImagePlugin];
        }
      }
    }
  };
});
export { openaiImageAsset };
//# sourceMappingURL=index.esm.js.map
