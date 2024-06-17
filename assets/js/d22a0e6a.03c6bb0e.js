"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[184],{3827:(e,a,s)=>{s.r(a),s.d(a,{assets:()=>d,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>c});var n=s(4848),t=s(8453);const i={sidebar_position:4},o="Databases",r={id:"databases",title:"Databases",description:"The primary store of operational data in DiracX is in SQL databases managed through SQLAlchemy.",source:"@site/docs/databases.md",sourceDirName:".",slug:"/databases",permalink:"/diracx/docs/databases",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/databases.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"Configuration",permalink:"/diracx/docs/configuration"},next:{title:"Architecture of Services",permalink:"/diracx/docs/services"}},d={},c=[{value:"SQL Databases",id:"sql-databases",level:2},{value:"Connecting to SQL databases",id:"connecting-to-sql-databases",level:3},{value:"Using SQL databases",id:"using-sql-databases",level:3},{value:"API",id:"api",level:3},{value:"OpenSearch Databases",id:"opensearch-databases",level:2},{value:"Connecting to OpenSearch databases",id:"connecting-to-opensearch-databases",level:3},{value:"Using OpenSearch databases",id:"using-opensearch-databases",level:3},{value:"API",id:"api-1",level:3}];function l(e){const a={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(a.h1,{id:"databases",children:"Databases"}),"\n",(0,n.jsxs)(a.p,{children:['The primary store of operational data in DiracX is in SQL databases managed through SQLAlchemy.\nIn addition, DiracX utilizes OpenSearch (or Elasticsearch) for storing pilot logs, medium-term metadata about jobs and pilots ("Job Parameters" and "Pilot Parameters"), and optionally, for OpenTelemetry data.\nAccess to databases is managed by the ',(0,n.jsx)(a.code,{children:"diracx.dbs"})," package."]}),"\n",(0,n.jsx)(a.h2,{id:"sql-databases",children:"SQL Databases"}),"\n",(0,n.jsx)(a.p,{children:"Access to the SQL databases in DiracX is always handled through SQLAlchemy's core functionality.\nWhile the code is designed to be compatible with multiple database systems, only MySQL and MariaDB are officially supported in production deployments.\nSupport for Postgresql or other databases will be added if demand and resources are found.\nFor convenience SQLite is used for testing and development however this should never be used in production."}),"\n",(0,n.jsx)(a.h3,{id:"connecting-to-sql-databases",children:"Connecting to SQL databases"}),"\n",(0,n.jsxs)(a.p,{children:["Connections to DiracX DBs are configured using the ",(0,n.jsx)(a.a,{href:"https://docs.sqlalchemy.org/en/20/core/engines.html#database-urls",children:"SQLAlchemy connection URL format"}),".\nDiracX requires that the ",(0,n.jsx)(a.code,{children:"driver"})," part of the URL is always specified and it must refer to an async-compatible backend.\nThe value of this URL is taken from the environment vairable of the form ",(0,n.jsx)(a.code,{children:"DIRACX_DB_URL_<db-name>"}),", where ",(0,n.jsx)(a.code,{children:"<db-name>"})," is defined by the entry in the ",(0,n.jsx)(a.code,{children:"diracx.db.sql"})," entrypoint in the ",(0,n.jsx)(a.code,{children:"pyproject.toml"}),"."]}),"\n",(0,n.jsx)(a.pre,{children:(0,n.jsx)(a.code,{className:"language-bash",children:'export DIRACX_DB_URL_MYDB="mysql+aiomysql://user:pass@hostname:3306/MyDB"\n'})}),"\n",(0,n.jsx)(a.p,{children:"See the DiracX helm chart for more details about configuring access to databases."}),"\n",(0,n.jsx)(a.h3,{id:"using-sql-databases",children:"Using SQL databases"}),"\n",(0,n.jsx)(a.p,{children:"See the services/tasks documentation for details about how the database classes should be used."}),"\n",(0,n.jsx)(a.h3,{id:"api",children:"API"}),"\n",(0,n.jsx)(a.p,{children:"TODO: Document the basic API for SQL databases once things settle"}),"\n",(0,n.jsx)(a.h2,{id:"opensearch-databases",children:"OpenSearch Databases"}),"\n",(0,n.jsx)(a.p,{children:"DiracX also utilizes OpenSearch databases for storing pilot logs, medium-term metadata about jobs and pilots, and optionally, OpenTelemetry data."}),"\n",(0,n.jsx)(a.h3,{id:"connecting-to-opensearch-databases",children:"Connecting to OpenSearch databases"}),"\n",(0,n.jsxs)(a.p,{children:["Connections to OpenSearch and ElasticSearch DBs are configured through environment variables prefixed with ",(0,n.jsx)(a.code,{children:"DIRACX_OS_DB_{DB_NAME}"}),".\nThe connection parameters are defined as a JSON mapping and loaded from the environment variables.\nSee the ",(0,n.jsx)(a.a,{href:"https://opensearch.org/docs/latest/clients/python-low-level/#connecting-to-opensearch",children:"upstream documentation"})," for details about the available options."]}),"\n",(0,n.jsx)(a.pre,{children:(0,n.jsx)(a.code,{className:"language-bash",children:'DIRACX_OS_DB_MYDB=\'{"hosts": "user:pass@hostname:9200", "use_ssl": true, "verify_certs": true}\'\n'})}),"\n",(0,n.jsx)(a.h3,{id:"using-opensearch-databases",children:"Using OpenSearch databases"}),"\n",(0,n.jsxs)(a.p,{children:["To interact with OpenSearch databases, DiracX provides the ",(0,n.jsx)(a.code,{children:"BaseOSDB"})," class, which is designed to handle the lifecycle of the OpenSearch client and perform various database operations such as creating index templates, inserting documents, and querying data."]}),"\n",(0,n.jsx)(a.h3,{id:"api-1",children:"API"}),"\n",(0,n.jsx)(a.p,{children:"TODO: Document the basic API for opensearch databases once things settle"})]})}function h(e={}){const{wrapper:a}={...(0,t.R)(),...e.components};return a?(0,n.jsx)(a,{...e,children:(0,n.jsx)(l,{...e})}):l(e)}},8453:(e,a,s)=>{s.d(a,{R:()=>o,x:()=>r});var n=s(6540);const t={},i=n.createContext(t);function o(e){const a=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function r(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),n.createElement(i.Provider,{value:a},e.children)}}}]);