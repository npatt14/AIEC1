# Advanced Activity: Custom MCP Client and MCP vs REST

## What the client does

`client.py` is a standalone MCP client. It talks to the Cat Shop server over
Streamable HTTP, authenticates with OAuth, and lets a LangChain agent run a full
shopping flow without me wiring up any endpoint by hand.

The interesting part is how little code each capability takes.

- Transport and auth are configuration, not plumbing. `MultiServerMCPClient` gets
  a `transport: "streamable_http"`, a URL, and an `auth` object. `OAuthClientProvider`
  runs the whole OAuth dance for me. Dynamic client registration, the PKCE
  authorization code grant, the browser redirect, and refresh tokens.
- Tools are discovered at runtime. `await mcp_client.get_tools()` returns all six
  Cat Shop tools as LangChain tools. The client never hardcodes a tool name, a
  parameter, or a response shape.
- The agent picks the tool. `create_agent` gets the discovered tools and a system
  prompt. When I ask "add two catnip mice," the model chooses `add_to_cart` on its
  own. I wrote zero per tool glue.

## The proof, from this build

When we added `clear_cart` to the server, the client picked it up automatically.
No edit to `client.py`. Next run, `clear_cart` showed up in the loaded tool list
and the agent could call it.

That is the whole argument for MCP in one observation. The server is the single
source of truth for what tools exist and how they are called. Clients stay thin.

## What the REST version would have cost

Hitting the same shop as a plain REST API, I would have written all of this by hand.

- One block of request code per endpoint. URL, method, params, JSON parsing,
  error handling, repeated six times.
- The OAuth flow myself. Register the client, build the authorize URL, generate
  the PKCE challenge, stand up a callback listener, exchange the code at `/token`,
  store the tokens, refresh them when they expire.
- A function schema per endpoint so the model knows how to call it. Then keep
  every schema in sync with the server by hand. Drift here is a silent bug. The
  model calls a tool with a parameter the server quietly renamed and the call
  fails at runtime.
- An edit to the client every time the server grows a tool. `clear_cart` would
  have meant new request code plus a new schema plus a redeploy.

## Where REST still wins

MCP is not free. It adds a transport spec and an auth spec on top of the server,
and standing that up locally meant ngrok plus matching `ISSUER_URL` to the public
URL. For a single private endpoint with one known caller, that is more ceremony
than the job needs. Plain REST is less to reason about.

MCP earns its keep when there are several tools, more than one client, or tools
that change over time. That is exactly the case here, and it is why adding a tool
cost one function on the server and nothing on the client.

## Bottom line

REST makes me describe every tool twice. Once in the server and once again in
the client so the model can call it. MCP describes them once and ships that
description over the wire. The client discovers tools instead of being taught
them. For an agent that calls a changing set of tools, that difference is the
whole game.
