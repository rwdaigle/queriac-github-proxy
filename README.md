# queriac-github-proxy

A Queriac proxy that serves Github repository contents as JSON.

```session
$ curl https://queriac-github-proxy.herokuapp.com/v1/zeke/queriac-commands
```

```json
{
  "_commands.js": "var basicCSV = ...",
  "a.js": "// Search Amazon\n\n/*\nSearches all of amazon.com\n*/\n\nlocation = \"http://www.amazon.com/s/ref=nb_sb_noss_2?field-keywords=\"+args.join(\" \")\n",
  "acr.js": "..."
}
```
