'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var sanity = require('sanity');
var jsxRuntime = require('react/jsx-runtime');
var si = require('react-icons/si');
var ui = require('@sanity/ui');
var react = require('react');
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
  const [prompt, setPrompt] = react.useState("");
  const API_KEY = props.API_KEY;
  const [loading, setLoading] = react.useState(false);
  const [img, setImg] = react.useState("");
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
  return /* @__PURE__ */jsxRuntime.jsx(jsxRuntime.Fragment, {
    children: /* @__PURE__ */jsxRuntime.jsx(ui.Dialog, {
      id: "openai-asset-source",
      header: "Select image from Open AI",
      onClose: handleClose,
      open: true,
      width: 4,
      children: /* @__PURE__ */jsxRuntime.jsxs(ui.Stack, {
        padding: 4,
        children: [/* @__PURE__ */jsxRuntime.jsxs(ui.Flex, {
          direction: "column",
          gap: 2,
          children: [/* @__PURE__ */jsxRuntime.jsx(ui.Label, {
            children: "Enter Prompt Text"
          }), /* @__PURE__ */jsxRuntime.jsx(ui.TextInput, {
            placeholder: "Cats Driving Boat",
            value: prompt,
            onChange: handlePromptChange,
            onResize: void 0,
            onResizeCapture: void 0
          })]
        }), /* @__PURE__ */jsxRuntime.jsx(ui.Stack, {
          padding: 2
        }), loading && /* @__PURE__ */jsxRuntime.jsx(ui.Flex, {
          justify: "center",
          children: /* @__PURE__ */jsxRuntime.jsx(ui.Spinner, {
            size: 3,
            muted: true
          })
        }), img && /* @__PURE__ */jsxRuntime.jsx("img", {
          src: img,
          alt: prompt,
          width: 512,
          height: 512
        }), /* @__PURE__ */jsxRuntime.jsx(ui.Stack, {
          padding: 2
        }), /* @__PURE__ */jsxRuntime.jsxs(ui.Flex, {
          gap: 4,
          children: [!loading && /* @__PURE__ */jsxRuntime.jsx(ui.Button, {
            onClick: generateImage,
            children: "Generate"
          }), img && /* @__PURE__ */jsxRuntime.jsx(ui.Button, {
            onClick: oonfirmImage,
            children: "Confirm"
          })]
        })]
      })
    })
  });
}
function getPlugin(API_KEY) {
  const HOC = args => /* @__PURE__ */jsxRuntime.jsx(ImagePlugin, {
    ...args,
    API_KEY
  });
  const OpenAIImagePlugin = {
    name: "openAI",
    title: "Open AI Image",
    component: HOC,
    icon: si.SiOpenai
  };
  return OpenAIImagePlugin;
}
const openaiImageAsset = sanity.definePlugin(_ref => {
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
exports.openaiImageAsset = openaiImageAsset;
//# sourceMappingURL=index.js.map
