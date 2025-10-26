import { TWebContent } from "../types/flow";

const placeholderImage =
  "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";

function escapeHTML(str: string) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[
        tag
      ]!)
  );
}

// Generate HTML from Tavily response
export function generateHTML({
  res,
  timestamp,
  title,
}: {
  res: TWebContent[];
  timestamp: Date;
  title?: string | null;
}): string {
  const newsHTML = res
    .map(
      (item) => `
     <div class="card">
      <section class="img-container">
        <img
          src="${item.image_url || placeholderImage}"
          alt=""
        />
      </section>
      <section class="content" style="flex-direction: column; gap: 7px">
        <h1>${item.title}</h1>
        <article>
          ${item.content}
        </article>
        <a target="_blank" href="${item.url}"
          ><span> Read full article </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            width="24"
            height="24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14 3h7v7m0-7L10 14M5 10v10h10"
            />
          </svg>
        </a>
      </section>
    </div>
    `
    )
    .join("\n");

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>News Summary</title>
     <style>
    * {
      font-family: "Geist Mono", monospace;
      font-optical-sizing: auto;
      font-style: normal;
    }
    .card {
      border-radius: 10px;
      overflow: hidden;
      width: 100%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .img-container {
      height: 200px;
      width: 100%;
    }
    .img-container > img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
    .content {
      padding: 0 15px 15px;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .content > h1 {
      font-size: large;
    }
    .content > article {
      font-size: small;
      color: rgba(0, 0, 0, 0.7);
    }
    .content > a {
      margin-top: 5px;
      font-size: smaller;
      color: cadetblue;
    }
    .content svg {
      scale: 0.7;
      transform: translateY(9px);
    }
    .template {
      max-width: 768px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 40px;
      container-type: inline-size;
      container-name: template;
    }
    .template-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .template-header > h1 {
      font-size: 30px;
    }
    .template-header > p {
      font-size: smaller;
      color: rgba(0, 0, 0, 0.7);
    }
    @container template (max-width: 650px) {
      .template-container {
        grid-template-columns: 1fr;
      }
    }
    @media (prefers-color-scheme: dark) {
      body {
        background-color: black;
      }
      .card {
        border-color: rgba(255, 255, 255, 0.3);
      }
      .template-header > p {
        color: rgba(255, 255, 255, 0.7);
      }
      h1 {
        color: white;
      }
      .content > article {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  </style>
  </head> 
  <body>
    <div class="template" style="flex-direction: column; gap: 40px">
      <section class="template-header">
        <h1>${title}</h1>
        <p>created at ${timestamp.toDateString()}</p>
      </section>
      <section class="template-container">
        ${newsHTML}
      </section>
    </div>
  </body>
</html>
`;
}
