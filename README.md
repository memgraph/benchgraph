# benchgraph

Benchgraph is now hosted on the vercel memgraph.com site as github pages was giving us weird issues

To deploy a new version:

(1) Build as normal (npm run build:deploy)

(2) Edit the resulting html

All the files are hosted from /benchgraph, so the references to the font, css file and scripts need to be changed by adding /benchgraph/ to the link. For example:

```
<style>@charset "UTF-8";@font-face{font-family:Roboto;font-style:normal;font-weight:400;src:url(/benchgraph/Roboto-Regular.83f6acca8a27a93c.ttf) format("truetype")}html{font-family:sans-serif;line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}html{box-sizing:border-box;font-size:16px}*,:after,:before{box-sizing:inherit}body{margin:0;padding:0;background:#e6e6e6;font-family:Roboto,Arial,sans-serif;font-weight:400;line-height:1.5;color:#231f20;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media print{*{background:0 0!important;box-shadow:none!important;color:#000!important;text-shadow:none!important}@page{margin:.5cm}}body,html{margin:0;height:100%;background-color:#fff}</style><link rel="stylesheet" href="/benchgraph/styles.1c5f6be87e1d8d7e.css" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="/benchgraph/styles.1c5f6be87e1d8d7e.css"></noscript></head>
<body>
  <app-root></app-root>
<script src="/benchgraph/runtime.34774b385d4b3365.js" type="module"></script><script src="/benchgraph/polyfills.3a6db06d89447d6c.js" type="module"></script><script src="/benchgraph/main.43c3420642207ca1.js" type="module"></script>
```

(3) Copy the files to the worldwideweb project

The live benchgraph files are located in https://github.com/memgraph/worldwideweb/ in the https://github.com/memgraph/worldwideweb/tree/main/public/benchgraph folder. Copy the files there and have someone with vercel team access build and deploy the new version
