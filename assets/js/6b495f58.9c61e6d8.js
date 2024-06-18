"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[956],{482:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>s,default:()=>h,frontMatter:()=>r,metadata:()=>a,toc:()=>l});var t=i(4848),c=i(8453);const r={sidebar_position:2},s="Client",a={id:"client",title:"Client",description:"Overview",source:"@site/docs/client.md",sourceDirName:".",slug:"/client",permalink:"/diracx/docs/client",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Introduction",permalink:"/diracx/docs/intro"},next:{title:"Configuration",permalink:"/diracx/docs/configuration"}},d={},l=[{value:"Overview",id:"overview",level:2},{value:"diracx-client",id:"diracx-client",level:2},{value:"Generating a Client",id:"generating-a-client",level:3},{value:"Updating the Client",id:"updating-the-client",level:3},{value:"Structure of the Generated Client",id:"structure-of-the-generated-client",level:3},{value:"Customising the Generated Client",id:"customising-the-generated-client",level:3},{value:"Example Usage",id:"example-usage",level:4},{value:"Configuring the Generated Client",id:"configuring-the-generated-client",level:3},{value:"Configuring a client",id:"configuring-a-client",level:3},{value:"Getting preferences",id:"getting-preferences",level:3},{value:"diracx-api",id:"diracx-api",level:2},{value:"API Methods",id:"api-methods",level:3},{value:"Example",id:"example",level:4},{value:"diracx-cli",id:"diracx-cli",level:2},{value:"CLI Commands",id:"cli-commands",level:3},{value:"Example",id:"example-1",level:4},{value:"Associating Commands and Subcommands",id:"associating-commands-and-subcommands",level:3}];function o(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,c.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"client",children:"Client"}),"\n",(0,t.jsx)(n.h2,{id:"overview",children:"Overview"}),"\n",(0,t.jsx)(n.p,{children:"The DiracX client is a comprehensive toolset designed to interact with various services. It consists of three main components:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{children:"\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 client \u2502\n\u2514\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2518\n  \u250c\u2500\u2500\u25bc\u2500\u2500\u2510\n  \u2502 api \u2502\n  \u2514\u2500\u2500\u252c\u2500\u2500\u2518\n  \u250c\u2500\u2500\u25bc\u2500\u2500\u2510\n  \u2502 cli \u2502\n  \u2514\u2500\u2500\u2500\u2500\u2500\u2518\n"})}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"diracx-client"}),": A client library generated from OpenAPI specifications."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"diracx-api"}),": A Python API to interact with services using the diracx-client."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"diracx-cli"}),": A command-line interface for direct interaction with the services."]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"diracx-client",children:"diracx-client"}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"diracx-client"})," is an auto-generated client library that facilitates communication with services defined by OpenAPI specifications."]}),"\n",(0,t.jsx)(n.h3,{id:"generating-a-client",children:"Generating a Client"}),"\n",(0,t.jsxs)(n.p,{children:["The client is generated using ",(0,t.jsx)(n.a,{href:"https://github.com/Azure/autorest",children:"AutoRest"}),", a tool that reads OpenAPI configurations provided by FastAPI routers."]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"Breaking Changes"}),": Each time there is a breaking change in a router, the client needs to be regenerated."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"updating-the-client",children:"Updating the Client"}),"\n",(0,t.jsxs)(n.p,{children:["The CI/CD pipeline handles client regeneration upon each push to the ",(0,t.jsx)(n.code,{children:"main"})," branch. This process helps detect breaking changes in the developer's code, causing the CI/CD to fail if such changes are present."]}),"\n",(0,t.jsxs)(n.p,{children:["If a breaking change is acknowledged and approved, one of the repo admin will regenerate the client on behalf of the developer. Developers can still manually regenerate the client but it requires a few additional tools. The best up-to-date documentation lies in the ",(0,t.jsxs)(n.a,{href:"https://github.com/DIRACGrid/diracx/blob/main/.github/workflows/main.yml",children:[(0,t.jsx)(n.code,{children:"client-generation"})," CI job"]}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"structure-of-the-generated-client",children:"Structure of the Generated Client"}),"\n",(0,t.jsx)(n.p,{children:"The generated client consists of several key components:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"models"}),": Represent the data structures."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"operations"}),": Contain the methods to interact with the API endpoints."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.strong,{children:"aio"}),": Asynchronous client."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Further details can be found in the ",(0,t.jsx)(n.a,{href:"https://github.com/Azure/autorest.python/blob/main/docs/client/readme.md",children:"Python Autorest documentation"}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"customising-the-generated-client",children:"Customising the Generated Client"}),"\n",(0,t.jsxs)(n.p,{children:["Modifications to the generated client should be made in ",(0,t.jsx)(n.code,{children:"_patch.py"})," files to ensure maintainability. Detailed guidance can be found in ",(0,t.jsx)(n.a,{href:"https://github.com/Azure/autorest.python/blob/main/docs/customizations.md",children:"Python Autorest documentation"}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["Note: any modification in the synchronous client should also be performed in the asynchronous client (",(0,t.jsx)(n.strong,{children:"aio"}),"), and vice-versa."]}),"\n",(0,t.jsx)(n.h4,{id:"example-usage",children:"Example Usage"}),"\n",(0,t.jsxs)(n.p,{children:["Operations are accessible via the ",(0,t.jsx)(n.code,{children:"DiracClient"}),", which manages token refreshment:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-python",children:"from diracx.client.aio import DiracClient\n\nasync with DiracClient() as client:\n    jobs = await client.jobs.submit_bulk_jobs([x.read() for x in jdl])\n"})}),"\n",(0,t.jsx)(n.h3,{id:"configuring-the-generated-client",children:"Configuring the Generated Client"}),"\n",(0,t.jsxs)(n.p,{children:["Clients need to be configured to interact with services. This is performed through ",(0,t.jsx)(n.strong,{children:"DiracxPreferences"}),", which is a ",(0,t.jsx)(n.a,{href:"https://docs.pydantic.dev/latest/concepts/pydantic_settings/",children:"BaseSettings Pydantic model"})," that load configuration from the environment."]}),"\n",(0,t.jsx)(n.h3,{id:"configuring-a-client",children:"Configuring a client"}),"\n",(0,t.jsx)(n.p,{children:"Required environment variables to interact with the services:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"DIRACX_URL"}),": the URL pointing to diracx services"]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"DIRACX_CA_PATH"}),": CA path used by the diracx services"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Optional environment variables:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"DIRACX_OUTPUT_FORMAT"}),": output format (e.g. ",(0,t.jsx)(n.code,{children:"JSON"}),"). Default value depends whether the output stream is associated to a terminal."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"DIRACX_LOG_LEVEL"}),": logging level (e.g. ",(0,t.jsx)(n.code,{children:"ERROR"}),"). Defaults to ",(0,t.jsx)(n.code,{children:"INFO"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:"DIRACX_CREDENTIALS_PATH"}),": path where access and refresh tokens are stored. Defaults to ",(0,t.jsx)(n.code,{children:"~/.cache/diracx/credentials.json"}),"."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"getting-preferences",children:"Getting preferences"}),"\n",(0,t.jsx)(n.p,{children:"Developers can get access to the preferences through the following method:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-python",children:"from diracx.core.preferences import get_diracx_preferences\n\n...\n\ncredentials_path = get_diracx_preferences().credentials_path\n"})}),"\n",(0,t.jsx)(n.p,{children:"Note: preferences are cached."}),"\n",(0,t.jsx)(n.h2,{id:"diracx-api",children:"diracx-api"}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"diracx-api"})," provides a Python API for interacting with services, leveraging the ",(0,t.jsx)(n.code,{children:"diracx-client"}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"api-methods",children:"API Methods"}),"\n",(0,t.jsxs)(n.p,{children:["API methods are located in ",(0,t.jsx)(n.code,{children:"diracx-api/src/diracx/api/"}),". To create an API method:"]}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Import ",(0,t.jsx)(n.code,{children:"DiracClient"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["Decorate the method with ",(0,t.jsx)(n.code,{children:"@with_client"})," to handle client configuration."]}),"\n",(0,t.jsxs)(n.li,{children:["Pass the ",(0,t.jsx)(n.code,{children:"client"})," as a keyword argument."]}),"\n"]}),"\n",(0,t.jsx)(n.h4,{id:"example",children:"Example"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-python",children:"from diracx.client.aio import DiracClient\nfrom .utils import with_client\n\n@with_client\nasync def create_sandbox(paths: list[Path], *, client: DiracClient) -> str:\n    ...\n"})}),"\n",(0,t.jsxs)(n.p,{children:["In this example, ",(0,t.jsx)(n.code,{children:"paths"})," are the parameters of the API. The ",(0,t.jsx)(n.code,{children:"@with_client"})," decorator allows the method to be called without manually managing the client:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-python",children:"# Managed by @with_client\n# Useful for basic work requiring a single call to the service\nresult = await create_sandbox(paths)\n\n# For optimised performance with multiple service interactions\nasync with DiracClient() as client:\n    result = await create_sandbox(paths, client)\n"})}),"\n",(0,t.jsx)(n.h2,{id:"diracx-cli",children:"diracx-cli"}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"diracx-cli"})," is a command-line interface built on ",(0,t.jsx)(n.code,{children:"diracx-client"})," and ",(0,t.jsx)(n.code,{children:"diracx-api"})," for direct interaction with services. It uses ",(0,t.jsx)(n.a,{href:"https://typer.tiangolo.com/",children:"Typer"})," for creating CLI commands and ",(0,t.jsx)(n.a,{href:"https://rich.readthedocs.io/",children:"Rich"})," for enhanced content display."]}),"\n",(0,t.jsx)(n.h3,{id:"cli-commands",children:"CLI Commands"}),"\n",(0,t.jsxs)(n.p,{children:["CLI commands are located in ",(0,t.jsx)(n.code,{children:"diracx-cli/src/diracx/cli/"}),". To create a CLI command:"]}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["Import ",(0,t.jsx)(n.code,{children:"DiracClient"})," and/or the diracx API."]}),"\n",(0,t.jsxs)(n.li,{children:["Import ",(0,t.jsx)(n.code,{children:"utils.AsyncTyper"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["Use the ",(0,t.jsx)(n.code,{children:"@app.async_command"})," decorator to define commands."]}),"\n"]}),"\n",(0,t.jsx)(n.h4,{id:"example-1",children:"Example"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-python",children:"from .utils import AsyncTyper\nfrom diracx.client.aio import DiracClient\n\napp = AsyncTyper()\n\n@app.async_command()\nasync def submit(jdl: list[FileText]):\n    async with DiracClient() as client:\n        ...\n"})}),"\n",(0,t.jsxs)(n.p,{children:["For more details on Typer and Rich options, refer to their ",(0,t.jsx)(n.a,{href:"https://typer.tiangolo.com/",children:"Typer documentation"})," and ",(0,t.jsx)(n.a,{href:"https://rich.readthedocs.io/",children:"Rich documentation"}),"."]}),"\n",(0,t.jsx)(n.h3,{id:"associating-commands-and-subcommands",children:"Associating Commands and Subcommands"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Commands without subcommands (e.g., ",(0,t.jsx)(n.code,{children:"dirac login"}),") should be implemented directly in ",(0,t.jsx)(n.code,{children:"src/diracx/__init__.py"})," and decorated with ",(0,t.jsx)(n.code,{children:"app.async_command()"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["Commands with subcommands (e.g., ",(0,t.jsx)(n.code,{children:"dirac jobs submit"}),") should have their own modules in ",(0,t.jsx)(n.code,{children:"src/diracx/<command>"})," and use ",(0,t.jsx)(n.code,{children:"AsyncTyper"}),"."]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["To associate the command with ",(0,t.jsx)(n.code,{children:"dirac"}),", import the module in ",(0,t.jsx)(n.code,{children:"src/diracx/__init__.py"}),":"]}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-python",children:'from . import <command>\n...\n\napp.add_typer(<command name>.app, name="<command name>")\n'})}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Users can then call the CLI:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-sh",children:"$ dirac <command>\n$ dirac <command> <subcommand> [--options]\n"})})]})}function h(e={}){const{wrapper:n}={...(0,c.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(o,{...e})}):o(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>s,x:()=>a});var t=i(6540);const c={},r=t.createContext(c);function s(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:s(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);