function setIframeMarkup(id, markup) {
  const savedTheme = localStorage.getItem('hs-clipboard-theme') || 'default';
  const savedMode = localStorage.getItem('hs_theme') || 'light';
  const iframe = document.getElementById(id);

  const parser = new DOMParser();
  const doc = parser.parseFromString(markup, "text/html");

  const links = doc.querySelectorAll('a[href="#"]');
  links.forEach((link) => link.setAttribute("target", "_parent"));

  const htmlAttributes = doc.documentElement.attributes;
  let htmlOpenTag = "<html";
  for (let attr of htmlAttributes) {
    if (attr.name === 'class' && savedMode === 'dark') {
      htmlOpenTag += ` ${attr.name}="${attr.value} dark"`;
    } else {
      htmlOpenTag += ` ${attr.name}="${attr.value}"`;
    }
  }
  if (savedTheme !== 'default') htmlOpenTag += ` data-theme="theme-${savedTheme}"`;
  htmlOpenTag += ">";

  const bodyAttributes = doc.body.attributes;
  let bodyOpenTag = "<body";
  for (let attr of bodyAttributes) {
    bodyOpenTag += ` ${attr.name}="${attr.value}"`;
  }
  bodyOpenTag += ">";

  const headContent = doc.head ? doc.head.innerHTML : "";
  const htmlContent = `
    ${doc.doctype ? "<!DOCTYPE html>\n" : ""}
    ${htmlOpenTag}
    <head>${headContent}</head>
    ${bodyOpenTag}
    ${doc.body.innerHTML}
    </body>
    </html>
  `;

  iframe.srcdoc = htmlContent;
}

function removeExclusions(markup) {
  const temp = markup.replace(
    /([ \t]*)<([^\s>]+).*?data-hs-code-exception.*?>[\s\S]*?<\/\2>/g,
    ""
  );

  return temp.replace(/^\s*$(?:\r\n?|\n)/gm, "");
}

function extractMarkup(markup) {
  const regex = /<([^\s>]+)([^>]*)data-hs-code([^>]*)>([\s\S]*?)<\/\1>/;
  const match = markup.match(regex);

  if (match) return match[0].replace(/ data-hs-code/g, "");
  else return markup;
}

// function encodeHtml(id, markup, isString = false) {
//   const code = document.getElementById(id);
//   let stringMarkup = null;

//   if (isString) {
//     stringMarkup = extractMarkup(removeExclusions(markup));
//     if (stringMarkup.includes("<html") && !stringMarkup.includes("<!DOCTYPE"))
//       stringMarkup = `<!DOCTYPE html>\n${stringMarkup}`;
//   }
//   const content = isString && stringMarkup ? stringMarkup : markup;

//   code.innerHTML = content
//     .replace(/="{/g, "='{")
//     .replace(/}"/g, "}'")
//     .replace(/="\[/g, "='[")
//     .replace(/\]"/g, "]'")
//     .replace(/[<>"]/g, function (match) {
//       switch (match) {
//         case "<":
//           return "&lt;";
//         case ">":
//           return "&gt;";
//         case '"':
//           return "&quot;";
//         default:
//           return match;
//       }
//     });
// }

function encodeHtml(id, markup, isString = false, isJsx = false) {
  const code = document.getElementById(id);
  let stringMarkup = null;

  if (isString) {
    stringMarkup = extractMarkup(removeExclusions(markup));
    if (stringMarkup.includes("<html") && !stringMarkup.includes("<!DOCTYPE"))
      stringMarkup = `<!DOCTYPE html>\n${stringMarkup}`;
  }
  let content = isString && stringMarkup ? stringMarkup : markup;

  if (isJsx) {
    const jsxMap = {
      "class": "className",
      "for": "htmlFor",
      "stroke-width": "strokeWidth",
      "stroke-linecap": "strokeLinecap",
      "stroke-linejoin": "strokeLinejoin",
      "view-box": "viewBox",
      "clip-path": "clipPath",
      "fill-rule": "fillRule",
      "stop-color": "stopColor",
      "stop-opacity": "stopOpacity",
    };

    content = content.replace(/(\b[a-z\-]+)=/gi, (match, attr) => {
      return (jsxMap[attr] || attr) + "=";
    });
  }

  code.innerHTML = content
    .replace(/="{/g, "='{")
    .replace(/}"/g, "}'")
    .replace(/="\[/g, "='[")
    .replace(/\]"/g, "]'")
    .replace(/[<>"]/g, function (match) {
      switch (match) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        default:
          return match;
      }
    });
}

function encodeHtmlEdgeCase(id, markup, isString = false) {
  const code = document.getElementById(id);
  let stringMarkup = null;

  if (isString) {
    stringMarkup = extractMarkup(removeExclusions(markup));
    if (stringMarkup.includes("<html") && !stringMarkup.includes("<!DOCTYPE"))
      stringMarkup = `<!DOCTYPE html>\n${stringMarkup}`;
  }
  const content = isString && stringMarkup ? stringMarkup : markup;

  const highlightedMarkup = Prism.highlight(
    content
      .replace(/('[^']+')/g, (match) => match.replace(/'/g, "&apos;"))
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      // Test
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      // End Test
      .replace(/="{/g, "='{")
      .replace(/}"/g, "}'")
      .replace(/="\[/g, "='[")
      .replace(/\]"/g, "]'"),
    Prism.languages.customMarkup,
    "customMarkup"
  );

  code.innerHTML = highlightedMarkup;
}
