# Coding Style Guide

## Naming Conventions

Follow each language's respective style guides like [PEP8](https://peps.python.org/pep-0008/), [Effective Dart](https://dart.dev/effective-dart), [Microsoft C#](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions).

### Global Constants

- name with `UPPER_SNAKE_CASE`
- place at top of file after imports

### Variables & Functions

- name with `snake_case` in python, C, C++
- name with `camelCase` in JavaScript, TypeScript, Dart, C# but use `PascalCase` for C# functions
- place variables close to where they are used and do not declare a chunk of variables with different purposes at the start of a code block

### Classes

- name with `PascalCase`
- prefer to dedicate a separate file for each class

## Comments

Do not use em dashes or lengthy AI slop paragraphs in docstrings or multi-line comments. Code should be self documenting and comments should:

- follow the language's official commenting format for functions like JSDoc
- be placed after a line with complicated or redirecting code such as a function call with lots of parameters or heavy arithmetic inside an array subscript
- be placed right above non-trivial code blocks like loops with iterators that are used for multiple purposes
- describe why a group of variables are being declared or why a section of code exists that is not obvious
- be concise and not ramble
- describe parameters and return types individually
- not use full sentences or formal grammar to describe code in inline comments
- not exceed 100 characters
- not have text on the same line as `"""` in python

Sometimes comments are part of an automated documenting process, type annotation syntax, interpreter command. Do not remove these.

## Refactoring

If you see code that is being duplicated with very few changes: you should extract it into a function or variable. Avoid leaving raw literals unexplained unless they are common constants like `0`, `1`, `""`, or halving and doubling.

## Commits

- one author per commit, no `Co-Authored-By` trailers or other attribution lines
- follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/#specification) as `<type>: <what was fixed or done>` with no scope
- use the Angular types `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`
- keep the subject lowercase with no full stop and list multiple changes with commas
- the body is optional and reserved for important details like breaking changes or infrastructure config
- start the body with `BREAKING CHANGE:` when something stops working without a follow up action

```
fix: scrollbars, transitions, lag, image loading
```

```
build: move events to notion

BREAKING CHANGE: needs NOTION_SECRET and NOTION_EVENTS_DATA_SOURCE_ID set in vercel
```

## Examples

### Bad

This function has verbose comments and an asymmetric docstring. There is more comment than code violating conciseness. Line comments are written like sentences describing the line after them which bloats content size and wastes space on grammatical correctness.

```py
def fib(n: int) -> int:
    """This is a function that calculates the nth Fibonacci number.
    It uses recursion to compute the previous 2 -- except when it hits the base cases of 0 and 1."""
    # The 0th fibonacci number is 0 -- the first is 1!
    if n in (0, 1):
        # We have to return the base cases.
        return n
    # Function branches to recursive case instead.
    else:
        return fib(n - 1) + fib(n - 2)  # This is where recursion occurs.
```

### Good

The function description is concise and the inline comments are frequent enough but not verbose.

```py
def fib(n: int) -> int:
    """
    Returns nth Fibonacci number using recursion.
    """
    if n in (0, 1):
        return n  # base cases
    return fib(n - 1) + fib(n - 2)
```

## Repo Specifics

Everything above applies to any repo. Everything below is for the UMCPC website only.

### Stack

- Next.js 12 pages router, React 17, Tailwind CSS 3, deployed on Vercel
- every file in `pages/` is a route and every file in `pages/api/` is a serverless handler
- `next/image` uses the legacy `layout` and `objectFit` props and `next/font` does not exist yet

### Structure

- `components/shared/` holds components used by more than one page like icons and socials
- `lib/` holds hooks and helpers, never put them in `pages/` since that creates a route
- `public/` holds images and the JSON data for events, sponsors, resources and committee profiles
- shared URLs like socials and the UMSU join link are exported from `components/shared/Socials.js`

### Styling

- use Tailwind classes first and move reusable class groups into `styles/globals.css` with `@apply`
- use the `club-blue` scale from `tailwind.config.js` instead of raw hex
- hover effects must transition both ways, `hover:underline` and other toggled `text-decoration` cannot animate out so use `.slide-underline`
- let the page scroll instead of nesting scroll containers

### Data

- an empty `img` or `image` field means no photo and renders the fallback icon, do not add placeholder images
- a committee `img` starting with `/profiles/` is a full path so a year can reuse another year's photo
- sponsor logos come from the `logo` field in `sponsors.json`

### Commits

- Prettier runs on staged files through the husky pre-commit hook
- every commit should pass `npm run build` and leave a working site, `git reset --soft` is a tool not a workflow
- stop any running `next start` and delete `.next` before building or the build can fail with `Cannot find module for page`
