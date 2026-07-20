<p align = "center" draggable="false" ><img src="https://github.com/AI-Maker-Space/LLM-Dev-101/assets/37101144/d1343317-fa2f-41e1-8af1-1dbb18399719"
     width="200px"
     height="auto"/>
</p>

<h1 align="center" id="heading">Session 11: Claude Code & the Claude Agent SDK</h1>

| 📰 Session Sheet | ⏺️ Recording | 🖼️ Slides | 👨‍💻 Repo | 📝 Homework | 📁 Feedback |
|:-----------------|:-------------|:----------|:----------|:------------|:------------|
| [Session 11: Claude Code & Claude Agent SDK ](https://github.com/AI-Maker-Space/The-AI-Engineering-Certification-v1.0/tree/main/00_Docs/Modules/11_Claude_Code) |[Recording!](https://us02web.zoom.us/rec/share/2I5HA6DwVFgmtyjPaq1SJDgkaVEuYZoWYyMCK8DOAZ99Zm6f7dTi0IGONXj6mRel.YHFzKF03mI5v6JAM) <br> passcode: `&Qhi!cf0`| [Session 11 Slides](https://canva.link/uw1cl42x84tm6zh) |You are here! <br><br> [Certification Challenge](https://github.com/AI-Maker-Space/The-AI-Engineering-Certification-v1.0/tree/main/00_Docs/Certification%20Challenge) | [Optional Session 11 Assignment](https://forms.gle/sAyr5BgBLTfgJV8EA) <br><br>  [Cert Challenge Submission Form](https://forms.gle/xtM9F38nfRKcdjH97)| [Feedback 7/7](https://forms.gle/oDrguLDNvva65mtM8) |

## Useful Resources

**Claude Code**
- [Claude Code Documentation](https://code.claude.com/docs) — official docs: setup, workflows, settings
- [Claude Code Quickstart](https://code.claude.com/docs/en/quickstart) — from install to first session
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) — Anthropic engineering guide

**Claude Agent SDK**
- [Agent SDK Overview](https://docs.anthropic.com/en/api/agent-sdk/overview) — what the SDK is and when to use it
- [Building Agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk) — Anthropic engineering deep dive

## Main Assignment

**Build a chat web app powered by the Claude Agent SDK** — and build it *with* Claude Code.

This session is markdown-only on purpose. There is no starter code and no notebook: every line of code in your final app will be written in collaboration with Claude Code. The session has one build arc across a single breakout room:

```text
you → Claude Code → chat app skeleton → wire in Agent SDK query()
      (FastAPI + chat UI, echo stub)      ├─ tools: Read / Glob / Grep
                                           └─ your custom tool
```

The finished product: a **codebase concierge** — a chat interface in the browser where an agent (with real tools) answers questions about any repository you point it at. In Session 10 you served models behind endpoints; today you serve an *agent* behind one.

Work through the three guides in order:

```text
01_Installing_Claude_Code.md   # install, authenticate, verify
02_Using_Claude_Code.md        # drive Claude Code; scaffold the chat app skeleton
03_Claude_Agent_SDK.md         # add the agent and connect it to your website
```

## Outline

### Breakout Room #1: Claude Code, the Agent SDK, and the Connection

- Task 1: Install Claude Code and authenticate ([guide](./01_Installing_Claude_Code.md))
- Task 2: Learn the loop — explore a repo you didn't write ([guide](./02_Using_Claude_Code.md))
- Task 3: Scaffold the chat app skeleton with Claude Code (plan → implement → verify)
- Task 4: Write the project's `CLAUDE.md`
- Question #1 and Question #2
- Task 5: Install the Agent SDK and run your first `query()` ([guide](./03_Claude_Agent_SDK.md))
- Task 6: Wire the agent into `/api/chat` — replace the echo stub
- Task 7: Conversation memory — resume sessions across messages
- Task 8: Give the agent a custom tool
- Question #3 and Question #4
- Activity #1: Level Up the Chat App

## Questions

### ❓ Question #1

While scaffolding in Task 3 you used **plan mode** before letting Claude Code write anything. Why does an agent that can execute shell commands need a permission system at all, and why is plan mode particularly valuable when starting a project from an empty directory?

#### ✅ Answer

Because the agent isnt just suggesting commands, its actually able to run them on my machine. Read a file, sure, but also delete one, overwrite something, push to a remote. Once a model can touch the shell a bad guess isnt a wrong sentence, its a real side effect I have to go clean up.

The permission system is what keeps a human in the loop before anything irreversible happens. It lets the agent move fast on the safe stuff and stop to ask on the stuff that actually changes state.

Plan mode matters most at the start because thats exactly when the agent knows the least. Empty directory, no code to read, its basically guessing at what I want. If it just started writing files off that guess I'd end up with a pile of structure I never asked for and have to unwind.

So plan mode makes it lay the whole approach out first, no writes, and I get to catch the wrong assumption while its still just words instead of files on disk. Its a lot cheaper to fix a plan than to fix a repo the agent already scaffolded wrong.

### ❓ Question #2

`CLAUDE.md` is loaded into context at the start of every session. What belongs in it — and what *doesn't*? How does this relate to what you learned about context management and memory in Session 3?

#### ✅ Answer

CLAUDE.md is the stuff I want the agent to know every single session without me retyping it. Project conventions, how the code is laid out, the command to run the tests, the rules I actually care about like keep comments minimal. Durable facts about the project that dont change day to day.

What doesnt belong is anything one-off or that goes stale fast. The task I'm on right now, notes about a specific bug, a giant dump of the whole codebase. That either belongs in the actual prompt or it just rots and starts lying to the agent a week later.

The Session 3 connection is that context is a budget, not free space. CLAUDE.md gets loaded into the window on every session, so every line I put in there is permanent rent against the context I have left for the real work.

So its the same tradeoff as agent memory, you keep the small set of durable things worth carrying every turn and let everything else stay out of the window until its actually needed. Stuffing it full doesnt make the agent smarter, it just crowds out room for the task.

### ❓ Question #3

The Agent SDK gives you the same agent loop that powers Claude Code. Compare this to the agent loops you hand-built with LangGraph in Sessions 2–4: what does the SDK give you for free, and what control do you give up?

#### ✅ Answer

The SDK hands me the whole agent loop that runs Claude Code. The model calls a tool, the tool runs, the result goes back, it decides the next step, and all that looping and context management is already done. Same with the built in tools like Read, Glob, and Grep, and the permission handling. In LangGraph I was wiring all of that myself, the nodes, the edges, the state, deciding when the loop even ends.

So what I get for free is basically the entire harness. I write a prompt and my one custom tool and the loop just works, which is a lot less code than the graphs I built back in sessions 2 through 4.

What I give up is control over the middle. With LangGraph I could see every node and force the exact path, drop in a step, branch on a condition, inspect the state between hops. The SDK loop is more of a black box, the model picks the order and I steer it through the prompt and the tool allowlist instead of hard wiring the flow.

Its the usual tradeoff. LangGraph when I need to own the exact control flow, the SDK when I just want a capable agent running and dont feel like rebuilding the loop. For a chat app answering questions about a repo the SDK is the easy call, I dont need a custom graph for that.

### ❓ Question #4

Your chat app could have called a chat completions API directly, the way you did early in the course. What do you gain by routing every message through the Agent SDK's `query()` instead — and what new risks does an agent with tools introduce that a plain chat completion doesn't have? How did your tool allowlist and permission mode address them?

#### ✅ Answer

A plain chat completion can only talk. It reads what I gave it and writes text back, thats the whole range. Routing through query() means the agent can actually go get what it needs, read the files, grep the repo, run its own steps, before it answers. So for a codebase concierge the answers are grounded in the real repo instead of whatever the model happens to remember about it.

The catch is the same thing that makes it useful. A plain completion cant do anything to my machine, worst case it says something wrong. An agent with tools can read files it shouldnt, or get talked into running something bad if a prompt injection sneaks in through a file it reads.

The allowlist handles the first part. I only give it the tools the job actually needs, Read, Glob, Grep, my custom one, and nothing that writes or deletes. So even if it decides to do something dumb, the tools to cause real damage just arent on the table.

Permission mode handles the rest, the stuff thats not obviously safe stops and asks me before it runs instead of just going. Between the two its the same idea as the MCP server back in Session 8, dont trust the model to behave, scope what its even able to do and keep a human on the irreversible stuff.

## Activity 1: Level Up the Chat App

Extend your working chat app with **at least one** of the following (built with Claude Code, of course):

1. **Live progress streaming** — stream the agent's activity to the browser (e.g. via Server-Sent Events) so users see tool calls ("reading `app.py`…") while the agent works, instead of a spinner
2. **Multi-conversation support** — a sidebar of separate conversations, each mapped to its own SDK session
3. **A second custom tool** — something genuinely useful for your target repo (e.g. `git_log` for recent changes, or a test-runner summary tool)

Whichever you pick, demo it in your Loom video and explain the design decision in one paragraph.

## Advanced Activity: The Cat Shop Concierge

Connect your Session 8 cat shop MCP server to your chat app's agent via the SDK's `mcp_servers` option. Your chat app becomes a shopping concierge: users can browse the catalog, fill a cart, and check out — in natural language, through the UI you built, hitting the OAuth-protected server you wrote in Session 8.

Include your findings and a demo in your Loom video.

## Ship 🚢

The working chat app!

### Deliverables

- A short Loom showing:
  - Claude Code scaffolding or extending the app (plan → implement → verify — show the plan!); and
  - the chat app answering real questions about a repository, including at least one visible custom-tool use

## Share 🚀

Make a social media post about your final application!

### Deliverables

- Make a post on any social media platform about what you built!

Here's a template to get you started:

```
🚀 Exciting News! 🚀

I am thrilled to announce that I have just built and shipped a chat app powered by the Claude Agent SDK — scaffolded entirely with Claude Code! 🎉🤖

🔍 Three Key Takeaways:
1️⃣
2️⃣
3️⃣

Let's continue pushing the boundaries of what's possible in the world of AI agents. Here's to many more innovations! 🚀
Shout out to @AIMakerspace !

#ClaudeCode #AgentSDK #AIAgents #Innovation #AI #TechMilestone

Feel free to reach out if you're curious or would like to collaborate on similar projects! 🤝🔥
```

## Submitting Your Homework (Optional For Extra Mark)

Follow these steps to prepare and submit your homework:

1. Pull the latest updates from upstream into the main branch of your repo:

```bash
git checkout main
git pull upstream main
git push origin main
```

2. Work through `01_Installing_Claude_Code.md`, `02_Using_Claude_Code.md`, and `03_Claude_Agent_SDK.md` in order.
3. Build your chat app in a new `chat-app/` folder inside this session directory (include its `CLAUDE.md` — we want to see it!).
4. Fill in your answers to Questions #1–#4 in this README.
5. Complete Activity #1 and record your Loom video.
6. Add, commit, and push your work to your origin repository. Remove `.env` files and API keys before committing.

When submitting your homework, provide the GitHub URL to your repo.
