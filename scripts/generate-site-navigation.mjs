import { readFileSync,writeFileSync } from 'node:fs';
import { siteNavigationHtml } from '../lib/site-navigation.ts';
const file='public/engine-lab.html';let html=readFileSync(file,'utf8');
const head='<link rel="stylesheet" href="/site-experience.css" /><script src="/site-experience.js" defer></script>';
html=html.replace(/<!-- ko-head -->[\s\S]*?<!-- \/ko-head -->\n?/g,'').replace('</head>',`<!-- ko-head -->${head}<!-- /ko-head -->\n</head>`);
html=html.replace(/<!-- ko-navigation -->[\s\S]*?<!-- \/ko-navigation -->\n?/g,'').replace(/<body([^>]*)>/,`<body$1>\n<!-- ko-navigation --><div id="ko-site-shell">${siteNavigationHtml}</div><p class="ko-review">Khmer text · Not teacher-reviewed <span lang="km">មិនទាន់បានពិនិត្យដោយគ្រូ</span></p><!-- /ko-navigation -->`);
writeFileSync(file,html);
